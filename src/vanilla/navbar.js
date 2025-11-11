// Lightweight vanilla JS navbar that uses the shared signIn modal

import { createSignInModal } from "./signInModal.js";
import { handleLoginSubmit } from "../../js/ui/handleLoginSubmit.js";

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
    class:
      "navbar fixed w-full top-0 left-0 z-30 transform transition-transform duration-200 flex items-center justify-between sm:justify-around md:justify-between p-4 bg-[var(--color-card-background)]",
  });

  // inner container constrains navbar content to the site width while leaving
  // the nav background full-bleed. Use the shared `.site-container` class
  // defined in `src/styles/globals.css` so nav aligns with page content.
  const inner = el("div", {
    class: "site-container flex items-center justify-between w-full",
  });

  // Common button base used across sign-in buttons so styling stays DRY.
  const btnBase =
    "btn-signin inline-block bg-transparent text-[var(--color-text)] py-2 rounded-full border-2 border-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text)] focus-visible:ring-offset-2";

  const logoImg = el("img", {
    // use Vite's base URL so builds deployed under a subpath resolve correctly
    src: import.meta.env.BASE_URL + "img/logo.svg",
    alt: "Bidora",
    // desktop intrinsic size (helps reserve layout); CSS will override on small screens
    width: "240",
    height: "75",
    // mobile-first: constrained min/max and responsive sizes
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
    // visually-hidden text for screen readers (keeps intent if image fails)
    el("span", { class: "sr-only" }, "Bidora"),
  );

  // append core interactive elements inside the centered container
  inner.appendChild(logo);

  // Smooth-scroll to top when clicking the logo while already on the homepage
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
        // already on homepage — prevent navigation and smooth-scroll to top
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      // ignore and allow default navigation if anything goes wrong
    }
  });

  // Hamburger
  const burger = el("button", {
    class:
      "md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100",
    "aria-controls": "mobile-menu",
    "aria-expanded": "false",
    "aria-label": "Open main menu",
  });
  burger.innerHTML = `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">\n    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />\n  </svg>`;
  // place hamburger inside the centered inner container so it lines up with
  // the rest of the nav content (logo, links, auth) instead of floating
  // outside the site width.
  inner.appendChild(burger);

  // Desktop links
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
  );
  const desktopSignIn = el(
    "button",
    {
      type: "button",
      class: `${btnBase} px-4 md:px-10`,
      "aria-label": "Sign in",
    },
    el("span", { class: "menu-sign-in text-l" }, "Sign in"),
  );

  desktop.appendChild(links);
  desktop.appendChild(el("div", { class: "auth" }, desktopSignIn));
  inner.appendChild(desktop);
  nav.appendChild(inner);

  // Mobile menu (hidden by default)
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
  const mobileSignIn = el(
    "button",
    {
      class: `${btnBase} btn-signin-lg mt-2 text-m px-10 text-center`,
    },
    el("span", { class: "menu-sign-in text-md" }, "Sign in"),
  );
  mobileMenu.appendChild(mobileSignIn);
  nav.appendChild(mobileMenu);

  // Shared modal instance
  const modal = createSignInModal({
    onSubmit(data) {
      console.log("Sign in submitted", data);
      handleLoginSubmit(data.email, data.password);
    },
  });

  // Inject CTA buttons into the Auctions section if present
  const auctionsCta = document.querySelector("#auctions-cta");
  if (auctionsCta) {
    // Mobile-only sign-in CTA (visible only below md)
    const mobileCta = el(
      "button",
      {
        class: `${btnBase} btn-signin-lg block md:hidden mt-2 text-m px-10 text-center`,
      },
      el("span", { class: "menu-sign-in text-md" }, "Sign in"),
    );
    mobileCta.addEventListener("click", (e) => {
      // hide mobile menu if it's open, then open modal
      mobileMenu.classList.add("hidden");
      modal.open(e.currentTarget);
    });

    // Link to auctions (visible on all sizes)
    const auctionsLink = el(
      "a",
      {
        href: import.meta.env.BASE_URL + "auctions/",
        class:
          "inline-block mt-2 bg-transparent text-[var(--color-text)] px-4 py-2 rounded-full border-2 border-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-white transition-colors duration-150 text-center",
      },
      "Browse Auctions",
    );

    // Append elements: link for all sizes, sign-in only for mobile
    auctionsCta.appendChild(auctionsLink);
    auctionsCta.appendChild(mobileCta);
  }

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

// auto-run when loaded as a module in the browser
if (typeof window !== "undefined") {
  // delay until DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initVanillaNavbar());
  } else initVanillaNavbar();
}
