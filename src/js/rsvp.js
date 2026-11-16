/* RSVP replies are posted to a Google Sheet through its Apps Script web app
   (see scripts/rsvp-sheet.gs). Each reply becomes one row in the sheet. */
window.setupRSVP = (form, config) => {
  form.innerHTML = `
    <label for="rsvp-name">Your full name</label>
    <input id="rsvp-name" name="guestName" autocomplete="name" maxlength="120" placeholder="First and last name" required>
    <label for="rsvp-attendance">Will you be joining us?</label>
    <select id="rsvp-attendance" name="attendance" required>
      <option value="">Please choose</option>
      <option value="yes">Joyfully accepts</option>
      <option value="no">Regretfully declines</option>
    </select>
    <div class="rsvp-party" hidden>
      <label for="rsvp-count">Number of guests (including you)</label>
      <input id="rsvp-count" name="guestCount" type="number" min="1" max="50" step="1" value="1" disabled>
    </div>
    <input class="rsvp-trap" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button type="submit" class="btn">Send my reply</button>
    <p class="rsvp-help" role="status"></p>`;

  const name = form.querySelector('#rsvp-name');
  const attendance = form.querySelector('#rsvp-attendance');
  const party = form.querySelector('.rsvp-party');
  const count = form.querySelector('#rsvp-count');
  const submit = form.querySelector('button[type="submit"]');
  const help = form.querySelector('.rsvp-help');
  const endpoint = String(config.sheetUrl || '').trim();
  const ready = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(endpoint);

  attendance.addEventListener('change', () => {
    const attending = attendance.value === 'yes';
    party.hidden = !attending;
    count.disabled = !attending;
  });
  help.textContent = ready ? '' : 'Online replies open soon. Until then, please reply to the family directly.';

  // Apps Script answers through a redirect that some browsers block from being read.
  // In that case the reply is sent without reading the answer, which still saves the row.
  async function send(body) {
    try {
      const res = await fetch(endpoint, { method: 'POST', body });
      const data = await res.json();
      if (data.result !== 'ok') throw new Error(data.message || 'not saved');
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
      await fetch(endpoint, { method: 'POST', body, mode: 'no-cors' });
    }
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
    if (!form.reportValidity()) return;
    if (!ready) {
      help.textContent = 'Online replies are not open yet, so your reply was not sent.';
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Sending…';
    help.textContent = '';
    try {
      await send(new URLSearchParams(new FormData(form)));
      const attending = attendance.value === 'yes';
      form.innerHTML = `<p class="rsvp-thanks">${attending
        ? 'Thank you! We can’t wait to celebrate with you.'
        : 'Thank you for letting us know. You will be in our hearts on the day.'}</p>`;
    } catch {
      submit.disabled = false;
      submit.textContent = 'Send my reply';
      help.textContent = 'Your reply could not be sent. Please check your connection and try again.';
    }
  });
};
