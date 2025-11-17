import { getCurrentProfile } from "../api/profile.js";
import { displayError } from "./displayError.js";
import { setAvatarModal } from "./setAvatarModal.js";
import { updateAvatar } from "../api/profile.js";

async function loadProfile() {
  try {
    let profile = await getCurrentProfile();
    if (!profile) {
      profile = { name: "Not logged in", email: "" };
    }
    setElementContent("profile-name", profile.name);
    setElementContent("profile-email", profile.email);
    setElementContent("profile-credits", profile.credits);
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

loadProfile();

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
