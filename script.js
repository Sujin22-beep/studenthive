document.addEventListener("DOMContentLoaded", () => {
  /* ===== Mobile menu ===== */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const toggleIcon = menuToggle.querySelector("i");

  const setMenu = (open) => {
    navLinks.classList.toggle("open", open);
    toggleIcon.classList.toggle("fa-bars", !open);
    toggleIcon.classList.toggle("fa-xmark", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  };

  menuToggle.addEventListener("click", () => {
    setMenu(!navLinks.classList.contains("open"));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMenu(false);
  });

  /* ===== Navbar shadow on scroll ===== */
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.style.boxShadow =
      window.scrollY > 10 ? "0 4px 16px rgba(0,0,0,0.08)" : "0 2px 10px rgba(0,0,0,0.05)";
  });

  /* ===== Animated stat counters ===== */
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const heading = el.querySelector("h3");
    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      heading.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll(".stat").forEach((stat) => statObserver.observe(stat));

  /* ===== Testimonial slider ===== */
  const track = document.getElementById("testimonialTrack");
  const cards = Array.from(track.querySelectorAll(".testimonial-card"));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let currentIndex = 0;
  let autoSlide;

  const visibleCount = () => {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 1100) return 2;
    return 3;
  };

  const maxIndex = () => Math.max(cards.length - visibleCount(), 0);

  const updateSlider = () => {
    if (currentIndex > maxIndex()) currentIndex = 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 18;
    const step = cards[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(-${currentIndex * step}px)`;
  };

  const goNext = () => {
    currentIndex = currentIndex >= maxIndex() ? 0 : currentIndex + 1;
    updateSlider();
  };

  const goPrev = () => {
    currentIndex = currentIndex <= 0 ? maxIndex() : currentIndex - 1;
    updateSlider();
  };

  const restartAuto = () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(goNext, 5000);
  };

  nextBtn.addEventListener("click", () => {
    goNext();
    restartAuto();
  });

  prevBtn.addEventListener("click", () => {
    goPrev();
    restartAuto();
  });

  window.addEventListener("resize", updateSlider);
  updateSlider();
  restartAuto();

  /* ===== Category cards ===== */
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(`Category selected: ${card.dataset.category}`);
    });
  });

  /* ===== Details buttons ===== */
  document.querySelectorAll(".details-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.closest(".event-body").querySelector("h3").textContent;
      alert(`Details for: ${title}\n(Connect this to your event details page)`);
    });
  });

  /* ===== Newsletter validation ===== */
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("emailInput");
  const formMsg = document.getElementById("formMsg");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const showMessage = (text, type) => {
    formMsg.textContent = text;
    formMsg.className = `form-msg ${type}`;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      showMessage("Please enter your email address.", "error");
    } else if (!emailRegex.test(email)) {
      showMessage("Please enter a valid email address.", "error");
    } else {
      showMessage("Thank you! You are subscribed to StudentHive updates.", "success");
      form.reset();
    }
  });
});