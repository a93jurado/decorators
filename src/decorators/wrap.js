const wrap = f => {
  return wrapped => {
    const { kind } = wrapped;

    if (kind === 'class') {
      return f(wrapped);
    }
    const { descriptor } = wrapped;
    const original = descriptor.value;

    descriptor.value = f(original);

    return { ...wrapped, descriptor };
  };
};

export default wrap;