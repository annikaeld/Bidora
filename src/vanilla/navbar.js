// Lightweight vanilla JS navbar that uses the shared signIn modal

import { createSignInModal } from "./signInModal.js";
import { handleLoginSubmit } from "../../js/ui/handleLoginSubmit.js";
import { load } from "../../js/storage/load.js";

function createNavbar() {
  const inner = el("div", {
    class: "site-container flex items-center justify-between w-full",
  });
  const logo = createLogo();
  inner.appendChild(logo);

  const burger = createBurger();
  inner.appendChild(burger);

  const btnBase =
    "btn-signin inline-block bg-transparent text-[var(--color-text)] py-2 rounded-full border-2 border-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text)] focus-visible:ring-offset-2";
  const { desktop, desktopSignIn } = createDesktopLinks(btnBase);
  inner.appendChild(desktop);

  const nav = el("nav", {
    class:
      "navbar fixed w-full top-0 left-0 z-30 transform transition-transform duration-200 flex items-center justify-between sm:justify-around md:justify-between p-4 bg-[var(--color-card-background)]",
  });
  nav.appendChild(inner);

  const { mobileMenu, mobileSignIn } = createMobileMenu(btnBase);
  nav.appendChild(mobileMenu);
  handleBurgerClick(burger, mobileMenu);

  const modal = createSignInModal({
    async onSubmit(data) {
      console.log("Sign in submitted", data);
      await handleLoginSubmit(data.email, data.password);
      // Rebuild navbar after login
      if (typeof window !== "undefined") {
        initVanillaNavbar();
      }
    },
  });

  if (desktopSignIn) {
    desktopSignIn.addEventListener("click", (e) => {
      modal.open(e.currentTarget);
    });
  }

  if (mobileSignIn) {
    mobileSignIn.addEventListener("click", (e) => {
      mobileMenu.classList.add("hidden");
      modal.open(e.currentTarget);
    });
  }

  return nav;
}

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

function createLogo() {
  const logoImg = el("img", {
    src: import.meta.env.BASE_URL + "img/logo.svg",
    alt: "Bidora",
    width: "240",
    height: "75",
    class:
      "min-w-[120px] max-w-[240px] w-[140px] h-[44px] md:w-[200px] md:h-[60px] lg:w-[240px] lg:h-[75px] object-contain",
  });
  const logo = el(
    "a",
    {
      href: import.meta.env.BASE_URL,
      class: "logo inline-flex items-center gap-2",
    },
    logoImg,
    el("span", { class: "sr-only" }, "Bidora"),
  );
  logo.addEventListener("click", (e) => {
    try {
      const base = import.meta.env.BASE_URL || "/";
      const normalize = (p) =>
        (p.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "") + "/";
      const current = normalize(window.location.pathname);
      const basePath = normalize(
        new URL(base, window.location.origin).pathname,
      );
      if (current === basePath) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      // ignore and allow default navigation if anything goes wrong
    }
  });
  return logo;
}

function createBurger() {
  const burger = el("button", {
    class:
      "md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100",
    "aria-controls": "mobile-menu",
    "aria-expanded": "false",
    "aria-label": "Open main menu",
  });
  burger.innerHTML = `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">\n    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />\n  </svg>`;
  return burger;
}

