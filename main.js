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
    { threshold: 0.6 }
  );

  counters.forEach((c) => io.observe(c));
}
