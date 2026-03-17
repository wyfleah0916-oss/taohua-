/**
 * 数据流模块 - 生成快速滚动的赛博信息流
 * 包含网络热梗、表情、抽象符号等
 */

// 热梗文字库
const memeTexts = [
  // 原有热梗
  'EMO', '上岸', '脆皮大学生', '啊？', '财神殿长跪不起',
  '五行缺觉', '绝无可能', '遥遥领先', 'yyds', '赢麻了',
  '什么档次', '格局打开', '润了', '摆烂', '鼠鼠我啊',
  'CPU你', '下头', '绝绝子', '芭比Q了', '破防了',
  '你好骚啊', '满分！', '无语子', '6得飞起', '寄了',
  '社死现场', '内卷之王', '佛了', '纯纯的', '哈哈哈哈哈',
  '离谱', '好家伙', '太草了', '悟了', '原来如此',
  '爱了爱了', '你在想peach', '什么成分', '直接红温', 'respect',
  '笑不活了', '麻了', 'DNA动了', '泰裤辣', '确实',
  '我真的会谢', '完蛋我被美女包围了', '小丑竟是我自己',
  '快进到在一起', '爷青回', '属于是', '有被笑到',
  '命运的齿轮开始转动', '我不是本地人', '加大力度',
  '全体起立', '代入感太强', '量子纠缠', '精神状态良好',
  '主打一个陪伴', '班味儿', '你管这叫？', '有意思',
  '卷不过躺不平', '寺里来了个电工',
  // ===== 状态描述类 =====
  // 精神状态
  '赛博精神病', '灵魂出窍', '情绪稳定（但已崩溃）', '电量不足',
  '脑子关机', '出厂设置遗忘', '精神状态拉满',
  // 生活状态
  '苟着', '躺又躺不平卷又卷不赢', '摆烂但没完全摆',
  '脆脆鲨', '活着就好', '生活在别处',
  // 玄学状态
  '水逆', '功德-1', '杀气太重', '法力无边',
  '有股神秘的东方力量', '紫微斗数震怒',
  // ===== 关系互动类 =====
  // 缘分类型
  '电子缘分', '饭搭子', '草友', 'crush',
  '智性恋', '纯爱战士', '寡王', '搭子文化',
  // 关系进展
  '上分', '上大分', '掉小珍珠', 'BE了',
  'HE了', '她在拉扯', '已读不回是死刑',
  '暧昧期', '关系升温中', '双向奔赴',
  // ===== 行为动机类 =====
  // 主动出击
  'A上去', '开冲', '莽一把', '发出信号',
  '进行一个试的探', '直球出击',
  // 被动观察
  '暗中观察', '挂机', '蹲一个', '等缘分砸脸',
  // 自我建设
  '攒功德', '修身养性', '搞点玄学', '提升版本',
  // 放弃治疗
  '随缘', '爱咋咋地', '缘分不强求', '爱情免疫体',
  // ===== 抽象概念类 =====
  // 量子力学系列
  '波粒二象性', '观测导致坍缩', '薛定谔的喜欢',
  // 互联网黑话
  '底层逻辑', '耦合', '赋能', '颗粒度',
  '垂直领域', '打通闭环', '拉齐认知',
  // 玄学科技
  '赛博算命', '大数据姻缘', 'AI面相', '云端烧香',
  '电子木鱼', '数字化转型（指恋爱）',
  // 无法分类
  '神秘', '混沌', '无序', '熵增',
  '看个乐子', '别太认真', '人间清醒', '格局拉满',
  // ===== 新增情绪/反应类 =====
  'emo了', '笑死', '救命', '栓Q', '离大谱', '蚌埠住了',
  '谁懂啊', '我哭了', '我装的', '别管我了', '已黑化',
  '烦死了', '裂开', '酸Q', '耶斯莫拉',
  // ===== 新增行为/互动类 =====
  '拿来吧你', '退退退', '你没事吧', '不会吧',
  '听我说谢谢你', '那我走？', '你在教我做事？',
  '勇敢牛牛', '挖呀挖', '尊嘟假嘟', '注意看',
  '家人们', '抱一丝', '哈基米', '啊对对对', '那我可要闹了',
  // ===== 新增人物/身份类 =====
  '社恐', '社牛', '社畜', '脆皮', '小镇做题家', '985废物',
  '特种兵', '恋爱脑', '舔狗', '下头男', '下头女',
  '互联网嘴替', '电子宠物', '赛博菩萨', '卷王',
  '躺平大师', '摸鱼侠', '显眼包',
  // ===== 新增评价/玩梗类 =====
  '典', '典中典', '逆天', '抽象', '地狱笑话',
  '梗图', '梗王', '要素过多', '要素察觉', '要素溢出',
  '要素齐全', '要素拉满', '要素爆炸',
  // ===== 新增谐音/缩写类 =====
  '集美', '兄dei', '瑞思拜', '奥利给', '乌鱼子', '针不戳'
];

