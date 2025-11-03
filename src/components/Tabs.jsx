import React, { useState } from "react";

export default function Tabs({ tabs }) {
  const [activeTab, setActive] = useState(0);

  return (
    <div className="tabs">
      <div className="flex space-x-2 mb-4">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded-md ${activeTab === i ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs[activeTab].content}</div>
    </div>
  );
}
