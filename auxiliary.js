/*
 ** Useful axuiliary functions
 ** created by: Lenin Compres
 */
//calls f n times passing i and r (reverse); returns arr of func returns.
var iterate = (f, n = 1, r) => Array(n).fill().map((_, i) => f(r ? n - i - 1 : i)); 

//gest arguments on querystring
var getArgs = () => { 
  var qs = location.search.substring(1);
  if(!qs) return Object();
  if(qs.includes('=')) return JSON.parse('{"' + decodeURI(location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
  return qs.split('/');
}

//queries all elements return array
var queryAll = (sel, elem) => elem ? [...elem.querySelectorAll(sel)] : [...document.querySelectorAll(sel)]; 

//returns 1, fail or -1 depending on the sign of n
var dir = (n, fail = 0) => n === 0 ? fail : n > 0 ? 1 : -1; 

//constrains n btw two values
var range = (n, a, b) => a < b ? (n < a ? a : n > b ? b : n) : (n < b ? b : n > a ? a : n); 

// turns color into [r, g, b] or {r:x, g:y, b:z}
var rgb = (c, asObj) => { 
  if (Array.isArray(c)) return c.indexed(['r', 'g', 'b']);
  if (!!window.p5) {
    c = color(c);
    c = [red(c), green(c), blue(c)];
  }
  if (typeof c === 'string') c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c).filter((_, i) => i > 0 && 1 < 4).map(v => parseInt(v, 16));
  return asObj ? rgb(c) : c;
}

/*------------------------------
OBJECTS
--------------------------------*/

Object.prototype.forIn = function (f) {
  return Object.keys(this).map(key => f(this[key], key));
}

/*------------------------------
STRINGS
------------------------------*/
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

// turns to camelCase (or back given a separator)
String.prototype.camelCase = function (s = false) { 
  return s ? this.replace(/([A-Z])/g, s + '$1').toLowerCase() : this.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
}

// gets html from markdown (! after link for blank target)
String.prototype.markdown = function () { 
  var _link = (m, txt, href, t, _) => {
    var title = t.length > 1 ? ` title="${t}"` : '';
    var target = [_, t].includes('!') ? ' target ="_blank"' : '';
    var trail = target ? '' : _ ? _ : t;
    return `<a href="${href}"${title}${target}>${txt}</a>${trail}`;
  }
  return this.replace(/\[(.*?)\]\((.*?)\"(.*?)\"\)(.?)/gm, _link).replace(/\[(.*?)\]\((.*?)\)(.?)/gm, _link)
    .replace(/\_\_(.*?)\_\_/gm, '<b>$1</b>').replace(/\_(.*?)\_/gm, '<i>$1</i>')
    .replace(/\*\*(.*?)\*\*/gm, '<b>$1</b>').replace(/\*(.*?)\*/gm, '<i>$1</i>');
}

/*------------------------------
ARRAYS 
------------------------------*/
Array.prototype.range = function (from = 0, to) {
  if (!to) to = this.length - 1;
  return this.filter((a, i) => i >= from && i <= to);
}
// adds arrays to array, or number
Array.prototype.plus = function (arr = 0) { 
  return this.map((n, i) => n + (typeof arr === 'number' ? arr : arr[i % arr.length]));
}
// substracts arrays or number from array
Array.prototype.minus = function (arr = 0) { 
  return this.plus(typeof arr === 'number' ? -arr : arr.map(v => -v));
}
// multiplies array times array or number
Array.prototype.times = function (arr = 1) { 
  return this.map((n, i) => n * (typeof arr === 'number' ? arr : arr[i % arr.length]));
}
// returns object with items indexed by Prop, Array, or function
Array.prototype.mapObject = function (foo) { 
  if (typeof foo === 'string') foo = v => v[foo];
  if (!Array.isArray(foo)) foo = this.map(foo);
  var obj = {};
  this.forEach((val, i) => obj[foo[i % foo.length]] = val);
  return obj;
}
//returns a random array from original
Array.prototype.random = function(){
  var arr = [];
  while(this.length) arr.push(this.splice(Math.floor(Math.random() * this.length),1)[0]);
  return arr;
}

/*------------------------------
JSON
------------------------------*/
var loadJSON = (url, data, onsuccess = _ => null, onerror = _ => null) => {
  const GET = data === false;
  if (typeof data === 'function') {
    onerror = onsuccess;
    onsuccess = data;
    data = {};
  }
  var xobj = new XMLHttpRequest();
  xobj.onreadystatechange = _ => xobj.readyState == 4 && xobj.status == '200' ? onsuccess(JSON.parse(xobj.responseText)) : onerror(xobj.responseText);
  xobj.open(GET ? 'POST' : 'GET', url, true);
  xobj.send(data);
}

var getJSON = (url, data, callback, errorback) => {
  if(!data || typeof data === 'function') return loadJSON(url, false, data, callback);
  loadJSON(url + '?' + data.forIn((val, key) => `${key}=${val}`).join('&'), false, callback, errorback);
};


/*---------------------------------- 
P5
----------------------------------*/
if (!!window.p5) {
  var opacate = (c, a) => { // returns color with changed opacity 
    c = color(c);
    return color(red(c), green(c), blue(c), 255 * a);
  };
  var darken = (c, factor = 1) => { // return a color with changed lightness
    colorMode(HSL);
    c = color(c);
    return color(hue(c), saturation(c), lightness(c) * factor);
  };
}
