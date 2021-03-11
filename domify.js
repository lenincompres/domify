/*
 ** domify makes html element structures from a JS object model
 ** created by: Lenin Compres
 */
 var domify = (...args) => document.body.domify(...args);
 if (typeof p5 !== 'undefined') p5.Element.prototype.domify = function (model, prop, replace) {
   this.elt.domify(model, prop, replace, this);
 }
 Element.prototype.domify = function (model, prop, replace = false, p5Elem) {
   if ([null, undefined].includes(model)) return;
   if (['_tag', '_id', 'onready', 'onReady', 'onvalue', '_bind', '_numeric', '_true', '_false', '_binary', '_default'].includes(prop)) return;
   if (typeof prop === 'boolean' || !prop) {
     p5Elem = replace;
     replace = prop;
     prop = this;
   }
   let isElem = o => o && (o.elt || o.tagName);
   if (isElem(replace)) return replace.domify(model, prop, p5Elem);
   if (isElem(prop)) return Object.keys(model).map(key => prop.domify(model[key], key, replace));
   if (replace === true) this.innerHTML = '';
   // attibutes and events
   const IS_ARRAY = Array.isArray(model);
   const IS_VAL = ['boolean', 'number', 'string'].includes(typeof model);
   if (typeof prop === 'string' && prop[0] === '_') {
     if (prop === '_html') return (this.innerHTML = model);
     if (prop === '_text') return (this.innerText = model);
     if (prop === '_class' && IS_ARRAY) return model.forEach(c => this.classList.add(c));
     if (prop === '_style' && !IS_VAL && !IS_ARRAY) return Object.assign(this.style, model);
     return this.setAttribute(prop.slice(1), model);
   }
   if (p5Elem && ['mousePressed', 'doubleClicked', 'mouseWheel', 'mouseReleased', 'mouseClicked', 'mouseMoved', 'mouseOver', 'mouseOut', 'touchStarted', 'touchMoved', 'touchEnded', 'dragOver', 'dragLeave'].includes(prop)) return p5Elem[prop](model);
   if (['onblur', 'onchange', 'oninput', 'onfocus', 'onselect', 'onsubmit', 'onreset', 'onkeydown', 'onkeypress', 'onkeyup', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onmousemove', 'onclick', 'ondblclick', 'onload', 'onerror', 'onunload', 'onresize'].includes(prop)) return this[prop] = model;
   // tag, id and classes from prop (tag_id_classes) or (tag#id.classes)
   let [tag, id, ...cls] = prop.split('_');
   if (prop.includes('.')) {
     cls = prop.split('.');
     tag = cls.shift();
   }
   if (tag.includes('#'))[tag, id] = tag.split('#');
   tag = model._tag ? model._tag : tag;
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
       if (IS_VAL)(p5Elem ? elem.elt : elem).innerHTML = model; // no children
       else Object.keys(model).map(key => elem.domify(model[key], key)); 
     }
   }
   // id and appending element
   if (id = model._id ? model._id : id) {
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
