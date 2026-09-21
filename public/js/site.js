const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
    });
  });
}

const filterButtons = document.querySelectorAll('.filter-button');
const archiveRows = document.querySelectorAll('.archive-row');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const activeFilter = button.dataset.filter;

    filterButtons.forEach((candidate) => {
      const isActive = candidate === button;
      candidate.classList.toggle('is-active', isActive);
      candidate.setAttribute('aria-pressed', String(isActive));
    });

    archiveRows.forEach((row) => {
      row.hidden = activeFilter !== 'all' && row.dataset.category !== activeFilter;
    });
  });
});

const cards = document.querySelectorAll('.reveal-card');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  cards.forEach((card) => observer.observe(card));
} else {
  cards.forEach((card) => card.classList.add('is-visible'));
}

const year = document.querySelector('#current-year');
if (year) year.textContent = new Date().getFullYear();
