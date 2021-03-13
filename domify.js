/*
 ** domify makes html element structures from a JS object model
 ** created by: Lenin Compres
 */
var domify = (...args) => document.body.domify(...args);
Element.prototype.modify = function (...args) {
  this.domify(...args)
}
Element.prototype.domify = function (model, a1, a2, p5Elem) {
  if ([null, undefined].includes(model)) return;
  let prop = typeof a1 === 'string' ? a1 : typeof a2 === 'string' ? a2 : false;
  if (['tag', 'id', 'onready', 'onReady'].includes(prop)) return;
  let append = typeof a1 === 'boolean' ? a1 : typeof a2 === 'boolean' ? a2 : typeof p5Elem === 'boolean' ? p5Elem : undefined;
  let clear = append === undefined;
  if(clear) append = true;
  let addMethod = append ? 'append' : 'prepend';
  let elt = a1 && a1.tagName ? a1 : a2 && a2.tagName ? a2 : false;
  if (elt) return elt.domify(model, prop, append);
  if (!prop) {
    let elems = Object.keys(model).map((key, i) => this.domify(model[key], key, true)).filter(e => e.tagName);
    if (elems.length && clear) this.innerHTML = '';
    return elems.forEach(e => this[addMethod](e));
  }
  // attibutes and events
  let tagName = this.tagName.toLowerCase();
  const IS_HEAD = tagName === 'head';
  const IS_VALUE = ['boolean', 'number', 'string'].includes(typeof model);
  const IS_FUNCTION = !IS_VALUE && typeof model === 'function';
  const IS_ARRAY = !IS_VALUE && !IS_FUNCTION && Array.isArray(model);
  if (IS_VALUE) {
    if (['html', 'innerHTML'].includes(prop)) return (this.innerHTML = model);
    if (['text', 'innerText'].includes(prop)) return (this.innerText = model);
    if (!IS_HEAD && this.style[prop] !== undefined) return this.style[prop] = model;
    if (!(IS_HEAD && ['title', 'style'].includes(prop)) && ((prop === 'span' && tagName.startsWith('col')) || ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'bgcolor', 'border', 'charset', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'controls', 'coords', 'data', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'id', 'ismap', 'kind', 'label', 'lang', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'selected', 'shape', 'size', 'sizes', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'tabindex', 'target', 'title', 'translate', 'type', 'usemap', 'value', 'width', 'wrap'].includes(prop) || prop.startsWith('data-'))) return this.setAttribute(prop, model);
  } else {
    if (IS_HEAD && prop === 'style') return this.domify(`${Object.keys(model).map(key => `${key} {${Object.keys(model[key]).map(k => `${k.camelCase('-')}:${model[key][k]}`).join(';')}`).join('}')}}`, 'style', true);
    if (IS_ARRAY && prop === 'class') return model.forEach(c => c ? this.classList.add(c) : null);
    if (!IS_HEAD && !IS_ARRAY && prop === 'style') return Object.assign(this.style, model);
    if (IS_FUNCTION && this[prop] !== undefined) return this[prop] = model;
    if (p5Elem && IS_FUNCTION && p5Elem[prop] !== undefined) return p5Elem[prop](model);
  }
  // tag, id and classes from prop (tag_id_classes) or (tag#id.classes)
  let [tag, id, ...cls] = prop.split('_');
  if (prop.includes('.')) {
    cls = prop.split('.');
    tag = cls.shift();
  }
  if (tag.includes('#'))[tag, id] = tag.split('#');
  tag = model.tag ? model.tag : tag;
  // new element
  let elem = (model.tagName || model.elt) ? model : false;
  if (!elem) {
    if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'main', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'mark', 'meta', 'meter', 'menu', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video', 'wbr'].includes(tag)) {
      id = tag;
      tag = 'div';
    }
    if (IS_ARRAY) elem = model.map(o => this.domify(o, [tag, ...cls].join('.'), append));
    else {
      elem = p5Elem ? createElement(tag) : document.createElement(tag);
      this[addMethod](elem);
      if (IS_VALUE)(p5Elem ? elem.elt : elem).innerHTML = model; // no children
      else Object.keys(model).map(key => elem.domify(model[key], key, true));
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
  p5Elem ? p5Elem.child(elem) : this[addMethod](elem);
  return elem;
};
String.prototype.camelCase = function (s = false) {
  return s ? this.replace(/([A-Z])/g, s + '$1').toLowerCase() : this.replace(/^([A-Z])|[\s-_ ]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
}
if (typeof p5 !== 'undefined') p5.element.domify = (model, a1, a2) => this.elt.domify(model, a1, a2, this);
