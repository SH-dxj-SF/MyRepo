/**
 * 二进制数转换为十进制，二进制小数部分不丢失
 * @param {Number} binaryNumber
 * @returns {Number}
 */
function binaryToDecimal(binaryNumber) {
  let [int, dec] = binaryNumber.toString().split('.');

  // Number.prototype.toString()用于将数字转换为字符串，可用于十进制 => 其他进制
  // parseInt()用于将字符串转换成数字，可用于其他进制 => 十进制
  int = parseInt(int, 2); // 整数部分，二进制 => 十进制

  if (dec) {
    // 小数部分
    const decItems = dec.split('');
    dec = decItems.reduce((pre, cur, index) => {
      return pre + cur * 2 ** -(index + 1); // x ** y === Math.pow(x, y)
    }, 0);
  } else {
    dec = 0;
  }

  return int + dec;
}

console.log(binaryToDecimal(111.111));

module.exports = binaryToDecimal;
