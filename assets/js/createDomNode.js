export default function createDomNode(
  element = 'div',
  className = null,
  content = null,
  placeholder = '',
) {
  const el = document.createElement(element);
  el.classList.add(className);
  el.textContent = content;
  el.placeholder = placeholder;
  return el;
}
