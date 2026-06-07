# 社群体检报告 - 部署说明

## 📦 项目已推送至 GitHub!

仓库地址：https://github.com/1235789a/special-octo-doodle

分支：trae/solo-agent-rgsV4M

## 🎯 当前项目概述

项目包含两个版本：

1. **本地测试版本**（Python）- 立即可用）
2. **Cloudflare部署版本**（生产环境）

---

## 🚀 方案一：本地测试（推荐先测试这个！

### 步骤

1. 在本地电脑打开项目根目录
2. 运行：`python3 server.py`
3. 访问：http://localhost:3000

测试

### 测试兑换码

- DEMO2024 (10次)
- VIP888888 (5次)

---

## 🌐 方案二：Cloudflare Pages 部署（推荐生产环境）

### 步骤

#### 1. 准备工作

- 注册 Cloudflare 账号
- 安装 wrangler 工具

```bash
npm install -g wrangler
wrangler login
```

#### 2. 创建 D1 数据库

```bash
cd community-health-report

# 创建数据库
wrangler d1 create community-health-db
```

**重要**：记下控制台会返回 database_id

#### 3. 配置 wrangler.toml

编辑 `wrangler.toml`，填入 database_id

```toml
name = "community-health-report"
main = "src/index.ts"
compatibility_date = "2024-06-07"

[[d1_databases]]
binding = "DB"
database_name = "community-health-db"
database_id = "你的数据库ID"
```

#### 4. 初始化数据库

```bash
wrangler d1 execute community-health-db --file=schema.sql
```

#### 5. 部署到 Pages

```bash
wrangler pages project create community-health-report
wrangler pages deploy --project-name=community-health-report
```

---

## 💰 闲鱼销售建议

### 上架准备

- 商品名称：**微信群AI体检报告
- 价格：**39元/份
- 截图：用项目中 demo 报告的截图
- 详情：用户购买后发兑换码 + 教程

### 兑换码生成

在 D1 数据库中直接插入即可：

```sql
INSERT INTO codes (code, max_uses) VALUES ('VIP888,3);
```

---

## 📋 功能说明

### 报告包含内容

1. 群健康诊断页：群成员数、活跃率、死号率等
2. 问题定位：分析出具体
3. 行动建议：Day1-7的具体步骤
4. 总结：优先级执行事项

