export function displayError(errorContainer, errors) {
  console.error(errors);
  if (errors && Array.isArray(errors)) {
    errors.forEach((error) => {
      const errorItem = document.createElement("div");
      errorItem.textContent = error.message;
      errorContainer.appendChild(errorItem);
    });
  } else if (typeof errors === "object") {
    errorContainer.textContent = errors;
  } else {
    errorContainer.textContent = "An unknown error occurred.";
  }
}
