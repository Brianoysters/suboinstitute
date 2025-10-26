// script.js
gsap.registerPlugin(ScrollTrigger);

// Page intro animations
gsap.from("header", { y: -40, opacity: 0, duration: 0.8, ease: "power2.out" });
gsap.from(".hero-left h2", { y: 20, opacity: 0, duration: 0.9, delay: 0.2 });
gsap.from(".hero-left p", { y: 20, opacity: 0, duration: 0.9, delay: 0.35 });
gsap.from(".hero-right", { scale: 0.95, opacity: 0, duration: 0.9, delay: 0.45 });

// Stagger reveal for courses
gsap.utils.toArray(".course-card").forEach((card, i) => {
  gsap.from(card, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.1 + i * 0.06,
    scrollTrigger: { trigger: card, start: "top 80%" }
  });
});

// Parallax hero card
gsap.to(".hero-right", {
  yPercent: 8,
  ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
});

// Nav highlight on scroll
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

// Smooth scrolling for nav links
document.querySelectorAll("a[href^='#']").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

// Form handlers (demo)
document.getElementById("regForm").addEventListener("submit", e => {
  e.preventDefault();
  const fm = new FormData(e.target);
  alert(`Application submitted — we will contact you at ${fm.get("email")}`);
  e.target.reset();
});
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const fm = new FormData(e.target);
  alert(`Message received — thanks ${fm.get("name")}`);
  e.target.reset();
});

// Header shadow on scroll
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  header.style.boxShadow = window.scrollY > 10 ? "0 8px 30px rgba(2,8,23,0.15)" : "none";
});
