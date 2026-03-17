/**
 * 报告生成模块 - 生成《赛博桃花观测报告》
 * 用一本正经的学术报告腔解读随机内容
 */

import { analyzeFrame } from './dataStream.js';

// ===== 桃花类型库（28种 + 1兜底） =====
const peachBlossomTypes = [
  {
    name: '抽象沙雕双人组桃花 🤡🐔',
    condition: (stats) => stats.emojiCount >= 3,
    description: '恭喜你解锁了「笑到邻居报警」限定CP🃏 你俩在一起的唯一副作用是腹肌撕裂。你发"在吗"对方回"鸡你太美"然后你俩一起蹦迪到凌晨三点半。你妈问你对象怎么样你说"挺好的就是脑子不太好"你妈说"那你俩挺配"。恭喜！这就是传说中笑死在爱情里的人生巅峰。你俩不是在谈恋爱是在合开脱口秀🎤',
    color: '#ffcc00'
  },
  {
    name: '互相挨锤型桃花 ⚔️🩹',
    condition: (stats) => stats.topMemes.some(m => ['上岸', 'EMO', '内卷之王', '摆烂', '卷不过躺不平', '躺又躺不平卷又卷不赢', 'emo了', '烦死了', '已黑化', '裂开', '别管我了', '社畜'].includes(m)),
    description: '你俩的约会地点是便利店关东煮前面一起叹气🥀 你说"活着好累"ta说"确实"然后你们默默对视感到一股诡异的温暖。你们的情话是"今天又被骂了""我也是""那我们吃啥"。听着像两条咸鱼对吧？但世界上最浪漫的事就是两条咸鱼一起翻身✨ 有人陪你一起扛，地狱也能开出花！',
    color: '#ff4444'
  },
  {
    name: '薛定谔的暧昧 🐱📦',
    condition: (stats) => stats.barcodeCount >= 2 || stats.symbolCount >= 3,
    description: '你的桃花在一个量子态的盒子里又活着又死了🐱 就是那种ta给你点赞你高兴三天然后发现ta给所有人都点了。你正准备放弃ta突然找你说"在干嘛"你又原地满血复活。你现在的状态是反复在"我们有戏"和"我是小丑"之间横跳。但！盒子迟早会打开的！而且大概率是惊喜！因为都折腾这么久了不是爱是什么？？',
    color: '#00d4ff'
  },
  {
    name: '宇宙级碰瓷缘分 🧲💫',
    condition: (stats) => stats.codeCount >= 2,
    description: '月老没拉红线他直接把你俩的GPS绑一块了🧲 你刷到的沙雕视频ta三秒前刚转发过，你点的外卖和ta撞单了，你俩甚至感冒都能同步。就差没说出"你是不是在镜子里活着"这种话了。这不是巧合这是宇宙级别的碰瓷！命运的意思很明确了：你俩凑一对吧别浪费资源了🌍',
    color: '#00ff88'
  },
  {
    name: '人形树懒型桃花 🦥🛋️',
    condition: (stats) => stats.topMemes.some(m => ['佛了', '摆烂', '五行缺觉', '寺里来了个电工', '苟着', '摆烂但没完全摆', '活着就好', '随缘', '爱咋咋地', '缘分不强求', '躺平大师', '摸鱼侠'].includes(m)),
    description: '你的择偶标准：能一起躺着谁也不说话而且不尴尬🦥 最佳约会方案是两个人各刷各的手机偶尔把屏幕怼对方脸上说"你看这个"。听着很废对吧？但现代人能找到一个躺一起不需要装的人才是真的顶配！你的正缘现在大概也在某个沙发上以一种违反人体工学的姿势刷手机。你们迟早躺到一块去～',
    color: '#ff8800'
  },
  {
    name: '感情碰碰车型桃花 🎢🫠',
    condition: (stats) => stats.topMemes.some(m => ['破防了', '芭比Q了', '直接红温', '寄了', '掉小珍珠', '蚌埠住了', '我哭了', '谁懂啊', '酸Q'].includes(m)),
    description: '你谈恋爱的情绪波动比你的基金还刺激🎢 对方秒回你：今天是人间值得！对方一小时没回：遗书已经打好草稿了。你的心脏每天坐十八次过山车还能正常工作简直是医学奇迹。但这种激情四射的投入感恰恰说明你是真心在爱啊！以后遇到对的人你一定甜到空气都是草莓味的🍓 再等等，值得的那个人来了绝对让你只升不降！',
    color: '#ff0066'
  },
  {
    name: '大型丢脸现场型桃花 😱🪦',
    condition: (stats) => stats.topMemes.some(m => ['社死现场', '小丑竟是我自己', '无语子', '已读不回是死刑', '社恐', '尊嘟假嘟', '栓Q'].includes(m)),
    description: '你和正缘的认识方式一定会被载入你们家族的笑话史😱 比如当众摔了个大马趴被ta扶起来了、在厕所外面唱歌被ta录了下来、或者深夜错发了"我好想你"给了公司大群。但你知道吗？那些年度社死名场面往往就是命运给你安排的超级红线！以后你俩讲起来一个比一个丢人但一个比一个甜🍬',
    color: '#ff44ff'
  },
  {
    name: '全能搭子进化中桃花 📱🍜',
    condition: (stats) => stats.topMemes.some(m => ['电子缘分', '饭搭子', '草友', '暧昧期', '她在拉扯', '关系升温中', '恋爱脑', '电子宠物'].includes(m)),
    description: '饭搭子✅ 逛街搭子✅ 游戏搭子✅ 吐槽搭子✅ 半夜emo搭子✅ 对象❓📱 你俩啥都搭就差搭个伙过日子了。身边朋友都看出来了就你俩还装瞎。整个地球都在等你俩官宣你知道吗？？ta大概率也在想"这算不算在一起了"但谁都不好意思先说。求求了捅破那层窗户纸吧人类等不了了💌',
    color: '#00ccff'
  },
  {
    name: '纯爱六边形战神桃花 💗👑',
    condition: (stats) => stats.topMemes.some(m => ['纯爱战士', '寡王', 'crush', '双向奔赴', '快进到在一起', 'HE了', '舔狗'].includes(m)),
    description: '你就是那种看到狗都成双成对然后在心里默默说"连狗都有对象"的纯爱战士💗 但你要知道！物以类聚！你这种相信真爱的人宇宙正在给你安排一个同款的。你们见面第一句大概率是"你也信这个啊"然后就原地双向奔赴了。全世界都在等你俩的HE大结局呢！剧本已经写好了，演员已经到位了，就差上台了🎭',
    color: '#ff77aa'
  },
  {
    name: '赛博疯批文学桃花 🧠🔥',
    condition: (stats) => stats.topMemes.some(m => ['赛博精神病', '灵魂出窍', '情绪稳定（但已崩溃）', '电量不足', '脑子关机', '精神状态拉满', '逆天', '我装的', '耶斯莫拉'].includes(m)),
    description: '你的精神状态已经抽象到可以参加威尼斯双年展了🧠 表面岁月静好实际大脑在开EDM电音节。你需要的不是对象是同类——好消息！你的同类正在隔壁小区对着墙发呆然后突然笑出鹅叫。当两个赛博疯批相遇，不是核爆是治愈！你们在一起后精神状态不是1+1=2而是2-2=终于正常了✨',
    color: '#ff3388'
  },
  {
    name: '被脑子撩到型桃花 🧪🤓',
    condition: (stats) => stats.topMemes.some(m => ['智性恋', '底层逻辑', '耦合', '颗粒度', '垂直领域', '打通闭环', '拉齐认知', '小镇做题家', '985废物'].includes(m)),
    description: '你被一个人说了句"你说得有道理"就心动三天的那种🧪 ta对你最致命的攻击不是"你好漂亮"而是"这个观点好有意思"。你俩吵架现场跟辩论赛似的，谁输了反而更喜欢对方因为"好厉害我居然没想到"。这种灵魂碰撞的爱情保质期比你家冰箱里的酱还长。恭喜你找到了头脑风暴级别的真爱💫',
    color: '#44ddaa'
  },
  {
    name: '玄学特种兵型桃花 🔮🕯️',
    condition: (stats) => stats.topMemes.some(m => ['水逆', '功德-1', '杀气太重', '法力无边', '有股神秘的东方力量', '赛博算命', '云端烧香', '电子木鱼', '攒功德', '搞点玄学'].includes(m)),
    description: '你的桃花目前卡在一个叫"水逆"的收费站排队交过路费🔮 但好消息是快过完了！你之前做的所有法事——转锦鲤、敲木鱼、11:11许愿、对流星许愿结果许到了飞机——这些功德已经攒到爆仓了。等水逆一过月老那边你的订单直接优先发货。黎明前最黑但你的手电筒已经充满电了🔦 再撑两步天就亮了！',
    color: '#cc66ff'
  },
  {
    name: '莽夫/莽妇型桃花 ⚾💨',
    condition: (stats) => stats.topMemes.some(m => ['A上去', '开冲', '莽一把', '发出信号', '进行一个试的探', '直球出击', '上分', '上大分', '勇敢牛牛', '拿来吧你', '那我可要闹了', '奥利给'].includes(m)),
    description: '你告白的方式大概率是"我喜欢你你考虑一下不考虑也行反正我说了"⚾ 然后转身就走留下对方在风中凌乱。你不搞暧昧不搞拉扯看上了就是一个字：冲！两个字：猛冲！三个字：冲就完了！99%的遗憾都是因为没开口而你永远不会有这种遗憾。你的命中率比你以为的高得多！毕竟敢冲的人自带主角光环🦸',
    color: '#ff9900'
  },
  {
    name: '朋友圈考古学家型桃花 🕵️📜',
    condition: (stats) => stats.topMemes.some(m => ['暗中观察', '挂机', '蹲一个', '等缘分砸脸', '提升版本', '修身养性', '社恐'].includes(m)),
    description: '你已经把ta的朋友圈翻到2017年了但一条赞都没点生怕暴露🕵️ ta爱吃什么、去过哪、养过什么花你比ta妈都清楚。你不是在暗恋你是在做田野调查。但这种深情和细心是绝版品质啊！全世界能有几个人愿意花这么多心思去了解另一个人？你只差最后0.01步——张嘴说出来。ta一定被你的真心砸晕💖',
    color: '#88aacc'
  },
  {
    name: '大型连续剧型桃花 💔📺',
    condition: (stats) => stats.topMemes.some(m => ['BE了', '爱情免疫体', '出厂设置遗忘'].includes(m)),
    description: '命运给你写的剧本前100集全是虐💔 各种"差一点就在一起了""再晚一秒就好了""我以为ta也喜欢我"的名场面轮番上演。但你有没有想过？！越虐的剧后面越甜啊！你现在就处在大结局前的最后一个虐点！编剧已经在写甜戏了！下一个出场的人会让你觉得前面100集的眼泪全都值了。自带BGM的大结局正在加载中🎬',
    color: '#8888aa'
  },
  // ===== 以下为新增的更抽象的桃花类型 =====
  {
    name: '干饭干出爱情型桃花 🥡🔥',
    condition: (stats) => stats.topMemes.some(m => ['确实', '好家伙', '有意思', '什么档次', '格局打开', '针不戳', '家人们', '挖呀挖'].includes(m)),
    description: '你的爱情故事以"帮我带个饭呗"为第一章开篇🥡 从此你俩建立了基于食物的深厚羁绊——谁不吃早饭另一个就发消息骂。ta知道你不吃香菜你知道ta加辣程度。有人说这叫互相关心你说这叫"粮食安全互助联盟"。但你心里清楚当你看到ta给你留了最后一块鸡腿的时候心跳漏了一拍。这不叫心动叫什么？叫消化不良吗？？🍗',
    color: '#ff6633'
  },
  {
    name: '嘴替天花板型桃花 🗣️🎙️',
    condition: (stats) => stats.topMemes.some(m => ['笑不活了', '麻了', 'DNA动了', '泰裤辣', '有被笑到', '互联网嘴替', '梗王', '典中典', '笑死', '救命'].includes(m)),
    description: '你正缘的超能力是一张嘴就能说出你脑子里那句话🗣️ 你俩聊天现场就是一个巨型echo回音壁——"就是说！！""你怎么跟我想的一模一样""你住我脑子里了？？"。这种灵魂同步率连新世纪福音战士都达不到！有些人认识十年说不到一块你俩认识十分钟已经在脑子里结婚了。赶紧线下也结一下吧谢谢🙏',
    color: '#33ccff'
  },
  {
    name: '已读乱炖型桃花 📵🫠',
    condition: (stats) => stats.topMemes.some(m => ['我真的会谢', '无语子', '你在想peach', '属于是', '什么成分', '不会吧', '那我走？', '你在教我做事？', '啊对对对'].includes(m)),
    description: '你精心编辑了两小时的消息最后发了一个"嗯"📵 对方也想了两小时回你一个"哦"。你俩的聊天记录翻出来就像两个联合国外交官在用密码通信。其实你们心里都在尖叫"我好喜欢你啊啊啊"但嘴上只会说"随便""都行""你看着办"。地球人都看出来了就你俩在装。谁先把"嗯"换成"我想你"谁就赢了这局💪',
    color: '#aabb44'
  },
  {
    name: '凌晨三点emo诗人型桃花 🌙🫗',
    condition: (stats) => stats.topMemes.some(m => ['命运的齿轮开始转动', '爷青回', '代入感太强', '主打一个陪伴', '人间清醒', 'emo了', '谁懂啊', '听我说谢谢你'].includes(m)),
    description: '白天你：正常人、清醒人、理性人。凌晨两点的你：为什么月亮这么圆ta是不是也在看月亮如果ta也在看那我们就是在看同一个月亮这算不算约会🌙 你的浪漫只在深夜营业，白天全额退款。但你知道吗你的正缘也是个月光emo选手！你俩现在可能同时失眠同时望窗外同时在想"那个人现在在干嘛"。答案是：在想你💫',
    color: '#6644cc'
  },
  {
    name: '群聊隐藏boss型桃花 💬🐲',
    condition: (stats) => stats.topMemes.some(m => ['全体起立', '加大力度', '我不是本地人', '你管这叫？', '班味儿', '显眼包', '抱一丝', '注意看', '哈基米'].includes(m)),
    description: '你在群里发了个烂梗有个人偷偷笑了三分钟但就是不回💬 你发的每条消息ta都截图了但从不让你知道。ta的备注可能叫"群里那个有意思的人"。某天你们俩在群里同时打出了一模一样的话，命运当场把红线甩你脸上了⚙️ 群聊就是当代最大的月老摊位，你的摊位号已经叫到了，请注意收听🐟',
    color: '#ee6699'
  },
  {
    name: '绝版SSR型桃花 🪨👑',
    condition: (stats) => stats.topMemes.some(m => ['鼠鼠我啊', '完蛋我被美女包围了', '赢麻了', '什么档次', 'CPU你', '集美', '兄dei', '瑞思拜'].includes(m)),
    description: '你的桃花是宇宙限定绝版SSR需要648才能抽到的那种🪨 它不是没来是在路上堵车了。你现在的朋友圈点赞三个其中两个是你妈和你自己？没关系！未来给你点赞最勤的那个人此刻正在刷ta自己的三赞朋友圈呢。两个SSR碰在一起就是传说中的双倍稀有度真爱！来得慢但绝对是镇店之宝💎',
    color: '#cc8844'
  },
  {
    name: '玄学叠满buff型桃花 🧧🐉',
    condition: (stats) => stats.topMemes.some(m => ['格局拉满', '看个乐子', '别太认真', '人间清醒', '混沌', '无序', '熵增', '赛博菩萨', '乌鱼子'].includes(m)),
    description: '你转过的锦鲤连起来可以绕地球一圈🧧 敲过的电子木鱼功德值已经溢出了、11:11许过的愿够出一本书了、水晶手链买到手腕转不动了。你现在身上的玄学buff已经叠到系统报错了。宇宙客服表示："您的愿望已收到正在加急处理请勿重复提交谢谢。"放心吧buff这么满桃花想不来都不行🚀',
    color: '#ff88dd'
  },
  {
    name: '抽象浪漫艺术家型桃花 😂🎨',
    condition: (stats) => stats.emojiCount >= 2 && stats.memeCount >= 2,
    description: '你俩的聊天记录如果拿去参加当代艺术展绝对能拿金奖😂 "我想你了"是一只歪嘴狗gif、"我生气了"是一只暴怒猫咪在跳、"我爱你"是一只青蛙在比心后面跟着八个"哈"。别人看不懂你们在聊什么？那就对了！这是只属于你俩的加密通信系统！世界上能破解你俩表情包暗号的人只有彼此。这种默契是无价之宝💝',
    color: '#ffaa22'
  },
  {
    name: '平行宇宙串台型桃花 🌌🐛',
    condition: (stats) => stats.symbolCount >= 2 && stats.codeCount >= 1,
    description: '隔壁宇宙的你们已经在一起了还养了两只猫三条鱼一盆多肉🌌 这边宇宙的你们暂时还在各过各的。但宇宙会串台的！证据就是：你做了一个关于ta的梦（其实是隔壁宇宙的你在发信号）、你走路突然打喷嚏（隔壁宇宙的ta在念叨你）、你莫名其妙开心（隔壁宇宙的你们在约会）。等一下这个宇宙的剧情马上也播到这一集了📡',
    color: '#7766ee'
  },
  {
    name: '卷王与脆皮联盟桃花 💪🫠',
    condition: (stats) => stats.topMemes.some(m => ['卷王', '特种兵', '脆皮', '你没事吧', '脆皮大学生', '内卷之王', '下头男', '下头女'].includes(m)),
    description: '你一边卷到飞起一边身体吱嘎作响💪 你的正缘就是那种你加班到十点ta给你点了份炸鸡然后说"你是脆皮别太拼了"的人。ta看你拼命心疼但不会拦你只会默默补给。你俩的日常对话："今天又卷了？""嗯""吃了吗？""没""我点了外卖五分钟到""我不配有你""确实不配但我愿意"。这种又卷又甜的组合直接让周围人酸到DNA螺旋都变形了🧬',
    color: '#ff5533'
  },
  {
    name: '要素过多型桃花 🎭💥',
    condition: (stats) => stats.topMemes.some(m => ['要素过多', '要素察觉', '要素溢出', '要素齐全', '要素拉满', '要素爆炸', '典', '梗图', '6得飞起'].includes(m)),
    description: '你的感情生活信息密度堪比一张要素过多的梗图🎭 就是那种——明明只是一起吃了顿饭但饭桌上同时发生了手碰手、对方夹菜给你、隔壁桌在放情歌、窗外有烟花、手机弹出你们的合照回忆、加上ta突然说了句"以后也一起吃吧"——要素直接爆炸💥 你的爱情不是循序渐进型的是信息量轰炸型的！每一秒都能截图发朋友圈配文"典中典"🔥',
    color: '#ee44bb'
  },
  {
    name: 'i人e人天作之合型桃花 🫣🤪',
    condition: (stats) => stats.topMemes.some(m => ['啊？', '绝无可能', 'respect', '下头', '你好骚啊', '离谱', '太草了', '悟了', '社牛', '退退退', '离大谱', '抽象', '地狱笑话'].includes(m)),
    description: '你的正缘是你的人格反面🫣 你说"啊？"ta说"冲！"，你在角落发呆ta在人群中央蹦迪。但这就是传说中的阴阳互补天作之合啊！ta帮你社交你帮ta充电，ta拖你出门你拉ta回家。你俩在一起约等于一个完整的人类。唯一的bug是需要先遇到——i人请努力出门，e人正在以120km/h的速度冲向你😘',
    color: '#55ddcc'
  },
  {
    name: '宇宙都看不懂型桃花 🎁🌀',
    condition: () => true, // 兜底类型
    description: '你的桃花太过抽象连月老看完都说"我也不知道这是什么但感觉挺厉害"🎁 它在又不在、是又不是、像又不像、你以为是ta结果不是你以为不是结果还真是然后发现其实也不是但最后居然又是了。恭喜你获得了全宇宙最独一无二的限量版盲盒缘分！你的故事连编剧都写不出来。放轻松多喝奶茶保持抽象，好事正在以一种你完全意想不到的方式靠近🫧',
    color: '#aa88ff'
  }
];

