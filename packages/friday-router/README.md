
# friday-router

Router默认输出`react-router-dom`的所有方法

...
`friday-router`提供了部分基于`router`的`hook`

## API 

#### useRouter()
`useRouter` 封装了`router`常用的几个`hooks`，返回值如下：

```js 

const router = useRouter()
// router
{
  // url 中的params
  query,
  match,
  location,
  // 重定向函数
  history
}
```

#### useScrollTop()
`history`改变时，自动到顶部

#### router config(todo...)


