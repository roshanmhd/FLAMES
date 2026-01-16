import './style.css'
import { initFireBackground, setFireTheme } from './fire-animation.js';

const FLAMES_DATA = {
  'F': { title: 'Friends', meaning: 'A solid foundation of friendship.', color: '#FFD700', icon: '🤝' },
  'L': { title: 'Lovers', meaning: 'Romance is in the air!', color: '#FF69B4', icon: '❤️' },
  'A': { title: 'Affection', meaning: 'Deep care and admiration.', color: '#FFA500', icon: '💌' },
  'M': { title: 'Marriage', meaning: 'Destined to be together forever.', color: '#FF4500', icon: '💍' },
  'E': { title: 'Enemy', meaning: 'Run while you can!', color: '#DC143C', icon: '⚔️' },
  'S': { title: 'Sister', meaning: 'A bond like siblings.', color: '#FF6347', icon: '👯' }
};

document.addEventListener('DOMContentLoaded', () => {
  initFireBackground();

  const form = document.getElementById('flamesForm');
  const resultContainer = document.getElementById('result');
  const resultTitle = document.getElementById('resultTitle');
  const resultMeaning = document.getElementById('resultMeaning');
  const flameIcon = document.querySelector('.flame-icon');
  const resetBtn = document.getElementById('resetBtn');
  // History Elements
  const historyToggle = document.getElementById('historyToggle');
  const historyPanel = document.getElementById('historyPanel');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  // Load History
  let historyData = JSON.parse(localStorage.getItem('flamesHistory')) || [];
  renderHistory();

  // Event Listeners for History
  historyToggle.addEventListener('click', () => {
    historyPanel.classList.toggle('hidden');
    // Animate icon rotation
    const svg = historyToggle.querySelector('svg');
    if (historyPanel.classList.contains('hidden')) {
      svg.style.transform = 'rotate(0deg)';
      historyToggle.style.background = 'rgba(255, 255, 255, 0.1)';
      historyToggle.style.color = 'var(--text-muted)';
    } else {
      svg.style.transform = 'rotate(180deg)';
      historyToggle.style.background = 'var(--primary-glow)';
      historyToggle.style.color = 'white';
    }
  });

  clearHistoryBtn.addEventListener('click', () => {
    historyData = [];
    localStorage.removeItem('flamesHistory');
    renderHistory();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();

    if (!name1 || !name2) return;

    calculateFlames(name1, name2);
  });

  resetBtn.addEventListener('click', () => {
    setFireTheme(null); // Reset to default background
    resultContainer.classList.remove('show');
    resultContainer.classList.add('hidden');

    // Show form again
    form.style.display = 'flex';
    setTimeout(() => {
      form.style.opacity = '1';
    }, 50);

    form.reset();
  });

  function saveToHistory(n1, n2, resultChar) {
    const result = FLAMES_DATA[resultChar].title;
    const entry = { n1, n2, result, id: Date.now() };

    // Add to beginning
    historyData.unshift(entry);

    // Limit to 10
    if (historyData.length > 10) historyData.pop();

    localStorage.setItem('flamesHistory', JSON.stringify(historyData));
    renderHistory();
  }

  function renderHistory() {
    historyList.innerHTML = '';
    if (historyData.length === 0) {
      historyList.innerHTML = '<li style="text-align:center; opacity:0.5; padding: 10px;">No history yet</li>';
      return;
    }

    historyData.forEach(item => {
      const li = document.createElement('li');
      li.className = 'history-item';

      // Determine color for logic result
      let color = 'white';
      Object.values(FLAMES_DATA).forEach(val => {
        if (val.title === item.result) color = val.color;
      });

      li.innerHTML = `
        <span class="h-names">${item.n1} + ${item.n2}</span>
        <span class="h-result" style="color: ${color}">${item.result}</span>
      `;
      historyList.appendChild(li);
    });
  }

  function calculateFlames(name1, name2) {
    // 1. Sanitize
    let n1 = name1.toLowerCase().replace(/[^a-z]/g, '').split('');
    let n2 = name2.toLowerCase().replace(/[^a-z]/g, '').split('');

    // 2. Remove common characters
    for (let i = 0; i < n1.length; i++) {
      const char = n1[i];
      const indexInN2 = n2.indexOf(char);
      if (indexInN2 !== -1) {
        n1[i] = '*'; // Mark for deletion
        n2[indexInN2] = '*';
      }
    }

    n1 = n1.filter(c => c !== '*');
    n2 = n2.filter(c => c !== '*');

    const totalCount = n1.length + n2.length;

    // 3. FLAMES Logic
    let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
    let currentIndex = 0;

    // Standard game logic
    while (flames.length > 1) {
      let indexToRemove = (currentIndex + totalCount - 1) % flames.length;
      flames.splice(indexToRemove, 1);

      if (indexToRemove >= flames.length) {
        currentIndex = 0;
      } else {
        currentIndex = indexToRemove;
      }
    }

    const resultChar = flames[0];
    saveToHistory(name1, name2, resultChar);
    showResult(resultChar);
  }

  function showResult(char) {
    setFireTheme(char); // Update background theme
    const data = FLAMES_DATA[char];

    // Hide form with fade
    form.style.opacity = '0';
    setTimeout(() => {
      form.style.display = 'none';

      // Update Content
      resultTitle.textContent = data.title;
      resultTitle.style.background = data.color;
      resultTitle.style.backgroundClip = 'text';
      resultTitle.style.webkitBackgroundClip = 'text';
      resultTitle.style.color = 'transparent'; // Fallback

      resultMeaning.textContent = data.meaning;
      flameIcon.textContent = data.icon;

      // Show Result
      resultContainer.classList.remove('hidden');
      // Trigger reflow for transition
      void resultContainer.offsetWidth;
      resultContainer.classList.add('show');
    }, 300);
  }
});
