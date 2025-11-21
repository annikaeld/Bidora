// Lightweight vanilla JS navbar that uses the shared signIn modal

import { createSignInModal } from "./signInModal.js";
import { handleLoginSubmit } from "../ui/handleLoginSubmit.js";
import { load } from "../storage/load.js";
import { logoutUser as logoutUserStorage } from "../storage/loggedIn.js";

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
      const result = await handleLoginSubmit(data.email, data.password);
      // Reload page if login is successful
      if (
        result &&
        result.response &&
        result.response.ok &&
        typeof window !== "undefined"
      ) {
        window.location.reload();
      }
      return result;
    },
  });

  if (desktopSignIn) {
    desktopSignIn.addEventListener("click", (e) => {
      modal.openSignInModal(e.currentTarget);
    });
  }

  if (mobileSignIn) {
    mobileSignIn.addEventListener("click", (e) => {
      mobileMenu.classList.add("hidden");
      modal.openSignInModal(e.currentTarget);
    });
  }

  const homepageMobileBtn = document.getElementById("homepage-mobile-signin");
  if (homepageMobileBtn) {
    homepageMobileBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // hide mobile menu if visible
      const mobileMenuEl = document.getElementById("mobile-menu");
      if (mobileMenuEl) mobileMenuEl.classList.add("hidden");
      modal.openSignInModal(e.currentTarget);
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
    src: import.meta.env.BASE_URL + "img/logo.png",
    alt: "Bidora",
    class: "object-contain nav-logo",
  });
  const logo = el(
    "a",
    {
      href: import.meta.env.BASE_URL,
      class: "logo inline-flex items-center gap-2",
    },
    logoImg,
    el("span", { class: "sr-only" }, "Bidora")
  );
  logo.addEventListener("click", (e) => {
    try {
      const base = import.meta.env.BASE_URL || "/";
      const normalize = (p) =>
        (p.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "") + "/";
      const current = normalize(window.location.pathname);
      const basePath = normalize(
        new URL(base, window.location.origin).pathname
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
      "md:hidden inline-flex items-center justify-center p-2 rounded-md text-[var(--color-text)]",
    "aria-controls": "mobile-menu",
    "aria-expanded": "false",
    "aria-label": "Open main menu",
  });
  burger.innerHTML = `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">\n    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />\n  </svg>`;
  return burger;
}

function createDesktopLinks(btnBase) {
  const profile = currentProfile();
  console.log("Navbar current profile:", profile);
  const desktop = el("div", {
    class:
      "nav-links hidden md:flex items-center gap-6 text-[var(--color-text)] font-semibold",
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
      "Auctions"
    ),
    el(
      "a",
      {
        href: import.meta.env.BASE_URL + "#howitworks",
        class: "hover:underline menu-item px-4 md:px-5",
      },
      "How it Works"
    ),
    el(
      "a",
      {
        href: import.meta.env.BASE_URL + "#about",
        class: "hover:underline menu-item px-4 md:px-5",
      },
      "About"
    ),
    // 'Create listing' and 'Profile' links only if logged in
    ...(isLoggedIn()
      ? [
          el(
            "a",
            {
              href: import.meta.env.BASE_URL + "auctions/edit.html",
              class:
                "inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--accent-color)] hover:bg-[var(--color-text)] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta)]",
              title: "Create listing",
              "aria-label": "Create listing",
            },
            el(
              "span",
              { class: "material-symbols-outlined text-[20px] leading-none" },
              "add_2"
            )
          ),
          // User dropdown
          (() => {
            const dropdown = el("div", {
              class:
                "relative inline-block text-left user-dropdown px-0 md:px-2 focus-within:z-50",
            });
            let avatarUrl =
              profile && profile.avatar && profile.avatar.url
                ? profile.avatar.url
                : "";
            let avatarAlt =
              profile && profile.avatar && profile.avatar.alt
                ? profile.avatar.alt
                : "Profile avatar";
            const button = el(
              "button",
              {
                class:
                  "hover:underline menu-item px-4 md:px-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text)] focus-visible:ring-offset-2 flex items-center gap-2",
                "aria-haspopup": "true",
                "aria-expanded": "false",
                type: "button",
                tabIndex: 0,
              },
              el("img", {
                src: avatarUrl,
                alt: avatarAlt,
                class:
                  "inline-block w-9 h-9 rounded-full object-cover align-middle border-2 border-[var(--accent-color)]",
                onerror: function () {
                  this.replaceWith(
                    el(
                      "span",
                      {
                        class:
                          "material-symbols-outlined avatar-icon align-middle",
                        role: "img",
                        "aria-label": "Default avatar",
                      },
                      "face"
                    )
                  );
                },
              })
            );
            const menu = el(
              "div",
              {
                class:
                  "hidden absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 user-dropdown-menu",
              },
              el(
                "a",
                {
                  href: import.meta.env.BASE_URL + "profile/",
                  class:
                    "block px-4 py-2 text-sm text-[var(--color-text)] hover:bg-gray-100",
                },
                "Profile"
              ),
              (() => {
                const logout = el(
                  "button",
                  {
                    type: "button",
                    class:
                      "block w-full text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-gray-100",
                  },
                  "Log out"
                );
                logout.addEventListener("click", logoutUser);
                return logout;
              })()
            );
            // Show/hide menu on mouseenter/mouseleave for both button and menu
            let menuVisible = false;
            function showMenu() {
              menu.classList.remove("hidden");
              button.setAttribute("aria-expanded", "true");
              menuVisible = true;
            }
            function hideMenu() {
              menu.classList.add("hidden");
              button.setAttribute("aria-expanded", "false");
              menuVisible = false;
            }
            button.addEventListener("mouseenter", showMenu);
            button.addEventListener("focus", showMenu);
            button.addEventListener("mouseleave", () => {
              setTimeout(() => {
                if (!menuVisible) hideMenu();
              }, 100);
            });
            button.addEventListener("blur", () => {
              setTimeout(() => {
                if (!menuVisible) hideMenu();
              }, 100);
            });
            menu.addEventListener("mouseenter", () => {
              menuVisible = true;
              showMenu();
            });
            menu.addEventListener("mouseleave", () => {
              menuVisible = false;
              hideMenu();
            });
            dropdown.appendChild(button);
            dropdown.appendChild(menu);
            return dropdown;
          })(),
        ]
      : [])
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
      el("span", { class: "menu-sign-in text-l" }, "Sign in")
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
      "Auctions"
    )
  );
  mobileMenu.appendChild(
    el(
      "a",
      {
        href: import.meta.env.BASE_URL + "#howitworks",
        class: "block py-2 px-2 hover:underline menu-item",
      },
      "How it Works"
    )
  );
  mobileMenu.appendChild(
    el(
      "a",
      {
        href: import.meta.env.BASE_URL + "#about",
        class: "block py-2 px-2 hover:underline menu-item",
      },
      "About"
    )
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
        "Create listing"
      )
    );
    // User dropdown for mobile
    const userSection = el(
      "div",
      { class: "user-dropdown-mobile mt-2" },
      el("span", {
        class: "block font-semibold text-[var(--color-text)] px-2 pt-2 pb-1",
      }),
      el(
        "a",
        {
          href: import.meta.env.BASE_URL + "profile/",
          class: "block py-2 px-2 hover:underline menu-item",
        },
        "Profile"
      ),
      (() => {
        const logout = el(
          "button",
          {
            type: "button",
            // Match anchor styling: block, centered, same padding, hover underline
            class:
              "block py-2 px-2 w-full text-center hover:underline menu-item",
            style:
              "background:none;border:none;color:inherit;font:inherit;cursor:pointer;outline:inherit;",
          },
          "Log out"
        );
        logout.addEventListener("click", logoutUser);
        return logout;
      })()
    );
    mobileMenu.appendChild(userSection);
  }
  let mobileSignIn = null;
  if (!isLoggedIn()) {
    mobileSignIn = el(
      "button",
      {
        class: `${btnBase} btn-signin-lg mt-2 text-m px-10 text-center`,
      },
      el("span", { class: "menu-sign-in text-md" }, "Sign In")
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
  // Use a small helper and multiple triggers to account for font/icon loading
  // and any dynamic content that might change the navbar's height.
  function setSpacerHeight() {
    // getBoundingClientRect is more reliable for computed height
    const h = nav.getBoundingClientRect().height || nav.offsetHeight || 0;
    spacer.style.height = h + "px";
  }
  requestAnimationFrame(setSpacerHeight);
  // Some assets (fonts, icons) may load slightly later; update after load and a short timeout
  window.addEventListener("load", setSpacerHeight, { once: true });
  setTimeout(setSpacerHeight, 250);
  // If the navbar logo image changes or loads after initial render, recalc spacer
  const logoImgEl = nav.querySelector("img.nav-logo");
  if (logoImgEl) {
    if (logoImgEl.complete) {
      setSpacerHeight();
    } else {
      logoImgEl.addEventListener("load", setSpacerHeight, { once: true });
    }
  }

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

function currentProfile() {
  console.log("Loading current profile for navbar");
  return load("profile");
}

function logoutUser() {
  logoutUserStorage();
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}

// auto-run when loaded as a module in the browser
if (typeof window !== "undefined") {
  // delay until DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initVanillaNavbar());
  } else initVanillaNavbar();
}
