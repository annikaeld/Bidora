(function () {
  const a = document.createElement("link").relList;
  if (a && a.supports && a.supports("modulepreload")) return;
  for (const e of document.querySelectorAll('link[rel="modulepreload"]')) t(e);
  new MutationObserver((e) => {
    for (const n of e)
      if (n.type === "childList")
        for (const i of n.addedNodes)
          i.tagName === "LINK" && i.rel === "modulepreload" && t(i);
  }).observe(document, { childList: !0, subtree: !0 });
  function o(e) {
    const n = {};
    return (
      e.integrity && (n.integrity = e.integrity),
      e.referrerPolicy && (n.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === "use-credentials"
        ? (n.credentials = "include")
        : e.crossOrigin === "anonymous"
          ? (n.credentials = "omit")
          : (n.credentials = "same-origin"),
      n
    );
  }
  function t(e) {
    if (e.ep) return;
    e.ep = !0;
    const n = o(e);
    fetch(e.href, n);
  }
})();
function O(c = {}) {
  const { onSubmit: a } = c;
  let o = null,
    t = null,
    e = null,
    n = null;
  function i(l, u = {}, ...f) {
    const r = document.createElement(l);
    for (const [d, m] of Object.entries(u))
      d === "class"
        ? (r.className = m)
        : d.startsWith("data-")
          ? r.setAttribute(d, m)
          : d === "html"
            ? (r.innerHTML = m)
            : r.setAttribute(d, String(m));
    for (const d of f)
      d != null &&
        (typeof d == "string"
          ? r.appendChild(document.createTextNode(d))
          : r.appendChild(d));
    return r;
  }
  function p() {
    if (o) return o;
    const l = i("div", {
      class: "fixed inset-0 bg-black/50",
      "data-role": "overlay",
    });
    t = i("div", {
      role: "dialog",
      "aria-modal": "true",
      class: "relative bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-lg",
    });
    const u = i(
      "button",
      {
        "aria-label": "Close sign in dialog",
        class: "absolute top-3 right-3 text-gray-500 hover:text-gray-800",
      },
      "✕",
    );
    (t.appendChild(u),
      t.appendChild(
        i("h2", { class: "text-xl font-semibold mb-4" }, "Sign in"),
      ));
    const f = i("form", {}),
      r = i("label", { class: "block text-sm mb-2" });
    r.appendChild(i("span", { class: "text-gray-700" }, "Email"));
    const d = i("input", {
      type: "email",
      required: "true",
      class: "mt-1 block w-full border rounded px-3 py-2",
    });
    (r.appendChild(d), f.appendChild(r));
    const m = i("label", { class: "block text-sm mb-4" });
    m.appendChild(i("span", { class: "text-gray-700" }, "Password"));
    const C = i("input", {
      type: "password",
      required: "true",
      class: "mt-1 block w-full border rounded px-3 py-2",
    });
    (m.appendChild(C), f.appendChild(m));
    const y = i("div", { class: "flex items-center justify-end gap-3" }),
      w = i(
        "button",
        { type: "button", class: "px-4 py-2 rounded text-sm" },
        "Cancel",
      ),
      E = i(
        "button",
        {
          type: "submit",
          class:
            "px-4 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700",
        },
        "Sign in",
      );
    (y.appendChild(w), y.appendChild(E), f.appendChild(y), t.appendChild(f));
    const x = i("div", {
      class: "fixed inset-0 z-50 flex items-center justify-center",
    });
    return (
      x.appendChild(l),
      x.appendChild(t),
      l.addEventListener("click", b),
      u.addEventListener("click", b),
      w.addEventListener("click", b),
      f.addEventListener("submit", (S) => {
        S.preventDefault();
        const A = { email: d.value, password: C.value };
        (typeof a == "function" && a(A), b());
      }),
      (o = x),
      o
    );
  }
  function g(l) {
    return Array.from(
      l.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }
  function v(l) {
    if (l.key !== "Tab") return;
    const u = g(t);
    if (!u.length) return;
    const f = u[0],
      r = u[u.length - 1];
    l.shiftKey
      ? document.activeElement === f && (l.preventDefault(), r.focus())
      : document.activeElement === r && (l.preventDefault(), f.focus());
  }
  function h(l) {
    l.key === "Escape" ? b() : v(l);
  }
  function L(l = null) {
    (o || p(),
      o.parentNode || document.body.appendChild(o),
      (o.style.display = ""),
      (e = l));
    const u = g(t);
    (u.length && u[0].focus(),
      (n = h),
      document.addEventListener("keydown", n));
  }
  function b() {
    (o && o.parentNode && o.parentNode.removeChild(o),
      n && (document.removeEventListener("keydown", n), (n = null)),
      e && typeof e.focus == "function" && e.focus());
  }
  return { open: L, close: b };
}
function s(c, a = {}, ...o) {
  const t = document.createElement(c);
  for (const [e, n] of Object.entries(a))
    e === "class"
      ? (t.className = n)
      : e.startsWith("data-")
        ? t.setAttribute(e, n)
        : e === "html"
          ? (t.innerHTML = n)
          : t.setAttribute(e, String(n));
  for (const e of o)
    e != null &&
      (typeof e == "string"
        ? t.appendChild(document.createTextNode(e))
        : t.appendChild(e));
  return t;
}
function N() {
  const c = s("nav", {
      class: "navbar relative flex items-center justify-between p-4 bg-white",
    }),
    a = s("img", {
      src: "/repo/img/logo.svg",
      alt: "Bidora",
      class: "h-8 w-auto",
    }),
    o = s(
      "a",
      { href: "#home", class: "logo inline-flex items-center gap-2" },
      a,
      s("span", { class: "sr-only" }, "Bidora"),
    );
  c.appendChild(o);
  const t = s("button", {
    class:
      "md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100",
    "aria-controls": "mobile-menu",
    "aria-expanded": "false",
    "aria-label": "Open main menu",
  });
  ((t.innerHTML = `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>`),
    c.appendChild(t));
  const e = s("div", { class: "nav-links hidden md:flex items-center gap-6" }),
    n = s(
      "div",
      { class: "links flex items-center gap-4" },
      s("a", { href: "#auctions", class: "hover:underline" }, "Auctions"),
      s("a", { href: "#howitworks", class: "hover:underline" }, "How it Works"),
      s("a", { href: "#about", class: "hover:underline" }, "About"),
    ),
    i = s(
      "button",
      {
        type: "button",
        class:
          "inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700",
        "aria-label": "Sign in",
      },
      "Sign in",
    );
  (e.appendChild(n),
    e.appendChild(s("div", { class: "auth" }, i)),
    c.appendChild(e));
  const p = s("div", {
    id: "mobile-menu",
    class:
      "md:hidden hidden absolute top-full left-0 right-0 bg-white shadow-md p-4",
  });
  (p.appendChild(
    s(
      "a",
      { href: "#auctions", class: "block py-2 px-2 hover:underline" },
      "Auctions",
    ),
  ),
    p.appendChild(
      s(
        "a",
        { href: "#howitworks", class: "block py-2 px-2 hover:underline" },
        "How it Works",
      ),
    ),
    p.appendChild(
      s(
        "a",
        { href: "#about", class: "block py-2 px-2 hover:underline" },
        "About",
      ),
    ));
  const g = s(
    "button",
    {
      class:
        "mt-2 inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-md text-center",
    },
    "Sign in",
  );
  (p.appendChild(g), c.appendChild(p));
  const v = O({
    onSubmit(h) {
      console.log("Sign in submitted", h);
    },
  });
  return (
    t.addEventListener("click", () => {
      p.classList.contains("hidden")
        ? (p.classList.remove("hidden"),
          t.setAttribute("aria-expanded", "true"))
        : (p.classList.add("hidden"), t.setAttribute("aria-expanded", "false"));
    }),
    i.addEventListener("click", (h) => {
      v.open(h.currentTarget);
    }),
    g.addEventListener("click", (h) => {
      (p.classList.add("hidden"), v.open(h.currentTarget));
    }),
    c
  );
}
function k(c = "#vanilla-navbar") {
  const a = document.querySelector(c);
  if (!a) return null;
  const o = N();
  return ((a.innerHTML = ""), a.appendChild(o), o);
}
typeof window < "u" &&
  (document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", () => k())
    : k());
