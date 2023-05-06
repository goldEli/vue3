// weakmap  key 为 对象，对象被销毁时 value也会被销毁
// Set() 去重

const data = {
  a: 1,
  b: 2,
};

let activeEffect;
const effectStack = []
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn)
    fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1]
  };

  effectFn.deps = [];
  effectFn();
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

const reactiveMap = new WeakMap();

const obj = new Proxy(data, {
  get(target, key, receiver) {
    // console.log(`get ${key}`);
    let depsMap = reactiveMap.get(target);
    if (!depsMap) {
      reactiveMap.set(target, (depsMap = new Map()));
    }
    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }
    deps.add(activeEffect);

    activeEffect.deps.push(deps);
    // console.log("deps", deps);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, newValue, receiver) {
    // console.log(`set ${key} ${newValue}`);
    Reflect.set(target, key, newValue, receiver);

    let depsMap = reactiveMap.get(target);
    if (!depsMap) {
      reactiveMap.set(target, (depsMap = new Map()));
    }
    let deps = depsMap.get(key) ?? new Set();

    const effectsToRun = new Set(deps)


    effectsToRun.forEach((dep) => {
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

// effect(() => {
//   console.log(obj.a ? obj.b : "nothing");
// });
// obj.a = undefined;
// obj.b = 3;

// 嵌套
effect(() => {
  console.log('effect1');
  effect(() => {
      console.log('effect2');
      obj.b;
  });
  obj.a;
});
obj.a = 3;