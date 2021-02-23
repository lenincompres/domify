# domify
by Lenin Compres

The *domify* function creates DOM elements from a provided JS object

 ## Domify tips:
 - Elements can be named: *tag_id_class1_class2*
 - If no tag is given *div* is assumed.
 - *id* becomes the name of the object in the dom object: *dom.id*
 - Create several objects of the same tag with an array: *{ li: [...], ...}*
 - CamelCase classes and ids get turned into dashed-names in the HTML
 - Properties that start with undercore (_) are attributes
 - Event handlers are reserve words; can be set to a function: *onclick*, *onselect*, etc.
