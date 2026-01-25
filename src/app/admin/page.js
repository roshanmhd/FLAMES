'use client';

import { useState } from 'react';
import AnimatedList from '../../components/AnimatedList';
import LetterGlitch from '../../components/LetterGlitch';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

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

    // Transform logs into renderable items for AnimatedList
    const logItems = logs.map(log => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', minWidth: '140px' }}>
                {new Date(log.timestamp).toLocaleString()}
            </span>
            <span style={{ fontWeight: '500', color: '#fff', flex: 1, textAlign: 'center' }}>
                {log.name1} <span style={{ color: '#ec4899' }}>&</span> {log.name2}
            </span>
            <span className="result-badge" style={{ marginLeft: '10px' }}>
                {log.result}
            </span>
        </div>
    ));

    if (!isAuthenticated) {
        return (
            <div className="admin-container">
                <div className="fire-background">
                    <LetterGlitch
                        glitchColors={['#2b4539', '#61dca3', '#61b3dc']}
                        glitchSpeed={50}
                        centerVignette={true}
                        outerVignette={false}
                        smooth={true}
                    />
                </div>

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
            <div className="fire-background">
                <LetterGlitch
                    glitchColors={['#2b4539', '#61dca3', '#61b3dc']}
                    glitchSpeed={50}
                    centerVignette={true}
                    outerVignette={false}
                    smooth={true}
                />
            </div>

            <div className="card admin-card logs-card animate-fade-in-up" style={{ maxWidth: '800px', padding: '20px' }}>
                <div className="admin-header">
                    <h1 className="admin-title">FLAMES Logs</h1>
                    <button onClick={fetchLogs} className="refresh-btn">
                        Refresh
                    </button>
                </div>

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
                    <div className="table-wrapper" style={{ marginTop: '20px' }}>
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
