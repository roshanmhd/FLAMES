'use client';

import { useState, useEffect } from 'react';
import FireBackground from './components/FireBackground';

const FLAMES_DATA = {
  'F': { title: 'Friends', meaning: 'A solid foundation of friendship.', color: '#FFD700', icon: '🤝' },
  'L': { title: 'Lovers', meaning: 'Romance is in the air!', color: '#FF69B4', icon: '❤️' },
  'A': { title: 'Affection', meaning: 'Deep care and admiration.', color: '#FFA500', icon: '💌' },
  'M': { title: 'Marriage', meaning: 'Destined to be together forever.', color: '#FF4500', icon: '💍' },
  'E': { title: 'Enemy', meaning: 'Run while you can!', color: '#DC143C', icon: '⚔️' },
  'S': { title: 'Sister', meaning: 'A bond like siblings.', color: '#FF6347', icon: '👯' }
};

export default function Home() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [resultChar, setResultChar] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showForm, setShowForm] = useState(true);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('flamesHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (n1, n2, rChar) => {
    const resultTitle = FLAMES_DATA[rChar].title;
    const entry = { n1, n2, result: resultTitle, id: Date.now() };
    const newHistory = [entry, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('flamesHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('flamesHistory');
  };

  const calculateFlames = (e) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) return;

    // 1. Sanitize
    let n1 = name1.toLowerCase().replace(/[^a-z]/g, '').split('');
    let n2 = name2.toLowerCase().replace(/[^a-z]/g, '').split('');

    // 2. Remove common characters
    for (let i = 0; i < n1.length; i++) {
      const char = n1[i];
      const indexInN2 = n2.indexOf(char);
      if (indexInN2 !== -1) {
        n1[i] = '*';
        n2[indexInN2] = '*';
      }
    }

    n1 = n1.filter(c => c !== '*');
    n2 = n2.filter(c => c !== '*');

    const totalCount = n1.length + n2.length;

    // 3. FLAMES Logic
    let flamesArgs = ['F', 'L', 'A', 'M', 'E', 'S'];
    let currentIndex = 0;

    // Fix for 0 count (if all chars match)? Standard flames logic usually assumes names shouldn't be identical, 
    // but if count is 0, arguably it's same name -> ? 
    // The original code loop `while (flames.length > 1)` handles 0 count by looping indefinitely if we are not careful? 
    // No, if totalCount is 0, indexToRemove = (0 + 0 - 1) = -1. Loop might break or strict modulo.
    // Original js code: indexToRemove = (currentIndex + totalCount - 1) % flames.length
    // if totalCount is 0, -1 % 6 is -1 in JS? No, -1 % 6 is -1. 
    // In JS `(-1) % 6` is `-1`. `splice(-1)` removes last element. 
    // So it works, effectively stepping back? Let's treat it as valid.

    while (flamesArgs.length > 1) {
      // In JS % of negative is negative. We probably want positive wraparound if counts are small?
      // But standard flames usually has totalCount >= 0.
      // If names are identical "amit" "amit" -> count 0.
      // `-1 % 6` = `-1`. `splice(-1, 1)` removes 'S'.
      // It seems to work.

      let indexToRemove = (currentIndex + totalCount - 1) % flamesArgs.length;
      if (indexToRemove < 0) indexToRemove += flamesArgs.length; // Correct negative modulo

      flamesArgs.splice(indexToRemove, 1);

      if (indexToRemove >= flamesArgs.length) {
        currentIndex = 0;
      } else {
        currentIndex = indexToRemove;
      }
    }

    const rChar = flamesArgs[0];
    saveToHistory(name1, name2, rChar);

    // Log the attempt
    try {
      fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name1: name1,
          name2: name2,
          result: FLAMES_DATA[rChar].title
        }),
      });
    } catch (error) {
      console.error('Failed to log:', error);
    }

    // Transition UI
    setShowForm(false);
    setTimeout(() => {
      setResultChar(rChar);
      setShowResult(true);
    }, 300); // Wait for fade out
  };

  const handleReset = () => {
    setResultChar(null);
    setShowResult(false);
    setTimeout(() => {
      setShowForm(true);
      setName1('');
      setName2('');
    }, 300);
  };

  const getResultData = () => {
    if (!resultChar) return {};
    return FLAMES_DATA[resultChar];
  };

  const { title: rTitle, meaning: rMeaning, icon: rIcon, color: rColor } = getResultData();

  return (
    <>
      <FireBackground theme={resultChar} />

      <div className="app-container">
        <main className="card">
          <header>
            <h1 className="title">
              <span className="letter f">F</span>
              <span className="letter l">L</span>
              <span className="letter a">A</span>
              <span className="letter m">M</span>
              <span className="letter e">E</span>
              <span className="letter s">S</span>
            </h1>
            <p className="subtitle">Discover the destiny of your names</p>
          </header>

          <form
            className="input-group"
            onSubmit={calculateFlames}
            style={{
              opacity: showForm ? 1 : 0,
              display: showForm ? 'flex' : 'none',
              transition: 'opacity 0.3s ease'
            }}
          >
            <div className="input-wrapper">
              <label htmlFor="name1">Your Name</label>
              <input
                type="text"
                id="name1"
                placeholder="Enter your name"
                required
                autoComplete="off"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
              />
            </div>

            <div className="middle-actions">
              <div className="icon-heart">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              <button
                type="button"
                className="history-btn"
                title="View Recent"
                onClick={() => setShowHistory(!showHistory)}
                style={{
                  background: showHistory ? 'var(--primary-glow)' : undefined,
                  color: showHistory ? 'white' : undefined
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showHistory ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className={`history-panel ${showHistory ? '' : 'hidden'}`}>
              <div className="history-header">
                <span>Recent Destinies</span>
                <button type="button" className="clear-btn" title="Clear History" onClick={clearHistory}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <ul className="history-list">
                {history.length === 0 ? (
                  <li style={{ textAlign: 'center', opacity: 0.5, padding: '10px' }}>No history yet</li>
                ) : (
                  history.map(item => {
                    // Find color
                    const match = Object.values(FLAMES_DATA).find(v => v.title === item.result);
                    const iColor = match ? match.color : 'white';

                    return (
                      <li key={item.id} className="history-item">
                        <span className="h-names">{item.n1} + {item.n2}</span>
                        <span className="h-result" style={{ color: iColor }}>{item.result}</span>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>

            <div className="input-wrapper">
              <label htmlFor="name2">Partner's Name</label>
              <input
                type="text"
                id="name2"
                placeholder="Enter partner's name"
                required
                autoComplete="off"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
              />
            </div>

            <button type="submit" className="calculate-btn">
              <span>Calculate Destiny</span>
              <div className="btn-glow"></div>
            </button>
          </form>

          <div className={`result-container ${showResult ? 'show' : ''}`}>
            {resultChar && (
              <div className="result-content">
                <div className="flame-icon">{rIcon}</div>
                <h2
                  id="resultTitle"
                  style={{
                    background: rColor,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  {rTitle}
                </h2>
                <p id="resultMeaning">{rMeaning}</p>
                <button onClick={handleReset} className="reset-btn">Check Another</button>
              </div>
            )}
          </div>
        </main>

        <footer>
          <p>Made with ❤️ by Roshan</p>
        </footer>
      </div>
    </>
  );
}
