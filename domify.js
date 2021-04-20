/**
 * Creates DOM structures from a JS object (structure)
 * @author Lenin Compres <lenincompres@gmail.com>
 */

const domify = (...args) => document.body ? document.body.domify(...args) : window.addEventListener('load', () => domify(...args));

Element.prototype.domify = Element.prototype.modify = function (structure, ...args) {
  if ([null, undefined].includes(structure)) return;
  let station = args.filter(a => typeof a === 'string')[0]; // style|attr|tag|inner…|onEvent|name
  if (['tag', 'onready'].includes(station)) return;
  if (['text', 'innerText'].includes(station)) return this.innerText = structure;
  if (typeof structure == 'string' && structure.endsWith('.json')) return domloadRequest(structure, data => this.domify(data, ...args), error => console.log(structure, 'Could not load JSON file.'));
  const IS_PRIMITIVE = ['boolean', 'number', 'string'].includes(typeof structure);
  const IS_FUNCTION = typeof structure === 'function';
  const IS_ARRAY = Array.isArray(structure);
  const TAG = this.tagName.toLowerCase();
  const IS_HEAD = TAG === 'head';
  const CLEAR = args.filter(a => typeof a === 'boolean')[0];
  let elt = args.filter(a => a && a.tagName)[0];
  if (elt) return elt.domify(structure, station, CLEAR, p5Elem);
  let p5Elem = args.filter(a => a && a.elt)[0];
  const PREPEND = CLEAR === false;
  if (structure.content && Array.isArray(structure.content)) {
    if (structure.id) {
      station += '_' + id;
      delete structure.id;
    }
    return structure.content.forEach(item => {
      let individual = Object.assign({}, structure);
      individual.content = item;
      this.domify(individual, ...args);
    })
  }
  if (!structure.bonds && (station === 'content' && TAG !== 'meta') || station === 'innerHTML') station = 'html';
  if (!station || station === 'html') {
    if (IS_PRIMITIVE) return this.innerHTML = structure;
    if (CLEAR || station === 'html') this.innerHTML = '';
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
  // const IS_TAG = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'main', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frame', 'frameset', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'mark', 'meta', 'meter', 'menu', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video', 'wbr'].includes(tag);
  const IS_ATTRIBUTE = ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'bgcolor', 'border', 'charset', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'controls', 'coords', 'data', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'id', 'ismap', 'kind', 'lang', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'selected', 'shape', 'size', 'sizes', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'tabindex', 'target', 'title', 'translate', 'type', 'usemap', 'value', 'wrap', 'width'].includes(station);
  if (IS_ARRAY) {
    if (station === 'class') return structure.forEach(c => c ? this.classList.add(c) : null);
    if (station === 'addEventListener') return this.addEventListener(...structure);
    let map = structure.map(s => this.domify(s, tag + (cls ? '.' + cls.join('.') : '')));
    if (id) window[id] = map;
    return;
  }
  if (station === 'addEventListener') return structure.options ? this.addEventListener(structure.type, structure.listener, structure.options) : this.addEventListener(structure.type, structure.listener, structure.useCapture, structure.wantsUntrusted);
  if (structure.bonds) {
    if (!IS_ATTRIBUTE && this.style[station] === undefined) return this.domify(structure, 'content');
    return structure.bonds.forEach(bond => bond.bind(this, station, structure.onvalue));
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
    if (!['boolean', 'number', 'string'].includes(typeof structure.content)) structure.content = domifyCSS(structure.content);
  }
  if (IS_FUNCTION) {
    if (p5Elem && typeof p5Elem[station] === 'function') return p5Elem[station](structure);
    return this[station] = structure;
  }
  if (IS_PRIMITIVE) {
    if (IS_HEAD) {
      let extension = typeof structure === 'string' ? structure.split('.').slice(-1)[0] : 'none';
      if (tag === 'title') return this.innerHTML += `<title>${structure}</title>`;
      if (tag === 'link') {
        let rel = {
          none: '',
          css: 'stylesheet',
          sass: 'stylesheet/sass',
          scss: 'stylesheet/scss',
          less: 'stylesheet/less',
          ico: 'icon'
        };
        return this.innerHTML += `<link rel="${rel[extension]}" href="${structure}">`;
      }
      if (tag === 'script' && extension === 'js') return this.innerHTML += `<script src="${structure}"</script>`;
    }
    let done = (this.style[station] !== undefined) ? (this.style[station] = structure) : undefined;
    done = IS_ATTRIBUTE ? !this.setAttribute(station, structure) : done;
    if (station === 'id') window[station] = this;
    if (done !== undefined) return;
  }
  let elem = (structure.tagName || structure.elt) ? structure : false;
  if (!elem) {
    if (!tag) tag = 'div';
    elem = p5Elem ? createElement(tag) : document.createElement(tag);
    elem.domify(structure, p5Elem);
  }
  elt = p5Elem ? elem.elt : elem;
  if (cls) {
    elt.domify(id, 'id');
    cls.forEach(c => c ? elt.classList.add(c) : null);
  }
  this[PREPEND ? 'prepend' : 'append'](elt);
  if (structure.onready) structure.onready(elem);
  return elem;
};

