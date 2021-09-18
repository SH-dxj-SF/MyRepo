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

console.log('sssssssss');

const a = new Arrange('William');
a.waitFirst(2).do('push');
a.execute();
a.wait(1);
a.do('commit').wait(2).do('finish');
a.execute();

console.log('eeeeeeeee');

module.exports = Arrange;
