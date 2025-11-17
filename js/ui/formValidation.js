export function validateEmail(email) {
  // Basic defensive checks
  if (!email || typeof email !== "string") return false;
  // Trim whitespace and validate the exact domain.
  const value = email.trim();
  const regEx = /^[^\s@]+@stud\.noroff\.no$/i;
  return regEx.test(value);
}

//todo: Add to login/signup-signin
