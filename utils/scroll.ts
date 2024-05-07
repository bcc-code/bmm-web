function getScrollParent(node: Element | Node | null): Element | null {
  if (!node) {
    return null;
  }
  if (!("scrollHeight" in node)) {
    return null;
  }
  const isElement = node instanceof HTMLElement;
  const overflowY = isElement && window.getComputedStyle(node).overflowY;
  const isScrollable = overflowY !== "visible" && overflowY !== "hidden";

  if (isScrollable && node.scrollHeight >= node.clientHeight) {
    return node;
  }
  return getScrollParent(node.parentNode) || document.body;
}

export default getScrollParent;
