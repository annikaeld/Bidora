import React from "react";

export default function Card({ title = "Featured item", children }) {
  return (
    <article className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="text-gray-700">
        {children ?? <p>This is a sample card. Replace with your content.</p>}
      </div>
    </article>
  );
}