// ===== 能量场评语库（30条，抽象离谱版） =====
const energyComments = [
  '你的桃花浓度比奶茶里的糖精还炸裂，甜到蚂蚁都要交保护费的那种🐜',
  '这个数值上一次出现还是在盘古开天辟地的时候……你什么来头？？',
  '建议出门戴安全帽，桃花砸脸的力度堪比中彩票大奖的那一下',
  '月老刚才看了你的数据，当场把小本本翻烂了说"这位催什么催马上安排"',
  '你身上的磁场强到手机自动开了飞行模式——怕被你吸走',
  '四个字形容你现在的状态：人间炸弹——走哪炸哪，炸的全是桃花',
  '好家伙这个能量值够整栋楼过冬了，你是暖气片成精了吧',
  '你的气场强到地铁安检员想多扫你两遍确认一下',
  '你笑起来的样子吧，怎么说呢，就是让人想掏出手机偷拍的那种程度',
  '你走路的时候自带慢镜头和发丝飘动特效你造吗',
  '你的朋友圈有个人已经默默翻了八百遍了——就差没给你每条点赞了',
  '你的运势正在从"青铜"连跳到"荣耀王者"，系统都以为开挂了',
  '悄悄说：有人正在一边做这个测试一边偷偷想你呢嘻嘻',
  '你是盲盒界的隐藏款，连出厂的机器都不知道自己造了个宝贝',
  '恋爱的风已经吹到你睫毛上了！眨眨眼就能把它收了！',
  '本检测器已经过载了……你的魅力值需要用科学计数法来表示',
  '丘比特看了你的报告，激动地把弓箭升级成了加特林，弹药无限',
  '你的好运电量99%——别急着拔充电线，让子弹再飞一会儿',
  '宇宙快递提示：您的桃花包裹已到楼下，骑手正在疯狂按门铃',
  '你这个人吧，走到哪亮到哪，萤火虫看了都自愧不如',
  '你此刻的状态一个字：绝！两个字：离谱！三个字：太猛了！四个字：不讲道理！',
  '最近是不是偷偷在变好看？你以为没人发现其实大家都在暗暗酸你',
  '你的桃花正在以光速向你冲来——建议提前做好被幸福撞腰的准备',
  '你现在的魅力连路边的猫都想蹭你两下，别问怎么知道的问就是玄学',
  '建议最近别买彩票了，把运气攒着全砸在桃花上效果更佳',
  '出门记得带购物袋，桃花多到需要打包带走🛍️',
  '你现在的状态像火锅刚开锅——咕嘟咕嘟冒泡，闻着就让人上头',
  '据不靠谱但非常诚恳的消息：这周有个人会让你笑得合不拢嘴',
  '你未来的另一半此刻正对着手机屏幕傻笑——因为在想你',
  '你的桃花浓度已经强到隔壁在做测试的人都沾了你的好运气🐶'
];

