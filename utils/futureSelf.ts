import { InvestmentParams, Language } from '../types';

export type TimeFrame = 3 | 5 | 10;
export type Persona = 'conservative' | 'aggressive';
export type ScenarioType = 'safe' | 'tense' | 'regret';

interface FutureMessage {
  scenario: ScenarioType;
  title: string;
  message: string;
  advice: string; // The "One sentence summary"
  mood: 'happy' | 'neutral' | 'sad';
}

export const generateFutureMessage = (
  params: InvestmentParams, 
  riskMetrics: { dti: number; breathingRoom: number; regretScore: number },
  timeFrame: TimeFrame, 
  persona: Persona,
  language: Language = 'ZH'
): FutureMessage => {
  const { dti, breathingRoom, regretScore } = riskMetrics;
  
  // 1. Determine Base Scenario (Financial Reality)
  let scenario: ScenarioType = 'safe';
  
  // Logic:
  // Regret if: DTI > 55% OR Breathing Room < 0 (Suffocating) OR Regret Score > 60
  // Tense if: DTI > 40% OR Breathing Room < 30 (Tight)
  // Safe otherwise
  
  if (dti > 0.55 || breathingRoom < 0 || regretScore > 60) {
    scenario = 'regret';
  } else if (dti > 0.40 || breathingRoom < 30 || regretScore > 30) {
    scenario = 'tense';
  } else {
    scenario = 'safe';
  }

  // Adjust for Persona: This shifts the *perception* of the scenario,
  // but we also want DIFFERENT TEXT for the same scenario depending on persona.
  // So we use unique content blocks.
  
  const isEn = language === 'EN';

  // --- SCENARIO: REGRET (High Risk / Bad Outcome) ---
  if (scenario === 'regret') {
    if (persona === 'conservative') {
       // Conservative Persona in Regret: Feels destroyed, anxious, wants complete safety.
       if (timeFrame === 3) return {
         scenario, mood: 'sad',
         title: isEn ? '3 Years Later: Wish I Waited' : '3年后：如果当时再等等就好了',
         message: isEn 
            ? '“Countless nights of regret. The mortgage is like a boulder crushing me. To pay it, we dare not go to the hospital or socialize. What we thought was "pushing ourselves" nearly pushed us to the brink.”'
            : '“这三年，我无数次在深夜后悔。房贷像一块巨石压得我喘不过气，为了保供，我们甚至不敢去医院，不敢社交。当初所谓的‘逼自己一把’，现在看来差点把自己逼上了绝路。”',
         advice: isEn ? '“Cash flow is king in uncertain times. Please, deleverage.”' : '“在这个不确定的时代，现金流比什么都重要。求求你，把杠杆降下来。”'
       };
       if (timeFrame === 5) return {
         scenario, mood: 'sad',
         title: isEn ? '5 Years Later: House Kept, Life Lost' : '5年后：房子还在，但生活没了',
         message: isEn 
            ? '“We kept the house, but sacrificed too much life. I see no resilience. If my job changes slightly, the whole family collapses. I’m fed up with walking on thin ice.”'
            : '“房子是留住了，但为了它，我们牺牲了太多生活的可能性。我看不到任何抗风险的能力，只要工作有一点变动，整个家就会崩塌。这种走钢丝的日子，我真的受够了。”',
         advice: isEn ? '“Security comes from savings, not a house.”' : '“安全感不是房子给的，是手里的余粮给的。”'
       };
       return { // 10 years
         scenario, mood: 'neutral',
         title: isEn ? '10 Years Later: A Long Debt Journey' : '10年后：漫长的偿债生涯',
         message: isEn 
            ? '“Ten years of suffering, finally creating light. But we missed too much—children’s education, parents’ healthcare—all money went into the house. If I could restart, I’d rent and invest in people.”'
            : '“熬了十年，终于看到了尽头。但这十年我们错过了太多——孩子的教育投入、老人的医疗支持，因为钱都填进了房子里。如果重来，我会选择租房，把钱花在人身上。”',
         advice: isEn ? '“Don’t lose your life to save face.”' : '“不要为了面子，输掉了里子。”'
       };
    } else {
       // Aggressive Persona in Regret: Admits failure but focuses on strategy error, or "market bet failed".
       if (timeFrame === 3) return {
         scenario, mood: 'sad',
         title: isEn ? '3 Years Later: Wrong Leverage Direction' : '3年后：杠杆加错了方向',
         message: isEn 
            ? '“I admit, I lost the bet. Cash flow risks were higher than expected. The market didn’t bounce back, and high leverage became a noose. Now considering cutting losses or holding on in pain.”'
            : '“我承认，这次赌输了。现金流断裂的风险比我预想的要大。市场没有如期反弹，高杠杆反而成了绞索。现在只能断臂求生，或者硬扛等待转机。”',
         advice: isEn ? '“Offense is fine, but offense without defense is suicide.”' : '“进攻没有错，但没有防守的进攻是自杀。”'
       };
       if (timeFrame === 5) return {
         scenario, mood: 'neutral', 
         title: isEn ? '5 Years Later: Paying for Cognition' : '5年后：为认知买单',
         message: isEn 
            ? '“Worked for the bank for 5 years. Asset is there, but after costs, it’s a loss. Missed other investment tracks, locked in real estate. That’s the biggest regret.”'
            : '“这五年是给银行打工的五年。虽然资产名义上还在，但扣除资金成本和机会成本，其实是亏损的。错过了其他更好的投资赛道，被锁死在不动产里，这是最大的遗憾。”',
         advice: isEn ? '“Liquidity lock-in is the biggest taboo in investing.”' : '“流动性锁定是投资的大忌，下次别这么冲动。”'
       };
       return { // 10 years
         scenario, mood: 'neutral',
         title: isEn ? '10 Years Later: A Pyrrhic Victory?' : '10年后：惨胜也是胜？',
         message: isEn 
            ? '“Ten years of pain, but asset preserved. But looking back, if I invested in Nasdaq or elsewhere, returns would be much higher. Heavy position in one asset was a painful lesson.”'
            : '“十年了，虽然过程极其痛苦，好歹最后资产保留下来了。但回顾这十年，如果在低位建仓纳指或者布局其他资产，收益率会高得多。单一资产重仓，教训惨痛。”',
         advice: isEn ? '“Never put all eggs in one basket, even if it’s a house.”' : '“永远不要把鸡蛋放在一个篮子里，哪怕那个篮子是房子。”'
       };
    }
  }

  // --- SCENARIO: TENSE (Moderate Risk / Tight) ---
  if (scenario === 'tense') {
    if (persona === 'conservative') {
      // Conservative in Tense: Complains about stress, anxiety, essentially "Regret-Lite".
      if (timeFrame === 3) return {
        scenario, mood: 'neutral',
        title: isEn ? '3 Years Later: Tight Living' : '3年后：紧巴巴的日子',
        message: isEn 
            ? '“No big issues, but money is tight. Every bill scares me. Dare not get sick or take leave. This ‘house slave’ feeling is bad. Not sure how long I can last.”'
            : '“虽然没出大问题，但手头真的很紧。每次看到账单都心惊肉跳，不敢生病，不敢请假。这种‘房奴’的感觉并不好受，我不确定这种紧绷的状态还能坚持多久。”',
        advice: isEn ? '“If we had saved 10% more for down payment, it would be easier.”' : '“如果能多留哪怕 10% 的首付，现在都会从容很多。”'
      };
      if (timeFrame === 5) return {
        scenario, mood: 'neutral',
        title: isEn ? '5 Years Later: Used to Frugality' : '5年后：终于习惯了节俭',
        message: isEn 
            ? '“Consumption downgrade is now normal. Travel? Shopping? Gone. Life revolves around the mortgage. It’s stable, but boring and suppressing.”'
            : '“消费降级已经成了习惯。旅游、购物想都不敢想，生活完全围绕房贷转。日子是过下来了，但总觉得少了点色彩，压抑成了常态。”',
        advice: isEn ? '“Don’t let the house kidnap your happiness.”' : '“别让房子绑架了你所有的快乐。”'
      };
      return { // 10 years
        scenario, mood: 'happy',
        title: isEn ? '10 Years Later: Seeing the Dawn' : '10年后：看见曙光',
        message: isEn 
            ? '“Income grew, inflation helped, debt pressure eased. Looking back, the first few years were hardest. Glad we persisted, but wouldn’t want to experience that tightness again.”'
            : '“随着收入增长和通胀稀释，债务压力终于小多了。回想前几年，真是咬牙挺过来的。庆幸坚持住了，但也不想再经历一次那种紧迫感。”',
        advice: isEn ? '“Time is the best friend of debt.”' : '“坚持就是胜利，但过程真的不想再来一次。”'
      };
    } else {
      // Aggressive in Tense: Views it as "Good Stress", "Forced Savings", "Smart Leverage".
      if (timeFrame === 3) return {
        scenario, mood: 'happy', // Aggressive interprets tense as "working hard"
        title: isEn ? '3 Years Later: Forced Discipline' : '3年后：强制储蓄的阵痛',
        message: isEn 
            ? '“Tight cash flow forces me to focus on work and cut useless socializing. It’s painful but disciplined. As long as cash flow doesn’t break, it’s a good forced savings.”'
            : '“现金流紧一点倒逼我更专注于工作，减少无效社交。虽然有点痛，但也算是一种强制自律。只要现金流不断，这其实是最好的强制储蓄。”',
        advice: isEn ? '“Pressure creates diamonds (or bust).”' : '“压力要么压垮你，要么成就你。”'
      };
      if (timeFrame === 5) return {
        scenario, mood: 'happy',
        title: isEn ? '5 Years Later: Leverage Bonus' : '5年后：杠杆红利期',
        message: isEn 
            ? '“House price is stable, rent saved is income. My leverage strategy is working. The tightness was worth it for the equity gained.”'
            : '“房价稳中有升，省下的租金也是收益。我的杠杆策略开始见效了。虽然手头不宽裕，但看到资产增值，还是觉得当初的激进是对的。”',
        advice: isEn ? '“Calculated risk is not gambling.”' : '“负债是富人的朋友，良性债务不用怕。”'
      };
      return { // 10 years
        scenario, mood: 'happy',
        title: isEn ? '10 Years Later: Leverage Victory' : '10年后：杠杆的胜利',
        message: isEn 
            ? '“Debt diluted by inflation significantly. Interest paid is less than appreciation. My wealth gap with peers who didn’t buy has widened. Good bet.”'
            : '“通胀把债务稀释得所剩无几。付出的利息远小于资产的增值。我和当年不敢买房的同龄人，财富差距已经拉开。这把赌对了。”',
        advice: isEn ? '“Inflation rewards the debtor.”' : '“该出手时就出手，犹豫只会败北。”'
      };
    }
  }

  // --- SCENARIO: SAFE (Low Risk / Comfortable) ---
  // (Default)
  {
     if (persona === 'conservative') {
       // Conservative in Safe: Validated, Happy, "Peace of Mind".
       if (timeFrame === 3) return {
         scenario, mood: 'happy',
         title: isEn ? '3 Years Later: Peace of Mind' : '3年后：岁月静好',
         message: isEn 
             ? '“Sleep well every night. Mortgage is a small part of expense. We decorated warmly and travel yearly. This is what a home should be, a harbor, not a burden.”'
             : '“每天晚上都睡得很踏实。房贷只占支出的一小部分，完全不影响生活质量。我们要么把家布置得很温馨，每年还能出国玩一次。这才是家该有的样子——是港湾，不是负担。”',
         advice: isEn ? '“Comfort is the ultimate return.”' : '“这就是‘留有余地’的智慧。”'
       };
       if (timeFrame === 5) return {
         scenario, mood: 'happy',
         title: isEn ? '5 Years Later: Steady Happiness' : '5年后：稳稳的幸福',
         message: isEn 
             ? '“Prices fluctuate, but I don’t care. I live here. Career is steady, savings growing. This decision was perfect for our prudent lifestyle.”'
             : '“生活不只有房子，还有诗和远方。因为月供无压力，我们有了更多时间陪伴家人，甚至存下了一笔不小的教育金。这种平衡感，比住大房子更重要。”',
         advice: isEn ? '“Living within means is wisdom.”' : '“不被物质奴役，才是真正的主人。”'
       };
       return { // 10 years
         scenario, mood: 'happy',
         title: isEn ? '10 Years Later: Wise Choice' : '10年后：长期主义的胜利',
         message: isEn 
             ? '“Loan almost paid off. We discuss changing to a better house or helping kids. Financial freedom is in sight. Prudence paved a smooth road.”'
             : '“十年了，我们的资产稳健增长，生活质量也在稳步提升。没有因为激进冒险而返贫，这种稳稳的幸福感，是你给未来十年的最好礼物。”',
         advice: isEn ? '“Slow and steady wins the race.”' : '“平平淡淡才是真，细水长流。”'
       };
     } else {
       // Aggressive in Safe: "Too Safe", "Left money on table", "Missed Opportunity", OR "Good Foundation for next play".
       if (timeFrame === 3) return {
         scenario, mood: 'neutral', // Aggressive feels "Safe" is "Boring" or "Underoptimized"
         title: isEn ? '3 Years Later: Too Conservative?' : '3年后：略显保守的开局',
         message: isEn 
             ? '“Life is easy, but seeing peers who maximized leverage gain more equity, I feel I missed out. I had the capacity for a better location or larger unit.”'
             : '“生活过很舒服，毫无压力。但有时候我会想，如果当初再激进一点，买个更大稍微偏一点的，或者核心区更贵的，现在的涨幅会不会更好？我们好像浪费了一些额度。”',
         advice: isEn ? '“Safety is good, but has opportunity costs.”' : '“甚至可以考虑再贷点款去做点别的投资？”'
       };
       if (timeFrame === 5) return {
         scenario, mood: 'happy', // Accepts the stability as base for other risks
         title: isEn ? '5 Years Later: Ample Ammo' : '5年后：弹药充足',
         message: isEn 
             ? '“Although leverage wasn’t maxed, we have ample cash flow to catch stock/business opportunities. This house is our safety net.”'
             : '“虽然房产这边没上满杠杆，但这也给了我们充裕的现金流去抓住了股市/创业的机会。这套房成了我们的安全垫，让我敢在其他地方放手一搏。”',
         advice: isEn ? '“Cash flow is another trump card.”' : '“东边不亮西边亮，现金流充裕是另一张王牌。”'
       };
       return { // 10 years
         scenario, mood: 'happy',
         title: isEn ? '10 Years Later: Flexible Position' : '10年后：进退自如',
         message: isEn 
             ? '“Ten years review: total asset mix is healthy. We didn’t get locked in one asset. Holding chips in hand, we can attack or defend. That’s wisdom.”'
             : '“十年回顾，虽然房产收益不是最大化的，但我们的总资产组合非常健康。我们没有被单一资产套牢，手里永远有筹码。这种‘进可攻退可守’的状态，也是一种大智慧。”',
         advice: isEn ? '“Winners don’t always go all-in.”' : '“赢家不一定要梭哈，活得久才是硬道理。”'
       };
     }
  }
};

