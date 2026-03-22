# Tasks
- [x] Task 1: 初始化项目结构与基础美学框架
  - [x] SubTask 1.1: 配置 React 基础环境，建立页面路由结构（或者状态机模拟的三大页面态）。
  - [x] SubTask 1.2: 设定全局 CSS 变量，实现「黑色+炫彩」主题（深邃的暗黑背景 `#0a0a0a`，搭配霓虹粉/电光蓝/紫色渐变 `linear-gradient`）。
  - [x] SubTask 1.3: 引入特效库（如 Framer Motion、Lucide Icons）并编写基础通用组件（Button、Input、Card），赋予其悬浮时的炫彩发光效果。

- [x] Task 2: 首页默认态与一体化输入区开发
  - [x] SubTask 2.1: 开发页面基础 Layout，支持顶、中、右的三栏/模块分布。
  - [x] SubTask 2.2: 实现顶部一体化输入区（Upload/Link/Text/Chat 混合输入框），支持流体渐变光晕背景，提示语“今天，你想知道什么？”。
  - [x] SubTask 2.3: 开发中部知识库列表组件，展示文档卡片（包含标题、来源摘要、标签、更新时间、关联数）。
  - [x] SubTask 2.4: 开发右侧常驻小助手组件视图。

- [x] Task 3: 聊天展开态与 RAG 问答交互
  - [x] SubTask 3.1: 实现页面状态切换动画（从首页切换至左中右三栏布局的聊天态）。
  - [x] SubTask 3.2: 开发 Chat 对话流界面，包含用户消息与 AI 回复气泡。
  - [x] SubTask 3.3: 实现带来源引用的回答组件，高亮引用片段，支持点击并跳转对应来源。

- [x] Task 4: 文档详情态与图谱展示
  - [x] SubTask 4.1: 开发文档详情阅读视图（中间内容区，支持文本与元信息展示）。
  - [x] SubTask 4.2: 在右侧信息区渲染局部关系网状图，模拟展示中心节点与 8-12 个关联节点。
  - [x] SubTask 4.3: 实现右侧信息区其他模块：来源信息卡片、标签模块、候选关联推荐、AI 推荐问题。

- [x] Task 5: 核心交互联调与视觉打磨
  - [x] SubTask 5.1: 串联所有页面状态的路由或状态切换逻辑（列表->详情，详情->聊天等）。
  - [x] SubTask 5.2: 走查全局排版（Typography），采用现代感强的无衬线字体，优化字重与负空间（Negative Space）。
  - [x] SubTask 5.3: 添加滚动触发、页面加载的 Stagger 动画与组件级微交互，确保体现高端设计质感。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 2], [Task 3], [Task 4]
