// Theme toggle (dark/light)
const themeToggle = document.getElementById('themeToggle');
const rootEl = document.documentElement;

function getCurrentTheme() {
  const stored = rootEl.getAttribute('data-theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

themeToggle.addEventListener('click', () => {
  const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
  rootEl.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Scroll-spy: highlight current section in nav
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach((a) => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--accent)'
            : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((section) => observer.observe(section));

// Email copy-to-clipboard
const emailCopyBtn = document.getElementById('emailCopyBtn');

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let succeeded = false;
  try {
    succeeded = document.execCommand('copy');
  } catch (err) {
    succeeded = false;
  }

  document.body.removeChild(textarea);
  return succeeded;
}

if (emailCopyBtn) {
  const originalLabel = emailCopyBtn.textContent;
  const email = emailCopyBtn.dataset.email;

  emailCopyBtn.addEventListener('click', async () => {
    let copied = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch (err) {
        copied = false;
      }
    }

    if (!copied) {
      copied = fallbackCopy(email);
    }

    if (copied) {
      emailCopyBtn.textContent = '복사됨 ✓';
      emailCopyBtn.classList.add('copied');
    } else {
      emailCopyBtn.textContent = `복사 실패: ${email}`;
    }

    setTimeout(() => {
      emailCopyBtn.textContent = originalLabel;
      emailCopyBtn.classList.remove('copied');
    }, 1800);
  });
}

// Project tabs
const projectTabs = document.querySelectorAll('.project-tab[data-target]');
const projectPanels = document.querySelectorAll('.project-panel');

projectTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    if (tab.disabled) return;

    projectTabs.forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const targetId = tab.dataset.target;

    projectPanels.forEach((panel) => {
      const isTarget = panel.id === targetId;
      panel.classList.toggle('active', isTarget);

      if (!isTarget) {
        panel.querySelectorAll('video').forEach((video) => {
          video.pause();
          video.currentTime = 0;
        });
      }
    });
  });
});

// Demo videos: hover to play on desktop, tap to toggle on touch devices
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

document.querySelectorAll('.demo-item').forEach((item) => {
  const video = item.querySelector('video');
  if (!video) return;

  if (isTouchDevice) {
    item.addEventListener('click', () => {
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  } else {
    item.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });

    item.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  }
});
