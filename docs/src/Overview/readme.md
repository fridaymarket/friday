
# Welcome to Friday

Friday 目的是作为前端基础服务平台。 为了简化开发体验，提供了一系列基础服务及管理了部分核心依赖。

Friday 有以下特性：

- 基于配置管理router及sentry等插件
- API快速生成、基于axios两种数据流调度方式
- 微服务支持
- 中间件机制
- 常用hooks、helper库
- 核心依赖统一管理
- 快速生成脚手架
- more...

为了持续扩展，Friday 拆分为多个包，包之间相互解构，由以下包构成：

- @friday/core  - 核心包提供friday配置等能力
- @friday/router  - 提供router管理能力
- @friday/async  - API快速生成及数据流调度能力
- @friday/helpers - 常用工具库
- @friday/hooks  - 常用hooks
- @friday/immer  -  immer库，在@friday/core已经暴露，无需引入
- @friday/template - friday 项目生成模版
- ~~@friday/chart - 还未开发~~

<MarkDown content={readme}