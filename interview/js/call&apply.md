### 核心
  函数作为对象提供了call()，apply() 方法，他们也可以用来调用函数，
  这两个方法都接受一个对象作为参数，用来指定本次调用时函数中this的指向


  ##### call()方法

    call方法使用的语法规则
    函数名称.call(obj,arg1,arg2...argN);
    参数说明:
    obj:函数内this要指向的对象,
    arg1,arg2...argN :参数列表，参数与参数之间使用一个逗号隔开
  ```
  var lisi = {names:'lisi'};
  var zs = {names:'zhangsan'};
  function f(age){
      console.log(this.names);
      console.log(age);
      
  }
  f(23);//undefined
  ​
  //将f函数中的this指向固定到对象zs上；
  f.call(zs,32);//zhangsan
  ```
    
  
  #####  apply()方法
    函数名称.apply(obj,[arg1,arg2...,argN])
    参数说明:
    obj :this要指向的对象
    [arg1,arg2...argN] : 参数列表，要求格式为数组

  ```
  var lisi = {name:'lisi'}; 
  var zs = {name:'zhangsan'}; 
  function f(age,sex){
      console.log(this.name+age+sex); 
  }
  //将f函数中的this指向固定到对象zs上；
  f.apply(zs,[23,'nan']);
  ```

  注意：call和apply的作用一致，区别仅仅在函数实参参数传递的方式上；

  这个两个方法的最大作用基本就是用来强制指定函数调用时this的指向；