/*
 ** domify  makes html elements from a JS object (or JSON)
 ** created by: Lenin Compres
 */
Element.prototype.domify = function (model, prop, replace = false, useP5 = false) {
  if ([null, undefined].includes(model) || ['_tag', '_id', 'onready', 'onReady', 'onelement', '_bind', 'onvalue', '_numeric', '_true', '_false', '_binary', '_default'].includes(prop)) return;
  if (typeof model === 'string' && model.endsWith('.json')) return loadJSON(model, data => this.domify(data, prop));
  if(typeof prop === 'boolean' || !prop){
    useP5 = !!replace;
    replace = !!prop;
    prop = this;
  }
  let isVal = foo => ['boolean', 'number', 'string'].includes(typeof foo);
  let isElem = foo => !isVal(foo) && foo.elt || foo.tagName;
  if (isElem(prop)) { 
    if (replace) useP5 ? prop.html('') : prop.innerHTML = '';
    return Object.keys(model).map(key => prop.domify(model[key], key));
  }
  //event handlers
  if (useP5 && ['mousePressed', 'doubleClicked', 'mouseWheel', 'mouseReleased', 'mouseClicked', 'mouseMoved', 'mouseOver', 'mouseOut', 'touchStarted', 'touchMoved', 'touchEnded', 'dragOver', 'dragLeave'].includes(prop))
    return this[prop](model);
  if (['onblur', 'onchange', 'oninput', 'onfocus', 'onselect', 'onsubmit', 'onreset', 'onkeydown', 'onkeypress', 'onkeyup', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onmousemove', 'onclick', 'ondblclick', 'onload', 'onerror', 'onunload', 'onresize'].includes(prop))
    return (useP5 ? this.elt : this)[prop] = model;
  //gets tag id and classes from prop
  let [tag, id, ...cls] = prop.split('_'); // tag_id_classes
  if (prop.includes('.')) { // "tag#id.classes"
    cls = prop.split('.');
    tag = cls.shift();
  }
  if (tag.includes('#'))[tag, id] = tag.split('#');
  const TAGGED = tag && tag.match(/^h[1-9]$/) || ['main', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'mark', 'meta', 'meter', 'menu', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video', 'wbr'].includes(tag);
  tag = model._tag ? model._tag : TAGGED ? tag : false;
  let elem = isElem(model) ? model : false;
  const IS_VAL = isVal(model);
  const IS_ARRAY = !IS_VAL && Array.isArray(model);
  if (!elem) {
    if (!tag && id) { // model is value for prop
      //if (!this) return; // empty prop  ????
      let elt = this.elt ? this.elt : this;
      let [prop, val] = [id, String(model)];
      if (prop === 'html') elt.innerHTML = val;
      else if (prop === 'text') elt.innerText = val;
      else if (IS_ARRAY && prop === 'class') model.forEach(c => c ? elt.classList.add(c) : null);
      else if (!IS_VAL && !IS_ARRAY && prop === 'style') Object.assign(elt.style, model);
      else elt.setAttribute(prop, val);
      return;
    }
    if (!tag) tag = 'div';
    if (IS_ARRAY) elem = model.map(o => this.domify(o, [tag, ...cls].join('.')));
    else {
      elem = useP5 ? createElement(tag) : this.appendChild(document.createElement(tag));
      if (IS_VAL)(useP5 ? elem.elt : elem).innerHTML = model;
      else Object.keys(model).map(key => elem.domify(model[key], key)); // creates children
    }
  }
  id = model._id ? model._id : TAGGED ? id : tag ? tag : prop;
  if (id && isNaN(id)) { // adds elem; ignores number ids
    let [unid, i] = [id, 1];
    while (window[unid]) unid = id + i++; // if element exists adds number after name
    if (!IS_ARRAY) elem && useP5 ? elem.id(unid) : elem.setAttribute('id', unid);
    window[unid] = elem;
  }
  if (!IS_ARRAY) {
    if (cls) cls.forEach(c => useP5 ? elem.addClass(c) : elem.classList.add(c));
    if (this) useP5 ? this.child(elem) : this.appendChild(elem);
    if (model.onvalue && !model._bind) model._bind = true;
    if (model._true) model._binary = [model._false, model._true];
    if (model._binary === true) model.binary = [false, true];
    if (model._bind) {
      if (!id) console.log('Cannot bind element with no id.');
      else window[id] = new Bind(elem, model._bind, model.onvalue, model._binary ? model._binary : model._numeric, model._default);
    }
    let onready = model.onready ? model.onready : model.onReady ? model.onReady : model.onelement;
    if (onready) onready(useP5 ? elem.elt : elem);
    return elem;
  }
};
var domify = (...args) => document.body.domify(...args);
var domifyP5 = (model, prop, replace) => domify(model, prop, replace, true);
if(p5) p5.Element.prototype.domify = function (model, prop, replace) {
  this.elt.domify(model, prop, replace, useP5);
}
class Bind {
  constructor(elem, prop, onvalue = () => null, type, value) {
    this.elem = elem;
    let [_false, _true] = Array.isArray(type) ? type : [false, false];
    let isNum = onvalue === true || type === true;
    if (typeof prop === 'function') onvalue = prop;
    if (typeof prop !== 'string') prop = elem.value === undefined ? 'innerText' : 'value';
    if (prop === 'value') elem.onchange = e => eval(`this.value = '${elem.value}'`); // updates when value changed
    prop = `elem['${prop.split('.').join("']['")}']`; //prop for eval
    this.onvalue = onvalue;
    this._onvalue = val => {
      if (_true) this._value = val ? _true : _false;
      else this._value = isNum ? Number(val) : val;
      eval('this.' + prop + ' = this._value');
      if (_true) this._value = val;
      this.onvalue(this._value);
    };
    this._onvalue(value !== undefined ? value : _true ? true : eval(prop));
  }
  set value(val) {
    this._onvalue(val);
  }
  get value() {
    return this._value;
  }
}
