
# Welcome to Friday

Friday 目的是作为基础服务的聚合平台。 优化开发体验，聚合一系列基础服务及管理部分核心依赖。

Friday 有以下特性：

- 基于配置管理router及sentry等插件
- API快速生成、基于axios、useRequest两种数据流调度方式
- 微服务支持
- 中间件机制 
- 常用hooks、helper库
- 核心依赖统一管理
- 快速生成Friday脚手架
- more...

friday 彻底抛弃了redux数据流方案，转向`react hooks`数据流方式，同时在非react场景下，支持了异步分发器`dispatchAsync`

为了持续扩展，Friday 拆分为多个包，包之间相互解构，由以下包构成：

- `friday-core`  - 核心包提供friday配置等能力
- `friday-router`  - 提供router管理能力
- `friday-async`  - async数据流管理模块
- `friday-helpers` - 常用工具库
- `friday/immer`  -  immer库
- `friday/template` - friday 项目生成模版


