import wrap from './wrap';

const loggerFunction = f => {
  const name = f.name;

  return function test(...args) {
    console.log(`starting ${name} with arguments ${args.join(', ')}`);
    
    return f.call(this, ...args);
  };
};

export default wrap(loggerFunction);