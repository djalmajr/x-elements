import bound from "https://cdn.skypack.dev/bound-once@0.1.3";

const ID = Symbol();
const SECRET = "🚀️";
const tpls = new Map();
const binds = new WeakMap();
const wires = new WeakMap();
const updates = new WeakMap();

function cleanCRLF(value) {
  return value.replace(/\r\n|\n|\r|\s+/g, " ");
}

function endsWithAttr(value) {
  // return /.*<([a-zA-Z-]+).*\s(.*)=["']?$/.test(value);
  return /([^\s\\>"'=]+)\s*=\s*(['"]?)$/.test(value);
}

function filterByAttr(node) {
  return node.nodeType === Node.ELEMENT_NODE
    ? node.getAttributeNames().filter((attr) => node.getAttribute(attr) === SECRET)
    : [];
}

function filterNodes(root, type, filter) {
  const result = [];
  const nodes = document.createTreeWalker(root, type || NodeFilter.SHOW_ALL);

  for (let node; (node = nodes.nextNode()); ) {
    if ((filter || (() => true))(node)) result.push(node);
  }

  return result;
}

function getNodes(root) {
  return filterNodes(root, null, (node) => {
    return node.nodeType === Node.COMMENT_NODE
      ? RegExp(SECRET).test(node.textContent)
      : filterByAttr(node).length;
  });
}

function bindFn(ctx, cb) {
  let fns = binds.get(ctx);

  if (!fns) binds.set(ctx, (fns = {}));

  const id = cb.toString();
  const root = ctx.getRootNode();
  const self = root.nodeType === Node.DOCUMENT_NODE ? ctx : root.host;
  const fn = fns[id] || (fns[id] = (...a) => (cb.apply(self, a), self.render()));

  return bound(ctx, fn);
}

export function html(chunks, ...values) {
  if (!tpls.has(chunks)) {
    const tpl = document.createElement("template");

    tpl.innerHTML = values.reduce((res, _val, idx) => {
      const next = cleanCRLF(chunks[idx + 1]);

      if (!endsWithAttr(res)) {
        return `${res}<!--${SECRET}-->${next}`;
      }

      const data = res.slice(-1) === "=" ? `"${SECRET}"` : SECRET;

      return res + data + next;
    }, cleanCRLF(chunks[0]));

    tpls.set(chunks, {
      content: tpl.content,
      paths: getNodes(tpl.content)
        .map(function (node) {
          const path = [];
          const attrs = filterByAttr(node) || [];

          if (!attrs.length) {
            const text = document.createTextNode("");
            node.parentNode.replaceChild(text, node);
            node = text;
          }

          do {
            path.unshift(path.indexOf.call(node.parentNode.childNodes, node));
            node = node.parentNode;
          } while (node !== tpl.content);

          return attrs.length
            ? attrs.map((attr) => path.concat(attr))
            : [path.concat("")];
        })
        .reduce((res, arr) => res.concat(arr), [])
    });
  }

  if (!updates.has(this)) {
    const info = tpls.get(chunks);

    this.textContent = "";
    this.appendChild(info.content.cloneNode(true));

    updates.set(this, {
      chunks,
      fns: info.paths.map((path) => {
        const attr = path.slice(-1)[0];
        const node = path.slice(0, -1).reduce((p, i) => p.childNodes[i], this);

        return (val) => {
          if (attr) {
            node.removeAttribute(attr);

            switch (attr[0]) {
              case "@":
                val = bindFn(this, val);
              case ".": {
                const prop = (attr[0] === "@" ? "on" : "") + attr.slice(1);
                if (node[prop] !== val) node[prop] = val;
                break;
              }
              case "?": {
                const key = attr.slice(1);
                const prop = `${!!val ? "set" : "remove"}Attribute`;
                const old = node.getAttribute(key);
                if (old !== val) node[prop](key, "");
                break;
              }
              default: {
                const old = node.getAttribute(attr);
                if (old !== val) node.setAttribute(attr, val);
                break;
              }
            }
          } else {
            const arr = [].concat(val);

            if (arr[0] instanceof DocumentFragment) {
              arr.forEach((n) => node.parentNode.insertBefore(n, node));
            } else {
              const value = arr.map(String).join("");
              if (node.textContent !== value) node.textContent = value;
            }
          }
        };
      })
    });
  }

  updates.get(this).fns.forEach((fn, i) => fn(values[i]));

  return this;
}

html.for = function (obj = {}, id = ID) {
  let wire = wires.get(obj);
  if (!wire) wires.set(obj, (wire = {}));
  return html.bind(wire[id] || (wire[id] = document.createDocumentFragment()));
};
