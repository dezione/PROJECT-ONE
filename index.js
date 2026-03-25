// MOBILE MENU TOGGLE
const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// SMOOTH SCROLL EFFECT
document.querySelectorAll("a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// NAVBAR SCROLL EFFECT
window.addEventListener("scroll", () => {
  const navBar = document.querySelector("nav");
  if (window.scrollY > 50) {
    navBar.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
  } else {
    navBar.style.boxShadow = "none";
  }
});

// SCROLL ANIMATION (FADE-IN EFFECT)
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".card").forEach(card => {
  card.classList.add("hidden");
  observer.observe(card);
});

// SECURE CONTACT FORM HANDLER
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const messageEl = document.getElementById('form-message');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Clear previous messages
      messageEl.className = '';
      messageEl.textContent = '';
      
      try {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Client-side validation
        if (data.name.length < 2 || data.name.length > 50) {
          throw new Error('Name must be 2-50 characters');
        }
        if (!data.email.includes('@') || !data.email.includes('.')) {
          throw new Error('Please enter a valid email');
        }
        if (data.message.length < 10 || data.message.length > 500) {
          throw new Error('Message must be 10-500 characters');
        }
        
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
          messageEl.textContent = result.message || 'Message sent successfully! 🎉';
          messageEl.className = 'success';
          contactForm.reset();
        } else {
          throw new Error(result.errors?.[0]?.msg || result.error || 'Something went wrong');
        }
      } catch (error) {
        console.error('Contact form error:', error);
        messageEl.textContent = error.message || 'Failed to send message. Please try again.';
        messageEl.className = 'error';
      } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});

// SIMPLE CONTACT LINKS (keep your original interaction)
const contactLinks = document.querySelectorAll(".contact-links a");
contactLinks.forEach(link => {
  link.addEventListener("click", () => {
    // Remove alert, let links work naturally
    console.log('Opening contact:', link.href);
  });
});

// ANALYTICS INTEGRATION (enhance your existing Tinybird)
if (typeof Tinybird !== 'undefined') {
  // Track form submissions
  document.getElementById('contact-form')?.addEventListener('submit', () => {
    Tinybird.trackEvent('contact_submit', {
      form_status: 'submitted'
    });
  });
  
  // Track button clicks
  document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.textContent.toLowerCase().includes('hire') ? 'hire_click' : 'view_work_click';
      Tinybird.trackEvent(action, {
        section: 'hero'
      });
    });
  });
}