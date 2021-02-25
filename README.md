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
      p: 'This DOM structure will end up in the BODY inside a MAIN tag.'
    }
  },
  footer: {
    p: 'Made with domify'
  }
});
```

You may specify the tag to use for the container element, and the parent where if should go.

```javascript
domify({
  header: {
    h1: 'A Domify Page'
  },
  main: {
    article: {
      h2: 'Specifying where to domify',
      p: 'Unless indicated if defaults to MAIN in the BODY.'
    }
  },
  footer: {
    p: 'Made with domify'
  }
}, 'div', parentElement);
```

If an element is passed as a second argument (instead of a string with the tag name), *domify* replaces the content of this element with the domified object.

## Attributes

Set element attributes preciding a prop name with underscore (_). You may use *_html* for *_innerHTML*, and *_text* for *_innerText*.

Assign functions to event handlers by using their names.

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

Giving an id to an element, creates the eleent variable in the window.

You may assign an id right on the prop name by separating the tag from the id with underscore (\_).

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

*Style* may be passed an object, and *class* as an array of strings.

```domify({
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

```domify({
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

```domify({
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
     p: 'Article 1 paragrapg'
   },
   {
     h2: 'Article 2 title',
     p: 'Article 2 paragrapg'
   }
  ]
});

things[1].style.backgroundColor = 'yellow';

```

Giving a array of elements an id creates the varuable as an array of elements on the window.

## Binding

...soon.
