import { createBaseModal } from "./baseModal.js";
import { el } from "./createElement.js";
import { registerUser } from "../api/auth/registerUser.js";
import { displayError } from "./displayError.js";
import { createSignInModal } from "./signInModal.js";
import { validateEmail } from "./formValidation.js";

function createSignUpNodes(onSubmit, close) {
  const nodes = [];
  nodes.push(
    el(
      "h2",
      { class: "text-xl font-semibold mb-4 heading-color" },
      "Create your Bidora account",
    ),
  );
  nodes.push(
    el(
      "p",
      { class: "text-sm text-gray-700 mb-4" },
      "Sign up to start bidding on amazing items.",
    ),
  );

  // Error message container
  const errorContainer = el("p", { class: "text-red-600 mb-2" });
  nodes.push(errorContainer);

  const form = el("form", { novalidate: true });

  const nameLabel = el("label", { class: "block text-sm mb-2" });
  nameLabel.appendChild(el("span", { class: "text-gray-700" }, "Name"));
  const nameInput = el("input", {
    type: "text",
    required: "true",
    class: "mt-1 block w-full border rounded px-3 py-2",
  });
  nameLabel.appendChild(nameInput);
  form.appendChild(nameLabel);

  const emailLabel = el("label", { class: "block text-sm mb-2" });
  emailLabel.appendChild(el("span", { class: "text-gray-700" }, "Email"));
  const emailInput = el("input", {
    type: "email",
    required: "true",
    class: "mt-1 block w-full border rounded px-3 py-2",
    autocomplete: "email",
  });
  emailLabel.appendChild(emailInput);
  form.appendChild(emailLabel);

  const pwLabel = el("label", { class: "block text-sm mb-4" });
  pwLabel.appendChild(el("span", { class: "text-gray-700" }, "Password"));
  const pwInput = el("input", {
    type: "password",
    required: "true",
    class: "mt-1 block w-full border rounded px-3 py-2",
  });
  pwLabel.appendChild(pwInput);
  form.appendChild(pwLabel);

  const controls = el("div", {
    class: "flex items-center justify-end gap-3",
  });

  const cancel = el(
    "button",
    { type: "button", class: "px-4 py-2 rounded text-sm" },
    "Cancel",
  );
  const submit = el(
    "button",
    {
      type: "submit",
      class: "px-4 py-2 rounded btn-primary text-sm hover:btn-primary:hover",
    },
    "Sign up",
  );
  controls.appendChild(cancel);
  controls.appendChild(submit);
  form.appendChild(controls);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorContainer.textContent = "";
    const name = nameInput.value;
    const email = emailInput.value;
    const password = pwInput.value;
    if (!validateEmail(email)) {
      displayError(errorContainer, "Please enter a valid email address.");
      emailInput.focus();
      return;
    }
    try {
      const result = await registerUser(name, email, password);
      if (
        result &&
        result.data &&
        Array.isArray(result.data.errors) &&
        result.data.errors.length > 0
      ) {
        displayError(errorContainer, result.data.errors);
        return;
      }
      if (typeof onSubmit === "function") onSubmit(result);
      // Open sign in modal after successful sign up
      const signInModal = createSignInModal();
      signInModal.openSignInModal();
      close(); //TODO: After closing, the sign in modal "sign in" button does nothing. Fix it.
    } catch (error) {
      errorContainer.textContent = "Registration failed. Please try again.";
      console.error("Registration failed", error);
    }
  });

  cancel.addEventListener("click", close);

  nodes.push(form);
  return nodes;
}

export function createSignUpModal(options = {}) {
  const { openModal, close } = createBaseModal(
    { ...options },
    createSignUpNodes,
  );
  // Optionally, you can return dialog if needed for direct DOM manipulation
  return { openModal, close };
}
