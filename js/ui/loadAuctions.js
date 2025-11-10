import { getAuctions } from "../api/auctions.js";

export async function loadAuctions(auctions) {
  const auctionsContainer = document.getElementById("auctions-container");
  auctionsContainer.innerHTML = ""; // Clear existing auctions
  if (!auctions || !auctions.data || auctions.data.length === 0) {
    auctionsContainer.innerHTML =
      '<div class="text-center text-gray-500">No auctions available.</div>';
    return;
  }
  try {
    auctions.data.forEach((auction) => {
      const auctionElement = document.createElement("div");
      auctionElement.className = "auctionElement";
      const hasMedia = auction.media && auction.media.length > 0;
      const imgTag = hasMedia
        ? `<img src="${auction.media[0].url}" alt="${auction.media[0].alt}" width="100"/>`
        : `<div class="no-image" style="width:100px;height:100px;background:#eee;display:flex;align-items:center;justify-content:center;">No Image</div>`;
      auctionElement.innerHTML = `
                <p>id =${auction.id}</p>
                <p>Title: ${auction.title}</p>
                <p>Description: ${auction.description}</p>
                ${imgTag}
                <p>Ends at: ${new Date(auction.endsAt).toLocaleString()}</p>
                <p>Number of bids: ${auction._count.bids}</p>
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
