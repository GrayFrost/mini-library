
// 删除
export function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

export function element(name) {
  return document.createElement(name);
}

export function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}

export function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}

export function text(data) {
  return document.createTextNode(data);
}

export function empty() {
  return text('');
}

export function space() {
  return text(' ');
}