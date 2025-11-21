import { createBaseModal } from "./baseModal.js";

/**
 * Shows a confirmation modal dialog.
 * @param {string} header - Header text for the modal.
 * @param {string} message - The confirmation message to display.
 * @param {Object} [options] - Optional settings.
 * @returns {Promise<boolean>} Resolves to true if confirmed, false if cancelled.
 */
export function confirmModal(header, message, options = {}) {
  return new Promise((resolve) => {
    const content = [];
    if (header) {
      const headerElem = document.createElement("h2");
      headerElem.textContent = header;
      headerElem.className = "text-lg font-semibold mb-2";
      content.push(headerElem);
    }
    // Support multiline messages with line breaks
    const lines = String(message).split("\n");
    lines.forEach((line, idx) => {
      content.push(document.createTextNode(line));
      if (idx < lines.length - 1) {
        content.push(document.createElement("br"));
      }
    });
    content.push(document.createElement("br"));
    content.push(document.createElement("br"));

    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.justifyContent = "flex-end";
    btnContainer.style.gap = "0.5rem";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300";
    cancelBtn.onclick = () => {
      modal.close();
      resolve(false);
    };

    const okBtn = document.createElement("button");
    okBtn.textContent = "OK";
    okBtn.className = "px-3 py-2 rounded-md bg-[var(--color-cta)] text-white hover:bg-[var(--color-cta-hover)]";
    okBtn.onclick = () => {
      modal.close();
      resolve(true);
    };

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(okBtn);
    content.push(btnContainer);

    const modal = createBaseModal(options, () => content);
    modal.openModal();
  });
}
