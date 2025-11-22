import { getFormValues } from "./getFormValues.js";
import { itemsFromApi } from "/js/api/item.js";
import { renderAuctions } from "./renderAuctions.js";
import { displayMessage } from "./displayMessage.js";

let allAuctions = [];
let currentIndex = 0;
const PAGE_SIZE = 12;
/**
 * Loads all auctions from the API and displays them in the feed container.
 * Redirects to the homepage if fetching auctions fails (e.g., not logged in).
 * @returns {void}
 */
async function loadAuctions(reset = true) {
  try {
    let { searchFor } = getFormValues("searchForm");
    const sortBy = getSortBy();
    if (searchFor.trim() == "") {
      searchActive = false;
    }
    if (!searchActive) {
      searchFor = "";
    }
    if (reset) {
      const result = await itemsFromApi(searchFor, sortBy);
      console.log("Fetched auctions:", result);
      if (result && Array.isArray(result.data)) {
        allAuctions = result.data;
      } else if (Array.isArray(result)) {
        allAuctions = result;
      } else {
        allAuctions = [];
      }
      currentIndex = 0;
    }
    renderCurrentAuctions();
    updateLoadMoreButton();
  } catch (error) {
    await displayMessage("Error loading auctions", error.message);
    console.error("Error loading auctions:", error);
    window.location.href = "/";
  }
}

function renderCurrentAuctions() {
  const feedContainer = document.getElementById("feedContainer");
  if (feedContainer) {
    feedContainer.innerHTML = "";
  }
  const toShow = allAuctions.slice(0, currentIndex + PAGE_SIZE);
  renderAuctions(toShow);
}

function updateLoadMoreButton() {
  let btn = document.getElementById("loadMoreBtn");
  if (!btn) {
    // Create button if not exists
    btn = document.createElement("button");
    btn.id = "loadMoreBtn";
    btn.textContent = "Load more";
    btn.className =
      "h-9 items-center btn-primary btn-primary-hover px-3 rounded-md mx-auto block mt-4";
    btn.addEventListener("click", handleLoadMore);
    const feedContainer = document.getElementById("feedContainer");
    if (feedContainer && feedContainer.parentNode) {
      feedContainer.parentNode.appendChild(btn);
    }
  }
  if (allAuctions.length > currentIndex + PAGE_SIZE) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}

function handleLoadMore() {
  currentIndex += PAGE_SIZE;
  renderCurrentAuctions();
  updateLoadMoreButton();
}

let searchActive = false;

/**
 * Handles the search form submission:
 * Gets form values, determines search type, fetches posts, and loads them.
 * @returns {Promise<void>}
 */
async function doSearch() {
  searchActive = true;
  await loadAuctions(true);
}

/**
 * Returns the value of the selected radio button in the dropdownRadioForm.
 * @returns {string|null} The selected sort by value, or null if none selected.
 */
function getSortBy() {
  const form = document.getElementById("dropdownRadioForm");
  if (!form) {
    console.error("dropdownRadioForm not found");
    displayMessage("Error", "Dropdown radio form not found.");
    return null;
  }
  const checked = form.querySelector('input[name="sortBy"]:checked');
  return checked ? checked.value : null;
}

/**
 * Toggles the visibility of the dropdown menu.
 * @returns {void}
 */
function toggleDropdownMenuVisibility() {
  const menu = document.getElementById("dropdownMenu");
  if (menu) {
    menu.classList.toggle("hidden");
  } else {
    console.error("Dropdown menu element not found!");
    displayMessage("Error", "Dropdown menu element not found.");
  }
}

/**
 * Attaches a submit event listener to the specified form.
 * Prevents default submission and triggers doSearch.
 * @param {string} formId - The id of the form to attach the listener to.
 * @returns {void}
 */
function attachSubmitEventListener(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      doSearch();
    });
  } else {
    console.error(`Form with id "${formId}" not found.`);
    displayMessage("Error", `Form with id "${formId}" not found.`);
  }
}

/**
 * Attaches a click event listener to the dropdown button to toggle menu visibility.
 * @returns {void}
 */
function attachDropdownButtonListener() {
  const dropdownButton = document.getElementById("dropdownDefaultButton");
  if (dropdownButton) {
    dropdownButton.addEventListener("click", toggleDropdownMenuVisibility);
  }
}

/**
 * Updates the dropdown button text to match the selected radio option,
 * and closes the dropdown menu after a selection is made.
 * @returns {void}
 */
export function attachDropdownRadioListeners() {
  document.querySelectorAll('input[name="sortBy"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      document.getElementById("dropdownSelectedText").textContent = this.value;
      document.getElementById("dropdownMenu").classList.add("hidden");
    });
  });
}

/**
 * Initializes the search form handler and dropdown listeners when DOM is loaded.
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
  attachSubmitEventListener("searchForm");
  attachDropdownButtonListener();
  attachDropdownRadioListeners();
  if (!document.getElementById("feedContainer")) {
    const container = document.createElement("div");
    container.id = "feedContainer";
    const main = document.querySelector("main") || document.body;
    main.appendChild(container);
  }
  loadAuctions(true);
  // Trigger loadAuctions when dropdownRadioForm changes
  const dropdownRadioForm = document.getElementById("dropdownRadioForm");
  if (dropdownRadioForm) {
    dropdownRadioForm.addEventListener("change", () => {
      loadAuctions(true);
    });
  }
});
