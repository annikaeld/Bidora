// Plain JS SignIn modal module
// Usage:
// import { createSignInModal } from '/js/ui/signInModal.js';
// const modal = openSignInModal({ onSubmit: (data)=>{...} });
// open with modal.open(openerElement);
// close with modal.close();
import { el } from "./createElement.js";
import { createSignUpModal } from "./signUpModal.js";
import { displayError } from "./displayError.js";
import { validateEmail } from "./formValidation.js";
import { createBaseModal } from "./baseModal.js";

export function createSignInModal(options = {}) {
  const { openModal, close } = createBaseModal(options, createSignInNodes);
  return { openSignInModal: openModal, close };
}

function createSignInNodes(onSubmit, close) {
  const nodes = [];
  nodes.push(
    el(
      "h2",
      { class: "text-xl font-semibold mb-4 heading-color" },
      "Welcome to Bidora"
    )
  );
  nodes.push(
    el(
      "p",
      { class: "text-sm text-[var(--color-text)] mb-4" },
      "Sign in to your account or create a new one to start bidding on amazing items."
    )
  );

  const errorContainer = el("p", { class: "text-red-600 mb-2" });
  nodes.push(errorContainer);

  const form = el("form", { novalidate: true });
  const emailLabel = el("label", { class: "block text-sm mb-2" });
  emailLabel.appendChild(
    el("span", { class: "text-[var(--color-text)]" }, "Email")
  );
  const emailInput = el("input", {
    type: "email",
    required: "true",
    class: "mt-1 block w-full border rounded px-3 py-2",
    autocomplete: "email",
  });
  emailLabel.appendChild(emailInput);
  form.appendChild(emailLabel);

  const pwLabel = el("label", { class: "block text-sm mb-4" });
  pwLabel.appendChild(
    el("span", { class: "text-[var(--color-text)]" }, "Password")
  );
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

  const signupLink = el(
    "a",
    {
      href: "#",
      class: "heading-color mr-auto text-sm hover:underline",
    },
    "Create an account"
  );
  signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    close();
    // Open the sign-up modal
    const { openModal } = createSignUpModal({
      onSubmit: () => {
        // You can handle sign-up data here
      },
    });
    openModal();
  });
  controls.appendChild(signupLink);
  const cancel = el(
    "button",
    { type: "button", class: "px-4 py-2 rounded text-sm" },
    "Cancel"
  );
  const submit = el(
    "button",
    {
      type: "submit",
      class: "px-4 py-2 rounded btn-primary text-sm hover:btn-primary:hover",
    },
    "Sign in"
  );
  cancel.addEventListener("click", close);
  controls.appendChild(cancel);
  controls.appendChild(submit);
  form.appendChild(controls);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorContainer.textContent = "";
    if (!validateEmail(emailInput.value)) {
      displayError(
        errorContainer,
        "Please enter an email address ending with @stud.noroff.no"
      );
      emailInput.focus();
      return;
    }
    const data = { email: emailInput.value, password: pwInput.value };
    if (typeof onSubmit === "function") {
      let result = null;
      try {
        result = await onSubmit(data);
      } catch (error) {
        displayError(errorContainer, error);
        console.error("Sign in failed", error);
        return;
      }
      // If onSubmit returns a result with errors, display them and do NOT close modal
      if (
        result &&
        result.data &&
        Array.isArray(result.data.errors) &&
        result.data.errors.length > 0
      ) {
        displayError(errorContainer, result.data.errors);
        return;
      }
      close();
    }
  });
  nodes.push(form);
  return nodes;
}
