# Domify
by Lenin Compres

The *domify* function creates DOM elements from a provided JS object sturcture. By default the elements are appended to the *document.body*.
*  It returns the container element. 

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
You may provide a tag for the new element and a parent where it should be appended as following arguments.

```javascript
domify({
  h1: 'Hello world',
  p: 'This <b>is</b> a paragraph.'
}, 'div', someElement);

/* This creates a div element with the domified structure inside someElement */
```

If no tag is passed, and an element is passed as a second argument instead, *domify* appends the domified structure to it.
* Pass *true* as the following argument if you want the content to replace any existing one.

```javascript
domify({
  h1: 'Hello world',
  p: 'This is <b>a</b> paragraph.'
}, someElement, true);
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
* You may use *_html* for *_innerHTML* and *_text* for *_innerText*.
* Event handlers can be set by using their names as properties (*onclick*, *onblur*, etc.).
* When given an *id*, an element object by that name is created in the window.

```javascript
domify({
  input: {
    _id: 'inputator',
    _value: 'default',
    _placeholder : 'Type value here',
    _style: 'color: "blue"; background-color: "yellow"',
    onchange: e => console.log(inputator.value)
  },
  button: {
    _id: 'buttonator',
    _text : 'Go',
    _class: 'good pill',
    onclick: e => inputator.value = 'Button pressed'
  }
});

inputator.style.border = 'none';
buttonator.click();
```

You may also assign id\'s in the property\'s name by separating it from the tag with an underscore (\_). Example: *div_mainField*.
* Any value passed in a *_id* or *_tag* property will **replace** the ones interpreted from the name.
* If a property is named as something other than a tag name, it will use this name as an *id* and create a *div* tag.
* You may pass styles as an object and classes as an array.

```javascript
domify({
  input_inputator: {
    _style: {
      color: 'blue',
      backgroundColor: 'yellow'
    }
  },
  buttonator: {
    _tag: 'button',
    _text : 'Go',
    _class: ['good', 'pill'],
    onclick: e => inputator.value = 'Button pressed'
  }
});
```

Classes may also be indicated in the property\'s name after the id, by separating them with underscores (\_). Example: *p_id_class1_class2*.
* Any classes passed in a *_class* property will be **added** to the ones interpreted in the name.
* Use double underscores to omit an id and still indicate classes. Example: *p__pretty* creates *\<p class="pretty"\>*.

```javascript
domify({
  p__pretty: {
    _html: 'The button <b>does</b> the <i>thing</i>.'
  },
  button_doThing_good_pill: {
    _text: 'Go'
  }
});
```

## List and element arrays

Use arrays to create multiple alements of the same tag.
* Giving the array an id creates an array of elements in the window.

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
```

## Binding

Use *_bind* to turn the element into a Bind object, which essentially reduces it to a single *value*. This value is linked to its *innerText* property (or *value* property for input type elements).
* The Bind object has an *elem* property which holds the element.

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
```
You may specify that the bind value is numeric by setting the *_numeric* property to *true*.
* An *onvalue* handler is called everytime the value changes.

```javascript
domify({
  p_thing: {
    _text: '0',
    _bind: true,
    _numeric: true,
    onvalue: val => console.log(val)
  },
  button: {
    _text: 'Add one',
    onclick: e => thing.value += 1
  }
});
```

You may bind a different property of the element instead of the defaults *innerText* or *value*.
* This property may be within another property.

```javascript
domify({
  p_thing: {
    _text: 'Make me red',
    _bind: 'style.color'
  },
  button: {
    _text: 'Make red',
    onclick: e => thing.value = 'red'
  }
});
```

The value may be binary.
* It defaults to being *true*.

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
* You may also change the default value with the *_default* property.

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
    _default: false
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
