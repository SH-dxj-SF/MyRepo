/**
 * 组合总和
 * 给定一个无重复元素的正整数数组candidates和一个正整数target，找出candidates中所有可以使数字和为目标数target的唯一组合。
 * candidates中的数字可以无限制重复被选取。
 * https://leetcode-cn.com/problems/combination-sum/
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */

function combinationSum(candidates, target) {
  if (candidates.length < 1) {
    return [];
  }

  const result = [];

  const dfs = (selected, trace, sum) => {
    if (sum > target) {
      return;
    }

    if (sum === target) {
      result.push(selected.concat());
      return;
    }

    for (let i = 0; i < trace.length; ++i) {
      selected.push(trace[i]);
      // 可以重复选择同时又因为是组合，所以：trace.slice(i)。不能再使用之前的数字，但是可以使用自身
      dfs(selected, trace.slice(i), sum + trace[i]);
      selected.pop(); // 回溯
    }
  };

  dfs([], candidates, 0);

  return result;
}

//  示例1：
//  输入: candidates = [2,3,6,7], target = 7
//  输出: [[7],[2,2,3]]

//  示例2：
//  输入: candidates = [2,3,5], target = 8
//  输出: [[2,2,2,2],[2,3,3],[3,5]]

//  示例 3：
//  输入: candidates = [2], target = 1
//  输出: []

//  示例 4：
//  输入: candidates = [1], target = 1
//  输出: [[1]]

//  示例 5：
//  输入: candidates = [1], target = 2
//  输出: [[1,1]]

module.exports = combinationSum;
