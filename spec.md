# 《赛博战友》(Cyber Comrade) 架构设计规范

## 1. 产品概述
- **产品定位**：一款主打“情绪价值”与“社交货币”的 AI-Native Vibe Coding Web 应用。
- **核心逻辑**：用户倾诉近况，AI 进行赛博判定（`[夯爆了]` 或 `[拉完了]`），并以“发疯战友”的人设提供极度荒诞、反职场叙事的安慰，最终生成一张适合社交传播的“精神状态档案卡”。
- **视觉基调**：**极简反差风**。UI 极度克制、优雅（高斯模糊、流体阴影、物理阻尼动效），文案极度暴躁发疯，形成强烈的反差萌。

## 2. 核心用户旅程 (User Journey)
1. **输入态 (Input)**：全屏留白，中央一个带呼吸感阴影的输入框，提示语：“今天怎么了？”
2. **加载态 (Loading)**：极简的流体光球或丝滑渐变色束（Framer Motion），暗示 AI 正在“优雅地发疯”。
3. **结果态 (Result)**：带物理阻尼感弹出的“精神状态档案卡”，展示发疯判词和雷达图。
4. **分享态 (Share)**：一键将档案卡保存为精美图片（包含 UI 阴影和排版细节）。

## 3. 技术栈选型
- **核心框架**：Next.js 14+ (App Router)
- **样式与 UI**：Tailwind CSS (极简布局) + Framer Motion (物理动效与流体加载) + Lucide React (图标)
- **图表渲染**：Recharts (或定制化 SVG + Framer Motion 画线) 实现多维度雷达图
- **AI 编排**：Vercel AI SDK (`ai` 和 `@ai-sdk/openai` 等)，对接大模型（优先使用 MiniMax 或 OpenAI 兼容接口，要求返回强 JSON 结构）
- **分享截图**：`html-to-image` (前端直接 DOM 转图片，保留复杂的 CSS 样式和阴影)

## 4. 核心系统设计

### 4.1. AI Prompt 与接口协议
强制大模型返回严格的 JSON 格式数据。
```json
{
  "status": "夯爆了" | "拉完了",
  "quote": "一段50字以内、意料之外的暴躁/发疯安慰语。",
  "radar_stats": {
    "sludge": 95,      // 班味浓度
    "crazy": 88,       // 发疯指数
    "quit": 100,       // 离职冲动
    "sarcasm": 30,     // 阴阳怪气值
    "appetite": 10     // 干饭欲望
  }
}
```

### 4.2. 目录结构规划
```text
src/
├── app/
│   ├── layout.tsx         # 全局字体（Inter/苹方）、极简背景配置
│   ├── page.tsx           # 核心交互主页
│   └── api/
│       └── chat/
│           └── route.ts   # Vercel AI SDK 路由，处理发疯判定与 JSON 解析
├── components/
│   ├── InputArea.tsx      # 输入组件（带呼吸阴影）
│   ├── FluidLoader.tsx    # 流体加载动效组件
│   ├── ResultCard.tsx     # 精神状态档案卡组件
│   └── RadarChart.tsx     # 雷达图组件
├── lib/
│   └── prompts.ts         # System Prompt 统一管理
└── styles/
    └── globals.css        # 全局样式与 Tailwind 覆盖
```

## 5. 动效与 UI 细节要求 (Vibe Coding 核心)
- **阴影 (Shadows)**：拒绝死板的黑影，使用带有颜色倾向（如微紫/微蓝）的大范围软阴影，营造悬浮感。
- **透明度 (Glassmorphism)**：卡片背景使用 `backdrop-blur` 和低透明度白色/黑色，实现毛玻璃质感。
- **动效 (Framer Motion)**：
  - 弹簧阻尼：`type: "spring", stiffness: 300, damping: 20`。
  - 布局过渡：使用 `layout` 属性让输入框消失、卡片出现的过渡极致平滑。
- **字体 (Typography)**：无衬线字体为主，字号对比要强烈（例如“拉完了”三个字要极大，判词字体要克制）。

## 6. 部署策略
- 本地开发与测试。
- 完成后由用户执行 Git 提交，部署至 Vercel。