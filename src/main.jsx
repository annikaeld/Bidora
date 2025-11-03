import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />

      <main className="min-h-[60vh] p-6 bg-slate-50">
        <section className="max-w-4xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to Bidora</h1>
          <p className="mb-6 text-gray-600">
            A simple homepage example that mounts your components.
          </p>

          <Card title="Example listing">
            <p className="mb-3">
              This is a sample card component rendered on the homepage. Replace
              this with your auctions or featured items.
            </p>
            <p className="text-sm text-gray-500">
              Click Sign in in the navbar to open the modal.
            </p>
          </Card>
        </section>
      </main>

      <Footer />
    </>
  );
}

createRoot(document.getElementById("app")).render(<App />);
