const cache = new WeakMap();
const { isArray } = Array;
const { indexOf, slice } = [];
const { defineProperties } = Object;

const edgeCases = "textarea,style";

const emptyTags = `area,base,br,col,embed,hr,img,input,keygen,link,menuitem,meta,param,source,track,wbr`;

const hasTags = (tags, name) =>
  new RegExp(`^(?:${tags.split(",").join("|")})$`, "i").test(name);

const isVoid = (name) => hasTags(emptyTags, name);

const noChildNodes = (name) => hasTags(edgeCases, name);

const setCache = (where) => {
  const info = { sub: [], stack: [], wire: null };
  cache.set(where, info);
  return info;
};

const findNode = (content, selector) => {
  const search = `<${selector}></${selector}><!--${selector}-->`;
  const nodes = content.querySelectorAll(edgeCases);

  for (let i = 0; nodes[i]; i++) {
    if (nodes[i].textContent.trim() === search) return nodes[i];
  }

  throw new Error(`${edgeCases} bad content`);
};

const getNode = (node, i) => node.childNodes[i];

const getPath = (node) => {
  const path = [];

  while (node.parentNode) {
    path.unshift(indexOf.call(node.parentNode.childNodes, node));
    node = node.parentNode;
  }

  return path;
};

const getWire = (fragment) => {
  const { childNodes } = fragment;
  const { length } = childNodes;

  if (length === 1) return childNodes[0];

  const nodes = slice.call(childNodes, 0);

  return defineProperties(fragment, {
    remove: {
      value() {
        const range = document.createRange();
        range.setStartBefore(nodes[1]);
        range.setEndAfter(nodes[length - 1]);
        range.deleteContents();
        return nodes[0];
      }
    },
    valueOf: {
      value() {
        if (childNodes.length !== length) {
          const range = document.createRange();
          range.setStartBefore(nodes[0]);
          range.setEndAfter(nodes[length - 1]);
          fragment.appendChild(range.extractContents());
        }

        return fragment;
      }
    }
  });
};
