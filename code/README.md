# 简答题答案以及说明
## 一、谈谈你是如何理解JS异步编程的，EventLoop、消息队列都是做什么的？ 什么是宏任务，什么是微任务？

1、Event Loop是一个程序结构，用于等待和发送消息和事件；
2、消息队列：主线程在执行过程中遇到了异步任务，就发起函数或者称为注册函数，通过Event Loop通知相应的工作线程，同时主线程继续往后执行，不会等待。等到工作线程完成了任务，Event Loop会将消息添加到消息队列中，如果此时调用栈为空，就执行消息队列中排在最前面的消息，依次执行。
3、宏任务：参与了事件循环的异步任务；
4、微任务：是在当前JS调用执行完了之后立刻执行的，是同步的。
# 代码题
## 一、将下面异步代码使用Promise的方法改进  
code-01.js 文件
## 二、基于以下代码完成下面的四个练习
code-02.js 文件
## 三、基于下面提供的代码完成后续的四个练习
code-03.js 文件
## 四、手写实现MyPromise 源码
myPromise.js 文件





