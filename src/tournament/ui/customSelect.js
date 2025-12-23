// Custom Select Module
// Enhanced dropdown UI logic

/**
 * Setup custom styled select dropdowns
 */
export function setupCustomSelects() {
  const selects = document.querySelectorAll(".form-select");

  selects.forEach((select) => {
    // Skip if already initialized or if explicitly excluded
    if (
      select.closest(".custom-select-wrapper") ||
      select.classList.contains("no-custom")
    )
      return;

    const wrapper = document.createElement("div");
    wrapper.classList.add("custom-select-wrapper");
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    // Create custom UI
    const customSelect = document.createElement("div");
    customSelect.classList.add("custom-select");

    const trigger = document.createElement("div");
    trigger.classList.add("custom-select-trigger");
    if (select.classList.contains("btn-sm")) {
      trigger.classList.add("btn-sm");
    }
    if (select.classList.contains("compact-select")) {
      wrapper.classList.add("compact-select");
      trigger.classList.add("compact-select");
    }
    const selectedOption =
      select.selectedIndex >= 0
        ? select.options[select.selectedIndex]
        : select.options.length > 0
        ? select.options[0]
        : null;

    trigger.innerHTML = `<span>${
      selectedOption ? selectedOption.text : "Select..."
    }</span>`;

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("custom-options");

    // Populate options
    Array.from(select.options).forEach((option) => {
      const optionEl = document.createElement("div");
      optionEl.classList.add("custom-option");
      optionEl.textContent = option.text;
      optionEl.dataset.value = option.value;
      if (option.selected) optionEl.classList.add("selected");

      optionEl.addEventListener("click", () => {
        // Update original select
        select.value = optionEl.dataset.value;
        // Dispatch event with bubbling
        select.dispatchEvent(new Event("change", { bubbles: true }));

        // Update UI
        trigger.innerHTML = `<span>${optionEl.textContent}</span>`;
        optionsDiv
          .querySelectorAll(".custom-option")
          .forEach((el) => el.classList.remove("selected"));
        optionEl.classList.add("selected");

        // Close
        customSelect.classList.remove("open");
        optionsDiv.classList.remove("show");
        optionsDiv.style.position = "";
        optionsDiv.style.top = "";
        optionsDiv.style.left = "";
        optionsDiv.style.width = "";
      });

      optionsDiv.appendChild(optionEl);
    });

    customSelect.appendChild(trigger);
    customSelect.appendChild(optionsDiv);
    wrapper.appendChild(customSelect);

    // Toggle logic
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = customSelect.classList.contains("open");

      // Close other open selects
      document.querySelectorAll(".custom-select.open").forEach((el) => {
        if (el !== customSelect) {
          el.classList.remove("open");
          el.querySelector(".custom-options").classList.remove("show");
          // Reset fixed positioning for others
          const otherOpts = el.querySelector(".custom-options");
          otherOpts.style.position = "";
          otherOpts.style.top = "";
          otherOpts.style.left = "";
          otherOpts.style.width = "";
          otherOpts.style.margin = "";
        }
      });

      if (isOpen) {
        // Closing current
        customSelect.classList.remove("open");
        optionsDiv.classList.remove("show");
        // Reset styles after transition?
        // Better to reset immediately to avoid layout jumps if transitioned
        // But transition relies on it being there.
        // Let's just unset properties.
        optionsDiv.style.position = "";
        optionsDiv.style.top = "";
        optionsDiv.style.left = "";
        optionsDiv.style.width = "";
        optionsDiv.style.margin = "";
      } else {
        // Opening current
        customSelect.classList.add("open");
        optionsDiv.classList.add("show");

        // Calculate fixed position
        const rect = customSelect.getBoundingClientRect();
        optionsDiv.style.position = "fixed";
        optionsDiv.style.top = `${rect.bottom + 4}px`; // Add small gap manually
        optionsDiv.style.left = `${rect.left}px`;
        optionsDiv.style.width = `${rect.width}px`;
        optionsDiv.style.zIndex = "9999";
        optionsDiv.style.margin = "0"; // Prevent double spacing from CSS
      }
    });

    // Hide original select visually but keep it for logic
    select.style.display = "none";
  });

  // Global click outside to close
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-select")) {
      closeAllSelects();
    }
  });

  // Close on scroll (prevent floating)
  document.addEventListener(
    "scroll",
    () => {
      closeAllSelects();
    },
    true
  ); // Capture phase to catch scroll on any element

  function closeAllSelects() {
    document.querySelectorAll(".custom-select.open").forEach((el) => {
      el.classList.remove("open");
      const opts = el.querySelector(".custom-options");
      opts.classList.remove("show");
      opts.style.position = "";
      opts.style.top = "";
      opts.style.left = "";
      opts.style.width = "";
      opts.style.margin = "";
    });
  }
}
