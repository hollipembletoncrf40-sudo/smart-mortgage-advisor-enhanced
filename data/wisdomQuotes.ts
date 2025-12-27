
export interface QuoteItem {
  text: string;
  textEn: string;
  author: string;
  authorEn: string;
  category?: string;
}

export const WISDOM_QUOTES: QuoteItem[] = [
  // --- Warren Buffett ---
  {
    text: "在别人贪婪时恐惧，在别人恐惧时贪婪。",
    textEn: "Be fearful when others are greedy, and greedy when others are fearful.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "价格是你支付的，价值是你得到的。",
    textEn: "Price is what you pay. Value is what you get.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "真正的风险来自于你不知道自己在做什么。",
    textEn: "Risk comes from not knowing what you are doing.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "很多事情做对了，只是因为没有做错。",
    textEn: "You only have to do a very few things right in your life so long as you don't do too many things wrong.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "如果你不愿意拥有一只股票十年，那就连十分钟也不要拥有。",
    textEn: "If you aren't willing to own a stock for ten years, don't even think about owning it for ten minutes.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "股市是财富从急躁者手中转移到耐心者手中的工具。",
    textEn: "The stock market is a device for transferring money from the impatient to the patient.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "只有在潮水退去时，你才知道谁在裸泳。",
    textEn: "Only when the tide goes out do you discover who's been swimming naked.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "不要亏损。规则二：永远不要忘记规则一。",
    textEn: "Rule No.1: Never lose money. Rule No.2: Never forget Rule No.1.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "我们的投资期限是：永远。",
    textEn: "Our favorite holding period is forever.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  
  // --- Charlie Munger & Mental Models ---
  {
    text: "赚大钱不在于买卖，而在于等待。",
    textEn: "The big money is not in the buying and selling, but in the waiting.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
  {
    text: "反过来想，总是反过来想。",
    textEn: "Invert, always invert.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
  {
    text: "如果不终身学习，这里的任何人如果不经常因为自己之前的想法是错的而感到尴尬，那你就很难取得成功。",
    textEn: "I constantly see people rise in life who are not the smartest, sometimes not even the most diligent, but they are learning machines.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
  {
    text: "手里拿着锤子的人，看什么都像钉子。（避免单一思维模型）",
    textEn: "To the man with only a hammer, every problem looks like a nail.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
  {
    text: "能力圈：知道自己不知道什么，比聪明更重要。",
    textEn: "Knowing what you don't know is more useful than being brilliant.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
  {
    text: "许多难题只有在跨学科的方法下才能解决。（Lollapalooza效应）",
    textEn: "You need a latticework of mental models from multiple disciplines.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
  {
    text: "嫉妒是唯一没有任何乐趣的罪恶。",
    textEn: "Envy is a really stupid sin because it's the only one you could never possibly have any fun at.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
  {
    text: "获得好配偶的最好方法是让自己配得上。",
    textEn: "The best way to get a good spouse is to deserve a good spouse.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
  {
    text: "每天起床时，争取比以前更聪明一点。",
    textEn: "Spend each day trying to be a little wiser than you were when you woke up.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
  {
    text: "避免极端强烈的意识形态，因为它会破坏你的大脑。",
    textEn: "Avoid intense ideology because it ruins your mind.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },

  // --- Howard Marks ---
  {
    text: "你不可能在和大众做着同样事情的同时，这就叫做战胜市场。",
    textEn: "You can't do the same things others do and expect to outperform.",
    author: "霍华德·马克斯",
    authorEn: "Howard Marks"
  },
  {
    text: "树木不会长到天上去，大多数东西都有周期。",
    textEn: "Trees don't grow to the sky. Most things are cyclical.",
    author: "霍华德·马克斯",
    authorEn: "Howard Marks"
  },
  {
    text: "这世界上有老投资者，也有大胆的投资者，但没有又老又大胆的投资者。",
    textEn: "There are old investors, and there are bold investors, but there are no old bold investors.",
    author: "霍华德·马克斯",
    authorEn: "Howard Marks"
  },
  {
    text: "投资的成功不在于买得好，而在于买得好。",
    textEn: "Investment success doesn't come from buying good things, but from buying things well.",
    author: "霍华德·马克斯",
    authorEn: "Howard Marks"
  },

  // --- Ray Dalio & Principles ---
  {
    text: "痛苦 + 反思 = 进步。",
    textEn: "Pain + Reflection = Progress.",
    author: "瑞·达利欧",
    authorEn: "Ray Dalio"
  },
  {
    text: "如果你不觉得一年前的自己是个笨蛋，那说明你这一年没学到什么东西。",
    textEn: "If you don't look back at yourself a year ago and think you were an idiot, you haven't learned much.",
    author: "瑞·达利欧",
    authorEn: "Ray Dalio"
  },
  {
    text: "现金是垃圾。（但在危机时刻是氧气）",
    textEn: "Cash is trash. (But creates options during crises)",
    author: "瑞·达利欧",
    authorEn: "Ray Dalio"
  },
  {
    text: "拥抱现实，应对现实。",
    textEn: "Embrace reality and deal with it.",
    author: "瑞·达利欧",
    authorEn: "Ray Dalio"
  },

  // --- Naval Ravikant ---
  {
    text: "如果你不能在睡觉时赚钱，你将工作直到死去。",
    textEn: "If you don't find a way to make money while you sleep, you will work until you die.",
    author: "纳瓦尔·拉维坎特",
    authorEn: "Naval Ravikant"
  },
  {
    text: "把自己产品化。",
    textEn: "Productize yourself.",
    author: "纳瓦尔·拉维坎特",
    authorEn: "Naval Ravikant"
  },
  {
    text: "财富是你在睡觉时还在为你赚钱的资产；金钱只是我们转移时间和财富的方式。",
    textEn: "Wealth is assets that earn while you sleep. Money is how we transfer time and wealth.",
    author: "纳瓦尔·拉维坎特",
    authorEn: "Naval Ravikant"
  },
  {
    text: "具体的知识是无法被培训的，如果能被培训，计算机就能取代你。",
    textEn: "Specific knowledge cannot be taught, but it can be learned.",
    author: "纳瓦尔·拉维坎特",
    authorEn: "Naval Ravikant"
  },
  {
    text: "读那些基础的东西，读那些经得起时间考验的东西。",
    textEn: "Read what's foundational. Read the classics.",
    author: "纳瓦尔·拉维坎特",
    authorEn: "Naval Ravikant"
  },

  // --- Psychology & Life ---
  {
    text: "如果你想错了，你会错得离谱；如果你想对了，你也很幸运。",
    textEn: "We are prone to overestimate how much we understand about the world.",
    author: "丹尼尔·卡尼曼",
    authorEn: "Daniel Kahneman"
  },
  {
    text: "慢思考：不要相信你的直觉，尤其是面对复杂数字时。",
    textEn: "Thinking, Fast and Slow: Don't trust your intuition on complex statistics.",
    author: "丹尼尔·卡尼曼",
    authorEn: "Daniel Kahneman"
  },
  {
    text: "我们受苦往往更多是因为想象，而不是现实。",
    textEn: "We suffer more often in imagination than in reality.",
    author: "塞内卡 (斯多葛学派)",
    authorEn: "Seneca"
  },
  {
    text: "一个人生活的幸福取决于他的思想质量。",
    textEn: "The happiness of your life depends upon the quality of your thoughts.",
    author: "马可·奥勒留",
    authorEn: "Marcus Aurelius"
  },
  
  // --- Investment & Real Estate Wisdom ---
  {
    text: "房产不应仅仅被视为投资，更是一种消费。",
    textEn: "Real estate should not just be seen as an investment, but also as consumption.",
    author: "反常识投资观",
    authorEn: "Counter-intuitive Wisdom"
  },
  {
    text: "租房不是'扔钱'，它是为自由和选择权付费。",
    textEn: "Rent is not 'throwing money away', it is paying for freedom and optionality.",
    author: "反常识投资观",
    authorEn: "Counter-intuitive Wisdom"
  },
  {
    text: "不要因为'付得起首付'就买房，要因为'买得起未来'才买。",
    textEn: "Don't buy just because you can afford the down payment; buy because you can afford the future.",
    author: "财富罗盘",
    authorEn: "WealthCompass"
  },
  {
    text: "杠杆是一把双刃剑，它能放大收益，也能放大毁灭。",
    textEn: "Leverage is a double-edged sword; it magnifies gains but also magnifies destruction.",
    author: "投资常识",
    authorEn: "Investment Common Sense"
  },
  {
    text: "地段，地段，还是地段？不，是现金流，现金流，还是现金流。",
    textEn: "Location, location, location? No. Cash flow, cash flow, cash flow.",
    author: "现代房产投资",
    authorEn: "Modern Real Estate"
  },
  {
    text: "最好的投资是投资自己。",
    textEn: "The best investment you can make is in yourself.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "长期主义是普通人最难坚持的捷径。",
    textEn: "Long-termism is the hardest shortcut for ordinary people to stick to.",
    author: "财富罗盘",
    authorEn: "WealthCompass"
  },
  {
    text: "由于复利的力量，微小的改变会产生巨大的结果。",
    textEn: "Atomic Habits: Tiny changes, remarkable results.",
    author: "詹姆斯·克利尔",
    authorEn: "James Clear"
  },
  {
    text: "如果你无法控制情绪，你就无法控制金钱。",
    textEn: "If you cannot control your emotions, you cannot control your money.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "不仅要看到显而易见的，还要看到那些未被看见的。（机会成本）",
    textEn: "That which is seen, and that which is not seen. (Opportunity Cost)",
    author: "巴斯夏",
    authorEn: "Frédéric Bastiat"
  },
  
  // --- Nassim Taleb ---
  {
    text: "不要听他们说什么，要看他们怎么做。（利益攸关）",
    textEn: "Don't tell me what you think, tell me what you have in your portfolio. (Skin in the Game)",
    author: "纳西姆·塔勒布",
    authorEn: "Nassim Taleb"
  },
  {
    text: "脆弱性是指因波动和不确定性而受损；反脆弱则是因此而获益。",
    textEn: "Antifragility is beyond resilience or robustness. The resilient resists shocks and stays the same; the antifragile gets better.",
    author: "纳西姆·塔勒布",
    authorEn: "Nassim Taleb"
  },
  {
    text: "主要的三种上瘾物是海洛因、碳水化合物和月薪。",
    textEn: "The three most harmful addictions are heroin, carbohydrates, and a monthly salary.",
    author: "纳西姆·塔勒布",
    authorEn: "Nassim Taleb"
  },

  // --- Peter Lynch ---
  {
    text: "投资你所了解的东西。",
    textEn: "Invest in what you know.",
    author: "彼得·林奇",
    authorEn: "Peter Lynch"
  },
  {
    text: "如果你在市场上花费超过13分钟分析经济和市场预测，你已经浪费了10分钟。",
    textEn: "If you spend more than 13 minutes analyzing economic and market forecasts, you've wasted 10 minutes.",
    author: "彼得·林奇",
    authorEn: "Peter Lynch"
  },
  
  // --- Miscellaneous Wisdom ---
  {
    text: "简单的复杂比复杂的简单更难。",
    textEn: "Simple can be harder than complex: You have to work hard to get your thinking clean to make it simple.",
    author: "史蒂夫·乔布斯",
    authorEn: "Steve Jobs"
  },
  {
    text: "不要试图表现得聪明，要努力不犯傻。",
    textEn: "It is remarkable how much long-term advantage people like us have gotten by trying to be consistently not stupid, instead of trying to be very intelligent.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
  {
    text: "无论你做什么，都不要为了追求收益率而在这个时候降低你的信用标准。",
    textEn: "Reach for yield is stupid.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
  {
    text: "成功的投资需要纪律、耐心和勇气。",
    textEn: "Successful investing requires discipline, patience, and courage.",
    author: "塞斯·卡拉曼",
    authorEn: "Seth Klarman"
  },
  {
    text: "市场总是沿着阻力最小的方向运动。",
    textEn: "The market moves in the direction of least resistance.",
    author: "杰西·利弗莫尔",
    authorEn: "Jesse Livermore"
  },
  {
    text: "与其预测风雨，不如打造方舟。",
    textEn: "Predicting rain doesn't count. Building arks does.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "不要把资本永久性损失的风险和波动性混为一谈。",
    textEn: "Don't confuse volatility with risk of permanent loss of capital.",
    author: "霍华德·马克斯",
    authorEn: "Howard Marks"
  },
  {
    text: "即使你非常聪明，如果不能控制自己的情绪，也依然会破产。",
    textEn: "You can be a genius and still go broke if you lose control of your emotions.",
    author: "摩根·豪塞尔",
    authorEn: "Morgan Housel"
  },
  {
    text: "存钱与其说是为了购买某样东西，不如说是为了购买时间。",
    textEn: "Saving is not just for buying things; it's for buying time.",
    author: "摩根·豪塞尔",
    authorEn: "Morgan Housel"
  },
  {
    text: "真正的富有是当你早上醒来时可以说：'我今天可以做我想做的任何事'。",
    textEn: "True wealth is waking up in the morning and saying: 'I can do whatever I want today'.",
    author: "摩根·豪塞尔",
    authorEn: "Morgan Housel"
  },
  {
    text: "大多数人高估了一年能做的事，却低估了十年能做的事。",
    textEn: "Most people overestimate what they can do in one year and underestimate what they can do in ten years.",
    author: "比尔·盖茨",
    authorEn: "Bill Gates"
  },
  {
    text: "只有偏执狂才能生存。",
    textEn: "Only the paranoid survive.",
    author: "安迪·格鲁夫",
    authorEn: "Andy Grove"
  },
  {
    text: "如果不去破坏自己的生意，别人就会来破坏它。",
    textEn: "If you don't cannibalize yourself, someone else will.",
    author: "史蒂夫·乔布斯",
    authorEn: "Steve Jobs"
  },
  {
    text: "最大的风险是不冒任何风险。",
    textEn: "The biggest risk is not taking any risk.",
    author: "马克·扎克伯格",
    authorEn: "Mark Zuckerberg"
  },
  {
    text: "不要让学校教育干扰了你的学习。",
    textEn: "Don't let schooling interfere with your education.",
    author: "马克·吐温",
    authorEn: "Mark Twain"
  },
  {
    text: "每个人都是天才。但如果你用爬树能力来判断一条鱼，它终其一生都会觉得自己是个笨蛋。",
    textEn: "Everybody is a genius. But if you judge a fish by its ability to climb a tree, it will live its whole life believing that it is stupid.",
    author: "爱因斯坦",
    authorEn: "Albert Einstein"
  },
    // --- Additional Quotes to Reach Quantity ---
  {
    text: "所谓运气，就是机会碰巧撞到了你的努力。",
    textEn: "Luck is what happens when preparation meets opportunity.",
    author: "塞内卡",
    authorEn: "Seneca"
  },
  {
    text: "很多时候，为了得到某样东西，最可靠的方法不仅仅是想要它，而是让自己配得上它。",
    textEn: "To get what you want, you have to deserve what you want.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
    {
    text: "在这个世界上，没有所谓的失败，只有反馈。",
    textEn: "There is no failure. Only feedback.",
    author: "罗伯特·艾伦",
    authorEn: "Robert Allen"
  },
  {
    text: "我们对未来的预测往往只反映了现在的偏见。",
    textEn: "Our predictions of the future are often just reflections of our present biases.",
    author: "纳西姆·塔勒布",
    authorEn: "Nassim Taleb"
  },
  {
    text: "不要用战术上的勤奋，掩盖战略上的懒惰。",
    textEn: "Don't use tactical diligence to cover up strategic laziness.",
    author: "雷军",
    authorEn: "Lei Jun"
  },
  {
    text: "你的时间有限，所以不要为别人而活。",
    textEn: "Your time is limited, so don't waste it living someone else's life.",
    author: "史蒂夫·乔布斯",
    authorEn: "Steve Jobs"
  },
  {
    text: "不仅要低头拉车，还要抬头看路。",
    textEn: "Don't just pull the cart with your head down; look up at the road ahead.",
    author: "中国谚语",
    authorEn: "Chinese Proverb"
  },
    {
    text: "由于人们更倾向于规避损失而不是获取收益，所以市场往往会过度反应。",
    textEn: "Because people are more loss-averse than gain-seeking, markets tend to overreact.",
    author: "丹尼尔·卡尼曼",
    authorEn: "Daniel Kahneman"
  },
  {
    text: "不要把你不需要的钱，投资于你无法承受损失的风险中。",
    textEn: "Don't risk money you have and need for money you don't have and don't need.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "如果你发现自己掉进了坑里，最重要的一件事就是停止挖掘。",
    textEn: "The most important thing to do if you find yourself in a hole is to stop digging.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "复利是世界第八大奇迹。",
    textEn: "Compound interest is the eighth wonder of the world.",
    author: "爱因斯坦",
    authorEn: "Albert Einstein"
  },
  {
    text: "在生活中，如果你能通过避免犯傻而不是努力变得聪明来取得成功，那将是惊人的。",
    textEn: "It is remarkable how much long-term advantage people like us have gotten by trying to be consistently not stupid, instead of trying to be very intelligent.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
    // Adding more short wisdoms
  {
    text: "永远不要因为你觉得以后能以更高的价格卖给别人而买入任何东西。",
    textEn: "Never buy anything because you think you can sell it to someone else for a higher price later.",
    author: "博傻理论",
    authorEn: "Greater Fool Theory"
  },
  {
    text: "市场底部由冷漠铸就，顶部由狂热铸就。",
    textEn: "Market bottoms are made of apathy; market tops are made of euphoria.",
    author: "华尔街格言",
    authorEn: "Wall Street Saying"
  },
  {
    text: "你必须对世界如何运作感兴趣，而不仅仅是你想让它如何运作。",
    textEn: "You have to be interested in how the world actually works, not just how you want it to work.",
    author: "瑞·达利欧",
    authorEn: "Ray Dalio"
  },
  {
    text: "多样化是无知的保护伞。",
    textEn: "Diversification is protection against ignorance.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "如果你必须预测，那就预测常常发生的事情。",
    textEn: "If you have to forecast, forecast often.",
    author: "埃德加·费德勒",
    authorEn: "Edgar Fielder"
  },
  {
    text: "历史不会重演，但总会押韵。",
    textEn: "History doesn't repeat itself, but it does rhyme.",
    author: "马克·吐温",
    authorEn: "Mark Twain"
  },
   {
    text: "别人对你的看法于你无关。",
    textEn: "What other people think of you is none of your business.",
    author: "人生智慧",
    authorEn: "Life Wisdom"
  },
  {
    text: "做难事必有所得。",
    textEn: "Doing hard things yields rewards.",
    author: "中国谚语",
    authorEn: "Chinese Proverb"
  },
  {
    text: "如果你想走得快，就一个人走；如果你想走得远，就一起走。",
    textEn: "If you want to go fast, go alone. If you want to go far, go together.",
    author: "非洲谚语",
    authorEn: "African Proverb"
  },
  {
    text: "耐心是智慧的伴侣。",
    textEn: "Patience is the companion of wisdom.",
    author: "圣奥古斯丁",
    authorEn: "Saint Augustine"
  },
  {
    text: "知识就是力量。",
    textEn: "Knowledge is power.",
    author: "弗朗西斯·培根",
    authorEn: "Francis Bacon"
  },
  {
    text: "没有检视的人生不值得一过。",
    textEn: "The unexamined life is not worth living.",
    author: "苏格拉底",
    authorEn: "Socrates"
  },
  {
    text: "认识你自己。",
    textEn: "Know thyself.",
    author: "苏格拉底",
    authorEn: "Socrates"
  },
  {
    text: "无论是认为自己行还是不行，你都是对的。",
    textEn: "Whether you think you can, or you think you can't – you're right.",
    author: "亨利·福特",
    authorEn: "Henry Ford"
  },
   {
    text: "凡是杀不死我的，必将使我更强大。",
    textEn: "That which does not kill us makes us stronger.",
    author: "尼采",
    authorEn: "Friedrich Nietzsche"
  },
  // --- Added to reach 100+ target ---
  {
    text: "生活不是等待暴风雨过去，而是学会在雨中跳舞。",
    textEn: "Life isn't about waiting for the storm to pass, it's about learning to dance in the rain.",
    author: "薇薇安·格林",
    authorEn: "Vivian Greene"
  },
  {
    text: "凡是过往，皆为序章。",
    textEn: "What's past is prologue.",
    author: "莎士比亚",
    authorEn: "William Shakespeare"
  },
  {
    text: "你要想得到这世界上最好的东西，先得让世界看到你是最好的。",
    textEn: "To get what you want, you have to deserve what you want.",
    author: "查理·芒格",
    authorEn: "Charlie Munger"
  },
  {
    text: "不要让你的野心超过你的能力。",
    textEn: "Don't let your ambition outstrip your ability.",
    author: "无名氏",
    authorEn: "Anonymous"
  },
  {
    text: "最重要的不是你赚了多少钱，而是你能留住多少钱。",
    textEn: "It's not how much money you make, but how much money you keep.",
    author: "罗伯特·清崎",
    authorEn: "Robert Kiyosaki"
  },
  {
    text: "穷人为了钱而工作，富人让钱为他们工作。",
    textEn: "The poor and the middle class work for money. The rich have money work for them.",
    author: "罗伯特·清崎",
    authorEn: "Robert Kiyosaki"
  },
  {
    text: "你无法连接未来的点滴，只能连接过去的点滴。",
    textEn: "You can't connect the dots looking forward; you can only connect them looking backwards.",
    author: "史蒂夫·乔布斯",
    authorEn: "Steve Jobs"
  },
  {
    text: "保持饥饿，保持愚蠢。",
    textEn: "Stay hungry, stay foolish.",
    author: "史蒂夫·乔布斯",
    authorEn: "Steve Jobs"
  },
  {
    text: "创新区分了领袖和追随者。",
    textEn: "Innovation distinguishes between a leader and a follower.",
    author: "史蒂夫·乔布斯",
    authorEn: "Steve Jobs"
  },
  {
    text: "做伟大的工作的唯一方法是热爱你所做的事。",
    textEn: "The only way to do great work is to love what you do.",
    author: "史蒂夫·乔布斯",
    authorEn: "Steve Jobs"
  },
  {
    text: "如果你没有竞争优势，就不要竞争。",
    textEn: "If you don't have a competitive advantage, don't compete.",
    author: "杰克·韦尔奇",
    authorEn: "Jack Welch"
  },
  {
    text: "愿景是看到不可见之下的艺术。",
    textEn: "Vision is the art of seeing what is invisible to others.",
    author: "乔纳森·斯威夫特",
    authorEn: "Jonathan Swift"
  },
  {
    text: "不要把鸡蛋放在同一个篮子里。",
    textEn: "Don't put all your eggs in one basket.",
    author: "投资谚语",
    authorEn: "Investment Proverb"
  },
  {
    text: "所谓专家，就是在一个非常狭窄的领域里犯过所有可能错误的人。",
    textEn: "An expert is a person who has made all the mistakes that can be made in a very narrow field.",
    author: "尼尔斯·玻尔",
    authorEn: "Niels Bohr"
  },
  {
    text: "预测未来最好的方法就是去创造它。",
    textEn: "The best way to predict the future is to invent it.",
    author: "亚伦·凯",
    authorEn: "Alan Kay"
  },
  {
    text: "当你不再追求确定性，你就开始成长了。",
    textEn: "When you stop looking for certainty, you start growing.",
    author: "无名氏",
    authorEn: "Anonymous"
  },
  {
    text: "如果你想造一艘船，不要召集人们去收集木头，而是教他们向往广阔无边的大海。",
    textEn: "If you want to build a ship, don't drum up people to collect wood and don't assign them tasks and work, but rather teach them to long for the endless immensity of the sea.",
    author: "安托万·德·圣埃克苏佩里",
    authorEn: "Antoine de Saint-Exupéry"
  },
  {
    text: "要在别人搞砸的时候稳住，这就是优势。",
    textEn: "The edge is in the ability to stay sane when everyone else is going crazy.",
    author: "无名氏",
    authorEn: "Anonymous"
  },
  {
    text: "金钱是很好的仆人，但由于它也是绝对的主人。",
    textEn: "Money is a terrible master but an excellent servant.",
    author: "P.T. BARNUM",
    authorEn: "P.T. Barnum"
  },
  {
    text: "如果你买了你不需要的东西，不久你就得卖掉你必须拥有的东西。",
    textEn: "If you buy things you do not need, soon you will have to sell things you need.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "华尔街是唯一一个开着劳斯莱斯的人向坐地铁的人咨询建议的地方。",
    textEn: "Wall Street is the only place that people ride to in a Rolls Royce to get advice from those who take the subway.",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett"
  },
  {
    text: "如果你在小事上没有纪律，在大事上也不会有。",
    textEn: "How you do anything is how you do everything.",
    author: "禅宗谚语",
    authorEn: "Zen Proverb"
  },
  {
    text: "宁静是力量。",
    textEn: "Silence is power.",
    author: "老子",
    authorEn: "Lao Tzu"
  },
  {
    text: "千里之行，始于足下。",
    textEn: "A journey of a thousand miles begins with a single step.",
    author: "老子",
    authorEn: "Lao Tzu"
  },
  {
    text: "知者不言，言者不知。",
    textEn: "Those who know do not speak. Those who speak do not know.",
    author: "老子",
    authorEn: "Lao Tzu"
  },
  {
    text: "上善若水。",
    textEn: "Highest good is like water.",
    author: "老子",
    authorEn: "Lao Tzu"
  },
  {
    text: "天下难事，必作于易；天下大事，必作于细。",
    textEn: "The difficult problems in life must be improved in the easy parts; the great problems must be improved in the small parts.",
    author: "老子",
    authorEn: "Lao Tzu"
  },
  {
    text: "君子求诸己，小人求诸人。",
    textEn: "The superior man seeks what is right; the inferior one, what is profitable.",
    author: "孔子",
    authorEn: "Confucius"
  },
  {
    text: "学而不思则罔，思而不学则殆。",
    textEn: "Learning without thought is labor lost; thought without learning is perilous.",
    author: "孔子",
    authorEn: "Confucius"
  },
  {
    text: "三人行，必有我师焉。",
    textEn: "When I walk along with two others, from at least one I will be able to learn.",
    author: "孔子",
    authorEn: "Confucius"
  },
  {
    text: "知之者不如好之者，好之者不如乐之者。",
    textEn: "They who know the truth are not equal to those who love it, and they who love it are not equal to those who delight in it.",
    author: "孔子",
    authorEn: "Confucius"
  },
  {
    text: "我们要追求的不是变得比别人更好，而是比过去的自己更好。",
    textEn: "There is nothing noble in being superior to your fellow man; true nobility is being superior to your former self.",
    author: "海明威",
    authorEn: "Ernest Hemingway"
  },
  {
    text: "勇气不是没有恐惧，而是意识到有比恐惧更重要的东西。",
    textEn: "Courage is not the absence of fear, but rather the judgement that something else is more important than fear.",
    author: "安布罗斯·雷德蒙",
    authorEn: "Ambrose Redmoon"
  },
  {
    text: "生活是10%发生在你身上的事，90%是你如何反应。",
    textEn: "Life is 10% what happens to you and 90% how you react to it.",
    author: "查尔斯·斯文多尔",
    authorEn: "Charles R. Swindoll"
  },
  {
    text: "最好的报复是巨大的成功。",
    textEn: "The best revenge is massive success.",
    author: "弗兰克·辛纳屈",
    authorEn: "Frank Sinatra"
  },
    {
    text: "如果你想由某种改变，自己先成为那种改变。",
    textEn: "Be the change that you wish to see in the world.",
    author: "甘地",
    authorEn: "Mahatma Gandhi"
  },
  {
    text: "弱者永远不会宽恕，宽恕是强者的属性。",
    textEn: "The weak can never forgive. Forgiveness is the attribute of the strong.",
    author: "甘地",
    authorEn: "Mahatma Gandhi"
  },
  {
    text: "幸福是当你的所想、所说、所做和谐一致的时候。",
    textEn: "Happiness is when what you think, what you say, and what you do are in harmony.",
    author: "甘地",
    authorEn: "Mahatma Gandhi"
  },
  {
    text: "教育是你可以用来改变世界的最强大的武器。",
    textEn: "Education is the most powerful weapon which you can use to change the world.",
    author: "纳尔逊·曼德拉",
    authorEn: "Nelson Mandela"
  },
  {
    text: "虽然很难，但那是值得的。",
    textEn: "It always seems impossible until it's done.",
    author: "纳尔逊·曼德拉",
    authorEn: "Nelson Mandela"
  },
  {
    text: "我没有失败，我只是发现了一万种行不通的方法。",
    textEn: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "托马斯·爱迪生",
    authorEn: "Thomas Edison"
  },
  {
    text: "天才就是1%的灵感加上99%的汗水。",
    textEn: "Genius is one percent inspiration and ninety-nine percent perspiration.",
    author: "托马斯·爱迪生",
    authorEn: "Thomas Edison"
  },
  {
    text: "如果你能梦想到，你就能做到。",
    textEn: "If you can dream it, you can do it.",
    author: "沃尔特·迪士尼",
    authorEn: "Walt Disney"
  },
  {
    text: "不要等待。时机永远不会恰到好处。",
    textEn: "Do not wait; the time will never be 'just right'.",
    author: "拿破仑·希尔",
    authorEn: "Napoleon Hill"
  },
  {
    text: "无论人的思想能构思和相信什么，它就能实现什么。",
    textEn: "Whatever the mind of man can conceive and believe, it can achieve.",
    author: "拿破仑·希尔",
    authorEn: "Napoleon Hill"
  },
  {
    text: "每一次逆境，每一次失败，每一次心痛，都蕴含着同等或更大利益的种子。",
    textEn: "Every adversity, every failure, every heartache carries with it the seed of an equal or greater benefit.",
    author: "拿破仑·希尔",
    authorEn: "Napoleon Hill"
  },
  {
    text: "如果你无法做伟大的事，那就用伟大的方式做小事。",
    textEn: "If you cannot do great things, do small things in a great way.",
    author: "拿破仑·希尔",
    authorEn: "Napoleon Hill"
  },
  {
    text: "行动是恐惧的解毒剂。",
    textEn: "Action is the foundational key to all success.",
    author: "毕加索",
    authorEn: "Pablo Picasso"
  },
  {
    text: "能把复杂的事情变简单，是大师。",
    textEn: "Simplicity is the ultimate sophistication.",
    author: "达芬奇",
    authorEn: "Leonardo da Vinci"
  }
];

export default WISDOM_QUOTES;