if (typeof p5 !== 'undefined') {
  p5.domify = (...args) => domify(...args, createDiv());
  p5.Element.prototype.domify = p5.Element.prototype.modify = function (...args) {
    this.elt.domify(...args, this);
  }
}

const domifyCSS = (sel, obj) => {
  const assignAll = (arr = [], dest = {}) => {
    arr.forEach(prop => Object.assign(dest, prop));
    return dest;
  }
  if (typeof sel !== 'string') {
    if (!sel) return;
    if (Array.isArray(sel)) sel = assignAll(sel);
    return Object.keys(sel).map(key => domifyCSS(key, sel[key])).join(' ');
  }
  const unCamel = (str) => str.replace(/([A-Z])/g, '-' + '$1').toLowerCase();
  let extra = [];
  let cls = sel.split('_');
  sel = cls.shift();
  if (sel.toLowerCase() === 'fontface') sel = '@font-face';
  if (cls.length) sel += '.' + cls.join('.');
  if (['boolean', 'number', 'string'].includes(typeof obj)) return `${unCamel(sel)}: ${obj};\n`;
  if (Array.isArray(obj)) obj = assignAll(obj);
  let css = Object.keys(obj).map(key => {
    let style = obj[key];
    if (['boolean', 'number', 'string'].includes(typeof style)) return domifyCSS(key, style);
    let sub = unCamel(key.split('(')[0]);
    let xSel = `${sel} ${key}`;
    if (['active', 'checked', 'disabled', 'empty', 'enabled', 'first-child', 'first-of-type', 'focus', 'hover', 'in-range', 'invalid', 'last-of-type', 'link', 'only-of-type', 'only-child', 'optional', 'out-of-range', 'read-only', 'read-write', 'required', 'root', 'target', 'valid', 'visited', 'lang', 'not', 'nth-child', 'nth-last-child', 'nth-last-of-type', 'nth-of-type'].includes(sub)) xSel = `${sel}:${key}`;
    else if (['after', 'before', 'first-letter', 'first-line', 'selection'].includes(sub)) xSel = `${sel}::${key}`;
    else if (['_', '.'].some(s => key.startsWith(s))) xSel = `${sel}${key}`;
    else if (style.immediate) xSel = `${sel}>${key}`;
    extra.push(domifyCSS(xSel, style));
  }).join(' ');
  return (css ? `\n${sel} {\n ${css}}` : '') + extra.join(' ');
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
const dombind = (names, onvalue, values) => {
  if (!Array.isArray(names)) names = [names];
  if (!Array.isArray(values)) values = [values];
  let bonds = names.map(name => window[name] !== undefined ? window[name] : window[name] = new Bind());
  const IS_FUNC = typeof onvalue === 'function';
  if (values !== undefined) bonds.forEach((bond, i) => bond.value = values[i]);
  return {
    bonds: bonds,
    onvalue: _ => onvalue(...bonds.map(bond => bond.value))
  }
}

const domloadRequest = (url, data, onsuccess = _ => null, onerror = _ => null) => {
  if (!url) return;
  const GET = data === false;
  if (typeof data === 'function') {
    onerror = onsuccess;
    onsuccess = data;
    data = {};
  }
  let xobj = new XMLHttpRequest();
  xobj.onreadystatechange = _ => xobj.readyState == 4 && xobj.status == '200' ?
    onsuccess(xobj.responseText) : onerror(xobj.status);
  xobj.open(GET ? 'POST' : 'GET', url, true);
  xobj.send(data);
};
const domload = (url, onload, value) => {
  let obj = dombind(url, onload, value);
  domloadRequest(url, data => data !== undefined ? obj.bind.value = data : null);
  return obj;
}

const dominify = (ini) => { // initializes the dom and head
  if (ini === undefined) return;
  if (typeof ini === 'boolean' || !ini.length) ini = {};
  if (typeof ini === 'string') {
    if (ini.endsWith('.json')) return domloadRequest(ini, data => dominify(data));
    ini = JSON.parse(ini);
  }
  const INI = {
    title: 'A Domified Site',
    charset: 'UTF-8',
    viewport: 'width=device-width, minimum-scale=1.0, maximum-scale=1.0',
    icon: false,
    meta: [],
    reset: true,
    fontFace: [],
    link: [],
    style: [],
    script: [],
    entryPoint: 'main.js',
    module: true,
    postscript: []
  };
  let settings = Object.assign({}, INI);
  Object.assign(settings, ini);
  let reset = {
    fontFace: (Array.isArray(settings.fontFace) ? settings.fontFace : [settings.fontFace]).map(fontFace => typeof fontFace === 'string' ? new Object({
      fontFamily: fontFace.split(/[\/,.]+/).slice(-2)[0],
      src: `url(${fontFace})`
    }) : fontFace),
    '*': {
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      verticalAlign: 'baseline',
      lineHeight: '1.25em',
      fontSize: 'inherit',
      margin: 0,
      padding: 0,
      border: 0,
      borderSpacing: 0,
      borderCollapse: 'collapse',
      listStyle: 'none',
      quotes: 'none',
      content: '',
      content: 'none',
    },
    body:{
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
    },
    'b, strong': {
      fontWeight: 'bold',
    },
    'i, em': {
      fontStyle: 'itallic',
    },
    'a, button': {
      textDecoration: 'none',
      cursor: 'pointer',
    }
  };
  (new Array(6)).fill().forEach((_, i, a) => reset[`h${i + 1}`] = new Object({
    fontSize: `${Math.round(100 * (2 - i / a.length)) / 100}em`
  }));
  const asArray = a => Array.isArray(a) ? a : [a];
  document.head.domify({
    title: settings.title,
    meta: [{
      charset: settings.charset
    }, {
      name: 'viewport',
      content: settings.viewport
    }, ...asArray(settings.meta)],
    link: [settings.icon ? {
      rel: 'icon',
      href: settings.icon
    } : undefined, ...asArray(settings.link)],
    script: asArray(settings.script),
    style: [settings.reset ? reset : undefined, ...asArray(settings.style)]
  }, true);
  Object.keys(ini).filter(key => INI[key] !== undefined).forEach(key => delete ini[key]);
  domify({
    style: ini,
    script: [{
      type: settings.module ? 'module' : undefined,
      src: settings.entryPoint
    }, ...asArray(settings.postscript)]
  });
};
if (SET = document.head.querySelector('[initialize]')) dominify(SET.getAttribute('initialize'));
