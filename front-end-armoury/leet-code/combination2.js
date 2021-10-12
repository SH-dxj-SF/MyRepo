/**
 * 有重复元素的组合，不能有重复的组合
 * @param {string} str
 * @returns {string[]}
 */
function combination(str) {
  const charArr = str.split('');
  const result = [];

  charArr.sort();

  function dfs(selected, trace) {
    if (selected.length > 0) {
      result.push(selected.join(''));
    }

    for (let i = 0, length = trace.length; i < length; ++i) {
      if (i > 0 && trace[i - 1] === trace[i]) {
        continue;
      }
      selected.push(trace[i]);
      dfs(selected, trace.slice(i + 1));
      selected.pop();
    }
  }

  dfs([], charArr);

  return result;
}

const str = 'bcb';

console.log(combination(str));

module.exports = {
  combination,
};
