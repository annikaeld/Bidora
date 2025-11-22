import { displayMessage } from "./displayMessage.js";

export async function renderAuctions(auctions) {
  console.log("renderAuctions: auctions =", auctions);
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
										<p><small>Ends at: ${new Date(auction.endsAt).toLocaleString()}</small></p>
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
