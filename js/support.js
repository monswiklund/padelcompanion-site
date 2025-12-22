document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initFeedback();
  initContactForm();
});

function initSearch() {
  const searchInput = document.getElementById('faqSearch');
  const faqCategories = document.querySelectorAll('.faq-category');
  const noResults = document.getElementById('no-results');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    let hasResults = false;

    faqCategories.forEach(category => {
      const items = category.querySelectorAll('.faq-item');
      let hasVisibleItems = false;

      items.forEach(item => {
        const question = item.querySelector('summary').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(query) || answer.includes(query)) {
          item.style.display = 'block';
          hasVisibleItems = true;
          hasResults = true;
          // Highlight match? (Optional complexity)
        } else {
          item.style.display = 'none';
        }
      });

      // Hide category if no items match
      category.style.display = hasVisibleItems ? 'block' : 'none';
    });

    if (noResults) {
      noResults.classList.toggle('hidden', hasResults);
    }
  });
}

function initFeedback() {
  const feedbackButtons = document.querySelectorAll('.faq-feedback button');

  feedbackButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const parent = this.closest('.faq-feedback');
      
      // Visual feedback
      parent.innerHTML = '<span class="feedback-thanks">Thanks for your feedback!</span>';
      
      // Here you would typically send analytics event
      // console.log('Feedback:', this.classList.contains('thumbs-up') ? 'up' : 'down');
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    let bodyContent = `${message}\n\n`;
    bodyContent += `--------------------------------\n`;
    bodyContent += `Sender: ${name}\n`;
    bodyContent += `Email: ${email}\n`;

    // Add technical details for Bug Reports
    if (subject === 'Bug Report') {
      bodyContent += `--------------------------------\n`;
      bodyContent += `Technical Details:\n`;
      bodyContent += `Browser: ${navigator.userAgent}\n`;
      bodyContent += `Screen: ${window.screen.width}x${window.screen.height}\n`;
      bodyContent += `Page: ${window.location.pathname}\n`;
    }

    const mailtoLink = `mailto:wiklund.labs@gmail.com?subject=${encodeURIComponent(subject)} - ${encodeURIComponent(name)}&body=${encodeURIComponent(bodyContent)}`;

    // Check for length limit (approx 2000 chars is a safe limit for most browsers)
    if (mailtoLink.length > 2000) {
      alert("Your message is too long for the default email client. Please shorten it or email us directly at wiklund.labs@gmail.com");
      return;
    }

    window.location.href = mailtoLink;
    
    // Optional: Reset form or show success message
    // form.reset(); // Kept commented out so user doesn't lose text if mail client fails to open
  });
}
