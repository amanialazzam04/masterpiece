document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-link");
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      menuToggle.textContent = open ? "✕" : "☰";
    });
    navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
    }));
  }
  navItems.forEach(link => link.addEventListener("click", () => {
    navItems.forEach(item => item.classList.remove("active"));
    link.classList.add("active");
  }));

  // Smooth in-page navigation with a reliable offset for the floating navbar.
  // This keeps the About heading visible below the fixed header.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      const header = document.querySelector(".header");
      const headerOffset = (header?.getBoundingClientRect().height || 76) + 24;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.history.pushState(null, "", hash);
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    });
  });

  // Reveal sections; all content remains visible if JavaScript/observer is unavailable.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("js-ready");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in-view");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.14, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => observer.observe(item));
  }

  // Use one background video. Native looping follows the source file's own edit;
  // CSS cannot remove a discontinuity that is encoded at the clip boundary.
  const heroVideo = document.getElementById("hero-background-video");
  if (heroVideo) {
    const hero = document.querySelector(".hero");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.loop = true;
    let playRequest = null;

    const setFallback = () => {
      hero?.classList.remove("video-ready");
      hero?.classList.add("video-unavailable");
    };

    const playVideo = () => {
      if (reducedMotion.matches) {
        heroVideo.pause();
        hero?.classList.add("video-motion-reduced");
        setFallback();
        return;
      }
      hero?.classList.remove("video-motion-reduced");
      if (heroVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !heroVideo.paused || playRequest) return;
      playRequest = heroVideo.play();
      if (playRequest && typeof playRequest.then === "function") {
        playRequest.then(() => {
          hero?.classList.add("video-ready");
          hero?.classList.remove("video-unavailable");
        }).catch(setFallback).finally(() => { playRequest = null; });
      } else {
        hero?.classList.add("video-ready");
        hero?.classList.remove("video-unavailable");
        playRequest = null;
      }
    };

    if (reducedMotion.matches) {
      hero?.classList.add("video-motion-reduced");
      setFallback();
    } else if (heroVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playVideo();
    } else {
      heroVideo.addEventListener("canplay", playVideo, { once: true });
    }
    heroVideo.addEventListener("error", setFallback);
    reducedMotion.addEventListener?.("change", playVideo);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) heroVideo.pause();
      else playVideo();
    });
  }

});
