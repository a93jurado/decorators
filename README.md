# @ Stage-2 decorators



Babel 7.1.0 finally arrives and it supports the new decorators proposal 🍾️. Decorators are currently at Stage 2 in TC39's process, indicating that the committee expects them to eventually be included in the standard JavaScript programming language. Even though the description should be as complete as possible, it can contain todos and placeholders. This proposal starts minimal, but more functionality should be added over time, so some things that are written here can be incomplete or may be change.

We are going to try it out by using the [`@babel/plugin-proposal-decorators`](https://babeljs.io/docs/en/babel-plugin-proposal-decorators) plugin 🎉.

## A Bit of History



Babel introduced decorators in version 5 but they were removed them in Babel 6 because the proposal was still in flux. In Babel 7.0.0, it was possible to use stage-1 decorator implementation defined by [Yehuda Katz]( https://github.com/wycats/javascript-decorators). Other personalities become co-authors of the proposal. So the decorator group, [TC39](<https://github.com/tc39/proposal-decorators>), has completely rewritten it, considering a redesign of the proposal as "static decorators".

Due syntax differences code will not work "just upgrading" from old version of decorators. For this reason, to facilitate the transition from stage-1 to stage-2 decorators  Babel introduced  the `legacy` flag to the `@babel/plugin-proposal-decorators` plugin, which only valid values was `true`. So during transpilate legacy decorators version was used. Since 7.1.0 version this flag is set to `false` by default.

![Proposals](https://imgs.xkcd.com/comics/standards.png)



## What has changed in the new proposal?

It may seem that they are similar, but the changes are important. The syntax for defining a decorator is completely different 😱️.

The old proposal allowed any JavaScript expressions to be used as the body of a decorator, so with stage-1 proposal this was valid:

```js
class SuperClass {
  @getDecorators().methods[name]
  foo() {}
}
```

The new proposal only allows dot property access (`foo.bar`) optionally with arguments at the end (`foo.bar()`).

```js
class MyClass {
  @decorator
  @dec(arg1, arg2)
  @namespace.decorator
  method() {}
}
```



## Let's start using the new decorators

![Hype ](https://images-na.ssl-images-amazon.com/images/I/716DYuCpNGL._SX425_.jpg)



At present, classes and members of classes decorators are supported. But once this core approach will be validated its functionality will extends to support decorating objects, parameters blocks and functions. See [NEXTBUILTINS.md](https://github.com/tc39/proposal-decorators/blob/master/NEXTBUILTINS.md#applying-built-in-decorators-to-other-syntactic-forms).

Decorators are actually nothing more than functions that return another function, and that are called with the appropriate details of the item being decorated.

Stage-2 decorators proposal aims developers to write their own decorators. For achieve that, there will be a set of built-in that serve as the basics. At the time of writing this article, we can find `@wrap`, `@register` y `@initialize.` 

`@wrap` is the one that can bring more value to our code, so it will be examined in more detail. It can be used on a method to pass the function through another function, so it is used to define another decorators in an easy way.



```js
class C {
  @wrap(f)
  method() { }
}

//Is roughly equivalent to:

class C {
  method() { }
}
C.prototype.method = f(C.prototype.method);

```

 A basic wrap decorator approach that works with methods, looks as follows:

```js
export default f => {
  return wrapped => {
    const { descriptor } = wrapped;
    const original = descriptor.value;

    descriptor.value = f(original);

    return { ...wrapped, descriptor };
  };
};
```

New decorators definitions differs from old proposal. Now decorator elements take an object which, other than changing the property descriptor, allows changing the key, the placement (`static`, `prototype` or `own`), and the kind (`field` or `method`) of the element. 

```js
Object [Descriptor] {
  kind: 'method',
  key: 'method',
  placement: 'prototype',
  descriptor:
   { value: [Function: method],
     writable: true,
     configurable: true,
     enumerable: false } }
```

Using this "crafted" `@wrap` decorator it is easier to develop another ones. For example, a decorator that logs with which parameters a method was called.

```js
import wrap from './wrap';

const loggerFunction = f => {
  const name = f.name;

  return function (...args) {
    console.log(`starting ${name} with arguments ${args.join(', ')}`);
    
    return f.call(this, ...args);
  };
};

export default wrap(loggerFunction);
```



Decorated function is passed as argument to decorator method, so developers can apply so much logic as they want before (or after) call to the "original" function.

To use `@wrap` in a class method, it can be use the `@` syntactic sugar, in the same way as the previous proposal.

```js
import logger from 'decorators/logger';

class Foo {
  @logger
  method(argument) {
    return argument;
  }
}
```

The stage-2 indicates that the wrap decorator can also be used on a class, but it is still undergoing changes. TC39  recommend continuing to use Babel "legacy" against stage-2 decorators because they face significant performance issues and they are not yet widely adopted. 

## 🤯️ What a mess! 🤯️

To use stage-2 decorators only add the `@babel/plugin-proposal-decorators` plugin to the .babelrc file, as follows:

```JSON
{
  "presets": ["@babel/preset-env"],
  "env": {},
  "plugins": [
    ["@babel/plugin-proposal-decorators",{ "decoratorsBeforeExport": true }],
    "@babel/plugin-proposal-class-properties"
  ]
}
```



## Real World Examples

Functional programming is already possible in Javascript, but it is much more difficult to apply this to the classes and their methods. The decorators allow to mitigate this behavior, allowing a clear syntax to apply wrappers around the pieces of code.

### React

HOC React components are good candidates to be used as decorators. These are simply components that are written as a function, and that only wrap around another component. So the next piece of code can be written with a decorator approach.

```javascript
class ReactComponent extends PureComponent {}
export default connect(mapStateToProps, mapDispatchToProps)(MyReactComponent);
```

```javascript
@connect(mapStateToProps, mapDispatchToProps)
export default class ReactComponent extends PureComponent {}
```

 