// ===== 观测建议库（30条，抽象但不蠢版） =====
const advicePool = [
  { icon: '🌙', text: '凌晨两点发一条朋友圈"今晚月色真美"然后三秒删除。谁在三分钟内私聊你"怎么了"，这个人的灵魂和你共享同一个失眠频率。记住这个名字。' },
  { icon: '🧭', text: '下次出门前默念一个方向——东南西北随便选——然后往那个方向多走五百米再正常行动。命运的岔路口长什么样没人知道，但你得先走到那里才行。' },
  { icon: '🪞', text: '找一面干净的镜子，认真看自己三十秒不说话。你会经历一个从"还行"到"有点怪"再到"其实还挺好看"的完整心路历程。最后那个感觉才是真的。' },
  { icon: '🎵', text: '把你最近单曲循环的那首歌分享给一个人，不加任何文字。如果ta回了另一首歌给你——恭喜，你们之间有一条看不见的频率在共振。' },
  { icon: '🍜', text: '今天请一个人吃饭，理由是"我做了一个梦梦到请你吃饭所以来还愿"。对方信不信不重要，重要的是你坐到了ta对面，故事就从这顿饭开始。' },
  { icon: '🧊', text: '买一杯热饮握在手里走进人群。温度会让你的表情放松下来，放松的人看起来自带磁场。这不是玄学，是你终于不再皱着眉头了。' },
  { icon: '📖', text: '去一个你从没去过的书店，闭着眼从书架上抽一本书翻到随机一页。第一句话就是宇宙今天想对你说的。信不信由你，但大概率比算命准。' },
  { icon: '☕', text: '在常去的咖啡店换一个从没坐过的位置。视角一变，你会注意到以前从没注意过的人和事。缘分不是从天上掉的，是你换了个角度才看到的。' },
  { icon: '🌊', text: '找一个有风的地方站五分钟，什么都不想。风吹过你的时候会顺便带走一些多余的纠结。等你回过神来会发现有些事没那么复杂。' },
  { icon: '🎲', text: '今天所有犹豫超过三秒的事情一律选"去做"。犹豫本身就是你内心在说"其实我想"——那就去。最差的结果也不过是多了一个故事可以讲。' },
  { icon: '✉️', text: '给三个月后的自己写一段话藏在手机备忘录里。等到那天打开看看你现在的心事，大概率会笑出来。你以为过不去的坎，时间替你过了。' },
  { icon: '🌈', text: '穿一件你觉得"太张扬了不敢穿出门"的衣服出门。你以为别人会盯着你看，其实别人只会想"这个人好有气场"。怯意是自己给自己发的假传票。' },
  { icon: '🐱', text: '路上遇到一只猫就停下来蹲三秒。猫决定靠近你说明你今天气场干净；猫跑了也没关系——它只是有别的事。但你蹲下来那三秒，全世界都温柔了。' },
  { icon: '🔮', text: '今天随机跟一个不太熟的人说一句真心话。不用很重，一句"你今天看起来状态不错"就够了。善意是会绕回来的，而且往往绕回来的时候更大。' },
  { icon: '🎭', text: '下次聚会的时候少说一半的话多听一倍。你会发现那个平时不怎么注意的人其实很有意思。有些人的光芒不刺眼但很暖，需要你安静下来才能感受到。' },
  { icon: '🚶', text: '今晚散步的时候数一下从家到第一个路口一共走了多少步。这个数字没有任何意义——但它证明你愿意为一件无意义的事情认真一次，这种人运气不会差。' },
  { icon: '🧧', text: '在你的钱包或手机壳里塞一张小纸条写"好事将近"。每次看到它你会微微一笑。这个笑容会被至少一个人注意到，然后ta也会笑。蝴蝶效应就是这么来的。' },
  { icon: '🌃', text: '找一个能看到远处灯光的位置，想象每一盏灯后面都有一个故事。其中一盏灯后面的那个人此刻也在望着你这边的方向想同样的事。这不是鸡汤，这是概率。' },
  { icon: '💬', text: '把你手机里截图最多的那个人的聊天记录从头翻一遍。你截图的那些瞬间就是心动的凭证，你自己其实早就知道答案了，只是需要一个理由确认而已。' },
  { icon: '🎪', text: '做一件你十四岁时觉得很酷但现在觉得幼稚的事。去抓个娃娃、买根棒棒糖、对着夕阳比个耶。幼稚是珍贵的，因为愿意幼稚的人才敢真心喜欢一个人。' },
  { icon: '📱', text: '把微信头像换成你觉得"好看到不像我"的那张照片。就那张，别犹豫。你觉得不像你，但那恰恰是别人眼中最真实的你。自我低估是最隐蔽的浪费。' },
  { icon: '🍵', text: '泡一杯茶然后什么都不干地喝完它。在这个所有人都在赶时间的世界里，能坐得住的人自带一种让人安心的磁场。桃花不追快的人，追稳的人。' },
  { icon: '🎤', text: '今天对着镜子或者空房间大声说出一句你一直不敢说的话。不用说给谁听，先说给空气听。说出口的那一刻你会发现——诶，也没那么难嘛。' },
  { icon: '🌟', text: '你身上一定有一个优点是你自己不当回事但别人暗暗羡慕的。今天花三分钟想想那是什么。想到了就对自己说声谢谢。你值得被喜欢，这不需要论证。' },
  { icon: '🗺️', text: '打开地图随便放大一个你没去过的地方，记住它的名字。以后有机会就去。你的人生地图上每多一个坐标，和那个对的人交叉的概率就多一分。' },
  { icon: '🎧', text: '戴上耳机在人多的地方走一圈，假装自己是电影主角正在经历命运转折点的那个长镜头。BGM由你决定。走着走着你会发现步伐都不一样了。' },
  { icon: '🕰️', text: '设一个随机时间的闹钟，响的时候无论在做什么都暂停五秒环顾四周。也许你会看到一朵云、一个笑脸、或者一个你平时忽略的温柔细节。美好不缺席只是容易被错过。' },
  { icon: '🧸', text: '今天主动夸一个人，要具体——不是"你好棒"而是"你刚才说那句话特别有意思"。具体的赞美会在对方心里住很久。而一个让人记住的人，离被喜欢只差半步。' },
  { icon: '🌱', text: '种一颗种子或者养一盆植物，每天浇水的时候顺便对自己的生活说一句"慢慢来"。能照顾好一个小生命的人，也一定能好好经营一段感情。' },
  { icon: '🫧', text: '临睡前想三件今天发生的好事，哪怕再小——天气不错、饭很好吃、有人对你笑了。习惯发现好事的人，会在遇到对的人的时候第一时间认出来。' }
];

