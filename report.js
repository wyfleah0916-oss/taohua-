/**
 * 报告生成模块 - 生成《赛博桃花观测报告》
 * 用一本正经的学术报告腔解读随机内容
 */

import { analyzeFrame } from './dataStream.js';

// ===== 桃花类型库 =====
const peachBlossomTypes = [
  {
    name: '乐子人型桃花 🤡',
    condition: (stats) => stats.emojiCount >= 3,
    description: '检测到高频表情波动，判定为【乐子人型桃花】。你的正缘大概率是能接住你所有烂梗的人。建议在深夜发疯群内重点排查。',
    color: '#ffcc00'
  },
  {
    name: '战地玫瑰型桃花 ⚔️',
    condition: (stats) => stats.topMemes.some(m => ['上岸', 'EMO', '内卷之王', '摆烂', '卷不过躺不平', '躺又躺不平卷又卷不赢'].includes(m)),
    description: '捕捉到"上岸"与"EMO"叠加态，判定为【战地玫瑰型桃花】。关系将在互相吐槽论文/工作的革命友谊中升华。建议以"求你骂醒我"开场。',
    color: '#ff4444'
  },
  {
    name: '薛定谔的桃花 🐱',
    condition: (stats) => stats.barcodeCount >= 2 || stats.symbolCount >= 3,
    description: '识别出大量马赛克/符号干扰，判定为【薛定谔的桃花】。它处于有和无的量子态——当你不想它时，它便存在；当你拼命找时，波函数坍缩为0。属于典型的"观测导致坍缩"案例。',
    color: '#00d4ff'
  },
  {
    name: '赛博月老型桃花 🤖',
    condition: (stats) => stats.codeCount >= 2,
    description: '检测到大量代码片段渗透，判定为【赛博月老型桃花】。你的缘分已被某位神秘程序员写入了if-else。建议检查你的GitHub是否有陌生Star，那可能是大数据姻缘在赋能。',
    color: '#00ff88'
  },
  {
    name: '佛系躺平型桃花 🧘',
    condition: (stats) => stats.topMemes.some(m => ['佛了', '摆烂', '五行缺觉', '寺里来了个电工', '苟着', '摆烂但没完全摆', '活着就好', '随缘', '爱咋咋地', '缘分不强求'].includes(m)),
    description: '探测到强烈的"佛系"场域辐射，判定为【佛系躺平型桃花】。你的对象正在某个寺庙求签呢。两人将在"都不主动"中达成诡异的默契平衡。建议多敲电子木鱼攒功德。',
    color: '#ff8800'
  },
  {
    name: '破防暴走型桃花 💥',
    condition: (stats) => stats.topMemes.some(m => ['破防了', '芭比Q了', '直接红温', '寄了', '掉小珍珠'].includes(m)),
    description: '截获到高能"破防"信号，判定为【破防暴走型桃花】。恋爱过程将充满"啊啊啊啊"和"你怎么这样！"，甜蜜指数与血压指数高度正相关。动不动就掉小珍珠是常态。',
    color: '#ff0066'
  },
  {
    name: '社死联盟型桃花 😱',
    condition: (stats) => stats.topMemes.some(m => ['社死现场', '小丑竟是我自己', '无语子', '已读不回是死刑'].includes(m)),
    description: '观测到密集"社死"粒子云，判定为【社死联盟型桃花】。你们的相遇方式将极其尴尬，但正是这份尴尬造就了宇宙级的化学反应。已读不回只是前菜。',
    color: '#ff44ff'
  },
  {
    name: '电子缘分型桃花 📱',
    condition: (stats) => stats.topMemes.some(m => ['电子缘分', '饭搭子', '草友', '暧昧期', '她在拉扯', '关系升温中'].includes(m)),
    description: '侦测到高密度"电子缘分"信号流，判定为【电子缘分型桃花】。你们的感情只存在于聊天框里，见面反而会尴尬。建议先从饭搭子/草友做起，慢慢从线上耦合到线下。',
    color: '#00ccff'
  },
  {
    name: '纯爱战士型桃花 💗',
    condition: (stats) => stats.topMemes.some(m => ['纯爱战士', '寡王', 'crush', '双向奔赴', '快进到在一起', 'HE了'].includes(m)),
    description: '截获到纯度极高的"纯爱"信号波，判定为【纯爱战士型桃花】。你相信双向奔赴、拒绝一切暧昧拉扯。你的对象大概率也是个纯爱战士，两个理想主义者的HE剧本已经写好了。',
    color: '#ff77aa'
  },
  {
    name: '赛博精神病型桃花 🧠',
    condition: (stats) => stats.topMemes.some(m => ['赛博精神病', '灵魂出窍', '情绪稳定（但已崩溃）', '电量不足', '脑子关机', '精神状态拉满'].includes(m)),
    description: '警告⚠️ 检测到"赛博精神病"级别的精神波动！判定为【赛博精神病型桃花】。你的精神状态已经拉满到溢出，但正是这种"疯疯癫癫"会吸引到同频的灵魂。建议继续保持发疯，你的正缘正在隔壁发疯群等你。',
    color: '#ff3388'
  },
  {
    name: '智性恋型桃花 🎓',
    condition: (stats) => stats.topMemes.some(m => ['智性恋', '底层逻辑', '耦合', '颗粒度', '垂直领域', '打通闭环', '拉齐认知'].includes(m)),
    description: '探测到高浓度"互联网黑话"粒子渗透，判定为【智性恋型桃花】。你会被对方的底层逻辑所折服，在垂直领域实现认知耦合。恋爱的颗粒度要拉满，才能打通感情闭环。',
    color: '#44ddaa'
  },
  {
    name: '水逆玄学型桃花 🔮',
    condition: (stats) => stats.topMemes.some(m => ['水逆', '功德-1', '杀气太重', '法力无边', '有股神秘的东方力量', '赛博算命', '云端烧香', '电子木鱼', '攒功德', '搞点玄学'].includes(m)),
    description: '观测到强烈的"玄学"场干扰，判定为【水逆玄学型桃花】。你的桃花正在被水逆期压制，功德值为负数。建议立即云端烧香、狂敲电子木鱼，待水逆结束后法力无边的你将迎来神秘的东方力量加持。',
    color: '#cc66ff'
  },
  {
    name: '直球出击型桃花 ⚾',
    condition: (stats) => stats.topMemes.some(m => ['A上去', '开冲', '莽一把', '发出信号', '进行一个试的探', '直球出击', '上分', '上大分'].includes(m)),
    description: '捕获到密集的"主动出击"信号脉冲，判定为【直球出击型桃花】。你不搞暧昧那一套，直接A上去就是了。缘分场显示你的直球成功率为73.6%——剩下的26.4%是对方被你的勇猛吓到了。',
    color: '#ff9900'
  },
  {
    name: '暗中观察型桃花 🕵️',
    condition: (stats) => stats.topMemes.some(m => ['暗中观察', '挂机', '蹲一个', '等缘分砸脸', '提升版本', '修身养性'].includes(m)),
    description: '检测到极低频"暗中观察"波段信号，判定为【暗中观察型桃花】。你选择挂机等缘分砸脸，同时默默提升版本。这种策略在统计学上被称为"守株待兔量子版"——兔子会来的，但可能不是你想的那只。',
    color: '#88aacc'
  },
  {
    name: 'BE预警型桃花 💔',
    condition: (stats) => stats.topMemes.some(m => ['BE了', '爱情免疫体', '出厂设置遗忘'].includes(m)),
    description: '⚠️ 检测到"BE"高危信号！判定为【BE预警型桃花】。你的感情线路图显示了一个悲剧结局的可能性，但别慌——本系统的预测准确率和天气预报一样，经常反着来。建议主动重置出厂设置，清空缓存重新开始。',
    color: '#8888aa'
  },
  {
    name: '量子纠缠型桃花 ⚛️',
    condition: () => true, // 兜底类型
    description: '检测到多元混沌粒子叠加，判定为【量子纠缠型桃花】。你的缘分处于11维空间的某个膜上，理论上存在，实际上需要一点点运气和很多很多的奶茶。波粒二象性决定了你的对象既像粒子一样随机出现，又像波一样无处不在。熵增不可逆，但爱情可以。',
    color: '#aa88ff'
  }
];

