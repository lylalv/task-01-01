//基于下面的代码 完成后续的四个练习

//1、使用fp.add(x,y) 和fp.map(f,x) 创建一个能让functor里的值增加的函数ex1

const fp = require('lodash/fp')
const {
    Maybe,
    Container
} = require('./support')
let maybe = Maybe.of([5, 6, 1])
let ex1 = (num) => {
    return fp.map(fp.add(num), maybe._value)
}
//2、实现一个函数ex2，能够使用fp.first 获取列表的第一个元素
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => {
    return fp.first(xs._value)
}
//3、实现一个函数ex3,使用safeProp和fp.first 找到user 的名字和首字母
let safeProp = fp.curry(function (x, o) {
    return Maybe.of(o[x])
})
let user = {
    id: 2,
    name: "Albert"
}

let ex3 = () => {
    let userName = safeProp('name', user)._value //user的名字
    let first = fp.first(userName) // 首字母
    return {
        userName,
        first
    }
}
//4、使用Maybe重写ex4，不要有if语句
let ex4 = function (n) {
    if (n) {
        return parseInt(n)
    }
}
let _ex4 = (n) => {
    return new Maybe(parseInt(n))._value;
}