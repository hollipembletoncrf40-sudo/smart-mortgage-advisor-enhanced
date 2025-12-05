import React, { useState } from 'react';
import { X, BookOpen, Globe, ChevronRight } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLanguage?: 'zh' | 'en';
}

interface SectionData {
  title: string;
  content: string;
}

interface ContentStructure {
  title: string;
  sections: {
    [key: string]: SectionData;
  };
}

const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose, initialLanguage = 'zh' }) => {
  const [language, setLanguage] = useState<'zh' | 'en'>(initialLanguage);
  const [activeSection, setActiveSection] = useState<string>('core');

  if (!isOpen) return null;

  const content: { zh: ContentStructure; en: ContentStructure } = {
    zh: {
      title: '计算原理说明书',
      sections: {
        core: {
          title: '1. 核心回报指标',
          content: `
### 现金回报率 (Cash Return Rate)
**公式**: (年净租金 - 年房贷) / 初始投入

**说明**: 衡量每年现金流相对于初始投入的回报率，正值表示正现金流。

**示例**:
- 年租金: 6万元
- 年房贷: 4万元  
- 初始投入: 100万元
- 现金回报率 = (6 - 4) / 100 = 2%

---

### 综合回报率 (Total Return Rate)
**公式**: (累计现金流 + 房产净值 - 总投入) / 总投入

**说明**: 综合考虑现金流和资产增值的总体回报率。

**组成部分**:
- 累计现金流: 租金收入 - 房贷支出 - 持有成本
- 房产净值: 当前房价 - 剩余贷款
- 总投入: 首付 + 税费 + 装修等初始成本
          `
        },
        loan: {
          title: '2. 贷款模型',
          content: `
### 等额本息 (Equal Principal and Interest)
**月供公式**: 
\`\`\`
月供 = 贷款本金 × [月利率 × (1 + 月利率)^还款月数] / [(1 + 月利率)^还款月数 - 1]
\`\`\`

**特点**:
- 每月还款金额固定
- 前期利息占比高，后期本金占比高
- 适合收入稳定的购房者

**示例** (贷款100万，利率4.2%，30年):
- 月利率 = 4.2% / 12 = 0.35%
- 还款月数 = 30 × 12 = 360
- 月供 ≈ 4,885元

---

### 等额本金 (Equal Principal)
**月供公式**:
\`\`\`
每月本金 = 贷款本金 / 还款月数
每月利息 = 剩余本金 × 月利率
月供 = 每月本金 + 每月利息
\`\`\`

**特点**:
- 每月还款递减
- 总利息支出较少
- 初期还款压力大

**示例** (贷款100万，利率4.2%，30年):
- 每月本金 = 100万 / 360 ≈ 2,778元
- 首月利息 = 100万 × 0.35% = 3,500元
- 首月月供 = 6,278元
- 末月月供 ≈ 2,788元

---

### 组合贷款
**说明**: 公积金贷款 + 商业贷款

**计算方法**:
- 分别计算公积金和商业贷款的月供
- 总月供 = 公积金月供 + 商业贷款月供

**优势**:
- 公积金部分利率低（约3.1%）
- 可贷额度更高
- 综合利率介于两者之间
          `
        },
        risk: {
          title: '3. 风险评估',
          content: `
### DTI (Debt-to-Income Ratio) - 偿债比
**公式**: 月供 / 月收入

**标准**:
- < 30%: 低风险，财务压力小
- 30-50%: 中等风险，需谨慎
- > 50%: 高风险，建议降低贷款额度

**示例**:
- 月供: 8,000元
- 月收入: 20,000元
- DTI = 40% (中等风险)

---

### DSCR (Debt Service Coverage Ratio) - 覆盖比
**公式**: 租金收入 / 月供

**标准**:
- > 1.3: 优秀，租金充分覆盖月供
- 1.0-1.3: 良好，基本覆盖
- < 1.0: 需贴钱，现金流为负

**示例**:
- 月租金: 5,000元
- 月供: 4,000元
- DSCR = 1.25 (良好)

---

### 压力测试
**模拟场景**:
1. **利率上升**: +1-2%
2. **收入下降**: -30-50%
3. **房价下跌**: -20-30%
4. **空置期**: 3-6个月无租金

**目的**: 评估极端情况下的财务安全性
          `
        },
        investment: {
          title: '4. 投资对比',
          content: `
### 买房 vs 租房投资
**买房净值**:
\`\`\`
净值 = 当前房价 - 剩余贷款 + 累计租金 - 累计月供 - 持有成本
\`\`\`

**租房投资净值**:
\`\`\`
净值 = 初始资金 × (1 + 投资收益率)^年数 - 累计租金支出
\`\`\`

**对比维度**:
- 资产增值潜力
- 现金流状况
- 流动性
- 税务影响
- 心理因素

---

### 机会成本
**定义**: 选择买房而放弃的投资收益

**计算**:
\`\`\`
机会成本 = 首付 × 投资收益率 × 年数
\`\`\`

**示例**:
- 首付: 100万
- 投资收益率: 6%
- 10年后机会成本 ≈ 79万

---

### 实际收益率
**公式**: 名义收益率 - 通货膨胀率

**重要性**: 反映购买力的真实增长

**示例**:
- 房产增值: 5%/年
- 通货膨胀: 3%/年
- 实际收益率 = 2%/年
          `
        },
        tax: {
          title: '5. 税费计算',
          content: `
### 契税
**税率**:
- 首套房 ≤90㎡: 1%
- 首套房 90-140㎡: 1.5%
- 首套房 >140㎡: 3%
- 二套房: 3%

**计算**: 房屋总价 × 税率

---

### 增值税
**条件**: 
- 普通住宅满2年免征
- 非普通住宅: (售价 - 购价) × 5.6%

---

### 个人所得税
**计算方式**:
1. 差额20%: (售价 - 购价 - 税费) × 20%
2. 全额1%: 售价 × 1%

**免征条件**: 满五唯一

---

### 持有成本
**包含**:
- 物业费
- 维修基金
- 取暖费（北方）
- 保险费
- 空置期损失
          `
        },
        advanced: {
          title: '6. 高级功能',
          content: `
### 市场情绪调节
**影响参数**:
- 房产增值率: -2% 至 8%
- 投资收益率: 2% 至 8%
- 贷款利率: 3.7% 至 4.7%

**使用场景**: 模拟不同市场环境下的投资表现

---

### 提前还款分析
**计算逻辑**:
1. 计算剩余本金
2. 重新计算月供或缩短年限
3. 对比节省利息 vs 投资收益

**决策依据**:
- 贷款利率 vs 投资收益率
- 现金流需求
- 风险偏好

---

### 现金流预测
**月度现金流**:
\`\`\`
净现金流 = 租金收入 - 月供 - 持有成本
\`\`\`

**累计现金流**: 逐月累加，考虑租金上涨

---

### 财富曲线
**房产净值曲线**:
- 考虑房价增值
- 扣除剩余贷款
- 加上累计租金收益

**投资净值曲线**:
- 复利计算
- 扣除租房成本

**通胀调整**: 可选择查看实际购买力
          `
        },
        formulas: {
          title: '7. 关键公式汇总',
          content: `
### 复利计算
\`\`\`
终值 = 本金 × (1 + 年利率)^年数
\`\`\`

---

### 现值计算
\`\`\`
现值 = 终值 / (1 + 折现率)^年数
\`\`\`

---

### 年化收益率
\`\`\`
年化收益率 = [(终值 / 初值)^(1/年数) - 1] × 100%
\`\`\`

---

### 内部收益率 (IRR)
使用迭代法求解，使净现值(NPV)为0的折现率

---

### 净现值 (NPV)
\`\`\`
NPV = Σ [现金流t / (1 + r)^t] - 初始投资
\`\`\`

---

### 通胀调整
\`\`\`
实际价值 = 名义价值 / (1 + 通胀率)^年数
\`\`\`
          `
        }
      }
    },
    en: {
      title: 'Calculation Methodology',
      sections: {
        core: {
          title: '1. Core Return Metrics',
          content: `
### Cash Return Rate
**Formula**: (Annual Net Rent - Annual Mortgage) / Initial Investment

**Description**: Measures annual cash flow return relative to initial investment. Positive value indicates positive cash flow.

**Example**:
- Annual Rent: ¥60,000
- Annual Mortgage: ¥40,000
- Initial Investment: ¥1,000,000
- Cash Return Rate = (60,000 - 40,000) / 1,000,000 = 2%

---

### Total Return Rate
**Formula**: (Cumulative Cash Flow + Property Net Worth - Total Investment) / Total Investment

**Description**: Comprehensive return rate considering both cash flow and asset appreciation.

**Components**:
- Cumulative Cash Flow: Rental Income - Mortgage - Holding Costs
- Property Net Worth: Current Price - Remaining Loan
- Total Investment: Down Payment + Taxes + Renovation
          `
        },
        loan: {
          title: '2. Loan Models',
          content: `
### Equal Principal and Interest
**Monthly Payment Formula**:
\`\`\`
Payment = Principal × [r × (1 + r)^n] / [(1 + r)^n - 1]
where r = monthly rate, n = number of months
\`\`\`

**Features**:
- Fixed monthly payment
- Higher interest proportion early, higher principal later
- Suitable for stable income earners

**Example** (¥1M loan, 4.2% rate, 30 years):
- Monthly rate = 4.2% / 12 = 0.35%
- Months = 30 × 12 = 360
- Monthly payment ≈ ¥4,885

---

### Equal Principal
**Monthly Payment Formula**:
\`\`\`
Monthly Principal = Loan Principal / Number of Months
Monthly Interest = Remaining Principal × Monthly Rate
Payment = Monthly Principal + Monthly Interest
\`\`\`

**Features**:
- Decreasing monthly payments
- Lower total interest
- Higher initial payment pressure

**Example** (¥1M loan, 4.2% rate, 30 years):
- Monthly Principal = ¥1M / 360 ≈ ¥2,778
- First Month Interest = ¥1M × 0.35% = ¥3,500
- First Payment = ¥6,278
- Last Payment ≈ ¥2,788

---

### Combined Loan
**Description**: Housing Provident Fund + Commercial Loan

**Calculation**:
- Calculate each loan separately
- Total Payment = HPF Payment + Commercial Payment

**Advantages**:
- Lower HPF rate (~3.1%)
- Higher total loan amount
- Blended interest rate
          `
        },
        risk: {
          title: '3. Risk Assessment',
          content: `
### DTI (Debt-to-Income Ratio)
**Formula**: Monthly Payment / Monthly Income

**Standards**:
- < 30%: Low risk, manageable
- 30-50%: Medium risk, caution advised
- > 50%: High risk, reduce loan amount

**Example**:
- Monthly Payment: ¥8,000
- Monthly Income: ¥20,000
- DTI = 40% (Medium Risk)

---

### DSCR (Debt Service Coverage Ratio)
**Formula**: Rental Income / Monthly Payment

**Standards**:
- > 1.3: Excellent, rent fully covers payment
- 1.0-1.3: Good, basically covered
- < 1.0: Negative cash flow

**Example**:
- Monthly Rent: ¥5,000
- Monthly Payment: ¥4,000
- DSCR = 1.25 (Good)

---

### Stress Testing
**Scenarios**:
1. **Rate Increase**: +1-2%
2. **Income Decrease**: -30-50%
3. **Price Drop**: -20-30%
4. **Vacancy**: 3-6 months no rent

**Purpose**: Assess financial safety in extreme conditions
          `
        },
        investment: {
          title: '4. Investment Comparison',
          content: `
### Buy vs Rent + Invest
**Buying Net Worth**:
\`\`\`
Net Worth = Current Price - Remaining Loan + Cumulative Rent - Cumulative Payment - Holding Costs
\`\`\`

**Renting + Investing Net Worth**:
\`\`\`
Net Worth = Initial Capital × (1 + Return Rate)^Years - Cumulative Rent Paid
\`\`\`

**Comparison Dimensions**:
- Asset appreciation potential
- Cash flow status
- Liquidity
- Tax implications
- Psychological factors

---

### Opportunity Cost
**Definition**: Investment returns forgone by choosing to buy

**Calculation**:
\`\`\`
Opportunity Cost = Down Payment × Investment Return × Years
\`\`\`

**Example**:
- Down Payment: ¥1M
- Investment Return: 6%
- 10-year opportunity cost ≈ ¥790K

---

### Real Return Rate
**Formula**: Nominal Return - Inflation Rate

**Importance**: Reflects true purchasing power growth

**Example**:
- Property Appreciation: 5%/year
- Inflation: 3%/year
- Real Return = 2%/year
          `
        },
        tax: {
          title: '5. Tax Calculations',
          content: `
### Deed Tax
**Rates**:
- First home ≤90㎡: 1%
- First home 90-140㎡: 1.5%
- First home >140㎡: 3%
- Second home: 3%

**Calculation**: Total Price × Tax Rate

---

### Value-Added Tax
**Conditions**:
- Ordinary residence 2+ years: Exempt
- Non-ordinary: (Sale Price - Purchase Price) × 5.6%

---

### Personal Income Tax
**Methods**:
1. Difference 20%: (Sale - Purchase - Taxes) × 20%
2. Full 1%: Sale Price × 1%

**Exemption**: 5+ years and only property

---

### Holding Costs
**Includes**:
- Property management fees
- Maintenance fund
- Heating (Northern China)
- Insurance
- Vacancy losses
          `
        },
        advanced: {
          title: '6. Advanced Features',
          content: `
### Market Sentiment Adjustment
**Affected Parameters**:
- Property Appreciation: -2% to 8%
- Investment Return: 2% to 8%
- Loan Rate: 3.7% to 4.7%

**Use Case**: Simulate performance in different market conditions

---

### Early Repayment Analysis
**Logic**:
1. Calculate remaining principal
2. Recalculate payment or shorten term
3. Compare interest saved vs investment returns

**Decision Factors**:
- Loan rate vs Investment return
- Cash flow needs
- Risk preference

---

### Cash Flow Projection
**Monthly Cash Flow**:
\`\`\`
Net Cash Flow = Rental Income - Payment - Holding Costs
\`\`\`

**Cumulative**: Month-by-month accumulation with rent increases

---

### Wealth Curves
**Property Net Worth Curve**:
- Consider price appreciation
- Deduct remaining loan
- Add cumulative rental income

**Investment Net Worth Curve**:
- Compound interest calculation
- Deduct rental expenses

**Inflation Adjustment**: Optional real purchasing power view
          `
        },
        formulas: {
          title: '7. Key Formulas Summary',
          content: `
### Compound Interest
\`\`\`
Future Value = Principal × (1 + Annual Rate)^Years
\`\`\`

---

### Present Value
\`\`\`
Present Value = Future Value / (1 + Discount Rate)^Years
\`\`\`

---

### Annualized Return
\`\`\`
Annualized Return = [(Final / Initial)^(1/Years) - 1] × 100%
\`\`\`

---

### Internal Rate of Return (IRR)
Iterative method to find discount rate where NPV = 0

---

### Net Present Value (NPV)
\`\`\`
NPV = Σ [Cash Flowt / (1 + r)^t] - Initial Investment
\`\`\`

---

### Inflation Adjustment
\`\`\`
Real Value = Nominal Value / (1 + Inflation Rate)^Years
\`\`\`
          `
        }
      }
    }
  };

  const currentContent = content[language];
  const sections = Object.entries(currentContent.sections);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{currentContent.title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {language === 'zh' ? 'English' : '中文'}
              </span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar Navigation */}
          <div className="w-64 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900/50">
            <div className="space-y-2">
              {sections.map(([key, section]: [string, SectionData]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    activeSection === key
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{section.title}</span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${activeSection === key ? 'rotate-90' : ''}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="space-y-6">
                {(() => {
                  const activeContent = sections.find(([key]) => key === activeSection);
                  if (!activeContent) return null;
                  const [, sectionData]: [string, SectionData] = activeContent as [string, SectionData];
                  return sectionData.content.split('---').map((section, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div 
                        className="text-slate-700 dark:text-slate-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: section
                            .replace(/###\s+(.+)/g, '<h3 class="text-lg font-bold text-slate-800 dark:text-white mb-3">$1</h3>')
                            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-slate-800 dark:text-white">$1</strong>')
                            .replace(/```([\s\S]+?)```/g, '<pre class="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm my-3"><code>$1</code></pre>')
                            .replace(/`(.+?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">$1</code>')
                            .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
                            .replace(/\n\n/g, '<br/><br/>')
                        }}
                      />
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodologyModal;
