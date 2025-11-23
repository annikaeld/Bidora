/**
 * Validates the sign-up password
 * @param {string} password - The password to validate.
 * @param {function} [messageCallback] - Optional callback for explanatory messages.
 * @returns {boolean} True if valid, false otherwise.
 */
export function validateSignUpPassword(password, messageCallback) {
	if (!password || typeof password !== "string") {
		if (typeof messageCallback === "function") {
			messageCallback("Password is required.");
		}
		return false;
	}
	if (password.length < 8) {
		if (typeof messageCallback === "function") {
			messageCallback("Password must be at least 8 characters long.");
		}
		return false;
	}
	return true;
}
/**
 * Validates that the username uses only allowed characters (and has no spaces).
 * @param {string} username - The username to validate.
 * @param {function} [messageCallback] - Optional callback for explanatory messages.
 * @returns {boolean} True if valid, false otherwise.
 */
export function validateUsername(username, messageCallback) {
	if (!username || typeof username !== "string") {
		if (typeof messageCallback === "function") {
			messageCallback("Username is required.");
		}
		return false;
	}
	if (/\s/.test(username)) {
		if (typeof messageCallback === "function") {
			messageCallback("Username cannot contain spaces.");
		}
		return false;
	}
	if (!/^[A-Za-z0-9_]+$/.test(username)) {
		if (typeof messageCallback === "function") {
			messageCallback("Username can only contain letters, numbers, and underscores.");
		}
		return false;
	}
	return true;
}
/**
 * Validates that the sign-in password is not empty.
 * @param {string} password - The password to validate.
 * @param {function} [messageCallback] - Optional callback for explanatory messages.
 * @returns {boolean} True if valid, false otherwise.
 */
export function validateSignInPassword(password, messageCallback) {
	if (!password || typeof password !== "string" || password.trim() === "") {
		if (typeof messageCallback === "function") {
			messageCallback("Password is required.");
		}
		return false;
	}
	return true;
}
/**
 * Validates a stud.noroff.no email address.
 * @param {string} email - The email to validate.
 * @param {function} [messageCallback] - Optional callback for explanatory messages.
 * @returns {boolean} True if valid, false otherwise.
 */
export function validateEmail(email, messageCallback) {
	// Basic defensive checks
	if (!email || typeof email !== "string") {
		if (typeof messageCallback === "function") {
			messageCallback("Email is required.");
		}
		return false;
	}
	// Trim whitespace and validate the exact domain.
	const value = email.trim();
	const regEx = /^[^\s@]+@stud\.noroff\.no$/i;
	if (!regEx.test(value)) {
		if (typeof messageCallback === "function") {
			messageCallback("Email must be a stud.noroff.no address.");
		}
		return false;
	}
	return true;
}
// ...existing code from formValidation.js will be copied here...