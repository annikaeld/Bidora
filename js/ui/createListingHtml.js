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
  // determine a sensible id property from possible API shapes
  const listingId =
    listing.id || listing._id || listing.uuid || listing._uuid || "";
  const detailsUrl = listingId
    ? `listing.html?id=${encodeURIComponent(listingId)}`
    : "listing.html";

  const imgTag = imgUrl
    ? `<div class="auction-image-wrap"><img src="${imgUrl}" alt="${imgAlt.replace(/"/g, "&quot;")}" class="auction-image"/></div>`
    : `<div class="no-image">No Image</div>`;

  return `
    <div class="auction-element">
      <a href="${detailsUrl}" class="block h-full no-underline text-inherit">
        ${imgTag}
        <h3 class="mt-2">${title}</h3>
        <div class="auction-meta">
          <p><small>${description}</small></p>
          <p><small>Ends: ${endsAt ? new Date(endsAt).toLocaleString() : "-"}</small></p>
        </div>
      </a>
    </div>
  `;
}
