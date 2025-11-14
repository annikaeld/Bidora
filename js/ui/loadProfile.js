import { getCurrentProfile } from "../api/profile.js";
import { displayError } from "./displayError.js";

async function loadProfile() {
  try {
    let profile = await getCurrentProfile();
    if (!profile) {
      profile = { name: "Not logged in", email: "" };
    }
    setElementContent("profile-name", profile.name);
    setElementContent("profile-email", profile.email);
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
