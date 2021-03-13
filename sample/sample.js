// If not called as an element's method, domify assumes the document.body element.

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
        minWidth: '6em',
        onclick: doToggle
      },
    },
    article: {
      id: 'infoArt',
      margin: '2em',
      p: 'Content:',
      ul : {
        li_list : [
          'You may do',
          {
            span: 'the ',
            a: {
              text: 'toggle',
              onclick: doToggle
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
  }
});


// You can domify the head element

document.head.domify({
  title: 'A domify example',
  meta: {
    charset: 'UTF-8'
  }, 
  style: {
    'a, button': {
      cursor: 'pointer',
      color: 'blue',
    } ,
    a: {
      textDecoration: 'underline'
    }
  }
});


/* --------------------
event handling method 
------------------------ */

let showing;

function doToggle() {
  showing = !showing;
  
  // domify can change a simple single value
  infoArt.domify(showing ? 'block' : 'none', 'display');
  
  // modify is domify
  toggleBtn.modify({
    innerText: showing ? 'Hide' : 'Show',
    background: showing ? 'lavender' : 'royalblue',
    color: showing ? 'royalblue' : 'white'
  });
  
}

doToggle();
