# 社群体检报告 - Cloudflare Pages

## 部署步骤

### 1. 准备 Cloudflare D1 数据库

在 Cloudflare Dashboard 创建 D1 数据库：
- 数据库名称：`community-health-db`
- 记录下数据库 ID

### 2. 执行数据库初始化

在 Cloudflare D1 控制台执行以下 SQL：

```sql
CREATE TABLE IF NOT EXISTS codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    uses INTEGER DEFAULT 0,
    max_uses INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入测试兑换码
INSERT OR IGNORE INTO codes (code, max_uses) VALUES ('DEMO2024', 10);
INSERT OR IGNORE INTO codes (code, max_uses) VALUES ('VIP888888', 5);
```

### 3. 在 Cloudflare Pages 设置

在 Pages 项目设置中：

1. **绑定数据库**：
   - 进入设置 → 函数 → 数据库绑定
   - 添加绑定：变量名 `DB`，选择你的 D1 数据库

2. **构建配置**（保持默认即可）：
   - 构建命令：留空
   - 输出目录：留空

### 4. 部署

推送代码到 GitHub，Cloudflare Pages 会自动部署！

## 本地测试

本地测试使用 `/workspace/server.py` 即可。
