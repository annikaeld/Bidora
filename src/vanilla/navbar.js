// Lightweight vanilla JS navbar that uses the shared signIn modal
// Usage: add <div id="vanilla-navbar"></div> and include
// <script type="module" src="/src/vanilla/navbar.js"></script>

// Lightweight vanilla JS navbar that uses the shared signIn modal
// Usage: add <div id="vanilla-navbar"></div> and include
// <script type="module" src="/src/vanilla/navbar.js"></script>

import { createSignInModal } from "./signInModal.js";

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

function createNavbar() {
  const nav = el("nav", {
    class: "navbar relative flex items-center justify-between p-4 bg-white",
  });

  const logo = el(
    "a",
    { href: "#home", class: "logo font-semibold text-lg" },
    "Bidora"
  );
  nav.appendChild(logo);

  // Hamburger
  const burger = el("button", {
    class:
      "md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100",
    "aria-controls": "mobile-menu",
    "aria-expanded": "false",
    "aria-label": "Open main menu",
  });
  burger.innerHTML = `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">\n    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />\n  </svg>`;
  nav.appendChild(burger);

  // Desktop links
  const desktop = el("div", {
    class: "nav-links hidden md:flex items-center gap-6",
  });
  const links = el(
    "div",
    { class: "links flex items-center gap-4" },
    el("a", { href: "#auctions", class: "hover:underline" }, "Auctions"),
    el("a", { href: "#howitworks", class: "hover:underline" }, "How it Works"),
    el("a", { href: "#about", class: "hover:underline" }, "About")
  );
  const desktopSignIn = el(
    "button",
    {
      type: "button",
      class:
        "inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700",
      "aria-label": "Sign in",
    },
    "Sign in"
  );

  desktop.appendChild(links);
  desktop.appendChild(el("div", { class: "auth" }, desktopSignIn));
  nav.appendChild(desktop);

  // Mobile menu (hidden by default)
  const mobileMenu = el("div", {
    id: "mobile-menu",
    class:
      "md:hidden hidden absolute top-full left-0 right-0 bg-white shadow-md p-4",
  });
  mobileMenu.appendChild(
    el(
      "a",
      { href: "#auctions", class: "block py-2 px-2 hover:underline" },
      "Auctions"
    )
  );
  mobileMenu.appendChild(
    el(
      "a",
      { href: "#howitworks", class: "block py-2 px-2 hover:underline" },
      "How it Works"
    )
  );
  mobileMenu.appendChild(
    el(
      "a",
      { href: "#about", class: "block py-2 px-2 hover:underline" },
      "About"
    )
  );
  const mobileSignIn = el(
    "button",
    {
      class:
        "mt-2 inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-md text-center",
    },
    "Sign in"
  );
  mobileMenu.appendChild(mobileSignIn);
  nav.appendChild(mobileMenu);

  // Shared modal instance
  const modal = createSignInModal({
    onSubmit(data) {
      // eslint-disable-next-line no-console
      console.log("Sign in submitted", data);
    },
  });

  // Handlers
  burger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("hidden");
    if (isOpen) {
      mobileMenu.classList.remove("hidden");
      burger.setAttribute("aria-expanded", "true");
    } else {
      mobileMenu.classList.add("hidden");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  desktopSignIn.addEventListener("click", (e) => {
    modal.open(e.currentTarget);
  });

  mobileSignIn.addEventListener("click", (e) => {
    mobileMenu.classList.add("hidden");
    modal.open(e.currentTarget);
  });

  return nav;
}

// Auto-mount: look for #vanilla-navbar and render into it
export default function initVanillaNavbar(selector = "#vanilla-navbar") {
  const container = document.querySelector(selector);
  if (!container) return null;
  const nav = createNavbar();
  container.innerHTML = "";
  container.appendChild(nav);
  return nav;
}

// auto-run when loaded as a module in the browser
if (typeof window !== "undefined") {
  // delay until DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initVanillaNavbar());
  } else initVanillaNavbar();
}
