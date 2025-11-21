import { API_BASE, API_AUCTION, API_PROFILES } from "./constants.js";
import { authFetch } from "./fetch.js";
import { load } from "../storage/load.js";
import { save } from "../storage/save.js";

export async function getProfile(username) {
  const response = await authFetch(
    `${API_BASE}${API_AUCTION}${API_PROFILES}/${username}?_listings=true&_wins=true`
  );
  const profile = await response.json();
  return profile;
}

export async function getCurrentProfile() {
  const storedProfile = await load("profile");
  if (!storedProfile || !storedProfile.name) {
    return null;
  }
  let username = storedProfile.name;
  const profileResponse = await getProfile(username);
  if (
    !profileResponse ||
    !Object.prototype.hasOwnProperty.call(profileResponse, "data")
  ) {
    throw new Error("Profile response does not contain 'data' property");
  }
  const profile = profileResponse.data;
  console.log("Profile:", profile);
  return profile;
}

export async function updateAvatar(avatar) {
  console.log("Updating avatar to:", avatar);
  const profile = await getCurrentProfile();
  if (!profile || !profile.name) {
    throw new Error("No current profile found");
  }
  profile.avatar = avatar;
  console.log("Updated profile to:", profile);
  await saveProfile(profile);
}

export async function saveProfile(profile) {
  console.log("Saving profile:", profile);
  const response = await authFetch(
    `${API_BASE}${API_AUCTION}${API_PROFILES}/${profile.name}`,
    {
      method: "PUT",
      body: JSON.stringify(profile),
    }
  );
  save("profile", profile);
  return response.json;
}
