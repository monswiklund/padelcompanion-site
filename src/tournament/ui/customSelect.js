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

    // Clean up orphans first
    const cleanOrphans = () => {
      document.querySelectorAll("body > .custom-options").forEach((el) => {
        if (el._owner && !document.body.contains(el._owner)) {
          el.remove();
        }
      });
    };
    cleanOrphans();

    // Toggle logic
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = customSelect.classList.contains("open");

      // Close other open selects
      document.querySelectorAll(".custom-select.open").forEach((el) => {
        if (el !== customSelect) {
          el.classList.remove("open");
          if (el.customOptions) {
            el.customOptions.classList.remove("show");
            // Return to parent if in body
            if (el.customOptions.parentElement === document.body) {
              el.appendChild(el.customOptions);
            }
            // Reset styles
            el.customOptions.style.position = "";
            el.customOptions.style.top = "";
            el.customOptions.style.left = "";
            el.customOptions.style.width = "";
            el.customOptions.style.margin = "";
          }
        }
      });

      if (isOpen) {
        // Closing current
        customSelect.classList.remove("open");
        optionsDiv.classList.remove("show");

        // Return to parent
        if (optionsDiv.parentElement === document.body) {
          customSelect.appendChild(optionsDiv);
        }

        optionsDiv.style.position = "";
        optionsDiv.style.top = "";
        optionsDiv.style.left = "";
        optionsDiv.style.width = "";
        optionsDiv.style.margin = "";
      } else {
        // Opening current
        customSelect.classList.add("open");

        // Move to body (Portal)
        document.body.appendChild(optionsDiv);
        optionsDiv.classList.add("show");

        // Calculate fixed position
        const rect = customSelect.getBoundingClientRect();
        optionsDiv.style.position = "fixed";
        optionsDiv.style.top = `${rect.bottom + 4}px`;
        optionsDiv.style.left = `${rect.left}px`;
        optionsDiv.style.width = `${rect.width}px`;
        optionsDiv.style.zIndex = "9999";
        optionsDiv.style.margin = "0";
      }
    });

    // Hide original select visually but keep it for logic
    select.style.display = "none";

    // Link options to wrapper for global close
    customSelect.customOptions = optionsDiv;
    optionsDiv._owner = customSelect; // For orphan cleanup
  });

  // Global click outside to close
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-select")) {
      closeAllSelects();
    }
  });

  // Close on scroll (prevent floating) - but NOT if scrolling inside the dropdown
  document.addEventListener(
    "scroll",
    (e) => {
      // Don't close if scrolling inside the dropdown options
      if (e.target.closest && e.target.closest(".custom-options")) {
        return;
      }
      closeAllSelects();
    },
    true
  ); // Capture phase to catch scroll on any element

  function closeAllSelects() {
    document.querySelectorAll(".custom-select.open").forEach((el) => {
      el.classList.remove("open");
      const opts = el.customOptions || el.querySelector(".custom-options");
      if (opts) {
        opts.classList.remove("show");
        // Return to parent if in body
        if (opts.parentElement === document.body) {
          el.appendChild(opts);
        }
        opts.style.position = "";
        opts.style.top = "";
        opts.style.left = "";
        opts.style.width = "";
        opts.style.margin = "";
      }
    });
  }
}
