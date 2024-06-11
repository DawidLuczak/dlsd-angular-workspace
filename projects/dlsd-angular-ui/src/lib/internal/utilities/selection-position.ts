export const createRange = (node: any, targetPosition: number) => {
  const range = document.createRange();
  range.selectNode(node);
  range.setStart(node, 0);

  let pos = 0;
  const stack = [node];
  while (stack.length > 0) {
    const current = stack.pop();

    if (current.nodeType === Node.TEXT_NODE) {
      const len = current.textContent.length;
      if (pos + len >= targetPosition) {
        range.setEnd(current, targetPosition - pos);
        return range;
      }
      pos += len;
    } else if (current.childNodes && current.childNodes.length > 0) {
      for (let i = current.childNodes.length - 1; i >= 0; i--) {
        stack.push(current.childNodes[i]);
      }
    }
  }

  range.setEnd(node, node.childNodes.length);
  return range;
};

export const caretSelectionPosition = (
  contentEle: Node,
  targetPosition: number,
): Selection => {
  const range = createRange(contentEle, targetPosition);
  const selection = window.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
};
