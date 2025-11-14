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
  const html = `
    <h1 class="text-2xl font-bold">${escapeHtml(title)}</h1>
    <p class="mt-2 text-gray-700">${escapeHtml(description)}</p>
  `;
  container.innerHTML = html;
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
