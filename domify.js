/**
 * Creates DOM structures from a JS object (structure)
 * @author Lenin Compres <lenincompres@gmail.com>
 */

 const domify = (...args) => document.body ? document.body.domify(...args) : window.addEventListener('load', () => domify(...args));

 Element.prototype.domify = Element.prototype.modify = function (structure, ...args) {
   if ([null, undefined].includes(structure)) return;
   let station = args.filter(a => typeof a === 'string')[0]; // style|attr|tag|inner…|onEvent|name
   if (['tag', 'id', 'onready', 'onReady'].includes(station)) return;
   if (typeof structure == 'string' && structure.endsWith('.json')) return domloadRequest(structure, data => this.domify(data, ...args), error => console.log(structure, 'Could not load JSON file.'));
   const IS_PRIMITIVE = isPrimitive(structure);
   const IS_FUNCTION = typeof structure === 'function';
   const IS_ARRAY = Array.isArray(structure);
   const TAG = this.tagName.toLowerCase();
   const IS_HEAD = TAG === 'head';
   const CLEAR = args.filter(a => typeof a === 'boolean')[0];
   let elt = args.filter(a => a && a.tagName)[0];
   if (elt) return elt.domify(structure, station, CLEAR, p5Elem);
   let p5Elem = args.filter(a => a && a.elt)[0];
   const PREPEND = CLEAR === false;
   if (!station) {
     if (CLEAR) this.innerHTML = '';
     let keys = PREPEND ? Object.keys(structure).reverse() : Object.keys(structure);
     keys.forEach(key => this.domify(structure[key], key, p5Elem, PREPEND ? false : undefined));
     return this;
   }
   let [tag, ...cls] = station.split('_');
   let id = cls[0];
   if (station.includes('.')) {
     cls = station.split('.');
     tag = cls.shift();
   }
   if (tag.includes('#'))[tag, id] = tag.split('#');
   tag = (structure.tag ? structure.tag : tag).toLowerCase();
   if (IS_ARRAY) {
     if (station === 'class') return structure.forEach(c => c ? this.classList.add(c) : null);
     if (station === 'addEventListener') return this.addEventListener(...structure);
     let map = structure.map(s => this.domify(s, tag + '.' + cls.join('.')));
     if (id) window[id] = map;
     return
   }
   if (structure.bind && !IS_FUNCTION) {
     if (!HTML_TAGS.includes(tag)) {
       structure.bind.bind(this, station, structure.onvalue);
       if (structure.value !== undefined) structure.bind.value = structure.value;
       return;
     }
     structure = {
       content: structure
     }
   }
   if (tag === 'style') {
     if (IS_PRIMITIVE && !IS_HEAD) return this.setAttribute(tag, structure);
     if (IS_HEAD && !structure.content) {
       structure = {
         content: structure
       };
     }
     if (!structure.content) {
       if (CLEAR) this.style = '';
       return Object.keys(structure).forEach(k => this.style[k] = structure[k]);
     }
     if (!isPrimitive(structure.content)) structure.content = domifyCSS(structure.content);
   }
   if (IS_FUNCTION) {
     if (p5Elem && typeof p5Elem[station] === 'function') return p5Elem[station](structure);
     return this[station] = structure;
   }
   if (IS_PRIMITIVE) {
     if (TAG !== 'meta' && ['content', 'html', 'innerHTML'].includes(station)) return this.innerHTML = structure;
     if (['text', 'innerText'].includes(station)) return this.innerText = structure;
     if (IS_HEAD) {
       let extension = typeof structure === 'string' ? structure.split('.').slice(-1)[0] : 'none';
       if (station === 'title') return this.innerHTML += `<${station}>${structure}</${station}>`;
       if (station === 'link') {
         let rel = {
           none: '',
           css: 'css',
           sass: 'sass',
           scss: 'scss',
           ico: 'icon'
         };
         return this.innerHTML += `<link href="${structure}" rel="${rel[extension]}">`;
       }
       if (station === 'script' && extension === 'js') return this.innerHTML += `<script src="${structure}"</script>`;
     }
     let done = this.style[station] !== undefined ? this.style[station] = structure : undefined;
     if (HTML_ATTRIBUTES.includes(station)) {
       this.setAttribute(station, structure);
       done = true;
     }
     if (done !== undefined) return;
   }
   if (['content', 'html', 'innerHTML'].includes(station)) return this.domify(structure, true);
   let elem = (structure.tagName || structure.elt) ? structure : false;
   if (!elem) {
     if (!HTML_TAGS.includes(tag)) {
       id = tag;
       tag = 'div';
     }
     elem = p5Elem ? createElement(tag) : document.createElement(tag);
     if (IS_PRIMITIVE)(p5Elem ? elem.elt : elem).innerHTML = structure;
     else Object.keys(structure).map(key => elem.domify(structure[key], key, p5Elem));
   }
   elt = (p5Elem ? elem.elt : elem);
   if (cls) cls.forEach(c => c ? elt.classList.add(c) : null);
   if (id = structure.id ? structure.id : id) {
     elt.setAttribute('id', id);
     window[id] = elem;
   }
   this[PREPEND ? 'prepend' : 'append'](elt);
   if (structure.onready) structure.onready(elem);
   return elem;
 };
 
 /* ---------- AUXILIARY MEHODS ------------- */
 
 const HTML_ATTRIBUTES = ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'bgcolor', 'border', 'charset', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'controls', 'coords', 'data', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'id', 'ismap', 'kind', 'lang', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'selected', 'shape', 'size', 'sizes', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'tabindex', 'target', 'title', 'translate', 'type', 'usemap', 'value', 'wrap', 'width'];
 const HTML_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'main', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frame', 'frameset', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'mark', 'meta', 'meter', 'menu', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video', 'wbr'];
 const PSEUDO_CLASSES = ['active', 'checked', 'disabled', 'empty', 'enabled', 'first-child', 'first-of-type', 'focus', 'hover', 'in-range', 'invalid', 'last-of-type', 'link', 'only-of-type', 'only-child', 'optional', 'out-of-range', 'read-only', 'read-write', 'required', 'root', 'target', 'valid', 'visited', 'lang', 'not', 'nth-child', 'nth-last-child', 'nth-last-of-type', 'nth-of-type'];
 const PSEUDO_ELEMENTS = ['after', 'before', 'first-letter', 'first-line', 'selection'];
 
 String.prototype.camelCase = function (s = false) {
   return s ? this.replace(/([A-Z])/g, s + '$1').toLowerCase() : this.replace(/^([A-Z])|[\s-_ ]+(\w)/g, (_, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
 };
 
 const isPrimitive = foo => ['boolean', 'number', 'string'].includes(typeof foo);
 
 // consolidates structurals objects in an array into one object with all properties
 const assignAll = (source = {}, dest = {}) => {
   (Array.isArray(source) ? source : [source]).forEach(s => Object.assign(dest, s));
   return dest;
 }
 
 // turns a structural object into css
 const domifyCSS = (sel, obj) => {
   if (typeof sel !== 'string') {
     if (!sel) return;
     if (Array.isArray(sel)) sel = assignAll(sel);
     return Object.keys(sel).map(key => domifyCSS(key, sel[key])).join(' ');
   }
   let extra = [],
     id, cls;
   [sel, id, ...cls] = sel.split('_');
   if (id) sel += '#' + id;
   if (cls.length) sel += '.' + cls.join('.');
   if (isPrimitive(obj)) return `${sel.camelCase('-')}: ${obj};`;
   if (Array.isArray(obj)) obj = assignAll(obj);
   let css = Object.keys(obj).map(key => {
     let style = obj[key];
     if (isPrimitive(style)) return domifyCSS(key, style);
     let sub = key.split('(')[0].camelCase('-');
     let xSel = `${sel} ${key}`;
     if (PSEUDO_CLASSES.includes(sub)) xSel = `${sel}:${key}`;
     else if (PSEUDO_ELEMENTS.includes(sub)) xSel = `${sel}::${key}`;
     else if (style.immediate) xSel = `${sel}>${key}`;
     extra.push(domifyCSS(xSel, style));
   }).join(' ');
   return (css ? `\n${sel} {${css}} ` : '') + extra.join(' ');
 }
 
 // makes domify available for p5
 if (typeof p5 !== 'undefined') {
   p5.domify = (...args) => domify(...args, createDiv());
   p5.Element.prototype.domify = p5.Element.prototype.modify = function (...args) {
     this.elt.domify(...args, this);
   }
 }
 
 // used to bind element properties, attributes, styles or content
 
 const dombind = (name, onvalue, value) => {
   let bind = window[name] ? window[name] : window[name] = new Bind();
   const IS_FUNC = typeof onvalue === 'function'
   return {
     bind: bind,
     onvalue: IS_FUNC ? onvalue : value,
     value: IS_FUNC ? value : onvalue
   }
 }
 
 const domload = (url, onload, value) => {
   let obj = dombind(url, onload, value);
   domloadRequest(url, data => !data ? null : obj.bind.value = data);
   return obj;
 }
 
 class Bind {
   constructor(val = '') {
     this._elems = [];
     this._value = val;
   }
   bind(elem, property = 'value', onvalue = v => v) {
     this._elems.push({
       elem: elem,
       property: property,
       onvalue: onvalue
     });
     elem.domify(onvalue(this._value), property);
   }
   set value(val) {
     if ([null, undefined].includes(val)) return;
     this._value = val;
     this._elems.forEach(e => e.elem.domify(e.onvalue(val), e.property));
   }
   get value() {
     return this._value;
   }
 }
 
 // XMLHttpRequest JSON
 const domloadRequest = (url, data, onsuccess = _ => null, onerror = _ => null) => {
   const GET = data === false;
   if (typeof data === 'function') {
     onerror = onsuccess;
     onsuccess = data;
     data = {};
   }
   let xobj = new XMLHttpRequest();
   xobj.onreadystatechange = _ => {
     if (xobj.readyState == 4 && xobj.status == '200') {
       try {
         onsuccess(JSON.parse(xobj.responseText));
       } catch (e) {
         onsuccess(xobj.responseText); //none parsed String
       }
     } else onerror(xobj.status);
   }
   xobj.open(GET ? 'POST' : 'GET', url, true);
   xobj.send(data);
 };
 
 // initializes the dom and head automatically if there's an ini.json and/or a main.js
 domloadRequest('ini.json', data => dominify(data, true), error => error === 404 ? dominify(false, true) : null);
 
 let dominify = (INI, autoCall = false) => {
   const ENTRY_POINT = 'main.js';
   const makeArray = a => Array.isArray(a) ? a : [a];
   let ini = Object.assign({
     title: 'A Domified Site',
     viewport: 'width=device-width, initial-scale=1.0',
     charset: 'UTF-8',
     icon: 'assets/icon.ico',
     meta: [],
     resetCSS: true,
     style: [],
     link: [],
     library: [],
     script: [],
     entryPoint: ENTRY_POINT,
     module: true,
     postscript: []
   }, isPrimitive(INI) ? {} : INI);
   if (INI) {
     let reset = {
       '*': {
         boxSizing: 'border',
         font: 'inherit',
         fontFamily: 'Arial, Helvetica, sans-serif',
         fontSize: '100%',
         fontStyle: 'none',
         verticalAlign: 'baseline',
         lineHeight: '1.5em',
         margin: 0,
         padding: 0,
         border: 0,
         borderSpacing: 0,
         borderCollapse: 'collapse',
         listStyle: 'none',
         quotes: 'none',
         content: '',
         content: 'none',
       }
     };
     if (INI) document.head.domify({
       title: ini.title,
       meta: [{
         charset: ini.charset
       }, {
         name: 'viewport',
         content: ini.viewport
       }, ...makeArray(ini.meta)],
       link: [{
         rel: 'icon',
         href: ini.icon
       }, ...makeArray(ini.link)],
       script: makeArray(ini.script),
       style: [ini.resetCSS ? reset : null, ...makeArray(ini.style)]
     }, true);
   }
   // sets the entry point Should only be done once
   if (autoCall) domloadRequest(INI ? ini.entryPoint : ENTRY_POINT, data => {
     domify({
       script: [{
         type: ini.module ? 'module' : null,
         src: ini.entry ? ini.entry : ini.entryPoint
       }, ...makeArray(ini.postscript)]
     });
   });
 };
