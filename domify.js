/**
 * Creates DOM structures from a JS object (structure)
 * @author Lenin Compres <lenincompres@gmail.com>
 */
 var domify = (...args) => document.body.domify(...args);
 Element.prototype.domify = Element.prototype.modify = function (structure, ...args) {
   if ([null, undefined].includes(structure)) return;
   let getFirst = f => args.filter(a => f(a))[0];
   let station = getFirst(a => typeof a === 'string'); // style|attribute|tag|inner…|onEvent|name
   if (['tag', 'id', 'onready', 'onReady'].includes(station)) return;
   let clear = getFirst(a => typeof a === 'boolean');
   let prepend = clear === false;
   let elt = getFirst(a => a && a.tagName);
   let p5Elem = getFirst(a => a && a.elt);
   if (elt) return elt.domify(structure, station, clear, p5Elem);
   if (!station) {
     if (clear) this.innerHTML = '';
     let keys = prepend ? Object.keys(structure).reverse() : Object.keys(structure);
     keys.forEach(key => this.domify(structure[key], key, p5Elem, prepend ? false : undefined));
     return this;
   }
   let tagName = this.tagName.toLowerCase();
   const IS_HEAD = tagName === 'head';
   const IS_PRIMITIVE = ['boolean', 'number', 'string', 'bigInt'].includes(typeof structure);
   const IS_FUNCTION = !IS_PRIMITIVE && typeof structure === 'function';
   const IS_ARRAY = !IS_PRIMITIVE && !IS_FUNCTION && Array.isArray(structure);
   if (IS_PRIMITIVE) {
     if (['html', 'innerHTML'].includes(station)) return (this.innerHTML = structure);
     if (['text', 'innerText'].includes(station)) return (this.innerText = structure);
     if (!IS_HEAD && this.style[station] !== undefined) return this.style[station] = structure;
     if (!(IS_HEAD && ['title', 'style'].includes(station)) && ((station === 'span' && tagName.startsWith('col')) && (station === 'label' && tagName === 'track') || ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'bgcolor', 'border', 'charset', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'controls', 'coords', 'data', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'id', 'ismap', 'kind', 'lang', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'selected', 'shape', 'size', 'sizes', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'tabindex', 'target', 'title', 'translate', 'type', 'usemap', 'value', 'width', 'wrap'].includes(station) || station.startsWith('data-'))) return this.setAttribute(station, structure);
   } else {
     if (IS_HEAD && station === 'style') return this.domify(`${Object.keys(structure).map(key => `${key} {${Object.keys(structure[key]).map(k => `${k.camelCase('-')}:${structure[key][k]}`).join(';')}`).join('}')}}`, station);
     if (IS_ARRAY && station === 'class') return structure.forEach(c => c ? this.classList.add(c) : null);
     if (!IS_ARRAY && station === 'style') return Object.assign(this.style, structure);
     if (IS_FUNCTION && this[station] !== undefined) return this[station] = structure;
     if (p5Elem && IS_FUNCTION && p5Elem[station] !== undefined) return p5Elem[station](structure);
     if(IS_ARRAY && ['addEvent','addEventListener'].includes(station)) return this.addEventListener(...structure);
   }
   let [tag, id, ...cls] = station.split('_');
   if (station.includes('.')) {
     cls = station.split('.');
     tag = cls.shift();
   }
   if (tag.includes('#'))[tag, id] = tag.split('#');
   tag = structure.tag ? structure.tag : tag;
   let elem = (structure.tagName || structure.elt) ? structure : false;
   if (!elem) {
     if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'main', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'mark', 'meta', 'meter', 'menu', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video', 'wbr'].includes(tag.toLowerCase())) {
       id = tag;
       tag = 'div';
     }
     if (IS_ARRAY) elem = structure.map(o => this.domify(o, [tag, ...cls].join('.')));
     else {
       elem = p5Elem ? createElement(tag) : document.createElement(tag);
       if (IS_PRIMITIVE)(p5Elem ? elem.elt : elem).innerHTML = structure;
       else Object.keys(structure).map(key => elem.domify(structure[key], key));
     }
   }
   elt = (p5Elem ? elem.elt : elem);
   // id and appending element
   if (id = structure.id ? structure.id : id) {
     if (!IS_ARRAY) elem && elt.setAttribute('id', id);
     window[id] = elem;
   }
   if (IS_ARRAY) return;
   if (cls) cls.forEach(c => elt.classList.add(c));
   let onready = structure.onready ? structure.onready : structure.onReady;
   if (onready) onready(elem);
   this[prepend ? 'prepend' : 'append'](elt);
   return elem;
 };
 String.prototype.camelCase = function (s = false) {
   return s ? this.replace(/([A-Z])/g, s + '$1').toLowerCase() : this.replace(/^([A-Z])|[\s-_ ]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
 };
 if (typeof p5 !== 'undefined') {
   p5.domify = (...args) => domify(...args, createDiv());
   p5.Element.prototype.domify = p5.Element.prototype.modify = function (...args) {
     this.elt.domify(...args, this);
   }
 }
