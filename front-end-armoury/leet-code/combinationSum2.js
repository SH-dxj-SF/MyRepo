/**
 * 组合总和
 * 给定一个数组candidates（含重复数字）和一个目标数target，找出candidates中所有可以使数字和为target的组合。
 * candidates中的每个数字在每个组合中只能使用一次。
 * 注意：解集不能包含重复的组合。
 * https://leetcode-cn.com/problems/combination-sum-ii
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */

function combinationSum2(candidates, target) {
  if (candidates.length < 1) {
    return [];
  }

  const temp = candidates.concat();
  temp.sort((a, b) => {
    return a - b;
  });

  const result = [];

  const dfs = (selected, trace, sum) => {
    if (sum > target) {
      return;
    }

    if (sum === target) {
      result.push(selected.concat());
    }

    for (let i = 0; i < trace.length; ++i) {
      if (i - 1 >= 0 && trace[i] === trace[i - 1]) {
        continue;
      }

      selected.push(trace[i]);

      dfs(selected, trace.slice(i + 1), trace[i] + sum);

      selected.pop();
    }
  };

  dfs([], temp, 0);

  return result;
}

// 示例1:
// 输入: candidates =[10,1,2,7,6,1,5], target =8,
// 输出:
// [
// [1,1,6],
// [1,2,5],
// [1,7],
// [2,6]
// ]

// 示例2:
// 输入: candidates =[2,5,2,1,2], target =5,
// 输出:
// [
// [1,2,2],
// [5]
// ]

module.exports = combinationSum2;