// ===== 能量场评语库 =====
const energyComments = [
  '磁场较稳，但存在杂散电子（指你摇摆的内心）',
  '信号增益良好，建议保持当前精神状态继续发疯',
  '检测到微弱的"前任"残留信号干扰，建议重启系统',
  '能量充沛，但主板（指你的脸）温度偏高，注意散热',
  '缘分场强度超出预期，怀疑是仪器坏了（开玩笑的）',
  '场强稳定，但频率紊乱，可能因为你昨晚又熬夜了',
  '检测到量子隧穿效应，缘分有可能突然出现在你面前，也有可能穿墙而过',
  '磁场极度不稳定，像极了你的情绪',
  '信号质量优秀，但接收端（指你的社交能力）有待升级',
  '电量不足警告！建议立即充电（指睡觉），否则桃花粒子将因能量耗尽而逃逸',
  '检测到"水逆"干扰波，但别担心，水逆期反而是桃花粒子最活跃的时段',
  '赛博精神病指数偏高，但这恰好与桃花粒子的混沌共振频率一致',
  '观测到"已读不回"型信号衰减，建议切换至"主动出击"频段',
  '功德值为负数，建议先敲200下电子木鱼再来观测',
  '底层逻辑正常，但耦合颗粒度不够细，需要拉齐认知后再打通闭环',
  '检测到"摆烂但没完全摆"的叠加态，建议在摆与不摆之间找到量子平衡点',
  '灵魂出窍预警：你的精神状态已超出仪器量程，数据仅供参考',
  '场强波动剧烈，疑似"crush"信号突然涌入导致系统过载'
];

