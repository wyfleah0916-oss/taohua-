/**
 * 赛博桃花检测器 - 主入口
 * 控制场景切换、动画和交互逻辑
 */

import { spawnStreamElement, captureCurrentFrame } from './dataStream.js';
import { generateReport, renderReportHTML } from './report.js';
import { showShareCard } from './shareCard.js';

// ===== 全局状态 =====
const state = {
  currentScene: 'landing',
  streamInterval: null,
  countdownTimer: null,
  countdownValue: 100,
  capturedFrame: null,
  currentReport: null,
  meritCount: 0
};

// ===== DOM引用 =====
const scenes = {
  landing: document.getElementById('scene-landing'),
  stream: document.getElementById('scene-stream'),
  report: document.getElementById('scene-report')
};

const els = {
  btnStart: document.getElementById('btnStart'),
  streamContainer: document.getElementById('streamContainer'),
  btnCapture: document.getElementById('btnCapture'),
  flashOverlay: document.getElementById('flashOverlay'),
  countdownInner: document.getElementById('countdownInner'),
  countdownText: document.getElementById('countdownText'),
  reportWrapper: document.getElementById('reportWrapper'),
  particleBg: document.getElementById('particleBg'),
  pixelBuddha: document.getElementById('pixelBuddha'),
  radarDots: document.getElementById('radarDots'),
  captureFrame: document.getElementById('captureFrame')
};

// ===== 场景切换 =====
function switchScene(sceneName) {
  Object.values(scenes).forEach(s => {
    s.classList.remove('active', 'fade-in');
  });
  state.currentScene = sceneName;
  const target = scenes[sceneName];
  target.classList.add('active', 'fade-in');
}

// ===== 像素佛头渲染 =====
function renderPixelBuddha() {
  // 用CSS绘制一个简约的像素风佛头
  const buddha = els.pixelBuddha;
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 36;
  const ctx = canvas.getContext('2d');
  
  const color = '#00ff88';
  ctx.fillStyle = color;
  
  // 简笔像素佛头 - 头部轮廓
  const pixels = [
    // 发髻（佛头特征的肉髻）
    [12,0],[13,0],[14,0],[15,0],[16,0],[17,0],[18,0],[19,0],
    [10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],[20,1],[21,1],
    [10,2],[11,2],[20,2],[21,2],
    [9,3],[10,3],[21,3],[22,3],
    // 头部
    [8,4],[9,4],[22,4],[23,4],
    [7,5],[8,5],[23,5],[24,5],
    [7,6],[24,6],
    [6,7],[25,7],
    [6,8],[25,8],
    // 眼睛
    [6,9],[10,9],[11,9],[20,9],[21,9],[25,9],
    [6,10],[25,10],
    // 鼻子
    [6,11],[15,11],[16,11],[25,11],
    [6,12],[25,12],
    // 嘴巴（微笑）
    [7,13],[12,13],[13,13],[18,13],[19,13],[24,13],
    [7,14],[11,14],[20,14],[24,14],
    // 下巴
    [8,15],[23,15],
    [9,16],[22,16],
    [10,17],[21,17],
    [11,18],[12,18],[13,18],[14,18],[15,18],[16,18],[17,18],[18,18],[19,18],[20,18],
    // 耳垂
    [4,7],[5,7],[4,8],[5,8],[4,9],[5,9],[4,10],[5,10],[4,11],[5,11],[4,12],[5,12],[4,13],
    [26,7],[27,7],[26,8],[27,8],[26,9],[27,9],[26,10],[27,10],[26,11],[27,11],[26,12],[27,12],[26,13],
    // 脖子
    [13,19],[14,19],[15,19],[16,19],[17,19],[18,19],
    // 佛光点缀
    [15,0],[16,0],
  ];

  pixels.forEach(([x, y]) => {
    ctx.fillRect(x, y, 1, 1);
  });

  buddha.style.backgroundImage = `url(${canvas.toDataURL()})`;
  buddha.style.backgroundSize = 'contain';
  buddha.style.backgroundRepeat = 'no-repeat';
  buddha.style.backgroundPosition = 'center';
}

