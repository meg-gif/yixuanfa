[API.md](https://github.com/user-attachments/files/27433506/API.md)
# 海媒通 MVP API

当前后端是零依赖 Node.js 原型，数据存储在 `server/data/app-data.json`。

## 启动

```bash
npm start
```

默认访问：

```text
http://localhost:4173
```

## 演示账号

```text
admin@example.com / admin123
buyer@example.com / buyer123
seller@example.com / seller123
```

登录成功后使用：

```text
Authorization: Bearer <token>
```

## 认证

`POST /api/auth/register`

```json
{
  "name": "买家名称",
  "email": "buyer@demo.com",
  "password": "123456",
  "role": "buyer"
}
```

`POST /api/auth/login`

```json
{
  "email": "buyer@example.com",
  "password": "buyer123"
}
```

`GET /api/me`

返回当前登录用户。

## 媒体

`GET /api/media`

支持查询参数：

- `q`
- `category`
- `language`
- `traffic`
- `dr`
- `da`
- `indexed`
- `linkType`
- `sponsored`

未登录只返回预览数据；登录后返回完整数据。

`GET /api/media/:id`

查看媒体详情和 Owner/Reseller 报价。

`POST /api/media`

卖家提交媒体，默认进入 `pending`。

`POST /api/media/:id/sellers`

卖家给某个媒体提交 Owner/Reseller 报价，默认进入 `pending`。

## 管理员审核

`PATCH /api/admin/media/:id/approve`

审核通过媒体。

`PATCH /api/admin/media/:id/sellers/:sellerId/approve`

审核通过某个卖家报价。

## 订单

`POST /api/orders`

买家创建订单。

```json
{
  "mediaId": "tech-daily-us",
  "sellerId": "seller_reseller_tech",
  "brandName": "Demo Brand",
  "targetUrl": "https://example.com",
  "anchor": "brand anchor",
  "title": "Article title",
  "contentHtml": "<h1>Article</h1>",
  "notes": "备注"
}
```

`GET /api/orders`

按角色返回订单：

- 管理员看全部
- 买家看自己的订单
- 卖家看分配给自己的订单

`PATCH /api/orders/:id/status`

更新订单状态或发布链接。

```json
{
  "status": "published",
  "publishUrl": "https://media.com/article"
}
```

建议状态：

- `pending_payment`
- `paid`
- `accepted`
- `draft_review`
- `publishing`
- `published`
- `completed`
- `refund_requested`
- `cancelled`

## 充值

`POST /api/deposits`

买家创建充值单。

```json
{
  "method": "USDT",
  "network": "TRC20",
  "amount": 1000
}
```

`GET /api/deposits`

管理员看全部，买家看自己的充值记录。

`PATCH /api/admin/deposits/:id/confirm`

管理员确认入账，用户余额增加。
