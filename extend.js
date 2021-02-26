/*
 ** functions that should exist already
 ** created by: Lenin Compres
 */
// querystring as object
const ARGS = (function() { 
  var qs = location.search.substring(1);
  if(!qs) return Object();
  if(qs.includes('=')) return JSON.parse('{"' + decodeURI(location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
  return qs.split('/');
})();
// iterate through object
Object.prototype.forIn = function (f) {
  return Object.keys(this).map(key => f(this[key], key));
}
// query elements into an array
var queryAll = (sel, elem) => elem ? [...elem.querySelectorAll(sel)] : [...document.querySelectorAll(sel)]; 
// do f n times passing i; r for reverse; returns arr
var iterate = (f, n = 1, r) => Array(n).fill().map((_, i) => f(r ? n - i - 1 : i)); 
// XMLHttpRequest JSON
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
// same using GET
var getJSON = (url, data, callback, errorback) => {
  if(!data || typeof data === 'function') return loadJSON(url, false, data, callback);
  loadJSON(url + '?' + data.forIn((val, key) => `${key}=${val}`).join('&'), false, callback, errorback);
};
// 1/fail/-1 depending on sign
Number.prototype.sign =  function(fail = 0){
  return this === 0 ? fail : this > 0 ? 1 : -1; 
}
// constrains btw values
Number.prototype.range =  function(a, b){
  return a < b ? (this < a ? a : this > b ? b : this) : (this < b ? b : this > a ? a : this); 
}
// capitalize
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}
// camelCase or back given a separator
String.prototype.camelCase = function (s = false) { 
  return s ? this.replace(/([A-Z])/g, s + '$1').toLowerCase() : this.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
}
// html from markdown (! after link for blank target)
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
// from index to index
Array.prototype.range = function (from = 0, to) { 
  if (!to) to = this.length - 1;
  return this.filter((a, i) => i >= from && i <= to);
}
// random order
Array.prototype.random = function(){
  var arr = [];
  while(this.length) arr.push(this.splice(Math.floor(Math.random() * this.length),1)[0]);
  return arr;
}
// object with items indexed by Prop, Array, or function
Array.prototype.mapTo = function (foo) { 
  if (typeof foo === 'string') foo = v => v[foo];
  if (!Array.isArray(foo)) foo = this.map(foo);
  var obj = {};
  this.forEach((val, i) => obj[foo[i % foo.length]] = val);
  return obj;
}
// add array to array, or number to each item
Array.prototype.plus = function (arr = 0) { 
  return this.map((n, i) => n + (typeof arr === 'number' ? arr : arr[i % arr.length]));
}
// substract array from array, or number from each item
Array.prototype.minus = function (arr = 0) { 
  return this.plus(typeof arr === 'number' ? -arr : arr.map(v => -v));
}
// multiply array to array, or number times each item
Array.prototype.times = function (arr = 1) { 
  return this.map((n, i) => n * (typeof arr === 'number' ? arr : arr[i % arr.length]));
}