// ===== 雷达光点 =====
function initRadarDots() {
  const container = els.radarDots;
  for (let i = 0; i < 12; i++) {
    const dot = document.createElement('div');
    dot.className = 'radar-dot';
    const angle = Math.random() * Math.PI * 2;
    const radius = 20 + Math.random() * 80;
    const x = 50 + Math.cos(angle) * radius / 2;
    const y = 50 + Math.sin(angle) * radius / 2;
    dot.style.left = `${x}%`;
    dot.style.top = `${y}%`;
    dot.style.animationDelay = `${Math.random() * 2}s`;
    // 随机颜色变体
    if (Math.random() > 0.6) {
      dot.style.background = '#ff69b4';
      dot.style.boxShadow = '0 0 6px #ff69b4, 0 0 12px #ff69b444';
    }
    container.appendChild(dot);
  }
}

// ===== 雷达桃花标记 =====
function initRadarPeachMarks() {
  const container = document.getElementById('radarPeachMarks');
  if (!container) return;
  
  const peachIcons = ['🌸', '💗', '✿', '❀', '🩷'];
  
  function spawnMark() {
    const mark = document.createElement('div');
    mark.className = 'radar-peach-mark';
    mark.textContent = peachIcons[Math.floor(Math.random() * peachIcons.length)];
    
    const angle = Math.random() * Math.PI * 2;
    const radius = 15 + Math.random() * 75;
    const x = 50 + Math.cos(angle) * radius / 2;
    const y = 50 + Math.sin(angle) * radius / 2;
    
    mark.style.left = `${x}%`;
    mark.style.top = `${y}%`;
    mark.style.animationDelay = `${Math.random() * 1}s`;
    mark.style.animationDuration = `${2 + Math.random() * 2}s`;
    
    container.appendChild(mark);
    
    setTimeout(() => mark.remove(), 4000);
  }
  
  // 定期生成桃花标记
  setInterval(() => {
    if (state.currentScene === 'landing') {
      spawnMark();
    }
  }, 800);
  
  // 初始一批
  for (let i = 0; i < 4; i++) {
    setTimeout(() => spawnMark(), i * 400);
  }
}

// ===== 粒子背景 =====
function initParticleBg() {
  const canvas = els.particleBg;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2;
      this.alpha = Math.random() * 0.3 + 0.05;
      this.color = Math.random() > 0.7 ? '#ff00ff' : '#00ff88';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(animate);
  }
  animate();
}

// ===== 电流桃花飘落 - 升级版 =====
function initPeachRain() {
  const container = document.getElementById('peachRain');
  if (!container) return;

  // 桃花花瓣符号 + 电流风格 - 更多种类
  const petals = ['🌸', '💮', '🏵️', '✿', '❀', '❁', '🌺', '💗', '🩷', '⚡', '✨', '💫', '🌷'];
  // 霓虹赛博色系 - 更丰富
  const glowColors = ['#ff69b4', '#ff00ff', '#ff1493', '#ff77aa', '#cc66ff', '#00ff88', '#00d4ff', '#ff44aa', '#ffaacc'];

  function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'peach-petal';

    const symbol = petals[Math.floor(Math.random() * petals.length)];
    const glowColor = glowColors[Math.floor(Math.random() * glowColors.length)];
    const leftPos = Math.random() * 100;
    const size = 0.7 + Math.random() * 1.5;
    const duration = 3.5 + Math.random() * 5;
    const delay = Math.random() * 0.3;

    petal.style.setProperty('--petal-glow', glowColor);
    petal.style.left = `${leftPos}%`;
    petal.style.fontSize = `${size}rem`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;

    // 花瓣本体 + 电流小火花装饰（增加到4个）
    petal.innerHTML = `
      <span style="text-shadow: 0 0 10px ${glowColor}, 0 0 20px ${glowColor}66, 0 0 40px ${glowColor}22;">${symbol}</span>
      <span class="petal-spark" style="--petal-glow:${glowColor};"></span>
      <span class="petal-spark" style="--petal-glow:${glowColor};"></span>
      <span class="petal-spark" style="--petal-glow:${glowColor};"></span>
      <span class="petal-spark" style="--petal-glow:${glowColor};"></span>
    `;

    container.appendChild(petal);

    // 动画结束后移除
    setTimeout(() => {
      petal.remove();
    }, (duration + delay) * 1000 + 200);
  }

  // 初始一批 - 更多
  for (let i = 0; i < 8; i++) {
    setTimeout(() => createPetal(), i * 250);
  }

  // 持续生成 - 更高密度
  setInterval(() => {
    createPetal();
  }, 450);
}

