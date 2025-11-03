import { useEffect } from "react";

export default function SignInModal({ open, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-lg"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Close sign in dialog"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Sign in</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Placeholder: handle submission
            onClose();
          }}
        >
          <label className="block text-sm mb-2">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              required
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </label>

          <label className="block text-sm mb-4">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              required
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </label>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
