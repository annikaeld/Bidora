import { getFormValues } from "./getFormValues.js";
import { itemsFromApi } from "/js/api/item.js";
import { loadAuctions } from "./loadAuctions.js";

/**
 * Handles the search form submission:
 * Gets form values, determines search type, fetches posts, and loads them.
 * @returns {Promise<void>}
 */
async function doSearch() {
  const { searchFor } = getFormValues("searchForm");
  const sortBy = getSortBy();
  const auctions = await itemsFromApi(searchFor, sortBy);
  await loadAuctions(auctions);
}

/**
 * Returns the value of the selected radio button in the dropdownRadioForm.
 * @returns {string|null} The selected sort by value, or null if none selected.
 */
function getSortBy() {
  const form = document.getElementById("dropdownRadioForm");
  if (!form) {
    console.error("dropdownRadioForm not found");
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
});
