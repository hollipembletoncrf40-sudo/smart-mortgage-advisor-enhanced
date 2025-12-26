
import { Language } from "../types";

export const TRANSLATIONS = {
  ZH: {
    appTitle: "WealthCompass",
    pro: "PRO",
    tutorial: "使用教程",
    buyingProcess: "购房全流程",
    locationGuide: "选筹指南",
    export: "导出",
    exportPdfReport: "导出 PDF 报告",
    exportImagePng: "导出图片 (PNG)",
    exportMarkdown: "导出 Markdown",
    methodology: "计算原理",
    settings: "设置",
    headerPreset: "快速预设",
    headerLogin: "登录",
    headerSave: "保存决策与复盘",
    darkMode: "暗黑模式",
    inputPanelTitle: "投资参数配置",
    baseInfo: "基础信息",
    totalPrice: "房屋总价 (万元)",
    propertyArea: "房屋面积 (㎡)",
    unitPrice: "单价 (元/㎡)",
    communityName: "小区名称",
    district: "所在区域",
    floorLevel: "楼层",
    propertyType: "房屋类型",
    buildingAge: "房龄 (年)",
    decorationStatus: "装修状况",
    propertyRightYears: "产权年限 (年)",
    downPaymentRatio: "首付比例 (%)",
    netDownPayment: "净首付",
    oneTimeCost: "一次性购房成本",
    deedTax: "契税 (%)",
    agencyFee: "中介费 (%)",
    renovationCost: "装修预算 (万)",
    loanScheme: "贷款方案",
    loanType: "贷款方式",
    commercial: "商业",
    provident: "公积金",
    combination: "组合",
    commercialRate: "商贷年利率 (%)",
    providentRate: "公积金利率 (%)",
    providentQuota: "公积金贷款额度 (万)",
    loanTerm: "贷款年限 (年)",
    repaymentMethod: "还款方式",
    equalPrincipalAndInterest: "等额本息",
    equalPrincipal: "等额本金",
    rateAdjustmentPeriod: "利率调整周期 (年)",
    expectedRateChange: "预期利率变化 (%)",
    ltvRatio: "贷款价值比 (LTV)",
    financeAndRepayment: "理财与还款",
    enablePrepayment: "启用提前还款",
    prepaymentYear: "第几年还款",
    prepaymentAmount: "还款金额 (万元)",
    repaymentStrategy: "还款策略",
    reducePayment: "减少月供 (年限不变)",
    reduceTerm: "缩短年限 (月供不变)",
    alternativeReturn: "理财年化收益 (%)",
    inflationRate: "通货膨胀率 (%)",
    revenueAndRisk: "收益与风控",
    holdingYears: "持有年限",
    monthlyRent: "月租金 (元)",
    annualAppreciation: "年涨幅 (%)",
    vacancyRate: "空置率 (%)",
    holdingCostRatio: "持有成本比例 (%)",
    maintenanceCost: "固定维护费 (万/年)",
    existingAssets: "现有资产",
    purchaseScenario: "购房性质",
    firstHome: "首套刚需",
    secondHome: "二套改善",
    investment: "纯投资",
    existingProperties: "现有房产 (套)",
    existingMonthlyDebt: "现有月供 (元)",
    familyIncome: "家庭月收入 (元)",
    monthlyIncome: "家庭月收入",
    cashReturn: "现金回报率",
    comprehensiveReturn: "综合回报率",
    firstMonthPayment: "首月月供",
    totalRevenue: "总收益",
    basedOnRealCost: "基于真实投入",
    includeAppreciation: "含增值",
    coverageRatio: "覆盖比",
    breakEven: "第{year}年回本",
    notBreakEven: "未回本",
    initialFundDistribution: "初始资金去向",
    totalInvestment: "总投入(万)",
    assetComparison: "资产大比拼：买房 vs 理财",
    netWorthAtYear: "{year}年期末净权益",
    houseInvestment: "投资房产",
    financialInvestment: "金融理财",
    winner: "WINNER",
    wealthCurve: "财富增长曲线",
    removeInflation: "去除通胀 (看购买力)",
    removedInflation: "已去除通胀 (真实购买力)",
    detailSchedule: "详细月供",

    riskAssessment: "风险评估",
    lowRisk: "低风险",
    mediumRisk: "中风险",
    highRisk: "高风险",
    safe: "安全",
    warning: "警戒",
    danger: "危险",
    riskExplanation: "风险说明：DTI（债务收入比）超过35%需警惕，超过55%为高风险。压力测试模拟加息后的承压能力。",
    dtiCategory: "DTI (月供收入比)",
    stressTestCategory: "Stress Test (加息压力)",
    antifragileCategory: "Anti-Fragility (反脆弱)",
    monthsReserve: "个月储备",
    cashFlowPressure: "现金流压力",
    leverageRisk: "杠杆风险",
    totalMonthlyDebtLabel: "总月供负债 (新+旧):",
    dtiLabel: "总偿债比 (DTI):",
    dtiAdvice: "* 建议 DTI 保持在 50% 以下",
    financialEKG: "财务波动心电图",
    riskAversion: "风险厌恶度",
    currentVolatility: "当前波动",
    maxTolerance: "承受上限",
    tachycardiaWarning: "心率过速警告！",
    riskWarningDesc: "当前投资组合的波动幅度已超过您的心理承受极限。建议：1. 降低杠杆率 2. 增加稳健资产配置 3. 避免激进的投资假设。",
    healthNormal: "心率正常",
    riskSafeDesc: "当前财务波动在您的舒适区内。您可以尝试适当增加风险以换取更高收益，或保持现状享受稳健增长。",
    aiConsultant: "AI 投资顾问",
    online: "在线",
    inputPlaceholder: "问问我对这个投资的看法...",
    generateReport: "生成报告",
    buyVsInvest: "买房还是买理财？",
    locationReview: "地段点评",

    // Units and Symbols
    currencySymbol: "¥",
    unitWan: "万元",
    unitWanSimple: "万",

    // Tooltips
    tipTotalPrice: '房屋的实际成交总价（不含税费），是计算首付和贷款的基础。',
    tipPropertyArea: '房屋的建筑面积，单位平方米。用于计算单价和判断物业费等成本。',
    tipUnitPrice: '房屋单价 = 总价 ÷ 面积，自动计算，反映房屋性价比。',
    tipCommunityName: '小区或楼盘名称，便于记录和对比不同项目。',
    tipDistrict: '房产所在的行政区域，影响增值潜力和配套设施。',
    tipFloorLevel: '房屋所在楼层，影响采光、视野、噪音和价格。',
    tipPropertyType: '房屋的产品类型，不同类型的持有成本和增值潜力有差异。',
    tipBuildingAge: '房屋建成至今的年限，影响贷款年限和折旧率。',
    tipDecorationStatus: '房屋的装修程度，影响入住成本和转手价值。',
    tipPropertyRightYears: '土地使用权剩余年限，住宅通常为70年，商业40年。',
    tipDownPayment: '购房时首期需要支付的款项比例。一般首套房为30%，二套房可能更高。',
    tipDeedTax: '房屋权属转移时向买方征收的税款。通常首套房90平以下1%，90平以上1.5%。',
    tipAgencyFee: '支付给房产中介的服务费用，通常为成交价的 1% - 3%。',
    tipRenovation: '预计的装修、家具家电购置费用。这属于初始沉没成本，不产生直接利息但占用现金流。',
    tipInterestRate: '银行商业贷款的执行年利率（LPR + 基点）。',
    tipProvidentRate: '住房公积金贷款的年利率，通常低于商贷。',
    tipProvidentQuota: '公积金中心规定的个人或家庭最高可贷额度。',
    tipLoanTerm: '选择贷款还款的总年数，通常最长为30年。年限越长月供越低，但总利息越高。',
    tipRepaymentMethod: '等额本息：每月还款金额固定，前期利息多后期本金多。等额本金：每月还款递减，总利息更少但初期压力大。',
    tipRateAdjustment: '贷款利率重新定价的周期，通常为1年。根据LPR变化调整月供。',
    tipExpectedRateChange: '预期未来利率的年度变化幅度，用于长期规划。正值表示加息，负值表示降息。',
    tipLTV: '贷款金额占房产价值的比例。LTV越高，杠杆越大，风险也越高。银行通常要求LTV不超过70-80%。',
    tipPrepaymentYear: '预计在贷款开始后的第几年进行大额还款。',
    tipPrepaymentAmount: '计划一次性偿还的本金金额。',
    tipAlternativeReturn: '用于计算“机会成本”。即如果不买房，把首付和月供差额拿去理财，预计能获得的年化回报率。',
    tipInflation: '用于计算未来资产的“真实购买力”。即使房价涨了，如果涨幅低于通胀，实际财富可能缩水。',
    tipHoldingYears: '预计持有该房产多少年后卖出。这将影响最终的年化回报率计算。',
    tipMonthlyRent: '预计每月的租金收入。如果不自住也不出租，请填0。',
    tipAppreciation: '预计房价平均每年的增长比例。',
    tipVacancy: '每年房屋处于空置状态（无租金收入）的时间比例。例如 8.3% 约等于每年空置1个月。',
    tipHoldingCost: '每年用于支付物业费、取暖费、维修基金等的费用，占房产总价值的比例。',
    tipMaintenance: '每年固定的房屋维护支出（如家电维修、翻新）。',
    tipExistingProp: '不包含本次计划购买的房产。',
    tipExistingDebt: '您目前每月必须偿还的其他贷款（如车贷、其他房贷、信用贷）。',
    tipFamilyIncome: '家庭每月的税后总收入，用于计算偿债能力（DTI）。',

    // Modals
    buyingProcessTitle: '全流程购房指南',
    buyingStep1Title: '1. 资金与资质准备',
    buyingStep1Desc: '核实购房资格（社保/个税/户口）。确认首付资金来源，预留契税、中介费及装修备用金。',
    buyingStep1Detail: '建议提前拉取征信报告，确保无不良记录影响贷款。',
    buyingStep2Title: '2. 看房选筹',
    buyingStep2Desc: '遵循“地段-配套-户型”原则。白天看采光，晚上看噪音，雨天看渗水。',
    buyingStep2Detail: '利用本工具的“选筹指南”进行打分。关注学区政策和周边未来规划。',
    buyingStep3Title: '3. 签约认购',
    buyingStep3Desc: '签署定金协议或认购书。核实业主身份及房产证真伪（查档）。',
    buyingStep3Detail: '注意合同中的违约责任条款。资金必须进入监管账户，切勿私转业主。',
    buyingStep4Title: '4. 贷款办理',
    buyingStep4Desc: '提交收入证明、银行流水（通常要求月供的2倍）。银行面签，等待批贷函。',
    buyingStep4Detail: '优先选择公积金贷款或组合贷。根据现金流选择等额本金或本息。',
    buyingStep5Title: '5. 缴税过户',
    buyingStep5Desc: '网签备案，缴纳契税、个税及维修基金。去房管局办理过户手续。',
    buyingStep5Detail: '过户后大约 3-7 个工作日可领取新不动产权证（房本）。',
    buyingStep6Title: '6. 收房入住',
    buyingStep6Desc: '物业交割（结清水电燃气费）。实地验房，检查空鼓、门窗及防水。',
    buyingStep6Detail: '拿到钥匙，开启装修或入住。记得更改水电户名。',

    locationGuideTitle: '地段选筹指南 (5-3-2法则)',
    locationIntro: '房地产长期看人口，中期看土地，短期看金融。但核心永远是地段。请根据目标房源实际情况打分。',
    locTransport: '交通通勤 (地铁/主干道)',
    locEducation: '教育医疗 (学区/三甲)',
    locCommercial: '商业配套 (商圈/便利)',
    locEnvironment: '环境宜居 (公园/噪音)',
    locPotential: '未来规划 (产业/拆迁)',
    locTotalScore: '综合选筹得分',
    locRating: '评级',
    applyScore: '应用此评分到 AI 分析',

    // Tour
    tourWelcomeTitle: '欢迎使用',
    tourWelcomeContent: '这是一个专业的房产投资决策工具。它通过量化计算和 AI 分析，帮您做出更明智的买房决定。',
    tourStep1Title: '1. 配置参数',
    tourStep1Content: '在此输入房价、贷款、租金以及隐性成本（税费、装修）。支持商贷、公积金及组合贷款。',
    tourStep2Title: '2. 实时分析',
    tourStep2Content: '查看初始资金分布、回报率、现金流风险和财富增长曲线（支持切换真实购买力）。',
    tourStep3Title: '3. 资产对比',
    tourStep3Content: '纠结买房还是买股？这里直接对比两种方案在持有期结束后的净资产差距，并提供多维度定性分析。',
    tourStep4Title: '4. AI 顾问',
    tourStep4Content: '有不懂的随时问 小慧。她知道您的税费成本和通胀设置，会给出更犀利的建议。',
    tourSkip: '跳过',
    tourNext: '下一步',
    tourStart: '开始使用',
    tourGuide: '新手引导',

    feedbackTitle: '意见反馈',
    submitFeedback: '提交反馈',
    thanksFeedback: '感谢您的反馈!',
    feedbackPlaceholder: '请描述您的问题或建议...',
    feedbackSuccessTitle: '感谢您的反馈!',
    feedbackSuccessDesc: '我们会认真阅读您的建议。',
    feedbackContact: '联系邮箱📮：hollipembletoncrf40@gmail.com',
    
    // Chart Legends
    propertyValue: "房产名义价值",
    realPropertyValue: "房产真实价值",
    stockNetWorth: "理财名义净值",
    realStockNetWorth: "理财真实净值",
    remainingLoan: "剩余贷款",
    
    // Table Headers
    thYear: "年份",
    thPropertyNet: "房产净值",
    thStockNet: "理财净值",
    thDiff: "差异",
    thPayment: "月供",
    thPrincipal: "本金",
    thInterest: "利息",
    thRemainingPrincipal: "剩余本金",
    
    // Schedule Modal
    scheduleTitle: "还款计划详情",
    scheduleSubtitleYear: "前 {n} 年 数据 (含提前还款)",
    scheduleSubtitleMonth: "前 {n} 期 数据 (含提前还款)",
    chartTitleYear: "年度本息与余额走势",
    chartTitleMonth: "月度本息与余额走势",
    legendInterest: "支付利息",
    legendPrincipal: "偿还本金",
    legendRemaining: "剩余本金",
    granularityYear: "按年",
    granularityMonth: "按月",
    
    // Misc
    thDimension: "维度",
    financeClass: "金融小课堂",
    axisYear: "第{v}年",
    noData: "暂无数据，请调整持有年限",
    monthIndex: "第{n}期",
    restartChat: "重新开始对话",
    returnRate: "回报率",
    reportTitle: "投资分析报告",

    // Metric Cards
    metricCashOnCash: "现金回报率",
    metricComprehensive: "综合回报率",
    metricFirstPayment: "首月月供",
    metricTotalRevenue: "总收益",
    subActualInvest: "基于真实投入",
    subIncAppreciation: "含增值",
    subCoverage: "覆盖比",
    subBreakEven: "第{year}年回本",
    subNotBreakEven: "未回本",
    tipCashOnCash: "（年净租金 / 初始实际投入总额）* 100%",
    tipComprehensive: "（总收益 / 总投入）* 100%",
    tipFirstPayment: "租金收入 / 月供",
    tipTotalRevenue: "持有期结束时的总利润",

    // Charts & Analysis
    chartInitialCost: "初始资金去向",
    labelDownPayment: "首付",
    labelDeedTax: "契税",
    labelAgencyFee: "中介费",
    labelRenovation: "装修",
    labelTotalInvest: "总投入(万)",
    labelHouseInvest: "投资房产",
    labelStockInvest: "金融理财",
    labelWinner: "WINNER",

    // AI Chat
    aiTitle: "AI 投资顾问",
    aiPrivateKey: "(私有Key)",
    aiOnline: "在线",
    aiReset: "对话已重置。",
    aiWelcome: "您好！我是您的 AI 投资顾问 小慧。\n\n我已经基于您当前的参数（房价 {price}万, 初始投入 {cost}万）完成了计算。\n\n您可以使用顶部的【选筹指南】对目标地段进行打分，我会结合地段潜力为您提供更具体的建议。",
    aiActionReport: "生成报告",
    aiActionCompare: "买房 vs 理财",
    aiActionLocation: "地段点评",
    aiPlaceholderThinking: "小慧正在思考...",
    aiPlaceholderAsk: "问问我对这个投资的看法...",
    aiMsgReport: "请为我生成一份详细的投资分析报告。",
    aiMsgCompare: "买房还是买理财？",
    aiMsgLocation: "结合我的地段评分，点评一下这个房子的升值潜力。",
    aiError: "出现错误，请检查您的网络连接或 API Key。",

    // Footer & Modals
    footerQuote: '"先求不败，而后求胜。做好最坏的打算，您的投资之路才会更稳健。"',
    footerCreated: "Created by Josephine",
    footerDonate: "赞助打赏",
    footerFeedback: "意见反馈",
    
    settingsTitle: "AI 设置",
    settingsKeyLabel: "自定义 Gemini API Key",
    settingsKeyPlaceholder: "输入以 'AIza' 开头的 Key",
    settingsKeyTip: "Key 将仅存储在您的本地浏览器中。设置后将优先使用此 Key 进行对话。",
    settingsClear: "清除并恢复默认",
    settingsSave: "保存设置",

    donationTitle: "感谢您的支持",
    donationDesc: "开发不易，您的支持是我持续更新的动力",
    donationClose: "关闭",

    methodologyTitle: "计算原理说明书",
    methodologyContent: `
        <div class="space-y-8">
        <!-- 核心回报指标 -->
        <section class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
            <h3 class="text-lg font-bold text-indigo-700 dark:text-indigo-300 mb-4 flex items-center gap-2">📊 1. 核心回报指标</h3>
            <div class="space-y-4">
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">现金回报率 (Cash Return Rate)</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        现金回报率 = (年净租金 - 年房贷支出) / 初始投入 × 100%
                    </div>
                    <p class="text-sm text-slate-600 dark:text-slate-400">衡量每年现金流入相对于您初始投入的比例。正值表示租金覆盖月供后仍有盈余，负值表示需要每月贴钱。</p>
                    <div class="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-xs text-emerald-700 dark:text-emerald-300">
                        📍 示例：年租金6万，年月供4万，首付100万 → (6-4)/100 = <strong>2%</strong>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">综合回报率 (Total Return Rate)</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        综合回报率 = (累计净现金流 + 房产当前净值 - 总投入) / 总投入 × 100%
                    </div>
                    <p class="text-sm text-slate-600 dark:text-slate-400">综合考虑现金流、资产增值、已还本金的总体投资回报率。</p>
                    <ul class="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                        <li>• <strong>累计净现金流</strong>：租金收入 - 月供 - 持有成本</li>
                        <li>• <strong>房产净值</strong>：当前房价 × (1+增值率)^年数 - 剩余贷款</li>
                        <li>• <strong>总投入</strong>：首付 + 税费 + 装修 + 中介费等</li>
                    </ul>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">年化收益率 (Annualized Return)</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        年化收益率 = [(终值 / 初始投入)^(1/年数) - 1] × 100%
                    </div>
                    <p class="text-sm text-slate-600 dark:text-slate-400">将累计回报折算成每年平均回报率，便于与其他投资（如股票、基金）进行横向比较。</p>
                </div>
            </div>
        </section>

        <!-- 贷款计算模型 -->
        <section class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
            <h3 class="text-lg font-bold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">🏦 2. 贷款计算模型</h3>
            <div class="space-y-4">
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">等额本息 (Equal Principal & Interest)</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        月供 = 贷款本金 × [月利率 × (1+月利率)^还款月数] / [(1+月利率)^还款月数 - 1]
                    </div>
                    <div class="grid grid-cols-2 gap-3 text-xs mt-3">
                        <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">✅ 月供固定，便于规划</div>
                        <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">⚠️ 总利息较多</div>
                        <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">📊 前期利息占比高</div>
                        <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">👤 适合收入稳定者</div>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">等额本金 (Equal Principal)</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        每月还款 = (贷款本金/还款月数) + (剩余本金 × 月利率)
                    </div>
                    <div class="grid grid-cols-2 gap-3 text-xs mt-3">
                        <div class="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded">✅ 总利息较少</div>
                        <div class="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded">⚠️ 初期还款压力大</div>
                        <div class="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded">📉 月供逐月递减</div>
                        <div class="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded">👤 适合收入递增者</div>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">组合贷款 (公积金 + 商贷)</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">公积金贷款利率约3.1%，商贷约4.2%，组合使用可降低综合成本。</p>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm">
                        总月供 = 公积金月供(低利率) + 商业贷款月供(高利率)
                    </div>
                </div>
            </div>
        </section>

        <!-- 风险评估指标 -->
        <section class="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-rose-100 dark:border-rose-800">
            <h3 class="text-lg font-bold text-rose-700 dark:text-rose-300 mb-4 flex items-center gap-2">⚠️ 3. 风险评估指标</h3>
            <div class="space-y-4">
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">DTI (Debt-to-Income) 偿债比</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        DTI = 月供总额 / 家庭月收入 × 100%
                    </div>
                    <div class="flex gap-2 text-xs mt-3">
                        <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">&lt;30% 低风险</span>
                        <span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full">30-50% 中等</span>
                        <span class="px-3 py-1 bg-rose-100 text-rose-700 rounded-full">&gt;50% 高风险</span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">银行通常要求DTI低于55%，超过此值贷款可能受限。</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">DSCR (Debt Service Coverage Ratio) 覆盖比</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        DSCR = 月租金收入 / 月供
                    </div>
                    <div class="flex gap-2 text-xs mt-3">
                        <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">&gt;1.3 优秀</span>
                        <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">1.0-1.3 良好</span>
                        <span class="px-3 py-1 bg-rose-100 text-rose-700 rounded-full">&lt;1.0 负现金流</span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">低于1.0表示租金无法覆盖月供，需要每月贴钱。</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">压力测试场景</h4>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="p-2 bg-rose-50 dark:bg-rose-900/30 rounded">📉 房价下跌 20%</div>
                        <div class="p-2 bg-rose-50 dark:bg-rose-900/30 rounded">📉 租金下降 30%</div>
                        <div class="p-2 bg-rose-50 dark:bg-rose-900/30 rounded">📈 利率上升 2%</div>
                        <div class="p-2 bg-rose-50 dark:bg-rose-900/30 rounded">🏠 空置期 6个月</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 投入成本明细 -->
        <section class="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-800">
            <h3 class="text-lg font-bold text-amber-700 dark:text-amber-300 mb-4 flex items-center gap-2">💰 4. 投入成本明细</h3>
            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <table class="w-full text-sm">
                    <thead class="bg-amber-100 dark:bg-amber-900/30">
                        <tr><th class="p-2 text-left rounded-tl-lg">费用项目</th><th class="p-2 text-left">计算方式</th><th class="p-2 text-left rounded-tr-lg">典型值</th></tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                        <tr><td class="p-2 font-medium">首付款</td><td class="p-2">房价 × 首付比例</td><td class="p-2">20%-35%</td></tr>
                        <tr><td class="p-2 font-medium">契税</td><td class="p-2">房价 × 税率</td><td class="p-2">1%-3%</td></tr>
                        <tr><td class="p-2 font-medium">中介费</td><td class="p-2">成交价 × 比例</td><td class="p-2">1%-2%</td></tr>
                        <tr><td class="p-2 font-medium">装修费</td><td class="p-2">固定金额或面积×单价</td><td class="p-2">5-20万</td></tr>
                        <tr><td class="p-2 font-medium">其他杂费</td><td class="p-2">评估费、抵押费等</td><td class="p-2">0.5-1万</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 持有成本 -->
        <section class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800">
            <h3 class="text-lg font-bold text-purple-700 dark:text-purple-300 mb-4 flex items-center gap-2">🏠 5. 年度持有成本</h3>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-sm mb-2">物业管理费</h4>
                    <p class="text-xs text-slate-500">面积 × 单价/月 × 12</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-sm mb-2">维修基金</h4>
                    <p class="text-xs text-slate-500">房价 × 0.2%/年</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-sm mb-2">房产保险</h4>
                    <p class="text-xs text-slate-500">房价 × 0.05%/年</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-sm mb-2">空置损失</h4>
                    <p class="text-xs text-slate-500">年租金 × 空置率</p>
                </div>
            </div>
        </section>

        <!-- 关键公式 -->
        <section class="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800">
            <h3 class="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">📐 6. 核心数学公式</h3>
            <div class="space-y-3">
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <div class="flex justify-between items-center">
                        <span class="font-medium text-sm">复利终值</span>
                        <code class="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded text-sm">FV = PV × (1 + r)^n</code>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <div class="flex justify-between items-center">
                        <span class="font-medium text-sm">现值折现</span>
                        <code class="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded text-sm">PV = FV / (1 + r)^n</code>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <div class="flex justify-between items-center">
                        <span class="font-medium text-sm">通胀调整</span>
                        <code class="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded text-sm">实际价值 = 名义价值 / (1 + 通胀率)^n</code>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <div class="flex justify-between items-center">
                        <span class="font-medium text-sm">机会成本</span>
                        <code class="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded text-sm">= 首付 × (1 + 投资收益率)^n - 首付</code>
                    </div>
                </div>
            </div>
        </section>

        <!-- 参数说明 -->
        <section class="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">⚙️ 7. 输入参数说明</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>房屋总价</strong>：购买房产的成交价格</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>首付比例</strong>：首次支付的现金占房价的比例</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>商贷利率</strong>：商业贷款的年化利率（LPR+浮动）</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>公积金利率</strong>：住房公积金贷款利率</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>贷款年限</strong>：还款总期限，通常10-30年</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>月租金</strong>：预期可获得的月租金收入</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>房价年增值</strong>：预期房产每年升值幅度</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>投资收益率</strong>：如不买房，资金可能获得的回报</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>通货膨胀率</strong>：货币每年贬值的幅度</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>空置率</strong>：房屋无租客的时间比例</div>
            </div>
        </section>
        </div>
    `,

    // Logic & Advice
    adviceS: '核心优质资产。地段无可挑剔，交通与学区双优，具有极强的保值增值能力和流动性，属于市场上的“硬通货”。建议长期持有。',
    adviceA: '优质潜力地段。各项配套均衡，可能有1-2个突出亮点（如学区或地铁）。适合自住兼投资，未来跑赢大盘概率较大。',
    adviceB: '刚需自住地段。配套基本满足生活，但缺乏明显增值驱动力。流动性一般，建议关注价格优势，避免高位接盘。',
    adviceC: '需谨慎考虑。地段存在明显短板（如远郊、无地铁、无学区）。在市场下行期可能面临较大的流动性风险和折价压力。',
    

    netWorthMore: '净资产多 {amount} 万',
    
    dimLiquidity: '流动性 (Liquidity)',
    dimBarrier: '入场门槛 (Barrier)',
    dimLeverage: '杠杆能力 (Leverage)',
    dimEffort: '管理难度 (Effort)',
    dimInflation: '抗通胀 (Inflation)',
    
    valLowMonths: '低 (需数月变现)',
    valHighT1: '高 (T+1 随时变现)',
    valHighDown: '高 (需凑齐首付)',
    valLow100: '低 (100元起投)',
    valStrongLev: '强 (低息3-5倍杠杆)',
    valWeakLev: '弱 (融资融券成本高)',
    valHighEffort: '高 (维修/招租/税费)',
    valLowEffort: '低 (账户操作即可)',
    valStrongInf: '强 (实物资产硬通货)',
    valMedInf: '中 (取决于标的)',
    
    dimVolatility: '波动性 (Volatility)',
    dimTax: '税务优势 (Tax)',
    dimPsychology: '心理安全 (Psychology)',
    dimDiversify: '分散能力 (Diversify)',
    dimPassive: '被动收入 (Passive)',
    dimInherit: '传承价值 (Inherit)',
    dimExit: '退出难度 (Exit)',
    dimGrowth: '增长潜力 (Growth)',
    dimManage: '管理复杂度 (Manage)',
    
    valLowVol: '低 (年波动5-10%)',
    valHighVol: '高 (年波动15-30%)',
    valTaxHouse: '契税+持有成本',
    valTaxStock: '资本利得税',
    valPsychHouse: '强 (实物资产)',
    valPsychStock: '弱 (账面数字)',
    valDivHouse: '弱 (单一资产)',
    valDivStock: '强 (可分散)',
    valPassHouse: '租金收入',
    valPassStock: '股息分红',
    valInhHouse: '强 (实物遗产)',
    valInhStock: '中 (账户继承)',
    valExitHouse: '高 (交易周期长)',
    valExitStock: '低 (随时卖出)',
    valGrowthHouse: '中 (跟随GDP)',
    valGrowthStock: '高 (可选成长股)',
    valManageHouse: '高 (租客/维修)',
    valManageStock: '低 (被动持有)',
    
    cardOpportunity: '机会成本',
    cardOpportunityDesc: '选择买房意味着这笔首付款失去了投资股市或债券赚取收益的机会。计算器中的“资产对比”正是量化了这一隐形成本。',
    cardCompound: '复利效应',
    cardCompoundDesc: '理财收益通常具有复利效应（利滚利），时间越长威力越大；而房产收益主要来自杠杆放大后的资产增值。',
    cardLiquidity: '流动性陷阱',
    cardLiquidityDesc: '房产是低流动性资产。在急需用钱或市场下行时，可能需要大幅折价才能卖出，而股票基金通常可以快速赎回。',
    cardREITs: 'REITs (房产信托)',
    cardREITsDesc: '不想买房也能投资房产？REITs 是一种像买股票一样投资商业地产的工具，门槛低且流动性好，适合作为房产替代品。',
    cardDCA: '定投平滑风险',
    cardDCADesc: '金融投资中，通过定期定额（定投）可以摊薄成本，降低市场波动风险；而买房通常是一次性高位锁仓。',
    
    stratNoPrepay: '不提前还款',
    stratBase: '基准方案',
    stratReducePay: '减少月供',
    stratReducePayDesc: '月供压力减小，现金流改善，但总利息节省较少。',
    stratReduceTerm: '缩短年限',
    stratReduceTermDesc: '利息节省最多，早日还清债务，但月供压力不变。',
    recReduceTerm: '从节省利息角度，建议选择【缩短年限】',
    recCashFlow: '建议根据现金流压力选择',
    
    // Stress Test Scenarios
    stressTest: '压力测试',
    scenPriceDrop: '房价下跌 10%',
    scenPriceDrop20: '房价下跌 20%',
    scenPriceUp: '房价上涨 20%',
    scenRentDrop: '租金下跌 20%',
    scenRentDrop30: '租金下跌 30%',
    scenRentUp: '租金上涨 30%',
    scenRateUp: '利率上升 1%',
    scenRateUp2: '利率上升 2%',
    scenVacancy: '空置率 20%',
    scenHoldingCostUp: '持有成本上升 50%',
    scenSellYear: '第{year}年提前卖出',
    scenCombo1: '房价跌10% + 租金跌20%',
    scenCombo2: '利率涨1% + 空置率20%',
    customScenario: '自定义场景',
    addCustom: '添加自定义',
    scenarioName: '场景名称',
    priceChange: '房价变化',
    rentChange: '租金变化',
    rateChange: '利率变化',
    vacancyChange: '空置率',
    holdingCostChange: '持有成本变化',
    sellYearCustom: '卖出年份',
    resetScenario: '重置',
    applyScenario: '应用场景',
    
    // Rent vs Buy
    rentVsBuyTitle: '租售比分析',
    rentVsBuyAnalysis: '租售比分析',
    buyScenario: '买房自住',
    rentScenario: '租房投资',
    buyNetWorth: '买房净资产',
    rentNetWorth: '租房净资产',
    breakevenPoint: '盈亏平衡点',
    breakevenDesc: '第 {year} 年买房开始划算',
    neverBreakeven: '租房始终更划算',
    monthlyCostDiff: '月度支出差额',
    buyCost: '买房月供+持有',
    rentCost: '租金支出',
    investDiff: '差额投资收益',
    diffAnalysis: '第 {year} 年 {winner} 胜出 {diff} {unit}',
    housePro1: '强制储蓄，资产增值',
    housePro2: '居住稳定性高，可自由装修',
    housePro3: '享受户口、学区等附加权益',
    stockPro1: '现金流灵活，生活压力小',
    stockPro2: '资产流动性强，变现容易',
    stockPro3: '可随时更换居住环境',
    
    // Tax Calculator
    taxTitle: '房产税费计算器',
    taxDeed: '契税',
    taxVAT: '增值税',
    taxPIT: '个税',
    taxTotal: '税费总计',
    inputArea: '房屋面积',
    inputCityTier: '城市等级',
    inputFirstTime: '购房资格',
    inputYearsHeld: '房产年限',
    inputSellerOnly: '卖家唯一住房',
    tier1: '一线城市 (北上广深)',
    tierOther: '非一线城市',
    buyerFirst: '首套房',
    buyerSecond: '二套房',
    buyerOther: '三套及以上',
    heldLess2: '不满2年',
    held2to5: '满2年不满5年',
    heldMore5: '满5年',
    taxExplanation: '注：一线城市二套房契税3%；不满2年全额征收增值税；满五唯一免征个税。',
    calcTax: '计算税费',
    
    // Appreciation Predictor
    appreciationPredictor: '增值潜力预测',
    cityTier: '城市等级',
    district: '区域位置',
    propertyTypeLabel: '房产类型',
    policyEnv: '政策环境',
    infrastructure: '基建规划',
    populationTrend: '人口趋势',
    industryDev: '产业发展',
    predictionScore: '潜力评分',
    futureGrowth: '未来增长预测',
    predTier1: '一线',
    predTierNew1: '新一线',
    predTier2: '二线',
    predTier3: '三线及以下',
    schoolDistrict: '学区配套',
    schoolTop: '顶级名校',
    schoolKey: '重点学区',
    schoolNormal: '普通学区',
    schoolNone: '无学区',
    propertyAgeLabel: '房龄情况',
    ageNew: '新房',
    ageSubNew: '次新(5年内)',
    ageOld: '10-20年',
    ageVeryOld: '20年以上',
    developerLabel: '开发商',
    devTop: '头部品牌',
    devSoe: '知名国企',
    devNormal: '普通开发商',
    pmLabel: '物业管理',
    pmLevel1: '一级资质',
    pmNormal: '普通物业',
    pmNone: '无物业',
    dimensionSchool: '教育资源',
    dimensionProduct: '产品品质',
    districtCore: '核心区',
    districtNear: '近郊',
    districtFar: '远郊',
    propertyResidential: '住宅',
    propertyApartment: '公寓',
    propertyVilla: '别墅',
    policyLoose: '宽松',
    policyNeutral: '中性',
    policyStrict: '严格',
    infraMajor: '重大规划',
    infraNormal: '一般规划',
    infraNone: '无规划',
    popInflow: '持续流入',
    popStable: '稳定',
    popOutflow: '流出',
    industryStrong: '强劲',
    industryMedium: '中等',
    industryWeak: '疲软',
    predictBtn: '开始预测',
    levelS: 'S级 - 极高潜力',
    levelA: 'A级 - 高潜力',
    levelB: 'B级 - 中等潜力',
    levelC: 'C级 - 低潜力',
    levelD: 'D级 - 风险较高',
    yearlyGrowth: '年均增长率',
    risks: '风险提示',
    opportunities: '投资机遇',
    dimensionAnalysis: '维度分析',
    
    // Cash Flow
    cashFlowProjection: '现金流预测',
    rentalIncome: '租金收入',
    mortgagePayment: '贷款还款',
    holdingCost: '持有成本',
    netCashFlow: '净现金流',
    yearsUnit: '年',
    otherInvIncome: '其他投资收入',
    monthlyExpenses: '月支出',
    yearlyBigExpenses: '年度大额支出',
    monthlyAverage: '月均',
    positiveFlow: '正现金流',
    negativeFlow: '负现金流',
    monthLabel: '第{n}月',
    // Housing Trends
    housingTrendsTitle: "全国房价趋势",
    housingTrendsSubtitle: '全国重点城市二手房价格指数 (2022年5月=100)',
    city: '城市',
    latestIndex: '最新指数',
    momChange: '环比上月',
    yoyChange: '同比去年',
    ytdChange: '今年以来',
    sinceBase: '较基期',
    dataSource: '数据来源',
    nbs: '国家统计局',
    viewHousingTrends: '查看房价走势',
    
    // House Roast & AI
    roastTitle: "🏠 房子有话要说",
    roastSubtitle: "清醒一下，让我们面对现实",
    aiPerspectiveCheck: "对照与社会视角",
    ifIWereYou: "🤖 \"如果我是你\" AI 立场",
    socialPerspective: "对照与社会视角",
    peerChoice: "同类人群选择",

    // Game Mode
    lifeSimTitle: "模拟人生：买房后的20年",
    lifeSimReset: "重新模拟",
    endingReached: "ENDING REACHED",
    endingWealthy: "富裕结局",
    endingDebt: "欠债结局",
    endingZen: "佛系结局",
    endingStruggle: "房奴结局",
    endingNormal: "普通结局",
    finalAssets: "最终资产",
    happinessIndex: "幸福指数",
    stressIndex: "压力指数",
    keyLifeEvents: "关键人生事件",
    yearN: "第 {year} 年",
    uneventfulLife: "平平淡淡的一生，没有发生重大意外事件。",
    lifeTrajectory: "人生轨迹曲线",
    netWorth: "净资产(万)",
    happiness: "幸福度",
    netWorthLeft: "净资产 (左轴)",
    happinessRight: "幸福度 (右轴)",

    // Life Path Nav (Vertical)
    navLifePath: "人生路径模拟",
    navCountdown: "买房倒计时", // This existed? Maybe rename or reuse.
    navBuyDecision: "买房倒计时", // Use this new explicit key
    navWealth: "财富兑换",
    navKnowledgeTree: "知识树",
    navOpportunity: "机会成本 & 股市",
    navReview: "决策复盘",
    navNegotiation: "谈判助手",
    navLiquidity: "流动性分析",
    navDrag: "房子拖累指数",
    navNavalWisdom: "Naval智慧引擎",

    // Naval Wisdom Engine
    wealthEngine: "财富引擎",
    freedomEngine: "自由引擎",
    specificKnowledge: "特有知识地图",
    judgmentEngine: "判断力引擎",
    leverageAllocation: "杠杆配置",
    downsideShield: "下行保护盾",
    lifeGameMode: "人生游戏模式",
    ethicalWealth: "道德财富层",
    timeSellingRate: "时间出售率",
    timeSellingDesc: "被卖掉的不可赎回时间",
    passiveCoverage: "被动收入覆盖",
    passiveCoverageDesc: "资产收益覆盖支出的比例",
    geoFreedom: "地理自由度",
    geoFreedomDesc: "你在任何地方都能赚钱吗？",
    mentalBandwidth: "心智带宽",
    mentalBandwidthDesc: "未被琐事占据的注意力",
    allocationDesc: "你的生命能量去哪了？",
    irreplaceability: "不可替代性",
    aiReplacement: "AI 替代概率",
    learningCompounding: "学习复利",
    monetizationMultiplier: "价值乘数",
    longTermThinking: "长期主义思维",
    cashBuffer: "现金缓冲",
    mentalResilience: "心态韧性",
    singlePointFailure: "单点故障",
    relationshipCompound: "关系复利",
    reputationCapital: "声誉资本",
    netValue: "创造净价值",
    winWin: "双赢游戏",
    longTermGame: "长期游戏",
    ethicsPass: "你在和长期的人玩长期的游戏。财富是必然的。",
    ethicsFail: "重新审视你的路径。真正的财富来自道德关系的复利。",

    // Future Self
    futureTitle: "对话未来的自己 (Future You)",
    futureSubtitle: "AI 已模拟未来 10 年的 3 种人生剧本",
    futureDialogTitle: "未来的你 · 跨时空对话",
    futureDialogDesc: "不是算命，是基于数据的理性推演",
    expand: "展开",
    collapse: "收起",
    timeLine: "时间线",
    yearsLater: "{n}年后",
    persona: "人格偏移",
    personaConservative: "保守慎重",
    personaAggressive: "激进进取",
    adviceFrom: "来自 {year} 年的忠告",
    currentDTI: "目前 DTI",
    survivalPeriod: "现金流生存期",
    regretIndex: "AI后悔指数",
    crash: "崩盘",

    // Market Sentiment
    marketSentiment: "市场情绪调节",
    marketSentimentDesc: "调整参数模拟不同市场环境",
    sentimentBearish: "悲观 (熊市)",
    sentimentBullish: "乐观 (牛市)",
    sentimentNeutral: "中性 (震荡)",
    sentimentDescBearish: "市场低迷，房价可能下跌，但贷款利率较低",
    sentimentAdviceBearish: "适合有稳定收入、风险承受能力强的购房者",
    sentimentDescBullish: "市场繁荣，房价上涨，但贷款成本增加",
    sentimentAdviceBullish: "需要评估高房价和高利率的双重压力",
    sentimentDescNeutral: "市场平稳，各项指标处于合理区间",
    sentimentAdviceNeutral: "适合大多数购房者的常规市场环境",
    sentimentProperty: "房产增值",
    sentimentReturn: "理财收益",
    sentimentRate: "贷款利率",
    marketImpact: "市场影响",
    impactPrice: "房价",
    impactRateShort: "利率",
    impactRent: "租金",
    impactDown: "下行压力",
    impactLow: "相对较低",
    impactStable: "相对稳定",
    impactUp: "快速上涨",
    impactHigh: "相对较高",
    impactSyncUp: "同步上涨",
    impactSteady: "平稳增长",
    impactMedium: "中等水平",
    impactSteadyGrow: "稳定增长",
    predictionResult: "当前情绪下的结果预测",
    recommendBuy: "买房更优",
    recommendRent: "租房投资更优",

    // Amortization Mood
    amortizationMood: "还款心情条",
    moodIndex: "心情指数",
    happy: "开心",
    neutral: "一般",
    unhappy: "不开心",
    principal: "本金",
    interest: "利息",
    viewYear: "按年",
    viewMonth: "按月",
    viewAll: "全部",
    paymentSchedule: "详细还款计划",
    paymentDetails: {
        title: "详细还款计划",
        byDay: "按日",
        byWeek: "按周",
        byMonth: "按月",
        byQuarter: "按季",
        byYear: "按年",
        all: "全部",
        dayLabel: "日",
        weekLabel: "周",
        monthLabel: "月",
        quarterLabel: "季度",
        yearLabel: "年",
        yearN: "第 {year} 年",
        annualPayment: "年供",
        payment: "还款",
        principal: "本金",
        interest: "利息",
        remaining: "剩余",
        period: "期数",
        month: "月份",
        date: "日期",
        monthlyPayment: "月供(元)",
        principalValue: "本金(元)",
        interestValue: "利息(元)",
        remainingPrincipal: "剩余本金(元)",
        totalTerms: "总期数",
        totalRepayment: "累计还款",
        totalInterest: "累计利息",
        termsCount: "{n} 期",
        monthN: "第 {year} 年第 {month} 月",
        periodN: "第 {n} 期",
        exportCSV: "导出为CSV"
    },
    battleReport: {
        title: "房产投资战报",
        grade: "资产评级",
        beat: "击败了 {percent}% 的投资者",
        roast: "AI 毒舌点评",
        annualReturn: "年化回报",
        cashFlow: "现金流健康度",
        risk: "风险指数",
        scan: "扫码试算",
        shareBtn: "生成朋友圈战报",
        downloadBtn: "保存图片",
        generating: "生成中..."
    },

    // Social Perspective 社会视角
    socialTitle: "社会视角",
    socialAiCheck: "AI 决策分析",
    socialPeer: "同龄人选择",
    socialTabPeer: "同龄人",
    socialTabMinority: "逆势分析",
    socialTabFuture: "接盘侠",
    socialTabFamily: "家庭影响",
    socialTabFutureSelf: "跨时空对话",

    exportPDF: "导出 PDF 报告",
    aboutTool: "关于工具",
    aboutDesc: "WealthCompass 是一个全维度的家庭财富决策系统。不仅仅是房贷计算，更涵盖资产配置、人生路径模拟、车辆购置分析及机会成本评估，助您在人生的每一个十字路口做出理性抉择。",
    disclaimer: "工具仅供参考，不构成投资建议。",
    quickNav: "快速导航",
    navHome: "首页/对比分析",
    navAsset: "资产配置/财富大盘",
    navLifePath: "人生路径模拟",
    navCar: "购车/消费决策",
    navKnowledge: "知识树/词汇百科",
    navStress: "压力测试/情景模拟",
    navLogic: "计算原理说明",
    dataSources: "数据来源",
    sourceLpr: "LPR利率: 中国人民银行",
    sourcePrice: "房价数据: 国家统计局",
    sourceMarket: "市场数据: 公开市场信息",
    sourceModel: "计算模型: 标准金融公式",
    helpFeedback: "帮助与反馈",
    feedbackBtn: "反馈",
    donateBtn: "请作者喝杯咖啡 ☕",
    
    externalLinks: {
        title: "宏观数据与趋势",
        ershoufang: "二手房大数据 (网签)",
        creprice: "CRE Price (行情)",
        eastmoney: "东方财富指数",
        stats: "国家统计局",
        tsinghua: "清华恒大指数"
    },
    
    themes: {
        light: "浅色",
        dark: "深色",
        professional: "专业版",
        gaming: "游戏版",
        deepblack: "深黑色"
    },
    
    presets: {
        title: "快速预设",
        loadPreset: "加载预设",
        presetLoaded: "已加载预设: {name}"
    },
    riskTitle: "⚠️ 风险提示与免责声明",
    riskWarning: "本工具提供的所有分析和结果均基于用户输入和假设的宏观数据，仅供参考，不构成任何投资建议。房地产市场受多种因素影响，实际情况可能与预测存在差异。市场有风险，决策需谨慎。请在做出重大财务决策前咨询专业的财务顾问或房产专家。",
    quote: "\"明智的决策源于充分的信息\"",

    // Section Navigation
    navInputPanel: "参数输入",
    navComparison: "资产对比",
    navAnalysis: "分析工具",
    navRoastPanel: "房子评你",
    navInteractive: "实时仪表",
    navTimeline: "时间轴",
    navGameMode: "游戏模式",
    navSellDecision: "卖房决策",
    navAIPanel: "AI顾问",
    navPaymentSchedule: "还款计划",
    navFAQ: "常见问题",
    navFeedback: "反馈与建议",

    // Interactive Dashboard
    realTimeViz: "实时决策可视化",
    dragParams: "拖动参数，实时查看财务影响",
    hideAdvanced: "隐藏高级参数",
    showAdvanced: "展开高级参数 (反脆弱)",
    advancedRiskParams: "高级风控参数 (决定能不能扛过坏周期)",

    // Decision Dashboard
    decisionDashboard: {
        minorityReport: "少数派提示",
        mainstream: "🚶 随大流",
        contrarian: "🏃 逆行者",
        balanced: "⚖️ 平衡派",
        futureBuyerOverlap: "未来买家重叠度",
        easyToSell: "易转手",
        mediumToSell: "中等",
        hardToSell: "难转手",
        radarYou: "你",
        radarFuture: "未来",
        familyImpact: "家庭成员影响",
        ifNotBuying: "如果不买这套房...",
        ifNotBuyingDesc: "别陷入\"非买不可\"的误区，看看这些可能性",
        matchScore: "匹配度",
        pros: "✅ 优势",
        cons: "❌ 劣势",
        regretDetector: "决策后悔药检测",
        regretDetectorDesc: "优先关注那些\"一旦错了就回不了头\"的地方",
        irreversible: "不可逆",
        semiIrreversible: "半不可逆",
        reversible: "可逆",
        confidence: "确信度",
        alternativePaths: "替代人生方案",
        irreversibilityCheck: "不可逆程度检测"
    },
    
    // Sliders
    incomeVolatility: "收入波动系数",
    volatilityNote: "30%+为高风险(销售/创业)",
    minLivingExpense: "最低生活支出",
    basicLivingCost: "房贷之外的生存成本",
    emergencyReserve: "应急现金储备",
    survivalMonths: "失业能撑多久",
    maxDti: "可接受最大月供占比",
    psychologicalThreshold: "你的心理崩溃阈值",
    rateHikeAssumption: "利率上行假设",
    stressTestNote: "压力测试用",

    // Tabs
    overviewTab: "综合看板",
    timelineTab: "时间轴",
    riskTab: "风险梯度",
    cashFlowTab: "现金流呼吸",
    regretTab: "后悔热力图",

    // Charts
    timelineTitle: "30年还款时间轴",
    yearAxis: "年份",
    amountAxis: "金额(万)",
    remainingPrincipal: "剩余本金",
    cumulativeInterest: "累计利息",
    riskGradientTitle: "风险颜色梯度",
    riskValue: "风险值",
    breathingRoom: "呼吸空间",
    incomeLabel: "月收入",
    paymentLabel: "月供",
    discretionaryLabel: "可支配",
    regretHeatmapTip: "颜色越深 = 后悔概率越高",
    
    // Life Drag Index
    lifeDragTitle: "房子拖累指数 (Life Drag Index)",
    lifeDragSubTitle: "有些房子不会毁掉你，但会慢慢拖住你。",
    dragValue: "拖累值",
    careerLock: "职业锁定",
    careerLockSub: "是否限制换工作/失业风险",
    geoLock: "城市枷锁",
    geoLockSub: "是否限制城市流动",
    lifestyleCompression: "生活压缩",
    lifestyleCompressionSub: "是否压缩社交/旅行/学习",
    futureDelay: "人生推迟",
    futureDelaySub: "是否推迟结婚/生子/创业",
    aiEvaluatingLife: "AI 正在分析你的人生...",
    aiEvalLifeBtn: "AI 投资顾问：评估我的人生自由度",
    aiLifeImpactTip: "基于 AI 深度分析房产对你未来的隐性影响",
    aiLifeEvalTitle: "AI 投资顾问深度评估",
    reAnalyze: "重新分析",
    adviceDragLow: "这套房子是你的助力，不是负担。",
    adviceDragMed: "有一定的束缚，特别是职业选择上需要更谨慎。",
    adviceDragHigh: "警惕！这套房子正在显著挤压你的生活空间和未来选择。",
    adviceDragExtreme: "极高风险！你可能正在为了房子牺牲整个人生的可能性。",
    
    // Life Path Simulator
    lpTitle: "人生换房路线模拟",
    lpDesc: "模拟不同换房策略下的资产积累与生活质量",
    lpPathA: "一房到底",
    lpPathB: "一次置换",
    lpPathC: "多次折腾",
    lpStageStarter: "首套上车",
    lpStageUpgrade: "改善置换",
    lpStageOldSmall: "老破小",
    lpStageNewTwo: "次新两居",
    lpStageLux: "终极改善",
    lpFinalNetWorth: "最终净资产",
    lpNetWorthDesc: "30年后房产价值 - 剩余贷款",
    lpTotalCost: "交易摩擦成本",
    lpTotalCostDesc: "中介费 + 税费 + 装修损耗",
    lpAvgComfort: "居住舒适度",
    lpComfortDesc: "加权平均居住体验评分",
    lpTimeline: "换房时间轴",
    lpYear1: "第1年",
    lpYear30: "第30年",
    lpExchange: "置换",
    lpSell: "卖出",
    lpBuy: "买入",
    lpCost: "成本",
    lpChartTitle: "资产积累对比",
    lpRecTitle: "智能推荐",
    lpRecAsset: "资产最优解",
    lpRecAssetDesc: "起步买更小房、快速积累首套房净值，再通过适时升级'捕捉'更大房产的增值红利。在高房价涨幅时期，多次折腾反而能跑赢长持单套。",
    lpRecExp: "体验最优解",
    lpRecExpDesc: "通过阶梯式置换，可以在不同人生阶段匹配最适合的居住环境，生活质量更高。但需权衡交易成本。",

    // Goal Calculator
    goalCalculatorTitle: "买房倒计时 (目标倒推)",
    targetPrice: "目标房价 (万)",
    targetYears: "计划年限",
    currentSavings: "当前已有存款 (万)",
    requiredReturn: "所需年化收益率",
    goalAchieved: "目标已达成",
    goalEasy: "轻松达成",
    goalModerate: "努力可达",
    goalHard: "极具挑战",
    goalImpossible: "无法达成",
    adviceEasy: "您的目标非常稳健，建议选择低风险理财产品，如定期存款或国债。",
    adviceModerate: "目标合理，建议构建股债平衡的投资组合，关注稳健型基金。",
    adviceHard: "目标具有挑战性，需要承担较高风险，建议增加月储蓄或延长购房时间。",
    adviceImpossible: "以目前的储蓄速度难以达成，建议大幅增加收入、降低购房预算或推迟购房计划。",

    // Wealth Exchange
    houseWins: "买房路径多赚",
    stockWins: "租房投资多赚",
    realWealthDesc: "*基于通胀调整后的真实购买力差异",
    luxuryTrip: "豪华海外游",
    hermesBag: "爱马仕包包",
    starbucks: "星巴克咖啡",
    addCustomItem: "添加自定义愿望",
    itemNamePlaceholder: "例如：环球旅行",
    itemPricePlaceholder: "单价 (元)",
    delete: "删除",
    add: "添加",
    unit: "个",

    // Knowledge Tree
    knowledgeTree: "知识树",
    knowledgeTreeDesc: "学习财务知识，做出明智决策",
    learningProgress: "学习进度",
    unlocked: "已解锁",
    backToList: "返回列表",
    relatedTerms: "相关术语",
    unlockNext: "解锁下一个知识点",
    unlockAndView: "解锁并查看",
    unlockHint: "完成相关操作后解锁",
    welcomeToKnowledgeTree: "欢迎来到知识树",
    knowledgeTreeWelcome: "选择左侧分类开始学习财务知识，每完成一次分析就能解锁更多内容！",
    keepLearning: "持续学习，提升财商",
    catLoan: "贷款知识",
    catInvest: "投资理财",
    catTax: "税务政策",
    catRisk: "风险管理",
    catBasic: "基础概念",
    
    // Opportunity Cost
    oppWinHouse: "房产投资胜出",
    oppWinStock: "指数基金胜出",
    oppWinDesc: "在 {year} 年持有的情况下，{winner} 预计比另一种选择的净资产高出 {diff} 万。",
    oppIrrHouse: "房产预期 IRR",
    oppIrrStock: "基金预期 IRR",
    oppChartTitle: "净资产增长对比",
    oppChartHouse: "房产净值",
    oppChartStock: "基金净值 (基准)",
    oppRiskTitle: "逆向思考：如果不买房？",
    oppRiskVol: "市场波动率(Risk)",
    oppRiskDesc: "股市投资具有不确定性。下图展示了在不同市场表现下，您的财富（同等本金投资指数基金）的可能分布范围 (90% 置信区间)。",
    oppBull: "牛市上限",
    oppBear: "熊市下限",
    oppBase: "基准预测",
    oppHouseName: "房产净值",
    oppStockName: "基金净值",
    oppBullLabel: "牛市 (90%)",
    oppBearLabel: "熊市 (10%)",

    // Decision Journal
    journalTitle: "决策复盘日志",
    journalNoHistory: "暂无决策记录",
    journalCTA: "在上方点击 '保存当前决策' 按钮，记录下您此刻的思考。",
    journalTimeline: "决策时间轴",
    journalReason: "为什么做这个决定？",
    journalEdit: "编辑",
    journalDone: "完成",
    journalPlaceholder: "记录你的核心理由，比如：学区房保值、急着结婚、担心踏空...",
    journalRejected: "我放弃了什么？（机会成本）",
    journalRejectedPlaceholder: "比如：更远但更大的新房、继续租房买理财、老破小...",
    journalAIReview: "AI 决策复盘",
    journalAnalyzing: "分析中...",
    journalAnalyzeBtn: "开始复盘分析",
    journalAICallout: "点击右上角按钮，让 AI 帮你检查决策盲点。",

    // Negotiation Helper
    negTitle: "房源情报输入",
    negListingPrice: "挂牌价格 (万)",
    negRecentPrice: "参考成交价 (万)",
    negSubRecent: "同户型近期均价",
    negListingDays: "挂牌天数",
    negPriceCuts: "调价次数",
    negInventory: "小区在售库存 (套)",
    negRenoScore: "装修评分 (1-10)",
    negFloorScore: "楼层评分 (1-10)",
    negResultTitle: "建议砍价目标",
    negCurrentListing: "当前挂牌:",
    negBargain: "砍价:",
    negUrgency: "卖家急售指数",
    negAIAdvisor: "AI 谈判军师",
    negGenScript: "生成谈判话术",
    negGenLoading: "生成锦囊...",
    negAIPlaceholder: "点击上方按钮，AI 将根据当前的房源数据，为你定制专属的砍价剧本。",
    negTagUrgent: "严重滞销/急售",

    // Liquidity Check
    liqTitle: "未来接盘人画像预测器",
    liqSubTitle: "反直觉真相：房子不是卖给市场，而是卖给某一类人",
    liqInfo: "房产信息",
    liqArea: "面积(㎡)",
    liqBedrooms: "卧室数",
    liqLocation: "位置",
    liqSchool: "学区房",
    liqTransit: "交通便利度(1-10)",
    liqPriceLevel: "价格水平",
    liqAge: "房龄(年)",
    liqCompetition: "新房竞争",
    liqPopTrend: "人口趋势",
    liqPolicy: "政策环境",
    liqAnalyzeBtn: "开始分析流动性",
    liqScore: "流动性评分",
    liqSaleCycle: "预计出售周期",
    liqDiscountProb: "折价概率",
    liqBuyerProfile: "未来接盘人画像 (Top 3)",
    liqStrengths: "流动性优势",
    liqRisks: "流动性风险",
    liqAIInsight: "AI 深度洞察",
    
    // Liquidity Options
    locCBD: "CBD核心",
    locSuburb: "城市近郊",
    locRemote: "远郊",
    plLow: "低价",
    plMedium: "中等",
    plHigh: "高价",
    plLuxury: "豪宅",
    compLow: "低",
    compMedium: "中等",
    compHigh: "高",
    popGrow: "增长",
    popStable: "稳定",
    popDecline: "下降",
    polFavor: "利好",
    polNeutral: "中性",
    polRestrict: "限制",
    liqStrAreaOk: '面积适中，受众广泛',
    liqRiskAreaBig: '大户型流动性较差',
    liqRiskAreaSmall: '面积偏小，限制家庭类型',
    liqStrSchool: '学区房，刚需强劲',
    liqStrTransit: '交通便利，通勤友好',
    liqRiskTransit: '交通不便，影响出售',
    liqStrPriceLow: '价格亲民，购买力强',
    liqRiskPriceLux: '豪宅市场窄，接盘人少',
    liqStrNew: '次新房，品质保证',
    liqRiskOld: '房龄较老，维护成本高',
    liqRiskComp: '新房竞争激烈',
    liqStrPop: '人口流入，需求增长',
    liqRiskPop: '人口流出，需求萎缩',
    liqStrPol: '政策利好，市场活跃',
    liqRiskPol: '政策限制，交易受阻',
    
    // Buyer Profiles
    liqBuyerYoung: '首次置业年轻家庭',
    liqBuyerUpgrade: '改善型家庭',
    liqBuyerInvest: '投资型买家',
    liqBuyerDown: '换小型买家',
    liqBuyerRare: '接盘人稀少',
    
    // Buyer Traits
    liqTraitYoung: '25-35岁, 小家庭, 注重性价比',
    liqTraitUpgrade: '35-45岁, 二孩家庭, 追求品质',
    liqTraitInvest: '资金充裕, 看重增值, 长期持有',
    liqTraitDown: '50岁以上, 子女独立, 简化生活',
    liqTraitRare: '特殊需求, 非主流',


    
    // Missing Keys
    predictAppreciation: "预测升值",
    viewHousingTrends: "查看房价走势",
    // Naval Modules
    lifePathSimulator: "人生路径模拟器",
    goalCalculator: "财富目标计算器",
    tokenExchange: "价值交换算子",
    lifeDragIndex: "生活阻力指数",
    
    // Contact
    contactAuthor: "联系作者",
    contactAuthorTitle: "联系作者",
    contactAuthorDesc: "扫码添加QQ ✨",
    contactClose: "关闭",
  },
  EN: {
    appTitle: "WealthCompass",
    pro: "PRO",
    tutorial: "Tutorial",
    buyingProcess: "Process",
    locationGuide: "Location",
    export: "Export",
    exportPdfReport: "Export PDF Report",
    exportImagePng: "Export Image (PNG)",
    exportMarkdown: "Export Markdown",
    methodology: "Methodology",
    settings: "Settings",
    headerPreset: "Quick Preset",
    headerLogin: "Login",
    headerSave: "Save & Review",
    contactAuthor: "Contact Author",
    contactAuthorTitle: "Contact Author",
    contactAuthorDesc: "Scan QR code to add QQ ✨",
    contactClose: "Close",
    
    // Auth Modal
    authLoginTitle: "Login",
    authSignupTitle: "Sign Up",
    authGoogleLogin: "Login with Google",
    authOrEmail: "or use email",
    authNickname: "Nickname",
    authNicknamePlaceholder: "Enter nickname",
    authNicknameRequired: "Please enter a nickname",
    authEmail: "Email",
    authPassword: "Password",
    authPasswordPlaceholder: "At least 6 characters",
    authProcessing: "Processing...",
    authLoginBtn: "Login",
    authSignupBtn: "Sign Up",
    authNoAccount: "No account?",
    authHasAccount: "Have an account?",
    authSignupNow: "Sign up now",
    authLoginNow: "Login now",
    
    darkMode: "Dark Mode",
    inputPanelTitle: "Investment Parameters",
    baseInfo: "Basic Info",
    totalPrice: "Total Price ($k)",
    downPaymentRatio: "Down Payment (%)",
    netDownPayment: "Net Down Payment",
    oneTimeCost: "One-time Costs",
    deedTax: "Deed Tax (%)",
    agencyFee: "Agency Fee (%)",
    renovationCost: "Renovation ($k)",
    loanScheme: "Loan Scheme",
    loanType: "Loan Type",
    commercial: "Commercial",
    provident: "Provident",
    combination: "Combination",
    commercialRate: "Comm. Rate (%)",
    providentRate: "Prov. Rate (%)",
    providentQuota: "Prov. Quota ($k)",
    loanTerm: "Loan Term (Years)",
    repaymentMethod: "Repayment Method",
    equalPrincipalAndInterest: "Equal Principal & Interest",
    equalPrincipal: "Equal Principal",
    rateAdjustmentPeriod: "Rate Adj. Period (Years)",
    expectedRateChange: "Expected Rate Change (%)",
    ltvRatio: "LTV Ratio",
    tipRepaymentMethod: "Choose between equal monthly payments or decreasing payments",
    tipRateAdjustment: "How often your interest rate adjusts",
    tipExpectedRateChange: "Expected annual interest rate change",
    tipLTV: "Loan-to-Value ratio, percentage of property value financed",
    financeAndRepayment: "Finance & Repayment",
    enablePrepayment: "Enable Prepayment",
    prepaymentYear: "Prepay Year",
    prepaymentAmount: "Prepay Amount ($k)",
    repaymentStrategy: "Strategy",
    reducePayment: "Reduce Payment",
    reduceTerm: "Reduce Term",
    alternativeReturn: "Alt. Return (%)",
    inflationRate: "Inflation Rate (%)",
    revenueAndRisk: "Revenue & Risk",
    holdingYears: "Holding Years",
    monthlyRent: "Monthly Rent ($)",
    annualAppreciation: "Appreciation (%)",
    vacancyRate: "Vacancy Rate (%)",
    holdingCostRatio: "Holding Cost (%)",
    maintenanceCost: "Maint. Cost ($k/yr)",
    existingAssets: "Existing Assets",
    purchaseScenario: "Scenario",
    firstHome: "First Home",
    secondHome: "Second Home",
    investment: "Investment",
    existingProperties: "Existing Props",
    existingMonthlyDebt: "Existing Debt ($)",
    familyIncome: "Family Income ($)",
    monthlyIncome: "Monthly Income",
    cashReturn: "Cash on Cash",
    comprehensiveReturn: "Comp. Return",
    firstMonthPayment: "1st Mo. Payment",
    totalRevenue: "Total Revenue",
    basedOnRealCost: "Based on Real Cost",
    includeAppreciation: "Inc. Appreciation",
    coverageRatio: "Coverage",
    breakEven: "Break-even Yr {year}",
    notBreakEven: "No Break-even",
    initialFundDistribution: "Initial Cost Breakdown",
    totalInvestment: "Total Inv. ($k)",
    assetComparison: "Asset Comparison: House vs Stock",
    netWorthAtYear: "Net Worth at Year {year}",
    houseInvestment: "Real Estate",
    financialInvestment: "Financial Inv.",
    winner: "WINNER",
    wealthCurve: "Wealth Growth Curve",
    removeInflation: "Real Value (Inflation Adj.)",
    removedInflation: "Real Value Shown",
    detailSchedule: "Schedule",
    stressTest: "Stress Test",
    riskAssessment: "Risk Assessment",
    lowRisk: "Low Risk",
    mediumRisk: "Medium Risk",
    highRisk: "High Risk",
    safe: "Safe",
    warning: "Warning",
    danger: "Danger",
    riskExplanation: "Risk Note: DTI (Debt-to-Income) above 35% requires caution, above 55% is high risk. Stress test simulates ability to handle rate increases.",
    dtiCategory: "DTI (Debt-to-Income)",
    stressTestCategory: "Stress Test (Rate Hike)",
    antifragileCategory: "Anti-Fragility",
    monthsReserve: " Months Reserve",
    cashFlowPressure: "Cash Flow",
    leverageRisk: "Leverage",
    totalMonthlyDebtLabel: "Total Monthly Debt:",
    dtiLabel: "DTI Ratio:",
    dtiAdvice: "* Keep DTI below 50%",
    financialEKG: "Financial Volatility EKG",
    riskAversion: "Risk Aversion",
    currentVolatility: "Current Volatility",
    maxTolerance: "Tolerance Limit",
    tachycardiaWarning: "Tachycardia Warning!",
    riskWarningDesc: "Your portfolio volatility exceeds your psychological tolerance. Suggestions: 1. Reduce leverage 2. Add stable assets 3. Avoid aggressive assumptions.",
    healthNormal: "Heartbeat Normal",
    riskSafeDesc: "Your financial volatility is within your comfort zone. You can take on more risk for higher returns, or maintain current stability.",
    aiConsultant: "AI Consultant",
    online: "Online",
    inputPlaceholder: "Ask me about this investment...",
    generateReport: "Gen Report",
    buyVsInvest: "Buy vs Invest",
    locationReview: "Location Review",

    // Units and Symbols
    currencySymbol: "$",
    unitWan: "k",
    unitWanSimple: "k",

    // Tooltips
    tipTotalPrice: 'Actual transaction price (excluding taxes). Basis for down payment and loan.',
    tipDownPayment: 'Percentage of initial payment. Usually 30% for first home.',
    tipDeedTax: 'Tax levied on property transfer. Usually 1-1.5%.',
    tipAgencyFee: 'Service fee paid to agent, usually 1-3% of price.',
    tipRenovation: 'Estimated cost for renovation and furniture. Sunk cost occupying cash flow.',
    
    // Tax Calculator
    taxExplanation: 'Note: Tier 1 cities have 3% deed tax for 2nd homes. VAT applies if <2 years. Income tax exempt if >5 years & only home.',
    tier1: 'Tier 1 Cities (Beijing/Shanghai/etc)',
    tierOther: 'Other Cities',
    buyerFirst: 'First Home',
    buyerSecond: 'Second Home',
    buyerOther: 'Third+ Home',
    heldLess2: 'Less than 2 years',
    held2to5: '2-5 years',
    heldMore5: 'More than 5 years',
    inputCityTier: 'City Tier',
    inputArea: 'Area',
    inputFirstTime: 'Buyer Status',
    inputYearsHeld: 'Years Held',
    inputSellerOnly: 'Seller Only Home',
    calcTax: 'Calculate Taxes',
    
    // Cash Flow
    cashFlowProjection: 'Cash Flow Projection',
    rentalIncome: 'Rental Income',
    mortgagePayment: 'Mortgage Payment',
    holdingCost: 'Holding Cost',
    netCashFlow: 'Net Cash Flow',
    yearsUnit: 'Years',
    otherInvIncome: 'Other Inv. Income',
    monthlyExpenses: 'Monthly Expenses',
    yearlyBigExpenses: 'Yearly Big Expenses',
    monthlyAverage: 'Monthly Avg',
    positiveFlow: 'Positive Flow',
    negativeFlow: 'Negative Flow',
    monthLabel: 'Month {n}',
    
    tipInterestRate: 'Annual interest rate for commercial loan.',
    tipProvidentRate: 'Annual interest rate for provident fund loan, usually lower.',
    tipProvidentQuota: 'Max loan amount allowed by Provident Fund Center.',
    tipLoanTerm: 'Total years for repayment. Longer term means lower monthly payment but higher total interest.',
    tipPrepaymentYear: 'Which year to make a lump-sum repayment.',
    tipPrepaymentAmount: 'Principal amount to repay at once.',
    tipAlternativeReturn: 'Opportunity cost. Expected return if you invest down payment/monthly diff instead.',
    tipInflation: 'Used to calc real purchasing power. Wealth shrinks if appreciation < inflation.',
    tipHoldingYears: 'How many years you plan to hold the property.',
    tipMonthlyRent: 'Expected monthly rent. Fill 0 if self-occupied and not renting out.',
    tipAppreciation: 'Expected average annual growth rate of property price.',
    tipVacancy: 'Time ratio when property is empty. 8.3% approx 1 month/year.',
    tipHoldingCost: 'Annual cost for property mgmt, heating, etc., as % of property value.',
    tipMaintenance: 'Fixed annual maintenance cost (repair, renovation).',
    tipExistingProp: 'Excluding the one you plan to buy.',
    tipExistingDebt: 'Other monthly debts (car loan, other mortgages, credit cards).',
    tipFamilyIncome: 'Monthly after-tax family income, for DTI calculation.',

    // Modals
    buyingProcessTitle: 'Buying Process',
    buyingStep1Title: '1. Preparation',
    buyingStep1Desc: 'Verify eligibility. Confirm down payment source, reserve funds for taxes, fees, and renovation.',
    buyingStep1Detail: 'Check credit report in advance to ensure no bad records affect the loan.',
    buyingStep2Title: '2. House Hunting',
    buyingStep2Desc: 'Follow "Location-Amenities-Layout". Check lighting by day, noise by night, leaks by rain.',
    buyingStep2Detail: 'Use the "Location Guide" in this tool to score. Focus on school districts and future planning.',
    buyingStep3Title: '3. Signing',
    buyingStep3Desc: 'Sign subscription agreement. Verify owner identity and property title.',
    buyingStep3Detail: 'Note breach clauses. Funds must go to escrow account, never private transfer.',
    buyingStep4Title: '4. Loan Application',
    buyingStep4Desc: 'Submit income proof, bank statements (usually 2x monthly payment). Interview and await approval.',
    buyingStep4Detail: 'Prioritize Provident Fund or Combination Loan. Choose repayment method based on cash flow.',
    buyingStep5Title: '5. Tax & Transfer',
    buyingStep5Desc: 'Pay deed tax, income tax, and maintenance fund. Go to housing authority for transfer.',
    buyingStep5Detail: 'New title deed usually issued 3-7 working days after transfer.',
    buyingStep6Title: '6. Handover',
    buyingStep6Desc: 'Property handover (clear utilities). Inspect for hollows, doors/windows, and waterproofing.',
    buyingStep6Detail: 'Get keys, start renovation or move in. Remember to change utility names.',

    locationGuideTitle: 'Location Guide (5-3-2)',
    locationIntro: 'Real estate is about population in long term, land in mid term, finance in short term. But core is always location.',
    locTransport: 'Transport (Metro/Main Rd)',
    locEducation: 'Education/Medical',
    locCommercial: 'Commercial (Mall/Conv)',
    locEnvironment: 'Environment (Park/Noise)',
    locPotential: 'Future Potential',
    locTotalScore: 'Total Score',
    locRating: 'Rating',
    applyScore: 'Apply Score to AI',

    // Tour
    tourWelcomeTitle: 'Welcome',
    tourWelcomeContent: 'A professional real estate investment decision tool. Helps you make smarter decisions via quantitative calc and AI analysis.',
    tourStep1Title: '1. Config Params',
    tourStep1Content: 'Input price, loan, rent, and hidden costs. Supports Commercial, Provident, and Combo loans.',
    tourStep2Title: '2. Real-time Analysis',
    tourStep2Content: 'View initial fund distribution, returns, cash flow risk, and wealth growth curve.',
    tourStep3Title: '3. Asset Comparison',
    tourStep3Content: 'Buy house or stock? Compare net worth gap and view multi-dim qualitative analysis.',
    tourStep4Title: '4. AI Consultant',
    tourStep4Content: 'Ask Josephine anything. She knows your costs and inflation settings.',
    tourSkip: 'Skip',
    tourNext: 'Next',
    tourStart: 'Start',
    tourGuide: 'New User Guide',

    feedbackTitle: 'Feedback',
    submitFeedback: 'Submit',
    thanksFeedback: 'Thanks for feedback!',
    feedbackPlaceholder: 'Describe your issue or suggestion...',
    feedbackSuccessTitle: 'Thanks for feedback!',
    feedbackSuccessDesc: 'We will read your suggestions carefully.',
    feedbackContact: 'Contact: hollipembletoncrf40@gmail.com',
    
    // Chart Legends
    propertyValue: "Nominal Property Value",
    realPropertyValue: "Real Property Value",
    stockNetWorth: "Nominal Stock Value",
    realStockNetWorth: "Real Stock Value",
    remainingLoan: "Remaining Loan",

    // Table Headers
    thYear: "Year",
    thPropertyNet: "Property Net",
    thStockNet: "Stock Net",
    thDiff: "Diff",
    thPayment: "Payment",
    thPrincipal: "Principal",
    thInterest: "Interest",
    thRemainingPrincipal: "Remaining",

    // Schedule Modal
    scheduleTitle: "Repayment Schedule",
    scheduleSubtitleYear: "First {n} Years (Inc. Prepay)",
    scheduleSubtitleMonth: "First {n} Months (Inc. Prepay)",
    chartTitleYear: "Yearly Payment & Balance",
    chartTitleMonth: "Monthly Payment & Balance",
    legendInterest: "Interest Paid",
    legendPrincipal: "Principal Paid",
    legendRemaining: "Remaining Principal",
    granularityYear: "Yearly",
    granularityMonth: "Monthly",

    // Misc
    thDimension: "Dimension",
    financeClass: "Finance Class",
    axisYear: "Year {v}",
    noData: "No data, please adjust holding years",
    monthIndex: "Month {n}",
    restartChat: "Restart Chat",
    returnRate: "Return",
    reportTitle: "Investment Analysis Report",

    // Metric Cards
    metricCashOnCash: "Cash on Cash",
    metricComprehensive: "Comprehensive",
    metricFirstPayment: "1st Payment",
    metricTotalRevenue: "Total Revenue",
    subActualInvest: "Based on actual invest",
    subIncAppreciation: "Inc. Appreciation",
    subCoverage: "Coverage",
    subBreakEven: "Break-even: Year {year}",
    subNotBreakEven: "Not break-even",
    tipCashOnCash: "(Net Rent - Mortgage) / Initial Cash * 100%",
    tipComprehensive: "(Total Profit / Total Invest) * 100%",
    tipFirstPayment: "Rent / Monthly Payment",
    tipTotalRevenue: "Total profit at end of holding period",

    // Charts & Analysis
    chartInitialCost: "Initial Cost Breakdown",
    labelDownPayment: "Down Payment",
    labelDeedTax: "Deed Tax",
    labelAgencyFee: "Agency Fee",
    labelRenovation: "Renovation",
    labelTotalInvest: "Total Invest (Wan)",
    labelHouseInvest: "Real Estate",
    labelStockInvest: "Financial Invest",
    labelWinner: "WINNER",

    // AI Chat
    aiTitle: "AI Advisor",
    aiPrivateKey: "(Private Key)",
    aiOnline: "Online",
    aiReset: "Chat reset.",
    // Navigation
    lifePathSimulator: "Life Path Simulator",
    goalCalculator: "Home Buying Countdown",
    tokenExchange: "Wealth Exchange",
    lifeDragIndex: "Life Drag Index",
    aiWelcome: "Hello! I am Josephine, your AI Investment Advisor.\n\nI have calculated results based on your parameters (Price {price}w, Initial Cost {cost}w).\n\nYou can use the [Location Guide] to score the location, and I will provide specific advice based on the potential.",
    aiActionReport: "Generate Report",
    aiActionCompare: "Buy vs Invest",
    aiActionLocation: "Location Review",
    aiPlaceholderThinking: "Josephine is thinking...",
    aiPlaceholderAsk: "Ask me anything about this investment...",
    aiMsgReport: "Please generate a detailed investment analysis report for me.",
    aiMsgCompare: "Should I buy a house or invest in stocks?",
    aiMsgLocation: "Based on my location score, please evaluate the appreciation potential.",
    aiError: "Error occurred. Please check network or API Key.",

    // Footer & Modals
    footerQuote: '"First survive, then thrive. Plan for the worst to invest steadily."',
    footerCreated: "Created by Josephine",
    footerDonate: "Donate",
    footerFeedback: "Feedback",
    
    settingsTitle: "AI Settings",
    settingsKeyLabel: "Custom Gemini API Key",
    settingsKeyPlaceholder: "Enter Key starting with 'AIza'",
    settingsKeyTip: "Key is stored locally in your browser. It will be used for chat if set.",
    settingsClear: "Clear & Restore Default",
    settingsSave: "Save Settings",

    donationTitle: "Support Development",
    donationDesc: "Your support keeps the updates coming!",
    donationClose: "Close",

    methodologyTitle: "Calculation Methodology",
    methodologyContent: `
        <div class="space-y-8">
        <!-- Core Return Metrics -->
        <section class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
            <h3 class="text-lg font-bold text-indigo-700 dark:text-indigo-300 mb-4 flex items-center gap-2">📊 1. Core Return Metrics</h3>
            <div class="space-y-4">
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">Cash Return Rate (Cash-on-Cash)</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        Cash Return = (Annual Net Rent - Annual Mortgage) / Initial Investment × 100%
                    </div>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Measures annual cash flow relative to initial investment. Positive = surplus after mortgage; Negative = monthly shortfall.</p>
                    <div class="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-xs text-emerald-700 dark:text-emerald-300">
                        📍 Example: ¥60K rent, ¥40K mortgage, ¥1M down → (60-40)/100 = <strong>2%</strong>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">Total Return Rate</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        Total Return = (Cumulative Cash Flow + Net Equity - Total Investment) / Total Investment × 100%
                    </div>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Comprehensive ROI combining cash flow, appreciation, and principal paydown.</p>
                    <ul class="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                        <li>• <strong>Cumulative Cash Flow</strong>: Rent - Mortgage - Holding Costs</li>
                        <li>• <strong>Net Equity</strong>: Current Value × (1+Appreciation)^Years - Remaining Loan</li>
                        <li>• <strong>Total Investment</strong>: Down Payment + Taxes + Renovation + Fees</li>
                    </ul>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">Annualized Return</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        Annualized Return = [(Final Value / Initial Investment)^(1/Years) - 1] × 100%
                    </div>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Converts cumulative return to average yearly rate for comparison with stocks/bonds.</p>
                </div>
            </div>
        </section>

        <!-- Loan Calculation Models -->
        <section class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
            <h3 class="text-lg font-bold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">🏦 2. Loan Calculation Models</h3>
            <div class="space-y-4">
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">Equal Principal & Interest (Amortizing)</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        Payment = Principal × [r × (1+r)^n] / [(1+r)^n - 1]
                    </div>
                    <div class="grid grid-cols-2 gap-3 text-xs mt-3">
                        <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">✅ Fixed monthly payment</div>
                        <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">⚠️ Higher total interest</div>
                        <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">📊 Interest-heavy early</div>
                        <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">👤 Ideal for stable income</div>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">Equal Principal (Declining)</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        Monthly Payment = (Principal / Months) + (Remaining Balance × Monthly Rate)
                    </div>
                    <div class="grid grid-cols-2 gap-3 text-xs mt-3">
                        <div class="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded">✅ Lower total interest</div>
                        <div class="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded">⚠️ High initial payments</div>
                        <div class="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded">📉 Payments decrease</div>
                        <div class="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded">👤 For rising income</div>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">Combination Loan (HPF + Commercial)</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">HPF rate ~3.1%, Commercial ~4.2%. Blending reduces overall cost.</p>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm">
                        Total Payment = HPF Payment (low rate) + Commercial Payment (high rate)
                    </div>
                </div>
            </div>
        </section>

        <!-- Risk Assessment -->
        <section class="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-rose-100 dark:border-rose-800">
            <h3 class="text-lg font-bold text-rose-700 dark:text-rose-300 mb-4 flex items-center gap-2">⚠️ 3. Risk Assessment Metrics</h3>
            <div class="space-y-4">
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">DTI (Debt-to-Income Ratio)</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        DTI = Total Monthly Debt Payments / Gross Monthly Income × 100%
                    </div>
                    <div class="flex gap-2 text-xs mt-3">
                        <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">&lt;30% Low Risk</span>
                        <span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full">30-50% Moderate</span>
                        <span class="px-3 py-1 bg-rose-100 text-rose-700 rounded-full">&gt;50% High Risk</span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Banks typically require DTI below 55% for loan approval.</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">DSCR (Debt Service Coverage Ratio)</h4>
                    <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm mb-2">
                        DSCR = Monthly Rental Income / Monthly Mortgage Payment
                    </div>
                    <div class="flex gap-2 text-xs mt-3">
                        <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">&gt;1.3 Excellent</span>
                        <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">1.0-1.3 Good</span>
                        <span class="px-3 py-1 bg-rose-100 text-rose-700 rounded-full">&lt;1.0 Negative CF</span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Below 1.0 means rent doesn't cover mortgage - you pay monthly.</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-slate-800 dark:text-white mb-2">Stress Test Scenarios</h4>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="p-2 bg-rose-50 dark:bg-rose-900/30 rounded">📉 Price Drop 20%</div>
                        <div class="p-2 bg-rose-50 dark:bg-rose-900/30 rounded">📉 Rent Drop 30%</div>
                        <div class="p-2 bg-rose-50 dark:bg-rose-900/30 rounded">📈 Rate Increase 2%</div>
                        <div class="p-2 bg-rose-50 dark:bg-rose-900/30 rounded">🏠 6-Month Vacancy</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Investment Costs -->
        <section class="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-800">
            <h3 class="text-lg font-bold text-amber-700 dark:text-amber-300 mb-4 flex items-center gap-2">💰 4. Investment Cost Breakdown</h3>
            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <table class="w-full text-sm">
                    <thead class="bg-amber-100 dark:bg-amber-900/30">
                        <tr><th class="p-2 text-left rounded-tl-lg">Cost Item</th><th class="p-2 text-left">Calculation</th><th class="p-2 text-left rounded-tr-lg">Typical Range</th></tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                        <tr><td class="p-2 font-medium">Down Payment</td><td class="p-2">Price × Down %</td><td class="p-2">20%-35%</td></tr>
                        <tr><td class="p-2 font-medium">Deed Tax</td><td class="p-2">Price × Tax Rate</td><td class="p-2">1%-3%</td></tr>
                        <tr><td class="p-2 font-medium">Agent Fee</td><td class="p-2">Price × %</td><td class="p-2">1%-2%</td></tr>
                        <tr><td class="p-2 font-medium">Renovation</td><td class="p-2">Fixed or Area × Rate</td><td class="p-2">¥50K-200K</td></tr>
                        <tr><td class="p-2 font-medium">Other Fees</td><td class="p-2">Appraisal, mortgage</td><td class="p-2">¥5K-10K</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Holding Costs -->
        <section class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800">
            <h3 class="text-lg font-bold text-purple-700 dark:text-purple-300 mb-4 flex items-center gap-2">🏠 5. Annual Holding Costs</h3>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-sm mb-2">Property Management</h4>
                    <p class="text-xs text-slate-500">Area × Rate/mo × 12</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-sm mb-2">Maintenance Fund</h4>
                    <p class="text-xs text-slate-500">Price × 0.2%/year</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-sm mb-2">Insurance</h4>
                    <p class="text-xs text-slate-500">Price × 0.05%/year</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-sm mb-2">Vacancy Loss</h4>
                    <p class="text-xs text-slate-500">Annual Rent × Vacancy %</p>
                </div>
            </div>
        </section>

        <!-- Key Formulas -->
        <section class="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800">
            <h3 class="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">📐 6. Core Mathematical Formulas</h3>
            <div class="space-y-3">
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <div class="flex justify-between items-center">
                        <span class="font-medium text-sm">Compound Interest</span>
                        <code class="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded text-sm">FV = PV × (1 + r)^n</code>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <div class="flex justify-between items-center">
                        <span class="font-medium text-sm">Present Value</span>
                        <code class="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded text-sm">PV = FV / (1 + r)^n</code>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <div class="flex justify-between items-center">
                        <span class="font-medium text-sm">Inflation Adjustment</span>
                        <code class="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded text-sm">Real Value = Nominal / (1 + Inflation)^n</code>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                    <div class="flex justify-between items-center">
                        <span class="font-medium text-sm">Opportunity Cost</span>
                        <code class="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded text-sm">= Down Payment × (1 + Return Rate)^n - Down Payment</code>
                    </div>
                </div>
            </div>
        </section>

        <!-- Parameter Guide -->
        <section class="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">⚙️ 7. Input Parameter Guide</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>Property Price</strong>: Purchase price of the property</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>Down Payment %</strong>: Initial cash payment as % of price</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>Commercial Rate</strong>: Annual rate for commercial loan</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>HPF Rate</strong>: Housing Provident Fund loan rate</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>Loan Term</strong>: Repayment period, typically 10-30 years</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>Monthly Rent</strong>: Expected rental income</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>Appreciation Rate</strong>: Expected annual price growth</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>Alt. Return Rate</strong>: Return if investing instead</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>Inflation Rate</strong>: Annual currency devaluation</div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-lg"><strong>Vacancy Rate</strong>: % of time property is empty</div>
            </div>
        </section>
        </div>
    `,

    // Logic & Advice
    adviceS: 'Core Asset. Flawless location, great transport & schools. Strong value retention and liquidity. Recommended for long-term holding.',
    adviceA: 'High Potential. Balanced amenities, maybe 1-2 highlights (school/metro). Good for living & investing. Likely to outperform market.',
    adviceB: 'Self-use. Basic amenities met, but lacks growth drivers. Average liquidity. Watch price, avoid buying at peak.',
    adviceC: 'Caution. Obvious downsides (remote, no metro/school). High liquidity risk and depreciation pressure in downturns.',
    
    housePro1: 'Strong inflation hedge',
    housePro2: 'Leverage amplifies gains',
    housePro3: 'Utility/Living value',
    stockPro1: 'High liquidity (T+1)',
    stockPro2: 'No holding costs',
    stockPro3: 'Diversified risk',
    netWorthMore: 'Net Worth +{amount}k',
    
    dimLiquidity: 'Liquidity',
    dimBarrier: 'Barrier',
    dimLeverage: 'Leverage',
    dimEffort: 'Effort',
    dimInflation: 'Inflation Hedge',
    
    valLowMonths: 'Low (Months)',
    valHighT1: 'High (T+1)',
    valHighDown: 'High (Down Pay)',
    valLow100: 'Low ($100)',
    valStrongLev: 'Strong (3-5x)',
    valWeakLev: 'Weak (Margin)',
    valHighEffort: 'High (Maint/Tax)',
    valLowEffort: 'Low (Click)',
    valStrongInf: 'Strong (Hard Asset)',
    valMedInf: 'Medium (Depends)',
    
    dimVolatility: 'Volatility',
    dimTax: 'Tax Efficiency',
    dimPsychology: 'Psychological Safety',
    dimDiversify: 'Diversification',
    dimPassive: 'Passive Income',
    dimInherit: 'Inheritance Value',
    dimExit: 'Exit Difficulty',
    dimGrowth: 'Growth Potential',
    dimManage: 'Management Complexity',
    
    valLowVol: 'Low (5-10%/yr)',
    valHighVol: 'High (15-30%/yr)',
    valTaxHouse: 'Deed Tax + Holding',
    valTaxStock: 'Capital Gains Tax',
    valPsychHouse: 'Strong (Tangible)',
    valPsychStock: 'Weak (Paper)',
    valDivHouse: 'Weak (Single Asset)',
    valDivStock: 'Strong (Diversified)',
    valPassHouse: 'Rental Income',
    valPassStock: 'Dividends',
    valInhHouse: 'Strong (Real Estate)',
    valInhStock: 'Medium (Account)',
    valExitHouse: 'High (Long Cycle)',
    valExitStock: 'Low (Instant Sell)',
    valGrowthHouse: 'Medium (GDP-tied)',
    valGrowthStock: 'High (Growth Stocks)',
    valManageHouse: 'High (Tenants/Repairs)',
    valManageStock: 'Low (Passive Hold)',
    
    cardOpportunity: 'Opportunity Cost',
    cardOpportunityDesc: 'Buying means losing chance to invest down payment elsewhere. "Asset Comparison" quantifies this hidden cost.',
    cardCompound: 'Compound Interest',
    cardCompoundDesc: 'Financial inv usually benefits from compounding (snowball); Property gains mainly from leverage + appreciation.',
    cardLiquidity: 'Liquidity Trap',
    cardLiquidityDesc: 'Property is illiquid. Urgent sale or downturn may require deep discount. Stocks are liquid.',
    cardREITs: 'REITs',
    cardREITsDesc: 'Invest in real estate like stocks? REITs have low barrier and high liquidity.',
    cardDCA: 'DCA Strategy',
    cardDCADesc: 'DCA (Dollar Cost Averaging) smooths risk in finance; Buying house is one-time high-stakes lock-in.',
    
    stratNoPrepay: 'No Prepayment',
    stratBase: 'Base Plan',
    stratReducePay: 'Reduce Payment',
    stratReducePayDesc: 'Lower monthly pressure, better cash flow, less interest saved.',
    stratReduceTerm: 'Reduce Term',
    stratReduceTermDesc: 'Max interest saved, debt free sooner, same monthly pressure.',
    recReduceTerm: 'Rec: [Reduce Term] to save interest',
    recCashFlow: 'Rec: Choose based on cash flow',
    
    // Stress Test Scenarios
    stressTest: 'Stress Test',
    scenPriceDrop: 'Price Drop 10%',
    scenPriceDrop20: 'Price Drop 20%',
    scenPriceUp: 'Price Up 20%',
    scenRentDrop: 'Rent Drop 20%',
    scenRentDrop30: 'Rent Drop 30%',
    scenRentUp: 'Rent Up 30%',
    scenRateUp: 'Rate +1%',
    scenRateUp2: 'Rate +2%',
    scenVacancy: 'Vacancy 20%',
    scenHoldingCostUp: 'Holding Cost +50%',
    scenSellYear: 'Sell in Year {year}',
    scenCombo1: 'Price -10% + Rent -20%',
    scenCombo2: 'Rate +1% + Vacancy 20%',
    customScenario: 'Custom Scenario',
    addCustom: 'Add Custom',
    scenarioName: 'Scenario Name',
    priceChange: 'Price Change',
    rentChange: 'Rent Change',
    rateChange: 'Rate Change',
    vacancyChange: 'Vacancy Rate',
    holdingCostChange: 'Holding Cost Change',
    sellYearCustom: 'Sell Year',
    resetScenario: 'Reset',
    applyScenario: 'Apply Scenario',
    
    // Rent vs Buy
    rentVsBuyTitle: 'Rent vs Buy Analysis',
    rentVsBuyAnalysis: 'Rent vs Buy',
    buyScenario: 'Buy & Live',
    rentScenario: 'Rent & Invest',
    buyNetWorth: 'Buy Net Worth',
    rentNetWorth: 'Rent Net Worth',
    breakevenPoint: 'Breakeven Point',
    breakevenDesc: 'In Year {year}, buying becomes more profitable than renting.',
    neverBreakeven: 'Renting is more profitable during the holding period.',
    monthlyCostDiff: 'Monthly Cost Diff',
    buyCost: 'Buy Cost',
    rentCost: 'Rent Cost',
    investDiff: 'Invest Diff',
    diffAnalysis: 'At year {year}, {winner} is better by {diff} {unit}.',
    
    // Game Mode
    gameModeTitle: "Life Simulator: 20 Years After Buying",
    
    // Life Path
    lifePathTitle: "Life Path Simulator",
    lifePathDesc: "Simulate asset accumulation and quality of life under different property exchange strategies.",
    
    // House Roast & AI
    roastTitle: "House's Inner Thoughts",
    roastSubtitle: "Reality Check: Wake Up",
    aiPerspectiveCheck: "AI Perspective",
    ifIWereYou: "If I Were You",
    socialPerspective: "Social Perspective",
    peerChoice: "Peer Choice",

    // Game Mode
    lifeSimTitle: "Life Sim: 20 Years After Buying",
    lifeSimReset: "Reset Sim",
    endingReached: "ENDING REACHED",
    endingWealthy: "Wealthy Ending",
    endingDebt: "Debt Ending",
    endingZen: "Zen Ending",
    endingStruggle: "House Slave Ending",
    endingNormal: "Normal Ending",
    finalAssets: "Final Assets",
    happinessIndex: "Happiness Index",
    stressIndex: "Stress Index",
    keyLifeEvents: "Key Life Events",
    yearN: "Year {year}",
    uneventfulLife: "An uneventful life, no major surprises.",
    lifeTrajectory: "Life Trajectory",
    netWorth: "Net Worth",
    happiness: "Happiness",
    netWorthLeft: "Net Worth (Left)",
    happinessRight: "Happiness (Right)",

    // Footer
    aboutTool: "About Tool",
    aboutDesc: "Smart Mortgage Advisor is a professional real estate investment decision tool helping you make wise choices via data analysis.",
    disclaimer: "For reference only, not financial advice.",
    quickNav: "Quick Nav",
    navHome: "Home/Comparison",
    navAsset: "Asset Allocation",
    navLifePath: "Life Path Sim",
    navCar: "Car Purchase",
    navKnowledge: "Knowledge/Glossary",
    navStress: "Stress Test/Scenario",
    navLogic: "Calculation Logic",
    dataSources: "Data Sources",
    sourceLpr: "LPR Rate: PBOC",
    sourcePrice: "Prices: National Bureau of Statistics",
    sourceMarket: "Market Data: Public Info",
    sourceModel: "Model: Standard Financial Formulas",
    helpFeedback: "Help & Feedback",
    feedbackBtn: "Feedback",
    donateBtn: "Buy Me a Coffee ☕",

    externalLinks: {
        title: "Macro Data & Trends",
        ershoufang: "Second-hand Data (Official)",
        creprice: "CRE Price (Market)",
        eastmoney: "East Money Index",
        stats: "National Stats Bureau",
        tsinghua: "Tsinghua Index"
    },

    themes: {
        light: "Light",
        dark: "Dark",
        professional: "Professional",
        gaming: "Gaming",
        deepblack: "Deep Black"
    },

    presets: {
        title: "Quick Presets",
        loadPreset: "Load Preset",
        presetLoaded: "Loaded preset: {name}"
    },
    riskTitle: "⚠️ Risk Warning & Disclaimer",
    riskWarning: "All analysis results are based on user inputs and hypothetical macro data. They are for reference only and do not constitute investment advice. The real estate market is subject to various factors. Market involves risks, please decide carefully. Consult professional advisors before making major financial decisions.",
    quote: "\"Wise decisions come from sufficient information\"",

    // Section Navigation
    navInputPanel: "Parameters",
    navComparison: "Asset Compare",
    navAnalysis: "Analysis Tools",
    navRoastPanel: "House Roast",
    navInteractive: "Live Dashboard",
    navTimeline: "Timeline",
    navGameMode: "Game Mode",
    navSellDecision: "Sell Decision",
    navAIPanel: "AI Advisor",
    navPaymentSchedule: "Payment Schedule",
    navFAQ: "FAQ",
    navFeedback: "Feedback",

    // Interactive Dashboard
    realTimeViz: "Real-time Decision Viz",
    dragParams: "Drag params to see financial impact",
    hideAdvanced: "Hide Advanced Params",
    showAdvanced: "Show Advanced Params (Antifragile)",
    advancedRiskParams: "Advanced Risk Params (Survival Check)",
    
    // Life Path Nav (Vertical)
    navLifePath: "Life Path Sim",
    navCountdown: "Countdown",
    navWealth: "Wealth Exch",
    navKnowledgeTree: "Knowledge Tree",
    navOpportunity: "Oppty Cost & Stock",
    navReview: "Decision Review",
    navNegotiation: "Negotiation Helper",
    navLiquidity: "Liquidity Analysis",
    navDrag: "House Drag Index",
    navNavalWisdom: "Naval Wisdom",

    // Naval Wisdom Engine
    wealthEngine: "Wealth Engine",
    freedomEngine: "Freedom Engine",
    specificKnowledge: "Specific Knowledge Map",
    judgmentEngine: "Judgment Engine",
    leverageAllocation: "Leverage Allocation",
    downsideShield: "Downside Shield",
    lifeGameMode: "Life Game Mode",
    ethicalWealth: "Ethical Wealth Layer",
    timeSellingRate: "Time Selling Rate",
    timeSellingDesc: "Time you don't own",
    passiveCoverage: "Passive Coverage",
    passiveCoverageDesc: "Expenses covered by assets",
    geoFreedom: "Geo Freedom",
    geoFreedomDesc: "Can you live anywhere?",
    mentalBandwidth: "Mental Bandwidth",
    mentalBandwidthDesc: "Free attention span",
    allocationDesc: "Where is your life energy going?",
    irreplaceability: "Irreplaceability",
    aiReplacement: "AI Replacement Prob",
    learningCompounding: "Learning Compound",
    monetizationMultiplier: "Value Multiplier",
    longTermThinking: "Long-term Thinking",
    cashBuffer: "Cash Buffer",
    mentalResilience: "Mental Resilience",
    singlePointFailure: "Single Point Failure",
    relationshipCompound: "Relationship Compound",
    reputationCapital: "Reputation Capital",
    netValue: "Creating Net Value",
    winWin: "Win-Win Game",
    longTermGame: "Long-term Game",
    ethicsPass: "You are playing a long-term game with long-term people. Wealth is inevitable.",
    ethicsFail: "Review your path. True wealth comes from compounding ethical relationships.",

    // Future Self
    futureTitle: "Future You Dialogue",
    futureSubtitle: "AI simulated 3 life scripts for next 10 years",
    futureDialogTitle: "Future You · Spacetime Dialogue",
    futureDialogDesc: "Not fortune telling, but data-driven deduction",
    expand: "Expand",
    collapse: "Collapse",
    timeLine: "Timeline",
    yearsLater: "{n} Years",
    persona: "Persona",
    personaConservative: "Conservative",
    personaAggressive: "Aggressive",
    adviceFrom: "Advice from Year {year}",
    currentDTI: "Current DTI",
    survivalPeriod: "Survival Period",
    regretIndex: "AI Regret Index",
    crash: "CRASH",

    // Decision Dashboard
    decisionDashboard: {
        minorityReport: "Minority Report",
        mainstream: "🚶 Mainstream",
        contrarian: "🏃 Contrarian",
        balanced: "⚖️ Balanced",
        futureBuyerOverlap: "Future Buyer Overlap",
        easyToSell: "High Liquidity",
        mediumToSell: "Medium",
        hardToSell: "Low Liquidity",
        radarYou: "You",
        radarFuture: "Future",
        familyImpact: "Family Impact",
        ifNotBuying: "If NOT Buying...",
        ifNotBuyingDesc: "Explore alternatives outside the 'Must Buy' trap",
        matchScore: "Match",
        pros: "✅ Pros",
        cons: "❌ Cons",
        regretDetector: "Regret Detector",
        regretDetectorDesc: "Focus on irreversible decisions",
        irreversible: "Irreversible",
        semiIrreversible: "Semi-Irrev",
        reversible: "Reversible",
        confidence: "Confidence",
        alternativePaths: "Alternative Paths",
        irreversibilityCheck: "Irreversibility Check"
    },

    // Market Sentiment
    marketSentiment: "Market Sentiment",
    marketSentimentDesc: "Adjust parameters to simulate market environments",
    sentimentBearish: "Bearish (Bear)",
    sentimentBullish: "Bullish (Bull)",
    sentimentNeutral: "Neutral (Chop)",
    sentimentDescBearish: "Market down, prices may drop, but rates lower.",
    sentimentAdviceBearish: "Good for stable income & high risk tolerance.",
    sentimentDescBullish: "Market booming, prices up, but borrowing costly.",
    sentimentAdviceBullish: "Assess stress from high price & high rates.",
    sentimentDescNeutral: "Market stable, metrics in reasonable range.",
    sentimentAdviceNeutral: "Suitable for most buyers.",
    sentimentProperty: "Appreciation",
    sentimentReturn: "Invest Return",
    sentimentRate: "Loan Rate",
    marketImpact: "Market Impact",
    impactPrice: "Price",
    impactRateShort: "Rate",
    impactRent: "Rent",
    impactDown: "Downward",
    impactLow: "Relatively Low",
    impactStable: "Stable",
    impactUp: "Rising Fast",
    impactHigh: "Relatively High",
    impactSyncUp: "Rising Sync",
    impactSteady: "Steady Growth",
    impactMedium: "Medium Level",
    impactSteadyGrow: "Steady Growth",
    predictionResult: "Prediction under current sentiment",
    recommendBuy: "Buy is Better",
    recommendRent: "Rent is Better",

    // Amortization Mood
    amortizationMood: "Amortization Mood",
    moodIndex: "Mood Index",
    happy: "Happy",
    neutral: "Neutral",
    unhappy: "Unhappy",
    principal: "Principal",
    interest: "Interest",
    sadMessage: "In Year {year}, about {ratio}% of your payments go to bank interest, only {principalRatio}% builds your equity.",
    neutralMessage: "In Year {year}, about {ratio}% of your payments are building equity. Things are improving!",
    happyMessage: "In Year {year}, {ratio}% of your payments are building equity. Most of your money is yours now!",
    year: "Year",
    oppWinDescPrefix: "After",
    oppWinDescYears: "years of holding,",
    oppWinDescMiddle: "is expected to outperform the alternative by",
    oppWinDescSuffix: "万.",
    viewYear: "Yearly",
    viewMonth: "Monthly",
    viewAll: "All",
    paymentSchedule: "Payment Schedule",
    paymentDetails: {
        title: "Detailed Repayment Schedule",
        byDay: "Daily",
        byWeek: "Weekly",
        byMonth: "Monthly",
        byQuarter: "Quarterly",
        byYear: "Yearly",
        all: "All",
        dayLabel: "Day",
        weekLabel: "Week",
        monthLabel: "Month",
        quarterLabel: "Quarter",
        yearLabel: "Year",
        yearN: "Year {year}",
        annualPayment: "Annual Payment",
        payment: "Payment",
        principal: "Principal",
        interest: "Interest",
        remaining: "Remaining",
        period: "Term",
        month: "Month",
        date: "Date",
        monthlyPayment: "Payment (¥)",
        principalValue: "Principal (¥)",
        interestValue: "Interest (¥)",
        remainingPrincipal: "Remaining (¥)",
        totalTerms: "Total Terms",
        totalRepayment: "Total Repayment",
        totalInterest: "Total Interest",
        termsCount: "{n} Terms",
        monthN: "Year {year} Month {month}",
        periodN: "Term {n}",
        exportCSV: "Export CSV"
    },
    battleReport: {
        title: "Investment Battle Report",
        grade: "Asset Rating",
        beat: "Beating {percent}% Investors",
        roast: "AI Roast",
        annualReturn: "Annual ROI",
        cashFlow: "Cash Flow Health",
        risk: "Risk Index",
        scan: "Scan to Try",
        shareBtn: "Share Report",
        downloadBtn: "Save Image",
        generating: "Generating..."
    },

    exportPDF: "Export PDF Report",
    incomeVolatility: "Income Fluctuation",
    volatilityNote: "30%+ is High Risk (Sales/Startup)",
    minLivingExpense: "Min Living Expense",
    basicLivingCost: "Survival cost excluding mortgage",
    emergencyReserve: "Emergency Reserves",
    survivalMonths: "Months of survival if unemployed",
    maxDti: "Max Acceptable DTI",
    psychologicalThreshold: "Psychological threshold",
    rateHikeAssumption: "Rate Hike Assumption",
    stressTestNote: "For stress testing",

    // Appreciation Predictor
    appreciationPredictor: 'Appreciation Predictor',
    cityTier: 'City Tier',
    district: 'District',
    propertyTypeLabel: 'Property Type',
    policyEnv: 'Policy Environment',
    infrastructure: 'Infrastructure',
    populationTrend: 'Population Trend',
    industryDev: 'Industry Dev',
    predictionScore: 'Prediction Score',
    futureGrowth: 'Future Growth',
    predTier1: 'Tier 1',
    predTierNew1: 'New Tier 1',
    predTier2: 'Tier 2',
    predTier3: 'Tier 3 & Below',
    schoolDistrict: 'School District',
    schoolTop: 'Top Tier School',
    schoolKey: 'Key School',
    schoolNormal: 'Average School',
    schoolNone: 'No School Info',
    propertyAgeLabel: 'Property Age',
    ageNew: 'New',
    ageSubNew: 'Sub-New (<5y)',
    ageOld: '10-20 Years',
    ageVeryOld: '>20 Years',
    developerLabel: 'Developer',
    devTop: 'Top Brand',
    devSoe: 'State-Owned',
    devNormal: 'Standard Dev',
    pmLabel: 'Property Mgmt',
    pmLevel1: 'Tier 1 Service',
    pmNormal: 'Standard Service',
    pmNone: 'No Service',
    dimensionSchool: 'Education',
    dimensionProduct: 'Product Quality',
    districtCore: 'Core',
    districtNear: 'Suburbs',
    districtFar: 'Far Suburbs',
    propertyResidential: 'Residential',
    propertyApartment: 'Apartment',
    propertyVilla: 'Villa',
    policyLoose: 'Loose',
    policyNeutral: 'Neutral',
    policyStrict: 'Strict',
    infraMajor: 'Major Plans',
    infraNormal: 'Normal Plans',
    infraNone: 'No Plans',
    popInflow: 'Inflow',
    popStable: 'Stable',
    popOutflow: 'Outflow',
    industryStrong: 'Strong',
    industryMedium: 'Medium',
    industryWeak: 'Weak',
    predictBtn: 'Predict',
    levelS: 'S - Very High',
    levelA: 'A - High',
    levelB: 'B - Medium',
    levelC: 'C - Low',
    levelD: 'D - Risky',
    yearlyGrowth: 'Avg Yearly Growth',
    risks: 'Risks',
    opportunities: 'Opportunities',
    dimensionAnalysis: 'Dimension Analysis',
    
    // Header Buttons
    headerLogin: 'Login',
    headerPreset: 'Presets',
    headerSave: 'Save & Review',
    buyingProcess: 'Buying Process',
    locationGuide: 'Location Guide',
    viewHousingTrends: 'Housing Trends',
    methodology: 'Methodology',
    tutorial: 'Tutorial',

    // Section Headers in Predictor
    sectionLocation: 'Location & Region',
    sectionProperty: 'Property & Quality',
    sectionMacro: 'Macro Environment',

    // Tabs
    overviewTab: "Overview",
    timelineTab: "Timeline",
    riskTab: "Risk Gradient",
    cashFlowTab: "Cash Flow Breath",
    regretTab: "Regret Heatmap",

    // Charts
    timelineTitle: "30-Year Repayment Timeline",
    yearAxis: "Year",
    amountAxis: "Amount (10k)",
    remainingPrincipal: "Remaining Principal",
    cumulativeInterest: "Cumulative Interest",
    riskGradientTitle: "Risk Color Gradient",
    riskValue: "Risk Value",
    breathingRoom: "Breathing Room",
    incomeLabel: "Monthly Income",
    paymentLabel: "Mortgage",
    discretionaryLabel: "Discretionary",
    regretHeatmapTip: "Darker Color = Higher Probability of Regret",

    // Life Drag Index
    lifeDragTitle: "Life Drag Index",
    lifeDragSubTitle: "Some houses won't ruin you, but they will slowly hold you back.",
    dragValue: "Drag Value",
    careerLock: "Career Lock",
    careerLockSub: "Restrictions on changing jobs / unemployment risk",
    geoLock: "Geo Lock",
    geoLockSub: "Restrictions on urban mobility",
    lifestyleCompression: "Lifestyle Compression",
    lifestyleCompressionSub: "Whether it compresses social/travel/learning",
    futureDelay: "Life Delay",
    futureDelaySub: "Whether it postpones marriage/childbirth/entrepreneurship",
    aiEvaluatingLife: "AI is analyzing your life...",
    aiEvalLifeBtn: "AI Advisor: Evaluate my life freedom",
    aiLifeImpactTip: "AI deep analysis of the hidden impact of real estate on your future",
    aiLifeEvalTitle: "AI Investment Advisor Deep Assessment",
    reAnalyze: "Re-analyze",
    adviceDragLow: "This house is an asset, not a burden.",
    adviceDragMed: "There are some constraints, especially regarding career choices.",
    adviceDragHigh: "Warning! This house is significantly squeezing your life space and future options.",
    adviceDragExtreme: "Extreme risk! You might be sacrificing life possibilities for a house.",

    // Life Path Simulator
    lpTitle: "Life Path Simulator",
    lpDesc: "Simulating asset accumulation and quality of life under different property exchange strategies",
    lpPathA: "Buy & Hold",
    lpPathB: "One Upgrade",
    lpPathC: "Multiple Upgrades",
    lpStageStarter: "Starter Home",
    lpStageUpgrade: "Upgrade Home",
    lpStageOldSmall: "Old & Small",
    lpStageNewTwo: "Newer 2-Bed",
    lpStageLux: "Luxury Home",
    lpFinalNetWorth: "Final Net Worth",
    lpNetWorthDesc: "Value after 30 years - Remaining Loan",
    lpTotalCost: "Friction Costs",
    lpTotalCostDesc: "Agency Fee + Tax + Renovation",
    lpAvgComfort: "Living Comfort",
    lpComfortDesc: "Weighted Average Comfort Score",
    lpTimeline: "Exchange Timeline",
    lpYear1: "Year 1",
    lpYear30: "Year 30",
    lpExchange: "Exchange",
    lpSell: "Sell",
    lpBuy: "Buy",
    lpCost: "Cost",
    lpChartTitle: "Asset Accumulation Comparison",
    lpRecTitle: "Smart Recommendation",
    lpRecAsset: "Best for Assets",
    lpRecAssetDesc: "Lower transaction costs mean stronger compound interest. Frequent trading erodes wealth if appreciation is low.",
    lpRecExp: "Best for Experience",
    lpRecExpDesc: "Step-by-step upgrades match living environments to life stages, offering higher quality of life.",

    // Goal Calculator
    goalCalculatorTitle: "Buy Home Countdown",
    targetPrice: "Target Price ($k)",
    targetYears: "Plan Years",
    currentSavings: "Current Savings ($k)",
    requiredReturn: "Required Annual Return",
    goalAchieved: "Goal Achieved",
    goalEasy: "Easily Achievable",
    goalModerate: "Achievable",
    goalHard: "Challenging",
    goalImpossible: "Impossible",
    adviceEasy: "Your goal is very safe. Low-risk products like deposits/bonds are recommended.",
    adviceModerate: "Reasonable goal. Suggest a balanced portfolio of stocks and bonds.",
    adviceHard: "Challenging goal. Requires higher risk tolerance. Suggest saving more or delaying purchase.",
    adviceImpossible: "Difficult to achieve. Suggest significantly increasing income, lowering budget, or delaying.",

    // Wealth Exchange
    houseWins: "Buy Home Wins",
    stockWins: "Rent & Invest Wins",
    realWealthDesc: "*Real purchasing power difference adjusted for inflation",
    luxuryTrip: "Luxury Trip",
    hermesBag: "Hermes Bag",
    starbucks: "Starbucks",
    addCustomItem: "Add Custom Wish",
    itemNamePlaceholder: "e.g. World Tour",
    itemPricePlaceholder: "Price ($)",
    delete: "Delete",
    add: "Add",
    unit: "unit",

    // Knowledge Tree
    knowledgeTree: "Knowledge Tree",
    knowledgeTreeDesc: "Learn financial concepts to make smarter decisions",
    learningProgress: "Progress",
    unlocked: "Unlocked",
    backToList: "Back to List",
    relatedTerms: "Related Terms",
    unlockNext: "Unlock Next",
    unlockAndView: "Unlock & View",
    unlockHint: "Unlock after completing actions",
    welcomeToKnowledgeTree: "Welcome to Knowledge Tree",
    knowledgeTreeWelcome: "Select a category to start learning. Analyzing more unlocks more content!",
    keepLearning: "Keep Learning",
    catLoan: "Loan Knowledge",
    catInvest: "Investment",
    catTax: "Tax Policy",
    catRisk: "Risk Management",
    catBasic: "Basic Concepts",

    // Opportunity Cost
    oppWinHouse: "Real Estate Wins",
    oppWinStock: "Index Fund Wins",
    oppWinDesc: "After {year} years, {winner} is expected to have {diff}k more net worth.",
    oppIrrHouse: "Property IRR",
    oppIrrStock: "Fund IRR",
    oppChartTitle: "Net Worth Growth Comparison",
    oppChartHouse: "Property Net Worth",
    oppChartStock: "Fund Net Worth (Base)",
    oppRiskTitle: "Reverse Thinking: What if not buying?",
    oppRiskVol: "Market Volatility (Risk)",
    oppRiskDesc: "Stock market is uncertain. The chart shows the possible range of your wealth (90% confidence) under different market conditions.",
    oppBull: "Bull Market limit",
    oppBear: "Bear Market limit",
    oppBase: "Base Projection",
    oppHouseName: "Property Net Worth",
    oppStockName: "Fund Net Worth",
    oppBullLabel: "Bullish (90%)",
    oppBearLabel: "Bearish (10%)",

    // Decision Journal
    journalTitle: "Decision Journal",
    journalNoHistory: "No Decision Records",
    journalCTA: "Click 'Save Decision' above to record your current thinking.",
    journalTimeline: "Timeline",
    journalReason: "Why this decision?",
    journalEdit: "Edit",
    journalDone: "Done",
    journalPlaceholder: "Record core reasons, e.g., school district value, marriage needs, FOMO...",
    journalRejected: "What did I give up? (Opportunity Cost)",
    journalRejectedPlaceholder: "e.g., A bigger house further away, renting & investing, older small unit...",
    journalAIReview: "AI Review",
    journalAnalyzing: "Analyzing...",
    journalAnalyzeBtn: "Start AI Review",
    journalAICallout: "Click button to let AI check for blind spots.",

    // Negotiation Helper
    negTitle: "Property Intel Input",
    negListingPrice: "Listing Price ($k)",
    negRecentPrice: "Recent Transaction ($k)",
    negSubRecent: "Avg price of similar units",
    negListingDays: "Days Listed",
    negPriceCuts: "Price Cuts",
    negInventory: "Inventory (Units)",
    negRenoScore: "Renovation (1-10)",
    negFloorScore: "Floor (1-10)",
    negResultTitle: "Target Bargain Price",
    negCurrentListing: "Listing:",
    negBargain: "Cut:",
    negUrgency: "Seller Urgency",
    negAIAdvisor: "AI Negotiation Coach",
    negGenScript: "Generate Script",
    negGenLoading: "Generating...",
    negAIPlaceholder: "Click button to generate a custom negotiation script based on data.",
    negTagUrgent: "Urgent/Hard to sell",

    // Social Perspective
    socialTitle: "Social Perspective",
    socialAiCheck: "AI Perspective",
    socialPeer: "Peer Choice",
    socialMinority: "Minority Report",
    socialFuture: "Future Buyer Overlap",
    socialFamily: "Family Impact",
    socialTabPeer: "Peers",
    socialTabMinority: "Contrarian",
    socialTabFuture: "Buyers",
    socialTabFamily: "Family",
    socialTabFutureSelf: "Future Self",
    
    // Peer Choices
    peerFullPay: "Full Payment",
    peerHighDown: "High Down Payment",
    peerLowDown: "Low Down Payment",
    peerRent: "Continue Renting",
    
    // Minority Status
    minConservative: "Conservative Minority - High Down Payment, Low Leverage.",
    minAggressive: "Aggressive Minority - Low Down Payment, High Leverage.",
    minMainstream: "Mainstream - Balanced Risk/Reward.",
    minBalanced: "Balanced - Slightly Cautious.",
    
    // Future Buyer Dimensions
    dimIncome: "Income Level",
    dimDownPay: "Down Payment Ability",
    dimTotal: "Total Price Acceptance",
    dimRisk: "Risk Appetite",
    
    // Family Impact
    famYou: "You (Primary)",
    famSpouse: "Spouse",
    famParents: "Parents",
    famChildren: "Future Children",
    famConcernJob: "Career Stability + Mortgage Stress",
    famConcernLife: "Budget Cuts + Quality of Life",
    famConcernElder: "Dependent Care + Financial Aid",
    famConcernEdu: "Education Budget + Family Time",

    // Liquidity Check
    liqTitle: "Future Buyer Profiler",
    liqSubTitle: "Counter-intuitive: You don't sell to the market, but to specific people.",
    liqInfo: "Property Info",
    liqArea: "Area (sqm)",
    liqBedrooms: "Bedrooms",
    liqLocation: "Location",
    liqSchool: "School District",
    liqTransit: "Transit Score",
    liqPriceLevel: "Price Level",
    liqAge: "Age (Years)",
    liqCompetition: "New Home Comp.",
    liqPopTrend: "Pop. Trend",
    liqPolicy: "Policy Env.",
    liqAnalyzeBtn: "Analyze Liquidity",
    liqScore: "Liquidity Score",
    liqSaleCycle: "Est. Sale Cycle",
    liqDiscountProb: "Prob. of Discount",
    liqBuyerProfile: "Future Buyer Profile (Top 3)",
    liqStrengths: "Liquidity Strengths",
    liqRisks: "Liquidity Risks",
    liqAIInsight: "AI Deep Insight",
    
    // Liquidity Options
    locCBD: "CBD Core",
    locSuburb: "Suburb",
    locRemote: "Remote",
    plLow: "Low",
    plMedium: "Medium",
    plHigh: "High",
    plLuxury: "Luxury",
    compLow: "Low",
    compMedium: "Medium",
    compHigh: "High",
    popGrow: "Growing",
    popStable: "Stable",
    popDecline: "Declining",
    polFavor: "Favorable",
    polNeutral: "Neutral",
    polRestrict: "Restrictive",
    liqStrAreaOk: 'Moderate area, wide appeal',
    liqRiskAreaBig: 'Large unit, lower liquidity',
    liqRiskAreaSmall: 'Small unit, limited appeal',
    liqStrSchool: 'School district, high demand',
    liqStrTransit: 'Convenient transit, commuter friendly',
    liqRiskTransit: 'Poor transit, hard to sell',
    liqStrPriceLow: 'Affordable price, strong demand',
    liqRiskPriceLux: 'Luxury market, niche buyers',
    liqStrNew: 'Next-new home, quality assured',
    liqRiskOld: 'Old property, high maintenance',
    liqRiskComp: 'Intense new home competition',
    liqStrPop: 'Population inflow, demand growing',
    liqRiskPop: 'Population outflow, demand shrinking',
    liqStrPol: 'Favorable policy, active market',
    liqRiskPol: 'Restrictive policy, slow transaction',
    
    // House Roast
    roastTitle: "House's Inner Thoughts",
    roastSubtitle: "Reality Check: Wake Up",
    roastClose: "Close",
    roastExpand: "View {count} Roasts",
    roastCollapse: "Hide Roasts",
    roastCritical: "{count} Danger Signals",
    roastSerious: "{count} Serious Issues",
    roastMild: "{count} Tips",
    roastReality: "Reality Check",
    roastSuggestion: "Advice",
    roastTabRoast: "Reality Check",
    roastTabAdvice: "AI Advice",
    roastFooter: "💜 Roast is tough love. Buy smart, live happy.",
    
    roastCatBudget: "Budget Issue",
    roastCatLocation: "Location Fantasy",
    roastCatCommute: "Commute Cost",
    roastCatCost: "Cost Beautification",
    roastCatReturn: "Return Fantasy",
    roastCatLifestyle: "Lifestyle Mismatch",

    // Buyer Profiles
    liqBuyerYoung: 'Young First-time Buyers',
    liqBuyerUpgrade: 'Upgrading Families',
    liqBuyerInvest: 'Investors',
    liqBuyerDown: 'Downsizing Buyers',
    liqBuyerRare: 'Niche Buyers',
    
    // Buyer Traits
    liqTraitYoung: '25-35yo, Small Family, Value-focused',
    liqTraitUpgrade: '35-45yo, Quality-focused, Second home',
    liqTraitInvest: 'Cash-rich, Appreciation-focused',
    liqTraitDown: '50+yo, Empty nest, Simplified life',
    liqTraitRare: 'Special needs, Non-mainstream',

    // Missing Keys
    predictAppreciation: "Predict Appreciation",
    viewHousingTrends: "View Housing Trends",

    // Property Details
    communityName: "Community Name",
    district: "District",
    propertyArea: "Area",
    unitPrice: "Unit Price",
    propertyType: "Property Type",
    floorLevel: "Floor Level",
    buildingAge: "Building Age",
    decorationStatus: "Decoration",
    propertyRightYears: "Property Rights",

    tipPropertyArea: "Gross floor area including shared area",
    tipUnitPrice: "Price per square meter",
    tipPropertyType: "Residence, Apartment, Villa, etc.",
    tipFloorLevel: "Floor level, higher floors usually cost more",
    tipBuildingAge: "Year built, affects loan terms",
    tipDecorationStatus: "Rough, Simple or Luxury",
    tipPropertyRightYears: "Land usage rights, usually 70 years",

    // Naval Modules
    lifePathSimulator: "Life Path Simulator",
    goalCalculator: "Goal Calculator",
    tokenExchange: "Token Exchange",
    lifeDragIndex: "Life Drag Index",
  },
};
// Add Chinese keys manually to match structure (inserting before EN starts)
// I will effectively replace the EN block start to insert ZH keys before closing brace of ZH
