/*
1、Promise 就是一个类 在执行类的时候 需要传递一个执行器 执行器会立即执行
2、Promise 有三种状态 分别为 成功:fulfilled 失败:rejected 等待:pedding
3、resolve和reject函数用来更改状态
4、then 方法内部判断状态 如果状态成功 调用成功的回调函数 如果状态失败 调用失败的回调函数 定义在原型对象当中的方法
5、实现异步逻辑
6、实现then方法多次调用
7、实现then方法的链式调用  
8、处理错误
9、静态all 方法 race方法 resolve方法 reject方法 
10、 finally方法 catch方法 （原型对象上）
*/
const PENDING = 'pending'; //等待
const FULFILED = 'fulfilled'; //成功
const REJECTED = 'rejected'; //失败

//创建类
class MyPromise {
    //通过构造函数接收执行器 执行器立即执行 执行器指回调函数
    constructor(executor) {
        //尝试执行执行器
        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            //捕获执行器错误
            this.reject(e)
        }
    }

    //状态
    status = PENDING;
    //成功之后的值
    value = undefined;
    //失败之后的值
    reason = undefined;
    //成功回调函数 队列
    successCallback = [];
    //失败回调函数 队列
    failCallback = [];
    //属性 使用箭头函数（this 指向类定义的实例）
    resolve = value => {
        //如果状态不是等待 阻止程序向下执行
        if (this.status !== PENDING) return;
        //将状态更改为成功
        this.status = FULFILED;
        //保存成功之后的值
        this.value = value;
        //如果存在成功回调就调用成功回调函数
        //数组长度不为0的时候调用函数 每执行一个回调函数 删除一个函数
        while (this.successCallback.length) this.successCallback.shift()()
    }
    //属性
    reject = reason => {
        //如果状态不是等待 阻止程序向下执行
        if (this.status !== PENDING) return;
        //将状态更改为成功
        this.status = REJECTED;
        //保存失败后的原因
        this.reason = reason
        //如果失败回调函数存在就调用失败回调函数
        // 数组长度不为0的时候调用函数 每执行一个回调函数 删除一个函数
        while (this.failCallback.length) this.failCallback.shift()()
    }
    then(successCallback, failCallback) {
        //判断是否有回调函数
        successCallback = successCallback ? successCallback : value => value;
        failCallback = failCallback ? failCallback : reason => {
            throw reason
        }
        //每一个then方法都应该要返回promise对象
        let promise2 = new MyPromise((resolve, reject) => {
            //判断状态 
            //同步情况
            if (this.status === FULFILED) {
                //异步
                setTimeout(() => {
                    try {
                        //将上一个回调函数的返回值传递给下一个回调函数
                        let x = successCallback(this.value)
                        //返回的是promise对象 先查看promise对象返回的结果
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) { //将错误信息传递给下一个promise对象
                        reject(e)
                    }
                }, 0)
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        //将上一个回调函数的返回值传递给下一个回调函数
                        let x = failCallback(this.reason)
                        //返回的是promise对象 先查看promise对象返回的结果
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) { //将错误信息传递给下一个promise对象
                        reject(e)
                    }
                }, 0)
            } else {
                //异步情况
                //将成功回调和失败回调存储起来
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                });
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                });
            }
        })
        return promise2

    }
    //不管promise对象最后状态如何 都会执行的操作
    finally(callback) {
        return this.then(
            value => MyPromise.resolve(callback()).then(() => value),
            reason => MyPromise.resolve(callback()).then(() => {
                throw reason
            })
        );
    }
    // 添加catch方法 (不传递失败回调)
    catch (failCallback) {
        //不传递成功回调
        return this.then(undefined, failCallback)
    }
    // 添加静态all方法 
    static all(list) {
        return new MyPromise((resolve, reject) => { //传递执行器
            //返回值的集合
            let result = []
            let count = 0;

            function addData(key, value) {
                result[key] = value;
                count++;
                //所有异步操作执行完成
                if (count === list.length) {
                    resolve(result)
                }
            }
            for (let i = 0; i < list.length; i++) {
                let current = list[i];

                if (current instanceof MyPromise) { //promise 对象
                    current.then(value => addData(i, value), reason => reject(reason))
                } else { //普通值
                    addData(i, list[i])
                }
            }

        })
    }
    // 添加静态race方法
    static race(list) {
        return new MyPromise((resolve, reject) => {
            for (let p of list) {
                // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
                this.resolve(p).then(res => {
                    resolve(res)
                }, err => {
                    reject(err)
                })
            }
        })
    }
    // 添加静态resolve方法
    static resolve(value) {
        // 如果参数是MyPromise实例，直接返回这个实例
        if (value instanceof MyPromise) return value
        //如果不是就创建一个promise 传递一个执行器 返回value
        return new MyPromise(resolve => resolve(value))
    }
    // 添加静态reject方法
    static reject(value) {
        return new MyPromise((resolve, reject) => reject(value))
    }
}

//解析返回的promise
function resolvePromise(promise2, x, resolve, reject) {
    //自身返回
    if (x === promise2) {
        //返回错误 并阻止程序向下执行
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (x instanceof MyPromise) {
        //promise 对象
        x.then(resolve, reject)
    } else {
        //返回普通值直接调用resolve
        resolve(x)
    }
}
modules.exports = MyPromise;