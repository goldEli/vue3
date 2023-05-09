# vue3
### custom-render 

自定义渲染

v-dom => custom render => 展示到页面上

脱离浏览器限制 
自定义custom render 可以将v-dom 渲染到小程序、canvas、three.js等

### mini vue3

三大模块

1. Reactivity Module
2. Compiler Module
3. Renderer Module

4. template 转 render 函数
5. render 函数执行返回 vNode
6. mount 阶段，将vNode 渲染到页面
7. patch 阶段，更新后，对比新旧 vNode，找出差异更新到页面上

##### complier

1. 代码 
2. token 
3. AST 
4. transform（语义分析和优化） 
5. generator

### mini vite

webpack 解析 js 中 require import 等语句，将对应依赖建立依赖map，基于不同的类型文件调用不同的loader，最终将代码打包整合。
但是但项目变大后，打包启动有时候会等几分种，热更新可能几秒，大大影响了开发效率

随着浏览器对es module的支持，社区出现了 no bundle 方案