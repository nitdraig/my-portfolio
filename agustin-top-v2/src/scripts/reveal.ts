/**
 * Scroll reveals + staggered entrance. Respects prefers-reduced-motion.
 */
export function initReveal() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Always unlock hero entrance (must not depend on .reveal existing)
  const enterHero = () => {
    document.querySelectorAll(".hero-enter").forEach((el) => {
      el.classList.add("is-in");
    });
  };

  if (reduced) {
    document.documentElement.classList.add("reduce-motion");
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    enterHero();
    return;
  }

  requestAnimationFrame(enterHero);

  document.querySelectorAll("[data-reveal-stagger]").forEach((group) => {
    const children = group.querySelectorAll<HTMLElement>(":scope > .reveal, :scope .reveal");
    children.forEach((el, i) => {
      if (!el.style.getPropertyValue("--reveal-delay")) {
        el.style.setProperty("--reveal-delay", `${Math.min(i * 90, 540)}ms`);
      }
    });
  });

  const els = document.querySelectorAll<HTMLElement>(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  els.forEach((el) => io.observe(el));
}

export function initNavScroll() {
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  if (!header) return;

  const onScroll = () => {
    header.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}
