//二、基于以下代码完成下面的四个练习
const fp = require('lodash/fp')
const cars = [{
        name: "Ferrari FF",
        horsepower: 660,
        dollar_value: 700000,
        in_stock: true
    },
    {
        name: "Spyker C12 Zagato",
        horsepower: 650,
        dollar_value: 648000,
        in_stock: false
    },
    {
        name: "Jaguar XKR-S",
        horsepower: 550,
        dollar_value: 1320000,
        in_stock: false
    },
    {
        name: "Audi R8",
        horsepower: 525,
        dollar_value: 114200,
        in_stock: false
    },
]
//1、使用函数组合fp.flowRight()重新实现下面的函数
// let isLastInStock = function (cars) {
//     let last_car = fp.last(cars)
//     return fp.prop('in_stock',last_car)
// }
const f = fp.flowRight(fp.prop('in_stock'), fp.last)
f(cars)

//2、使用fp.flowRight() fp.prop() fp.first() 获取第一个car的name
const firstName = fp.flowRight(fp.prop('name'), fp.first)
firstName(cars)

//3、 使用帮助函数 _average重构averageDollarValue，使用函数组合的方式实现
let _average = function (xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
}
// let averageDollarValue = function(cars){
//     let dollar_values = fp.map(function(car){
//         return car.dollar_value
//     },cars)
//     return _average(dollar_values)
// }

let _averageDollarValue = fp.flowRight(_average, fp.map(car => car.dollar_value))
_averageDollarValue(cars)

//4、使用flowRight写一个sinitizeNames()函数,返回一个下划线连接的小写字符串，把数组中name转换为这种形式
//例如 sinitizeNames(['Hello Word']) => ['hello_world']
let _underscore = fp.replace(/\W+/g, '_')
let sinitizeNames = (data) => {
    let f = fp.flowRight(fp.toLower, _underscore)
    return f(data)
}
let _cars = fp.map(item => {
    item.name = sinitizeNames(item.name)
    return item
}, cars)