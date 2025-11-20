import { el } from "./createElement.js";
import { postListing } from "../api/auctions.js";
import { displayMessage } from "./displayMessage.js";

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
        class: "w-full border",
        required: true,
      });
      const labelAlt = el("label", { for: altId }, "Image alt-text");
      const inputAlt = el("input", {
        type: "text",
        id: altId,
        name: altId,
        class: "w-full border",
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
  attachSubmitEventListener(null, "edit-listing-form");
  attachAddImageEventListener("add-image-button", "add-images-container");
}

function savePost(formId, postId) {
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
  postListing(listingObject)
    .then((id) => {
      console.log("Listing created with ID:", id);
      window.location.href = `listing.html?id=${id}`;
    })
    .catch((error) => {
      console.error("Error creating listing:", error);
      displayMessage("Error creating listing", error.message);
    });
}

initPage();
