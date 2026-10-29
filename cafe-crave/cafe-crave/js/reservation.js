/* ===== Cafe Crave — Reservation & contact form validation ===== */
(function () {
  'use strict';

  const pad = n => String(n).padStart(2, '0');
  const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

  const RULES = {
    name: v => v.trim().length >= 2 || 'Please enter your full name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
    phone: v => /^(\+91|91|0)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')) || 'Enter a valid 10-digit Indian mobile number.',
    date: v => {
      if (!v) return 'Please choose a date.';
      const d = new Date(v + 'T00:00:00'), today = new Date(); today.setHours(0, 0, 0, 0);
      const max = new Date(today); max.setDate(max.getDate() + 90);
      if (isNaN(d)) return 'Please choose a valid date.';
      if (d < today) return 'Date cannot be in the past.';
      if (d > max) return 'Bookings open up to 90 days ahead.';
      return true;
    },
    time: v => !!v || 'Please select a time.',
    guests: v => { const n = Number(v); return (Number.isInteger(n) && n >= 1 && n <= 20) || 'Guests must be between 1 and 20.'; },
    subject: v => v.trim().length >= 3 || 'Please add a short subject.',
    message: v => v.trim().length >= 10 || 'Message should be at least 10 characters.'
  };

  function validateField(el) {
    const rule = RULES[el.name];
    if (!rule) return true;
    const result = rule(el.value);
    const group = el.closest('.form-group');
    const err = group && group.querySelector('.error-msg');
    const ok = result === true;
    if (group) group.classList.toggle('invalid', !ok);
    if (err) err.textContent = ok ? '' : result;
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
  }

  // Fill time slots (8:00 AM – 9:30 PM, every 30 minutes)
  function fillTimes(select) {
    if (select.options.length > 1) return;
    for (let m = 8 * 60; m <= 21 * 60 + 30; m += 30) {
      const h = Math.floor(m / 60), mm = m % 60;
      const label = `${h % 12 || 12}:${pad(mm)} ${h < 12 ? 'AM' : 'PM'}`;
      select.add(new Option(label, label));
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('select[name="time"]').forEach(fillTimes);
    document.querySelectorAll('input[type="date"]').forEach(d => { d.min = todayStr(); });

    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.noValidate = true;
      const fields = [...form.querySelectorAll('input[name], select[name], textarea[name]')];
      const success = form.parentElement.querySelector('.success-msg');

      fields.forEach(f => {
        f.addEventListener('blur', () => validateField(f));
        f.addEventListener('input', () => { if (f.closest('.form-group').classList.contains('invalid')) validateField(f); });
      });

      form.addEventListener('submit', e => {
        e.preventDefault();
        const bad = fields.filter(f => !validateField(f));
        if (bad.length) { if (success) success.hidden = true; bad[0].focus(); return; }

        const data = Object.fromEntries(new FormData(form).entries());
        if (success) {
          success.textContent = form.dataset.validate === 'reservation'
            ? `Thanks, ${data.name}. Table for ${data.guests} on ${data.date} at ${data.time} noted. (Demo only: nothing is stored or sent.)`
            : `Thanks, ${data.name}. Message received. (Demo only: nothing is stored or sent.)`;
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        fields.forEach(f => f.removeAttribute('aria-invalid'));
      });
    });
  });
})();
