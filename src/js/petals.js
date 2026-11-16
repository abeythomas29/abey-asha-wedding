/* Petals and small gold glints drifting through a scene. Runs only while visible. */
window.createPetals = (canvas, { count = 18 } = {}) => {
  const ctx = canvas.getContext('2d');
  const rand = (min, max) => min + Math.random() * (max - min);
  let w = 0, h = 0, dpr = 1, frame = 0, paused = true, visible = false, last = 0;
  const petals = [];

  // depth 0 is far away (small, slow, faint); depth 1 is close (large, quicker, softly blurred).
  function spawn(p, anywhere) {
    p.depth = Math.random() ** 1.6;
    p.x = rand(0, w);
    p.y = anywhere ? rand(-h * 0.1, h) : rand(-60, -10);
    p.size = 4 + p.depth * 9 + rand(-1, 1);
    p.speed = 12 + p.depth * 26 + rand(-3, 3);
    p.sway = rand(10, 30) * (0.6 + p.depth);
    p.phase = rand(0, Math.PI * 2);
    p.spin = rand(-0.9, 0.9);
    p.angle = rand(0, Math.PI * 2);
    p.flip = rand(0, Math.PI * 2);
    p.flipRate = rand(1.2, 2.8);
    p.glint = Math.random() < 0.18;
    p.tint = Math.random() < 0.6 ? [255, 252, 244] : [247, 238, 216];
    return p;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!petals.length) {
      for (let i = 0; i < count; i++) petals.push(spawn({}, true));
      petals.sort((a, b) => a.depth - b.depth); // far petals are painted first
    }
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    if (p.glint) {
      ctx.fillStyle = 'rgba(214,184,116,.85)';
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.18, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Tumbling: the petal narrows to an edge and turns over; its underside is a little shaded.
      const turn = Math.cos(p.flip);
      const s = p.size;
      const [r, g, b] = p.tint;
      const shade = turn < 0 ? 0.86 : 1;
      ctx.scale(0.18 + Math.abs(turn) * 0.82, 1);
      ctx.globalAlpha = 0.45 + p.depth * 0.5;
      if (p.depth > 0.75) ctx.filter = 'blur(0.8px)';
      const fill = ctx.createLinearGradient(0, -s, 0, s);
      fill.addColorStop(0, `rgba(${r * shade | 0},${g * shade | 0},${b * shade | 0},.95)`);
      fill.addColorStop(0.75, `rgba(${r * shade * .97 | 0},${g * shade * .95 | 0},${b * shade * .9 | 0},.9)`);
      fill.addColorStop(1, `rgba(${226 * shade | 0},${206 * shade | 0},${160 * shade | 0},.85)`);
      ctx.fillStyle = fill;
      // Rounded petal with a soft notch at the tip, narrowing to the base.
      ctx.beginPath();
      ctx.moveTo(0, s);
      ctx.bezierCurveTo(-s * 0.95, s * 0.35, -s * 0.8, -s * 0.9, -s * 0.18, -s);
      ctx.quadraticCurveTo(0, -s * 0.82, s * 0.18, -s);
      ctx.bezierCurveTo(s * 0.8, -s * 0.9, s * 0.95, s * 0.35, 0, s);
      ctx.fill();
      // A faint centre vein.
      ctx.strokeStyle = `rgba(200,180,140,${0.25 * shade})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.85);
      ctx.quadraticCurveTo(s * 0.06, 0, 0, -s * 0.75);
      ctx.stroke();
    }
    ctx.restore();
  }

  function step(now) {
    frame = 0;
    if (paused || !visible) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    ctx.clearRect(0, 0, w, h);
    for (const p of petals) {
      p.phase += dt;
      p.y += p.speed * dt;
      p.x += Math.sin(p.phase) * p.sway * dt;
      p.angle += p.spin * dt;
      p.flip += p.flipRate * dt;
      if (p.y > h + 20) spawn(p, false);
      drawPetal(p);
    }
    frame = requestAnimationFrame(step);
  }

  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    if (!paused && visible) frame = requestAnimationFrame(step);
  }

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(canvas);
  resize();
  return {
    setPaused(value) {
      paused = value;
      if (paused) ctx.clearRect(0, 0, w, h);
      sync();
    }
  };
};
