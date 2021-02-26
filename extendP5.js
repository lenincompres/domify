
/*
 ** functions that should exist already
 ** created by: Lenin Compres
 */
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
// toggle [r, g, b] and {r:x, g:y, b:z}
var rgb = (c, asObj) => { 
  if (Array.isArray(c)) return c.mapTo(['r', 'g', 'b']);
  if (!!window.p5) {
    c = color(c);
    c = [red(c), green(c), blue(c)];
  }
  if (typeof c === 'string') c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c).filter((_, i) => i > 0 && 1 < 4).map(v => parseInt(v, 16));
  return asObj ? rgb(c) : c;
}
