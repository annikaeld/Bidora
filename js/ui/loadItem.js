import { getIdQueryParameter } from "../utils/urls.js";
import { itemFromApi } from "../api/item.js";
import { insertItemImage, insertItemText } from "./renderItem.js";
import { setPageTitle } from "./setPageTitle.js";

const id = getIdQueryParameter();
const item = await itemFromApi(id);
// Handle missing/404 item gracefully
if (!item) {
  // Set a clear page title
  setPageTitle("Item not found");

  // Render a helpful message in the details container (if present)
  const detailsContainer =
    document.getElementById("item-details") ||
    document.getElementById("details-container");
  if (detailsContainer) {
    detailsContainer.innerHTML = `
			<div class="p-6 bg-white rounded-md shadow-sm text-center">
				<h2 class="text-xl font-semibold mb-2">Item not found</h2>
				<p class="text-gray-600 mb-4">We couldn't find the item you're looking for. It may have been removed or the link is incorrect.</p>
				<a href="/" class="btn-primary inline-block px-4 py-2 rounded">Return to homepage</a>
			</div>
		`;
  }

  // Optionally render a placeholder image area
  const imageContainer =
    document.getElementById("item-image") ||
    document.getElementById("image-container");
  if (imageContainer) {
    imageContainer.innerHTML = '<div class="no-image">No Image</div>';
  }

  // Stop further processing
  console.warn(`Item with id=${id} not found (404).`);
} else {
  insertItemImage(item);
  insertItemText(item);
  setPageTitle(item?.name || "Item");
}
