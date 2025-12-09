### 跨组件通信使用对比差异

#### mitt

**事件触发是瞬时的，不会自动更新视图，需要手动管理状态**

- 注意：

  1.  proxy.mittBus.emit 在发送之后，如果 proxy.mittBus.on 事件未完成注册，会导致**事件丢失**，一直拿不到传输数据
      场景： 列表编辑，如果在弹出框里使用 proxy.mittBus.on ， 拿不到 rowData，因为 mitt 事件是瞬时的
  2.  组件销毁未解绑如果事件监听器未移除，回调函数会持续占用内存，**且可能因引用已销毁组件实例导致异常**

      ```
      onMounted(() => {
          emitter.on('update', handleUpdate);
      });

      onBeforeUnmount(() => {
          emitter.off('update', handleUpdate); // 必须移除
      });
      ```

      场景： 路由切换后，旧页面组件的事件仍在监听 ; 弹窗组件重复打开，事件监听器多次累积

  3.  容易有命名冲突问题，全局黑魔法，排查困难

#### provide inject 坑点总结

1.  provide 只在组件初始化的时候，执行一次，不会重新注入  
     **不能在事件点击，执行 provide**

2.  provide/inject 只在当前组件树有效，如果组件被移到另一个组件树（如动态插槽、Teleport），就会失效

    ```
    // 通过插槽移到另一棵树，inject 返回 undefined
    <template>
    <div>
        <slot :data="injectedData"/>
    </div>
    </template>
    ```

3.  需使用 ref/reactive 包装，否则也是非响应式
