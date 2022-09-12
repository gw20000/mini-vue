//get DOM 
const num1 = document.querySelector('.num1'),
    num2 = document.querySelector('.num2'),
    num22 = document.querySelector('.num22'),
    num3 = document.querySelector('.num3'),
    sum1 = document.querySelector('.sum1'),
    sum2 = document.querySelector('.sum2'),
    title = document.querySelector('.app>.title'),
    submit = document.querySelector('.submit')
//bind event
const eventHanders = {
    num1: (e) => proxy2.num1 = +e.target.value,
    num2: (e) => proxy2.num2 = +e.target.value,
    num22: (e) => proxy2.num2 = +e.target.value,
    num3: (e) => proxy2.num3 = +e.target.value,
    submit: () => console.log(data)
};
(function () {
    num1.addEventListener('input', eventHanders.num1)
    num2.addEventListener('input', eventHanders.num2)
    num22.addEventListener('input', eventHanders.num2)
    num3.addEventListener('input', eventHanders.num3)
    submit.addEventListener('click', eventHanders.submit)
})();

console.log(num1, num2, num3, sum1, sum2)

const data = {
    num1: 1,
    num2: 2,
    num3: 3,
    title: 'KKK 的 mini-vue'
}

//响应式API ： 数据响应式处理（/定义数据劫持）， 读取数据时，记录依赖 ， 数据改变时，触发依赖（ getter里面记录依赖 ， setter里面触发依赖） 
const reactive = (target, handler) => {

    return new Proxy(target, handler)

}






// const handler1 = {

//     get(t, k, r) {

//         return Reflect.get(...arguments)

//     },
//     set(t, k, v, r) {
//         Reflect.set(...arguments)
//     },
//     deleteProperty(t, k) {
//         Reflect.defineProperty(...arguments)
//     }
// }

let dep = {} //记录依赖的容器
const recordWatcher = (k, fn) => {

    if (Array.isArray(dep[k])) { if (!dep[k].includes(fn)) dep[k].push(fn) }
    else dep[k] = [fn]
    console.log('dep:', dep)
}


let fn
const $nextTick = fn => Promise.resolve().then(() => fn()) // 异步队列更新

const handler2 = {

    get(t, k, r) {

        recordWatcher(k, fn) // 记录依赖(记录订阅者/记录谁用到我)

        return Reflect.get(t, k)

    },
    set(t, k, v, r) {

        Reflect.set(t, k, v)
        if (dep[k]) {
            dep[k].forEach(fn => $nextTick(fn))  // 触发依赖 
        }
    },
    deleteProperty(t, k) {
        Reflect.deleteProperty(...arguments)
    },
    defineProperty(t, k) {
        Reflect.defineProperty(...arguments)
    }
}

// const proxy1 = reactive(data, handler1)
const proxy2 = reactive(data, handler2)  // 响应式处理  （定义拦截哪些操作 和 如何重定义拦截操作）

//取消依赖
const clearDep = (render) => {
    Object.keys(dep).forEach(k => {
        dep[k].filter(fn => fn != render)
    })
}


const render = () => {
    //这里应该是 diff更新 ，没有做diff ： 直接更新 ，重新记录依赖，因为每一次渲染依赖的数据可能不一样（之前记录的依赖丢弃掉/取消掉之前记录的依赖,重新记录依赖）
    clearDep(render)
    fn = render
    console.log("render")
    num1.value = proxy2.num1
    num2.value = proxy2.num2
    sum1.innerHTML = proxy2.num1 + proxy2.num2
}

const render2 = () => {
    //这里应该是 diff更新 ，没有做diff：直接更新 ，重新记录依赖，因为每一次渲染依赖的数据可能不一样（之前记录的依赖丢弃掉/取消掉之前记录的依赖，重新记录依赖）
    clearDep(render2)
    fn = render2
    console.log("render2")
    num22.value = proxy2.num2
    num3.value = proxy2.num3
    sum2.innerHTML = proxy2.num2 + proxy2.num3
}

const renderApp = () => {
    //这里应该是 diff更新 ，没有做diff :  直接更新 ，重新记录依赖，因为每一次渲染依赖的数据可能不一样（之前记录的依赖丢弃掉/取消掉之前记录的依赖，重新记录依赖）
    clearDep(renderApp)
    fn = renderApp
    console.log('renderApp')
    title.innerHTML = proxy2.title
    render()
    render2()
}

const init = () => {
    renderApp()

}

init()
