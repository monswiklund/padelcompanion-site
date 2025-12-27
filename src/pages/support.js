document.addEventListener("DOMContentLoaded", () => {
  initSearch();
  initFeedback();
  initContactForm();
});

function initSearch() {
  const searchInput = document.getElementById("faqSearch");
  const faqCategories = document.querySelectorAll(".faq-category");
  const noResults = document.getElementById("no-results");

  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    let hasResults = false;

    faqCategories.forEach((category) => {
      const items = category.querySelectorAll(".faq-item");
      let hasVisibleItems = false;

      items.forEach((item) => {
        const question = item
          .querySelector("summary")
          .textContent.toLowerCase();
        const answer = item
          .querySelector(".faq-answer")
          .textContent.toLowerCase();

        if (question.includes(query) || answer.includes(query)) {
          item.style.display = "block";
          hasVisibleItems = true;
          hasResults = true;
          // Highlight match? (Optional complexity)
        } else {
          item.style.display = "none";
        }
      });

      // Hide category if no items match
      category.style.display = hasVisibleItems ? "block" : "none";
    });

    if (noResults) {
      noResults.classList.toggle("hidden", hasResults);
    }
  });
}

function initFeedback() {
  const feedbackButtons = document.querySelectorAll(".faq-feedback button");

  feedbackButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const parent = this.closest(".faq-feedback");

      // Visual feedback
      parent.innerHTML =
        '<span class="feedback-thanks">Thanks for your feedback!</span>';

      // Here you would typically send analytics event
      // console.log('Feedback:', this.classList.contains('thumbs-up') ? 'up' : 'down');
    });
  });
}

const presetMessages = {
  "General Inquiry": {
    subtitle: "We'll get back to you within 24 hours.",
    body: "Hi Padel Companion,\n\nI have a question about...",
  },
  "Bug Report": {
    subtitle: "Help us squash this bug! Please be as detailed as possible.",
    body: "Hi Team,\n\nI found a bug.\n\nSteps to reproduce:\n1. \n2. \n3. \n\nExpected behavior:\n\nActual behavior:\n",
  },
  "Feature Request": {
    subtitle: "We love new ideas! Tell us what would make the app better.",
    body: "Hi Team,\n\nI have an idea for a feature:\n\n",
  },
  Partnership: {
    subtitle: "Let's work together!",
    body: "Hi,\n\nI'm interested in partnering with Padel Companion because...",
  },
};

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const subjectSelect = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const subtitleEl = document.getElementById("formSubtitle");

  // Handle preset changes
  if (subjectSelect && messageInput) {
    subjectSelect.addEventListener("change", (e) => {
      const subject = e.target.value;
      const preset = presetMessages[subject];

      if (preset) {
        // Update subtitle if element exists
        if (subtitleEl) {
          subtitleEl.textContent = preset.subtitle;
          subtitleEl.style.display = "block";
          subtitleEl.className = "form-hint animate-fade-in";
          subtitleEl.style.color = "var(--accent)";
          subtitleEl.style.marginTop = "8px";
        }

        // Only update body if empty or matches another preset (don't overwrite user text)
        const currentVal = messageInput.value.trim();
        const isPreset = Object.values(presetMessages).some(
          (p) => p.body.trim() === currentVal
        );

        if (!currentVal || isPreset) {
          messageInput.value = preset.body;
        }
      }
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    let bodyContent = `${message}\n\n`;
    bodyContent += `--------------------------------\n`;
    bodyContent += `Sender: ${name}\n`;
    bodyContent += `Email: ${email}\n`;

    // Add technical details for Bug Reports
    if (subject === "Bug Report") {
      bodyContent += `--------------------------------\n`;
      bodyContent += `Technical Details:\n`;
      bodyContent += `Browser: ${navigator.userAgent}\n`;
      bodyContent += `Screen: ${window.screen.width}x${window.screen.height}\n`;
      bodyContent += `Page: ${window.location.pathname}\n`;
    }

    const mailtoLink = `mailto:wiklund.labs@gmail.com?subject=${encodeURIComponent(
      subject
    )} - ${encodeURIComponent(name)}&body=${encodeURIComponent(bodyContent)}`;

    // Check for length limit (approx 2000 chars is a safe limit for most browsers)
    if (mailtoLink.length > 2000) {
      alert(
        "Your message is too long for the default email client. Please shorten it or email us directly at wiklund.labs@gmail.com"
      );
      return;
    }

    window.location.href = mailtoLink;
  });
}
