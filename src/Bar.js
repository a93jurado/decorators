//import wrap from 'decorators/wrap';

/*@wrap(klass => {
  return {
    kind: klass.kind,
    elements: [
      ...klass.elements,
      {
        finisher() {
          console.log('hola');
        },
        kind: 'field',
        placement: 'static',
      }
    ],
    key: klass.key,
  };
})*/

function log(Class) {
  return (...args) => {
    console.log(`Arguments: ${args}`);

    return new Class(...args);
  };
}

@log
class Bar {
  constructor(name, age) { }
}


export default Bar;