// ===== 随机ID生成 =====
function generateUserId() {
  const prefixes = [
    '编号114514的快乐单身汪', '被月老拉黑又偷偷加回的VIP', '薛定谔的脱单预备役', '行走的桃花磁铁（但暂时消磁）',
    '正在充电中的恋爱小天才', '下一秒就要甜到齁的人', '被丘比特射了个歪箭的幸运鹅', '月老系统里的可爱bug',
    '朋友圈最神秘的吃瓜群众', '深夜emo但白天嘻嘻的选手', '奶茶续命但缺个人一起喝的', '群聊潜水冠军但想被你捞起来',
    '连仙人掌都能养开花的狠角色', '凌晨三点还在刷手机的可爱鬼', '社死过但依然蹦蹦跳跳的小强',
    '表情包比存款多的快乐穷鬼', '五行缺对象但气质拉满', '宇宙最闪的地球限定款',
    '前方高能的宝藏本藏', '命运齿轮已经在疯狂转动的天选打工人', '好运马上砸脸信不信',
    '锦鲤本鲤不接受反驳', '一个人也能嗨翻全场的legend', '甜蜜暴击即将到账的幸运鹅',
    '月老正在疯狂处理的加急件', '宇宙快递已发出请注意查收', '好事多磨但磨完就是王炸',
    '隐藏款限定版绝版宝贝', '自带主角光环但还没演到甜戏的', '全村最靓也最好运的崽'
  ];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  return `${prefix}#${num}`;
}

