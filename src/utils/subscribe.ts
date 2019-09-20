

export default function subscribe(listener, listeners) {
  if (typeof listener !== 'function') {
    throw new Error('Expected listener to be a function.');
  }

  let isSubscribed = true;
  listeners.push(listener);

  return function unsubscribe() {
    if (!isSubscribed) {
      return;
    }
    isSubscribed = false;

    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  }
}



type Status = 'PENDING' | 'FULFILLED' | 'REJECTED';

const isFunction = variable => typeof variable === 'function'

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class MyPromise {
  _status: Status
  _value: any
  _fulfilledQueues: any[]
  _rejectedQueues: any[]

  constructor(handle) {
    if (!isFunction(handle)) {
      throw new Error('promise must accept a function as a parameter');
    }

    this._status = PENDING;
    this._value = undefined;
    this._fulfilledQueues = [];
    this._rejectedQueues = [];

    try {
      handle(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
    }
  }

  _resolve(val) {
    if (this._status !== PENDING) {
      return;
    }
    const run = () => {
      this._status = FULFILLED;
      this._value = val;

      const runFulfilled = value => {
        let cb;
        while (cb = this._fulfilledQueues.shift()) {
          cb(value)
        }
      }

      const runRejected = error => {
        let cb;
        while (cb = this._rejectedQueues.shift()) {
          cb(error)
        }
      }

      if (val instanceof MyPromise) {
        val.then(value => {
          this._value = value;
          runFulfilled(value);
        }, error => {
          this._value = error;
          runRejected(error);
        })
      } else {
        this._value = val;
        runFulfilled(val);
      }
    }

    // 原生实现中，此处为微任务
    setTimeout(run);
  }

  _reject(error) {
    if (this._status !== PENDING) {
      return;
    }
    const run = () => {
      this._status = REJECTED;
      this._value = error;
      let cb;
      while (cb = this._rejectedQueues.shift()) {
        cb(error)
      }
    }

    // 原生实现中，此处为微任务
    setTimeout(run);
  }

  then(onFulfilled, onRejected) {
    const { _value, _status } = this;
    
    return new MyPromise((onFulfilledNext, onRejectedNext) => {

      const fulfilled = value => {
        try {
          if (!isFunction(onFulfilled)) {
            onFulfilledNext(value);
          } else {
            const res = onFulfilled(value);
            if (res instanceof MyPromise) {
              // 如果当前回调函数返回 MyPromise 对象，必须等待其状态改变后再执行下一个回调
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              onFulfilledNext(res);
            }
          }
        } catch (error) {
          onRejectedNext(error);
        }
      };

      // 封装一个失败时执行的函数
      const rejected = error => {
        try {
          if (!isFunction(onRejected)) {
            onRejectedNext(error);
          } else {
            const res = onRejected(error);
            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              onFulfilledNext(res);
            }
          }
        } catch (error) {
          onRejectedNext(error);
        }
      };

      switch (_status) {
        case PENDING:
          this._fulfilledQueues.push(fulfilled);
          this._rejectedQueues.push(rejected);
          break;
        case FULFILLED:
          fulfilled(_value);
          break;
        case REJECTED:
          rejected(_value);
          break;
        default:
          break;
      }


    })
  }

}




let p = new Promise((res, rej) => {
  setTimeout(() => {
    res(11)
  }, 1000);
})

const onFul1 = (data) => {
  console.log('onFul1:data', data);
  return 22
}
const onRej1 = (data) => {
  console.log('onRej1:data', data);
}

const onFul2 = (data) => {
  console.log('onFul2:data', data);
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(33)
    }, 500);
  })
}
const onRej2 = (data) => {
  console.log('onRej2:data', data);
}

const onFul3 = (data) => {
  console.log('onFul3:data', data);
  throw new Error('错误了');
  
}
const onRej3 = (data) => {
  console.log('onRej3:data', data);
}

p
  .then(onFul1, onRej1)
  .then(onFul2, onRej2)
  .then(onFul3, onRej3)
  .catch(e => {
    console.log('e', e);
  })