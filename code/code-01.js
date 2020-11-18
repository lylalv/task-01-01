//一、将下面异步代码使用Promise的方法改进 
setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
        var b = 'lagou'
        setTimeout(function () {
            var c = 'I ♥️ U'
            console.log(a + b + c);
        }, 10)
    }, 10)
}, 10)

//改进
var a, b, c;
const promise1 = new Promise((resolve, reject) => {
    resolve();
});
promise1.then(() => {
        setTimeout(() => {
            a = 'hello'
        }, 10)
    })
    .then(() => {
        setTimeout(() => {
            b = 'lagou'
        }, 10)
    })
    .then(() => {
        setTimeout(() => {
            c = 'I ♥️ U';
            console.log(a + b + c)
        }, 10)
    })