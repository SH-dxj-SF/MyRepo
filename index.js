const debounce = require('./front-end-armoury/debounce');
const throttle = require('./front-end-armoury/throttle');
const cloneDeep = require('./front-end-armoury/cloneDeep');
const eventEmitter = require('./front-end-armoury/eventEmitter');
const { LRU_ES5, LRU_ES6 } = require('./front-end-armoury/least-recently-used');
const {
  postorderTraversal,
  levelTraversal,
  zigzagTraversal,
  // testTree,
} = require('./front-end-armoury/binary-tree');
const {
  find,
  flatFakeR,
  flatFakeI,
  flattenDeepR,
  flattenDeepI,
  mapFake,
  // testArrForFlat,
} = require('./front-end-armoury/array');

// const lru = new LRU_ES5(3);
// console.log(lru);

// const resultPostorder = postorderTraversal(testTree);
// const resultLevel = levelTraversal(testTree);
// const resultZigzag = zigzagTraversal(testTree);
// console.log(resultPostorder, resultLevel, resultZigzag);

// Array.prototype.flattenDeepR = flattenDeepR;
// Array.prototype.flattenDeepI = flattenDeepI;
// const result = testArrForFlat.flattenDeepR();
// const result3 = testArrForFlat.flattenDeepI();
// console.log(result, result3);

module.exports = {
  LRU_ES5,
  LRU_ES6,
  // 二叉树
  postorderTraversal,
  levelTraversal,
  zigzagTraversal,
  // 防抖节流
  debounce,
  throttle,
  // 数组
  find,
  flatFakeR,
  flatFakeI,
  flattenDeepR,
  flattenDeepI,
  mapFake,
  //
  cloneDeep,
  eventEmitter,
};

/** ******************第 1 题********************* */

/** ******************第 2 题********************* */

/** *******************第 3 题**********************

/** *******************第 4 题**********************
    实现一个函数，从第一个参数，整数数组中，找到所有的组合, 并按照数组的长度有小到大的顺序
    使得每个数组相加的值都等于第二个参数的值
    输入[1,2,3,4,5], 6    -> 输出 [[1,5], [2,4]]
    输入[1,3], 6    -> 输出 []
*/
function getAllArrays(array, value) {
  /**
   * 此处写代码逻辑
   */

  const temp = array.concat();
  temp.sort((a, b) => {
    return a - b;
  });

  const result = [];
  let left = 0;
  let right = temp.length - 1;

  while (left < right) {
    const valueL = temp[left];
    const valueR = temp[right];
    const sum = valueL + valueR;

    if (sum === value) {
      result.push([valueL, valueR]);
      left++;
      right--;
    } else if (sum > value) {
      right--;
    } else {
      left++;
    }
  }

  return result;
}
