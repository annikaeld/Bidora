import { getCurrentProfile } from "../api/profile.js";
import { displayError } from "./displayError.js";
import { setAvatarModal } from "./setAvatarModal.js";
import { updateAvatar } from "../api/profile.js";
import { createListingHtml } from "./createListingHtml.js";

async function loadProfile() {
  try {
    let profile = await getCurrentProfile();
    if (!profile) {
      profile = { name: "Not logged in", email: "" };
    }
    setElementContent("profile-name", profile.name);
    setElementContent("profile-email", profile.email);
    setElementContent("profile-credits", profile.credits);
    return profile;
  } catch (error) {
    console.error("Failed to load profile:", error);
    const errorContainer = document.getElementById("error-container");
    displayError(errorContainer, error);
  }
}

async function setElementContent(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

async function loadMyListings(profile) {
  try {
    console.log("Loading my listings for profile:", profile);
    const listingsContainer = document.getElementById("my-listings-container");
    if (!listingsContainer) return;
    if (!profile || !Array.isArray(profile.listings)) {
      listingsContainer.innerHTML =
        '<p class="text-gray-500">No listings found.</p>';
      return;
    }
    let html = "";
    for (const listing of profile.listings) {
      html += createListingHtml(listing);
    }
    listingsContainer.innerHTML = html;
  } catch (error) {
    console.error("Failed to load my listings:", error);
    const errorContainer = document.getElementById("error-container");
    displayError(errorContainer, error);
  }
}

let profile = await loadProfile();
await loadMyListings(profile);

// Add event listener for avatar edit button
document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("edit-avatar-btn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      setAvatarModal((avatarUrl) => {
        updateAvatar(avatarUrl);
      });
    });
  }
});
