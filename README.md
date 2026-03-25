# SkateGoal 小程序开发指南

## 环境准备

### 1. 安装依赖

```bash
# Node.js ≥ 18（建议用 nvm 管理）
node -v

# 全局安装 miniprogram-ci
npm install -g miniprogram-ci
```

### 2. 配置密钥

将小程序私钥文件放到 `~/.ssh/miniprogram_private_key.pem`

### 3. 启动 VPN（如需）

```bash
cd ~/clash && ./clash -f config.yaml
```

---

## 开发流程

### 1. 创建功能分支

从 `main` 新建功能分支：

```bash
git checkout main
git pull origin main
git checkout -b feature/功能名称
```

### 2. 开发 + 提交

```bash
git add .
git commit -m "feat: 功能描述"
git push origin feature/功能名称
```

### 3. 推送到体验版

**自动版本号**（推荐，每次自动升版本）：

```bash
# 在项目根目录运行，会自动找 miniprogram/ 子目录
miniprogram-ci upload \
  --appid wxd5c362dcca977461 \
  --project-path ./miniprogram \
  --private-key-path ~/.ssh/miniprogram_private_key.pem \
  --upload-version 1.0.0 \
  --upload-description "描述" \
  --threads 4 \
  --use-cos
```

**快捷脚本**（项目根目录的 `upload.sh`）：

```bash
chmod +x upload.sh
./upload.sh "上传描述"
```

手动指定版本号（需每次改号）：

```bash
# 先改 package.json 里的 version
sed -i 's/"version": "x.x.x"/"version": "x.x.y"/' package.json

# 再执行上传
miniprogram-ci upload --appid wxd5c362dcca977461 --project-path ./miniprogram --private-key-path ~/.ssh/miniprogram_private_key.pem --upload-version x.x.y --upload-description "描述" --threads 4 --use-cos
```

### 4. 微信开发者工具验证

上传后打开微信开发者工具，刷新项目，在「版本管理」中可以看到刚上传的版本。

---

## 合码流程（合并到 main）

### 1. 切换到 main

```bash
git checkout main
git pull origin main
```

### 2. 合并功能分支

```bash
git merge feature/功能名称
git push origin main
```

### 3. 发布正式版

在微信公众平台后台手动提交审核。

---

## 常用命令

```bash
# 查看当前分支
git branch --show-current

# 查看最近 5 条提交
git log --oneline -5

# 查看分支从哪个 commit 分出来
git merge-base feature/xxx main

# 测试 clash 规则（需 clash 运行中）
~/clash/clash-rules.sh test example.com
```

---

## 项目结构

```
sk8-goal/
├── miniprogram/          # 小程序源码
│   ├── pages/            # 页面
│   ├── components/       # 组件
│   ├── services/         # 服务层
│   ├── mock/             # Mock 数据
│   └── themes/           # 主题配置
├── upload.sh             # 上传快捷脚本
└── package.json
```

---

## 技术栈

- **框架**：微信小程序（原生）
- **状态管理**：LocalStorage + 内存兜底（适配器模式）
- **主题系统**：多主题切换（Minecraft / Stardew / Terraria）
- **发布工具**：miniprogram-ci
