### setState

##### 同步 vs 异步

1. ###### 同步

- 原生事件 - 脱离 react 调度机制
  setTimeout Promise addEventListener,

2. ###### 异步

- 合成事件（onClick 等，事件委托机制，统一挂在到 root 组件，通过 Scheduler 调度系统实现批量更新）
- 生命周期里的 setState

#### 批量更新实现过程

1.
