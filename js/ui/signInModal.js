// Plain JS SignIn modal module
// Usage:
// import { createSignInModal } from '/js/ui/signInModal.js';
// const modal = openSignInModal({ onSubmit: (data)=>{...} });
// open with modal.open(openerElement);
// close with modal.close();
import { el } from "./createElement.js";
import { createSignUpModal } from "./signUpModal.js";
import { displayError } from "./displayError.js";

function addModalContent(dialog, content) {
  if (Array.isArray(content) && content.length > 0) {
    content.forEach((node) => {
      if (node instanceof Node) {
        dialog.appendChild(node);
      }
    });
  }
}

export function createBaseModal(options = {}) {
  const { onSubmit } = options;

  let modalRoot = null;
  let dialog = null;
  let lastOpener = null;
  let keyHandler = null;

  function build(content) {
    // Remove previous modalRoot if it exists
    if (modalRoot && modalRoot.parentNode) {
      modalRoot.parentNode.removeChild(modalRoot);
    }
    modalRoot = null;
    dialog = null;

    const overlay = el("div", {
      class: "fixed inset-0 bg-black/50",
      "data-role": "overlay",
    });

    dialog = el("div", {
      role: "dialog",
      "aria-modal": "true",
      class: "relative bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-lg",
    });

    if (Array.isArray(content) && content.length > 0) {
      content.forEach((node) => {
        if (node instanceof Node) {
          dialog.appendChild(node);
        }
      });
    }

    const closeBtn = el(
      "button",
      {
        "aria-label": "Close sign in dialog",
        class: "absolute top-3 right-3 text-gray-500 hover:text-gray-800",
      },
      "✕",
    );
    dialog.appendChild(closeBtn);

    const wrapper = el("div", {
      class: "fixed inset-0 z-50 flex items-center justify-center",
    });
    wrapper.appendChild(overlay);
    wrapper.appendChild(dialog);

    // events
    overlay.addEventListener("click", close);
    closeBtn.addEventListener("click", close);

    modalRoot = wrapper;
    return { modalRoot, dialog };
  }

  function focusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }

  function trapFocus(e) {
    if (e.key !== "Tab") return;
    const focusables = focusableElements(dialog);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    else trapFocus(e);
  }

  function openSignInModal(opener = null) {
    const content = createSignInNodes(onSubmit, close);
    const built = build(content);
    modalRoot = built.modalRoot;
    dialog = built.dialog;
    if (!modalRoot.parentNode) document.body.appendChild(modalRoot);
    makeVisible();
    lastOpener = opener;
    // focus management
    const focusables = focusableElements(dialog);
    if (focusables.length) focusables[0].focus();
    keyHandler = onKey;
    document.addEventListener("keydown", keyHandler);
  }

  function makeVisible() {
    if (modalRoot) modalRoot.style.display = "";
  }

  function close() {
    if (modalRoot && modalRoot.parentNode) {
      modalRoot.parentNode.removeChild(modalRoot);
    }
    if (keyHandler) {
      document.removeEventListener("keydown", keyHandler);
      keyHandler = null;
    }
    if (lastOpener && typeof lastOpener.focus === "function")
      lastOpener.focus();
  }

  return { openSignInModal, close };
}

export function createSignInModal(options = {}) {
  const { openSignInModal, close } = createBaseModal(options);
  // Create a dialog element to append signInNodes to
  const dialog = document.createElement("div");
  dialog.className =
    "relative bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-lg";
  const signInNodes = createSignInNodes(options.onSubmit, close);
  addModalContent(dialog, signInNodes);
  return { openSignInModal, close, dialog };
}

function createSignInNodes(onSubmit, close) {
  const nodes = [];
  nodes.push(
    el(
      "h2",
      { class: "text-xl font-semibold mb-4 heading-color" },
      "Welcome to Bidora",
    ),
  );
  nodes.push(
    el(
      "p",
      { class: "text-sm text-gray-700 mb-4" },
      "Sign in to your account or create a new one to start bidding on amazing items.",
    ),
  );

  const errorContainer = el("p", { class: "text-red-600 mb-2" });
  nodes.push(errorContainer);

  const form = el("form", {});
  const emailLabel = el("label", { class: "block text-sm mb-2" });
  emailLabel.appendChild(el("span", { class: "text-gray-700" }, "Email"));
  const emailInput = el("input", {
    type: "email",
    required: "true",
    class: "mt-1 block w-full border rounded px-3 py-2",
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

  const signupLink = el(
    "a",
    {
      href: "#",
      class: "heading-color mr-auto text-sm hover:underline",
    },
    "Create an account",
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
    "Cancel",
  );
  const submit = el(
    "button",
    {
      type: "submit",
      class: "px-4 py-2 rounded btn-primary text-sm hover:btn-primary:hover",
    },
    "Sign in",
  );
  cancel.addEventListener("click", close);
  controls.appendChild(cancel);
  controls.appendChild(submit);
  form.appendChild(controls);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorContainer.textContent = "";
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
