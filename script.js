// script.js
gsap.registerPlugin(ScrollTrigger);

// ---------------- Page Animations ----------------
gsap.from("header", { y: -40, opacity: 0, duration: 0.8, ease: "power2.out" });
gsap.from(".hero-left h2", { y: 20, opacity: 0, duration: 0.9, delay: 0.2 });
gsap.from(".hero-left p", { y: 20, opacity: 0, duration: 0.9, delay: 0.35 });
gsap.from(".hero-right", { scale: 0.95, opacity: 0, duration: 0.9, delay: 0.45 });

// Stagger reveal for course cards
gsap.utils.toArray(".course-card").forEach((card, i) => {
  gsap.from(card, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.1 + i * 0.06,
    scrollTrigger: { trigger: card, start: "top 80%" }
  });
});

// Parallax effect on hero-right
gsap.to(".hero-right", {
  yPercent: 8,
  ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
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
document.querySelectorAll("a[href^='#']").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

// ---------------- Form Handlers (Demo) ----------------
const regForm = document.getElementById("regForm");
if (regForm) {
  regForm.addEventListener("submit", e => {
    e.preventDefault();
    const fm = new FormData(e.target);
    alert(`Application submitted — we will contact you at ${fm.get("email")}`);
    e.target.reset();
  });
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const fm = new FormData(e.target);
    alert(`Message received — thanks ${fm.get("name")}`);
    e.target.reset();
  });
}

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
});

// Enable submit button only when terms are accepted
document.addEventListener("DOMContentLoaded", () => {
  const termsCheck = document.getElementById("termsCheck");
  const submitBtn = document.getElementById("submitBtn");
  if (termsCheck && submitBtn) {
    termsCheck.addEventListener("change", () => {
      submitBtn.disabled = !termsCheck.checked;
      submitBtn.style.opacity = termsCheck.checked ? "1" : "0.6";
      submitBtn.style.cursor = termsCheck.checked ? "pointer" : "not-allowed";
    });
  }
});

// Terms and form validation + live submission
document.addEventListener("DOMContentLoaded", () => {
  const termsCheck = document.getElementById("termsCheck");
  const submitBtn = document.getElementById("submitBtn");
  const form = document.getElementById("regForm");

  if (termsCheck && submitBtn) {
    termsCheck.addEventListener("change", () => {
      submitBtn.disabled = !termsCheck.checked;
      submitBtn.style.opacity = termsCheck.checked ? "1" : "0.6";
      submitBtn.style.cursor = termsCheck.checked ? "pointer" : "not-allowed";
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!termsCheck.checked) {
        alert("⚠️ Please accept the Terms and Conditions before submitting.");
        return;
      }

      const data = Object.fromEntries(new FormData(form));

      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          alert("✅ Application submitted successfully! We’ll contact you soon.");
          form.reset();
          submitBtn.disabled = true;
        } else {
          alert("❌ Submission failed. Please try again later.");
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ Network error — check your internet connection.");
      }
    });
  }
});
