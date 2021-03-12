/*
  ** test made to see conflicts on words with multiple uses on html
  ** most these issues are resolved by domify
  */

var attrs = ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'bgcolor', 'border', 'charset', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'controls', 'coords', 'data', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'id', 'ismap', 'kind', 'label', 'lang', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'tabindex', 'target', 'title', 'translate', 'type', 'usemap', 'value', 'width', 'wrap'];
var tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'main', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'mark', 'meta', 'meter', 'menu', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video', 'wbr'];
var styles = ["alignContent", "alignItems", "alignSelf", "animation", "animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationTimingFunction", "animationPlayState", "background", "backgroundAttachment", "backgroundColor", "backgroundImage", "backgroundPosition", "backgroundRepeat", "backgroundClip", "backgroundOrigin", "backgroundSize", "backfaceVisibility", "border", "borderBottom", "borderBottomColor", "borderBottomLeftRadius", "borderBottomRightRadius", "borderBottomStyle", "borderBottomWidth", "borderCollapse", "borderColor", "borderImage", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeft", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRadius", "borderRight", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderSpacing", "borderStyle", "borderTop", "borderTopColor", "borderTopLeftRadius", "borderTopRightRadius", "borderTopStyle", "borderTopWidth", "borderWidth", "bottom", "boxDecorationBreak", "boxShadow", "boxSizing", "captionSide", "caretColor", "clear", "clip", "color", "columnCount", "columnFill", "columnGap", "columnRule", "columnRuleColor", "columnRuleStyle", "columnRuleWidth", "columns", "columnSpan", "columnWidth", "content", "counterIncrement", "counterReset", "cursor", "direction", "display", "emptyCells", "filter", "flex", "flexBasis", "flexDirection", "flexFlow", "flexGrow", "flexShrink", "flexWrap", "cssFloat", "font", "fontFamily", "fontSize", "fontStyle", "fontVariant", "fontWeight","fontSizeAdjust", "fontStretch", "hangingPunctuation", "height", "hyphens", "icon", "imageOrientation", "isolation", "justifyContent", "left", "letterSpacing", "lineHeight", "listStyle", "listStyleImage", "listStylePosition", "listStyleType", "margin", "marginBottom", "marginLeft", "marginRight", "marginTop", "maxHeight", "maxWidth", "minHeight", "minWidth", "navDown", "navIndex", "navLeft", "navRight", "navUp", "objectFit", "objectPosition", "opacity", "order", "orphans", "outline", "outlineColor", "outlineOffset", "outlineStyle", "outlineWidth", "overflow", "overflowX", "overflowY", "padding", "paddingBottom", "paddingLeft", "paddingRight", "paddingTop", "pageBreakAfter", "pageBreakBefore", "pageBreakInside", "perspective", "perspectiveOrigin", "position", "quotes", "resize", "right", "scrollBehavior", "tableLayout", "tabSize", "textAlign", "textAlignLast", "textDecoration", "textDecorationColor", "textDecorationLine", "textDecorationStyle", "textIndent", "textJustify", "textOverflow", "textShadow", "textTransform", "top", "transform", "transformOrigin", "transformStyle", "transition", "transitionProperty", "transitionDuration", "transitionTimingFunction", "transitionDelay", "unicodeBidi", "userSelect", "verticalAlign", "visibility", "whiteSpace", "width", "wordBreak", "wordSpacing", "wordWrap", "widows", "zIndex"];

console.log('Attributes & tags duplicates', attrs.filter(s => tags.includes(s)));
console.log('Attributes & styles duplicates', attrs.filter(s => styles.includes(s)));
console.log('styles & tags duplicates', styles.filter(s => tags.includes(s)));

/*

Logs out:
Attributes & tags duplicates (6) ["cite", "form", "label", "span", "style", "title"]
Attributes & styles duplicates (5) ["border", "color", "content", "height", "width"]
styles & tags duplicates ["font"]

SOLVED:

"border", "color", "height", "width"
Are treated as a css style, but the effect is the same as the attribute.

"form", "label", "font", "cite", "style", "title"
If the content to assign is a structural object, these are tags; if it is a string, boolean or number, these are attributes (or slyle for "font")

"content", "style"
Domify does not assign direct styles on document.head and will only see "style" as a tag

"title"
This is a tag only in document.head, and an attibute elsewhere.

*/
