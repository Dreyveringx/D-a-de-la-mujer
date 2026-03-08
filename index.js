  // Generate falling petals
  const canvas = document.getElementById('petals');
  const emojis = ['🌸','🌹','🌷','✿','❀','💮','🌺'];

  for (let i = 0; i < 22; i++) {
    const p = document.createElement('span');
    p.classList.add('petal');
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (6 + Math.random() * 10) + 's';
    p.style.animationDelay = (Math.random() * 12) + 's';
    p.style.fontSize = (0.9 + Math.random() * 1.2) + 'rem';
    p.style.opacity = (0.3 + Math.random() * 0.5).toString();
    canvas.appendChild(p);
  }
