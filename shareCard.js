/**
 * 分享卡片模块 - 生成学术论文风格的分享图
 */

/**
 * 创建分享卡片覆盖层
 * @param {object} report 报告数据
 */
export function showShareCard(report) {
  // 如果已存在则移除
  const existing = document.querySelector('.share-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'share-overlay';

  // 渲染截屏样本 - 标签列表形式
  const sampleTags = report.capturedFrame.slice(0, 10).map(item => {
    return `<span style="display:inline-block;padding:3px 8px;margin:2px;border:1px solid #00ff8844;border-radius:12px;font-size:0.6rem;color:#00ff88;background:#00ff8811;white-space:nowrap;">${item.text}</span>`;
  }).join('');

  overlay.innerHTML = `
    <div class="share-card-preview">
      <div class="share-grid-bg"></div>
      <div class="share-card-inner">
        <div style="text-align:center;margin-bottom:8px;">
          <span style="font-size:0.6rem;color:#999;letter-spacing:3px;border:1px solid #ccc;padding:2px 8px;border-radius:2px;">CONFIDENTIAL</span>
        </div>
        <div class="share-title">
          📡 赛博桃花观测报告<br>
          <span style="font-size:0.65rem;color:#666;font-weight:normal;">Cyber Peach Blossom Observation Report</span>
        </div>
        
        <div class="share-sample-box" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;padding:10px;height:auto;min-height:80px;">
          ${sampleTags}
          <div style="width:100%;text-align:center;font-size:0.5rem;color:#00ff8866;margin-top:6px;">捕获粒子 × ${report.capturedFrame.length} | T=${report.timestamp}</div>
        </div>

        <div style="margin:10px 0;">
          <div class="share-tag" style="background:${report.peachType.color}22;color:${report.peachType.color};border-color:${report.peachType.color}44;">
            ${report.peachType.name}
          </div>
          <div class="share-tag">能量场 ${report.energyValue}%</div>
        </div>

        <div style="background:#f0f0e8;border:1px solid #ddd;border-radius:4px;padding:8px 10px;font-size:0.7rem;color:#555;line-height:1.6;margin:8px 0;">
          "${report.peachType.description.substring(0, 60)}…"
        </div>

        <div class="share-report-id">${report.reportId}</div>
        <div class="share-cta">"我的赛博桃花观测报告已出，很抽象，速看。"</div>

        <div style="text-align:center;margin-top:12px;padding-top:10px;border-top:1px dashed #ddd;">
          <span style="font-size:0.6rem;color:#aaa;">长按保存 · 分享给好友一起抽象</span>
        </div>
      </div>
    </div>
    <button class="share-close-btn" id="shareCloseBtn">关闭预览</button>
    <p style="font-size:0.7rem;color:#ffffff44;margin-top:8px;">（长按图片区域可保存分享）</p>
  `;

  document.body.appendChild(overlay);

  // 激活动画
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  // 关闭按钮
  const closeBtn = overlay.querySelector('#shareCloseBtn');
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 400);
  });

  // 点击背景关闭
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 400);
    }
  });
}
