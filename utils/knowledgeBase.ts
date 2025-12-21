export interface KnowledgeTerm {
  id: string;
  term: string;
  termEn?: string;
  shortDesc: string;
  shortDescEn?: string;
  longDesc: string;
  longDescEn?: string;
  category: 'loan' | 'investment' | 'tax' | 'risk' | 'basic';
  relatedTerms: string[];
  unlockCondition: 'always' | 'first_calculation' | 'comparison_complete' | 'stress_test' | 'goal_set';
  icon?: string;
}

export const knowledgeBase: Record<string, KnowledgeTerm> = {
  lpr: {
    id: 'lpr',
    term: 'LPR',
    termEn: 'LPR (Loan Prime Rate)',
    shortDesc: '贷款市场报价利率，是银行对最优质客户的贷款利率，作为贷款定价的基准。',
    shortDescEn: 'Loan Prime Rate, the benchmark rate for loans.',
    longDesc: `LPR（Loan Prime Rate）是贷款市场报价利率，由18家报价行根据其对最优质客户的贷款利率报价，剔除最高和最低报价后算术平均得出。

**为什么重要？**
- 自2019年起，新发放贷款主要参考LPR定价
- LPR每月20日更新一次，会影响浮动利率贷款的月供
- 分为1年期和5年期以上两个品种

**实际影响：**
假设您的房贷利率是"LPR + 0.5%"，当前5年期LPR为4.2%，那么您的实际利率就是4.7%。如果下月LPR降至4.1%，您的利率也会降至4.6%。`,
    longDescEn: `LPR (Loan Prime Rate) is the benchmark interest rate for loans in China, calculated based on quotes from 18 designated banks.

**Why is it important?**
- Since 2019, new loans are priced based on LPR.
- It helps determine your actual mortgage rate (LPR + Basis Points).
- Updated monthly on the 20th.

**Impact:**
If your rate is "LPR + 50bps" and current 5-year LPR is 4.2%, your rate is 4.7%. If LPR drops to 4.1%, your rate drops to 4.6% (upon repricing date).`,
    category: 'loan',
    relatedTerms: ['fixed_rate', 'floating_rate', 'interest_rate'],
    unlockCondition: 'always'
  },
  
  equal_principal_interest: {
    id: 'equal_principal_interest',
    term: '等额本息',
    termEn: 'Equal Payment',
    shortDesc: '每月还款金额固定，前期利息多、本金少，后期本金多、利息少。',
    shortDescEn: 'Fixed monthly payment. More interest upfront.',
    longDesc: `等额本息是最常见的还款方式，特点是每月还款金额相同，便于规划家庭财务。

**计算原理：**
每月还款 = 贷款本金 × [月利率 × (1+月利率)^还款月数] / [(1+月利率)^还款月数 - 1]

**优缺点：**
✅ 每月还款固定，便于预算
✅ 前期还款压力较小
❌ 总利息支出较多
❌ 前期还款大部分是利息

**适合人群：**
- 收入稳定的工薪族
- 希望每月还款压力均衡的购房者
- 不打算提前还款的人群`,
    longDescEn: `Equal Principal and Interest (Equal Payment).

**Mechanism:**
Monthly payment amount remains the same throughout the loan term.

**Pros & Cons:**
✅ Predictable monthly budget
✅ Lower initial pressure compared to Equal Principal
❌ Higher total interest paid
❌ Initial payments are mostly interest

**Best for:**
- People with stable income
- Those who prefer consistent monthly outflows`,
    category: 'loan',
    relatedTerms: ['equal_principal', 'prepayment', 'interest'],
    unlockCondition: 'first_calculation'
  },

  equal_principal: {
    id: 'equal_principal',
    term: '等额本金',
    termEn: 'Equal Principal',
    shortDesc: '每月偿还固定本金，利息递减，前期还款压力大但总利息少。',
    shortDescEn: 'Fixed principal payment. Monthly payment decreases over time.',
    longDesc: `等额本金还款方式下，每月偿还的本金固定，利息随剩余本金递减。

**计算原理：**
每月本金 = 贷款总额 / 还款月数
每月利息 = 剩余本金 × 月利率
每月还款 = 每月本金 + 每月利息

**优缺点：**
✅ 总利息支出少
✅ 越还越轻松
❌ 前期还款压力大
❌ 需要较强的还款能力

**适合人群：**
- 收入较高且稳定的人群
- 计划提前还款的购房者
- 希望减少总利息支出的人群`,
    longDescEn: `Equal Principal Repayment.

**Mechanism:**
You pay the same amount of principal every month, plus interest on the remaining balance. Total monthly payment decreases over time.

**Pros & Cons:**
✅ Lower total interest
✅ Payment burden decreases
❌ Higher initial monthly payments
❌ Requires higher initial income

**Best for:**
- Those with high repayment capability
- Plans for early repayment`,
    category: 'loan',
    relatedTerms: ['equal_principal_interest', 'prepayment', 'interest'],
    unlockCondition: 'first_calculation'
  },

  annual_return: {
    id: 'annual_return',
    term: '年化收益率',
    termEn: 'Annual Return',
    shortDesc: '投资一年的预期收益率，用于衡量投资回报水平。',
    shortDescEn: 'Expected yearly return rate on investment.',
    longDesc: `年化收益率是把当前收益率（日收益率、周收益率、月收益率）换算成年收益率来计算的理论收益率。

**计算方式：**
年化收益率 = (投资收益 / 本金) / (投资天数 / 365) × 100%

**注意事项：**
⚠️ 年化收益率是理论值，不代表实际收益
⚠️ 过往收益不代表未来表现
⚠️ 需要考虑风险因素

**实际应用：**
在买房vs投资对比中，我们假设租房省下的钱用于投资。如果年化收益率设为6%，意味着您预期每年能获得6%的投资回报。这个数字应该根据您的风险承受能力和投资策略来设定。`,
    longDescEn: `Annualized Rate of Return.

**Calculation:**
Theoretical rate if the investment return was extrapolated to a full year.

**Usage:**
In the Buy vs Rent comparison, we assume savings from renting are invested. A 6% return means you expect your portfolio to grow by 6% annually.

**Note:**
⚠️ Past performance does not guarantee future results.
⚠️ Consider risk adjustment.`,
    category: 'investment',
    relatedTerms: ['compound_interest', 'risk', 'inflation'],
    unlockCondition: 'comparison_complete'
  },

  compound_interest: {
    id: 'compound_interest',
    term: '复利',
    termEn: 'Compound Interest',
    shortDesc: '利滚利，收益再投资产生新收益，是财富增长的核心动力。',
    shortDescEn: 'Interest on interest. Key to wealth growth.',
    longDesc: `复利是指在每经过一个计息期后，都要将所生利息加入本金，以计算下期的利息。

**爱因斯坦名言：**
"复利是世界第八大奇迹，理解它的人赚取它，不理解它的人支付它。"

**计算公式：**
终值 = 本金 × (1 + 利率)^期数

**实例对比：**
投资10万元，年化收益8%：
- 10年后单利：18万元
- 10年后复利：21.6万元
- 差距：3.6万元（20%）

**关键启示：**
- 时间是复利的好朋友
- 越早开始投资，复利效应越明显
- 即使小额投资，长期坚持也能积累可观财富`,
    longDescEn: `Compound Interest.

**Mechanism:**
Earning interest on both the principal and previously earned interest.

**Quote:**
"Compound interest is the eighth wonder of the world." - Einstein

**Example:**
$10k invested at 8% for 10 years:
- Simple Interest: $18k
- Compound Interest: $21.6k

**Takeaway:**
Start early. Time is the most important factor in compounding.`,
    category: 'investment',
    relatedTerms: ['annual_return', 'time_value'],
    unlockCondition: 'comparison_complete'
  },

  inflation: {
    id: 'inflation',
    term: '通货膨胀',
    termEn: 'Inflation',
    shortDesc: '物价普遍上涨，货币购买力下降，影响长期财务规划。',
    shortDescEn: 'General increase in prices and fall in purchasing power.',
    longDesc: `通货膨胀是指货币供应量超过实际需求，导致货币贬值、物价上涨的经济现象。

**对购房决策的影响：**
1. **房贷是"好债务"**：固定利率贷款在通胀环境下，实际还款负担会降低
2. **现金贬值**：持有现金会因通胀而贬值
3. **资产保值**：房产等实物资产通常能对抗通胀

**实际案例：**
假设年通胀率3%：
- 今天的100万，10年后购买力约等于74万
- 今天月供1万元，10年后实际负担约等于7400元

**应对策略：**
✓ 适度负债购买资产
✓ 投资能跑赢通胀的产品
✓ 避免长期持有大量现金`,
    longDescEn: `Inflation.

**Mechanism:**
Currency loses value over time as prices rise.

**Impact on Housing:**
1. **Debt Dilution**: Fixed-rate debt becomes "cheaper" in real terms.
2. **Asset Hedge**: Real estate values often rise with inflation.
3. **Cash Drag**: Holding cash loses purchasing power.

**Example (3% Inflation):**
- $1M today = $740k purchasing power in 10 years.
- $10k mortgage payment today = $7.4k real burden in 10 years.`,
    category: 'basic',
    relatedTerms: ['real_return', 'purchasing_power'],
    unlockCondition: 'always'
  },

  down_payment: {
    id: 'down_payment',
    term: '首付比例',
    termEn: 'Down Payment Ratio',
    shortDesc: '购房时需要支付的首笔款项占房价的比例，影响贷款额度和月供。',
    shortDescEn: 'Initial upfront payment as a percentage of total price.',
    longDesc: `首付比例是购房时必须自己支付的资金占房屋总价的百分比，剩余部分可以通过贷款支付。

**政策规定：**
- 首套房：通常20-30%
- 二套房：通常40-50%
- 具体比例因城市政策而异

**首付比例的影响：**
1. **月供压力**：首付越高，贷款越少，月供越低
2. **利息总额**：首付越高，总利息越少
3. **资金占用**：首付越高，占用流动资金越多

**策略建议：**
- 首付不是越高越好，要平衡流动性
- 保留一定现金应对突发情况
- 考虑投资机会成本`,
    longDescEn: `Down Payment Ratio.

**Overview:**
The percentage of the home price you pay upfront.

**Typical Rates:**
- First Home: 20-30%
- Second Home: 40-50%

**Trade-offs:**
Higher down payment = Lower monthly payment & Less interest paid.
Lower down payment = Higher leverage & More cash on hand for other investments.`,
    category: 'loan',
    relatedTerms: ['ltv', 'monthly_payment'],
    unlockCondition: 'always'
  },

  prepayment: {
    id: 'prepayment',
    term: '提前还款',
    termEn: 'Prepayment',
    shortDesc: '在贷款期限内提前偿还部分或全部贷款，可减少利息支出。',
    shortDescEn: 'Paying off loan early to save interest.',
    longDesc: `提前还款是指借款人在贷款到期日前，提前偿还部分或全部贷款本金。

**两种方式：**
1. **缩短年限**：保持月供不变，减少还款年限
2. **减少月供**：保持年限不变，降低每月还款额

**是否应该提前还款？**
需要对比：
- 贷款利率 vs 投资收益率
- 如果投资收益率 > 贷款利率，不建议提前还
- 如果贷款利率 > 投资收益率，建议提前还

**注意事项：**
⚠️ 部分银行有提前还款违约金
⚠️ 需要保留应急资金
⚠️ 考虑资金的流动性需求

**最佳时机：**
- 等额本息：前1/3期限内提前还款效果最好
- 等额本金：越早还越划算`,
    longDescEn: `Prepayment.

**Methods:**
1. **Reduce Term**: Keep monthly payment same, finish loan earlier. (Saves most interest)
2. **Reduce Payment**: Lower monthly payment, same term. (Improves cash flow)

**Decision Logic:**
Compare Mortgage Rate vs. Investment Return Rate.
- If Invest Rate > Mortgage Rate: Don't prepay. Invest instead.
- If Mortgage Rate > Invest Rate: Prepay.

**Note:**
Check for prepayment penalties and keep emergency funds!`,
    category: 'loan',
    relatedTerms: ['equal_principal_interest', 'interest', 'opportunity_cost'],
    unlockCondition: 'first_calculation'
  },

  opportunity_cost: {
    id: 'opportunity_cost',
    term: '机会成本',
    termEn: 'Opportunity Cost',
    shortDesc: '选择一项投资时放弃的其他投资机会的潜在收益。',
    shortDescEn: 'Potential gain given up when choosing one alternative over another.',
    longDesc: `机会成本是指为了得到某种东西而必须放弃的东西的价值。

**在买房决策中的应用：**
- 买房的机会成本 = 首付和月供资金用于投资的潜在收益
- 租房的机会成本 = 错过房价上涨和资产积累的机会

**经典案例：**
2015年，您有100万：
- 选择A：付首付买房（房价翻倍）→ 现在资产300万+
- 选择B：投资股市（收益50%）→ 现在资产150万
- 选择A的机会成本 = 放弃的股市收益50万
- 但选择B的机会成本 = 放弃的房产增值150万+

**决策建议：**
- 没有完美的选择，只有相对合适的选择
- 要基于自己的风险承受能力
- 考虑多元化配置，降低机会成本`,
    longDescEn: `Opportunity Cost.

**Definition:**
The value of the next-best alternative foregone.

**In Real Estate:**
Buying a house locks up your capital (down payment). The opportunity cost is the return you COULD have earned if you invested that money in stocks/bonds instead.

Conversely, renting has an opportunity cost of missing out on potential property appreciation and leverage benefits.`,
    category: 'basic',
    relatedTerms: ['annual_return', 'risk'],
    unlockCondition: 'comparison_complete'
  },

  stress_test: {
    id: 'stress_test',
    term: '压力测试',
    termEn: 'Stress Test',
    shortDesc: '模拟极端市场情况下的财务状况，评估风险承受能力。',
    shortDescEn: 'Simulating extreme scenarios to test financial resilience.',
    longDesc: `压力测试是指在极端不利情况下，测试投资组合或财务计划的抗风险能力。

**常见压力情景：**
1. **利率上升**：房贷利率上涨1-2%
2. **收入下降**：失业或收入减少30-50%
3. **房价下跌**：房产价值下降20-30%
4. **投资亏损**：投资组合亏损30-50%

**为什么要做压力测试？**
- 评估最坏情况下的财务安全性
- 提前制定应对预案
- 避免过度杠杆

**应对策略：**
✓ 保持6-12个月的应急储备金
✓ 控制负债率在可承受范围内
✓ 多元化收入来源
✓ 购买必要的保险`,
    longDescEn: `Stress Test.

**Purpose:**
To see if you can survive financially if things go wrong.

**Common Scenarios:**
1. Rate Hike: Interest rate goes up by 1-2%.
2. Income Loss: Unemployment or pay cut.
3. Market Crash: Property value drops 20-30%.

**Advice:**
Ensure you have 6-12 months of emergency funds and keep DTI (Debt-to-Income) ratio safe (<50%).`,
    category: 'risk',
    relatedTerms: ['opportunity_cost', 'down_payment'],
    unlockCondition: 'stress_test'
  },

  ltv: {
    id: 'ltv',
    term: 'LTV (贷款价值比)',
    termEn: 'LTV (Loan-to-Value)',
    shortDesc: '贷款金额占房产价值的比例，是银行评估风险的重要指标。',
    shortDescEn: 'Loan amount divided by property value.',
    longDesc: `LTV (Loan-to-Value Ratio) 是贷款金额与房产评估价值的比率。

**计算公式：**
LTV = (贷款金额 / 房产价值) × 100%

**示例：**
- 房价：100万
- 首付：30万
- 贷款：70万
- LTV = 70%

**LTV的影响：**
1. **贷款审批**：LTV越低，审批越容易
2. **利率优惠**：低LTV通常能获得更优惠利率
3. **风险控制**：银行通常要求LTV不超过70-80%

**优化建议：**
- 增加首付降低LTV
- 选择评估价值高的房产
- 考虑组合贷款方式`,
    longDescEn: `LTV (Loan-to-Value Ratio).

**Formula:**
LTV = (Loan Amount / Property Value) × 100%

**Significance:**
Higher LTV = Higher Risk for banks = Higher Interest Rate (usually).
Banks typically cap LTV at 70-80%.

**Example:**
$1M Home, $300k Down => $700k Loan => 70% LTV.`,
    category: 'loan',
    relatedTerms: ['down_payment', 'interest_rate'],
    unlockCondition: 'first_calculation'
  },

  deed_tax: {
    id: 'deed_tax',
    term: '契税',
    termEn: 'Deed Tax',
    shortDesc: '购买房产时需要缴纳的税费，根据房屋面积和是否首套有不同税率。',
    shortDescEn: 'Tax paid upon property transfer.',
    longDesc: `契税是在土地、房屋权属转移时，向承受人征收的一种税。

**税率标准：**
- 首套房90㎡以下：1%
- 首套房90-140㎡：1.5%
- 首套房140㎡以上：3%
- 二套房：3%

**计算示例：**
购买首套120㎡住房，总价200万：
契税 = 200万 × 1.5% = 3万元

**注意事项：**
⚠️ 各地政策可能有差异
⚠️ 需在规定时间内缴纳
⚠️ 缴纳后才能办理产权证

**节税技巧：**
- 首套房优先选择90-140㎡
- 了解当地优惠政策
- 合理规划购房时间`,
    longDescEn: `Deed Tax.

**Overview:**
A tax levied on the transfer of property title.

**Typical Rates in China:**
- First Home < 90sqm: 1%
- First Home 90-140sqm: 1.5%
- Larger/Second Home: 3%

**Note:**
Must be paid to receive the property title certificate.`,
    category: 'tax',
    relatedTerms: ['down_payment'],
    unlockCondition: 'first_calculation'
  },

  fixed_rate: {
    id: 'fixed_rate',
    term: '固定利率',
    termEn: 'Fixed Rate',
    shortDesc: '贷款期间利率保持不变，月供固定，便于长期规划。',
    shortDescEn: 'Interest rate remains the same throughout loan term.',
    longDesc: `固定利率是指在整个贷款期限内，利率保持不变的贷款方式。

**优点：**
✅ 月供固定，便于预算
✅ 规避利率上涨风险
✅ 心理压力小

**缺点：**
❌ 初始利率通常较高
❌ 无法享受降息红利
❌ 提前还款可能有违约金

**适合人群：**
- 预期未来利率上涨
- 希望月供稳定的保守型购房者
- 收入固定的工薪族

**vs 浮动利率：**
固定利率适合利率上行周期，浮动利率适合利率下行周期。`,
    longDescEn: `Fixed Interest Rate.

**Mechanism:**
The rate is locked in when you take the loan and won't change.

**Pros & Cons:**
✅ Stability and predictability
✅ Protection against rate hikes
❌ Usually higher initial rate than floating
❌ No benefit if market rates drop

**Best for:**
- Conservative borrowers
- Financing during low-rate environment before hikes`,
    category: 'loan',
    relatedTerms: ['lpr', 'floating_rate'],
    unlockCondition: 'first_calculation'
  },

  floating_rate: {
    id: 'floating_rate',
    term: '浮动利率',
    termEn: 'Floating Rate',
    shortDesc: '利率随市场变化而调整，通常与LPR挂钩。',
    shortDescEn: 'Rate adjusts with market benchmarks (LPR).',
    longDesc: `浮动利率是指贷款利率会随着市场基准利率（如LPR）的变化而调整。

**调整机制：**
- 通常每年调整一次
- 调整日期可选择（如每年1月1日）
- 利率 = LPR + 固定加点

**优点：**
✅ 初始利率较低
✅ 可享受降息红利
✅ 灵活性高

**缺点：**
❌ 月供不确定
❌ 利率上涨风险
❌ 需要关注市场动态

**风险控制：**
- 设定利率上限预警
- 保留应急资金
- 考虑提前还款`,
    longDescEn: `Floating (Variable) Interest Rate.

**Mechanism:**
The rate changes periodically based on a benchmark (like LPR).

**Pros & Cons:**
✅ Often lower initial rate
✅ Benefit from rate cuts
❌ Uncertainty in monthly payments
❌ Risk of rate hikes

**Best for:**
- Short-term holders
- High-rate environment (expecting cuts)`,
    category: 'loan',
    relatedTerms: ['lpr', 'fixed_rate'],
    unlockCondition: 'first_calculation'
  },

  emergency_fund: {
    id: 'emergency_fund',
    term: '应急储备金',
    termEn: 'Emergency Fund',
    shortDesc: '用于应对突发情况的流动资金，建议保留3-6个月生活费。',
    shortDescEn: 'Cash reserve for unexpected expenses (3-6 months).',
    longDesc: `应急储备金是预留的用于应对突发事件的流动资金。

**建议金额：**
- 单身：3-6个月生活费
- 已婚无孩：6-9个月
- 有孩家庭：9-12个月

**计算示例：**
月支出1万元，建议储备：
- 最低：3万（3个月）
- 理想：6-10万（6-10个月）

**存放方式：**
1. 活期存款（随时可取）
2. 货币基金（T+1到账）
3. 短期理财（流动性好）

**重要性：**
⚠️ 避免因突发事件被迫卖房
⚠️ 防止断供影响征信
⚠️ 保障基本生活质量

**与买房的关系：**
买房后仍需保留足够应急金，不要把所有积蓄都用于首付。`,
    longDescEn: `Emergency Fund.

**Concept:**
Liquid cash set aside for unplanned expenses (job loss, medical, repairs).

**Rule of Thumb:**
Keep 3-6 months of living expenses (including mortgage).

**Importance:**
Prevents you from being forced to sell assets (like your house) at a bad time due to liquidity shock.`,
    category: 'risk',
    relatedTerms: ['stress_test', 'down_payment'],
    unlockCondition: 'stress_test'
  },

  real_return: {
    id: 'real_return',
    term: '实际收益率',
    termEn: 'Real Return',
    shortDesc: '扣除通货膨胀后的真实收益率，反映购买力的实际增长。',
    shortDescEn: 'Return adjusted for inflation.',
    longDesc: `实际收益率 = 名义收益率 - 通货膨胀率

**为什么重要？**
名义收益看起来不错，但扣除通胀后可能在贬值。

**计算示例：**
- 投资收益：5%
- 通货膨胀：3%
- 实际收益：2%

这意味着你的购买力只增长了2%。

**投资建议：**
✓ 关注实际收益，不被名义收益迷惑
✓ 选择能跑赢通胀的投资
✓ 长期投资更能抵御通胀

**房产投资：**
房产通常被视为抗通胀资产，因为：
- 房价往往随通胀上涨
- 租金收入可调整
- 实物资产保值`,
    longDescEn: `Real Rate of Return.

**Formula:**
Real Return ≈ Nominal Return - Inflation Rate

**Significance:**
It tells you if you are actually getting richer in purchasing power.
If your bank gives 2% interest but inflation is 3%, your real return is -1%.

**Real Estate:**
Often considered good inflation hedge as rents and values tend to rise with price levels.`,
    category: 'investment',
    relatedTerms: ['inflation', 'annual_return'],
    unlockCondition: 'comparison_complete'
  },

  purchasing_power: {
    id: 'purchasing_power',
    term: '购买力',
    termEn: 'Purchasing Power',
    shortDesc: '货币能够购买商品和服务的能力，会随通胀而下降。',
    shortDescEn: 'Value of currency expressed in terms of goods/services.',
    longDesc: `购买力是指一定数量的货币能够购买的商品和服务的数量。

**通胀对购买力的影响：**
假设年通胀率3%：
- 今天的100万
- 10年后相当于74万
- 20年后相当于55万
- 30年后相当于41万

**保护购买力的方法：**
1. **投资增值资产**
   - 股票、基金
   - 房产
   - 黄金

2. **避免长期持有现金**
   - 现金会贬值
   - 至少要跑赢通胀

3. **合理负债**
   - 固定利率贷款在通胀环境下实际负担降低
   - 用未来贬值的钱还今天的债

**买房决策：**
- 房贷是"好债务"
- 用今天的钱买房，用未来贬值的钱还贷
- 房产本身可能增值`,
    longDescEn: `Purchasing Power.

**Concept:**
What your money can buy. Inflation erodes this.

**Example:**
At 3% inflation, $100 today buys only ~$50 worth of goods in 24 years.

**Strategy:**
Invest in assets (stocks, real estate) that grow faster than inflation to preserve purchasing power. Mortgage debt can be a hedge (repaying fixed amount with depreciated currency).`,
    category: 'basic',
    relatedTerms: ['inflation', 'real_return'],
    unlockCondition: 'always'
  },

  time_value: {
    id: 'time_value',
    term: '货币时间价值',
    termEn: 'Time Value of Money',
    shortDesc: '今天的1元钱比未来的1元钱更有价值。',
    shortDescEn: 'Money available now is worth more than the same amount later.',
    longDesc: `货币时间价值是指货币随时间推移而产生的增值。

**核心概念：**
今天的1万元 > 1年后的1万元

**原因：**
1. 可以投资获得收益
2. 通货膨胀导致贬值
3. 机会成本

**实际应用：**

**提前还贷决策：**
- 如果投资收益 > 贷款利率：不建议提前还
- 如果贷款利率 > 投资收益：建议提前还

**示例：**
- 房贷利率：4%
- 投资收益：6%
- 结论：保留资金投资，不提前还贷

**现值与终值：**
- 现值：未来资金折算到现在的价值
- 终值：现在资金在未来的价值

**买房启示：**
- 早买房可能更划算（房价上涨 + 货币贬值）
- 合理利用杠杆
- 时间是财富增长的朋友`,
    longDescEn: `Time Value of Money (TVM).

**Core Principle:**
A dollar today is worth more than a dollar tomorrow because of its potential earning capacity (interest/investment).

**Application:**
- **Mortgage:** Delaying payments (via 30yr loan) allows you to invest that cash elsewhere.
- **Valuation:** Future cash flows (rents) are discounted back to present value to determine fair price.`,
    category: 'basic',
    relatedTerms: ['compound_interest', 'opportunity_cost'],
    unlockCondition: 'comparison_complete'
  }
};

