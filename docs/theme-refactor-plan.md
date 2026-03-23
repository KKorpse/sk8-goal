# 小程序多风格改造方案

## 目标

在不复制整套页面的前提下，让 `SkateGoal` 支持多种游戏化风格，例如“方块冒险”和“田园像素”，并把未来新增风格的工作量压缩到主题资源、少量组件变体和局部页面插槽。

## 当前项目现状

- 技术栈是原生微信小程序。
- 当前视觉风格主要写死在全局变量和页面 `wxss` 里，主题源头只有一套。
- 页面和组件已经有一定组件化基础，例如 `search-bar`、`filter-tabs`、`trick-card`、`stance-panel`。
- 业务层和视觉层尚未完全分离，但业务数据组织整体独立，适合渐进改造。

## 改造原则

1. 保持一套页面和业务逻辑，不复制页面目录。
2. 先做主题系统和基础组件层，不直接追求全量配置化页面生成。
3. 小差异走 Design Token，大差异走组件 Variant，极大差异走页面 Section 插槽。
4. 主题只能影响展示和交互反馈，不侵入业务逻辑、接口和数据结构。

## 推荐分层

### 1. 业务层

职责：

- 用户信息
- 招式进度
- 时间线
- 勋章和统计

对应当前目录：

- `miniprogram/services/`
- `miniprogram/mock/`

要求：

- 不感知主题。

### 2. 页面骨架层

职责：

- 页面区块编排
- 数据装配
- 事件转发

对应当前目录：

- `miniprogram/pages/`

要求：

- 页面只负责组织区块，不直接写死风格语义，例如“矿洞背景”“木纹边框”。

### 3. 组件层

职责：

- 基础组件：按钮、卡片、筛选、搜索、弹窗、列表项
- 业务组件：招式卡、脚位面板、时间线节点等

对应当前目录：

- `miniprogram/components/`

要求：

- 优先消费主题变量。
- 只有高频核心组件才开放 `variant`。

### 4. 主题层

职责：

- 主题定义
- token
- 主题资源
- 少量组件变体

当前建议目录：

```text
miniprogram/
  themes/
    index.js
    minecraft.js
    stardew.js
    terraria.js
  styles/
    theme.wxss
```

其中每个主题文件同时承载：

- 基础元信息
- 导航栏配置
- `profile` 场景内容配置
- `author` 页面内容配置

主题继续增多时，再按主题拆资源目录：

```text
miniprogram/themes/
  minecraft/
  stardew/
```

## 首轮落地范围

第一阶段先完成以下能力：

1. 增加全局主题源和持久化存储。
2. 在全局样式中定义两套主题 token。
3. 页面根节点接入主题类名。
4. 在“我的”页面提供主题切换入口。
5. 先让以下页面走统一主题机制：
   - `profile`
   - `tricks`
   - `skating-history`
   - `author`

## 首轮之后的演进路径

### 第二阶段：组件变体

适合处理“不只是颜色变化”的组件，例如：

- `trick-card`
- `timeline-item`
- `stance-panel`

建议做法：

- 给组件增加 `variant` 属性。
- 默认从主题配置推导 `variant`。
- 只允许少量有限变体，例如 `minecraft | stardew`。

示例：

```js
properties: {
  variant: {
    type: String,
    value: ''
  }
}
```

### 第三阶段：页面 Section 插槽

适合首页或个人页这种视觉个性更强的页面。

做法：

- 页面拆成多个 section，如 `hero`、`stats`、`timeline`。
- 每个 section 保持统一数据输入。
- 不同主题可以替换少量 section 的渲染模板或装饰层。

注意：

- 只开放少量插槽，不做完全自由布局系统。

## 具体实施步骤

1. 新建 `themeService`，统一主题定义、获取、保存。
1.1. 主题定义放到 `miniprogram/themes/`，`themeService` 只负责读写和查询。
2. 新建 `themePage` 工具，简化各页面接入。
3. 把 `theme.wxss` 改为“基础变量 + 主题覆盖变量”模式。
4. 页面根节点添加 `theme-shell {{themeClass}}`。
5. 把页面里写死的少量背景和高亮色改成主题变量。
6. 在个人页增加主题切换卡片，用于预览和切换。
7. 后续再逐个抽高频组件变体。

## 开发规范

### 什么时候改 token

适用于：

- 颜色
- 字体
- 阴影
- 圆角
- 背景纹理
- 间距
- 动效节奏

### 什么时候改 variant

适用于：

- 组件边框结构不同
- 装饰角标不同
- 内部信息布局不同
- 状态表现不同

### 什么时候允许页面级覆盖

适用于：

- 页面头图区完全不同
- 时间线或成就区的视觉叙事完全不同

## 风险与控制

### 风险 1：页面里散落大量主题 if/else

控制：

- 统一收敛到 `themeService`、主题变量和少量组件变体。

### 风险 2：新增主题时工作量依旧过大

控制：

- 新主题优先只补 token。
- 只有确实必要时才补组件变体。

### 风险 3：资源体积增长

控制：

- 大图资源按主题目录管理。
- 优先使用 CSS 绘制纹理和轻量图标。
- 后续如有必要再做分包。

### 风险 4：小程序 `json` 静态配置无法动态切主题

控制：

- 页面 `json` 里的 `backgroundColor`、`navigationBarBackgroundColor` 只保留最小兜底或直接移除页面级覆盖。
- 真正的主题切换通过运行时 `wx.setNavigationBarColor` 完成。
- 页面内容背景统一交给 `theme-shell` 和主题 token。

## 当前这次改造已完成的内容

- 主题服务与持久化
- 两套主题 token
- 页面根节点主题接入
- 个人页主题切换入口

后续可以继续推进：

- `trick-card` / `stance-panel` 变体化
- 个人页和时间线 section 插槽化
- 主题资源目录与局部贴图接入
- 新增主题时复用 [THEME_TEMPLATE.md](/root/sk8-goal/miniprogram/themes/THEME_TEMPLATE.md)
