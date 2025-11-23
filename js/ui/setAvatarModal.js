import { createBaseModal } from "./baseModal.js";
import { validateAvatarImageUrl, validateAvatarAltText } from "./validation/userValidation.js";

/**
 * Opens a modal to set a new avatar image.
 * @param {Function} onSubmit - Callback to handle avatar URL submission.
 */
export function setAvatarModal(onSubmit) {
  function createNodes() {
    const form = document.createElement("form");
    form.className = "flex flex-col gap-4";
    form.innerHTML = `
      <label class="font-semibold" for="avatar-url">Avatar Image URL</label>
      <input
        id="avatar-url"
        name="avatar-url"
        placeholder="Paste image URL here"
        class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      <label class="font-semibold mt-2" for="avatar-alt">Alt Text</label>
      <input
        id="avatar-alt"
        name="avatar-alt"
        placeholder="Describe the image (for accessibility)"
        class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      <div class="flex justify-end gap-2">
        <button type="button" class="cancel-btn px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button type="submit" class="submit-btn px-4 py-2 rounded bg-[var(--color-cta)] text-white hover:bg-[var(--color-cta-hover)]">Save</button>
      </div>
    `;

    form.querySelector(".cancel-btn").onclick = close;

    form.onsubmit = (e) => {
      e.preventDefault();
      const avatarUrl = form.querySelector("#avatar-url").value.trim();
      const altText = form.querySelector("#avatar-alt").value.trim();

      // Remove any previous error messages
      form.querySelectorAll('.avatar-error').forEach(el => el.remove());
      let valid = true;

      function showError(inputId, message) {
        const input = form.querySelector(inputId);
        const error = document.createElement('div');
        error.className = 'avatar-error text-red-600 mb-2';
        error.textContent = message;
        input.insertAdjacentElement('afterend', error);
      }

      if (!validateAvatarImageUrl(avatarUrl, (msg) => showError('#avatar-url', msg))) {
        valid = false;
      }
      if (!validateAvatarAltText(altText, (msg) => showError('#avatar-alt', msg))) {
        valid = false;
      }

      if (valid && typeof onSubmit === "function") {
        onSubmit({ url: avatarUrl, alt: altText });
        close();
      }
    };
    return [form];
  }

  const { openModal, close } = createBaseModal({}, createNodes);
  openModal();
}