// ===== 数据流控制 =====
function startStream() {
  switchScene('stream');
  state.countdownValue = 100;

  // 清空容器
  els.streamContainer.innerHTML = '';

  // 开始生成数据流元素
  state.streamInterval = setInterval(() => {
    spawnStreamElement(els.streamContainer);
  }, 45);

  // 同时生成多个初始元素
  for (let i = 0; i < 30; i++) {
    setTimeout(() => spawnStreamElement(els.streamContainer), i * 50);
  }

  // 启动倒计时（总共约30秒，按钮随时可点）
  els.countdownInner.style.width = '100%';
  const totalTime = 30000;
  const step = 50;
  let elapsed = 0;

  state.countdownTimer = setInterval(() => {
    elapsed += step;
    const pct = Math.max(0, 100 - (elapsed / totalTime) * 100);
    els.countdownInner.style.width = `${pct}%`;
    state.countdownValue = pct;

    // 更新提示文字
    if (pct > 80) {
      els.countdownText.textContent = '✨ 缘分碎片正在疯狂涌入…';
    } else if (pct > 60) {
      els.countdownText.textContent = '👀 看到心动的碎片了吗？点击下方按钮截图！';
      els.countdownText.style.color = '#00ff88aa';
    } else if (pct > 40) {
      els.countdownText.textContent = '⚡ 能量越来越野了！感觉对了就戳截图！';
      els.countdownText.style.color = '#00d4ffaa';
    } else if (pct > 20) {
      els.countdownText.textContent = '🔮 宇宙在暗示你！快点下面按钮截图叭！';
      els.countdownText.style.color = '#ffcc00aa';
    } else if (pct > 8) {
      els.countdownText.textContent = '🔥 再不点截图粒子就跑光啦！快快快！';
      els.countdownText.style.color = '#ff4444aa';
    } else {
      // 自动截屏
      handleCapture();
    }
  }, step);
}

function stopStream() {
  if (state.streamInterval) {
    clearInterval(state.streamInterval);
    state.streamInterval = null;
  }
  if (state.countdownTimer) {
    clearInterval(state.countdownTimer);
    state.countdownTimer = null;
  }
}

// ===== 截屏处理 =====
function handleCapture() {
  // 防止重复触发
  if (state.capturedFrame) return;

  stopStream();

  // 截图框闪烁效果
  els.captureFrame.classList.add('captured');

  // 闪光效果
  els.flashOverlay.classList.add('flash');
  setTimeout(() => els.flashOverlay.classList.remove('flash'), 700);

  // 捕获截图框内的元素
  const frameRect = els.captureFrame.getBoundingClientRect();
  state.capturedFrame = captureCurrentFrame(els.streamContainer, frameRect);

  // 冻结画面
  els.streamContainer.classList.add('frozen-frame');
  els.btnCapture.style.display = 'none';
  els.countdownText.textContent = '📸 啪！抓到了！缘分碎片正在被解码…';
  els.countdownText.style.color = '#00ff88';

  // 1.5秒后切换到报告页
  setTimeout(() => {
    showReport();
  }, 1500);
}

// ===== 显示报告 =====
function showReport() {
  // 生成报告
  state.currentReport = generateReport(state.capturedFrame);

  // 渲染报告HTML
  els.reportWrapper.innerHTML = renderReportHTML(state.currentReport);

  // 切换场景
  switchScene('report');

  // 滚动到顶部
  scenes.report.scrollTop = 0;

  // 延迟动画能量条填充
  setTimeout(() => {
    const fill = document.getElementById('energyFill');
    if (fill) {
      fill.style.width = fill.dataset.target + '%';
    }
  }, 1200);

  // 绑定报告页按钮事件
  bindReportEvents();
}

