# 社群体检报告 - Cloudflare 部署版本

## 项目概述

微信群AI体检报告产品，基于 Cloudflare Pages + Workers + D1 部署。

## 项目结构

```
community-health-report/
├── src/
│   └── index.ts          # Workers 主程序
├── wrangler.toml         # Cloudflare 配置
└── schema.sql            # 数据库初始化
```

## 部署步骤

### 1. 创建 Cloudflare 账号

访问 https://dash.cloudflare.com/ 注册账号

### 2. 创建 D1 数据库

```bash
# 安装 wrangler
npm install -g wrangler

# 登录
wrangler login

# 创建数据库
wrangler d1 create community-health-db

# 初始化数据库
wrangler d1 execute community-health-db --file=schema.sql
```

### 3. 配置 wrangler.toml

将上一步得到的 `database_id` 填入 `wrangler.toml`

### 4. 部署到 Cloudflare

```bash
wrangler pages project create community-health-report --production

# 每次发布
wrangler pages deploy community-health-report --project-name=community-health-report
```

## 本地开发

项目还包含本地测试版本：

```bash
# 进入项目根目录
cd /workspace

# 运行本地服务器
python3 server.py
```

访问 http://localhost:3000 即可测试。

## 本地测试兑换码

- DEMO2024 (10次)
- VIP888888 (5次)

## 生产环境配置建议

1. **域名配置**：在 Cloudflare Pages 中绑定自定义域名
2. **兑换码管理**：定期更新数据库中的兑换码
3. **监控与日志**：配置 Cloudflare Analytics 监控访问
