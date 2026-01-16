
export function initFireBackground() {
    const container = document.getElementById('fire-background');
    if (!container) return;
    const emberCount = 30; // Fast sparks
    const fogCount = 8;    // Slow deep clouds

    // Create Embers
    for (let i = 0; i < emberCount; i++) {
        createParticle(container, 'ember');
    }
    // Create Fog
    for (let i = 0; i < fogCount; i++) {
        createParticle(container, 'fog');
    }

    // Mouse Interaction for Spotlight Effect
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        container.style.setProperty('--mouse-x', `${x}%`);
        container.style.setProperty('--mouse-y', `${y}%`);
    });
}

export function setFireTheme(char) {
    const container = document.getElementById('fire-background');
    if (!container) return;

    // Remove old theme classes
    container.classList.remove('theme-f', 'theme-l', 'theme-a', 'theme-m', 'theme-e', 'theme-s');

    // Add new theme class if char is valid
    if (char) {
        const className = `theme-${char.toLowerCase()}`;
        container.classList.add(className);
    }
}

function createParticle(container, type) {
    const particle = document.createElement('div');
    particle.classList.add('fire-particle', type);

    // Randomize initial properties
    const left = Math.random() * 100; // 0% to 100% width
    const drift = (Math.random() - 0.5) * 300 + 'px'; // Horizontal drift

    // Custom properties based on type
    let duration, delay;

    if (type === 'ember') {
        duration = Math.random() * 3 + 2; // 2-5s (Fast)
        delay = Math.random() * 5;
    } else { // Fog
        duration = Math.random() * 10 + 10; // 10-20s (Slow)
        delay = Math.random() * 10;
    }

    // Apply styles
    particle.style.left = `${left}%`;
    particle.style.setProperty('--drift', drift);
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `-${delay}s`; // Negative start

    container.appendChild(particle);

    particle.addEventListener('animationiteration', () => {
        // Randomize position for next loop
        const newLeft = Math.random() * 100;
        const newDrift = (Math.random() - 0.5) * 300 + 'px';
        particle.style.left = `${newLeft}%`;
        particle.style.setProperty('--drift', newDrift);

        // Randomize speed slightly
        if (type === 'ember') {
            particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        }
    });
}
