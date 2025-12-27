// Custom Select Module
// Enhanced dropdown UI logic with proper lifecycle management

// Track global listeners for cleanup
let globalListenersAttached = false;
let clickHandler = null;
let scrollHandler = null;

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
        resetOptionsStyles(optionsDiv);
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
      closeAllSelects(customSelect);

      if (isOpen) {
        // Closing current
        customSelect.classList.remove("open");
        optionsDiv.classList.remove("show");

        // Return to parent
        if (optionsDiv.parentElement === document.body) {
          customSelect.appendChild(optionsDiv);
        }

        resetOptionsStyles(optionsDiv);
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

  // Attach global listeners only once
  if (!globalListenersAttached) {
    attachGlobalListeners();
  }

  // Clean up orphaned options that may have been left in body
  cleanOrphanedOptions();
}

/**
 * Reset inline styles on options div
 */
function resetOptionsStyles(optionsDiv) {
  optionsDiv.style.position = "";
  optionsDiv.style.top = "";
  optionsDiv.style.left = "";
  optionsDiv.style.width = "";
  optionsDiv.style.margin = "";
}

/**
 * Close all open custom selects, optionally excluding one
 */
function closeAllSelects(exclude = null) {
  document.querySelectorAll(".custom-select.open").forEach((el) => {
    if (el === exclude) return;

    el.classList.remove("open");
    const opts = el.customOptions || el.querySelector(".custom-options");
    if (opts) {
      opts.classList.remove("show");
      // Return to parent if in body
      if (opts.parentElement === document.body) {
        el.appendChild(opts);
      }
      resetOptionsStyles(opts);
    }
  });
}

/**
 * Attach global event listeners for closing dropdowns
 */
function attachGlobalListeners() {
  // Global click outside to close
  clickHandler = (e) => {
    if (
      !e.target.closest(".custom-select") &&
      !e.target.closest(".custom-options")
    ) {
      closeAllSelects();
    }
  };
  document.addEventListener("click", clickHandler);

  // Close on scroll (prevent floating) - but NOT if scrolling inside the dropdown
  scrollHandler = (e) => {
    // Don't close if scrolling inside the dropdown options
    if (e.target.closest && e.target.closest(".custom-options")) {
      return;
    }
    closeAllSelects();
  };
  document.addEventListener("scroll", scrollHandler, true); // Capture phase

  globalListenersAttached = true;
}

/**
 * Clean up orphaned options that were left in body
 * (happens when components are removed without proper cleanup)
 */
function cleanOrphanedOptions() {
  document.querySelectorAll("body > .custom-options").forEach((el) => {
    // Check if owner still exists in DOM
    if (!el._owner || !document.body.contains(el._owner)) {
      el.remove();
    }
  });
}

/**
 * Destroy all custom selects and clean up resources
 * Call this when unmounting a page that uses custom selects
 */
export function destroyCustomSelects() {
  // Close all open selects first
  closeAllSelects();

  // Clean up orphaned options in body
  cleanOrphanedOptions();

  // Remove all custom select wrappers and restore original selects
  document.querySelectorAll(".custom-select-wrapper").forEach((wrapper) => {
    const select = wrapper.querySelector("select.form-select");
    if (select) {
      select.style.display = "";
      wrapper.parentNode.insertBefore(select, wrapper);
    }
    wrapper.remove();
  });

  // Remove global listeners
  if (globalListenersAttached) {
    if (clickHandler) {
      document.removeEventListener("click", clickHandler);
      clickHandler = null;
    }
    if (scrollHandler) {
      document.removeEventListener("scroll", scrollHandler, true);
      scrollHandler = null;
    }
    globalListenersAttached = false;
  }
}

/**
 * Refresh a specific select element (useful after options change)
 * @param {HTMLSelectElement} select - The select element to refresh
 */
export function refreshCustomSelect(select) {
  const wrapper = select.closest(".custom-select-wrapper");
  if (!wrapper) return;

  const customSelect = wrapper.querySelector(".custom-select");
  const trigger = wrapper.querySelector(".custom-select-trigger");
  const optionsDiv = wrapper.querySelector(".custom-options");

  if (!customSelect || !trigger || !optionsDiv) return;

  // Update trigger text
  const selectedOption =
    select.selectedIndex >= 0 ? select.options[select.selectedIndex] : null;
  trigger.innerHTML = `<span>${
    selectedOption ? selectedOption.text : "Select..."
  }</span>`;

  // Clear and repopulate options
  optionsDiv.innerHTML = "";
  Array.from(select.options).forEach((option) => {
    const optionEl = document.createElement("div");
    optionEl.classList.add("custom-option");
    optionEl.textContent = option.text;
    optionEl.dataset.value = option.value;
    if (option.selected) optionEl.classList.add("selected");

    optionEl.addEventListener("click", () => {
      select.value = optionEl.dataset.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      trigger.innerHTML = `<span>${optionEl.textContent}</span>`;
      optionsDiv
        .querySelectorAll(".custom-option")
        .forEach((el) => el.classList.remove("selected"));
      optionEl.classList.add("selected");
      customSelect.classList.remove("open");
      optionsDiv.classList.remove("show");
      resetOptionsStyles(optionsDiv);
    });

    optionsDiv.appendChild(optionEl);
  });
}
