import { load } from "../storage/load.js";
import { deleteListing } from "../api/auctions.js";
import { displayMessage } from "./displayMessage.js";


export function insertItemImage(item) {
  const container =
    document.getElementById("item-image") ||
    document.getElementById("image-container");
  if (!container) return;
  container.innerHTML = "";
  const hasMedia =
    item && Array.isArray(item.data.media) && item.data.media.length > 0;
  if (hasMedia) {
    const img = document.createElement("img");
    img.src = item.data.media[0].url;
    img.alt = item.data.media[0].alt || item.data.title || "Item image";
    img.className = "w-full h-full object-cover";
    container.appendChild(img);
  } else {
    container.innerHTML = '<div class="no-image">No Image</div>';
  }
}

export function insertItemText(item) {
  const container =
    document.getElementById("item-details") ||
    document.getElementById("details-container");
  if (!container) return;
  container.innerHTML = "";
  const title = item?.data.title || "Untitled";

  const description = item?.data.description || "";
  const avatarUrl = item?.data.seller.avatar.url || "";
  const avatarAlt = item?.data.seller.avatar.alt || "";
  const seller = item?.data.seller.name || "";
  const endsAt = item?.data.endsAt || "";
  const endsIn = endsAt ? formatRemaining(endsAt) : "";
  const bids = Array.isArray(item?.data?.bids) ? item.data.bids : [];
  const sorted = [...bids].sort((a, b) => {
    const ta = a?.created ? new Date(a.created).getTime() : 0;
    const tb = b?.created ? new Date(b.created).getTime() : 0;
    return tb - ta; // tb - ta => newest first
  });
  const html = `
    <h1>${escapeHtml(title)}</h1>
    <p class="mt-2">${escapeHtml(description)}</p>
    <img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(avatarAlt)}" class="w-10 h-10 rounded-full mt-4" />
    <p>${escapeHtml(seller)}</p>
    
  `;
  const bidsHtml = sorted
    .map((b) => {
      const bidder = b?.bidder?.name || b?.bidder?.email || "Anonymous";
      const amount = b?.amount ?? b?.value ?? "";
      const created = b?.created ? formatAge(b.created) : "";
      const timePart = created
        ? ` <small class="text-gray-500">• ${escapeHtml(created)}</small>`
        : "";
      const bidderAvatar = b?.bidder?.avatar?.url || "";
      const bidderInitials =
        (bidder.split &&
          bidder
            .split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")) ||
        "";

      const bidderLeft = bidderAvatar
        ? `<img src="${escapeHtml(bidderAvatar)}" alt="${escapeHtml(bidder)}" class="w-6 h-6 rounded-full mr-2 object-cover" />`
        : `<div class="w-6 h-6 rounded-full mr-2 flex items-center justify-center text-xs">${escapeHtml(bidderInitials)}</div>`;

      return `<li class="flex justify-between items-center py-1">
      <div class="flex items-center"><span class="inline-block">${bidderLeft}</span><span>${escapeHtml(bidder)}${timePart}</span></div>
      <span>${escapeHtml(String(amount))}</span>
    </li>`;
    })
    .join("");

  const topOfBidsSectionHtml = `
    <p>Auction ends in:</p>
    <p>${escapeHtml(endsIn)}</p>
    <br />
    <h2>${bids && bids.length > 0 ? `${Math.max(...bids.map((bid) => bid.amount))} tokens` : "No bids yet"}</h2>`
  let bidFormHtml
  if (isSellerCurrentUser(seller)) {
    bidFormHtml = '';
    } else {
    bidFormHtml = `
    <form id="place-bid-form" class="mt-3 flex items-center gap-2" aria-label="Place a bid">
      <label for="bid-amount" class="sr-only">Bid amount</label>
      <input id="bid-amount" name="amount" type="number" min="0" step="1" placeholder="Enter bid" class="px-3 py-2 border rounded-md w-32" />
      <button id="place-bid-btn" type="submit" class="inline-flex items-center px-3 py-2 rounded-md bg-[var(--color-cta)] text-white hover:bg-[var(--color-cta-hover)]">Place bid</button>
    </form>`;
  }
  let bidsSection = bidsHtml
    ? `<div class="mt-4"><h3 class="font-semibold">Bids</h3><ul class="mt-2">${bidsHtml}</ul></div>`
    : `<p class="mt-4 text-sm text-gray-500">No bids yet</p>`;

  bidsSection = topOfBidsSectionHtml + bidFormHtml + bidsSection;

  // Render main item html.
  container.innerHTML = html;
  const biddingContainer = document.getElementById("bidding-container");
  const deleteItemContainer = document.getElementById("delete-item-container");
  if (biddingContainer) {
    renderBiddingContainer();
  }
  if (deleteItemContainer && isSellerCurrentUser(seller)) {
    renderDeleteItemContainer();
  }


  /**
   * Renders the bids section and sets up the bid form event listener.
   */
  function renderBiddingContainer() {
    biddingContainer.innerHTML = bidsSection;
    // Add event listener for place bid form
    const placeBidForm = document.getElementById("place-bid-form");
    if (placeBidForm) {
      placeBidForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const amountInput = document.getElementById("bid-amount");
        const amount = amountInput ? Number(amountInput.value) : 0;
        if (!amount || amount <= 0) {
          displayMessage("Invalid Bid", "Please enter a valid bid amount.");
          return;
        }
        try {
          const { placeBid } = await import("../api/item.js");
          const listingId = item?.data?.id;
          if (!listingId) {
            displayMessage("Error", "Listing ID not found.");
            return;
          }
          const result = await placeBid(listingId, amount);
          if (result) {
            displayMessage("Success", "Bid placed successfully!");
            window.location.reload();
          } else {
            displayMessage("Error placing bid", "Failed to place bid. Please try again.");
          }
        } catch (err) {
          console.error(err);
          displayMessage("Error placing bid. See console for details.");
        }
      });
    }
  }

  /**
   * Renders a container with a 'Delete listing' button.
   * @param {HTMLElement} container - The container to render the button in.
   */
  async function renderDeleteItemContainer() {
    let id = item.data.id;
    if (!deleteItemContainer) return;
    deleteItemContainer.innerHTML = `<button id="delete-listing-btn" class="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">Delete listing</button>`;
    const btn = deleteItemContainer.querySelector('#delete-listing-btn');
    if (btn) {
      btn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
        try {
          const response = await deleteListing(id);
          if (response) {
            displayMessage("Success", "Listing deleted successfully.");
            window.location.href = '/auctions/';
          } else {
            displayMessage("Error", "Failed to delete listing.");
          }
        } catch (err) {
          console.error(err);
          displayMessage("Error", "Error deleting listing. See console for details.");
        }
      });
    }
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatAge(isoDate) {
  if (!isoDate) return "";
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return "";
  const now = Date.now();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

function formatRemaining(isoDate) {
  if (!isoDate) return "";
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return "";
  const now = Date.now();
  let diffSec = Math.floor((then - now) / 1000);
  if (diffSec <= 0) return "ended";
  const days = Math.floor(diffSec / 86400);
  diffSec -= days * 86400;
  const hours = Math.floor(diffSec / 3600);
  diffSec -= hours * 3600;
  const minutes = Math.floor(diffSec / 60);
  return `${days} day${days === 1 ? "" : "s"}  ${hours} hour${hours === 1 ? "" : "s"}  ${minutes} minute${minutes === 1 ? "" : "s"}`;
}

function isSellerCurrentUser(seller) {
  try {
    const profile = load('profile');
    const currentProfileName = profile?.name || null;
    return seller && currentProfileName && seller === currentProfileName;
  } catch {
    return false;
  }
}
