export function getIdQueryParameter() {
  // Prefer the `id` query parameter, then common alternatives.
  try {
    const params = new URLSearchParams(window.location.search);
    return (
      params.get("id") ||
      params.get("listingId") ||
      params.get("listing") ||
      null
    );
  } catch (e) {
    console.warn("Could not read URL search params", e);
    return null;
  }
}
