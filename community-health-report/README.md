# 社群体检报告 - 使用说明

## 🎯 一键启动（无需安装Python）

### Windows用户
1. 双击 `start.bat`
2. 等待窗口显示"服务器已启动"
3. 打开浏览器访问 http://localhost:3000

### Mac用户
1. 双击 `start.command`
2. 如果提示"无法执行"，在终端运行：`chmod +x start.command`
3. 等待显示"服务器已启动"
4. 打开浏览器访问 http://localhost:3000

---

## 📋 使用流程

### 1. 验证兑换码
- 输入兑换码：`DEMO2024`
- 点击"验证兑换码"

### 2. 上传数据
- 点击或拖拽上传 `data/sample.json`
- 点击"开始生成报告"

### 3. 查看报告
- 系统自动生成4页报告
- 可以直接打印或保存为PDF

---

## 📁 文件说明

```
community-health-report/
├── server.py          # 服务器程序（不要修改）
├── start.bat          # Windows启动脚本
├── start.command      # Mac启动脚本
├── README.md          # 本说明文件
└── data/
    └── sample.json    # 示例数据（测试用）
```

---

## 🔧 常见问题

### Q: 双击没反应？
A: 确保已安装Python
- Windows: https://www.python.org/downloads/
- Mac: 通常已自带，可终端输入 `python3 --version` 检查

### Q: 提示"无法打开"？
A: Mac系统安全限制
- 打开"系统偏好设置" > "安全性与隐私" > "通用"
- 允许从任何来源安装

### Q: 端口被占用？
A: 关闭其他程序后重试

### Q: 页面打不开？
A: 确保地址是 http://localhost:3000

---

## 🎁 测试兑换码
- DEMO2024（可用10次）
- VIP888888（可用5次）

---

## 📞 需要帮助？
联系客服获取更多兑换码

---

版本：v1.0
日期：2026-06-07
