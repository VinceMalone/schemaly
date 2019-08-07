export const flatten = (data, delimiter = '.') => {
  const output = {};

  const recurse = (value, keyPath = '') => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        recurse(item, `${keyPath}[${index}]`);
      });
    } else if (value != null && typeof value === 'object') {
      Object.entries(value).forEach(([key, item]) => {
        recurse(item, `${keyPath ? `${keyPath}${delimiter}` : ''}${key}`);
      });
    } else {
      output[keyPath] = value;
    }
  };

  recurse(data);

  return output;
};
