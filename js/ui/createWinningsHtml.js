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
    <div class="auction-element mt-2">
      <a href="/auctions/listing.html?id=${win.id}">
      <div class="auction-image-wrap">
        <img src="${imageUrl}" alt="${imageAlt}"/>
      </div>
      <h3 class="mt-2">${win.title || "Untitled"}</h3>
      <p class="auction-meta">Ended: ${win.endsAt ? new Date(win.endsAt).toLocaleString() : "-"}</p>
      <p class="auction-meta mb-2">${win.description || ""}</p>
      </a>
    </div>
  `;
}
