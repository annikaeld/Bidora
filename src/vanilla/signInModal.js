// Plain JS SignIn modal module
// Usage:
// import { createSignInModal } from '/src/vanilla/signInModal.js';
// const modal = createSignInModal({ onSubmit: (data)=>{...} });
// open with modal.open(openerElement);
// close with modal.close();

export function createSignInModal(options = {}) {
  const { onSubmit } = options;

  let modalRoot = null;
  let dialog = null;
  let lastOpener = null;
  let keyHandler = null;

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k.startsWith("data-")) node.setAttribute(k, v);
      else if (k === "html") node.innerHTML = v;
      else node.setAttribute(k, String(v));
    }
    for (const c of children) {
      if (c == null) continue;
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    }
    return node;
  }

  function build() {
    if (modalRoot) return modalRoot;

    const overlay = el("div", {
      class: "fixed inset-0 bg-black/50",
      "data-role": "overlay",
    });

    // inner dialog (the white box that holds content)
    dialog = el("div", {
      role: "dialog",
      "aria-modal": "true",
      class: "relative bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-lg",
    });

    const closeBtn = el(
      "button",
      {
        "aria-label": "Close sign in dialog",
        class: "absolute top-3 right-3 text-gray-500 hover:text-gray-800",
      },
      "✕",
    );
    dialog.appendChild(closeBtn);
    dialog.appendChild(
      el("h2", { class: "text-xl font-semibold mb-4" }, "Sign in"),
    );

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
    const cancel = el(
      "button",
      { type: "button", class: "px-4 py-2 rounded text-sm" },
      "Cancel",
    );
    const submit = el(
      "button",
      {
        type: "submit",
        class:
          "px-4 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700",
      },
      "Sign in",
    );
    controls.appendChild(cancel);
    controls.appendChild(submit);
    form.appendChild(controls);

    dialog.appendChild(form);

    const wrapper = el("div", {
      class: "fixed inset-0 z-50 flex items-center justify-center",
    });
    wrapper.appendChild(overlay);
    wrapper.appendChild(dialog);

    // events
    overlay.addEventListener("click", close);
    closeBtn.addEventListener("click", close);
    cancel.addEventListener("click", close);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = { email: emailInput.value, password: pwInput.value };
      if (typeof onSubmit === "function") onSubmit(data);
      close();
    });

    modalRoot = wrapper;
    return modalRoot;
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

  function open(opener = null) {
    if (!modalRoot) build();
    if (!modalRoot.parentNode) document.body.appendChild(modalRoot);
    modalRoot.style.display = "";
    lastOpener = opener;
    // focus management
    const focusables = focusableElements(dialog);
    if (focusables.length) focusables[0].focus();
    keyHandler = onKey;
    document.addEventListener("keydown", keyHandler);
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

  return { open, close };
}
