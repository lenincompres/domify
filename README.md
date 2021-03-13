# Domify
by Lenin Compres

The *domify* function creates DOM elements from a provided JS object sturcture. By default the elements are appended to the *document.body*.

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

/* It returns the container element, in this case document.body. */
```
You may provide the element where it should be created as the following argument.

```javascript
domify({
  h1: 'Hello world',
  p: 'This <b>is</b> a paragraph.'
}, someElement, true);

/* Creates the domified structure inside someElement. Returns someElement.
A boolean as a last argument indicates if the existing content should be replaced. */
```

You may also indicate a tag where the dom structure should be added within the element.

```javascript
domify({
  h1: 'Hello world',
  p: 'This is <b>a</b> paragraph.'
}, 'main', someElement, true);

/* Creates a main element with the domified structure. Returns this main element. */
```

You can also call *domify* as an Element object method.

```javascript
someElement.domify({
  h1: 'Hello world',
  p: 'This is a <b>paragraph</b>.'
}, true);
```
or 

```javascript
someElement.domify({
  h1: 'Hello world',
  p: 'This is a paragraph.'
}, 'main', true);
```

## Attributes

Domify recognizes property names of element attributes and event handlers.

```javascript
domify({
  input: {
    id: 'inputator',
    value: 'default',
    placeholder : 'Type value here',
    style: 'color: "blue"; background-color: "yellow"',
    onchange: e => console.log(inputator.value)
  },
  button: {
    id: 'buttonator',
    text : 'Go',  // text or innerText, and html or innerHTML.
    class: 'good pill',
    onclick: e => inputator.value = 'Button pressed'
  }
});

inputator.style.border = 'none';
buttonator.click();
/* An element objects is created for every id given. */
```

Style may be assign as an object; and classes as an array

```javascript
domify({
  input: {
    id: inputator,
    style: {  // 
      color: 'blue',
      backgroundColor: 'yellow'
    }
  },
  button: {
    id: 'buttonator',
    text : 'Go',
    class: ['good', 'pill'],
    onclick: e => inputator.value = 'Button pressed'
  }
});
```

You may also change style variable directly.

```javascript
domify({
  input: {
    id: inputator,
    color: 'blue',
    backgroundColor: 'yellow'
    value: 'content'
  }
  ...
});
```

###Possible words that could be interpreted as tags, attributes or styles

These are treated as a css style, but the effect is the same as the attribute: *border*, *color*, *height*, *width*.

These are treated as tags if the content is a structural object: "form", "label", "font", "cite", "style", "title", "span".
If it is a string, boolean or number, they are attributes (or slyle for "font")
* "span" is an attribute only on "col" and "colgroup" tags.

Domify will not assign styles to the document.head and will only see "style" as a tag, which resolves *content* and *style* 
Also, *title* is a tag only in document.head.

## Unique Property Names

You may  assign id\'s in the property\'s name by separating it from the tag with an underscore (\_). Example: *div_mainField*.
And if a property is named something other than a tag, sttribute of style, it will interpred this as an id and assume a div tag.

```javascript
domify({
  input_inputator: {
    color: 'blue',
    backgroundColor: 'yellow'
  },
  buttonator: {
    tag: 'button',  // _id and _tag properties replace those interpreted from the name.
    text : 'Go',
    onclick: e => inputator.value = 'Button pressed'
  }
});
```

Classes may also be indicated in the property\'s name after the id, by separating them with underscores (\_). Example: *p_id_class1_class2*.

```javascript
domify({
  p__pretty: {  // Use double underscores to omit an id and still indicate classes.
    html: 'The button <b>does</b> the <i>thing</i>.'
  },
  button_doThing_good_pill: {
    text: 'Go'
    class: 'warning' // Classes in a _class property are added to the ones interpreted in the name.
  }
});
```

## Element arrays

Use arrays to create multiple alements of the same tag

```javascript
domify({
  ul: {
    style: 'margin:2em',
    li: [
      'first item',
      'second item'
    ]
  },
  article_things: [
    {
      h2: 'Article 1 title',
      p: 'Article 1 paragraph.'
    },
    {
      h2: 'Article 2 title',
      p: 'Article 2 paragraph.'
    }
  ]
});

things[1].style.backgroundColor = 'yellow';
/* Giving the array an id creates an array of elements in the window. */
```

## Binding

### Working concept (!)

Use *_bind* to turn the element into a Bind object, which essentially reduces it to a single *value*. This value is linked to its *innerText* property (or *value* property for input type elements).

```javascript
domify({
  p_thing: {
    text: 'Times pressed: ',
    bind: true
  },
  button: {
    text: 'Go',
    onclick: e => thing.value += 'Go! '
  }
});

console.log(thing.elem);
/* The Bind object has an elem property which holds the element. */
```
You may specify that the bind value is numeric by setting the *_numeric* property to *true*.

```javascript
domify({
  p_thing: {
    text: '0',
    bind: true,
    numeric: true,
    onvalue: val => console.log(val)  // An onvalue handler is called whenever the value changes.
  },
  button: {
    text: 'Add one',
    onclick: e => thing.value += 1
  }
});
```

You may bind a different property of the element instead of the defaults *innerText* or *value*.

```javascript
domify({
  p_thing: {
    text: 'Make me red',
    bind: 'style.color'  // This property may be within another property.
  },
  button: {
    text: 'Make red',
    onclick: e => thing.value = 'red'
  }
});
```

The value may be binary. It defaults to being *true*.

```javascript
domify({
  p_thing: {
    bind: true,
    binary: true
  },
  button: {
    text: 'Toggle',
    onclick: e => thing.value = !thing.value
  }
});
```

The *false* and *true* values of a binary bind can be mapped by an array.

```javascript
domify({
  button: {
    text: 'Toggle',
    onclick: e => thing.value = !thing.value
  },
  p_thing: {
    text: 'Now you see me.',
    bind: 'style.display',
    binary: ['none', 'block'],
    default: false  // You may also change the default value.
  }
});
```

## Have fun!
