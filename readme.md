
# Welcome to Friday
Friday让状态和视图管理更加简单，聚合一系列基础能力，让react应用更松散。

## Features
- API快速生成、基于Axios、SWR两种数据流调度方式，彻底抛弃redux
- 微服务支持，一键开启微服务
- 中间件机制, 抽象出中间件，更多扩展的可能性
- 基于配置管理router，支持统一管理路由和组件路由两种方式
- 快速生成Friday脚手架，降低调研脚手架时间成本

## Quick Start

```bash
# 由于目前cra4.03版本对tsconfig.json的限制导致新建模版中断，目前暂时使用4.0.0版本
& npx create-react-app --scripts-version 4.0.0-next.64 [project-name] --template friday-library

& cd [project-name]

& yarn start

# 几秒钟后，你会看到以下输出： 

Compiled successfully!

You can now view friday-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.7.35:3000

Note that the development build is not optimized.
To create a production build, use yarn build.

```

## Documentation
* [friday-core](https://github.com/fridaymarket/friday/blob/main/packages/friday-core/README.md) 
> friday的纽带，提供微服务、应用配置、应用视图结偶、中间件等能力。


* [friday-async](https://github.com/fridaymarket/friday/blob/main/packages/friday-async/README.md) 
> 作为`friday`的数据流管理方式，抛弃了redux数据流管理方式，全面拥抱hooks生态, 同时还支持纯函数的async能力，简化应用复杂度之下，大大提升研发效率。

* [friday-micro](https://github.com/fridaymarket/friday/blob/main/packages/friday-micro/README.md) 
> `friday-micro` 提供微服务的扩展能力

* [friday-template](https://github.com/fridaymarket/friday/blob/main/packages/friday-template/README.md)

> `friday-template` 提供快速创建`friday`应用的能力







