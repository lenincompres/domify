/*
 ** domify  makes html elements from a JS object (or JSON)
 ** created by: Lenin Compres
 ** it requires the auxiliary.js library
 ** TIPS:
 -- Elements can be named: tag_idName_className_anotherClass
 -- idName becomes the name of the object in the dom object: dom.idName
 -- Create several objects of the same tag with an array: { li: [...], ...}
 -- CamelCase classes and ids get turned into dashed-names in the HTML
 -- Propeties that start with undercore _ are attributes
 -- Event handlers are reserve words; can be set to a function: onclick, onselect
 */
var stylize = (style, elem) => domify(style, '_style', elem ? elem : document.body);
var domifyP5 = (foo, bar, atElem) => domifyP5(foo, bar, true);
var domify = (foo, bar, atElem, isP5 = false) => { // creates dom elements from a js obj or json/uri; supports p5.
  if ([null, undefined].includes(foo) || ['_tag', '_id', 'onready', 'onReady', 'onelement'].includes(bar)) return;
  if (typeof foo === 'string' && foo.endsWith('.json')) return loadJSON(foo, data => domify(data, bar, atElem));
  if (!window.dom) window.dom = {}; // creates dom obj to hold id'ed elems
  if (bar && (isP5 ? bar.elt : bar.tagName)) { // creates in this elem: domify(obj, elem, [append]) 
    if (!atElem) isP5 ? bar.html('') : bar.innerHTML = ''; // no append, replace content 
    return foo.forIn((val, key) => domify(val, key, bar));
  }
  if (atElem && bar) { // event handlers: domify(handler, event, elem)
    if (isP5 && ['mousePressed', 'doubleClicked', 'mouseWheel', 'mouseReleased', 'mouseClicked', 'mouseMoved', 'mouseOver', 'mouseOut', 'touchStarted', 'touchMoved', 'touchEnded', 'dragOver', 'dragLeave'].includes(bar))
      return atElem[bar](foo);
    if (['onblur', 'onchange', 'oninput', 'onfocus', 'onselect', 'onsubmit', 'onreset', 'onkeydown', 'onkeypress', 'onkeyup', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onmousemove', 'onclick', 'ondblclick', 'onload', 'onerror', 'onunload', 'onresize'].includes(bar))
      return (isP5 ? atElem.elt : atElem)[bar] = foo;
  }
  if (!bar) bar = 'main'; // default name
  var [tag, id, ...cls] = bar.split('_'); // name as tag_id_classes
  if (bar.includes('.')) { // name as "tag#id.classes"
    cls = bar.split('.');
    tag = cls.shift();
  }
  if (tag.includes('#'))[tag, id] = tag.split('#');
  const TAGGED = tag && tag.match(/^h[1-9]$/) || ['main', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'mark', 'meta', 'meter', 'menu', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video', 'wbr'].includes(tag);
  tag = foo._tag ? foo._tag : TAGGED ? tag : false;
  var elem = (isP5 ? foo.elt : foo.tagName) ? foo : false; // finds if foo is an elem
  const IS_VAL = ['boolean', 'number', 'string'].includes(typeof foo);
  const IS_ARRAY = !IS_VAL && Array.isArray(foo);
  if (!elem) { // foo is not an element
    if (!tag && id) { // value for prop: domify(val, '_prop', elem)
      if (!atElem) return; // no elem to put the prop
      elem = atElem.elt ? atElem.elt : atElem;
      var [prop, val] = [id, String(foo)]; // props start with '_'
      if (prop === 'html') elem.innerHTML = val;
      else if (prop === 'text') elem.innerText = val;
      else if (IS_ARRAY && prop === 'class') foo.forEach(c => elem.classList.add(c.camelCase('-')));
      else if (!IS_VAL && !IS_ARRAY && prop === 'style') foo.forIn((val,key) => elem.style[key] = val); // styles passed as foo.prop (camelCase)
      else elem.setAttribute(prop, val);
      return;
    }
    if (!tag) tag = 'div'; // default tag
    if (IS_ARRAY) elem = foo.map(o => domify(o, [tag, ...cls].join('.'), atElem)); // creates elems from foo array
    else {
      elem = isP5 ? createElement(tag) : document.body.appendChild(document.createElement(tag));
      if (IS_VAL)(isP5 ? elem.elt : elem).innerHTML = foo.markdown ? foo.markdown() : foo; // no children (markdown html)
      else foo.forIn((val,key) => domify(val, key, elem)); // creates children
    }
  }
  id = foo._id ? foo._id : !TAGGED ? bar : id;
  if (id && isNaN(id)) { // adds elem to dom; ignores number ids
    var [unid, i] = [id, 1];
    while (window.dom[unid]) unid = id + i++; // if element exists adds a number after the name
    if (!IS_ARRAY) elem && isP5 ? elem.id(unid.camelCase('-')) : elem.setAttribute('id', unid.camelCase('-'));
    window.dom[unid] = elem;
  }
  if (!IS_ARRAY) {
    if (cls) cls.forEach(c => isP5 ? elem.addClass(c.camelCase('-')) : elem.classList.add(c.camelCase('-')));
    if (atElem) isP5 ? atElem.child(elem) : atElem.appendChild(elem);
    var onready = foo.onready ? foo.onready : foo.onReady ? foo.onReady : foo.onelement;
    if (onready) onready(isP5 ? elem.elt : elem); // passes element to function
    var ready = foo.ready ? foo.ready : foo.element;
    if (ready) ready(elem); // passes element to function
    return elem;
  }
};
