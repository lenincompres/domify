/*
 ** domify  makes html elements from a JS object (or JSON)
 ** created by: Lenin Compres
 */
 var domify = (...args) => document.body.domify(...args);
 if (typeof p5 !== 'undefined') p5.Element.prototype.domify = function (model, prop, replace) {
   this.elt.domify(model, prop, replace, this);
 }
 Element.prototype.domify = function (model, prop, replace = false, P5Elem) {
   let isNot = o => [null, undefined].includes(o);
   if (isNot(model)) return;
   let isReserved = s => ['_tag', '_id', 'onready', 'onReady', 'onvalue', '_bind', '_numeric', '_true', '_false', '_binary', '_default'].includes(s);
   if (isReserved(prop)) return;
   if (typeof prop === 'boolean' || !prop) {
     P5Elem = replace;
     replace = prop;
     prop = this;
   }
   let isValue = o => ['boolean', 'number', 'string'].includes(typeof o);
   let isElem = o => !isNot(o) && !isValue(o) && (o.elt || o.tagName);
   if (isElem(replace)) return replace.domify(model, prop, P5Elem);
   if (isElem(prop)) return Object.keys(model).map(key => prop.domify(model[key], key, replace));
   if (replace === true) this.innerHTML = '';
   //handles attibutes and events
   const IS_ARRAY = Array.isArray(model);
   const IS_VAL = isValue(model);
   if (typeof prop === 'string' && prop[0] === '_') {
     if (prop === '_html') return (this.innerHTML = model);
     if (prop === '_text') return (this.innerText = model);
     if (prop === '_class' && IS_ARRAY) return model.forEach(c => this.classList.add(c));
     if (prop === '_style' && !IS_VAL && !IS_ARRAY) return Object.assign(this.style, model);
     return this.setAttribute(prop.slice(1), model);
   }
   let isP5Method = s => ['mousePressed', 'doubleClicked', 'mouseWheel', 'mouseReleased', 'mouseClicked', 'mouseMoved', 'mouseOver', 'mouseOut', 'touchStarted', 'touchMoved', 'touchEnded', 'dragOver', 'dragLeave'].includes(s);
   if (P5Elem && isP5Method(prop)) return P5Elem[prop](model);
   let isEvent = s => ['onblur', 'onchange', 'oninput', 'onfocus', 'onselect', 'onsubmit', 'onreset', 'onkeydown', 'onkeypress', 'onkeyup', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onmousemove', 'onclick', 'ondblclick', 'onload', 'onerror', 'onunload', 'onresize'].includes(s);
   if (isEvent(prop)) return this[prop] = model;
   // tag, id and classes from prop
   let [tag, id, ...cls] = prop.split('_'); // tag_id_classes
   if (prop.includes('.')) { // "tag#id.classes"
     cls = prop.split('.');
     tag = cls.shift();
   }
   if (tag.includes('#'))[tag, id] = tag.split('#');
   tag = model._tag ? model._tag : tag;
   // handles element
   let elem = isElem(model) ? model : false;
   if (!elem) {
     let isTag = s => s.match(/^h[1-9]$/) || ['main', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'mark', 'meta', 'meter', 'menu', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video', 'wbr'].includes(s);
     if (!isTag(tag)) {
       id = tag;
       tag = 'div';
     }
     if (IS_ARRAY) elem = model.map(o => this.domify(o, [tag, ...cls].join('.')));
     else {
       elem = P5Elem ? createElement(tag) : this.appendChild(document.createElement(tag));
       if (IS_VAL)(P5Elem ? elem.elt : elem).innerHTML = model;
       else Object.keys(model).map(key => elem.domify(model[key], key)); // creates children
     }
   }
   // handles id and appends element
   if (id = model._id ? model._id : id) {
     if (!IS_ARRAY) elem && P5Elem ? elem.id(id) : elem.setAttribute('id', id);
     window[id] = elem;
   }
   if (IS_ARRAY) return;
   if (cls) cls.forEach(c => P5Elem ? elem.addClass(c) : elem.classList.add(c));
   let onready = model.onready ? model.onready : model.onReady;
   if (onready) onready(elem);
   P5Elem ? P5Elem.child(elem) : this.appendChild(elem);
   if (typeof bind === 'function' && id) bind(P5Elem ? elem.elt : elem, model._bind, model.onvalue, model._true !== undefined ? [model._false, model._true] : model._binary ? model._binary : model._numeric, model._default);
   return elem;
 };