// ===== 观测建议库 =====
const advicePool = [
  { icon: '🏪', text: '建议本周多前往能量混沌节点（如：便利店、电梯、公司厕所）进行无目的徘徊。' },
  { icon: '🧋', text: '可尝试对潜在耦合对象发射"请你喝奶茶"信号进行试探。' },
  { icon: '📱', text: '在社交软件上将签名改为"五行缺对象"，以增强磁场接收面积。' },
  { icon: '🌙', text: '今晚22:00-23:00为最佳观测窗口，建议在此时段刷30分钟短视频以调频。' },
  { icon: '🎯', text: '你的桃花粒子对"主动打招呼"极度敏感，建议先从评论区互动开始。' },
  { icon: '🎵', text: '播放任意一首"网抑云"热评过万的歌曲，可显著提升缘分场共振频率。' },
  { icon: '🧘', text: '如以上建议均无效，请尝试躺平。根据墨菲定律，不在意的时候缘分就来了。' },
  { icon: '🐱', text: '建议撸猫30分钟以稳定情绪场，猫的呼噜声频率恰好与桃花粒子共振。' },
  { icon: '🍜', text: '前往最近的麻辣烫/螺蛳粉店进行「味觉场重校准」，辣度建议微辣以上。' },
  { icon: '💻', text: '在代码中写下注释 // TODO: 脱单，宇宙编译器会将其加入排期。' },
  { icon: '🛒', text: '去超市买一瓶你从没喝过的饮料，这象征着你愿意接受新变量的勇气。' },
  { icon: '🌸', text: '本周宜穿暖色系，你的桃花粒子对粉色/橙色波段响应最强。' },
  // ===== 新增建议 =====
  // 主动出击类
  { icon: '⚾', text: '建议今天对心仪对象直球出击，A上去就是了。数据显示莽一把的成功率比暗中观察高47.3%。' },
  { icon: '💬', text: '进行一个试的探：给潜在对象发一条"在吗"（不是），发一条有趣的梗图，观察对方是否接梗。' },
  { icon: '🎮', text: '邀请目标对象成为你的"草友"或"饭搭子"，从低耦合度关系开始逐步上分。' },
  // 被动观察类
  { icon: '🕵️', text: '本周适合挂机暗中观察。蹲一个缘分砸脸的机会，但请保持在线状态，别真睡着了。' },
  { icon: '🪞', text: '建议先提升版本（提升自己），修身养性三天后再重新进入桃花观测场。' },
  // 玄学类
  { icon: '🪵', text: '立即打开电子木鱼App，连敲108下以清除"水逆"debuff，每一下功德+1。' },
  { icon: '🔥', text: '前往最近的赛博算命节点（指打开某占卜小程序），进行多维度交叉验证。' },
  { icon: '🕯️', text: '云端烧香一炷，祈求大数据姻缘系统将你的match优先级提升至P0。' },
  // 互联网黑话类
  { icon: '📊', text: '建议拉齐你与潜在对象的认知颗粒度，在垂直领域深度耦合后再打通感情闭环。' },
  { icon: '🧠', text: '运用底层逻辑分析：对方的每一条朋友圈都是数据点，请进行全量分析后再赋能你的下一步行动。' },
  // 放弃治疗类
  { icon: '🛌', text: '检测到你的精神状态已"情绪稳定（但已崩溃）"，建议先躺平回血，缘分不强求，爱咋咋地。' },
  { icon: '🎪', text: '别太认真，看个乐子就好。宇宙的熵增不可逆，但你可以选择在混沌中微笑。' }
];

// ===== 随机ID生成 =====
function generateUserId() {
  const prefixes = [
    '量子游民', '赛博浪人', '数字难民', '虚空观测者', '混沌旅客',
    '平行线居民', '时空访客', '熵增患者', '电子木鱼敲击者', '赛博精神病患者',
    '水逆受害者', '纯爱战士', '佛系躺平家', '底层逻辑分析师', '功德收集者',
    '灵魂出窍体验官', '脑子关机用户', '电量不足警告者', '摆烂但没完全摆的人'
  ];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  return `${prefix}#${num}`;
}

