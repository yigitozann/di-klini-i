/* ==========================================================================
   Yiğit Ozan Yılmazer Diş Kliniği — script.js
   Modüler Vanilla JavaScript — bağımlılık yok.

   İçindekiler:
   1. Ayarlar (WhatsApp vb.)
   2. Yardımcı Fonksiyonlar
   3. Header: scroll gölgesi + mobil menü
   4. WhatsApp Buton Bağlantıları
   5. Servis Kartları (Accordion)
   6. Önce / Sonra Kaydırıcı
   7. Galeri Lightbox
   8. Yorumlar Slider
   9. SSS Accordion
   10. Scroll Reveal Animasyonları
   11. Yukarı Çık Butonu
   12. Aktif Nav Linki (Scrollspy)
   13. Footer Yılı
   14. Başlatma
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
     6. Önce / Sonra Kaydırıcı
     ======================================================================== */
  function initBeforeAfterSliders() {
    qsa(".ba-slider").forEach((slider) => {
      const range = qs(".ba-range", slider);
      const afterImg = qs(".ba-after", slider);
      const divider = qs(".ba-divider", slider);
      const handle = qs(".ba-handle", slider);
      if (!range || !afterImg) return;

      const update = (value) => {
        // "Sonrası" görselinin sol tarafını (0..value%) görünür bırak, kalanını kırp.
        afterImg.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
        if (divider) divider.style.left = `${value}%`;
        if (handle) handle.style.left = `${value}%`;
      };

      range.addEventListener("input", (e) => update(e.target.value));
      update(range.value || 50);
    });
  }

  /* ========================================================================
     7. Galeri Lightbox
     ======================================================================== */
  function initLightbox() {
    const items = qsa(".gallery-item");
    const lightbox = qs("#lightbox");
    if (!items.length || !lightbox) return;

    const imgEl = qs(".lightbox-content img", lightbox);
    const captionEl = qs(".lightbox-caption", lightbox);
    const closeBtn = qs(".lightbox-close", lightbox);
    const prevBtn = qs(".lightbox-prev", lightbox);
    const nextBtn = qs(".lightbox-next", lightbox);

    let currentIndex = 0;

    const show = (index) => {
      currentIndex = (index + items.length) % items.length;
      const item = items[currentIndex];
      const fullSrc = item.getAttribute("data-full") || qs("img", item).src;
      const caption = item.getAttribute("data-caption") || "";
      imgEl.src = fullSrc;
      imgEl.alt = caption;
      captionEl.textContent = caption;
    };

    const open = (index) => {
      show(index);
      lightbox.classList.add("is-active");
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      lightbox.classList.remove("is-active");
      document.body.style.overflow = "";
    };

    items.forEach((item, index) => {
      item.addEventListener("click", () => open(index));
      item.setAttribute("tabindex", "0");
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(index);
        }
      });
    });

    closeBtn?.addEventListener("click", close);
    prevBtn?.addEventListener("click", () => show(currentIndex - 1));
    nextBtn?.addEventListener("click", () => show(currentIndex + 1));

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-active")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(currentIndex - 1);
      if (e.key === "ArrowRight") show(currentIndex + 1);
    });
  }

  /* ========================================================================
     8. Yorumlar Slider
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
     9. SSS Accordion
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
     10. Scroll Reveal Animasyonları
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
     11. Yukarı Çık Butonu
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
     12. Aktif Nav Linki (Scrollspy)
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
     13. Footer Yılı
     ======================================================================== */
  function initFooterYear() {
    const el = qs("#current-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ========================================================================
     14. Başlatma
     ======================================================================== */
  function init() {
    initHeader();
    initWhatsAppLinks();
    initServiceCards();
    initBeforeAfterSliders();
    initLightbox();
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
