import logger from 'decorators/logger';

class Foo {
  @logger
  method(argument) {
    return argument;
  }
}

export default new Foo();