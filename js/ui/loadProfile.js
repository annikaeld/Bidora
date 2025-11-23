import { renderBids } from "./renderBids.js";
function hideContainer(container) {
  if (container) {
    container.classList.add("hidden");
    container.classList.remove("auctions-grid");
  }
}
function showContainer(container) {
  if (container) {
    container.classList.remove("hidden");
    container.classList.add("auctions-grid");
  }
}
import { displayError } from "./displayError.js";
import { setAvatarModal } from "./setAvatarModal.js";
import { getCurrentProfile, updateAvatar } from "../api/profile.js";
import { getBids } from "../api/bids.js";
import { createListingHtml } from "./createListingHtml.js";
import { createWinningsHtml } from "./createWinningsHtml.js";
import initVanillaNavbar from "./navbar.js";

async function loadProfile() {
  try {
    let profile = await getCurrentProfile();
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

async function loadWinnings(profile) {
  try {
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
        window.location.reload();
      });
    });
  }
}

function setupWinningsToggleButton() {
  const navLinks = document.querySelectorAll(".flex-row a");
  const listingsBtn = navLinks[0];
  const bidHistoryBtn = navLinks[1];
  const winningsBtn = navLinks[2];
  const listingsContainer = document.getElementById("my-listings-container");
  const bidHistoryContainer = document.getElementById("bid-history-container");
  const winningsContainer = document.getElementById("winnings-container");
  if (listingsBtn && listingsContainer && bidHistoryContainer && winningsContainer) {
    listingsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showContainer(listingsContainer);
      hideContainer(bidHistoryContainer);
      hideContainer(winningsContainer);

    });
  }
  if (bidHistoryBtn && listingsContainer && bidHistoryContainer && winningsContainer) {
    bidHistoryBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      const bids = await getBids();
      hideContainer(listingsContainer);
      showContainer(bidHistoryContainer);
      hideContainer(winningsContainer);
      renderBids(bids, bidHistoryContainer);
    });
  }
  if (winningsBtn && listingsContainer && bidHistoryContainer && winningsContainer) {
    winningsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      hideContainer(listingsContainer);
      hideContainer(bidHistoryContainer);
      showContainer(winningsContainer);
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
