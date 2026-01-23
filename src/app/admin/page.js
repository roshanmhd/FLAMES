'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple hardcoded password
        if (password === 'admin123') {
            setIsAuthenticated(true);
            fetchLogs();
        } else {
            alert('Incorrect password');
        }
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/log');
            const data = await res.json();
            setLogs(data);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Admin Login</h1>
                    <form onSubmit={handleLogin} style={styles.form}>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={{ ...styles.card, maxWidth: '800px' }}>
                <div style={styles.header}>
                    <h1 style={styles.title}>FLAMES Logs</h1>
                    <button onClick={fetchLogs} style={styles.refreshBtn}>Refresh</button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Time</th>
                                    <th style={styles.th}>Your Name</th>
                                    <th style={styles.th}>Partner Name</th>
                                    <th style={styles.th}>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={styles.td}>No logs yet</td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id}>
                                            <td style={styles.td}>{new Date(log.timestamp).toLocaleString()}</td>
                                            <td style={styles.td}>{log.name1}</td>
                                            <td style={styles.td}>{log.name2}</td>
                                            <td style={styles.td}>{log.result}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#1a1a1a',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        padding: '20px'
    },
    card: {
        background: '#2a2a2a',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        margin: '0 0 1.5rem 0',
        textAlign: 'center',
        color: '#ff6b6b'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    input: {
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #444',
        background: '#333',
        color: '#fff',
        fontSize: '1rem'
    },
    button: {
        padding: '12px',
        borderRadius: '6px',
        border: 'none',
        background: '#ff6b6b',
        color: 'white',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
    },
    refreshBtn: {
        padding: '8px 16px',
        borderRadius: '4px',
        background: '#444',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left'
    },
    th: {
        padding: '12px',
        borderBottom: '1px solid #444',
        color: '#aaa',
        fontWeight: 600
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #333',
    }
};
