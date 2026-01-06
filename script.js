/* ============================================================================ */
/* PORTFOLIO WEBSITE JAVASCRIPT */
/* ============================================================================ */
/* This file contains all interactive functionality for Surya Prakash's portfolio */
/* website including smooth scrolling, animations, form validation, and more. */
/*  */
/* Features Implemented: */
/* 1. Mobile Navigation Toggle */
/* 2. Smooth Scroll Navigation */
/* 3. Typing Animation for Hero Subtitle */
/* 4. Scroll-Triggered Animations */
/* 5. Skill Progress Bar Animation */
/* 6. Project Filtering System */
/* 7. Contact Form Validation */
/* 8. Scroll to Top Button */
/* 9. Active Navigation Highlighting */
/* 10. Hamburger Menu Close on Link Click */
/* ============================================================================ */

/* ============================================================================ */
/* 1. INITIALIZATION & DOM ELEMENTS CACHING */
/* ============================================================================ */
/* Cache frequently accessed DOM elements for better performance */
/* ================= FIREBASE SETUP ================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyCc2TOWAStlZh00qw6nRincYY5kWfiQf70",
  authDomain: "portfolio-contact-a685f.firebaseapp.com",
  projectId: "portfolio-contact-a685f",
  storageBucket: "portfolio-contact-a685f.appspot.com",
  messagingSenderId: "1098935254106",
  appId: "1:1098935254106:web:f15c9736ae737e40476c63"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Correct ONLY if email.min.js is loaded in HTML
emailjs.init("yimsNvie3mecjdnFo");
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const typingText = document.getElementById('typing-text');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const backToTopBtn = document.getElementById('backToTop');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const skillProgressBars = document.querySelectorAll('.skill-progress');

/* ============================================================================ */
/* 2. TYPING ANIMATION FOR HERO SECTION */
/* ============================================================================ */
/* Creates a typewriter effect for the hero subtitle */

const typingPhrases = [
    'B.Tech AI/ML Fresher',
    'Cloud & DevOps Enthusiast',
    'Mobile App Developer',
    'Machine Learning Practitioner',
    'Problem Solver'
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeAnimation() {
    const currentPhrase = typingPhrases[currentPhraseIndex];

    if (isDeleting) {
        /* Deleting characters */
        currentCharIndex--;
    } else {
        /* Typing characters */
        currentCharIndex++;
    }

    /* Update the typing text */
    typingText.textContent = currentPhrase.substring(0, currentCharIndex);

    /* Determine timing based on whether typing or deleting */
    let timeout;
    if (isDeleting) {
        timeout = deletingSpeed;
    } else {
        timeout = typingSpeed;
    }

    /* Check if phrase is completely typed or deleted */
    if (!isDeleting && currentCharIndex === currentPhrase.length) {
        /* Phrase is complete, prepare to delete */
        timeout = pauseTime;
        isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
        /* Phrase is deleted, move to next phrase */
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % typingPhrases.length;
    }

    /* Schedule next animation frame */
    setTimeout(typeAnimation, timeout);
}

/* Start typing animation when page loads */
if (typingText) {
    typeAnimation();
}

/* ============================================================================ */
/* 3. MOBILE NAVIGATION TOGGLE */
/* ============================================================================ */
/* Handle hamburger menu click and menu item clicks */

if (hamburger) {
    /* Toggle hamburger menu when clicked */
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('mobile-active');
    });
}

/* Close mobile menu when a navigation link is clicked */
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        if (navMenu) {
            navMenu.classList.remove('mobile-active');
        }
    });
});

/* ============================================================================ */
/* 4. SMOOTH SCROLL NAVIGATION */
/* ============================================================================ */
/* Implement smooth scrolling with offset for fixed navbar */

