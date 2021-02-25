# Domify
by Lenin Compres

## Basics

The *domify* function creates DOM elements from a provided JS object. It returns the container element created.

```javascript
domify({
  header: {
    h1: 'A Domify Page'
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
  header: {
    h1: 'A Domify Page'
  },
  main: {
    article: {
      h2: 'Specifying where to domify',
      p: 'This <b>is</b> a paragraph.'
    }
  },
  footer: {
    p: 'Made with domify'
  }
}, 'div', parentElement);
```
Unless indicated these defaults to *main* in the *body element* are the defaults.
If an element is passed as a second argument, *domify* will replace its content with the domified object.

## Attributes

Set element attributes preciding a prop name with underscore (\_). 
* You may use *_html* for *_innerHTML*, and *_text* for *_innerText*.
* Giving an id to an element, creates the element variable in the window.
* Event handlers mayb be assign using their names (*onclick*, *onblur*, etc.).

```javascript
domify({
 input: {
   _id: 'inputator',
   _value: 'default',
   _placeholder : 'Type value here',
   onchange: e => console.log(inputator.value)
 },
 button: {
   _id : 'buttonator',
   _text : 'Go',
   onclick: e => inputator.value = 'Go pressed'
 }
}, anElement);

buttonator.style.color = 'green';
```

You may assign ids on the prop name by separating it from the tag with an underscore (\_).

```javascript
domify({
 input_inputator: {
   _value: 'default',
   _placeholder : 'Type value here',
   _style: 'color: "blue"; background-color: "yellow"',
   onchange: e => console.log(inputator.value)
 },
 button_buttonator: {
   _text : 'Go',
   _class: 'good pill',
   onclick: e => inputator.value = 'Go pressed'
 }
}, anElement);

buttonator.style.color = 'green';
```

The *style* attributes may be passed an object, and *classes* as an array of strings.

```javascript
domify({
  p: {
    _html: 'The button <b>does</b> the <i>thing</i>.'
    _style: {
      color: 'blue',
      backgroundColor: 'yellow'
    }
  },
  button_doThing: {
    _text: 'Go',
    _class: ['good', 'pill']
  }
});
```
classes may also be passed un the prop name after the id, by separating them with underscores (\_). Use double underscores to omit an id and still indicate a classes.

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

Giving a array of elements an id creates the variable as an array of elements on the window.

## Binding

Use *_bind* to turn the created element into a Bind element. This essentially reduces is to on *value*. But default the bind is done to the *innerText* of the element or the *value* if it is an input type element.

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
```
You may specify that the value is numeric.
* The Bind object has an *element* property which holds the element.

```javascript
domify({
  p_thing: {
    _text: '1',
    _bind: true,
    _numeric: true
  },
  button: {
    _text: 'Add one',
    onclick: e => thing.value += 1
  }
});

console.log(thing.element);
```

You may bind a different attribute of the element. The may even be within attributes.

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

The value may be binary. Which defaults to the value being *true*.
* An *onvalue* handler is called everytime the value changes.

```javascript
domify({
  p_thing: {
    _bind: true,
    _binary: true,
    _onvalue: val => console.log(val)
  },
  button: {
    _text: 'Toggle',
    onclick: e => thing.value = !thing.value
  }
});
```

The false and true values of a binary bind can be mapped differently by giving it an array.
* You may also map the values using *_true* and *_false* props instead of *_binary*.
* You indicate the default value.

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
## Have fun!
