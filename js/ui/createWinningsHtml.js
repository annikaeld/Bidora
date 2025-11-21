// createWinningsHtml.js

/**
 * Generates HTML for a single winning item.
 * @param {Object} win - Winning item object from the profile.
 * @returns {string} HTML string representing the winning card.
 */
export function createWinningsHtml(win) {
  if (!win || typeof win !== "object") {
    return '<p class="text-gray-500">No winnings found.</p>';
  }

  const imageUrl = win.media?.[0]?.url || "";
  const imageAlt = win.media?.[0]?.alt || win.title || "";
  const title = win.title || "Untitled";
  const description = win.description || "";
  const endsAt = win.endsAt ? new Date(win.endsAt).toLocaleString() : "-";

  return `
    <div class="auction-element">
      <a href="/auctions/listing.html?id=${win.id}" class="block h-full no-underline text-inherit">
        <div class="auction-image-wrap"><img src="${imageUrl}" alt="${imageAlt}" class="auction-image"></div>
        <h3 class="mt-2">${title}</h3>
        <div class="auction-meta">
          <p><small>${description}</small></p>
          <p><small>Ends: ${endsAt}</small></p>
        </div>
      </a>
    </div>
  `;
}