function createDesktopLinks(btnBase) {
  const desktop = el("div", {
    class: "nav-links hidden md:flex items-center gap-6",
  });
  const links = el(
    "div",
    {
      class:
        "links flex flex-wrap md:flex-nowrap items-center gap-4 flex-1 justify-center",
    },
    el(
      "a",
      {
        href: import.meta.env.BASE_URL + "auctions/",
        class: "hover:underline menu-item px-4 md:px-5",
      },
      "Auctions",
    ),
    el(
      "a",
      {
        href: import.meta.env.BASE_URL + "#howitworks",
        class: "hover:underline menu-item px-4 md:px-5",
      },
      "How it Works",
    ),
    el(
      "a",
      {
        href: import.meta.env.BASE_URL + "#about",
        class: "hover:underline menu-item px-4 md:px-5",
      },
      "About",
    ),
    // 'Create listing' and 'Profile' links only if logged in
    ...(isLoggedIn()
      ? [
          el(
            "a",
            {
              href: import.meta.env.BASE_URL + "auctions/edit.html",
              class: "hover:underline menu-item px-4 md:px-5",
            },
            "Create listing",
          ),
          el(
            "a",
            {
              href: import.meta.env.BASE_URL + "profile.html",
              class: "hover:underline menu-item px-4 md:px-5",
            },
            "Profile",
          ),
        ]
      : []),
  );
  let desktopSignIn = null;
  desktop.appendChild(links);
  if (!isLoggedIn()) {
    desktopSignIn = el(
      "button",
      {
        type: "button",
        class: `${btnBase} px-4 md:px-10`,
        "aria-label": "Sign in",
      },
      el("span", { class: "menu-sign-in text-l" }, "Sign in"),
    );
    desktop.appendChild(el("div", { class: "auth" }, desktopSignIn));
  }
  return { desktop, desktopSignIn };
}

function createMobileMenu(btnBase) {
  const mobileMenu = el("div", {
    id: "mobile-menu",
    class:
      "md:hidden hidden absolute top-full left-0 right-0 bg-[var(--color-background-accent)] size shadow-md p-4 text-center",
  });
  mobileMenu.appendChild(
    el(
      "a",
      {
        href: import.meta.env.BASE_URL + "auctions/",
        class: "block py-2 px-2 hover:underline menu-item",
      },
      "Auctions",
    ),
  );
  mobileMenu.appendChild(
    el(
      "a",
      {
        href: import.meta.env.BASE_URL + "#howitworks",
        class: "block py-2 px-2 hover:underline menu-item",
      },
      "How it Works",
    ),
  );
  mobileMenu.appendChild(
    el(
      "a",
      {
        href: import.meta.env.BASE_URL + "#about",
        class: "block py-2 px-2 hover:underline menu-item",
      },
      "About",
    ),
  );
  // 'Create listing' and 'Profile' links only if logged in
  if (isLoggedIn()) {
    mobileMenu.appendChild(
      el(
        "a",
        {
          href: import.meta.env.BASE_URL + "auctions/edit.html",
          class: "block py-2 px-2 hover:underline menu-item",
        },
        "Create listing",
      ),
    );
    mobileMenu.appendChild(
      el(
        "a",
        {
          href: import.meta.env.BASE_URL + "profile.html",
          class: "block py-2 px-2 hover:underline menu-item",
        },
        "Profile",
      ),
    );
  }
  let mobileSignIn = null;
  if (!isLoggedIn()) {
    mobileSignIn = el(
      "button",
      {
        class: `${btnBase} btn-signin-lg mt-2 text-m px-10 text-center`,
      },
      el("span", { class: "menu-sign-in text-md" }, " "),
    );
    mobileMenu.appendChild(mobileSignIn);
  }
  return { mobileMenu, mobileSignIn };
}

function handleBurgerClick(burger, mobileMenu) {
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
}

// Auto-mount: look for #vanilla-navbar and render into it
export default function initVanillaNavbar(selector = "#vanilla-navbar") {
  const container = document.querySelector(selector);
  if (!container) return null;
  const nav = createNavbar();
  container.innerHTML = "";
  const spacer = document.createElement("div");
  spacer.style.height = "64px";
  container.appendChild(spacer);
  container.appendChild(nav);

  // After layout, set spacer height to the actual nav height.
  requestAnimationFrame(() => {
    spacer.style.height = nav.offsetHeight + "px";
  });

  // Show nav when scrolling up, hide when scrolling down.
  let lastY = window.scrollY;
  let ticking = false;
  function onScroll() {
    const currentY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (currentY > lastY && currentY > 100) {
          nav.classList.add("-translate-y-full");
        } else {
          nav.classList.remove("-translate-y-full");
        }
        lastY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    spacer.style.height = nav.offsetHeight + "px";
  });

  return nav;
}

function isLoggedIn() {
  return Boolean(load("token"));
}

// auto-run when loaded as a module in the browser
if (typeof window !== "undefined") {
  // delay until DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initVanillaNavbar());
  } else initVanillaNavbar();
}
