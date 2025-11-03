import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Footer />
    </>
  );
}

createRoot(document.getElementById("app")).render(<App />);
