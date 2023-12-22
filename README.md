# zjy.f2bpm.web

该工程为中装的 PC 端项目工程。

## 项目运行

目前推荐使用 yarn 做为包管理器，也可以使用 npm。

- 启动项目

  ```bash
  # 开发环境
  yarn dev 或者 npm run dev

- 构建项目

  ```bash
  # 开发环境
  yarn build:dev
  # 测试环境
  yarn build:test
  # 生产环境
  yarn build:pro
  ```

- 手动触发代码检查

  ```bash
  yarn local-check
  ```

### 项目目录

- 整体项目目录结构介绍

  ```js
  |-- zjy.zzjs.web
    |-- .env // 环境变量 Todo
    |-- .gitignore // git 忽略文件
    |-- .npmrc // npm 包管理器配置文件
    |-- Dockerfile // 部署相关
    |-- README.md // 当前工程简介及使用文档
    |-- config.js // 当前工程的本地开发配置文件，比如 proxy
    |-- eslintrc.js // eslint代码校验
    |-- main.js // 入口文件
    |-- package.json // 当前工程信息文件
    |-- vue.config.js // 当前工程的工程配置文件
    |-- yarn.lock // 包锁定文件（yarn工具）
    |-- .vscode // vscode 的工作区配置
    |   |-- settings.json // vscode 配置文件
    |-- doc // 当前工程相关的文档文件
    |   |-- packages.md // 当前工程的包汇总说明文档
    |   |-- 编码规范.md  //后期存档
    |-- public // 静态文件夹
    |   |-- favicon.ico // 浏览器页签图标
    |   |-- index.html // html 模板
    |-- src // 相关代码 包括公共组件
    |-- extend // 扩展(Todo)
  ```


## 代码规范 后期

请查看 [编码规范](./doc/%E7%BC%96%E7%A0%81%E8%A7%84%E8%8C%83.md)


## 路由注册

请查看 [route-demo]()

## 当前页面已有的功能  后期

- 目前已有的 npm 包及其能力，查看 [已安装的 npm 包](./doc/packages.md)

- 请求方法 service 的使用介绍，请查看 [service 使用指南](./doc/service%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97.md)
