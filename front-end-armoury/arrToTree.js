function arrToTree(origin) {
  const arr = [];
  const result = [];
  const map = {};

  origin.forEach((item, index) => {
    // arr.push(Object.assign({}, item));
    arr.push({ ...item }); // 浅拷贝数据
    map[item.id] = arr[index];
  });

  arr.forEach((item) => {
    if (item.parent) {
      const p = map[item.parent];
      if (p) {
        if (!p.children) {
          p.children = [];
        }
        p.children.push(item);
      }
    } else {
      result.push(item);
    }
  });

  return result;
}

const testArr = [
  { id: 2, content: 'CORS', parent: 1 },
  { id: 3, content: 'Axios', parent: 1 },
  { id: 5, content: '~', parent: 6 },
  { id: 1, content: 'jscontext' },
  { id: 6, content: 'Event Loop' },
  { id: 9, content: 'webpack/rollup', parent: 5 },
  { id: 7, content: 'Serverless', parent: 3 },
];

module.exports = { arrToTree, testArr };
