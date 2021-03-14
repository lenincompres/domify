/**
 * Creates DOM structures from a JS object (model)
 * @author Lenin Compres <lenincompres@gmail.com>
 */
var domify = (...args) => document.body.domify(...args);
Element.prototype.domify = Element.prototype.modify = function (model, ...args) {
  if ([null, undefined].includes(model)) return;
  let prop = args.getFirst(v => typeof v === 'string');
  if (['tag', 'id', 'onready', 'onReady'].includes(prop)) return;
  let clear = args.getFirst(v => typeof v === 'boolean');
  let prepend = clear === false;
  let elt = args.getFirst(v => v && v.tagName);
  let p5Elem = args.getFirst(v => v && v.elt);
  if (elt) return elt.domify(model, prop, append);
  if (!prop) {
    if (clear) this.innerHTML = '';
    let keys = prepend ? Object.keys(model).reverse() : Object.keys(model);
    return keys.forEach(key => this.domify(model[key], key, !!clear, p5Elem));
  }
  let tagName = this.tagName.toLowerCase();
  const IS_HEAD = tagName === 'head';
  const IS_PRIMITIVE = ['boolean', 'number', 'string', 'bigInt'].includes(typeof model);
  const IS_FUNCTION = !IS_PRIMITIVE && typeof model === 'function';
  const IS_ARRAY = !IS_PRIMITIVE && !IS_FUNCTION && Array.isArray(model);
  if (IS_PRIMITIVE) {
    if (['html', 'innerHTML'].includes(prop)) return (this.innerHTML = model);
    if (['text', 'innerText'].includes(prop)) return (this.innerText = model);
    if (!IS_HEAD && this.style[prop] !== undefined) return this.style[prop] = model;
    if (!(IS_HEAD && ['title', 'style'].includes(prop)) && ((prop === 'span' && tagName.startsWith('col')) && (prop === 'label' && tagName === 'track') || ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'bgcolor', 'border', 'charset', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'controls', 'coords', 'data', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'id', 'ismap', 'kind', 'lang', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'selected', 'shape', 'size', 'sizes', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'tabindex', 'target', 'title', 'translate', 'type', 'usemap', 'value', 'width', 'wrap'].includes(prop) || prop.startsWith('data-'))) return this.setAttribute(prop, model);
  } else {
    if (IS_HEAD && prop === 'style') return this.domify(`${Object.keys(model).map(key => `${key} {${Object.keys(model[key]).map(k => `${k.camelCase('-')}:${model[key][k]}`).join(';')}`).join('}')}}`, 'style', true);
    if (IS_ARRAY && prop === 'class') return model.forEach(c => c ? this.classList.add(c) : null);
    if (!IS_HEAD && !IS_ARRAY && prop === 'style') return Object.assign(this.style, model);
    if (IS_FUNCTION && this[prop] !== undefined) return this[prop] = model;
    if (p5Elem && IS_FUNCTION && p5Elem[prop] !== undefined) return p5Elem[prop](model);
  }
  let [tag, id, ...cls] = prop.split('_');
  if (prop.includes('.')) {
    cls = prop.split('.');
    tag = cls.shift();
  }
  if (tag.includes('#'))[tag, id] = tag.split('#');
  tag = model.tag ? model.tag : tag;
  let elem = (model.tagName || model.elt) ? model : false;
  if (!elem) {
    if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'main', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'mark', 'meta', 'meter', 'menu', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video', 'wbr'].includes(tag.toLowerCase())) {
      id = tag;
      tag = 'div';
    }
    if (IS_ARRAY) elem = model.map(o => this.domify(o, [tag, ...cls].join('.')));
    else {
      elem = p5Elem ? createElement(tag) : document.createElement(tag);
      if (IS_PRIMITIVE)(p5Elem ? elem.elt : elem).innerHTML = model; // no children
      else Object.keys(model).map(key => elem.domify(model[key], key));
    }
  }
  // id and appending element
  if (id = model.id ? model.id : id) {
    if (!IS_ARRAY) elem && p5Elem ? elem.id(id) : elem.setAttribute('id', id);
    window[id] = elem;
  }
  if (IS_ARRAY) return;
  if (cls) cls.forEach(c => p5Elem ? elem.addClass(c) : elem.classList.add(c));
  let onready = model.onready ? model.onready : model.onReady;
  if (onready) onready(elem);
  p5Elem ? p5Elem.child(elem) : this[prepend ? 'prepend' : 'append'](elem);
  return elem;
};
String.prototype.camelCase = function (s = false) {
  return s ? this.replace(/([A-Z])/g, s + '$1').toLowerCase() : this.replace(/^([A-Z])|[\s-_ ]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
}
Array.prototype.getFirst() = function (test = v => v, fail) {
  let arr = this.filter(v => test(v));
  return arr.length ? arr[0] : fail;
}
if (typeof p5 !== 'undefined') {
  p5.domify = (...args) => domify(...args, createElement());
  p5.Element.prototype.domify = p5.Element.prototype.modify = function (...args) {
    this.domify(...args, this);
  }
}
