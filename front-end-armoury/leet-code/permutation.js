/**
 * 返回一个字符串（可能包含重复元素）的所有排列，不能有重复
 * @param {string} s
 * @return {string[]}
 */
function permutation(s) {
  const charArr = s.split('');
  const result = [];

  charArr.sort();

  const dfs = (selected, trace) => {
    if (trace.length < 1) {
      result.push(selected.join(''));
      return;
    }

    for (let i = 0; i < trace.length; ++i) {
      if (i > 0 && trace[i - 1] === trace[i]) {
        continue;
      }

      selected.push(trace[i]);
      dfs(selected, trace.slice(0, i).concat(trace.slice(i + 1)));
      selected.pop();
    }
  };

  dfs([], charArr);
  return result;
}

module.exports = {
  permutation,
};
