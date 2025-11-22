import { el } from "./createElement.js";

/**
 * Creates a password visibility toggle button for a given input.
 * @param {HTMLInputElement} pwInput - The password input element to control.
 * @returns {HTMLButtonElement} The toggle button element.
 */
export function createPasswordToggle(pwInput) {
  let pwVisible = false;
  const toggleBtn = el(
    "button",
    {
      type: "button",
      tabindex: "-1",
      class:
        "absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none",
      'aria-label': "Toggle password visibility",
    },
    el("span", {
      class: "material-symbols-outlined select-none text-xl align-middle eye-icon",
      'aria-hidden': "true"
    }, "visibility")
  );
  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    pwVisible = !pwVisible;
    pwInput.type = pwVisible ? "text" : "password";
    const icon = toggleBtn.querySelector(".eye-icon");
    icon.textContent = pwVisible ? "visibility_off" : "visibility";
  });
  return toggleBtn;
}
