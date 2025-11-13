import { el } from "./createElement.js";

export function createBaseModal(options = {}, createNodes) {
  console.log("Creating base modal with options", options);
  const { onSubmit } = options;

  let modalRoot = null;
  let dialog = null;
  let lastOpener = null;
  let keyHandler = null;

  function build(content) {
    // Remove previous modalRoot if it exists
    console.log("Build");
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
          console.log("Appended node", node);
        }
      });
    }

    const closeBtn = el(
      "button",
      {
        "aria-label": "Close dialog",
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
    console.log("Built modal elements", { modalRoot, dialog });
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

  function openModal(opener = null) {
    console.log("Opening modal");
    if (typeof createNodes !== "function") {
      throw new Error(
        "createNodes function must be provided to createBaseModal",
      );
    }
    const content = createNodes(onSubmit, close);
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

  return { openModal, close };
}