// ===== 报告页事件绑定 =====
function bindReportEvents() {
  const btnShare = document.getElementById('btnShare');
  const btnRetry = document.getElementById('btnRetry');
  const btnMerit = document.getElementById('btnMerit');
  const btnSaveLongImg = document.getElementById('btnSaveLongImg');

  if (btnShare) {
    btnShare.addEventListener('click', () => {
      showShareCard(state.currentReport);
    });
  }

  if (btnRetry) {
    btnRetry.addEventListener('click', () => {
      resetAndRestart();
    });
  }

  if (btnMerit) {
    btnMerit.addEventListener('click', () => {
      state.meritCount++;
      btnMerit.innerHTML = `🕯️ 咚 ×${state.meritCount} | 月老已收到你的催单，加急处理中`;
      btnMerit.style.color = '#ffcc00cc';
      
      // 加一个小动画
      btnMerit.style.transform = 'scale(1.05)';
      setTimeout(() => { btnMerit.style.transform = 'scale(1)'; }, 200);
    });
  }

  if (btnSaveLongImg) {
    btnSaveLongImg.addEventListener('click', () => {
      generateLongImage();
    });
  }
}

// ===== 生成报告长图 =====
async function generateLongImage() {
  const btn = document.getElementById('btnSaveLongImg');
  if (!btn) return;
  
  // 防止重复点击
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在生成长图，请稍候…';

  try {
    const reportWrapper = document.getElementById('reportWrapper');
    
    // 使用html2canvas渲染报告为canvas
    const canvas = await html2canvas(reportWrapper, {
      backgroundColor: '#0a0a12',
      scale: 2, // 高清2倍
      useCORS: true,
      logging: false,
      // 忽略按钮区域和页脚
      ignoreElements: (element) => {
        if (element.id === 'btnShare' || element.id === 'btnRetry' || 
            element.id === 'btnMerit' || element.id === 'btnSaveLongImg') return true;
        if (element.classList && element.classList.contains('report-actions')) return true;
        if (element.classList && element.classList.contains('merit-btn')) return true;
        if (element.classList && element.classList.contains('save-img-btn')) return true;
        if (element.classList && element.classList.contains('page-footer')) return true;
        return false;
      }
    });

    // 将canvas转为图片URL
    const imgDataUrl = canvas.toDataURL('image/png');

    // 展示长图预览弹层
    showLongImagePreview(imgDataUrl);
  } catch (err) {
    console.error('生成长图失败:', err);
    alert('生成长图失败，请重试');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-image"></i> 📸 生成报告长图（长按可保存）';
  }
}

// ===== 长图预览弹层 =====
function showLongImagePreview(imgDataUrl) {
  // 移除已存在的弹层
  const existing = document.querySelector('.longimg-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'longimg-overlay';
  overlay.innerHTML = `
    <div class="longimg-header">
      <span class="longimg-title">📸 报告长图已生成</span>
      <button class="longimg-close-btn" id="longimgCloseBtn">✕</button>
    </div>
    <div class="longimg-tip">👇 长按下方图片即可保存到相册</div>
    <div class="longimg-scroll-area">
      <img src="${imgDataUrl}" class="longimg-result" alt="赛博桃花检测报告长图" />
    </div>
    <div class="longimg-bottom-tip">长按图片 → 保存到手机相册 → 分享给好友</div>
  `;

  document.body.appendChild(overlay);

  // 激活动画
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  // 关闭按钮
  const closeBtn = overlay.querySelector('#longimgCloseBtn');
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 400);
  });

  // 点击背景关闭（但不在图片上触发）
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 400);
    }
  });
}

// ===== 重置重玩 =====
function resetAndRestart() {
  state.capturedFrame = null;
  state.currentReport = null;
  els.streamContainer.classList.remove('frozen-frame');
  els.btnCapture.style.display = '';
  els.countdownText.style.color = '#00ff8888';
  els.reportWrapper.innerHTML = '';
  els.captureFrame.classList.remove('captured');
  
  startStream();
}

// ===== 初始化 =====
function init() {
  // 渲染像素佛头
  renderPixelBuddha();

  // 初始化雷达光点
  initRadarDots();

  // 初始化雷达桃花标记
  initRadarPeachMarks();

  // 初始化粒子背景
  initParticleBg();

  // 初始化电流桃花飘落
  initPeachRain();

  // 绑定启动按钮
  els.btnStart.addEventListener('click', () => {
    startStream();
  });

  // 绑定截屏按钮
  els.btnCapture.addEventListener('click', () => {
    handleCapture();
  });

  // 显示启动页
  switchScene('landing');
}

// 启动
init();