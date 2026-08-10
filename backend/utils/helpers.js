function pick(object, keys) {
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) acc[key] = object[key];
    return acc;
  }, {});
}

function toCurrency(value) {
  return Number(value || 0).toFixed(2);
}

module.exports = { pick, toCurrency };
