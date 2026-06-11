# 蜕羽 AI 服务站

中文 AI 工具订阅服务承接站，提供 GPT Plus 一个月、Gemini 一年等 AI 工具服务说明与下单入口。

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- 纯静态导出，无需数据库

## 本地运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建静态站点
npm run build
```

## 配置支付链接

1. 复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

2. 修改 `.env.local` 中的支付链接：

```env
NEXT_PUBLIC_GPT_PLUS_PAY_URL=https://你的发卡平台链接/gpt-plus
NEXT_PUBLIC_GEMINI_PAY_URL=https://你的发卡平台链接/gemini
```

> 购买按钮将自动从环境变量读取链接，点击后跳转到外部支付页面。

## 页面结构

- `/` - 首页（商品展示、说明）
- `/products/gpt-plus-month` - GPT Plus 一个月 详情页
- `/products/gemini-year` - Gemini 一年 详情页
- `/faq` - 常见问题
- `/support` - 售后说明
- `/disclaimer` - 免责声明

## 部署到 Cloudflare Pages

1. **构建命令：**

```bash
npm run build
```

2. **输出目录：**

```
out
```

3. 在 Cloudflare Pages 控制台：
   - 选择「连接 Git」或直接上传
   - 构建命令填写 `npm run build`
   - 输出目录填写 `out`
   - 在环境变量中配置 `NEXT_PUBLIC_GPT_PLUS_PAY_URL` 和 `NEXT_PUBLIC_GEMINI_PAY_URL`

## 注意事项

- 本站仅提供商品说明和下单入口，不处理用户账号、密码或自动发货
- 购买链接由外部发卡平台或小铺提供，发货规则以对应平台为准
- 虚拟商品购买前请阅读商品详情和售后说明
