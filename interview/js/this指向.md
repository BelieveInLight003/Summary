### this指向
 #### 核心
  <span style="color: red;">在JavaScript语言之中，一切皆对象，运行环境也是对象，所以函数都是在某个对象下运行，而this就是函数运行时所在的对象（环境）</span>
  - this指向是函数执行时，由函数的调用者决定指向的。
  - this指向的规则：
    - this永远指向一个对象
    - this的指向完全取决于调用函数的位置

    
```
function fun(){
    console.log(this.s);
}
​
var obj = {
    s:'1',
    f:fun
}
​
var s = '2';
​
obj.f(); //1
fun(); //2
```

#### 事件绑定中的this
  ###### 行内绑定
    ```
    <input type="button" value="按钮" onclick="clickFun()">
    <script>
        function clickFun(){
            this // 此函数的运行环境在全局window对象下，因此this指向window;
        }
    </script>
    ​
    <input type="button" value="按钮" onclick="this">
    <!-- 运行环境在节点对象中，因此this指向本节点对象 -->
    ```
  ###### 动态绑定与事件监听
    ```
    <input type="button" value="按钮" id="btn">
    <script>
        var btn = document.getElementById('btn');
        btn.onclick = function(){
            this ;  // this指向本节点对象
        }
    </script>
    ```

    因为动态绑定的事件本就是为节点对象的属性(事件名称前面加'on')重新赋值为一个匿名函数，因此函数在执行时就是在节点对象的环境下，
    this自然就指向了本节点对象；

#### 构造函数中的this
  ```
  function Pro(){
    this.x = '1';
    this.y = function(){};
  }
  var p = new Pro();
  ```

  实现new过程的四个步骤
  ```
  mdn
  1. 创建一个空的简单 JavaScript 对象。为方便起见，我们称之为 newInstance。
  2. 如果构造函数的 prototype 属性是一个对象，则将 newInstance 的 [[Prototype]] 指向构造函数的 prototype 属性，
     否则 newInstance 将保持为一个普通对象，其 [[Prototype]] 为 Object.prototype。
  3. 使用给定参数执行构造函数，并将 newInstance 绑定为 this 的上下文（换句话说，在构造函数中的所有 this 引用都指向 newInstance）。
  4. 如果构造函数返回非原始值，则该返回值成为整个 new 表达式的结果。否则，如果构造函数未返回任何值或返回了一个原始值，
     则返回 newInstance。（通常构造函数不返回值，但可以选择返回值，以覆盖正常的对象创建过程。）
  ```

  
#### windows定时器中的this
  ```
  var obj = {
    fun:function(){
        this ;
    }
  }
  ​
  setInterval(obj.fun,1000); // this指向window对象
  setInterval('obj.fun()',1000);  // this指向obj对象
  ```

  <span style="color: red;">setInterval(obj.fun,1000);</span> 
    解释： 
      在上面的代码中，setInterval(obj.fun,1000) 的第一个参数是obj对象的fun ，因为 JS 中函数可以被当做值来做引用传递，实际就是将这个函数的地址当做参数传递给了 setInterval 方法，换句话说就是 setInterval 的第一参数接受了一个函数，那么此时1000毫秒后，函数的运行就已经是在window对象下了，也就是函数的调用者已经变成了window对象，所以其中的this则指向的全局window对象；

  <span style="color: red;">setInterval('obj.fun()',1000);</span>
    解释： 
      setInterval('obj.fun()',1000) 中的第一个参数，实际则是传入的一段可执行的 JS 代码；1000毫秒后当 JS 引擎来执行这段代码时，则是通过 obj 对象来找到 fun 函数并调用执行，那么函数的运行环境依然在 对象 obj 内，所以函数内部的this也就指向了 obj 对象；

