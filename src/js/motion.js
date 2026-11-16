/* Scroll-linked depth: background layers (sky, sun, water) move at slightly
   different speeds per scene. Only visible scenes are painted. */
window.createMotion = () => {
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const visible = new Set();
  let paused = true, frame = 0;

  function paint() {
    frame = 0;
    if (paused) return;
    const vh = innerHeight;
    const progress = [...visible].map(scene => {
      const r = scene.getBoundingClientRect();
      return [scene, Math.max(-1, Math.min(1, (vh / 2 - r.top - r.height / 2) / ((vh + r.height) / 2)))];
    });
    progress.forEach(([scene, p]) => scene.style.setProperty('--p', p.toFixed(4)));
  }
  const request = () => { if (!paused && !frame) frame = requestAnimationFrame(paint); };

  const io = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      target.classList.toggle('in-view', isIntersecting);
      if (isIntersecting) visible.add(target); else visible.delete(target);
    });
    request();
  });
  scenes.forEach(scene => io.observe(scene));
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });

  return {
    setPaused(value) {
      paused = value;
      if (paused) scenes.forEach(scene => scene.style.setProperty('--p', '0'));
      else request();
    }
  };
};
