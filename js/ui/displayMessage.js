import { createBaseModal } from "./baseModal.js";

/**
 * Displays a modal message using the base modal system.
 * @param {string} title - The title of the message.
 * @param {string} message - The message content.
 */
export function displayMessage(title, message) {
  return new Promise((resolve) => {
    const modal = createBaseModal({}, (onSubmit, close) => {
      const wrapper = document.createElement("div");
      const titleEl = document.createElement("h2");
      titleEl.textContent = title;
      titleEl.className = "text-lg font-semibold mb-2";
      const msgEl = document.createElement("p");
      msgEl.textContent = message;
      msgEl.className = "mb-4";
      const okBtn = document.createElement("button");
      okBtn.textContent = "OK";
      okBtn.className = "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700";
      okBtn.addEventListener("click", () => {
        close();
        resolve();
      });
      wrapper.appendChild(titleEl);
      wrapper.appendChild(msgEl);
      wrapper.appendChild(okBtn);
      return [wrapper];
    });
    modal.openModal();
  });
}
