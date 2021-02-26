/*
 ** domify  makes html elements from a JS object (or JSON)
 ** created by: Lenin Compres
 */
var domify = (foo, bar, atElem, isP5 = false) => {
  if ([null, undefined].includes(foo) || ['_tag', '_id', 'onready', 'onReady', 'onelement', '_bind', 'onvalue', '_numeric', '_true', '_false', '_binary', '_default'].includes(bar)) return;
  if (typeof foo === 'string' && foo.endsWith('.json')) return loadJSON(foo, data => domify(data, bar, atElem));
  if (bar && (isP5 ? bar.elt : bar.tagName)) { // creates in this elem: domify(obj, elem, [append]) 
    if (!atElem) isP5 ? bar.html('') : bar.innerHTML = ''; // no append, replace content 
    return Object.keys(foo).map(key => domify(foo[key], key, bar));
  }
  if (atElem && bar) { // event handlers
    if (isP5 && ['mousePressed', 'doubleClicked', 'mouseWheel', 'mouseReleased', 'mouseClicked', 'mouseMoved', 'mouseOver', 'mouseOut', 'touchStarted', 'touchMoved', 'touchEnded', 'dragOver', 'dragLeave'].includes(bar))
      return atElem[bar](foo);
    if (['onblur', 'onchange', 'oninput', 'onfocus', 'onselect', 'onsubmit', 'onreset', 'onkeydown', 'onkeypress', 'onkeyup', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onmousemove', 'onclick', 'ondblclick', 'onload', 'onerror', 'onunload', 'onresize'].includes(bar))
      return (isP5 ? atElem.elt : atElem)[bar] = foo;
  }
  if (!bar) bar = 'main'; // default tag
  var [tag, id, ...cls] = bar.split('_'); // tag_id_classes
  if (bar.includes('.')) { // "tag#id.classes"
    cls = bar.split('.');
    tag = cls.shift();
  }
  if (tag.includes('#'))[tag, id] = tag.split('#');
  const TAGGED = tag && tag.match(/^h[1-9]$/) || ['main', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'mark', 'meta', 'meter', 'menu', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video', 'wbr'].includes(tag);
  tag = foo._tag ? foo._tag : TAGGED ? tag : false;
  var elem = (isP5 ? foo.elt : foo.tagName) ? foo : false; // is foo an elem?
  const IS_VAL = ['boolean', 'number', 'string'].includes(typeof foo);
  const IS_ARRAY = !IS_VAL && Array.isArray(foo);
  if (!elem) { // foo is not an elem
    if (!tag && id) { // value for prop
      if (!atElem) return; // empty prop
      elem = atElem.elt ? atElem.elt : atElem;
      var [prop, val] = [id, String(foo)]; // props start with '_'
      if (prop === 'html') elem.innerHTML = val;
      else if (prop === 'text') elem.innerText = val;
      else if (IS_ARRAY && prop === 'class') foo.forEach(c => elem.classList.add(c));
      else if (!IS_VAL && !IS_ARRAY && prop === 'style') Object.assign(elem.style, foo);
      else elem.setAttribute(prop, val);
      return;
    }
    if (!tag) tag = 'div'; // default tag
    if (IS_ARRAY) elem = foo.map(o => domify(o, [tag, ...cls].join('.'), atElem)); // creates elems from foo array
    else {
      elem = isP5 ? createElement(tag) : document.body.appendChild(document.createElement(tag));
      if (IS_VAL)(isP5 ? elem.elt : elem).innerHTML = foo.markdown ? foo.markdown() : foo; // no children (markdown html)
      else Object.keys(foo).map(key => domify(foo[key], key, elem));; // creates children
    }
  }
  id = foo._id ? foo._id : !TAGGED ? bar : id;
  if (id && isNaN(id)) { // adds elem; ignores number ids
    var [unid, i] = [id, 1];
    while (window[unid]) unid = id + i++; // if element exists adds number after name
    if (!IS_ARRAY) elem && isP5 ? elem.id(unid) : elem.setAttribute('id', unid);
    window[unid] = elem;
  }
  if (!IS_ARRAY) {
    if (cls) cls.forEach(c => isP5 ? elem.addClass(c) : elem.classList.add(c));
    if (atElem) isP5 ? atElem.child(elem) : atElem.appendChild(elem);
    if(foo.onvalue && !foo._bind) foo._bind = true;
    if(foo._true) foo._binary = [foo._false, foo._true];
    if(foo._binary === true) foo.binary = [false, true];
    if (foo._bind) {
      if(!id) console.log('Cannot bind element with no id.'); 
      else window[id] = new Bind(elem, foo._bind, foo.onvalue, foo._binary ? foo._binary : foo._numeric, foo._default);
    }
    var onready = foo.onready ? foo.onready : foo.onReady ? foo.onReady : foo.onelement;
    if (onready) onready(isP5 ? elem.elt : elem); // passes elem to function
    return elem;
  }
};
var domifyP5 = (foo, bar, atElem) => domify(foo, bar, atElem, true);
class Bind {
  constructor(elem, prop, onvalue = () => null, type, value){
    this.elem = elem;
    let [_false, _true] = Array.isArray(type) ? type : [false, false];
    let isNum = onvalue === true || type === true;
    if(typeof prop === 'function') onvalue = prop;
    if(typeof prop !== 'string') prop = elem.value === undefined ? 'innerText' : 'value';
    if(prop === 'value') elem.onchange = e => eval(`this.value = '${elem.value}'`); // updates when value changed
    prop = `elem['${prop.split('.').join("']['")}']`; //prop for eval
    this.onvalue = onvalue;
    this._onvalue = val => {
      if(_true) this._value = val ? _true : _false;
      else this._value = isNum ? Number(val) : val;
      eval('this.' + prop + ' = this._value');
      if(_true) this._value = val;
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
