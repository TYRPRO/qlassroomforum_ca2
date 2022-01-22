export const customSuperSubScriptMatcher = () => {
  return [Node.ELEMENT_NODE, matcher];
};

const matcher = (node, delta) => {
  // for katex
  if (
    node.contentEditable === "false" &&
    !node.classList.contains("ql-clipboard")
  ) {
    if (node.parentNode.classList.contains("ql-formula")) {
    } else {
      if (node.parentNode.classList.contains("ql-clipboard")) {
        const childNodes = node.childNodes;
        let isKatex = false;
        for (let i = 0, len = childNodes.length; i < len; i++) {
          const cNode = childNodes[i];
          if (cNode.nodeName === "SPAN" && cNode.classList.contains("katex")) {
            isKatex = true;
            break;
          }
        }
        if (isKatex) {
          return katexFormattingMatcher(node, delta);
        }
      }
    }
  }
  return scriptsFormattingMatcher(node, delta);
};

const katexFormattingMatcher = (node, delta) => {
  const op = delta && delta.ops && delta.ops[0];
  if (op) {
    const insertText = op.insert;
    const formulaText = insertText.slice(0, insertText.indexOf("\n"));
    op.insert = { formula: formulaText };
  }
  return delta;
};

const scriptsFormattingMatcher = (node, delta) => {
  const op = delta && delta.ops && delta.ops[0];
  if (op) {
    if (op.insert === node.innerText) {
      setQuillStyles(op, node);
    }
  }
  return delta;
};

const setQuillStyles = (op, correspondingSpan) => {
  if (!op.attributes) op.attributes = {};

  const { verticalAlign, lineHeight, top, bottom } = correspondingSpan.style;

  if (verticalAlign === "super" || verticalAlign === "sub") {
    Object.assign(op.attributes, { script: verticalAlign });
  } else if (lineHeight === "0" && verticalAlign === "baseline") {
    if (top && parseFloat(top) < 0) {
      Object.assign(op.attributes, { script: "super" });
    } else if (bottom && parseFloat(bottom) < 0) {
      Object.assign(op.attributes, { script: "sub" });
    }
  }
};