function generateReportId() {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 999)).padStart(3, '0');
  const series = ['CW', 'QE', 'ZT', 'MH', 'EMO', 'LOL'][Math.floor(Math.random() * 6)];
  return `RPT-${year}-${series}-${num}`;
}

// ===== 天干地支胡诌 =====
function getAbsurdEra() {
  const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const earthlyBranches = ['子鼠', '丑牛', '寅虎', '卯兔', '辰龙', '巳蛇', '午马', '未羊', '申猴', '酉鸡', '戌狗', '亥猪'];
  const h = heavenlyStems[Math.floor(Math.random() * heavenlyStems.length)];
  const e = earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)];
  return `${h}${e}`;
}

/**
 * 根据捕获的帧数据生成完整报告
 * @param {Array} capturedFrame 
 * @returns {object} 报告数据
 */
export function generateReport(capturedFrame) {
  const stats = analyzeFrame(capturedFrame);
  
  // 匹配桃花类型：收集所有满足条件的类型，然后随机选一个（避免总是命中同一个）
  const fallbackType = peachBlossomTypes[peachBlossomTypes.length - 1]; // 兜底类型
  const matchedTypes = peachBlossomTypes.filter(
    (type, index) => index < peachBlossomTypes.length - 1 && type.condition(stats)
  );
  
  let matchedType;
  if (matchedTypes.length > 0) {
    // 从所有匹配的类型中随机选一个
    matchedType = matchedTypes[Math.floor(Math.random() * matchedTypes.length)];
  } else {
    matchedType = fallbackType;
  }

  // 生成能量值（50-95之间）
  const energyValue = Math.floor(50 + Math.random() * 45);
  const energyComment = energyComments[Math.floor(Math.random() * energyComments.length)];

  // 随机选3条建议
  const shuffledAdvice = [...advicePool].sort(() => Math.random() - 0.5);
  const selectedAdvice = shuffledAdvice.slice(0, 3);

  const userId = generateUserId();
  const reportId = generateReportId();
  const era = getAbsurdEra();

  return {
    userId,
    reportId,
    era,
    peachType: matchedType,
    energyValue,
    energyComment,
    advice: selectedAdvice,
    capturedFrame,
    stats,
    timestamp: new Date().toLocaleString('zh-CN')
  };
}

