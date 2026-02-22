//mobile toggle

const navToggle = document.getElementById("navToggle");
const menu = document.getElementById("menu");

const MOBILE_BREAKPOINT = 900;

function openMenu() {
  menu.classList.add("open");
  navToggle.setAttribute("aria-expanded", "true");

  // Закрытие по клику вне, по Esc и при ресайзе
  document.addEventListener("pointerdown", onOutside, { capture: true });
  document.addEventListener("keydown", onKey);
  window.addEventListener("resize", onResize);
}

function closeMenu() {
  menu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.removeEventListener("pointerdown", onOutside, { capture: true });
  document.removeEventListener("keydown", onKey);
  window.removeEventListener("resize", onResize);
}

function toggleMenu() {
  const isOpen = menu.classList.contains("open");
  isOpen ? closeMenu() : openMenu();
}

function onOutside(e) {
  // если клик внутри меню или по кнопке — не закрываем
  if (menu.contains(e.target) || navToggle.contains(e.target)) return;
  closeMenu();
}

function onKey(e) {
  if (e.key === "Escape") closeMenu();
}

function onResize() {
  // на десктопе меню не должно оставаться «залипшим» в мобильном режиме
  if (window.innerWidth > MOBILE_BREAKPOINT) closeMenu();
}

// Клик по кнопке бургера
if (navToggle && menu) {
  navToggle.addEventListener("click", toggleMenu);
}

// Закрывать при клике на любой пункт меню (якорь/ссылка)
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => closeMenu()));

// простая анимация счётчиков + защита
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
      entries.forEach((e) => {
        if (e.isIntersecting) {
          runCounter(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 },
  );

  // ===== Contact form validation (optional) =====
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
        setTimeout(() => (successMsg.hidden = true), 6000);
      }
    });
  }

  counters.forEach((c) => io.observe(c));
}
