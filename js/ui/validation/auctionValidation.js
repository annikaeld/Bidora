/**
 * Validate auction title (required, non-empty, reasonable length)
 */
export function validateAuctionTitle(title, messageCallback) {
	if (!title || typeof title !== "string" || title.trim() === "") {
		if (typeof messageCallback === "function") {
			messageCallback("Title is required.");
		}
		return false;
	}
	if (title.length > 100) {
		if (typeof messageCallback === "function") {
			messageCallback("Title must be 100 characters or fewer.");
		}
		return false;
	}
	return true;
}

/**
 * Validate auction description (required, non-empty, reasonable length)
 */
export function validateAuctionDescription(description, messageCallback) {
	if (!description || typeof description !== "string" || description.trim() === "") {
		if (typeof messageCallback === "function") {
			messageCallback("Description is required.");
		}
		return false;
	}
	if (description.length > 1000) {
		if (typeof messageCallback === "function") {
			messageCallback("Description must be 1000 characters or fewer.");
		}
		return false;
	}
	return true;
}

/**
 * Validate auction end date/time (required, must be a valid future date)
 */
export function validateAuctionEndDate(endsAt, messageCallback) {
	if (!endsAt || typeof endsAt !== "string") {
		if (typeof messageCallback === "function") {
			messageCallback("End date/time is required.");
		}
		return false;
	}
	const date = new Date(endsAt);
	if (isNaN(date.getTime())) {
		if (typeof messageCallback === "function") {
			messageCallback("End date/time is invalid.");
		}
		return false;
	}
	if (date <= new Date()) {
		if (typeof messageCallback === "function") {
			messageCallback("End date/time must be in the future.");
		}
		return false;
	}
	return true;
}

/**
 * Validate image URL (required, must be a valid URL)
 */
export function validateAuctionImageUrl(url, messageCallback) {
	if (!url || typeof url !== "string" || url.trim() === "") {
		if (typeof messageCallback === "function") {
			messageCallback("Image URL is required.");
		}
		return false;
	}
	try {
		new URL(url);
	} catch {
		if (typeof messageCallback === "function") {
			messageCallback("Image URL must be a valid URL.");
		}
		return false;
	}
	return true;
}

/**
 * Validate image alt-text (optional, but if present, should not be empty or too long)
 */
export function validateAuctionImageAltText(altText, messageCallback) {
	if (altText && typeof altText === "string" && altText.length > 200) {
		if (typeof messageCallback === "function") {
			messageCallback("Image alt-text must be 200 characters or fewer.");
		}
		return false;
	}
	return true;
}
