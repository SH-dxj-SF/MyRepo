// ['1.1.3','1.2','1.11.4'] => ['1.2', '1.11.4', '1.1.3']
/**
 * 使用字符串比较的特性，每一位进行比较，所以效果是：'1.2' 比 '1.11.4'更大
 * @param {*} versions
 * @returns
 */
function sortByString(versions) {
  versions.sort((a, b) => {
    return a < b ? 1 : -1;
  });
}

// 但是正常来说版本号 ‘1.11.4’要比'1.2'大
/**
 * 加权算法，子版本号存在大值的话可能会错误
 * @param {Array} versions
 */
function sortByWeight(versions) {
  const calcWeight = (arr) => {
    const w = 10000;

    return arr.reduce((pre, cur, index) => {
      return pre + Number(cur) * w ** -index;
    }, 0);
  };

  const funcSort = (versionA, versionB) => {
    const weightA = calcWeight(versionA.split('.'));
    const weightB = calcWeight(versionB.split('.'));

    return weightB - weightA;
  };

  versions.sort(funcSort);
}

/**
 * 按版本号各部分循环比较，相同则比较下一个部分
 * 比字符串比较和加权算法适用性更好
 * @param {*} versions
 */
function sortBySubVersion(versions) {
  versions.sort((a, b) => {
    const arrA = a.split('.');
    const arrB = b.split('.');

    let index = 0;
    while (true) {
      const partA = arrA[index];
      const partB = arrB[index];

      if (partA === undefined || partB === undefined) {
        // 子版本号数量不同，且前段子版本号相同，那么子版本号数量多的视为更大
        return arrB.length - arrA.length;
      }

      if (partA === partB) {
        // 该子版本号相同，则比较下一个字版本号
        index++;
        continue;
      }

      // 该部分不相同则已经可以得出结果
      return partB - partA;
    }
  });
}

const versions = [
  '0.5.1',
  '0.1.1',
  '2.3.3',
  '0.302.1',
  '4.2',
  '4.3.5',
  '4.3.4.5',
];

const versions2 = ['1.1.30000', '1.2', '1.2.0', '1.2.0.1'];

sortBySubVersion(versions);
sortBySubVersion(versions2);
console.log(versions);
console.log(versions2);
