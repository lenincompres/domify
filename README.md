# Domify
by Lenin Compres

The domify function creates the DOM elements in the document.body. If called before the body is loaded, it will listen fo the onload event to execute. It returns the container element, in this case document.body.

```javascript
domify({
  header: {
    h1: 'A Domified Page'
  },
  main: {
    article: {
      h2: 'Basic domified object',
      p: '<b>This</b> is a paragraph.'
    }
  },
  footer: {
    p: 'Made with domify'
  }
});
```
You may provide the element where the structure should be created as the following argument.

```javascript
domify({
    h1: 'Hello world',
    p: 'This <b>is</b> a paragraph.'
  }, someElement, true);
```

A true boolean will indicate the new structure should replace any existing one in the element, instead of the default append mode. Specifying false here will prepend the struture instead.

You may also provide a string to indicate the tag of a new element where the DOM structure will be created. The following example creates a main element with the domified structure. It returns this main element, and prepends it in someElement.

```javascript
domify({
  h1: 'Hello world',
  p: 'This is <b>a</b> paragraph.'
}, 'main', someElement);
```

Domify is agnostic about the order of the arguments that follow the first one: A boolean is a flag to clear the element. A String is a the tag for a new element. An element is where it should be created. Aditionally, you can call domify as an Element method.

```javascript
someElement.domify({
  h1: 'Hello world',
  p: 'This is a <b>paragraph</b>.'
}, 'main');
```

## Global elements and element id

Domify recognizes property names of element attributes and event handlers. See if you can find the following in the code.

* Use text: or innerText:, and content:, html: or innerHTML: for the element's content.
* Add event listeners with their arguments in an array.
* Give elements an id to create global elements with that name.

```javascript
domify({
  input: {
    id: 'myInput',
    placeholder: 'Type value here',
    onchange: e => alert(myInput.value)
  },
  button: {
    id: 'goBtn',
    text : 'Go',
    addEventListener: ['click', e => myInput.value = 'Button pressed']
  }
});

myInput.style.border = 'none';
goBtn.click();
```

You may assign id's in the property name by separating it from the tag with an underscore (_). Example: div_mainField:, this will create a div element with an id of mainField. Any id or tag property will replace those interpreted from the name.

```javascript
domify({
  input_myField: {
    placeholder: 'Type value here',
  },
  goBtn: {
    tag: 'button',
    text : 'Go',
    onclick: e => myField.value = 'Button pressed'
  }
});

myInput.style.border = 'none';
goBtn.click();
```
Also, if a name is preceded by an underscore, domify understand this as a div element. So, _mainField will create a div element with an id and variable named mainField.

Domify also adds a class to the element for every word in its name after an underscore (including the id). Then button_acceptDeal_hotStyle_largeButton creates a button element with an id and variable name of acceptDeal, and the classes of acceptDeal, hotStyle and largeButton. Something like __bright will create a div with a class of bright and no id

### Array of elements

Use arrays to create multiple alements of the same tag. Giving the array an id (using the underscore method) creates a global array that holds these elements.

```javascript
domify({
  ul: {
    li_listedThings: [
      'first item',
      'second item',
      'a third for good meassure'
    ]
  }
});

listedThings[1].style.backgroundColor = 'yellow';
```

## There are several ways to style elements with domify

If a style property is assigned a string, this is placed verbatim in the attribute of the element, and replace anything previously there.

```javascript
document.body.domify({
  main:{
    style: 'margin: 20px; font-family: Tahoma; background-color: gray;',
    content: 'This style is in the attribute of this main element.'
  }
});
```
The style property may be an object holding properties and their values, using their JS names (in camelCase).

```javascript
document.body.domify({
  main:{
    style: {
      margin: '20px',
      fontFamily: 'Tahoma',
      backgroundColor: 'gray'
    },
    content: 'This assign the style values directly to the properties.'
  }
});
```

You may also assign individual style properties (in camelCase) directly—without wrapping them in a style object.

```javascript
document.body.domify({
  main:{
    margin: '20px',
    fontFamily: 'Tahoma',
    backgroundColor: 'gray',
    content: 'This delivers the same results.'
  }
});
```

If the style is an object with a content, this will create a style tag with proper CSS language in it. It applies the styling to the whole page using selectors.

```javascript
document.body.domify({
  main:{
    style: {
      lang: 'css',
      content: 'main { margin: 20px; font-family: Tahoma; color:gray; }';
    },
    content: 'This style is applied to all main tags in the page.'
  }
});
```

