 var domifyBind = (elem, model) => {
  if (model._binary === true) model._binary = [false, true];
  let prop = model.onvalue ? (model._bind ? model._bind : true) : false;
  let type = model._true !== undefined ? [model._false, model._true] : (model._binary ? model._binary : model._numeric);
  return new Bind(elem, prop, model.onvalue, type, model._default);
}
class Bind {
  constructor(elem, prop, onvalue = () => null, type, value) {
    this.elem = elem;
    let [_false, _true] = Array.isArray(type) ? type : [false, false];
    let isNum = onvalue === true || type === true;
    if (typeof prop === 'function') onvalue = prop;
    if (typeof prop !== 'string') prop = elem.value === undefined ? 'innerText' : 'value';
    if (prop === 'value') elem.onchange = e => eval(`this.value = '${elem.value}'`); // when value changes
    prop = `elem['${prop.split('.').join("']['")}']`; //prop for eval
    this.onvalue = onvalue;
    this._onvalue = val => {
      if (_true) this._value = val ? _true : _false;
      else this._value = isNum ? Number(val) : val;
      eval('this.' + prop + ' = this._value');
      if (_true) this._value = val;
      this.onvalue(this._value);
    };
    this._onvalue(value !== undefined ? value : _true ? true : eval(prop));
  }
  set value(val) {
    this._onvalue(val);
  }
  get value() {
    return this._value;
  }
}
