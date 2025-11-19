/**
 * Retrieves all form values as an object from a form with the given ID.
 * @param {string} formId - The ID of the form element.
 * @returns {Object} An object containing key-value pairs of form data.
 */
export function getFormValues(formId) {
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  const values = {};
  for (const [key, value] of formData.entries()) {
    values[key] = value;
  }

  return values;
}
