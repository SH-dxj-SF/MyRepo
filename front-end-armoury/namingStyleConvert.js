/**
 * 小写驼峰 => 下划线
 * @param {string} str
 * @returns {string}
 */
function lccToLsc(str) {
  const reg = /([A-Z])/g;
  return str.replace(reg, (match, capture1) => `_${capture1.toLowerCase()}`);
}

/**
 * 下划线 => 小写驼峰
 * @param {string} str
 * @returns {string}
 */
function lscToLcc(str) {
  const reg = /_(\w)/g;
  return str.replace(reg, (match, capture1) => capture1.toUpperCase());
}

/**
 * 将对象下划线风格的键名转换为下小写驼峰格式
 * @param {Object} obj
 * @returns {Object}
 */
function LSC2LCC(obj) {
  const result = {};

  Object.keys(obj).forEach((key) => {
    const keyNew = lscToLcc(key);

    if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
      result[keyNew] = LSC2LCC(obj[key]);
    } else {
      result[keyNew] = obj[key];
    }
  });

  return result;
}

const testObj = {
  my_name_is_obj: 'obj',
  age: 12,
  sex: 'female',
  sub_obj: {
    my_name_is_sub: 'sub',
    age: 10,
    sex: 'male',
  },
};

module.exports = {
  LSC2LCC,
  lscToLcc,
  lccToLsc,
  testObj,
};
