### 依赖注入
###### 逐级透传 祖父组件中使用一个，provide函数来提供数据，而子孙组件中使用inject来注入数据
 - provide 在setup中调用，provide的函数提供数据
 ```
  setup() {
      // 省略其他...
      provide('location', '北极')
      provide('geolocation', {
        longitude: 90,
        latitude: 135
      })
  }
 ```

 - inject 在setup中，调用inject获取provide提供的数据
 ```
  setup() {
    // 省略其他...
    const userLocation = inject('location', 'The Universe')
    const userGeolocation = inject('geolocation')
    
  }
 ```
  - inject 有两个参数，第一个是key，第二个是默认值，如果没有设置默认值，没有取到值就返回undefined



#### 为provide 添加响应式 
   - 指provide提供的数据发生变化时，inject使用数据的组件需要进行界面刷新
   - inject 的使用没有差别，但是如果使用inject的组件模板中用到provide提供的数据，则组件会及时进行UI刷新
   ```
    setup() {
        // 省略其他...
        provide('location', ref('北极'))
        provide('geolocation', reactive({
          longitude: 90,
          latitude: 135
        }))
    }
  ```
