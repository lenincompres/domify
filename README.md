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