function generateReportId() {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 999)).padStart(3, '0');
  const series = ['CW', 'QE', 'ZT', 'MH'][Math.floor(Math.random() * 4)];
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
  const fallbackType = peachBlossomTypes[peachBlossomTypes.length - 1]; // 兜底类型（量子纠缠型）
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
        《关于用户 <strong>${report.userId}</strong> 在${report.era}年磁场下的桃花粒子耦合状态分析报告》
        <br><br>
        <span class="report-id">${report.reportId} | ${report.timestamp} | 机密等级：绝密（指绝对的秘密，谁看谁知道）</span>
      </div>
    </div>

    <!-- 观测样本 -->
    <div class="report-card animate-in" style="animation-delay: 0.3s;">
      <h3 style="font-size:0.85rem;color:#00ff88aa;margin-bottom:12px;letter-spacing:2px;">📸 观测样本快照</h3>
      <div class="captured-sample-tags">
        <div style="font-size:0.6rem;color:#ff00ff88;margin-bottom:10px;letter-spacing:2px;">SAMPLE-${report.reportId.split('-').pop()} | 捕获粒子 × ${report.capturedFrame.length}</div>
        <div class="sample-tags-grid">
          ${sampleTags}
        </div>
        ${report.capturedFrame.length === 0 ? '<div style="text-align:center;color:#ffffff33;font-size:0.8rem;padding:20px;">未捕获到任何粒子（截屏太快了？）</div>' : ''}
      </div>
      <p style="font-size:0.7rem;color:#ffffff33;text-align:center;margin-top:8px;">
        ↑ 以上为量子截屏瞬间在观测窗口内捕获的缘分粒子 ↑
      </p>
    </div>

    <!-- 核心发现 -->
    <div class="report-card animate-in" style="animation-delay: 0.5s;">
      <h3 style="font-size:0.85rem;color:#00ff88aa;margin-bottom:12px;letter-spacing:2px;">🔬 核心发现</h3>
      <div class="finding-card">
        <div class="finding-label">⚡ 缘分粒子类型鉴定</div>
        <div class="finding-content">
          <strong style="color:${report.peachType.color};font-size:1.1rem;">${report.peachType.name}</strong>
          <br><br>
          ${report.peachType.description}
        </div>
      </div>
      <div class="finding-card" style="border-left-color:#ff00ff;">
        <div class="finding-label">📊 粒子构成分析</div>
        <div class="finding-content" style="font-size:0.8rem;">
          热梗粒子 × ${report.stats.memeCount} | 
          表情波 × ${report.stats.emojiCount} | 
          符号场 × ${report.stats.symbolCount} | 
          代码流 × ${report.stats.codeCount} | 
          噪声条 × ${report.stats.barcodeCount}
          <br>
          <span style="color:#ffffff44;font-size:0.7rem;">* 以上数据由量子随机数生成器校准，准确率约等于算命。</span>
        </div>
      </div>
    </div>

    <!-- 能量场分析 -->
    <div class="report-card animate-in" style="animation-delay: 0.7s;">
      <h3 style="font-size:0.85rem;color:#00ff88aa;margin-bottom:12px;letter-spacing:2px;">⚡ 耦合能量场分析</h3>
      <div class="energy-bar-container">
        <div class="energy-label">
          <span>能量场饱和度</span>
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
      <h3 style="font-size:0.85rem;color:#00ff88aa;margin-bottom:12px;letter-spacing:2px;">📋 观测建议（抽象行动指南）</h3>
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
      <button class="merit-btn" id="btnMerit">
        🕯️ 为服务器续1秒功德（点击 +1s）
      </button>
    </div>

    <!-- 免责声明 -->
    <div class="report-card animate-in" style="animation-delay: 1.3s; border-color: #ffffff11;">
      <p style="font-size:0.65rem;color:#ffffff22;text-align:center;line-height:1.8;">
        ⚠️ 免责声明：本报告由赛博桃花量子观测实验室（不存在）出品。<br>
        所有分析结论均基于薛定谔方程的第114514次近似解，仅供娱乐，请勿用于指导人生决策。<br>
        如因本报告导致社死/脱单/暴富等后果，本实验室概不负责但十分乐意听取反馈。
      </p>
    </div>

    <!-- 页脚 -->
    <div class="page-footer">
      <p>由 <a href="https://with.woa.com/" style="color: #8A2BE2;" target="_blank">With</a> 通过自然语言生成</p>
    </div>
  `;
}