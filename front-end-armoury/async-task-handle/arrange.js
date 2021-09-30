// 实现一个 arrange 函数，可以进行时间和工作调度
// [ > … ] 表示调用函数后的打印内容

// arrange('William').execute();
// > William is notified

// arrange('William').do('commit').execute();
// > William is notified
// > Start to commit

// arrange('William').wait(5).do('commit').execute();
// > William is notified
// 等待 5 秒
// > Start to commit

// arrange('William').waitFirst(5).do('push').execute();
// 等待 5 秒
// > William is notified
// > Start to push

class Arrange {
  constructor(n) {
    this.name = n;
    this.running = false;

    this.tasks = [
      () => {
        return new Promise((resolve) => {
          console.log(`${this.name} is notified`);
          resolve();
        });
      },
    ];
  }

  waitFirst(second) {
    return this.wait(second, { first: true });
  }

  wait(second, options = { first: false }) {
    const method = options.first ? 'unshift' : 'push';
    this.tasks[method](() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          return resolve();
        }, second * 1000);
      });
    });

    return this;
  }

  do(thing) {
    this.tasks.push(() => {
      return new Promise((resolve) => {
        console.log(`Start to ${thing}`);
        return resolve();
      });
    });
    return this;
  }

  execute() {
    if (this.running) {
      return this;
    }

    if (this.tasks.length > 0) {
      this.running = true;
      const curTask = this.tasks.shift();
      curTask().then(() => {
        this.running = false;
        this.execute();
      });
    }

    return this;
  }
}

function arrange(name) {
  return new Arrange(name);
}

// console.log('sssssssss');

// const a = new Arrange('William');
// a.waitFirst(2).do('push');
// a.execute();
// a.wait(1);
// a.do('commit').wait(2).do('finish');
// a.execute();

// console.log('eeeeeeeee');

module.exports = Arrange;

// 实现一个 EatMan，自执行，无需显示调用execute方法
// 说明:实现一个 EatMan，EatMan 可以有以下一些行为
// 示例:
// 1.EatMan('Han') 输出
// Hi This is Hank!
// 2.EatMan('Hank').eat('dinner').eat('supper') 输出
// Hi This is Hank!
// Eat dinner~
// Eat supper~
// 3.EatMan('Hank').eat('dinner').eatFirst('lunch') 输出
// Eat lunch
// Hi This is Hank!
// Eat supper~
// 4.EatMan('Hank').eat('dinner').eatFirst('lunch').eatFirst('breakfast') 输出
// Eat breakfast~
// Eat lunch~
// Hi This is Hank!
// Eat supper~
function EatMan(name) {
  const obj = {
    name,
    funcs: [],
  };

  obj.funcs.push(() => {
    console.log(`Hi this is ${obj.name}`);
    obj.execute();
  });

  obj.eat = function (type) {
    this.funcs.push(() => {
      console.log(`Eat ${type}~`);
      this.execute();
    });
    return this;
  };

  obj.eatFirst = function (type) {
    this.funcs.unshift(() => {
      console.log(`Eat ${type}~`);
      this.execute();
    });
    return this;
  };

  obj.execute = function () {
    if (this.funcs.length < 1) {
      return;
    }
    const cur = this.funcs.shift();
    cur();
  };

  setTimeout(() => {
    obj.execute();
  }, 0);

  return obj;
}

// console.log('sssssssss');
// EatMan('Han');
// EatMan('Hank').eat('dinner').eat('supper');
// EatMan('Hank').eat('dinner').eatFirst('lunch');
// EatMan('Hank').eat('dinner').eatFirst('lunch').eatFirst('breakfast');
// console.log('eeeeeeee');
