
import React from 'react';
import { Sparkles, Activity, BrainCircuit, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  mood: 'happy' | 'neutral' | 'stressed';
  monthlyPayment: number;
  monthlyIncome: number;
  language: 'ZH' | 'EN';
}

const MoodAdvicePanel: React.FC<Props> = ({ mood, monthlyPayment, monthlyIncome, language }) => {
  const isHealthy = monthlyIncome > 0 && (monthlyIncome - monthlyPayment) > 0;
  
  const adviceContent = {
    ZH: {
      happy: {
        title: '保持乐观，稳健前行 (Optimistic & Steady)',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/10',
        border: 'border-emerald-100 dark:border-emerald-800',
        icon: <Sparkles className="h-6 w-6 text-emerald-500" />,
        intro: '您当前对还款压力感到轻松，这通常意味着您的财务状况处于良性循环中，或者您拥有极佳的心理韧性。这是一个利用“富余认知带宽”进行长期财务规划的绝佳时机。',
        sections: [
          {
            title: '财务进阶策略 (Financial Growth)',
            content: '既然当下的现金流没有给您带来显著压力，建议您考虑利用剩余资金进行更积极的资产配置。例如，您可以评估当前房贷利率与潜在投资回报率。如果您的投资收益率稳定高于房贷利率，那么维持现状并进行投资是明智的；反之，如果您手头有闲置资金且缺乏高收益投资渠道，可以考虑设立一个“提前还款基金”，灵活性地应对未来变化。此外，请检查您的紧急备用金是否足以覆盖 6-12 个月的开支，这是保持乐观心态的物质基础。'
          },
          {
            title: '心理建设与生活平衡 (Wellness & Balance)',
            content: '轻松的心态是生活质量的重要保障。请继续保持这种积极的生活态度，但也请警惕“乐观偏差”。建议定期（如每季度）审视一次家庭资产负债表，确保这种安全感是建立在真实的数据之上。您可以尝试将这种轻松的心态投射到生活的其他方面，比如规划一次家庭旅行或投资于个人技能提升，因为对自己的人力资本投资往往回报最高。记住，房子是生活的容器，而生活本身才是目的。'
          },
          {
            title: '长期风险控制 (Long-term Risk Control)',
            content: '在顺境中未雨绸缪是智慧的表现。建议您利用这段时间优化保险配置，特别是寿险和重疾险，以防止突发事件冲击目前的良性财务状况。同时，关注职业发展路径的多样性，确保收入来源的稳定性。如果可能，尝试建立被动收入流，让您的财务自由度进一步提高，从“这就够了”迈向“游刃有余”。'
          }
        ]
      },
      neutral: {
        title: '理性平和，行稳致远 (Rational & Balanced)',
        color: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-50 dark:bg-slate-900/10',
        border: 'border-slate-100 dark:border-slate-800',
        icon: <Activity className="h-6 w-6 text-slate-500" />,
        intro: '您对还款持平淡态度，这是一种非常理性和成熟的状态。您可能已经习惯了将房贷作为生活开支的一部分，既不为此过度焦虑，也没有过分乐观。这种“平常心”是长期坚持还款马拉松的最佳心态。',
        sections: [
          {
            title: '收支优化建议 (Budget Optimization)',
            content: '在平淡期，我们容易忽视财务结构中的微小漏洞。建议您进行一次精细化的记账分析，看看是否有一些非必要的习惯性支出可以削减，从而增加每月的自由现金流。即使是每月节省下来的几百元，如果投入到复利增长的理财工具中，长期来看也是一笔可观的财富。同时，评估一下是否可以通过副业或职业技能提升来增加开源的可能性，打破收支平衡的“死水”，注入新的活力。'
          },
          {
            title: '应对潜在波动 (Handling Volatility)',
            content: '平淡有时也可能意味着对风险的“脱敏”。请确保这种平静不是因为忽视了潜在的危机。市场环境和个人职业生涯都可能存在周期性波动。建议您做一个简单的“压力测试”：假设收入减少 20% 或家庭支出突然增加 30%，您当前的财务体系是否依然能维持运转？如果答案是不确定的，那么现在就是加固财务护城河的最佳时机。不要等到暴风雨来临才开始修缮屋顶。'
          },
          {
            title: '资产效能提升 (Asset Efficiency)',
            content: '您的房产不仅仅是负债，也是一种资产。关注周边房价走势和租赁市场变化，了解您房屋的真实市场价值。如果未来有置换需求，现在的平稳期是研究市场、积累相关知识的好机会。此外，可以了解一下银行是否有新的按揭优待政策或转按揭机会，也许能通过一些操作降低利息支出，让您的财务状况从“平稳”迈向“更优”。'
          }
        ]
      },
      stressed: {
        title: '正视压力，转危为机 (Facing Stress)',
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-900/10',
        border: 'border-rose-100 dark:border-rose-800',
        icon: <AlertTriangle className="h-6 w-6 text-rose-500" />,
        intro: '您感到压力较大，这完全可以理解。房贷往往是家庭最大的单笔负债，感到焦虑是负责任的表现。但请记住，焦虑本身不能解决问题，行动可以。我们将帮助您拆解压力，寻找突破口。',
        sections: [
          {
            title: '紧急财务止血 (Emergency Financial Aid)',
            content: '首先，请深呼吸。让我们客观分析压力的来源：是收入暂时性下降，还是支出结构不合理？如果是现金流紧张，请立即启动“生存模式”预算，暂停一切非必要开支。检查是否有可快速变现的闲置资产。如果预计未来几个月还款困难，请务必提前与银行沟通，寻求延长还款期限或暂时只还利息的可能性，千万不要因为逃避而导致断供，信用记录受损是更大的麻烦。记住，保住信用就是保住东山再起的资本。'
          },
          {
            title: '心理调适与重构 (Psychological Reframing)',
            content: '不要让房贷定义您的人生价值。您是房子的主人，而不是房子的奴隶。压力大时，我们容易陷入“隧道视野”，只看得到眼前的困难。试着跳出来看，这只是长达 20-30 年还款周期中的一个短暂低谷。与家人坦诚沟通困境，共同分担心理压力，家庭的支持是最大的强心剂。同时，保证基本的睡眠和运动，因为身体垮了，财务问题会更加棘手。告诉自己：只要人在、健康在，钱总能挣回来的。'
          },
          {
            title: '开源节流实战 (Income & Expense Action)',
            content: '在节流做到极致后，开源是解决问题的根本。不要囿于面子，任何合法的收入来源都值得尝试。利用业余时间送外卖、开网约车、做兼职顾问，或者出售闲置物品，这些“小钱”不仅能缓解燃眉之急，更能通过行动带来的掌控感来缓解焦虑。同时，复盘您的职业规划，看是否需要通过跳槽或转行来获得收入的跃升。压力往往也是改变的动力，利用这次危机倒逼自己成长，也许几年后回头看，这正是您人生向上攀登的转折点。'
          }
        ]
      }
    },
    EN: {
      happy: {
        title: 'Optimistic & Steady',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/10',
        border: 'border-emerald-100 dark:border-emerald-800',
        icon: <Sparkles className="h-6 w-6 text-emerald-500" />,
        intro: 'You feel relaxed about your repayment pressure, which usually implies a healthy financial cycle or excellent psychological resilience. This is a perfect time to use your "cognitive surplus" for long-term financial planning.',
        sections: [
          {
            title: 'Financial Growth',
            content: 'Since current cash flow presents no significant stress, consider more aggressive asset allocation with surplus funds. Evaluate your mortgage rate against potential investment returns. If investment yields consistently outperform your mortgage rate, maintaining the mortgage while investing is wise. Conversely, if you lack high-yield channels, consider building an "Early Repayment Fund" for flexibility. Ensure your emergency fund covers 6-12 months of expenses—this is the material foundation of your optimism.'
          },
          {
            title: 'Wellness & Balance',
            content: 'A relaxed mindset guarantees quality of life. Maintain this positive attitude but beware of "optimism bias." Periodically review your family balance sheet to ensure security is data-driven. Project this mindset elsewhere—plan a family trip or invest in skills, as human capital investment often yields the highest returns. Remember, the house is a container for life, but living is the purpose.'
          },
          {
            title: 'Long-term Risk Control',
            content: 'Preparing for a rainy day while the sun shines is wisdom. Optimize insurance coverage (life, critical illness) to prevent unforeseen events from shocking your healthy finances. Focus on career diversity to ensure income stability. If possible, build passive income streams to elevate your financial freedom from "Sufficient" to "Abundant".'
          }
        ]
      },
      neutral: {
        title: 'Rational & Balanced',
        color: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-50 dark:bg-slate-900/10',
        border: 'border-slate-100 dark:border-slate-800',
        icon: <Activity className="h-6 w-6 text-slate-500" />,
        intro: 'You view repayment with equanimity—a rational, mature state. You likely accept mortgage as a routine expense, neither anxious nor overly optimistic. This "business as usual" mindset is ideal for the long repayment marathon.',
        sections: [
          {
            title: 'Budget Optimization',
            content: 'In calm times, we overlook small leaks. Conduct a refined expense analysis to cut habitual non-essentials, increasing free cash flow. Even saving a small amount monthly, compounded over time, becomes significant wealth. Assess potential for side hustles or upskilling to break "breakeven" stagnation and inject new vitality.'
          },
          {
            title: 'Handling Volatility',
            content: 'Calmness can mean risk desensitization. Ensure peace isn\'t ignorance of danger. Markets and careers have cycles. Perform a "Stress Test": if income drops 20% or expenses rise 30%, can your system hold? If uncertain, now is the time to fortify your financial moat. Don\'t fix the roof only when it rains.'
          },
          {
            title: 'Asset Efficiency',
            content: 'Your property is an asset, not just a liability. Monitor local price trends and rental markets to know its true value. If you plan to upgrade, this stable period is perfect for research. Check if banks offer better refinancing terms to lower interest costs, moving your status from "Stable" to "Optimal".'
          }
        ]
      },
      stressed: {
        title: 'Facing Stress',
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-900/10',
        border: 'border-rose-100 dark:border-rose-800',
        icon: <AlertTriangle className="h-6 w-6 text-rose-500" />,
        intro: 'Feeling stressed is understandable and responsible given the mortgage\'s size. However, anxiety doesn\'t solve problems—action does. Let\'s break down the stress and find a breakthrough.',
        sections: [
          {
            title: 'Emergency Aid',
            content: 'Breathe. Analyze the stress source: income drop or structural spending issue? If cash flow is tight, activate "Survival Mode" budgeting; pause all non-essentials. Check for liquidatable assets. If repayment seems difficult soon, contact the bank immediately for extensions or interest-only periods. Never just default—protecting your credit is protecting your future comeback capital.'
          },
          {
            title: 'Psychological Reframing',
            content: 'Don\'t let the mortgage define you. You own the house; it doesn\'t own you. Stress creates "tunnel vision." Zoom out—this is a brief low in a 30-year cycle. Share the burden with family; support is a powerful booster. Maintain sleep and exercise; physical collapse makes financial issues harder. Tell yourself: As long as you have health, wealth can be rebuilt.'
          },
          {
            title: 'Income & Expense Action',
            content: 'After extreme saving, earning more is key. Put aside pride; any legal income helps. Gig work or selling idle items not only eases immediate needs but reduces anxiety through action. Review your career: is it time to switch jobs for a raise? Crisis drives growth—use this pressure to push yourself. Years later, this might be your upward turning point.'
          }
        ]
      }
    }
  };

  const advice = adviceContent[language][mood];

  return (
    <div className={`mt-6 rounded-2xl border ${advice.border} ${advice.bg} p-6 animate-in fade-in slide-in-from-top-4 backdrop-blur-sm`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm ${advice.color}`}>
          {advice.icon}
        </div>
        <div>
          <h4 className={`text-lg font-bold ${advice.color}`}>
            {advice.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ZH' ? '基于AI的情绪与财务联合分析 • Generated by DeepEstate Advisor' : 'AI-Powered Emotional & Financial Analysis • Generated by DeepEstate Advisor'}
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="mb-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-white/20 dark:border-slate-800/50">
        “{advice.intro}”
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {advice.sections.map((section, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
            <h5 className={`font-bold text-sm mb-3 flex items-center gap-2 ${advice.color}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
              {section.title}
            </h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-6 text-justify">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3" />
            <span>{language === 'ZH' ? '建议仅供参考，投资决策请咨询专业顾问' : 'Advice for reference only. Consult pros for decisions.'}</span>
        </div>
        <div>
            {language === 'ZH' 
              ? (isHealthy ? '您的财务状况看似健康，继续保持！' : '当前现金流略显紧张，建议优先关注风险控制。')
              : (isHealthy ? 'Financial Health Looks Good. Keep it up!' : 'Cash flow tight. Prioritize risk control.')
            }
        </div>
      </div>
    </div>
  );
};

export default MoodAdvicePanel;
