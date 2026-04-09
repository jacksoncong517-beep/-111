# Actuarial Copilot Pro v2.0

AI精算助手 — 基于中国人身保险业经验生命表（2025）& IFRS 17

## 功能模块

- **死亡率分析** — CL1~CL4 四张生命表完整数据，男女对比、表间对比、对数坐标、生存曲线、期望寿命
- **保费计算** — 精算现值驱动的净保费计算（终身/定期/趸缴），展示 Ax、äx 等精算函数
- **利润测试** — 多因素 Profit Testing（死亡+退保+费用+佣金），利润瀑布图、现金流分解、逐年明细
- **IFRS 17** — BBA 框架下 CSM 初始确认与摊销模拟，保险收入可视化
- **AI 问答** — Claude API 驱动的精算专业问答

## 技术栈

React 18 + Vite + Recharts + Express + Claude API

## Railway 部署

1. 将本项目推送到 GitHub
2. 在 Railway 中创建新项目，连接 GitHub 仓库
3. 在 Railway 的 Variables 中添加环境变量：
   - `ANTHROPIC_API_KEY` = 你的 Anthropic API Key
4. Railway 会自动检测 nixpacks.toml，执行 build 和 start
5. 部署完成后访问分配的域名即可

## 本地开发

```bash
npm install
npm run dev        # 开发模式 (localhost:5173)
npm run build      # 构建
npm start          # 生产模式 (localhost:3000)
```

需要设置环境变量 `ANTHROPIC_API_KEY` 才能使用 AI 问答功能。

## 注意

- AI 问答功能需要 Anthropic API Key（付费），不设置也不影响其他模块使用
- 所有精算计算均在前端完成，无需后端依赖
- 生命表数据已内嵌在前端代码中