/**
 * 将报告数据渲染为HTML
 * @param {object} report
 * @returns {string} HTML字符串
 */
export function renderReportHTML(report) {
  // 渲染截屏样本 - 用标签列表清晰展示捕获到的词
  const sampleTags = report.capturedFrame.slice(0, 15).map(item => {
    const typeLabel = { 'text-meme': '热梗', 'text-emoji': '表情', 'text-symbol': '符号', 'text-code': '代码', 'text-barcode': '噪声' }[item.type] || '未知';
    const borderColor = item.color || '#00ff88';
    return `<span class="sample-tag" style="color:${borderColor};border-color:${borderColor}44;background:${borderColor}11;text-shadow:0 0 6px ${borderColor}44;">${item.text}</span>`;
  }).join('');

  // 渲染建议
  const adviceItems = report.advice.map(a => `
    <div class="advice-item">
      <span class="advice-icon">${a.icon}</span>
      <span class="advice-text">${a.text}</span>
    </div>
  `).join('');

  return `
    <!-- 报告头部 -->
    <div class="report-card animate-in" style="animation-delay: 0.1s;">
      <div class="report-title">
        <span class="title-main">📡 赛博桃花观测报告</span>
        《关于用户 <strong>${report.userId}</strong> 在${report.era}年星象下的桃花运势深度八卦》
        <br><br>
        <span class="report-id">${report.reportId} | ${report.timestamp} | 机密等级：绝密（看完请假装不知道）</span>
      </div>
    </div>

    <!-- 观测样本 -->
    <div class="report-card animate-in" style="animation-delay: 0.3s;">
      <h3 style="font-size:0.85rem;color:#00ff88aa;margin-bottom:12px;letter-spacing:2px;">📸 缘分快照</h3>
      <div class="captured-sample-tags">
        <div style="font-size:0.6rem;color:#ff00ff88;margin-bottom:10px;letter-spacing:2px;">SAMPLE-${report.reportId.split('-').pop()} | 被你一把薅住的碎片 × ${report.capturedFrame.length}</div>
        <div class="sample-tags-grid">
          ${sampleTags}
        </div>
        ${report.capturedFrame.length === 0 ? '<div style="text-align:center;color:#ffffff33;font-size:0.8rem;padding:20px;">竟然啥也没薅到…你的手速是退休级别的吗😂</div>' : ''}
      </div>
      <p style="font-size:0.7rem;color:#ffffff33;text-align:center;margin-top:8px;">
        ↑ 你按下那一刻宇宙恰好甩给你的东西 ↑
      </p>
    </div>

    <!-- 核心发现 -->
    <div class="report-card animate-in" style="animation-delay: 0.5s;">
      <h3 style="font-size:0.85rem;color:#00ff88aa;margin-bottom:12px;letter-spacing:2px;">🔮 核心发现（正经的）</h3>
      <div class="finding-card">
        <div class="finding-label">🌸 你的桃花类型是</div>
        <div class="finding-content">
          <strong style="color:${report.peachType.color};font-size:1.1rem;">${report.peachType.name}</strong>
          <br><br>
          ${report.peachType.description}
        </div>
      </div>
      <div class="finding-card" style="border-left-color:#ff00ff;">
        <div class="finding-label">🧩 缘分碎片构成</div>
        <div class="finding-content" style="font-size:0.8rem;">
          热梗 × ${report.stats.memeCount} | 
          表情 × ${report.stats.emojiCount} | 
          神秘符号 × ${report.stats.symbolCount} | 
          代码片段 × ${report.stats.codeCount} | 
          宇宙噪声 × ${report.stats.barcodeCount}
          <br>
          <span style="color:#ffffff44;font-size:0.7rem;">* 以上数据由月老的小本本和一只通灵橘猫联合校准，吃瓜请随意，当真后果自负。</span>
        </div>
      </div>
    </div>

    <!-- 能量场分析 -->
    <div class="report-card animate-in" style="animation-delay: 0.7s;">
      <h3 style="font-size:0.85rem;color:#00ff88aa;margin-bottom:12px;letter-spacing:2px;">⚡ 桃花能量场</h3>
      <div class="energy-bar-container">
        <div class="energy-label">
          <span>桃花浓度</span>
          <span id="energyPercent" style="color:#00ff88;font-weight:bold;">${report.energyValue}%</span>
        </div>
        <div class="energy-bar">
          <div class="energy-fill" id="energyFill" style="width:0%;" data-target="${report.energyValue}"></div>
        </div>
        <p class="energy-comment">"${report.energyComment}"</p>
      </div>
    </div>

    <!-- 观测建议 -->
    <div class="report-card animate-in" style="animation-delay: 0.9s;">
      <h3 style="font-size:0.85rem;color:#00ff88aa;margin-bottom:12px;letter-spacing:2px;">📋 行动指南（不试白不试）</h3>
      <div class="advice-card">
        ${adviceItems}
      </div>
    </div>

    <!-- 按钮区 -->
    <div class="report-card animate-in" style="animation-delay: 1.1s;">
      <div class="report-actions">
        <button class="action-btn primary" id="btnShare">
          <i class="fas fa-share-alt"></i> 生成分享图
        </button>
        <button class="action-btn secondary" id="btnRetry">
          <i class="fas fa-redo"></i> 再测一次
        </button>
      </div>
      <button class="action-btn save-img-btn" id="btnSaveLongImg" style="width:100%;margin-top:12px;background:linear-gradient(135deg,#ff69b422,#ff69b444);color:#ff69b4;border:1px solid #ff69b466;">
        <i class="fas fa-image"></i> 📸 生成报告长图（长按可保存）
      </button>
      <button class="merit-btn" id="btnMerit">
        🕯️ 敲一下电子木鱼给桃花续命（咚 +1）
      </button>
    </div>

    <!-- 免责声明 -->
    <div class="report-card animate-in" style="animation-delay: 1.3s; border-color: #ffffff11;">
      <p style="font-size:0.65rem;color:#ffffff22;text-align:center;line-height:1.8;">
        ⚠️ 友情提示：本报告由赛博桃花观测实验室（地址：月老办公室隔壁的杂物间）出品。<br>
        所有结论来源于锦鲤的第六感、一只橘猫踩键盘的随机输出、以及月老打盹时说的梦话，仅供嘻嘻哈哈。<br>
        如因本报告导致当众表白/突然脱单/笑到腹肌撕裂/转发后被暗恋对象发现等名场面，本实验室不负责但会偷偷吃瓜🍉。<br>
        转发本报告可白嫖虚拟好运×1（虽然是虚拟的但心理作用也是作用对吧）。<br>
        本报告有效期72小时，过期作废——其实就是想骗你再来玩一次嘿嘿。
      </p>
    </div>

    <!-- 页脚 -->
    <div class="page-footer">
      <p>由 <a href="https://with.woa.com/" style="color: #8A2BE2;" target="_blank">With</a> 通过自然语言生成</p>
    </div>
  `;
}