function smoothScroll(target) {
    /* Get the target element */
    const element = document.querySelector(target);
    if (!element) return;

    /* Calculate offset (navbar height + some padding) */
    const navbarHeight = 70;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

    /* Smooth scroll to the position */
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/* Add click handlers for navigation links */
navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        /* Get the section from data attribute */
        const section = link.getAttribute('data-section');
        if (section) {
            e.preventDefault();
            smoothScroll(`#${section}`);
        }
    });
});

/* ============================================================================ */
/* 5. NAVBAR BACKGROUND ON SCROLL */
/* ============================================================================ */
/* Add background to navbar when user scrolls down */

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/* ============================================================================ */
/* 6. ACTIVE NAVIGATION LINK HIGHLIGHTING */
/* ============================================================================ */
/* Update active nav link based on scroll position */

function updateActiveNavLink() {
    let currentSection = '';

    /* Get all sections */
    const sections = document.querySelectorAll('section');

    sections.forEach((section) => {
        /* Get the top position of the section */
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;

        /* Check if user is in this section */
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
            currentSection = section.getAttribute('id');
        }
    });

    /* Update active link */
    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

/* ============================================================================ */
/* 7. SCROLL-TRIGGERED ANIMATIONS */
/* ============================================================================ */
/* Animate sections when they become visible in viewport */

function observeSections() {
    /* Create intersection observer options */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    /* Create intersection observer */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                /* Add visible class when section comes into view */
                entry.target.classList.add('visible');
                /* Stop observing this element (animation only plays once) */
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    /* Observe all fade-in sections */
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    fadeInSections.forEach((section) => {
        observer.observe(section);
    });
}

/* Start observing sections when page loads */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeSections);
} else {
    observeSections();
}

/* ============================================================================ */
/* 8. SKILL PROGRESS BAR ANIMATION */
/* ============================================================================ */
/* Animate skill progress bars when they come into view */

function animateSkillBars() {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                /* Get the target width from data attribute */
                const targetWidth = entry.target.getAttribute('data-width');

                /* Animate the progress bar */
                entry.target.style.width = targetWidth;

                /* Stop observing */
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    /* Observe all skill progress bars */
    skillProgressBars.forEach((bar) => {
        observer.observe(bar);
    });
}

/* Start animating skill bars when page loads */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateSkillBars);
} else {
    animateSkillBars();
}

/* ============================================================================ */
/* 9. PROJECT FILTERING SYSTEM */
/* ============================================================================ */
/* Filter projects based on category selection */

filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        /* Remove active class from all buttons */
        filterBtns.forEach((b) => b.classList.remove('active'));

        /* Add active class to clicked button */
        btn.classList.add('active');

        /* Get filter value */
        const filterValue = btn.getAttribute('data-filter');

        /* Filter project cards */
        projectCards.forEach((card) => {
            if (filterValue === 'all') {
                /* Show all projects */
                card.classList.remove('hidden');
                /* Add animation */
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeIn 0.5s ease-out';
                }, 10);
            } else {
                /* Get card category */
                const cardCategory = card.getAttribute('data-category');

                if (cardCategory === filterValue) {
                    /* Show matching projects */
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.5s ease-out';
                } else {
                    /* Hide non-matching projects */
                    card.classList.add('hidden');
                }
            }
        });
    });
});

/* ============================================================================ */
/* 10. CONTACT FORM VALIDATION & SUBMISSION (EMAILJS ENABLED) */
/* ============================================================================ */


const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");

/* ================= VALIDATION ================= */

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(field, message) {
  const input = document.getElementById(field);
  const error = document.getElementById(`${field}-error`);
  input.classList.add("error");
  error.textContent = message;
  error.classList.add("show");
}

function validateForm() {
  document.querySelectorAll(".form-input").forEach(i => i.classList.remove("error"));
  document.querySelectorAll(".error-message").forEach(e => e.classList.remove("show"));

  let isValid = true;

  if (nameInput.value.trim().length < 2) {
    showError("name", "Name must be at least 2 characters");
    isValid = false;
  }

  if (!validateEmail(emailInput.value.trim())) {
    showError("email", "Enter a valid email");
    isValid = false;
  }

  if (subjectInput.value.trim().length < 3) {
    showError("subject", "Subject must be at least 3 characters");
    isValid = false;
  }

  if (messageInput.value.trim().length < 10) {
    showError("message", "Message must be at least 10 characters");
    isValid = false;
  }

  return isValid;
}

