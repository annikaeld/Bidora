import { el } from "./createElement.js";
import { postListing, updateListing } from "../api/auctions.js";
import { displayMessage } from "./displayMessage.js";
import { itemFromApi } from "../api/item.js";

/**
 * Extracts form values including all image URLs and alt-texts from the form.
 * @param {string} formId - The id of the form element.
 * @returns {Object} An object with title, description, endsAt, and media array.
 */
function getFormValues(formId) {
  const form = document.getElementById(formId);
  if (!form) {
    console.error(`Form with id "${formId}" not found.`);
    displayMessage("Error", `Form with id "${formId}" not found.`);
    return {};
  }
  const title = form.querySelector('[name="title"]')?.value || "";
  const description = form.querySelector('[name="description"]')?.value || "";

  let endsAt = form.querySelector('[name="ends-at"]')?.value || "";
  // Convert local datetime to UTC ISO string if value exists
  if (endsAt) {
    const localDate = new Date(endsAt);
    console.log("Local date for endsAt:", localDate);
    endsAt = localDate.toISOString();
    console.log("Converted endsAt to ISO string:", endsAt);
  }
  // Collect all image-url and image-alt-text pairs
  const media = [];
  let i = 1;
  while (true) {
    const urlInput = form.querySelector(`[name="image-url-${i}"]`);
    const altInput = form.querySelector(`[name="image-alt-text-${i}"]`);
    if (!urlInput && !altInput) break;
    if (urlInput || altInput) {
      media.push({
        url: urlInput ? urlInput.value : "",
        alt: altInput ? altInput.value : "",
      });
    }
    i++;
  }
  return { title, description, endsAt, media };
}

/**
 * Attaches a submit event listener to the edit post form.
 * @param {string|null} postId - The ID of the post to edit, or null for new post.
 * @param {string} formId - The id of the form element.
 * @returns {void}
 */
function attachSubmitEventListener(postId, formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      savePost(formId, postId);
    });
  } else {
    console.error(`Form with id "${formId}" not found.`);
    displayMessage("Error", `Form with id "${formId}" not found.`);
  }
}

function attachAddImageEventListener(buttonId, containerId) {
  const button = document.getElementById(buttonId);
  const container = document.getElementById(containerId);
  let imageCounter = 2;
  if (button && container) {
    button.addEventListener("click", function () {
      const urlId = `image-url-${imageCounter}`;
      const altId = `image-alt-text-${imageCounter}`;
      const labelUrl = el("label", { for: urlId }, "Image URL");
      const inputUrl = el("input", {
        type: "url",
        id: urlId,
        name: urlId,
        class: "w-full border h-9 rounded-md",
        required: true,
      });
      const labelAlt = el("label", { for: altId }, "Image alt-text");
      const inputAlt = el("input", {
        type: "text",
        id: altId,
        name: altId,
        class: "w-full border h-9 rounded-md",
      });
      container.appendChild(labelUrl);
      container.appendChild(inputUrl);
      container.appendChild(labelAlt);
      container.appendChild(inputAlt);
      imageCounter++;
    });
  }
}

async function initPage() {
  // Check for id param in URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    try {
      const item = await itemFromApi(id);
      if (item && item.data) {
        // Populate form fields
        const form = document.getElementById("edit-listing-form");
        if (form) {
          form.querySelector('[name="title"]').value = item.data.title || "";
          form.querySelector('[name="description"]').value = item.data.description || "";
          if (item.data.endsAt) {
            const dt = new Date(item.data.endsAt);
            form.querySelector('[name="ends-at"]').value = dt.toISOString().slice(0, 16);
          }

          populateImageFields(form, item.data.media);

          // Change button text to 'Update listing'
          const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
          if (submitBtn) {
            submitBtn.textContent = "Update listing";
          }
        }
        // Change heading to 'Edit Listing'
        const heading = document.querySelector("#post-container h1");
        if (heading) {
          heading.textContent = "Edit Listing";
        }
      }
    } catch (e) {
      console.error("Error loading item for edit:", e);
      displayMessage("Error loading item for edit", e.message);
    }
  }
  attachSubmitEventListener(id, "edit-listing-form");
  attachAddImageEventListener("add-image-button", "add-images-container");

  function populateImageFields(form, media) {
    if (!Array.isArray(media) || media.length === 0) return;
    form.querySelector('[name="image-url-1"]').value = media[0].url || "";
    form.querySelector('[name="image-alt-text-1"]').value = media[0].alt || "";
    const container = document.getElementById("add-images-container");
    let imageCounter = 2;
    for (let i = 1; i < media.length; i++) {
      const urlId = `image-url-${imageCounter}`;
      const altId = `image-alt-text-${imageCounter}`;
      if (!form.querySelector(`[name="${urlId}"]`)) {
        const labelUrl = el("label", { for: urlId }, "Image URL");
        const inputUrl = el("input", {
          type: "url",
          id: urlId,
          name: urlId,
          class: "w-full border h-9 rounded-md",
          required: true,
        });
        const labelAlt = el("label", { for: altId }, "Image alt-text");
        const inputAlt = el("input", {
          type: "text",
          id: altId,
          name: altId,
          class: "w-full border h-9 rounded-md",
        });
        container.appendChild(labelUrl);
        container.appendChild(inputUrl);
        container.appendChild(labelAlt);
        container.appendChild(inputAlt);
      }
      form.querySelector(`[name="${urlId}"]`).value = media[i].url || "";
      form.querySelector(`[name="${altId}"]`).value = media[i].alt || "";
      imageCounter++;
    }
  }
}

async function savePost(formId, postId) {
  console.log(`Saving post with ID: ${postId}`);
  const { title, description, endsAt, media } = getFormValues(formId);
  console.log("Form Values:", { title, description, endsAt, media });
  const listingObject = {
    title: title,
    description: description,
    endsAt: endsAt,
    media: media,
  };
  console.log("Listing Object to be sent:", listingObject);
  try {
    if (postId) {
      // Update existing listing
      await updateListing(postId, listingObject);
      window.location.href = `listing.html?id=${postId}`;
    } else {
      // Create new listing
      const id = await postListing(listingObject);
      window.location.href = `listing.html?id=${id}`;
    }
  } catch (error) {
    console.error(postId ? "Error updating listing:" : "Error creating listing:", error);
    displayMessage(postId ? "Error updating listing" : "Error creating listing", error.message);
  }
}

initPage();
