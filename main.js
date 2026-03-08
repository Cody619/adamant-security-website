// mobile toggle
const navToggle = document.getElementById("navToggle");
const menu = document.getElementById("menu");

const MOBILE_BREAKPOINT = 900;

function openMenu() {
  if (!menu || !navToggle) return;

  menu.classList.add("active");
  navToggle.classList.add("active");
  navToggle.setAttribute("aria-expanded", "true");

  // Закрытие по клику вне, по Esc и при ресайзе
  document.addEventListener("pointerdown", onOutside, { capture: true });
  document.addEventListener("keydown", onKey);
  window.addEventListener("resize", onResize);
}

function closeMenu() {
  if (!menu || !navToggle) return;

  menu.classList.remove("active");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");

  document.removeEventListener("pointerdown", onOutside, { capture: true });
  document.removeEventListener("keydown", onKey);
  window.removeEventListener("resize", onResize);
}

function toggleMenu() {
  if (!menu) return;

  const isOpen = menu.classList.contains("active");
  isOpen ? closeMenu() : openMenu();
}

function onOutside(e) {
  if (!menu || !navToggle) return;

  // если клик внутри меню или по кнопке — не закрываем
  if (menu.contains(e.target) || navToggle.contains(e.target)) return;
  closeMenu();
}

function onKey(e) {
  if (e.key === "Escape") closeMenu();
}

function onResize() {
  // на десктопе меню не должно оставаться открытым в мобильном режиме
  if (window.innerWidth > MOBILE_BREAKPOINT) {
    closeMenu();
  }
}

// Клик по кнопке бургера
if (navToggle && menu) {
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });
}

// Закрывать при клике на любой пункт меню
if (menu) {
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => closeMenu());
  });
}

/* ===== services dropdown ===== */

const servicesToggle = document.getElementById("servicesToggle");
const servicesMenuItem = servicesToggle?.closest(".menu-item");

if (servicesToggle && servicesMenuItem) {
  servicesToggle.addEventListener("click", (e) => {
    if (window.innerWidth > 900) return;

    e.preventDefault();
    e.stopPropagation();

    const isOpen = servicesMenuItem.classList.toggle("open");
    servicesToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (e) => {
    if (window.innerWidth > 900) return;

    if (!servicesMenuItem.contains(e.target)) {
      servicesMenuItem.classList.remove("open");
      servicesToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* ===== simple counter animation ===== */
const counters = document.querySelectorAll(".hero .num");

if (counters.length) {
  const easeOut = (t) => 1 - Math.pow(1 - t, 4);

  function runCounter(el) {
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || "+";
    const duration = 1200;
    let start = null;

    function tick(ts) {
      if (!start) start = ts;

      const p = Math.min(1, (ts - start) / duration);
      const val = Math.floor(easeOut(p) * target);

      el.textContent = p >= 1 ? `${target}${suffix}` : `${val}`;
      if (p < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 },
  );

  counters.forEach((c) => io.observe(c));
}

/* ===== Contact form validation (optional) ===== */
const quoteForm = document.getElementById("quoteForm");
const successMsg = document.getElementById("formSuccess");

function setError(name, message) {
  const el = document.querySelector(`[data-error-for="${name}"]`);
  if (el) el.textContent = message || "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (quoteForm) {
  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = quoteForm.firstName.value.trim();
    const lastName = quoteForm.lastName.value.trim();
    const email = quoteForm.email.value.trim();

    let ok = true;

    setError("firstName", "");
    setError("lastName", "");
    setError("email", "");

    if (!firstName) {
      setError("firstName", "Please enter your first name.");
      ok = false;
    }

    if (!lastName) {
      setError("lastName", "Please enter your last name.");
      ok = false;
    }

    if (!email) {
      setError("email", "Please enter your email.");
      ok = false;
    } else if (!isValidEmail(email)) {
      setError("email", "Please enter a valid email.");
      ok = false;
    }

    if (!ok) return;

    // Here we can send it to backend later (EmailJS, Formspree, server).
    quoteForm.reset();

    if (successMsg) {
      successMsg.hidden = false;
      setTimeout(() => {
        successMsg.hidden = true;
      }, 6000);
    }
  });
}