// 表情符号库
const emojis = [
  '😂', '🐶', '🍅', '🐼', '💀', '🤡', '👻', '🫠',
  '🥹', '😭', '🤪', '🧐', '🫣', '💅', '🦄', '🌈',
  '🔥', '❄️', '⚡', '🌊', '🍑', '🌸', '💫', '✨',
  '🎭', '🎪', '🎯', '🎲', '🃏', '🀄', '🧿', '🔮',
  '💝', '💘', '💗', '💖', '❤️‍🔥', '💜', '🩷', '🫶',
  '👀', '🧠', '🦾', '👁️', '🗿', '🤖', '👾', '🎮'
];

// 抽象符号库
const symbols = [
  '◈', '◇', '◆', '▣', '▩', '▦', '☰', '☱',
  '☲', '☳', '☴', '☵', '☶', '☷', '⚛', '⚡',
  '✦', '✧', '✹', '❋', '❊', '❉', '✿', '❀',
  '⬡', '⬢', '◎', '◉', '⊕', '⊗', '⊘', '⊙',
  '꩜', '᯽', '𖥔', '⟐', '⟡', '⌬', '⏣', '⎔',
  '☸', '✡', '☯', '☮', '♾️', '⚶', '⚷', '♅'
];

// 赛博代码片段
const codeSnippets = [
  'if(fate==true){love()}',
  'return 桃花.catch(err)',
  'while(单身){wait()}',
  'love.emit("signal")',
  'fate.resolve(you)',
  'quantum.observe(heart)',
  '0x00FF88 //桃花色',
  'err: 缘分未编译',
  'sudo find / -name 对象',
  'git commit -m "脱单"',
  'npm install 对象',
  'ping 月老.server',
  'chmod 777 爱情',
  'curl localhost:520',
  'SELECT * FROM 缘分',
  'DROP TABLE 单身;',
  'import {爱} from "缘分"',
  'async function 脱单(){}',
  'Promise.all([你, 我])',
  'new Date("在一起")',
  // 新增赛博/互联网黑话代码
  '// 底层逻辑：先赋能再耦合',
  'love.颗粒度 = "极细"',
  'if(垂直领域){打通闭环()}',
  '拉齐(你的认知, 我的认知)',
  'AI.predict(桃花运)',
  'cloud.burn(电子香)',
  'e_muyu.tap() // 功德+1',
  'bigData.match(灵魂伴侣)',
  '数字化转型(单身→恋爱)',
  'blockchain.store(缘分)',
  'API.call("/赛博算命")',
  'model.train(恋爱经验=0)',
  'catch(err){随缘()}',
  'const 缘分 = Math.random()',
  'yield* 暧昧Generator()',
  'Observable.of(crush)'
];

// 伪条形码
const barcodeChars = '▌▎▍▋▊▏█▐';

/**
 * 生成一个随机条形码字符串
 */
function generateBarcode() {
  let bc = '';
  const len = 15 + Math.floor(Math.random() * 20);
  for (let i = 0; i < len; i++) {
    bc += barcodeChars[Math.floor(Math.random() * barcodeChars.length)];
  }
  return bc;
}

/**
 * 获取一个随机数据流元素
 * @returns {{ text: string, type: string }}
 */
export function getRandomStreamItem() {
  const rand = Math.random();
  if (rand < 0.35) {
    return {
      text: memeTexts[Math.floor(Math.random() * memeTexts.length)],
      type: 'text-meme'
    };
  } else if (rand < 0.55) {
    return {
      text: emojis[Math.floor(Math.random() * emojis.length)],
      type: 'text-emoji'
    };
  } else if (rand < 0.70) {
    return {
      text: symbols[Math.floor(Math.random() * symbols.length)],
      type: 'text-symbol'
    };
  } else if (rand < 0.85) {
    return {
      text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      type: 'text-code'
    };
  } else {
    return {
      text: generateBarcode(),
      type: 'text-barcode'
    };
  }
}

