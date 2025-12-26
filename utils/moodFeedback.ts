
export interface MoodContent {
  title: string;
  message: string;
  actionItem: string;
  quote: string;
}

export const MOOD_FEEDBACK: Record<string, { ZH: MoodContent; EN: MoodContent }> = {
  '😭': {
    ZH: {
      title: '拥抱此刻的脆弱',
      message: '亲爱的，首先请深呼吸。房贷确实是一座大山，但在攀登的过程中，感到疲惫和压力是完全正常的。这一刻的眼泪不是软弱，而是你一直在努力扛起责任的证明。请不要被数字定义，你的价值远高于这串债务。偶尔的停歇是为了更好地出发，房子是生活的容器，但它不应挤占你快乐的空间。今晚，请允许自己暂时卸下重担，只做一个被生活温柔以待的人。',
      actionItem: '💡 建议：今晚不做任何财务计算，泡个热水澡或看一部治愈的电影。',
      quote: '“生活不是等待风暴过去，而是学会在雨中跳舞。”'
    },
    EN: {
      title: 'Embrace the Vulnerability',
      message: 'Deep breath, dear friend. The mortgage is indeed a heavy mountain, and it is completely normal to feel exhausted and pressured during the climb. These tears are not weakness; they are proof of the immense responsibility you have been carrying. Do not let the numbers define you; your worth far exceeds this debt. A pause is sometimes necessary for a better journey ahead. A house is a vessel for life, but it should not squeeze out your joy. Tonight, allow yourself to set aside the burden and simply be.',
      actionItem: '💡 Tip: No calculations tonight. Take a hot bath or watch a healing movie.',
      quote: '"Life isn\'t about waiting for the storm to pass, it\'s about learning to dance in the rain."'
    }
  },
  '😕': {
    ZH: {
      title: '迷雾终将散去',
      message: '对未来感到焦虑和迷茫，是因为你在乎这份安稳。市场起伏不定，政策瞬息万变，这种不确定性确实让人心慌。但请记住，你已经做出了当时最好的选择，并且一直在按部就班地履行承诺。焦虑往往源于对未知的恐惧，而你手中的每一分积蓄、每一笔还款，都是对抗不确定性最坚实的盾牌。不要看太远，只看脚下，走好今天的这一步，路自然会延伸开来。',
      actionItem: '💡 建议：列出你目前最担心的三个具体问题，然后划掉那些你无法控制的。',
      quote: '“心中有光，慢一点也无妨。”'
    },
    EN: {
      title: 'The Fog Will Lift',
      message: 'Feeling anxious or confused about the future shows how much you value this stability. Markets fluctuate and policies change—this uncertainty is unsettling. But remember, you made the best choice you could, and you have been faithfully honoring your commitment. Anxiety often stems from fear of the unknown, but every repayment you make is a shield against that uncertainty. Don\'t look too far ahead; just focus on the ground beneath your feet. Take this step today, and the path will reveal itself.',
      actionItem: '💡 Tip: List three specific worries, then cross out the ones you cannot control.',
      quote: '"As long as there is light within, it does not matter how slow you go."'
    }
  },
  '😐': {
    ZH: {
      title: '平静是最大的力量',
      message: '这是一种非常棒的状态。在漫长的还贷旅程中，“平淡”其实是最奢侈的褒奖。它意味着你的现金流健康，生活处于一种微妙而坚韧的平衡中。你没有被压力击垮，也没有盲目乐观，这种稳健的心态是长期主义者的通行证。就像日复一日的日出日落，看似重复，实则蕴含着巨大的生命力。保持这种节奏，时间会成为你最忠实的朋友，默默地为你积累财富。',
      actionItem: '💡 建议：虽然一切正常，但这周也可以奖励自己一杯好咖啡，庆祝只要“维持现状”就是胜利。',
      quote: '“流水不争先，争的是滔滔不绝。”'
    },
    EN: {
      title: 'Peace is Power',
      message: 'This is an excellent state of being. In the marathon of mortgage repayment, "neutrality" is a luxury. It means your cash flow is healthy and your life is in a resilient balance. You are neither crushed by pressure nor blindly optimistic. This steady mindset is the hallmark of a long-term winner. Like the daily sunrise, it may seem repetitive, but it holds immense vitality. Maintain this rhythm, and time will become your most loyal friend, quietly compounding your wealth.',
      actionItem: '💡 Tip: Even if everything is "normal", treat yourself to a nice coffee this week. Maintenance is victory.',
      quote: '"Water does not compete to be first, but to flow without ceasing."'
    }
  },
  '🙂': {
    ZH: {
      title: '小确幸在闪光',
      message: '真为你感到高兴！这说明你不仅完全掌控了财务状况，还在生活中找到了属于自己的节奏。房贷对你来说，已经不再是沉重的枷锁，而是督促你规划人生的动力。你正在用每一天的努力，将钢筋水泥转化为温暖的家。这种从容不迫的姿态，本身就是一种成功。把这份好心情延续下去，它是你最大的财富，能感染身边的每一个人。',
      actionItem: '💡 建议：记录下今天发生的一件开心小事，或者给家添置一个小物件。',
      quote: '“生活明朗，万物可爱。”'
    },
    EN: {
      title: 'Sparks of Joy',
      message: 'Reviewing your status, I am thrilled for you! This indicates that you not only have your finances under control but have found a rhythm in life. The mortgage is no longer a shackle, but a motivation for structure. With every day\'s effort, you are transmuting steel and concrete into a warm home. This graceful composure is a success in itself. Hold onto this positivity; it is your greatest asset and radiates to everyone around you.',
      actionItem: '💡 Tip: Record one small happy thing from today, or buy a small item for your home.',
      quote: '"Keep your face always toward the sunshine—and shadows will fall behind you."'
    }
  },
  '🤩': {
    ZH: {
      title: '你正在掌控人生！',
      message: '太棒了！你的状态简直无敌！你不仅是在还房贷，你是在玩转这场“人生杠杆游戏”。你清晰地知道自己的目标，并且拥有充沛的精力和信心去实现它。这种掌控感和成就感是无价的。你现在不仅是自己资产的CEO，更是生活的赢家。请务必记住这种感觉，当未来遇到波折时，这一刻的自信将是你最强大的能量源泉。继续冲吧，未来可期！',
      actionItem: '💡 建议：这种高光时刻值得纪念！去吃顿大餐，或者规划一下提前还款的下一个里程碑！',
      quote: '“也就是这一刻，你比任何时候都更接近自由。”'
    },
    EN: {
      title: 'Master of Your Destiny!',
      message: 'Incredible! Your energy is absolutely unstoppable! You aren\'t just paying a mortgage; you are mastering the game of "Life Leverage". You have clear goals and the abundant confidence to achieve them. This sense of control and achievement is priceless. You are now the CEO of your assets and a winner in life. Anchor this feeling deep within; let this confidence be your power source for any future challenges. Keep engaging, the future is bright!',
      actionItem: '💡 Tip: Celebrate this high point! Have a feast, or plan the next milestone for early repayment!',
      quote: '"It is in this very moment that you are closer to freedom than ever before."'
    }
  }
};
