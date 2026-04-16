# 开发任务拆解 (Tasks)

## Phase 1: 项目初始化与基建 (Setup)
- [ ] 1.1 使用 `create-next-app` 初始化 Next.js (App Router, TypeScript, Tailwind CSS) 项目。
- [ ] 1.2 安装核心依赖：`framer-motion`, `lucide-react`, `recharts`, `html-to-image`, `ai`, `@ai-sdk/openai`。
- [ ] 1.3 配置全局字体（Inter 或本地无衬线字体）与极简背景（如极其细腻的噪点或微弱的渐变背景）。
- [ ] 1.4 建立 `components`, `lib` 等基础目录。

## Phase 2: 核心 UI 组件开发 (UI Skeleton)
- [ ] 2.1 开发 `InputArea` 组件：包含自适应高度的 `textarea`，Framer Motion 实现聚焦时的阴影膨胀和发光效果。
- [ ] 2.2 开发 `FluidLoader` 组件：实现点击发送后的加载状态，采用 CSS 滤镜或 Framer Motion 实现丝滑流体蠕动动画。
- [ ] 2.3 开发 `ResultCard` 骨架组件：构建“精神状态档案卡”的极简毛玻璃布局（Title, Quote, Radar Chart Area）。
- [ ] 2.4 开发 `RadarChart` 组件：集成 Recharts，确保图表没有多余的轴线，只保留雷达网和数据多边形，符合极简审美。

## Phase 3: AI 逻辑与后端接口 (AI Integration)
- [ ] 3.1 在 `lib/prompts.ts` 中固化 System Prompt。
- [ ] 3.2 开发 `app/api/chat/route.ts`：集成 Vercel AI SDK，调用大模型（需支持 `generateObject` 或强校验 JSON 格式输出）。
- [ ] 3.3 联调前后端：在主页实现“用户输入 -> 触发 API -> 解析 JSON -> 切换到卡片态”的完整状态流转 (`idle` -> `loading` -> `success`)。

## Phase 4: 分享与传播功能 (Share Feature)
- [ ] 4.1 在 `ResultCard` 中集成保存按钮。
- [ ] 4.2 使用 `html-to-image` 实现 DOM 节点转高质量 PNG。
- [ ] 4.3 解决可能存在的图片跨域、字体未加载或阴影渲染不全的问题，确保截图和真实 DOM 视觉一致。

## Phase 5: Vibe 打磨与验收 (Polish)
- [ ] 5.1 调优所有 Framer Motion 动画曲线（弹簧阻尼、延迟、错开动画 `staggerChildren`）。
- [ ] 5.2 检查在移动端尺寸下的排版表现，确保档案卡在手机上依然优雅。
- [ ] 5.3 极端边界情况处理（如：用户输入为空、API 报错时的优雅降级）。