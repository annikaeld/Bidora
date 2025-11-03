import React from "react";

export default function Alert({ type = "primary", children }) {
  const colors = {
    primary: "bg-accentBackground text-white",
    sucess: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    warning: "bg-yellow-400 text-blackText",
  };
  return <div className={`alert ${colors[type]}`}>{children}</div>;
}
