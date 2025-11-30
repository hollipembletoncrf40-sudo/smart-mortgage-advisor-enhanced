
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
    回答规则：
    1. 风格专业、客观、犀利，直接给出结论，必要时使用 emoji。
    2. 如果用户询问“买房还是买股”，请引用上述对比数据，并结合流动性（房产变现难）和风险偏好给出建议。
    3. 如果风险评分高，请直言不讳地指出问题（如杠杆过高、租金覆盖不足）。特别关注 **总月供负债** 是否过高。如果 DTI 超过 50%，必须明确警告“现金流断裂风险”。
    4. 如果是二套房或多套房，请提示政策风险（如限购限贷）和现金流压力。
    5. 务必提醒用户关注隐性成本（如契税装修）对早期现金流的影响。
    6. 如果通胀率较高，请分析名义收益与真实购买力的差异。
    7. 如果用户有地段评分，请务必针对其短板提出警告（如远郊盘慎重），对长板给予肯定。
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
    return "抱歉，AI 服务连接失败。请检查您的网络或 API Key 设置。";
  }
};
