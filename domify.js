/*
 ** domify makes html element structures from a JS object model
 ** created by: Lenin Compres
 */
 Element.prototype.domify = function (model, prop, clear, p5Elem) {
  if ([null, undefined].includes(model)) return;
  if (['tag', 'id', 'onready', 'onReady', 'onvalue', 'bind', 'numeric', 'binary', 'value'].includes(prop)) return;
  if (typeof prop === 'boolean' || !prop) {
    p5Elem = clear;
    clear = prop;
    prop = this;
  }
  let isElem = o => o && (o.elt || o.tagName);
  if (isElem(clear)) return clear.domify(model, prop, p5Elem);
  if (isElem(prop)) return Object.keys(model).map(key => prop.domify(model[key], key, clear));
  if (clear === true) this.innerHTML = '';
  // attibutes and events
  const IS_ARRAY = Array.isArray(model);
  const IS_FUNCTION = typeof model === 'function';
  const IS_VALUE = ['boolean', 'number', 'string'].includes(typeof model);
  if (['html','innerHTML'].includes(prop)) return (this.innerHTML = model);
  if (['text','innerText'].includes(prop)) return (this.innerText = model);
  if (prop === 'class' && IS_ARRAY) return model.forEach(c => c ? this.classList.add(c) : null);
  if (prop === 'style' && !IS_VALUE && !IS_ARRAY) return Object.assign(this.style, model);
  if(IS_VALUE && this.style[prop] !== undefined) return this.style[prop] = model;
  if(IS_VALUE && ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'bgcolor', 'border', 'charset', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'controls', 'coords', 'data', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'id', 'ismap', 'kind', 'label', 'lang', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'tabindex', 'target', 'title', 'translate', 'type', 'usemap', 'value', 'width', 'wrap'].includes(prop) || prop.startsWith('data-')) return this.setAttribute(prop, model);
   if(IS_FUNCTION && this[prop] !== undefined) return this[prop] = model;
  if (p5Elem && typeof IS_FUNCTION && this[prop] !== undefined) return p5Elem[prop](model);
  // tag, id and classes from prop (tag_id_classes) or (tag#id.classes)
  let [tag, id, ...cls] = prop.split('_');
  if (prop.includes('.')) {
    cls = prop.split('.');
    tag = cls.shift();
  }
  if (tag.includes('#'))[tag, id] = tag.split('#');
  tag = model.tag ? model.tag : tag;
  // new element
  let elem = isElem(model) ? model : false;
  if (!elem) {
    if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'main', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'mark', 'meta', 'meter', 'menu', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video', 'wbr'].includes(tag)) {
      id = tag;
      tag = 'div';
    }
    if (IS_ARRAY) elem = model.map(o => this.domify(o, [tag, ...cls].join('.')));
    else {
      elem = p5Elem ? createElement(tag) : this.appendChild(document.createElement(tag));
      if (IS_VALUE)(p5Elem ? elem.elt : elem).innerHTML = model; // no children
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
  p5Elem ? p5Elem.child(elem) : this.appendChild(elem);
  if (typeof domifyBind === 'function' && id) window[id] = domifyBind(p5Elem ? elem.elt : elem, model);
  return elem;
};
var domify = (...args) => document.body.domify(...args);
if (typeof p5 !== 'undefined') p5.Element.prototype.domify = function (model, prop, replace) {
  this.elt.domify(model, prop, replace, this);
}
