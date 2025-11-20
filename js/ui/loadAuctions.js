import { getAuctions } from "../api/auctions.js";

export async function loadAuctions(auctions) {
  console.log("loadAuctions: auctions =", auctions);
  const auctionsContainer = document.getElementById("auctions-container");
  auctionsContainer.innerHTML = ""; // Clear existing auctions
  // ensure the container uses the auctions grid layout
  auctionsContainer.classList.add("auctions-grid");
  if (!auctions || !auctions.data || auctions.data.length === 0) {
    auctionsContainer.innerHTML =
      '<div class="text-center text-gray-500">No auctions available.</div>';
    return;
  }
  try {
    auctions.data.forEach((auction) => {
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
                    <p><small>${auction.bids && auction.bids.length > 0 ? `Highest Bid: ${Math.max(...auction.bids.map((bid) => bid.amount))} tokens` : "No bids yet"}</small></p>
                  </div>
                </a>
            `;
      auctionsContainer.appendChild(auctionElement);
    });
  } catch (error) {
    console.error("Error loading auctions:", error);
  }
}

/**
 * Loads all auctions from the API and displays them in the feed container.
 * Redirects to the homepage if fetching auctions fails (e.g., not logged in).
 * @returns {void}
 */
export async function loadAllAuctions() {
  const auctionsContainer = document.getElementById("auctions-container");
  auctionsContainer.innerHTML = ""; // Clear existing auctions
  try {
    const auctions = await getAuctions();
    await loadAuctions(auctions);
  } catch (error) {
    console.error("Error loading auctions:", error);
    window.location.href = "/";
  }
}
loadAllAuctions();
