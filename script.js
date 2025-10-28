// script.js
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ---------------- Page Animations ----------------
gsap.from("header", { y: -40, opacity: 0, duration: 0.8, ease: "power2.out" });
gsap.from(".hero-left h2", { y: 20, opacity: 0, duration: 0.9, delay: 0.2 });
gsap.from(".hero-left p", { y: 20, opacity: 0, duration: 0.9, delay: 0.35 });
gsap.from(".hero-right", { scale: 0.95, opacity: 0, duration: 0.9, delay: 0.45 });

// Stagger reveal for various elements
const animateIn = (elem, delay = 0, y = 30) => {
  gsap.from(elem, {
    y,
    opacity: 0,
    duration: 0.8,
    delay,
    scrollTrigger: { trigger: elem, start: "top 85%" }
  });
};

gsap.utils.toArray(".course-card, .step-card, .support-card, .footer-col").forEach((card, i) => {
  animateIn(card, 0.1 + (i % 3) * 0.1);
});

gsap.utils.toArray(".section h3, .section .lead, .courses-grid, .admission-details, .admission-form, .contact-grid").forEach(el => {
  animateIn(el);
});

// Parallax effect on hero-right
gsap.to(".hero-right", {
  yPercent: 8,
  ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
});

// ---------------- Page Transitions ----------------
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      
      // Ignore links that don't navigate away
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      
      e.preventDefault();
      document.body.classList.add('fade-out');
      
      setTimeout(() => {
        window.location.href = href;
      }, 400); // Match this to the CSS transition duration
    });
  });
  
  // On page load, remove the pre-fade class to trigger the fade-in
  window.addEventListener('load', () => {
    document.body.classList.remove('pre-fade');
  });
});

// ---------------- Nav Highlight on Scroll ----------------
const sections = document.querySelectorAll("main section");
sections.forEach(sec => {
  ScrollTrigger.create({
    trigger: sec,
    start: "top center",
    end: "bottom center",
    onEnter: () => setActive(sec.id),
    onEnterBack: () => setActive(sec.id)
  });
});
function setActive(id) {
  document.querySelectorAll("nav a").forEach(a => a.classList.remove("active"));
  const el = document.querySelector(`nav a[href='#${id}']`);
  if (el) el.classList.add("active");
}

// ---------------- Smooth Scrolling ----------------
document.querySelectorAll("a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent other click events

    const href = this.getAttribute("href");
    const body = document.body;

    // If mobile nav is open, close it first
    if (body.classList.contains('nav-open')) {
      body.classList.remove('nav-open');
      document.querySelector('.nav-right').classList.remove('active');
    }

    // Now, scroll to the target
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: href, offsetY: 80 },
      ease: "power3.inOut"
    });
  });
});


// ---------------- Header Shadow ----------------
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  header.style.boxShadow = window.scrollY > 10 ? "0 8px 30px rgba(2,8,23,0.15)" : "none";
});

// ---------------- Leaflet Map Fix ----------------
document.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.getElementById('map');
  if (mapContainer) {
    const map = L.map(mapContainer, { zoomControl: true }).setView([-1.2865, 36.8256], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([-1.2865, 36.8256])
      .addTo(map)
      .bindPopup('<b>SUBOMAP Institute</b><br>Tumaini House, Nairobi CBD')
      .openPopup();

    // Force Leaflet to recalculate map size once visible
    setTimeout(() => {
      map.invalidateSize();
    }, 400);
  }

  // --- Existing Form Functionality ---
  const regForm = document.getElementById("regForm");
  const contactForm = document.getElementById("contactForm");
  const termsCheck = document.getElementById("termsCheck");
  const submitBtn = document.getElementById("submitBtn");

  // Enable submit button only when terms are accepted
  if (termsCheck && submitBtn) {
    termsCheck.addEventListener("change", () => {
      submitBtn.disabled = !termsCheck.checked;
      submitBtn.style.opacity = termsCheck.checked ? "1" : "0.6";
      submitBtn.style.cursor = termsCheck.checked ? "pointer" : "not-allowed";
    });
  }

  // Registration Form Submission
  if (regForm) {
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (termsCheck && !termsCheck.checked) {
        alert("⚠️ Please accept the Terms and Conditions before submitting.");
        return;
      }

      const formData = new FormData(regForm);

      try {
        const res = await fetch(regForm.action, {
          method: "POST",
          body: formData,
          headers: { 
            'Accept': 'application/json'
          },
        });

        if (res.ok) {
          alert("✅ Application submitted successfully! We’ll contact you soon.");
          regForm.reset();
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.6";
            submitBtn.style.cursor = "not-allowed";
          }
          if(termsCheck) termsCheck.checked = false;
        } else {
          alert("❌ Submission failed. Please try again later.");
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ Network error — check your internet connection.");
      }
    });
  }

  // Contact Form Submission
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      try {
        const res = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: { 
            'Accept': 'application/json'
          },
        });

        if (res.ok) {
          alert(`✅ Message received — thanks, ${data.name}!`);
          contactForm.reset();
        } else {
          alert("❌ Message sending failed. Please try again later.");
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ Network error — check your internet connection.");
      }
    });
  }
});