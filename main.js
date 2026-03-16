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
  for (let i = 0; i < 8; i++) {
    const dot = document.createElement('div');
    dot.className = 'radar-dot';
    const angle = Math.random() * Math.PI * 2;
    const radius = 20 + Math.random() * 80;
    const x = 50 + Math.cos(angle) * radius / 2;
    const y = 50 + Math.sin(angle) * radius / 2;
    dot.style.left = `${x}%`;
    dot.style.top = `${y}%`;
    dot.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(dot);
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

  // 启动倒计时（总共约15秒，但按钮随时可点）
  els.countdownInner.style.width = '100%';
  const totalTime = 15000;
  const step = 50;
  let elapsed = 0;

  state.countdownTimer = setInterval(() => {
    elapsed += step;
    const pct = Math.max(0, 100 - (elapsed / totalTime) * 100);
    els.countdownInner.style.width = `${pct}%`;
    state.countdownValue = pct;

    // 更新提示文字
    if (pct > 75) {
      els.countdownText.textContent = '缘分粒子正在涌入…';
    } else if (pct > 50) {
      els.countdownText.textContent = '⚡ 粒子密度上升中，感觉对了就出手！';
      els.countdownText.style.color = '#00ff88aa';
    } else if (pct > 25) {
      els.countdownText.textContent = '⚡ 能量波动加剧！凭直觉出手！';
      els.countdownText.style.color = '#ffcc00aa';
    } else if (pct > 8) {
      els.countdownText.textContent = '🔥 粒子即将逃逸！快截屏！';
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
  els.countdownText.textContent = '📸 量子态已坍缩！正在解析缘分粒子…';
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
      btnMerit.innerHTML = `🕯️ 功德 +${state.meritCount} | 服务器已续命 ${state.meritCount} 秒`;
      btnMerit.style.color = '#ffcc00cc';
      
      // 加一个小动画
      btnMerit.style.transform = 'scale(1.05)';
      setTimeout(() => { btnMerit.style.transform = 'scale(1)'; }, 200);
    });
  }
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

  // 初始化粒子背景
  initParticleBg();

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