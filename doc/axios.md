# Axios 封装后的使用
## 1.设置请求连接服务地址

- 开发环境和生产环境使用同一个地址

```javascript
//会根据当前vue运行环境，进行动态设置地址
this.$ld.requestSetting.serverPath.set('http://127.0.0.1:18085/frame/');
```
> 会根据当前vue运行环境，进行动态设置地址

## 2.设置axios请求头等相关信息
- 设置axios请求等相关信息，需要我们重写`this.$ld.requestSetting.init`方法。

```javascript
 this.$ld.requestSetting.init= (axios) => {
    alert('设置axios信息！');
    return axios;
  }
```
> 重写方法是会获取到一个`axios`对象，需要对axios对象进行操作加工，之后需要返回加工后的`axios`

## 3.请求前拦截和请求后数据装饰
- 请求前拦截和请求后数据装饰需要我们重写`this.$ld.requestSetting.intercept`对象

- - 普通使用

```javascript
 //重写请求拦截器
this.$ld.requestSetting.interceptor = {
  /**
   * 请求前拦截
   */
  before: (event) => {
    //返回 true 和false ,控制是否继续执行请求方法
    return true;
  },
  /**
   * 请求后拦截装饰
   */
  after: (event) => {
     //对查询到的数据，进行统一装饰。
     return event.data;
  }
}

```
- - 使用Promise对象控制

> 在少数情况下，我们可能会通过与用户互动后，确定是否需要继续执行请求，这时使用 Promise 无疑是最好的方式。

```javascript
 //重写请求拦截器
this.$ld.requestSetting.interceptor = {
  /**
   * 请求前拦截
   */
  before: (event) => {
   /**
    * 这里使用 Promise.resolve 返回结果，结果为 true或false
    * 如： Promise.resolve(true);  //继续执行请求方法
    *      Promise.resolve(false); //不在执行请求方法
    */

    return this.$confirm('确定保存数据吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      //使用 true 和false ,控制是否继续执行请求方法
      return Promise.resolve(true);
    }).catch(() => {
      this.$message.info("用户取消了操作！");
      //使用 true 和false ,控制是否继续执行请求方法
      return Promise.resolve(false);
    });
  },
  /**
   * 请求后拦截装饰
   */
  after: (event) => {
    /**
     * 这里使用 Promise.resolve 返回结果，结果为装饰后的数据
     * 如： Promise.resolve(event);  //为程序返回最终装饰后的数据
     */
    return Promise.resolve(event);
  }
}

```

## 4.请求获取数据方法。返回类型：`Promise`

- 请求获取数据使用`this.$ld.request`方法获取数据

- - 支持 多种请求类型

```javascript
 this.$ld.request('test/getUserInfo', 'get',{}).then(res => {
    //获取到数据
  }, interceptError => {
    //当请求被拦截是
    console.log(interceptError);
  })
```

- `request`入参参数

|顺序|名称|类型|必填|默认|说明|示例|
|-|-|-|-|-|-|-|
|1|router|String|√|-|请求路径|'test/getUserInfo'|
|2|methodType|String||get|请求方法：get`\|`post|'get'|
|3|data|Object`\|`Array||{}|请求参数|`{userName:'188888888',password:'1111111'}`|
|4|timeout|Number||60000|超时时间(毫秒);如需全局设置需要调用`this.$ld.requestSetting.config.timeout = 2000;`|1000*2|


 > 除此之外对常用的两种请求类型(get;post)提供了额外的使用方式

 - - get 请求


 ```javascript
  this.$ld.getRequest('test/getUserInfo',{}).then(res => {
     //获取到数据
   }, interceptError => {
     //当请求被拦截是
     console.log(interceptError);
   })
 ```

 - - post 请求

```javascript
 this.$ld.postRequest('test/getUserInfo',{}).then(res => {
    //获取到数据
  }, interceptError => {
    //当请求被拦截是
    console.log(interceptError);
  })
```

- `getRequest`和`postRequest`入参参数

|顺序|名称|类型|必填|默认|说明|示例|
|-|-|-|-|-|-|-|
|1|router|String|√|-|请求路径|'test/getUserInfo'|
|2|data|Object`\|`Array||{}|请求参数|`{userName:'188888888',password:'1111111'}`|
|3|timeout|Number||60000|超时时间(毫秒);如需全局设置需要调用`this.$ld.requestSetting.config.timeout = 2000;`|1000*2|
