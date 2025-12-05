# 智能房贷顾问 | Smart Mortgage Advisor

<div align="center">

**一个全面的房产投资决策工具，帮助您做出明智的购房选择**

[English](#english) | [中文](#chinese)

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

<a name="chinese"></a>

## 🏠 项目简介

智能房贷顾问是一个功能强大的房产投资分析工具，通过可视化图表和AI辅助，帮助用户全面评估买房vs租房的财务影响，做出最优决策。

### ✨ 核心特性

#### 📊 **财富分析**
- **财富曲线对比**：直观展示买房与租房投资30年的财富积累差异
- **实时计算**：支持等额本息、等额本金、组合贷款等多种还款方式
- **通胀调整**：可选择查看实际购买力变化
- **资产对比**：详细对比房产净值与投资净值

#### 🎯 **风险评估**
- **压力测试**：模拟利率上升、收入下降、房价下跌等极端场景
- **DTI/DSCR指标**：实时计算偿债比和覆盖比
- **风险心跳图**：可视化展示财务波动性
- **承受能力分析**：评估购房能力和财务安全边际

#### 🎨 **可视化工具**
- **支付日历**：美观的日历界面展示还款计划
- **情绪条**：通过本金/利息比例展示还款情绪变化
- **市场情绪调节**：滑块快速调整市场预期参数
- **财富兑换**：将财富差异转换为实物资产（特斯拉、MacBook等）

#### 📚 **知识树系统**
- **19个财务术语**：涵盖贷款、投资、税务、风险、基础概念
- **渐进式解锁**：看完一个术语解锁下一个
- **Markdown渲染**：清晰的格式化内容展示
- **相关术语链接**：构建完整的知识网络

#### 🤖 **AI 智能助手**
- **多模型支持**：
  - Google Gemini (gemini-1.5-flash)
  - Anthropic Claude (claude-3-5-sonnet)
  - OpenAI GPT (gpt-4o-mini)
  - DeepSeek (deepseek-chat)
- **自定义配置**：每个模型独立配置API Key
- **智能对话**：基于您的参数提供个性化建议
- **统一接口**：无缝切换不同AI模型

#### 🎓 **高级功能**
- **目标倒推计算器**：计算达到购房目标所需的投资收益率
- **租房隐性成本**：量化搬家、装修、心理压力等成本
- **现金流预测**：逐月展示现金流状况
- **税费计算**：契税、增值税、个税等详细计算
- **提前还款分析**：对比提前还款与继续投资的收益

### 🎨 设计亮点

- **深色模式**：完美支持深色/浅色主题切换
- **响应式设计**：适配桌面、平板、手机等多种设备
- **流畅动画**：精心设计的过渡动画和交互效果
- **中英双语**：完整的中英文界面切换
- **现代UI**：采用渐变色、毛玻璃效果、卡片设计

### 🛠️ 技术栈

- **前端框架**：React 18 + TypeScript
- **样式方案**：Tailwind CSS
- **图表库**：Recharts
- **图标库**：Lucide React
- **构建工具**：Vite
- **AI集成**：多模型API统一接口

### 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/hollipembletoncrf40-sudo/smart-mortgage-advisor-enhanced.git

# 进入项目目录
cd smart-mortgage-advisor-enhanced

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 📖 使用指南

1. **输入参数**：在左侧面板输入房价、首付、贷款年限等信息
2. **调整市场情绪**：使用滑块快速调整市场预期
3. **查看分析**：右侧面板查看财富曲线、风险评估等多维度分析
4. **学习知识**：点击"知识树"标签学习财务知识
5. **AI咨询**：配置AI模型后，获取个性化建议

### 🎯 核心计算逻辑

#### 买房路径
```
净值 = 当前房价 - 剩余贷款 + 累计租金收入 - 累计月供 - 持有成本
```

#### 租房投资路径
```
净值 = 初始资金 × (1 + 投资收益率)^年数 - 累计租金支出
```

#### 风险指标
- **DTI (偿债比)** = 月供 / 月收入
- **DSCR (覆盖比)** = 租金收入 / 月供

### 📊 数据隐私

- 所有计算在本地浏览器完成
- API Key 加密存储在 localStorage
- 不上传任何个人财务数据到服务器

### 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 📄 开源协议

MIT License

---

<a name="english"></a>

## 🏠 Project Overview

Smart Mortgage Advisor is a comprehensive real estate investment analysis tool that helps users make informed home-buying decisions through visualizations and AI assistance.

### ✨ Key Features

#### 📊 **Wealth Analysis**
- **Wealth Curve Comparison**: Visualize 30-year wealth accumulation difference between buying vs renting
- **Real-time Calculation**: Support multiple repayment methods (equal principal & interest, equal principal, combined loan)
- **Inflation Adjustment**: Optional real purchasing power view
- **Asset Comparison**: Detailed comparison of property equity vs investment returns

#### 🎯 **Risk Assessment**
- **Stress Testing**: Simulate extreme scenarios (rate hikes, income drops, price falls)
- **DTI/DSCR Metrics**: Real-time debt-to-income and coverage ratios
- **Risk Heartbeat Chart**: Visualize financial volatility
- **Affordability Analysis**: Evaluate purchasing power and financial safety margin

#### 🎨 **Visualization Tools**
- **Payment Calendar**: Beautiful calendar interface for repayment schedule
- **Mood Bar**: Visualize repayment emotions through principal/interest ratio
- **Market Sentiment Slider**: Quick adjustment of market expectation parameters
- **Wealth Exchange**: Convert wealth difference into tangible assets (Tesla, MacBook, etc.)

#### 📚 **Knowledge Tree System**
- **19 Financial Terms**: Covering loans, investments, taxes, risks, and basics
- **Progressive Unlock**: Unlock next term after reading current one
- **Markdown Rendering**: Clear formatted content display
- **Related Terms**: Build complete knowledge network

#### 🤖 **AI Assistant**
- **Multi-Model Support**:
  - Google Gemini (gemini-1.5-flash)
  - Anthropic Claude (claude-3-5-sonnet)
  - OpenAI GPT (gpt-4o-mini)
  - DeepSeek (deepseek-chat)
- **Custom Configuration**: Independent API key for each model
- **Smart Conversation**: Personalized advice based on your parameters
- **Unified Interface**: Seamless switching between AI models

#### 🎓 **Advanced Features**
- **Goal Reverse Calculator**: Calculate required investment returns to reach home-buying goal
- **Rent Hidden Costs**: Quantify moving, renovation, and psychological stress costs
- **Cash Flow Projection**: Month-by-month cash flow visualization
- **Tax Calculation**: Detailed deed tax, VAT, and income tax calculations
- **Early Repayment Analysis**: Compare early repayment vs continued investment

### 🎨 Design Highlights

- **Dark Mode**: Perfect dark/light theme support
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Carefully designed transitions and interactions
- **Bilingual**: Complete Chinese/English interface
- **Modern UI**: Gradients, glassmorphism, and card design

### 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **AI Integration**: Unified multi-model API interface

### 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/hollipembletoncrf40-sudo/smart-mortgage-advisor-enhanced.git

# Enter directory
cd smart-mortgage-advisor-enhanced

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### 📖 User Guide

1. **Input Parameters**: Enter property price, down payment, loan term, etc. in left panel
2. **Adjust Market Sentiment**: Use slider to quickly adjust market expectations
3. **View Analysis**: Check wealth curves, risk assessment, and more in right panel
4. **Learn Knowledge**: Click "Knowledge Tree" tab to learn financial concepts
5. **AI Consultation**: Configure AI model to get personalized advice

### 🎯 Core Calculation Logic

#### Buying Path
```
Net Worth = Current Price - Remaining Loan + Cumulative Rent - Cumulative Payment - Holding Costs
```

#### Renting + Investing Path
```
Net Worth = Initial Capital × (1 + Return Rate)^Years - Cumulative Rent Paid
```

#### Risk Metrics
- **DTI (Debt-to-Income)** = Monthly Payment / Monthly Income
- **DSCR (Debt Service Coverage Ratio)** = Rental Income / Monthly Payment

### 📊 Data Privacy

- All calculations performed locally in browser
- API keys encrypted in localStorage
- No personal financial data uploaded to servers

### 🤝 Contributing

Issues and Pull Requests are welcome!

### 📄 License

MIT License

---

<div align="center">

**Made with ❤️ for better financial decisions**

[Report Bug](https://github.com/hollipembletoncrf40-sudo/smart-mortgage-advisor-enhanced/issues) · [Request Feature](https://github.com/hollipembletoncrf40-sudo/smart-mortgage-advisor-enhanced/issues)

</div>
