# 海媒通 MVP 前端原型

这是一个面向中文用户的「海外媒体发稿平台」MVP 原型，包含静态前端和一个零依赖 Node.js 后端。

当前版本支持：

- 买家、卖家、网站管理员三种角色
- 注册 / 登录
- 媒体网站与 Owner/Reseller 报价
- 媒体审核与报价审核
- 发稿订单
- 充值记录与管理员确认入账
- 本地 JSON 数据存储

## 页面范围

- 首页：`#/`
- 媒体资源列表页：`#/media`
- 媒体详情页：从媒体列表点击进入
- 下单页：从媒体详情点击「立即下单」
- 买家后台：`#/buyer`
- 媒体主入驻页：`#/publisher`
- 卖家后台：`#/seller`
- 网站管理员后台：`#/admin`

## 项目结构

```text
.
├── index.html
├── 404.html
├── preview-server.mjs
├── API.md
├── .nojekyll
├── .gitignore
├── server
│   └── server.mjs
└── src
    ├── app.js
    ├── components.js
    ├── mockData.js
    ├── pages.js
    └── styles.css
```

## 本地预览

前端静态预览：

直接双击打开 `index.html`。

完整 MVP 后端预览：

```bash
npm start
```

然后访问：

```text
http://localhost:4173
```

演示账号：

```text
admin@example.com / admin123
buyer@example.com / buyer123
seller@example.com / seller123
```

## 部署说明

GitHub Pages 只能部署静态前端，不能运行 `server/server.mjs` 后端。

如果只是展示页面，可以继续使用 GitHub Pages。

如果要测试真实注册、订单、充值和后台 API，需要部署到支持 Node.js 的服务，例如：

- Render
- Railway
- Fly.io
- VPS 云服务器
- Vercel Serverless 版本需要另外改造 API 结构

静态前端部署到 GitHub Pages：

1. 在 GitHub 新建一个仓库，例如 `media-marketplace-mvp`
2. 把当前文件夹里的全部文件上传到仓库根目录
3. 进入仓库的 `Settings`
4. 打开 `Pages`
5. Source 选择 `Deploy from a branch`
6. Branch 选择 `main`
7. Folder 选择 `/root`
8. 保存后等待 GitHub Pages 构建完成

上线后访问地址通常类似：

```text
https://你的用户名.github.io/media-marketplace-mvp/
```

## 注意事项

- 当前项目使用 hash 路由，例如 `#/media`，更适合 GitHub Pages 这种静态托管环境。
- `.nojekyll` 用来避免 GitHub Pages 对静态资源做 Jekyll 处理。
- `404.html` 提供静态托管兜底跳转。
- 前端目前仍保留 `src/mockData.js` 作为离线演示数据。
- 后端数据存储在 `server/data/app-data.json`，该文件不提交到 Git。
- 生产环境建议把 JSON 存储替换为 PostgreSQL 或 MySQL。

## 后续可扩展方向

- 接入真实登录注册
- 接入媒体资源数据库
- 接入订单系统
- 接入支付与余额
- 增加管理员权限
- 增加媒体审核流程
- 增加订单状态真实流转
