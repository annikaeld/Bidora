export function displayError(errorContainer, errors) {
  if (errors && Array.isArray(errors)) {
    errors.forEach((error) => {
      const errorItem = document.createElement("div");
      errorItem.textContent = error.message;
      errorContainer.appendChild(errorItem);
    });
  } else {
    errorContainer.textContent = "An unknown error occurred.";
  }
}
