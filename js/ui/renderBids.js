export function renderBids(bids, container) {
  if (!container) return;
    if (!Array.isArray(bids) || bids.length === 0) {
      container.innerHTML = '<p class="text-gray-500">No bids found.</p>';
      return;
    }
    let html = "";
    for (const bid of bids) {
    const listing = bid.listing || {};
    const title = listing.title || "Untitled";
    const description = listing.description || "";
    const media = Array.isArray(listing.media) && listing.media.length > 0 ? listing.media[0] : null;
    const imgUrl = media?.url || "";
    const imgAlt = media?.alt || title;
    const endsAt = listing.endsAt ? new Date(listing.endsAt).toLocaleString() : "-";
    const listingId = listing.id || listing._id || listing.uuid || listing._uuid || "";
    const detailsUrl = listingId ? `/auctions/listing.html?id=${encodeURIComponent(listingId)}` : "/auctions/listing.html";
    const imgTag = imgUrl
      ? `<div class="auction-image-wrap"><img src="${imgUrl}" alt="${imgAlt.replace(/"/g, '&quot;')}" class="auction-image"/></div>`
      : `<div class="no-image">No Image</div>`;
    const amount = bid.amount || bid.value || "";
    const created = bid.created ? new Date(bid.created).toLocaleString() : "";
    html += `
      <div class="auction-element">
        <a href="${detailsUrl}" class="block h-full no-underline text-inherit">
          ${imgTag}
          <h3 class="mt-2">${title}</h3>
          <div class="auction-meta">
            <p><small>${description}</small></p>
            <p><small>Ends: ${endsAt}</small></p>
            <p><small>Bid: <strong>${amount}</strong></small></p>
            <p><small class="text-xs text-gray-500">Placed: ${created}</small></p>
          </div>
        </a>
      </div>
    `;
  }
  container.innerHTML = html;
}
