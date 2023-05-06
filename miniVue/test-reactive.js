// weakmap  key 为 对象，对象被销毁时 value也会被销毁
// Set() 去重

const data = {
  a: 1,
  b: 2,
};

let activeEffect;
function effect(fn) {
  activeEffect = fn;
  // 立即执行
  fn();
}

const reactiveMap = new WeakMap();

const obj = new Proxy(data, {
  get(target, key, receiver) {
    console.log(`get ${key}`);
    let depsMap = reactiveMap.get(target);
    if (!depsMap) {
      reactiveMap.set(target, (depsMap = new Map()));
    }
    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }
    deps.add(activeEffect);
    console.log("deps", deps);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, newValue, receiver) {
    console.log(`set ${key} ${newValue}`);
    Reflect.set(target, key, newValue, receiver);

    let depsMap = reactiveMap.get(target);
    if (!depsMap) {
      reactiveMap.set(target, (depsMap = new Map()));
    }
    let deps = depsMap.get(key) ?? new Set();

    deps.forEach((dep) => {
      dep();
    });
  },
});

/**
 * 立即执行 effect传入的函数fn
 * 触发 obj get 将 fn 收集到 a 的effect集合
 * obj.a = 123 触发 obj set 将 a 收集的effect集合全部执行
 *
 * get a
 * log 1
 * set a
 * get a
 * log 123
 */
// effect(() => {
//   console.log("log", obj.a);
// });
// obj.a = 123;

