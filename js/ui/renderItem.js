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
    <p>Auction ends in: ${escapeHtml(endsIn)}</p>
    <h2>${bids && bids.length > 0 ? `${Math.max(...bids.map((bid) => bid.amount))} tokens` : "No bids yet"}</h2>
    <form id="place-bid-form" class="mt-3 flex items-center gap-2" aria-label="Place a bid">
      <label for="bid-amount" class="sr-only">Bid amount</label>
      <input id="bid-amount" name="amount" type="number" min="0" step="1" placeholder="Enter bid" class="px-3 py-2 border rounded-md w-32" />
      <button id="place-bid-btn" type="submit" class="inline-flex items-center px-3 py-2 rounded-md bg-[var(--color-cta)] text-white hover:bg-[var(--color-cta-hover)]">Place bid</button>
    </form>`;

  let bidsSection = bidsHtml
    ? `<div class="mt-4"><h3 class="font-semibold">Bids</h3><ul class="mt-2">${bidsHtml}</ul></div>`
    : `<p class="mt-4 text-sm text-gray-500">No bids yet</p>`;
  bidsSection = topOfBidsSectionHtml + bidsSection;

  // Render main item html. Do NOT create a bidding container here —
  // the page should already include an element with id="bidding-container".
  container.innerHTML = html;
  const biddingContainer = document.getElementById("bidding-container");
  if (biddingContainer) {
    biddingContainer.innerHTML = bidsSection;
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
