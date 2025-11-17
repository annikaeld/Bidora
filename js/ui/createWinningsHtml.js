// createWinningsHtml.js

/**
 * Generates HTML for a single winning item.
 * @param {Object} win - Winning item object from the profile.
 * @returns {string} HTML string representing the winning card.
 */
export function createWinningsHtml(win) {
  console.log("Creating winnings HTML for win:", win);
  if (!win || typeof win !== "object") {
    return '<p class="text-gray-500">No winnings found.</p>';
  }

  const imageUrl = win.media?.[0]?.url || "";
  const imageAlt = win.media?.[0]?.alt || win.title || "";

  return `
    <div class="bg-white rounded-lg shadow p-4 flex flex-col">
      <div class="flex items-center mb-2">
        <img src="${imageUrl}" alt="${imageAlt}" class="w-20 h-20 object-cover rounded mr-4" />
        <div>
          <h3 class="font-bold text-lg mb-1">${win.title || "Untitled"}</h3>
          <p class="text-xs text-gray-500">Ended: ${win.endsAt ? new Date(win.endsAt).toLocaleString() : "-"}</p>
        </div>
      </div>
      <p class="text-gray-700 mb-2">${win.description || ""}</p>
      <a href="/auctions/listing.html?id=${win.id}" class="text-blue-600 hover:underline text-sm mt-auto">View details</a>
    </div>
  `;
}
