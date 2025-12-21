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
    trigger.innerHTML = `<span>${
      select.options[select.selectedIndex].text
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
      });

      optionsDiv.appendChild(optionEl);
    });

    customSelect.appendChild(trigger);
    customSelect.appendChild(optionsDiv);
    wrapper.appendChild(customSelect);

    // Toggle logic
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      // Close other open selects
      document.querySelectorAll(".custom-select.open").forEach((el) => {
        if (el !== customSelect) {
          el.classList.remove("open");
          el.querySelector(".custom-options").classList.remove("show");
        }
      });

      customSelect.classList.toggle("open");
      optionsDiv.classList.toggle("show");
    });

    // Hide original select visually but keep it for logic
    select.style.display = "none";
  });

  // Global click outside to close
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-select")) {
      document.querySelectorAll(".custom-select.open").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".custom-options").classList.remove("show");
      });
    }
  });
}
