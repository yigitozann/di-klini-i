/* ==========================================================================
   Yiğit Ozan Yılmazer Diş Kliniği — script.js
   Modüler Vanilla JavaScript — bağımlılık yok.

   İçindekiler:
   1. Ayarlar (WhatsApp vb.)
   2. Yardımcı Fonksiyonlar
   3. Header: scroll gölgesi + mobil menü
   4. WhatsApp Buton Bağlantıları
   5. Servis Kartları (Accordion)
   6. Yorumlar Slider
   7. SSS Accordion
   8. Scroll Reveal Animasyonları
   9. Yukarı Çık Butonu
   10. Aktif Nav Linki (Scrollspy)
   11. Footer Yılı
   12. Başlatma
   ========================================================================== */

(function () {
  "use strict";

  /* ========================================================================
     1. Ayarlar
     ======================================================================== */
  const CONFIG = {
    whatsappNumber: "905434101477",
    whatsappMessage: "Merhaba, klinik randevusu almak istiyorum.",
  };

  /* ========================================================================
     2. Yardımcı Fonksiyonlar
     ======================================================================== */
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function buildWhatsAppUrl(customMessage) {
    const message = encodeURIComponent(customMessage || CONFIG.whatsappMessage);
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
  }

  /* ========================================================================
     3. Header: scroll gölgesi + mobil menü
     ======================================================================== */
  function initHeader() {
    const header = qs(".site-header");
    const hamburger = qs(".hamburger");
    const nav = qs("#main-nav");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!hamburger || !nav) return;

    const closeMenu = () => {
      nav.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    const openMenu = () => {
      nav.classList.add("is-open");
      hamburger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };

    hamburger.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });

    qsa("a", nav).forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ========================================================================
     4. WhatsApp Buton Bağlantıları
     ======================================================================== */
  function initWhatsAppLinks() {
    qsa("[data-whatsapp]").forEach((el) => {
      const customMsg = el.getAttribute("data-whatsapp-message");
      el.setAttribute("href", buildWhatsAppUrl(customMsg));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* ========================================================================
     5. Servis Kartları (Accordion)
     ======================================================================== */
  function initServiceCards() {
    const cards = qsa(".service-card");
    cards.forEach((card) => {
      const toggle = qs(".service-toggle", card);
      if (!toggle) return;
      toggle.addEventListener("click", () => {
        const isOpen = card.classList.contains("is-open");
        cards.forEach((c) => {
          c.classList.remove("is-open");
          qs(".service-toggle", c)?.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          card.classList.add("is-open");
          toggle.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ========================================================================
     6. Yorumlar Slider
     ======================================================================== */
  function initTestimonialSlider() {
    const track = qs(".testimonial-track");
    const prevBtn = qs(".testimonial-controls .prev");
    const nextBtn = qs(".testimonial-controls .next");
    if (!track) return;

    const scrollByCard = (direction) => {
      const card = qs(".testimonial-card", track);
      if (!card) return;
      const cardWidth = card.getBoundingClientRect().width + 24; // gap dahil
      track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
    };

    prevBtn?.addEventListener("click", () => scrollByCard(-1));
    nextBtn?.addEventListener("click", () => scrollByCard(1));
  }

  /* ========================================================================
     7. SSS Accordion
     ======================================================================== */
  function initFaqAccordion() {
    const items = qsa(".faq-item");
    items.forEach((item) => {
      const question = qs(".faq-question", item);
      if (!question) return;
      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        items.forEach((i) => {
          i.classList.remove("is-open");
          qs(".faq-question", i)?.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("is-open");
          question.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ========================================================================
     8. Scroll Reveal Animasyonları
     ======================================================================== */
  function initScrollReveal() {
    const targets = qsa(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((t) => observer.observe(t));
  }

  /* ========================================================================
     9. Yukarı Çık Butonu
     ======================================================================== */
  function initBackToTop() {
    const btn = qs("#back-to-top");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      () => {
        btn.classList.toggle("is-visible", window.scrollY > 480);
      },
      { passive: true }
    );

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ========================================================================
     10. Aktif Nav Linki (Scrollspy)
     ======================================================================== */
  function initScrollSpy() {
    const sections = qsa("main section[id]");
    const navLinks = qsa(".nav-list a[href^='#']");
    if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) return;

    const linkFor = (id) => navLinks.find((link) => link.getAttribute("href") === `#${id}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkFor(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ========================================================================
     11. Footer Yılı
     ======================================================================== */
  function initFooterYear() {
    const el = qs("#current-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ========================================================================
     12. Başlatma
     ======================================================================== */
  function init() {
    initHeader();
    initWhatsAppLinks();
    initServiceCards();
    initTestimonialSlider();
    initFaqAccordion();
    initScrollReveal();
    initBackToTop();
    initScrollSpy();
    initFooterYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