export const knowledgeCategories = {
  loan: { name: '贷款知识', nameEn: 'Loan Knowledge', icon: '🏦', color: '#6366f1' },
  investment: { name: '投资理财', nameEn: 'Investment', icon: '📈', color: '#10b981' },
  tax: { name: '税务政策', nameEn: 'Taxes', icon: '📋', color: '#f59e0b' },
  risk: { name: '风险管理', nameEn: 'Risk Mgmt', icon: '🛡️', color: '#ef4444' },
  basic: { name: '基础概念', nameEn: 'Basics', icon: '📚', color: '#8b5cf6' }
};

export const getTermsByCategory = (category: string): KnowledgeTerm[] => {
  return Object.values(knowledgeBase).filter(term => term.category === category);
};

export const getUnlockedTerms = (userProgress: string[]): KnowledgeTerm[] => {
  return Object.values(knowledgeBase).filter(term => 
    term.unlockCondition === 'always' || userProgress.includes(term.unlockCondition)
  );
};

export const getTerm = (id: string): KnowledgeTerm | undefined => {
  return knowledgeBase[id];
};

export const getNextLockedTerm = (currentTermId: string, userProgress: string[]): KnowledgeTerm | null => {
  const allTerms = Object.values(knowledgeBase);
  const currentIndex = allTerms.findIndex(t => t.id === currentTermId);
  
  // Find next locked term in the same category or any category
  for (let i = currentIndex + 1; i < allTerms.length; i++) {
    const term = allTerms[i];
    if (!userProgress.includes(term.unlockCondition) && term.unlockCondition !== 'always') {
      return term;
    }
  }
  
  return null;
};
