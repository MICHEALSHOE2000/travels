(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-nav');
  const setMenu = open => { if(!toggle || !menu) return; toggle.setAttribute('aria-expanded', String(open)); menu.hidden = !open; toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', e => { if(e.key === 'Escape'){ const opened = toggle?.getAttribute('aria-expanded') === 'true'; setMenu(false); document.querySelectorAll('.dest-menu[open]').forEach(d => d.open = false); if(opened) toggle.focus(); } });
  document.addEventListener('click', e => { document.querySelectorAll('.dest-menu[open]').forEach(d => { if(!d.contains(e.target)) d.open = false; }); });
  window.matchMedia('(min-width:851px)').addEventListener('change', e => { if(e.matches) setMenu(false); });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let shown = 0;
    document.querySelectorAll('[data-category]').forEach(c => { c.hidden = category !== 'all' && c.dataset.category !== category; if(!c.hidden) shown++; });
    const status = document.querySelector('#journal-status'); if(status) status.textContent = `${shown} article${shown === 1 ? '' : 's'} shown`;
  }));
  const form = document.querySelector('#trip-form'); if(!form) return;
  const params = new URLSearchParams(location.search);
  const trip = params.get('trip');
  if(trip && [...form.elements.tripType.options].some(o => o.value === trip)) form.elements.tripType.value = trip;
  const summary = document.querySelector('#form-errors');
  const ready = document.querySelector('#enquiry-ready');
  const validate = field => {
    let message = '';
    if(field.required && !field.value.trim()) message = field.name === 'name' ? 'Please enter your name.' : 'Please enter your email address.';
    else if(field.type === 'email' && field.value && !field.validity.valid) message = 'Enter a valid email address, such as name@example.com.';
    else if(field.name === 'travelers' && field.value && (!Number.isInteger(Number(field.value)) || Number(field.value) < 1 || Number(field.value) > 100)) message = 'Enter a whole number between 1 and 100.';
    else if(field.name === 'departureDate' && field.value && field.value < new Date().toLocaleDateString('en-CA')) message = 'Choose a future date, or leave this blank if you are unsure.';
    if(field.validity.tooLong) message = 'Please shorten this entry.';
    const error = document.getElementById(`${field.id}-error`);
    if(error){ error.textContent = message; error.hidden = !message; }
    field.setAttribute('aria-invalid', String(Boolean(message))); return message;
  };
  ['name','email','travelers','departureDate'].forEach(name => form.elements[name]?.addEventListener('blur', e => validate(e.target)));
  form.addEventListener('input', () => { ready.hidden = true; });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields = ['name','email','travelers','departureDate'].map(n => form.elements[n]);
    const invalid = fields.filter(f => validate(f));
    if(invalid.length){ summary.hidden = false; summary.textContent = `Please check ${invalid.length === 1 ? 'the highlighted field' : 'the highlighted fields'} before reviewing your enquiry.`; invalid[0].focus(); ready.hidden = true; return; }
    summary.hidden = true;
    const values = new FormData(form); const value = n => String(values.get(n) || '').trim();
    const body = [ 'Hi Sarah,', '', "I'd like to talk about a trip.", '', `Name: ${value('name')}`, `Email: ${value('email')}`, `Phone: ${value('phone') || 'Not provided'}`, `Trip idea: ${value('tripType') || 'Still exploring'}`, `Destination: ${value('destination') || 'Open to ideas'}`, `Approximate date: ${value('departureDate') || 'Not decided yet'}`, `Date flexibility: ${value('flexibility')}`, `Travelers: ${value('travelers') || 'Not decided yet'}`, `Budget (total trip, USD): ${value('budget') || 'Not decided yet'}`, '', `Trip notes: ${value('notes') || 'No additional notes'}`, '', 'Thank you!' ].join('\n');
    document.querySelector('#enquiry-text').textContent = body;
    document.querySelector('#email-draft').href = `mailto:sarah_harry@gettravelwithsarah.com?subject=${encodeURIComponent('Trip planning enquiry — ' + value('name'))}&body=${encodeURIComponent(body)}`;
    document.querySelector('#copy-status').textContent = '';
    ready.hidden = false; ready.focus(); ready.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'center'});
  });
  document.querySelector('#copy-enquiry').addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try{ await navigator.clipboard.writeText(document.querySelector('#enquiry-text').textContent); status.textContent = 'Enquiry copied. Paste it into an email to Sarah and send it when you are ready.'; }
    catch{ status.textContent = 'Your browser could not copy the text. Select the enquiry above and copy it, then email Sarah.'; }
  });
})();