/* ================= FORM SUBMISSION ================= */

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  formStatus.textContent = "";
  formStatus.className = "";

  // Honeypot (spam protection)
  if (contactForm.website.value) return;

  if (!validateForm()) {
    formStatus.className = "form-status error";
    formStatus.textContent = "Please fix the errors above";
    return;
  }

  const submitBtn = contactForm.querySelector("button");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  const templateParams = {
    name: nameInput.value,
    email: emailInput.value,
    subject: subjectInput.value,
    message: messageInput.value,
    time: new Date().toLocaleString()
  };

  try {
    await emailjs.send(
      "service_3imbcfn",
      "template_6s3mi0j",
      templateParams
    );

    formStatus.className = "form-status success";
    formStatus.textContent = "Message sent successfully!";
    contactForm.reset();

  } catch (err) {
    console.error("EmailJS error:", err);
    formStatus.className = "form-status error";
    formStatus.textContent = "Failed to send message. Try again.";
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});



/* ============================================================================ */
/* 11. SCROLL TO TOP BUTTON */
/* ============================================================================ */
/* Show/hide back-to-top button based on scroll position */

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        /* Show button when scrolled down */
        backToTopBtn.classList.add('visible');
    } else {
        /* Hide button when near top */
        backToTopBtn.classList.remove('visible');
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        /* Smooth scroll to top */
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================================================ */
/* 12. PAGE LOAD ANIMATION */
/* ============================================================================ */
/* Add animations when page first loads */

window.addEventListener('load', () => {
    /* Trigger animations for initially visible sections */
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        /* Add slight delay between sections */
        setTimeout(() => {
            if (section.classList.contains('fade-in-section')) {
                /* Check if already visible */
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    section.classList.add('visible');
                }
            }
        }, index * 100);
    });
});

/* ============================================================================ */
/* 13. ACCESSIBILITY & KEYBOARD NAVIGATION */
/* ============================================================================ */
/* Improve keyboard navigation support */

document.addEventListener('keydown', (e) => {
    /* Close mobile menu on Escape key */
    if (e.key === 'Escape') {
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        if (navMenu) {
            navMenu.classList.remove('mobile-active');
        }
    }
});

/* ============================================================================ */
/* 14. UTILITY FUNCTIONS */
/* ============================================================================ */
/* Helper functions used throughout the script */

/* Debounce function to limit function call frequency */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* Check if element is in viewport */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

/* ============================================================================ */
/* 15. CUSTOMIZATION GUIDE */
/* ============================================================================ */
/*
 * To customize this portfolio:
 *
 * 1. TYPING PHRASES
 *    - Modify the 'typingPhrases' array to change the cycling text
 *
 * 2. COLORS
 *    - Update CSS variables in styles.css (:root section)
 *
 * 3. SKILL CATEGORIES & ITEMS
 *    - Edit the HTML in index.html for skills section
 *    - Skill percentages update automatically from data-width attribute
 *
 * 4. PROJECTS
 *    - Add/remove project cards in the projects section
 *    - Update data-category attribute to control filtering
 *    - Add appropriate category filter buttons
 *
 * 5. FORM HANDLING
 *    - Currently shows a success message
 *    - To actually send emails, integrate with a backend service (e.g., EmailJS)
 *    - Or use a form service like Formspree, Basin, or similar
 *
 * 6. ANIMATIONS
 *    - Modify timing in CSS (--transition-* variables)
 *    - Adjust animation durations in @keyframes
 *
 * 7. SMOOTH SCROLL OFFSET
 *    - Change navbarHeight value (currently 70) if navbar height changes
 */

/* ============================================================================ */
/* END OF SCRIPT */
/* ============================================================================ */
