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

/* the function returns the container element. */
```
You may provide a tag for the new element and a parent where it should be appended as following arguments.

```javascript
domify({
  h1: 'Hello world',
  p: 'This <b>is</b> a paragraph.'
}, 'div', someElement);

/* This creates a div element with the domified structure inside someElement */
```

If no tag is passed, and an element is passed as a second argument instead, *domify* appends the domified structure to it.

```javascript
domify({
  h1: 'Hello world',
  p: 'This is <b>a</b> paragraph.'
}, someElement, true);  

/* Pass true as the following argument to replace any existing content on the container element. */
```

You can also call *domify* as an Element object method.

```javascript
someElement.domify({
  h1: 'Hello world',
  p: 'This is a <b>paragraph</b>.'
}, true);
```

## Attributes

Set element attributes preciding its property name with an underscore (\_). 

```javascript
domify({
  input: {
    _id: 'inputator', // When given an id, an element object by that name is created in the window.
    _value: 'default',
    _placeholder : 'Type value here',
    _style: 'color: "blue"; background-color: "yellow"',
    onchange: e => console.log(inputator.value)  // You may defined event handlers.
  },
  button: {
    _id: 'buttonator',
    _text : 'Go',  // You may use _html for _innerHTML, and _text for _innerText.
    _class: 'good pill',
    onclick: e => inputator.value = 'Button pressed'
  }
});

inputator.style.border = 'none';
buttonator.click();
```

You may also assign id\'s in the property\'s name by separating it from the tag with an underscore (\_). Example: *div_mainField*.

```javascript
domify({
  input_inputator: {
    _style: {  // You may assign styles as an object.
      color: 'blue',
      backgroundColor: 'yellow'
    }
  },
  buttonator: {
    _tag: 'button',  // _id or _tag properties will replace those interpreted from the name.
    _text : 'Go',
    _class: ['good', 'pill'],  // You may assign classes with an array
    onclick: e => inputator.value = 'Button pressed'
  }
});

buttonator.click();
/* If a property is named something other than a tag, it will use this as an id and assume a div tag. */
```

Classes may also be indicated in the property\'s name after the id, by separating them with underscores (\_). Example: *p_id_class1_class2*.

```javascript
domify({
  p__pretty: {  // Use double underscores to omit an id and still indicate classes.
    _html: 'The button <b>does</b> the <i>thing</i>.'
  },
  button_doThing_good_pill: {
    _text: 'Go'
    _class: 'warning' // Classes in a _class property are added to the ones interpreted in the name.
  }
});
```

## List and element arrays

Use arrays to create multiple alements of the same tag

```javascript
domify({
  ul: {
    _style: 'margin:2em',
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

Use *_bind* to turn the element into a Bind object, which essentially reduces it to a single *value*. This value is linked to its *innerText* property (or *value* property for input type elements).

```javascript
domify({
  p_thing: {
    _text: 'Times pressed: ',
    _bind: true
  },
  button: {
    _text: 'Go',
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
    _text: '0',
    _bind: true,
    _numeric: true,
    onvalue: val => console.log(val)  // An onvalue handler is called everytime the value changes.
  },
  button: {
    _text: 'Add one',
    onclick: e => thing.value += 1
  }
});
```

You may bind a different property of the element instead of the defaults *innerText* or *value*.

```javascript
domify({
  p_thing: {
    _text: 'Make me red',
    _bind: 'style.color'  // This property may be within another property.
  },
  button: {
    _text: 'Make red',
    onclick: e => thing.value = 'red'
  }
});
```

The value may be binary. It defaults to being *true*.

```javascript
domify({
  p_thing: {
    _bind: true,
    _binary: true
  },
  button: {
    _text: 'Toggle',
    onclick: e => thing.value = !thing.value
  }
});
```

The *false* and *true* values of a binary bind can be mapped by an array.

```javascript
domify({
  button: {
    _text: 'Toggle',
    onclick: e => thing.value = !thing.value
  },
  p_thing: {
    _text: 'Now you see me.',
    _bind: 'style.display',
    _binary: ['none', 'block'],
    _default: false  // You may also change the default value.
  }
});
```

Another way to map binary values is using the *_true* and *_false* properties instead of *_binary*.

```javascript
domify({
  button: {
    _text: 'Toggle',
    onclick: e => thing.value = !thing.value
  },
  p_thing: {
    _text: 'Now you see me.',
    _bind: 'style.display',
    _true: 'block',
    _false: 'none'
  }
});
```

## Have fun!
