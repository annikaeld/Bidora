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
    // Fixed so we can hide/show on scroll. Spacer preserves flow when
    // the nav is taken out of document flow.
    class:
      "navbar fixed w-full top-0 left-0 z-30 transform transition-transform duration-200 flex items-center sm:justify-around xs:justify-between p-4 bg-[var(--color-card-background)]",
  });

  const logoImg = el("img", {
    // use Vite's base URL so builds deployed under a subpath resolve correctly
    src: import.meta.env.BASE_URL + "img/logo.svg",
    alt: "Bidora",
    // desktop intrinsic size (helps reserve layout); CSS will override on small screens
    width: "240",
    height: "75",
    // mobile-first: ~2/3 size on mobile, full size on md and up
    class: "w-[160px] h-[50px] md:w-[240px] md:h-[75px] object-contain",
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

  nav.appendChild(logo);

  // Smooth-scroll to top when clicking the logo while already on the homepage
  // This prevents a full navigation reload and provides a nicer UX.
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
  nav.appendChild(burger);

  // Desktop links
  const desktop = el("div", {
    class: "nav-links hidden md:flex items-center gap-6",
  });
  const links = el(
    "div",
    { class: "links flex items-center gap-4" },
    el(
      "a",
      {
        href: import.meta.env.BASE_URL + "auctions/",
        class: "hover:underline menu-item px-10",
      },
      "Auctions",
    ),
    el(
      "a",
      {
        href: import.meta.env.BASE_URL + "#howitworks",
        class: "hover:underline menu-item px-10",
      },
      "How it Works",
    ),
    el(
      "a",
      {
        href: import.meta.env.BASE_URL + "#about",
        class: "hover:underline menu-item px-10",
      },
      "About",
    ),
  );
  const desktopSignIn = el(
    "button",
    {
      type: "button",
      class:
        "inline-block bg-transparent px-10 py-2 rounded-full border-2 border-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text)] focus-visible:ring-offset-2",
      "aria-label": "Sign in",
    },
    el("span", { class: "menu-sign-in text-xl" }, "Sign in"),
  );

  desktop.appendChild(links);
  desktop.appendChild(el("div", { class: "auth" }, desktopSignIn));
  nav.appendChild(desktop);

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
      class:
        "mt-2 inline-block bg-transparent text-[var(--color-text)] text-m px-4 py-2 rounded-full border-2 border-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-white transition-colors duration-150 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text)] focus-visible:ring-offset-2",
    },
    el("span", { class: "menu-sign-in text-sm" }, "Sign in"),
  );
  mobileMenu.appendChild(mobileSignIn);
  nav.appendChild(mobileMenu);

  // Shared modal instance
  const modal = createSignInModal({
    onSubmit(data) {
      console.log("Sign in submitted", data);
    },
  });

  // Inject CTA buttons into the Auctions section if present
  const auctionsCta = document.querySelector("#auctions-cta");
  if (auctionsCta) {
    // Mobile-only sign-in CTA (visible only below md)
    const mobileCta = el(
      "button",
      {
        class:
          "block md:hidden mt-2 inline-block bg-transparent text-[var(--color-text)] text-m px-4 py-2 rounded-full border-2 border-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-white transition-colors duration-150 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text)] focus-visible:ring-offset-2",
      },
      el("span", { class: "menu-sign-in text-sm" }, "Sign in"),
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
  // When navbar is fixed we need a spacer to preserve layout flow so the
  // page content doesn't jump under the fixed nav.
  container.innerHTML = "";
  const spacer = document.createElement("div");
  // Use a default then update after a paint if necessary.
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
