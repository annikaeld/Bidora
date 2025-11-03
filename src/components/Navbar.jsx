import React, { useState, useRef } from "react";
import SignInModal from "./SignInModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const desktopSignInRef = useRef(null);
  const mobileSignInRef = useRef(null);
  const lastFocusRef = useRef(null);

  return (
    <nav
      className="navbar relative flex items-center justify-between p-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <a href="#home" className="logo font-semibold text-lg">
        Bidora
      </a>

      {/* Hamburger button - visible on small screens only */}
      <button
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
        aria-controls="mobile-menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">Open main menu</span>
        {/* Icon: simple bars / X */}
        {open ? (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Desktop links - hidden on small screens */}
      <div className="nav-links hidden md:flex items-center gap-6">
        <div className="links flex items-center gap-4">
          <a href="#auctions" className="hover:underline">
            Auctions
          </a>
          <a href="#howitworks" className="hover:underline">
            How it Works
          </a>
          <a href="#about" className="hover:underline">
            About
          </a>
        </div>

        <div className="auth">
          <button
            type="button"
            ref={desktopSignInRef}
            onClick={() => {
              lastFocusRef.current = desktopSignInRef.current;
              setSignInOpen(true);
            }}
            className="inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700"
            aria-label="Sign in"
          >
            Sign in
          </button>
        </div>
      </div>

      {/* Mobile menu - visible when open on small screens */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-4"
        >
          <div className="flex flex-col gap-3">
            <a
              href="#auctions"
              className="block py-2 px-2 hover:underline"
              onClick={() => setOpen(false)}
            >
              Auctions
            </a>
            <a
              href="#howitworks"
              className="block py-2 px-2 hover:underline"
              onClick={() => setOpen(false)}
            >
              How it Works
            </a>
            <a
              href="#about"
              className="block py-2 px-2 hover:underline"
              onClick={() => setOpen(false)}
            >
              About
            </a>
            <button
              type="button"
              ref={mobileSignInRef}
              className="mt-2 inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-md text-center"
              onClick={() => {
                // remember which element opened the modal so we can return focus
                lastFocusRef.current = mobileSignInRef.current;
                setOpen(false);
                setSignInOpen(true);
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      )}
      <SignInModal
        open={signInOpen}
        onClose={() => {
          setSignInOpen(false);
          // return focus to the element that opened the modal
          try {
            lastFocusRef.current?.focus();
          } catch (e) {
            /* ignore */
          }
        }}
      />
    </nav>
  );
}
