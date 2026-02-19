'use client';

import { useState } from 'react';
import AnimatedList from '../../components/AnimatedList';


export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set()); // Track selected IDs
    const [isSelectionMode, setIsSelectionMode] = useState(false); // Toggle checkboxes

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
            fetchLogs();
        } else {
            alert('Incorrect password');
        }
    };

    const fetchLogs = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const res = await fetch('/api/log');
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch logs');
            }

            if (Array.isArray(data)) {
                setLogs(data);
                // Clear selection on refresh
                setSelectedIds(new Set());
                setIsSelectionMode(false); // Reset mode on refresh
            } else {
                console.warn('Logs data is not an array:', data);
                setLogs([]);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelection = (id) => {
        const newSelection = new Set(selectedIds);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedIds(newSelection);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = new Set(logs.map(log => log.id));
            setSelectedIds(allIds);
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) return;

        setLoading(true);
        try {
            const res = await fetch('/api/log', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: Array.from(selectedIds) }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete logs');
            }

            // Refresh logs
            fetchLogs();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete logs: ' + error.message);
            setLoading(false);
        }
    };

    // Transform logs into renderable items for AnimatedList
    const logItems = logs.map(log => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '15px' }}>
            {/* Checkbox only visible in Selection Mode */}
            {isSelectionMode && (
                <div className="animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                    <input
                        type="checkbox"
                        checked={selectedIds.has(log.id)}
                        onChange={() => toggleSelection(log.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10b981' }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', minWidth: '140px' }}>
                {new Date(log.timestamp).toLocaleString()}
            </span>
            <span style={{ fontWeight: '500', color: '#fff', flex: 1, textAlign: 'center' }}>
                {log.name1} <span style={{ color: '#10b981' }}>&</span> {log.name2}
            </span>
            <span className="result-badge" style={{ marginLeft: '10px' }}>
                {log.result}
            </span>
        </div>
    ));

    if (!isAuthenticated) {
        return (
            <div className="admin-container">


                <div className="card admin-card login-card animate-fade-in-up">
                    <h1 className="title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Admin Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <button type="submit" className="calculate-btn">
                            Login
                            <div className="btn-glow"></div>
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">


            <div className="card admin-card logs-card animate-fade-in-up" style={{ maxWidth: '800px', padding: '20px' }}>
                <div className="admin-header">
                    <h1 className="admin-title">FLAMES Logs</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {!isSelectionMode && (
                            <button
                                onClick={() => setIsSelectionMode(true)}
                                className="refresh-btn"
                                title="Delete items"
                                style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        )}
                        <button onClick={fetchLogs} className="refresh-btn">
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Bulk Actions Bar - Only visible in Selection Mode */}
                {isSelectionMode && (
                    <div className="animate-fade-in-up" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                        padding: '10px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                checked={logs.length > 0 && selectedIds.size === logs.length}
                                onChange={handleSelectAll}
                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10b981' }}
                            />
                            <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Select All ({selectedIds.size})</span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => {
                                    setIsSelectionMode(false);
                                    setSelectedIds(new Set());
                                }}
                                style={{
                                    background: 'transparent',
                                    color: '#cbd5e1',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteSelected}
                                disabled={selectedIds.size === 0}
                                style={{
                                    background: selectedIds.size > 0 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.2)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    cursor: selectedIds.size > 0 ? 'pointer' : 'not-allowed',
                                    fontSize: '0.85rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Delete ({selectedIds.size})
                            </button>
                        </div>
                    </div>
                )}

                {errorMsg && (
                    <div className="error-box animate-fade-in-up">
                        Error: {errorMsg}
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        Loading data...
                    </div>
                ) : (
                    <div className="table-wrapper" style={{ marginTop: '5px' }}>
                        {logs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                No logs found
                            </div>
                        ) : (
                            <AnimatedList
                                items={logItems}
                                showGradients={true}
                                displayScrollbar={false}
                                className="custom-animated-list"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
