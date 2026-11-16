(() => {
  'use strict';
  const data = window.WEDDING_DATA;
  const { couple, wedding, events, scripture } = data;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const mapsUrl = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const pairText = `${couple.groomShort} & ${couple.brideShort}`;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const cross = '<svg class="cross" viewBox="0 0 40 56" aria-hidden="true"><path d="M17 2h6v14h14v6H23v32h-6V22H3v-6h14z"/></svg>';
  const bloom = `<svg class="bloom" viewBox="0 0 40 40" aria-hidden="true">${[0, 72, 144, 216, 288].map(r => `<ellipse cx="20" cy="10.5" rx="6.5" ry="10" transform="rotate(${r} 20 20)"/>`).join('')}<circle cx="20" cy="20" r="3.6"/></svg>`;
  const envelopeIcon = '<svg class="rsvp-envelope" viewBox="0 0 48 36" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><rect x="2" y="3" width="44" height="30" rx="2"/><path d="m3 5 21 16L45 5M3 32l14-14m28 14L31 18"/></svg>';

  // Bouquets stay still; only their blossoms stir, each on its own layer over the spot it was lifted from.
  const blossoms = {
    tl: [{ src: 'bloom-tl-1', left: 20.75, top: 6.94, width: 29.05 }, { src: 'bloom-tl-2', left: 2.07, top: 27.78, width: 29.05 }],
    br: [{ src: 'bloom-br-1', left: 66.94, top: 55.38, width: 33.06 }, { src: 'bloom-br-2', left: 52.65, top: 71.92, width: 25.31 }]
  };
  const corner = (pos, art) => `
    <div class="corner corner-${pos}">
      <img src="./assets/bouquet-${art}-base.webp" alt="">
      ${blossoms[art].map((b, i) => `<img class="blossom" src="./assets/${b.src}.webp" alt="" style="left:${b.left}%;top:${b.top}%;width:${b.width}%;--stir:${(5.2 + i * 1.3 + (pos === 'tr' || pos === 'bl' ? .7 : 0)).toFixed(1)}s;--stir-delay:-${(i * 2.1 + pos.length).toFixed(1)}s">`).join('')}
    </div>`;

  // The illustrated scene is shared by the hero and the closing, like stationery and its envelope liner.
  const scene = (petals = false) => `
    <div class="scene-art" aria-hidden="true">
      <div class="sky"></div>
      <div class="sun"></div>
      <div class="hills"></div>
      <div class="lake"></div>
      <div class="arch"></div>
      <div class="curtain curtain-left"></div><div class="curtain curtain-right"></div>
      <img class="couple" src="./assets/couple-arch.webp" alt="" decoding="async">
      ${['tl', 'tr'].map(pos => corner(pos, 'tl')).join('')}
      ${['br', 'bl'].map(pos => corner(pos, 'br')).join('')}
      ${petals ? '<canvas class="petals"></canvas>' : ''}
    </div>`;

  // Our story: arch-framed photos on alternating sides, joined by a dotted gold thread that ends at the final portrait.
  const { story } = data;
  const archPhoto = (item, width, height) => `<div class="arch-photo"><span><img src="${esc(item.src)}" alt="${esc(item.alt)}" width="${width}" height="${height}" loading="lazy" decoding="async" style="--focus:${esc(item.focus || '50% 30%')}"></span></div>`;
  const thread = (path, cls = '') => `<svg class="thread ${cls}" viewBox="0 0 100 64" preserveAspectRatio="none" aria-hidden="true"><path d="${path}"/></svg>`;
  const storySection = !story ? '' : `
      <section class="paper story" id="our-story" aria-labelledby="story-title">
        <p class="kicker reveal">${esc(story.kicker)}</p>
        <h2 class="script reveal" id="story-title">${esc(story.heading)}</h2>
        <p class="lead reveal">${esc(story.lead)}</p>
        <ol class="moments">
          ${story.moments.map((m, i, all) => `
          <li class="moment">
            <figure class="reveal" data-scene>
              ${archPhoto(m, 800, 1000)}
              <figcaption><span class="kicker">${esc(m.label)}</span><strong>${esc(m.title)}</strong><span>${esc(m.text)}</span></figcaption>
            </figure>
            ${i < all.length - 1 ? thread('M28 2C28 42 72 22 72 62') : thread('M28 2C28 40 50 30 50 62', 'thread-end')}
          </li>`).join('')}
        </ol>
        <figure class="story-finale reveal" data-scene>
          ${archPhoto(story.finale, 1000, 1250)}
          <figcaption>
            <span class="kicker">${esc(story.finale.label)}</span>
            <h3 class="script">${esc(story.finale.title)}</h3>
            <p>${esc(story.finale.text)}</p>
          </figcaption>
        </figure>
      </section>`;

  document.getElementById('app').innerHTML = `
    <main class="invitation" id="invitation" inert>
      <section class="hero" data-scene aria-label="Wedding invitation">
        ${scene(true)}
        <div class="hero-copy">
          <p class="occasion">The wedding of</p>
          <p class="date">${esc(wedding.dateLabel)}</p>
          <h1 class="names" id="names" tabindex="-1"><span>${esc(couple.groomShort)}</span><i>&amp;</i><span>${esc(couple.brideShort)}</span></h1>
          <p class="hero-note">${esc(couple.heroNote)}</p>
          <a class="hero-link" href="#our-invitation">With love, you are invited</a>
        </div>
      </section>

      <section class="paper floral intro" id="our-invitation" data-scene aria-label="Our invitation">
        ${cross}
        <blockquote class="verse reveal">“${esc(scripture.text)}”<cite>${esc(scripture.reference)}</cite></blockquote>
        <div class="rule" aria-hidden="true"></div>
        <p class="lead reveal">${esc(wedding.invitationLead)}</p>
        <div class="person reveal">
          <h2 class="script">${esc(couple.groom)}</h2>
          <p class="parents">${esc(couple.groomParents)}</p>
        </div>
        <p class="with reveal"><span></span><em>with</em><span></span></p>
        <div class="person reveal">
          <h2 class="script">${esc(couple.bride)}</h2>
          <p class="parents">${esc(couple.brideParents)}</p>
        </div>
        <p class="lead solemn reveal">${esc(wedding.solemnized)}</p>
        <p class="long-date reveal">${esc(wedding.longDate)}</p>
      </section>
${storySection}

      <section class="paper torn countdown-section" data-scene aria-labelledby="countdown-title">
        <h2 class="script" id="countdown-title">Until we say “I do”</h2>
        <div class="countdown" role="timer" aria-label="Time until the wedding">
          ${['days', 'hours', 'minutes', 'seconds'].map(unit => `<div><strong data-unit="${unit}">00</strong><span>${unit[0].toUpperCase() + unit.slice(1)}</span></div>`).join('')}
        </div>
        <p class="countdown-note">${esc(wedding.longDate)}</p>
      </section>

      <section class="paper floral schedule" data-scene aria-labelledby="schedule-title">
        <h2 class="script reveal" id="schedule-title">Every lovely moment</h2>
        <ol class="timeline">
          ${events.map(ev => `<li class="reveal"><time>${esc(ev.shortTime)}</time><span class="marker">${bloom}</span><span class="event-name">${esc(ev.title)}<small>${esc(ev.venue)}</small></span></li>`).join('')}
        </ol>
        <p class="schedule-note">All times are India Standard Time.</p>
      </section>

      <section class="paper torn venue-section" data-scene aria-labelledby="venue-title">
        <h2 class="script reveal" id="venue-title">Where we celebrate</h2>
        <div class="venue-scene reveal"><img src="./assets/couple-arch.webp" alt="" loading="lazy"></div>
        <p class="venue-caption">Two blessings, one beautiful day in Bhopal</p>
        ${events.map(ev => `
          <div class="location-frame reveal">
            <p class="kicker">${esc(ev.title)}</p>
            <h3 class="venue-name">${esc(ev.venue)}</h3>
            <div class="rule" aria-hidden="true"></div>
            <address class="venue-address">${esc(ev.address)}</address>
            <p class="venue-time">${esc(wedding.longDate)}<br>${esc(ev.time)}</p>
            <div class="actions">
              <a class="action" href="${mapsUrl(ev.mapsQuery)}" target="_blank" rel="noopener noreferrer">Open in maps</a>
              <button class="action secondary" data-calendar="${esc(ev.id)}">Add to calendar</button>
            </div>
          </div>`).join('')}
      </section>

      <section class="paper floral rsvp-section" data-scene aria-labelledby="rsvp-title">
        <div class="rsvp-card reveal">
          <span class="kicker">Kindly reply</span>
          ${envelopeIcon}
          <h2 class="script" id="rsvp-title">${esc(data.rsvp.heading)}</h2>
          <p>${esc(data.rsvp.note)}</p>
          <form class="rsvp-form" id="rsvp-form" novalidate></form>
        </div>
      </section>

      <footer class="closing" aria-labelledby="closing-title">
        <div class="closing-scene" data-scene>
          ${scene()}
          <div class="closing-copy reveal">
            <p class="closing-eyebrow">The beginning of our forever</p>
            <h2 class="closing-title" id="closing-title">With all<br><em>our love</em></h2>
            <div class="closing-rule" aria-hidden="true"></div>
            <p class="closing-names"><span>${esc(couple.groomShort)}</span><i>&amp;</i><span>${esc(couple.brideShort)}</span></p>
            <p class="closing-date">${esc(wedding.dateLabel)}</p>
            <p class="closing-note">The day will be beautiful.<br>Even more so with you.</p>
            <a class="closing-rsvp" href="#rsvp-title">Join our celebration <span aria-hidden="true">↗</span></a>
          </div>
          <p class="closing-caption">A little moment. A lifetime of love.</p>
        </div>
        <div class="closing-colophon">
          <img class="monogram" src="./assets/monogram.webp" alt="A and A monogram beneath a church arch" loading="lazy">
          <button class="reopen" id="reopen">Open the envelope again <span aria-hidden="true">↺</span></button>
        </div>
      </footer>
    </main>

    <div class="media-controls" id="controls" hidden>
      <button class="media-button" id="motion" aria-pressed="false">Pause motion</button>
      <button class="media-button" id="music" aria-pressed="false" hidden>Play music</button>
    </div>
    <audio id="audio" loop preload="none"></audio>
    <p class="status" id="status" role="status" hidden></p>`;

  const $ = id => document.getElementById(id);
  const audio = $('audio');
  let opened = false, motionPaused = reduced.matches, statusTimer;

  const notify = message => {
    $('status').textContent = message;
    $('status').hidden = false;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { $('status').hidden = true; }, 4000);
  };

  const motion = window.createMotion();
  const petals = window.createPetals(document.querySelector('.hero .petals'));

  function syncMotion() {
    const stopped = motionPaused || reduced.matches || !opened;
    document.body.classList.toggle('motion-paused', motionPaused || reduced.matches);
    motion.setPaused(stopped);
    petals.setPaused(stopped);
    $('motion').disabled = reduced.matches;
    $('motion').textContent = reduced.matches ? 'Reduced motion' : motionPaused ? 'Play motion' : 'Pause motion';
    $('motion').setAttribute('aria-pressed', String(motionPaused));
  }

  // Scroll reveal and the "current moment" on the timeline.
  let observersStarted = false;
  function startObservers() {
    if (observersStarted) return;
    observersStarted = true;
    const rise = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!motionPaused && !reduced.matches) entry.target.classList.add('arriving');
      rise.unobserve(entry.target);
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => rise.observe(el));
    const current = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.timeline li').forEach(li => li.classList.remove('is-current'));
      entry.target.classList.add('is-current');
    }), { rootMargin: '-30% 0px -45% 0px' });
    document.querySelectorAll('.timeline li').forEach(li => current.observe(li));
  }

  const opening = window.createOpening({
    monogram: `${couple.groomShort[0]}${couple.brideShort[0]}`,
    names: esc(pairText),
    reduced,
    onReveal() {
      opened = true;
      $('invitation').inert = false;
      document.body.classList.remove('locked');
      $('controls').hidden = false;
      syncMotion();
      startObservers();
      $('names').focus({ preventScroll: true });
    }
  });
  ['open', 'seal-open'].forEach(id => document.getElementById(id).addEventListener('click', () => {
    if (data.media.music && audio.paused) audio.play().then(() => setMusic(true)).catch(() => {});
  }));

  $('reopen').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    opened = false;
    $('invitation').inert = true;
    $('controls').hidden = true;
    document.body.classList.add('locked');
    syncMotion();
    opening.reset();
  });

  // Music is optional; the button only appears when a track is configured.
  function setMusic(playing) {
    $('music').textContent = playing ? 'Pause music' : 'Play music';
    $('music').setAttribute('aria-pressed', String(playing));
  }
  if (data.media.music) {
    audio.src = data.media.music;
    audio.volume = 0.45;
    $('music').hidden = false;
  }
  $('music').addEventListener('click', async () => {
    if (audio.paused) {
      try { await audio.play(); setMusic(true); } catch { notify('Music could not be played.'); }
    } else { audio.pause(); setMusic(false); }
  });
  $('motion').addEventListener('click', () => { motionPaused = !motionPaused; syncMotion(); });
  reduced.addEventListener('change', e => { motionPaused = e.matches; syncMotion(); });
  syncMotion();

  // Countdown to the ceremony.
  const start = new Date(events[0].startISO);
  function tick() {
    const left = Math.max(0, start - Date.now());
    const s = Math.floor(left / 1000);
    const parts = { days: Math.floor(s / 86400), hours: Math.floor(s / 3600) % 24, minutes: Math.floor(s / 60) % 60, seconds: s % 60 };
    for (const [unit, value] of Object.entries(parts)) document.querySelector(`[data-unit="${unit}"]`).textContent = String(value).padStart(2, '0');
    if (!left) $('countdown-title').textContent = 'Our celebration has begun';
  }
  tick();
  setInterval(tick, 1000);

  // Per-event .ics download.
  const icsText = value => String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
  const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  document.querySelectorAll('[data-calendar]').forEach(button => button.addEventListener('click', () => {
    const ev = events.find(item => item.id === button.dataset.calendar);
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Abey and Asha//Wedding//EN', 'BEGIN:VEVENT',
      `UID:${ev.id}-${Date.parse(ev.startISO)}@abey-asha-wedding`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(new Date(ev.startISO))}`,
      `DTEND:${stamp(new Date(ev.endISO))}`,
      `SUMMARY:${icsText(`${ev.title}: ${pairText}`)}`,
      `LOCATION:${icsText(`${ev.venue}, ${ev.address}`)}`,
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n') + '\r\n';
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    Object.assign(document.createElement('a'), { href: url, download: `abey-asha-${ev.id}.ics` }).click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Calendar invite downloaded.');
  }));

  window.setupRSVP($('rsvp-form'), data.rsvp);
})();
