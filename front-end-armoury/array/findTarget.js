/**
 * 给定一个整数数组nums和一个整数目标值target
 * 在该数组中找出和为目标值target的那两个整数，并返回它们的数组下标。
 * O(n)复杂度实现
 * @param {number[]} nums
 * @param {number[]} target
 * @returns
 */
function findTarget(nums, target) {
  const map = {};

  for (let i = 0; i < nums.length; ++i) {
    // map差值检查
    if (map[target - nums[i]] !== undefined) {
      return [map[target - nums[i]], i];
    }
    map[nums[i]] = i;
  }

  return [];
}

module.exports = {
  findTarget,
};
