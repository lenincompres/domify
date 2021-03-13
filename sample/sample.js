/*-------------
  DOM structure
  -------------*/

domify({ 
  background: 'gray',
  font: '13px tahoma',
  padding: '1em',
  main: {
    background: 'silver',
    width: '100%',
    maxWidth: '30em',
    margin: '0 auto',
    header: {
      background: '#fff',
      padding: '0.2em 2em 1em',
      h1: 'Domify <i>Simple Sample</i>',
      button: {
        id: 'toggleBtn',
        text: 'Hide',
        onclick: e => doToggle(false)
      },
    },
    article: {
      id: 'infoArt',
      margin: '2em',
      p: 'Content:',
      ul : {
        marginLeft: '1.5em',
        li_list : [
          'You may do',
          {
            span: 'the ',
            a: {
              text: 'toggle',
              onclick: e => doToggle(false)
            }
          },
          'for this section'
        ]
      }
    },
    footer: {
      padding: '0.5em 1em',
      backgroundColor: 'black',
      color: 'white',
      text: 'Lenin Comprés'
    }
  },
});
// Unless called as an element's method, domify assumes the document.body element.

// You can domify the head element
document.head.domify({
  title: 'A Domify Simple Sample',
  meta: {
    charset: 'UTF-8'
  }, 
  style: {
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border',
    },
    'a, button': {
      cursor: 'pointer',
      color: 'blue',
    } ,
    a: {
      textDecoration: 'underline'
    },
    button: {
      minWidth: '6em',
    },
    'h1, p': {
      margin: '0.5em 0'
    }
  }
});


/*----------------------
  Event Handling Methods
  ----------------------*/

function doToggle(show) {
  // domify can change simple single values
  infoArt.domify(show ? 'block' : 'none', 'display');
  
  // modify is domify
  toggleBtn.modify({
    innerText: show ? 'Hide' : 'Show',
    background: show ? 'lavender' : 'royalblue',
    color: show ? 'royalblue' : 'white',
    onclick: e => doToggle(!show)
  });
}

doToggle(true);
