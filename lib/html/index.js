const cache = new WeakMap();
const { isArray } = Array;
const { indexOf, slice } = [];
const { assign, defineProperties } = Object;

const EDGE_CASES = "textarea,style";
const EMPTY_TAGS = `area,base,br,col,embed,hr,img,input,keygen,link,menuitem,meta,param,source,track,wbr`;

const FRAGMENT = "fragment";
const TEMPLATE = "template";
const HAS_CONTENT = "content" in create(TEMPLATE);

function create (element) {
  return element === FRAGMENT
    ? document.createDocumentFragment()
    : document.createElementNS("http://www.w3.org/1999/xhtml", element);
};

function append (root, childNodes) {
  let length = childNodes.length;

  while (length--) root.appendChild(childNodes[0]);
}

const createHTML = HAS_CONTENT
  ? function (html) {
    return assign(create(TEMPLATE), { innerHTML = html }).content;
  }
  : function (html) {
      let content = create(FRAGMENT);
      let template = create(TEMPLATE);
      let childNodes = null;

      if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
        template.innerHTML = `<table>${html}</table>`;
        childNodes = template.querySelectorAll(RegExp.$1);
      } else {
        template.innerHTML = html;
        childNodes = template.childNodes;
      }

      append(content, childNodes);

      return content;
    };

function createSVG(svg) {
  const content = create(FRAGMENT);
  const template = assign(create('div'), {
    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg">${svg}</svg>`,
  });

  append(content, template.firstChild.childNodes);

  return content;
}

function createContent(markup, type) {
  return (type === 'svg' ? createSVG : createHTML)(markup);
};

function hasTags(tags, name) {
  return new RegExp(`^(?:${tags.split(",").join("|")})$`, "i").test(name);
}

function isVoid(name) {
  return hasTags(EMPTY_TAGS, name);
}

function noChildNodes(name) {
  return hasTags(EDGE_CASES, name);
}

function setCache(where) {
  const info = { sub: [], stack: [], wire: null };
  cache.set(where, info);
  return info;
};

function findNode(content, selector) {
  const search = `<${selector}></${selector}><!--${selector}-->`;
  const nodes = content.querySelectorAll(EDGE_CASES);

  for (let i = 0; nodes[i]; i++) {
    if (nodes[i].textContent.trim() === search) return nodes[i];
  }

  throw new Error(`${EDGE_CASES} bad content`);
};

function getNode(node, i) {
  return node.childNodes[i];
}

function getPath(node) {
  const path = [];

  while (node.parentNode) {
    path.unshift(indexOf.call(node.parentNode.childNodes, node));
    node = node.parentNode;
  }

  return path;
};

function getWire(fragment) {
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
