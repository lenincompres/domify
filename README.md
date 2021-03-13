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
    id: 'myField',
    value: 'default',
    placeholder : 'Type value here',
    style: 'color: "blue"; background-color: "yellow"',
    onchange: e => console.log(myField.value)
  },
  button: {
    id: 'goBtn',
    text : 'Go',  // text or innerText, and html or innerHTML.
    class: 'good pill',
    onclick: e => myField.value = 'Button pressed'
  }
});

myField.style.border = 'none';
goBtn.click();
/* An element objects is created for every id given. */
```

Style may be assign as an object; and classes as an array

```javascript
domify({
  input: {
    id: myField,
    style: {
      color: 'blue',
      backgroundColor: 'yellow'
    }
  },
  button: {
    text : 'Go',
    class: ['good', 'pill'],
    onclick: e => myField.value = 'Button pressed'
  }
});
```

You may also change style variable directly.

```javascript
domify({
  input: {
    id: myField,
    color: 'blue',
    backgroundColor: 'yellow'
    value: 'content'
  }
  ...
});
```

### Words that could be interpreted as tags, attributes or styles

Style poperties like **border**, **color**, **height**, and **width** are treated as a css style, not attributes.

Words like **form**, **label**, **font**, **cite**, **style**, **title** and **span** are treated as tags if the content is a structural object, othewise they are attributes (or style in case of **font**). In the case of **span**, it is only an attribute for the *col* and *colgroup* tags.

Domify will not assign styles to the *document.head* which resolves **content** and **style** props. Also, **title** is always a tag in *document.head*.

## Document.head

You can domify the head element. It applies styles as CSS in the a *style* tag.

```javascript
document.head.domify({
  meta: {
    charset: 'UTF-8'
  },
  title: 'A domify example',
  style: 'a, button {cursor: pointer; color: navy}'
});
```
You may assign an object as the style. Use quotes for complex selectors and style values.

```javascript
document.head.domify({
  style: {
    'a, button, .link, link': {
      cursor: 'pointer',
      color: 'blue',
      textDecoration: 'underline'
    } 
  }
});
```

## Unique Property Names

You may  assign id\'s in the property name by separating it from the tag with an underscore (\_). Example: *div_mainField*.
If the name is not recognizable (as a tag, attribute or style), it is interpred as an id and assumed a div tag.

```javascript
domify({
  input_myField: {
    color: 'blue',
    backgroundColor: 'yellow'
  },
  goBtn: {
    tag: 'button',  // id and tag properties replace those interpreted from the name.
    text : 'Go',
    onclick: e => myField.value = 'Button pressed'
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
    text: 'Go',
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

## Have fun!