/**
 * 在容器中创建一个飘动的数据流元素
 * @param {HTMLElement} container
 */
export function spawnStreamElement(container) {
  const item = getRandomStreamItem();
  const el = document.createElement('div');
  el.className = `stream-item ${item.type}`;
  el.textContent = item.text;

  // 随机位置和速度
  const leftPos = Math.random() * 92 + 4;
  const duration = 3 + Math.random() * 4;
  const fontSize = 0.7 + Math.random() * 1.3;
  const delay = Math.random() * 0.3;

  el.style.left = `${leftPos}%`;
  el.style.animationDuration = `${duration}s`;
  el.style.animationDelay = `${delay}s`;
  el.style.fontSize = `${fontSize}rem`;

  // 随机颜色变化
  if (item.type === 'text-meme') {
    const colors = ['#00ff88', '#00d4ff', '#ff00ff', '#ffcc00', '#ff6600', '#00ffcc'];
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
  }

  container.appendChild(el);

  // 动画结束后移除
  setTimeout(() => {
    el.remove();
  }, (duration + delay) * 1000 + 500);
}

/**
 * 捕获截图框内可见的数据流元素
 * @param {HTMLElement} container
 * @param {DOMRect} [frameRect] - 截图框的位置信息，如果不传则使用整个视口
 * @returns {Array<{text: string, type: string, x: number, y: number, color: string, fontSize: string}>}
 */
export function captureCurrentFrame(container, frameRect) {
  const items = container.querySelectorAll('.stream-item');
  const captured = [];

  // 如果没有传入截图框位置，则使用整个视口
  const frameTop = frameRect ? frameRect.top : 0;
  const frameBottom = frameRect ? frameRect.bottom : window.innerHeight;
  const frameLeft = frameRect ? frameRect.left : 0;
  const frameRight = frameRect ? frameRect.right : window.innerWidth;
  const frameWidth = frameRight - frameLeft;
  const frameHeight = frameBottom - frameTop;

  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    const opacity = parseFloat(getComputedStyle(item).opacity);
    
    // 只捕获在截图框内的元素（元素中心点在框内且可见）
    const centerX = (rect.left + rect.right) / 2;
    const centerY = (rect.top + rect.bottom) / 2;
    
    if (centerX >= frameLeft && centerX <= frameRight && 
        centerY >= frameTop && centerY <= frameBottom && 
        opacity > 0.3) {
      captured.push({
        text: item.textContent,
        type: item.className.replace('stream-item ', ''),
        x: ((centerX - frameLeft) / frameWidth) * 100,
        y: ((centerY - frameTop) / frameHeight) * 100,
        color: getComputedStyle(item).color,
        fontSize: getComputedStyle(item).fontSize
      });
    }
  });

  // 不再随机补充，只返回真实捕获到的框内元素
  return captured;
}

/**
 * 分析捕获帧中的元素组成
 * @param {Array} frame
 * @returns {{ memeCount: number, emojiCount: number, symbolCount: number, codeCount: number, barcodeCount: number, topMemes: string[], topEmojis: string[] }}
 */
export function analyzeFrame(frame) {
  const stats = {
    memeCount: 0,
    emojiCount: 0,
    symbolCount: 0,
    codeCount: 0,
    barcodeCount: 0,
    topMemes: [],
    topEmojis: []
  };

  frame.forEach(item => {
    if (item.type === 'text-meme') {
      stats.memeCount++;
      if (!stats.topMemes.includes(item.text)) stats.topMemes.push(item.text);
    } else if (item.type === 'text-emoji') {
      stats.emojiCount++;
      if (!stats.topEmojis.includes(item.text)) stats.topEmojis.push(item.text);
    } else if (item.type === 'text-symbol') {
      stats.symbolCount++;
    } else if (item.type === 'text-code') {
      stats.codeCount++;
    } else {
      stats.barcodeCount++;
    }
  });

  return stats;
}

// 导出所有文本库供报告模块使用
export { memeTexts, emojis, symbols, codeSnippets };