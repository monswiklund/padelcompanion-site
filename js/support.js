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

    const mailtoLink = `mailto:wiklund.labs@gmail.com?subject=${encodeURIComponent(subject)} - ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(name)} (${encodeURIComponent(email)})`;

    window.location.href = mailtoLink;
    
    // Optional: Reset form or show success message
    form.reset();
  });
}
