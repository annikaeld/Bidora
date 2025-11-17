// Returns HTML string for a single listing
export function createListingHtml(listing) {
  const title = listing.title || "Untitled";
  const description = listing.description || "";
  const media =
    Array.isArray(listing.media) && listing.media.length > 0
      ? listing.media[0]
      : null;
  const imgUrl = media?.url || "";
  const imgAlt = media?.alt || title;
  const endsAt = listing.endsAt || "";
  return `
    <div class="listing-card border rounded-lg p-4 mb-4 bg-white shadow">
      <img src="${imgUrl}" alt="${imgAlt}" class="w-full h-40 object-cover rounded mb-2" />
      <h3 class="font-bold text-lg mb-1">${title}</h3>
      <p class="text-gray-700 text-sm mb-2">${description}</p>
      <p class="text-xs text-gray-500">Ends: ${endsAt}</p>
    </div>
  `;
}
