import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      {/* Other components would go here */}
    </>
  );
}

createRoot(document.getElementById("app")).render(<App />);
