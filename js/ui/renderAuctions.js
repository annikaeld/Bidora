// Helper to format time left as 'X days Y hours Z minutes'
function formatTimeLeft(endTime) {
  const now = new Date();
  const end = new Date(endTime);
  let diff = Math.max(0, end - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;
  const minutes = Math.floor(diff / (1000 * 60));
  return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
}
import { displayMessage } from "./displayMessage.js";

export async function renderAuctions(auctions) {
  const auctionsContainer = document.getElementById("auctions-container");
  auctionsContainer.innerHTML = ""; // Clear existing auctions
  if (!auctions || auctions.length === 0) {
    auctionsContainer.innerHTML =
      '<div class="text-center text-gray-500">No auctions available.</div>';
    return;
  }
  try {
    auctions.forEach((auction) => {
      const auctionElement = document.createElement("div");
      // use the CSS class defined in globals.css
      auctionElement.className = "auction-element";
      const hasMedia = auction.media && auction.media.length > 0;
      const imgTag = hasMedia
        ? `<div class="auction-image-wrap"><img src="${auction.media[0].url}" alt="${(auction.media[0].alt || auction.title).replace(/"/g, "&quot;")}" class="auction-image"/></div>`
        : `<div class="no-image">No Image</div>`;

      // determine a sensible id property from possible API shapes
      const auctionId =
        auction.id || auction._id || auction.uuid || auction._uuid || "";
      const detailsUrl = auctionId
        ? `listing.html?id=${encodeURIComponent(auctionId)}`
        : "listing.html";

      // Wrap the card content in a link so clicking anywhere navigates to the details page
      auctionElement.innerHTML = `
        <a href="${detailsUrl}" class="block h-full no-underline text-inherit">
          ${imgTag}
          <h3 class="mt-2">${auction.title}</h3>
          <div class="auction-meta">
            <p><small>Ends in: ${formatTimeLeft(auction.endsAt)}</small></p>
            <p><small>Bids: ${auction._Count || (auction._count && auction._count.bids) || 0}</small></p>
            <h3 class="text-end">${auction.bids && auction.bids.length > 0 ? `${Math.max(...auction.bids.map((bid) => bid.amount))} tokens` : "No bids yet"}</h3>
          </div>
        </a>
      `;
      auctionsContainer.appendChild(auctionElement);
    });
  } catch (error) {
    console.error("Error loading auctions:", error);
    await displayMessage("Error loading auctions", error.message);
  }
}
