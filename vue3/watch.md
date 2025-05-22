### watch  https://blog.csdn.net/weixin_59233142/article/details/135507159
  watch <span style="color: red;">侦听一个或多个响应式数据源</span>并在其值发生改变时运行相应的回调函数
#### reactive
```
const a = reactive({ user: { name: 'zhangsan'， age: 18 } })

此时a返回的是，reactive 创建的 proxy 代理实例
```
  <span style="color: red;">watch 监听 的也是这个实例，而非地址</span>

 - deep: true  监听对象内部<span style="color: red;">所有</span>属性的变化
 - 不开启 deep: true  监听对象内部<span style="color: red;">第一层属性 user 的变化</span>

    解析:
    ```
        <template>
          <div>
            <button @click="replaceObject">Replace Object</button>
          </div>
        </template>

        <script setup>
        import { reactive, watch } from 'vue';

        const state = reactive({
          value: 'old'
        });

        watch(state, (newValue, oldValue) => {
          console.log('State has changed:', newValue, oldValue);
        });

        const replaceObject = () => {
          // 直接替换整个对象
          state = reactive({ value: 'new' }); 
        }
    ```
    