It is recommended to only do this only once in the code. You may also take advantage of domify interpreting JS structural objects into CSS—nesting and all.

```javascript
document.head.domify({
  style: {
    lang: 'css',
    content: {
      main { 
        margin: '20px',
        fontFamily: 'Tahoma',
        color: 'gray'
      },
      'p, article>*': {
        margin: '2em'
      },
      nav: {
        a: {
          color: 'blue',
          hover: {
            backgroundColor: 'yellow'
          }
        }
      }
    }
  }
};
```

Domify recognizes pseudo-elements and pseudo-classes when converting CSS. And selectors written with underscores (_) are interpreted as such: tag_idName_className_extraClass. In this sense _myImput will be an id (#myInput), and __warning a class (.warning). Something like menu_topMenu_cloud_intense becomes menu#topMenu.cloud.intense.

## Initializing

Just as any other element, you may domify the head element. For example:

```javascript
document.head.domify({
  title: 'Title of the webpage',
  meta: {
    charset: 'UTF-8'
  },
  link : [{
    rel: 'icon',
    href: 'icon.ico'
  }, {
    rel: 'style',
    href: 'style.css'
  }], 
  style: {
    type: 'css',
    content: CSS
  },
  script: {
    type: 'module',
    src: 'main.js' 
  }
}, true);
```

The domify library will initialize the head if it finds an ini.json file in the root folder. This can contain any of the following properies to replace their default values. These are the default values.

```javascript
{
  "title": "A Domified Site",
  "viewport": "width=device-width, initial-scale=1.0",
  "charset": "UTF-8",
  "icon": "assets/icon.ico",
  "meta": [],
  "reset": true,
  "fontFamily": "Arial, sans-serif",
  "fontSize": "14px",
  "fontFace": [],
  "style": [],
  "link": [],
  "script": [],
  "entryPoint": "main.js",
  "module": true,
  "postscript": []
}
```

The meta, fontFace, link, script, postscript and style may be a single object or an array of these elements. 
* The *script* gets added to the head—before the entry point—, while *postscript* get added in the body after the entry point. 
* Just like fontFace amd fontSize, any other styling in the ini.json is added to the body element; you main indicate the background color or fontWeight, for instance. 
* With *fontFace*, you may add fonts with the *fontFamily* and *src* properties; if you just indicate a filename string, domify will add the filename as the font family name.
* *link* also interprets url strings or the object and properties of the linked resources.

## Binding

Any element's attribute, content, styling, can be bound to a blobal object. When the value property of this variable changes, it will automatically update all elements bound to it. To create a bind assign a dombind call to the element property with the name of the object to bind. If this object does not exist, the bind will create it.

```javascript
domify({
  input: {
    value: dombind('myBindVar'),
    placeholder: 'This will change',
  },
  button: {
    text : 'Go',
    onclick: e => myBindVar.value = 'Button pressed'
  }
});
```

You may also give the dombind a function to be called whenever the value is changed. This function should return the correct value to assign to the element's property.

```javascript
domify({
  div: {
    padding: '20px',
    background: dombind('enabledField', value => value ? 'lime': 'red', true)
    },
    input: {
      enabled: dombind('enabledField'),
      value: dombind('enabledField', value => value ? 'Enabled' : 'Disabled')
    }
    button : {
      text: 'toggle',
      onclick: () => enabledField.value = !enabledField.value
    }
  }
});
```

You may provide dombind a default value for the bind as a third argument. In this case that value was true. Domify is agnostic about the order of the onvalue function and the default value passed after the name of the bind. To bind a property to several values, use an array.

```javascript
value: dombind(['enabledField', 'timeOfDay'], (enabled, time) => (value && time < 12) ? 'Enabled' : 'Disabled')
```

## Other Uses

Domify allows you to modify attributes and styles in your elements using just this one method.

```javascript
myElement.domify({
  padding: '0.5em 2em',
  backgroundColor: 'lavender'
});

/* it even works for simple values */

myElement.domify('bold', 'fontWeight');

goBtn.domify('Go', 'text');

goBtn.modify(true, 'disabled');
```

This last line of code is not a typo. The **domify** method is also the **modify** method for Elements.

## P5 JS

When called from a p5.Element os as p5.domify, all new elements given with an id are created as p5.Elements. 

```javascript
p5Element.domify({
  h1: 'Hello world',
  p: 'This is a paragraph.'
});

p5.domify({
  h1: 'Hello world',
  button: {
    id: goBtn,
    text: 'Go',
    mouseClicked: handlerFunction
  }
);
/* goBtn is a p5 Element. */
```

## Have fun!
