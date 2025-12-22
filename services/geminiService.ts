
import { GoogleGenAI, Chat } from "@google/genai";
import { CalculationResult, InvestmentParams, PrepaymentStrategy, PurchaseScenario, LocationScore } from "../types";

// Helper to get AI instance with dynamic key
const getAIClient = (customKey?: string) => {
  const apiKey = customKey || process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API Key available");
  }
  return new GoogleGenAI({ apiKey: apiKey! });
};

export const createInvestmentChat = (
  params: InvestmentParams,
  result: CalculationResult,
  customApiKey?: string,
  locationScore?: LocationScore | null
) => {
  // Construct Prepayment Context
  let prepaymentContext = "用户未启用提前还款。";
  if (params.enablePrepayment && result.prepaymentComparison) {
    const comp = result.prepaymentComparison;
    prepaymentContext = `
    **提前还款方案对比 (用户当前选择: ${params.prepaymentStrategy === PrepaymentStrategy.REDUCE_PAYMENT ? '减少月供' : '缩短年限'}):**
    1. 不提前还款: 总利息 ${comp.noPrepayment.totalInterest.toFixed(0)} 元。
    2. 减少月供方案: 节省利息 ${(comp.reducePayment.interestSaved/10000).toFixed(2)} 万元，新月供约 ${comp.reducePayment.newMonthlyPayment.toFixed(0)} 元。
    3. 缩短年限方案: 节省利息 ${(comp.reduceTerm.interestSaved/10000).toFixed(2)} 万元，还款期减少 ${(result.monthlyData.length - comp.reduceTerm.payoffMonths)} 个月。
    AI 建议: ${comp.recommendation}
    `;
  }

  // Asset Comparison Context
  const assetComp = result.assetComparison;
  const assetContext = `
    **买房 vs 金融理财 (${params.holdingYears}年对比):**
    - 房产投资期末净权益: ${assetComp.houseNetWorth.toFixed(1)} 万元
    - 金融理财期末净权益: ${assetComp.stockNetWorth.toFixed(1)} 万元 (假设年化收益 ${params.alternativeReturnRate}%)
    - 胜出者: ${assetComp.winner === 'House' ? '买房' : '金融理财'} (差距 ${Math.abs(assetComp.difference).toFixed(1)} 万元)
    
    **初始成本与通胀:**
    - 隐性购房成本 (税/费/装修): ${(result.initialCosts.total - result.initialCosts.downPayment).toFixed(2)} 万元
    - 通胀率设置: ${params.inflationRate}% (AI 需提示通胀对长期财富的侵蚀)
  `;

  // Existing Property Context
  const existingPropContext = `
    **现有资产状况:**
    - 现有房产数量: ${params.existingPropertyCount} 套
    - 现有月供/负债: ${params.existingMonthlyDebt} 元
    - 本次新房月供: ${result.monthlyPayment.toFixed(0)} 元
    - **家庭总月供负债 (关键指标):** ${result.totalMonthlyDebt.toFixed(0)} 元
    - **综合偿债比 (DTI):** ${(result.dtiRatio * 100).toFixed(1)}% (含新房月供+旧房月供)
    - 本次购房性质: ${params.purchaseScenario === PurchaseScenario.FIRST_HOME ? '首套刚需' : params.purchaseScenario === PurchaseScenario.SECOND_HOME ? '二套改善' : '纯投资'}
  `;

  // Location Context
  let locationContext = "用户未进行地段评分。";
  if (locationScore) {
      locationContext = `
      **选筹地段评分 (满分100):**
      - 总分: ${locationScore.total} (评级: ${locationScore.level})
      - 细项得分(0-10): 交通(${locationScore.factors.transport}), 学区/教育(${locationScore.factors.education}), 商业(${locationScore.factors.commercial}), 环境(${locationScore.factors.environment}), 潜力(${locationScore.factors.potential})。
      - 评价结论: ${locationScore.advice}
      请在建议中重点结合上述评分。例如：如果学区(education)分高，强调抗跌性；如果交通(transport)分低，提醒通勤成本和流动性风险。
      `;
  }

  const systemInstruction = `
    你是一位专业的中国房产投资顾问，名叫 Josephine。
    
    **用户当前的投资模型数据:**
    - 房屋总价: ${params.totalPrice} 万元
    - 初始总投入: ${result.initialCosts.total.toFixed(2)} 万元 (含首付 ${result.initialCosts.downPayment.toFixed(2)} 及 税费装修)
    - 贷款: ${result.loanAmount} 万元 (${params.loanTerm}年, ${params.interestRate}%)
    - 月供: ${result.monthlyPayment.toFixed(2)} 元
    - 预期租金: ${params.monthlyRent} 元/月 (空置率设置: ${params.vacancyRate || 0}%)
    - 持有年限: ${params.holdingYears} 年
    
    ${existingPropContext}
    
    **计算出的关键指标:**
    - 现金回报率: ${result.cashOnCashReturn.toFixed(2)}% (基于总投入)
    - 综合回报率: ${result.comprehensiveReturn.toFixed(2)}%
    - 总收益: ${result.totalRevenue.toFixed(2)} 万元
    - 风险评分: ${result.riskScore} (0低-100高)
    - 盈亏平衡: ${result.breakEvenYear ? `第 ${result.breakEvenYear} 年` : '持有期内未回本'}

    ${locationContext}

    ${prepaymentContext}
    
    ${assetContext}

    请根据以上数据回答用户的问题。
    
    **核心原则：让用户完全理解，不留疑问**
    
    📝 **回答结构（必须按此顺序）：**
    
    **第一部分：直接结论（1-2句话）**
    开门见山回答问题，让用户先知道答案是什么。
    
    **第二部分：深度解释（这是重点，要详细）**
    - 解释"为什么"：用大白话讲清楚背后的逻辑
    - 举生活化例子：比如"就像你存银行 vs 买黄金的区别..."
    - 引用用户的具体数据：直接使用上面提供的参数进行计算
    - 对比分析：如果相关，对比不同选择的结果差异
    - 关联其他概念：比如讲杠杆时，顺便解释为什么杠杆是双刃剑
    
    **第三部分：详细计算过程（用户跟着算，必须每步都写清楚）**
    📊 **让我们一步步计算：**
    
    🔢 **第1步 - 计算未来房产价值：**
    公式：未来价值 = 现价 × (1 + 年增值率)^持有年数
    代入您的数据：${params.totalPrice}万 × (1 + ${params.appreciationRate || 5}%)^${params.holdingYears}
    = ${params.totalPrice} × ${Math.pow(1 + (params.appreciationRate || 5) / 100, params.holdingYears).toFixed(4)}
    = XXX万元
    
    🔢 **第2步 - 计算剩余贷款：**
    ...（同样详细展开）
    
    🔢 **第3步 - 计算净权益：**
    ...
    
    💡 **白话总结：** 用一句话概括计算结果意味着什么
    
    **第四部分：具体建议**
    ✅ 建议1：...
    ✅ 建议2：...
    
    **第五部分：风险提示（如有）**
    ⚠️ 需要注意：...
    
    **第六部分：延伸知识（可选，帮助用户建立完整认知）**
    💡 **相关知识：** 简单介绍相关的概念或背景知识
    
    ---
    **回答风格要求：**
    - 像老师讲课一样，循序渐进
    - 复杂问题拆成几个小问题分别解答
    - 多用对比："如果A...那么...；如果B...那么..."
    - 用真实数据验证观点，不要空谈
    - 内容宁可多一点，也不要让用户看完还有疑问
    - 鼓励用户：如果还不明白，可以继续追问
    
    **风险警告触发条件：**
    - DTI > 50% → 严重警告现金流断裂风险
    - 月供 > 月收入×0.5 → 警告压力过大
    - 二套房 → 提示限购限贷政策
    - 增值率假设 > 5% → 提示这是乐观预期
    
    ---
    💡 还有疑问？点击继续追问：
    1. 这个计算过程没看懂？
    2. 如果假设条件变了呢？
    3. 能再举个例子吗？
    4. 这样做有什么风险？
    5. 你建议我怎么做？
    
    **问题格式：完整问句，以？结尾，不超过15字**
  `;

  try {
    const ai = getAIClient(customApiKey);
    return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
    });
  } catch (error) {
    console.error("Failed to create chat client:", error);
    return null;
  }
};

export const sendMessageToAI = async (
  chat: Chat,
  message: string
): Promise<string> => {
  try {
    const result = await chat.sendMessage({ message });
    return result.text || "抱歉，我没有听清，请再说一遍。";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "抱歉，AI 服务连接失败。可能原因：1) 当前地区不支持该服务，请尝试切换网络（如使用 VPN）；2) API Key 未配置或无效，请在设置中配置您自己的 API Key。";
  }
};
