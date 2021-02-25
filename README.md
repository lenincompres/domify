# Domify
by Lenin Compres

The *domify* function creates DOM elements from a provided JS object. It returns the container element created.

```javascript
domify({
  header: {
    h1: 'A Domified Page'
  },
  main: {
    article: {
      h2: 'Basic domified object',
      p: 'This <b>is</b> a paragraph.'
    }
  },
  footer: {
    p: 'Made with domify'
  }
});
```
This DOM structure will be appended to the *body* inside a *main* tag. You may specify the tag for the container element, and the parent where it should go by passing them as following arguments.

```javascript
domify({
  h2: 'Basic domified object',
  p: 'This <b>is</b> a paragraph.'
}, 'div', someElement);
```

Unless indicated, the element will default to a *main* tag, and appended to the *body element*.
If an element is passed as a second argument, *domify* will replace its content with the domified object.

## Attributes

Set element attributes preciding a prop name with underscore (\_). 
* Giving an id to an element, creates the element variable in the window.
* You may use *_html* for *_innerHTML* and *_text* for *_innerText*.
* Assign event handlers using their names as properties (*onclick*, *onblur*, etc.).

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
   _text : 'Go',
   _class: 'good pill',
   onclick: e => inputator.value = 'Button pressed'
 }
});

inputator.style.border = 'none';
```

You may assign id\'s in the property\'s name by separating it from the tag with an underscore (\_).
You may passed *Style* an object and *classes* as an array of strings.

```javascript
domify({
 input_inputator: {
    _style: {
      color: 'blue',
      backgroundColor: 'yellow'
    }
 },
 button: {
   _text : 'Press',
    _class: ['good', 'pill'],
   onclick: e => inputator.value = 'Button pressed'
 }
});
```

classes may also be passed un the property name after the id, by separating them with underscores (\_).
Use double underscores to omit an id and still indicate a classes.

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
* Giving the array an id creates an array of elements on the window.

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

Use *_bind* to turn the created element into a Bind element, which essentially reduces is to a *value*. The value is linked to the *innerText* property of the element, or *value* for input type elements.
* The Bind object has an *element* property which holds the element.

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

console.log(thing.element);
```
You may specify that the value is numeric setting the *_numeric* to true.
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

You may bind a different property of the element, instead of the default *innerText* or *value*.
This property may be within another.

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
* It defaults to *true*.

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

The false and true values of a binary bind can be mapped by giving it an array.
* You may change the default value.

```javascript
domify({
  p_thing: {
    _text: 'Now you see me.',
    _bind: 'style.display',
    _binary: ['none', 'block'],
    _default: false
  },
  button: {
    _text: 'Toggle',
    onclick: e => thing.value = !thing.value
  }
});
```

You may also map the binary values using *_true* and *_false* props instead of *_binary*.

```javascript
domify({
  p_thing: {
    _text: 'Now you see me.',
    _bind: 'style.display',
    _true: 'block',
    _false: 'none'
  },
  button: {
    _text: 'Toggle',
    onclick: e => thing.value = !thing.value
  }
});
```

## Have fun!
