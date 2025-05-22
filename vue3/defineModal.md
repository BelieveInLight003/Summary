### defineModal  实现父子组件通信的双向绑定

###### 父组件代码
`
  <template>
    <CommonInput v-model="inputValue" />
  </template>

  <script setup lang="ts">
  import { ref } from "vue";

  const inputValue = ref();
  </script>

`

###### 子组件代码
`
<template>
  <input v-model="model" />
</template>

<script setup lang="ts">
  const model = defineModel();
  model.value = "xxx";
</script>

`

###### defineModel 的实现
  实际上是在子组件内，封装了一些繁琐的逻辑，将父子组件通信变量的细节，隐藏起来，方便快捷
  
  子组实现代码，简略版本如下
`
  <template>
    <input v-model="model" />
  </template>

  <script setup lang="ts">
    import { ref, watch } from "vue";

    const props = defineProps(["modelValue"]);
    const emit = defineEmits(["update:modelValue"]);
    const model = ref();

    watch(
      () => props.modelValue,
      () => {
        model.value = props.modelValue;
      }
    );
    watch(model, () => {
      emit("update:modelValue", model.value);
    });
  </script>

`


###### defineModel 定义type 和 default

` 
  const model = defineModel({ type: String, default: "20" });
`

###### 实现多个defineModal
  父组件
`
   <template>
    <div>
      <ChildMy v-model:count="count" v-model:person="person" />
      {{ person }} - {{ count }}
    </div>
  </template>

  <script setup>
    import ChildMy from './components/child.vue'
    import { ref,reactive  } from 'vue'
    const count = ref(1)
    const person = reactive ({
        name: 'Lucy',
        age: 11
      })
  </script>


`

   子组件
`
  <template>
    <div>
        {{ person }} - {{ count }}
        <button @click="updatedData">child btn</button>
    </div>
  </template>

  <script setup>
    const person = defineModel("person")
    const count = defineModel("count")

    const updatedData = () => {
        count.value ++
        person.value.age = 22
        person.value.name = "lilei"
    }
  </script>

`


##### 自定义 defineModal 实现
`
  <!-- vue3.4用法 -->
  <template>
    <input v-model="model" />
    <input v-model="content" />
    {{ model }}--{{ content }}
  </template>

  <script setup>
    const [model, modifiers] = defineModel({
      // 可根据需求在set或者get其一中做处理相关逻辑
      set(value) {
        // 设置时设置首字母大写
        if (modifiers.capitalize) {
          return value.charAt(0).toUpperCase() + value.slice(1)
        }
        return value
      },
      get(value) {
        // 读取时设置首字母大写
        if (modifiers.capitalize) {
          return value.charAt(0).toUpperCase() + value.slice(1)
        }
        return value
      }
    })

    const [content, contentmodifiers] = defineModel('content', {
      set(value) {
        if (modifiers.capitalize) {
          return value.charAt(0).toUpperCase() + value.slice(1)
        }
        return value
      }
    })

    console.log(modifiers)  // {capitalize: true}
    console.log(contentmodifiers)  // {capitalize: true}
  </script>
`
