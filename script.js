// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll reveal
const revealTargets = document.querySelectorAll('.section, .service, .vision-card, .portfolio__card, .pillar');
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => io.observe(el));

// Contact form (front-end only for now)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  if (!data.get('name') || !data.get('email') || !data.get('message')) {
    status.textContent = 'Please fill in all required fields.';
    status.style.color = '#c0392b';
    return;
  }
  data.append('_subject', 'New PXM Digital Contact — ' + (data.get('name') || ''));
  status.textContent = 'Sending...';
  status.style.color = 'var(--purple)';
  fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
    .then(r => {
      if (r.ok) {
        status.textContent = 'Thanks — we\'ll be in touch within 24 hours.';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Try again.';
        status.style.color = '#c0392b';
      }
    })
    .catch(() => {
      status.textContent = 'Network error. Try again.';
      status.style.color = '#c0392b';
    });
});
