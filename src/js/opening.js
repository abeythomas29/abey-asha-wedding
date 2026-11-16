/* Envelope entrance: an embossed envelope sealed with wax. On open, light cracks
   through the seal, it splits, the four flaps part and the hero scene shows through. */
window.createOpening = ({ monogram, names, reduced, onReveal }) => {
  const SEAL_POINTS = 48;
  const rand = (min, max) => min + Math.random() * (max - min);

  // An irregular wax outline around a circle, so the seal looks pressed by hand.
  const sealPath = () => {
    const pts = [];
    for (let i = 0; i < SEAL_POINTS; i++) {
      const a = (i / SEAL_POINTS) * Math.PI * 2;
      const r = 90 + Math.sin(a * 5) * 2.4 + Math.sin(a * 11 + 1) * 1.6 + rand(-1.4, 1.4);
      pts.push([100 + Math.cos(a) * r, 100 + Math.sin(a) * r]);
    }
    return `M${pts.map(p => p.map(n => n.toFixed(1)).join(' ')).join('L')}Z`;
  };

  const seal = `
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <radialGradient id="wax" cx="42%" cy="36%" r="70%">
          <stop offset="0" stop-color="#fffaf0"/><stop offset=".55" stop-color="#efe4cb"/><stop offset="1" stop-color="#c9b48a"/>
        </radialGradient>
        <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#e6cf94"/><stop offset=".5" stop-color="#a98445"/><stop offset="1" stop-color="#d8bd7c"/>
        </linearGradient>
        <filter id="press"><feDropShadow dx="0" dy="1.2" stdDeviation=".6" flood-color="#fff" flood-opacity=".9"/><feDropShadow dx="0" dy="-1" stdDeviation=".6" flood-color="#6b5530" flood-opacity=".45"/></filter>
        <radialGradient id="face" cx="50%" cy="42%" r="60%">
          <stop offset="0" stop-color="#f3ead6"/><stop offset="1" stop-color="#dccaa0"/>
        </radialGradient>
        <clipPath id="seal-face"><circle cx="100" cy="100" r="61"/></clipPath>
      </defs>
      <path d="${sealPath()}" fill="url(#wax)"/>
      <circle cx="100" cy="100" r="68" fill="none" stroke="#bea371" stroke-width="1.4" filter="url(#press)"/>
      <circle cx="100" cy="100" r="62" fill="none" stroke="#d9c79f" stroke-width=".8"/>
      <circle cx="100" cy="100" r="61" fill="url(#face)"/>
      <!-- AA monogram after the couple's envelope card: a green A and a gold A interlaced with a swash. -->
      <g filter="url(#press)" font-family="Cormorant Garamond, Georgia, serif" font-weight="600" font-size="78" text-anchor="middle">
        <path d="M58 132C70 114 104 98 136 92c14-3 20 6 12 16-10 13-34 22-58 26" fill="none" stroke="url(#foil)" stroke-width="2.2" stroke-linecap="round"/>
        <text x="84" y="128" fill="#2c4a37">${monogram[0]}</text>
        <text x="118" y="134" fill="url(#foil)">${monogram[1]}</text>
        <path d="M66 136c22 4 52 2 78-12" fill="none" stroke="url(#foil)" stroke-width="1.6" stroke-linecap="round"/>
      </g>
      <path d="M98.5 46h3v7h7v3h-7v9h-3v-9h-7v-3h7z" fill="url(#foil)" filter="url(#press)"/>
    </svg>`;

  const root = document.createElement('div');
  root.className = 'entrance';
  root.id = 'entrance';
  root.innerHTML = `
    <div class="envelope" role="img" aria-label="Embossed green envelope sealed with an ivory wax seal">
      <div class="inside" aria-hidden="true"></div>
      <div class="flap flap-left"></div><div class="flap flap-right"></div>
      <div class="flap flap-bottom"></div><div class="flap flap-top"></div>
      <svg class="folds" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path class="fold-shadow" d="M0 0L50 52L100 0M0 100L50 48L100 100"/>
        <path class="fold-gold" d="M0 0L50 52L100 0M0 100L50 48L100 100"/>
      </svg>
      <div class="vignette" aria-hidden="true"></div>
      <svg class="cracks" viewBox="0 0 100 178" preserveAspectRatio="none" aria-hidden="true"></svg>
      <div class="seal-glow" aria-hidden="true"></div>
      <button class="seal" id="seal-open" aria-label="Open your invitation by breaking the seal">${seal}<span class="seal-light" aria-hidden="true"></span></button>
      <div class="sparks" aria-hidden="true"></div>
      <div class="flash" aria-hidden="true"></div>
    </div>
    <button class="open-invitation" id="open"><span>Open your invitation</span><small>${names}</small></button>
    <button class="skip-opening" id="skip" hidden>Skip opening</button>`;
  document.body.prepend(root);

  const cracks = root.querySelector('.cracks');
  const sparks = root.querySelector('.sparks');
  let timers = [];
  let running = false;

  // Curling threads of light that leave the seal and trace outward like vines,
  // each with a smaller tendril branching off part-way.
  function drawCracks() {
    const cx = 50, cy = 89;
    const pt = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r * 1.7];
    const fmt = p => p.map(n => n.toFixed(2)).join(' ');
    const angles = [-160, -122, -58, -20, 22, 64, 116, 158];
    const paths = [];
    angles.forEach((deg, i) => {
      const a = (deg + rand(-6, 6)) * Math.PI / 180;
      const curl = (i % 2 ? 1 : -1) * rand(0.35, 0.6);
      const start = pt(a, 15), c1 = pt(a + curl * 0.4, 30), c2 = pt(a + curl, 46), end = pt(a + curl * 1.5, rand(52, 64));
      const delay = (i % 4) * 0.14 + rand(0, 0.12);
      paths.push(`<path d="M${fmt(start)}C${fmt(c1)} ${fmt(c2)} ${fmt(end)}" pathLength="1" style="--delay:${delay.toFixed(2)}s"/>`);
      const mid = pt(a + curl * 0.55, 34), b1 = pt(a + curl * 0.55 - curl * 0.5, 40), bEnd = pt(a + curl * 0.2 - curl, rand(44, 50));
      paths.push(`<path class="branch" d="M${fmt(mid)}Q${fmt(b1)} ${fmt(bEnd)}" pathLength="1" style="--delay:${(delay + 0.5).toFixed(2)}s"/>`);
    });
    cracks.innerHTML = paths.join('');
  }

  // Slow, small glints that drift out from the seal while the light traces.
  function burstSparks() {
    sparks.innerHTML = Array.from({ length: 34 }, () => {
      const a = rand(0, Math.PI * 2), dist = rand(40, 170);
      return `<i style="--x:${(Math.cos(a) * dist).toFixed(0)}px;--y:${(Math.sin(a) * dist * 1.3).toFixed(0)}px;--s:${rand(1.5, 4).toFixed(1)}px;--d:${rand(1.4, 2.6).toFixed(2)}s;--w:${rand(0, .8).toFixed(2)}s"></i>`;
    }).join('');
  }

  const at = (ms, fn) => timers.push(setTimeout(fn, ms));

  function finish() {
    if (!running) return;
    running = false;
    timers.forEach(clearTimeout);
    timers = [];
    root.classList.add('leaving');
    onReveal();
    at(reduced.matches ? 0 : 900, () => { root.hidden = true; });
  }

  function play() {
    if (running) return;
    running = true;
    root.querySelector('#open').disabled = true;
    if (reduced.matches) return finish();
    root.querySelector('#skip').hidden = false;
    drawCracks();
    root.classList.add('glowing');                                    // seal lights from within
    at(450, () => root.classList.add('cracking'));                    // light traces outward
    at(800, burstSparks);
    at(2200, () => root.classList.add('lifting'));                    // top flap folds back
    at(3300, () => root.classList.add('diving'));                     // move into the envelope
    at(3600, () => document.body.classList.add('scene-arriving'));    // scene settles behind
    at(4800, finish);
  }

  function reset() {
    timers.forEach(clearTimeout);
    timers = [];
    running = false;
    root.hidden = false;
    root.className = 'entrance';
    document.body.classList.remove('scene-arriving');
    root.querySelector('#skip').hidden = true;
    const open = root.querySelector('#open');
    open.disabled = false;
    open.focus();
  }

  root.querySelector('#open').addEventListener('click', play);
  root.querySelector('#seal-open').addEventListener('click', play);
  root.querySelector('#skip').addEventListener('click', finish);
  return { reset };
};
