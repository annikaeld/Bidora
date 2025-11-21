import { displayError } from "./displayError.js";
import { setAvatarModal } from "./setAvatarModal.js";
import { updateAvatar } from "../api/profile.js";
import { createListingHtml } from "./createListingHtml.js";
import { createWinningsHtml } from "./createWinningsHtml.js";
import { load } from "../storage/load.js";
import initVanillaNavbar from "./navbar.js";

async function loadProfile() {
  try {
    let profile = await load("profile");
    if (!profile) {
      profile = { name: "Not logged in", email: "" };
    }
    setElementContent("profile-name", profile.name);
    setElementContent("profile-email", profile.email);
    setElementContent("profile-credits", profile.credits);
    setAvatar(profile.avatar);
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

async function setAvatar(avatar) {
  const avatarContainer = document.getElementById("avatar-container");
  if (avatarContainer) {
    avatarContainer.innerHTML = `<img src="${avatar.url}" alt="${avatar.alt}"/>`;
  }
}

async function loadMyListings(profile) {
  try {
    console.log("Loading my listings for profile:", profile);
    const listingsContainer = document.getElementById("my-listings-container");
    if (!listingsContainer) return;
    // make the listings container use the auctions grid so cards match auction layout
    listingsContainer.classList.add("auctions-grid");
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

async function loadWinnings(profile) {
  try {
    console.log("Loading winnings for profile:", profile);
    const winningsContainer = document.getElementById("winnings-container");
    if (!winningsContainer) return;
    if (!profile || !Array.isArray(profile.wins)) {
      winningsContainer.innerHTML =
        '<p class="text-gray-500">No winnings found.</p>';
      return;
    }
    let html = "";
    for (const winning of profile.wins) {
      html += createWinningsHtml(winning);
    }
    winningsContainer.innerHTML = html;
  } catch (error) {
    console.error("Failed to load winnings:", error);
    const errorContainer = document.getElementById("error-container");
    displayError(errorContainer, error);
  }
}

function setupAvatarEditButton() {
  const editBtn = document.getElementById("edit-avatar-btn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      setAvatarModal(async (avatarUrl) => {
        await updateAvatar(avatarUrl);
        initVanillaNavbar();
      });
      
    });
  }
}

function setupWinningsToggleButton() {
  const navLinks = document.querySelectorAll(".flex-row a");
  const listingsBtn = navLinks[0];
  const winningsBtn = navLinks[2];
  const winningsContainer = document.getElementById("winnings-container");
  const listingsContainer = document.getElementById("my-listings-container");
  if (winningsBtn && winningsContainer && listingsContainer) {
    winningsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Winnings button clicked");
      winningsContainer.classList.remove("hidden");
      listingsContainer.classList.add("hidden");
    });
  }
  if (listingsBtn && winningsContainer && listingsContainer) {
    listingsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Listings button clicked");
      listingsContainer.classList.remove("hidden");
      winningsContainer.classList.add("hidden");
    });
  }
}

function setupProfilePageInteractions() {
  setupAvatarEditButton();
  setupWinningsToggleButton();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", async () => {
    let profile = await loadProfile();
    await loadMyListings(profile);
    await loadWinnings(profile);
    setupProfilePageInteractions();
  });
} else {
  (async () => {
    let profile = await loadProfile();
    await loadMyListings(profile);
    await loadWinnings(profile);
    setupProfilePageInteractions();
  })();
}
