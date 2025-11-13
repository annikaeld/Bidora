/**
 * Creates a DOM element with attributes and children.
 * @param {string} tag - The HTML tag name (e.g., 'div', 'span').
 * @param {Object} [attrs={}] - Attributes to set on the element (e.g., class, id, data-*).
 * @param {...(Node|string|null|undefined)} children - Child nodes or strings to append as children.
 * @returns {HTMLElement} The created DOM element.
 */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("data-")) node.setAttribute(k, v);
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, String(v));
  }
  for (const c of children) {
    if (c == null) continue;
    if (typeof c === "string") node.appendChild(document.createTextNode(c));
    else node.appendChild(c);
  }
  return node;
}
