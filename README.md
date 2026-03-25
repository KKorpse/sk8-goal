# 发布指南

## 版本号规则

格式：`x.x.x`
- 首次发布：1.0.0
- 小改动/文案修正：最后一位 +1（如 1.0.0 → 1.0.1）
- 新功能：中位 +1（如 1.0.1 → 1.1.0）
- 大版本：首位 +1

## 发布到体验版

**1. 修改 package.json 里的 version**

```bash
sed -i 's/"version": "x.x.x"/"version": "x.x.y"/' package.json
```

**2. 执行上传**

```bash
miniprogram-ci upload \
  --appid wxd5c362dcca977461 \
  --project-path ./miniprogram \
  --private-key-path ~/.ssh/miniprogram_private_key.pem \
  --upload-version x.x.y \
  --upload-description "描述" \
  --threads 4 \
  --use-cos
```

**3. 微信开发者工具 → 版本管理 → 刷新**，找到对应版本。

---

## 快捷脚本

项目根目录已有 `upload.sh`，用法：

```bash
./upload.sh "上传描述"
```

会自动读取 package.json 的 version 作为版本号。

---

## 合到 main

```bash
git checkout main && git pull origin main && git merge feature/xxx && git push origin main
```
