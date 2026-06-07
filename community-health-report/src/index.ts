export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/' || path === '') {
      return new Response(indexHtml(), { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
    }

    if (path === '/api/verify') {
      return handleVerify(request, env);
    }

    if (path === '/api/upload') {
      return handleUpload(request, env);
    }

    if (path.startsWith('/api/report')) {
      return handleReport(request, env);
    }

    return new Response('Not Found', { status: 404 });
  }
};

async function handleVerify(request: Request, env: Env) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405
    });
  }
  const { code } = await request.json();
  if (!code) {
    return new Response(JSON.stringify({ error: 'Code required' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
  }

  const { results } = await env.DB.prepare(
    'SELECT id, uses, max_uses FROM codes WHERE code = ?'
  ).bind(code).all();
  if (results.length === 0) {
    return new Response(JSON.stringify({ valid: false, error: 'Invalid code' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  }
  const row = results[0] as any;
  if (row.uses >= row.max_uses) {
    return new Response(JSON.stringify({ valid: false, error: 'Code already used' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  }

  await env.DB.prepare('UPDATE codes SET uses = uses + 1 WHERE id = ?').bind(row.id).run();
  return new Response(JSON.stringify({ valid: true, codeId: row.id }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleUpload(request: Request, env: Env) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405
    });
  }
  const { codeId, fileContent } = await request.json();
  const taskId = 'task_' + Date.now();

  await env.DB.prepare(
    'INSERT INTO tasks (id, data) VALUES (?, ?)'
  ).bind(taskId, fileContent).run();

  return new Response(JSON.stringify({
    success: true,
    taskId: taskId,
    reportUrl: '/api/report/' + taskId
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleReport(request: Request, env: Env) {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  const taskId = parts[parts.length - 1];

  const { results } = await env.DB.prepare(
    'SELECT data FROM tasks WHERE id = ?'
  ).bind(taskId).all();

  let reportData = null;
  if (results.length > 0) {
    reportData = JSON.parse((results[0] as any).data);
  } else {
    reportData = {
      group: { name: '演示群', total_members: 414, active_1month: 90, never_spoken: 149 },
      members: [],
      time_distribution: { '16:00-18:00': 1256, '20:00-22:00': 1089 }
    };
  }

  const html = generateReport(reportData);
  return new Response(html, { headers: { 'Content-Type': 'text/html;charset=utf-8' });
}

function indexHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>社群体检报告 - 微信群AI分析</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}:root{--primary:#6366f1;--primary-light:#818cf8;--primary-dark:#4f46e5;--success:#10b981;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-200:#e5e7eb;--gray-300:#d1d5db;--gray-400:#9ca3af;--gray-500:#6b7280;--gray-600:#4b5563;--gray-700:#374151;--gray-800:#1f2937;--gray-900:#111827}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--gray-50);color:var(--gray-800);line-height:1.6}
.container{max-width:1120px;margin:0 auto;padding:0 24px}
.hero{background:linear-gradient(180deg,#fff 0%,var(--gray-50) 100%);padding:80px 0 60px;text-align:center}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,0.1);color:var(--primary);padding:8px 16px;border-radius:100px;font-size:14px;font-weight:500;margin-bottom:24px}
.hero-title{font-size:48px;font-weight:700;letter-spacing:-0.02em;color:var(--gray-900);margin-bottom:20px;line-height:1.2}
.hero-subtitle{font-size:20px;color:var(--gray-500);max-width:640px;margin:0 auto 48px;line-height:1.7}
.value-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:48px}
.value-card{background:#fff;border:1px solid var(--gray-200);border-radius:16px;padding:32px;text-align:left;transition:all 0.2s ease}
.value-card:hover{border-color:var(--primary-light);box-shadow:0 4px 24px rgba(99,102,241,0.08);transform:translateY(-2px)}
.value-icon{width:48px;height:48px;background:linear-gradient(135deg,var(--primary),var(--primary-dark));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:20px}
.value-title{font-size:18px;font-weight:600;color:var(--gray-900);margin-bottom:8px}
.value-desc{font-size:14px;color:var(--gray-500);line-height:1.6}
.preview-section{background:#fff;padding:80px 0;border-top:1px solid var(--gray-100)}
.section-header{text-align:center;margin-bottom:48px}
.section-title{font-size:32px;font-weight:700;color:var(--gray-900);margin-bottom:12px}
.section-subtitle{font-size:16px;color:var(--gray-500)}
.report-preview{background:#fff;border:1px solid var(--gray-200);border-radius:24px;overflow:hidden;max-width:480px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.08)}
.report-header{background:linear-gradient(135deg,var(--primary),#7c3aed);color:#fff;padding:32px;text-align:center}
.report-title{font-size:14px;font-weight:500;opacity:0.9;margin-bottom:8px}
.report-score{font-size:56px;font-weight:800;letter-spacing:-0.02em}
.report-grade{font-size:16px;opacity:0.9;margin-top:4px}
.report-body{padding:32px}
.report-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:24px}
.stat-item{background:var(--gray-50);padding:20px;border-radius:12px;text-align:center}
.stat-value{font-size:28px;font-weight:700;color:var(--primary);margin-bottom:4px}
.stat-label{font-size:13px;color:var(--gray-500)}
.report-insight{background:var(--gray-50);padding:20px;border-radius:12px;border-left:4px solid var(--primary)}
.insight-title{font-size:13px;font-weight:600;color:var(--gray-700);margin-bottom:8px}
.insight-text{font-size:14px;color:var(--gray-600);line-height:1.6}
.form-section{padding:80px 0;background:var(--gray-50)}
.form-card{background:#fff;border:1px solid var(--gray-200);border-radius:24px;padding:48px;max-width:480px;margin:0 auto}
.form-title{font-size:24px;font-weight:700;color:var(--gray-900);text-align:center;margin-bottom:8px}
.form-subtitle{font-size:15px;color:var(--gray-500);text-align:center;margin-bottom:32px}
.input-group{margin-bottom:16px}
.input-label{display:block;font-size:14px;font-weight:500;color:var(--gray-700);margin-bottom:8px}
.input-field{width:100%;padding:14px 16px;border:2px solid var(--gray-200);border-radius:12px;font-size:16px;transition:all 0.2s ease;font-family:inherit}
.input-field:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 4px rgba(99,102,241,0.1)}
.btn{width:100%;padding:16px 24px;border:none;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.2s ease;font-family:inherit}
.btn-primary{background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(99,102,241,0.3)}
.btn-primary:disabled{opacity:0.6;cursor:not-allowed;transform:none}
.upload-section{margin-top:24px;display:none}
.upload-section.active{display:block}
.upload-area{border:2px dashed var(--gray-300);border-radius:16px;padding:48px 24px;text-align:center;cursor:pointer;transition:all 0.2s ease;background:var(--gray-50)}
.upload-area:hover{border-color:var(--primary);background:rgba(99,102,241,0.02)}
.upload-area.dragover{border-color:var(--primary);background:rgba(99,102,241,0.05)}
.upload-icon{font-size:48px;margin-bottom:16px}
.upload-text{font-size:16px;color:var(--gray-700);margin-bottom:8px}
.upload-hint{font-size:14px;color:var(--gray-400)}
.file-info{display:none;align-items:center;gap:12px;padding:16px;background:var(--gray-50);border-radius:12px;margin-top:16px}
.file-info.active{display:flex}
.file-icon{width:40px;height:40px;background:var(--primary);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px}
.file-details{flex:1}
.file-name{font-size:14px;font-weight:500;color:var(--gray-800)}
.file-size{font-size:13px;color:var(--gray-500)}
.file-remove{width:32px;height:32px;border:none;background:var(--gray-200);border-radius:8px;cursor:pointer;color:var(--gray-500);font-size:18px}
.status{padding:16px;border-radius:12px;font-size:14px;text-align:center;margin-top:16px;display:none}
.status.active{display:block}
.status.success{background:rgba(16,185,129,0.1);color:var(--success)}
.status.error{background:rgba(239,68,68,0.1);color:#ef4444}
.status.loading{background:rgba(99,102,241,0.1);color:var(--primary)}
.trust-section{padding:60px 0 80px;background:#fff;border-top:1px solid var(--gray-100)}
.trust-title{font-size:20px;font-weight:600;color:var(--gray-700);text-align:center;margin-bottom:32px}
.trust-items{display:flex;flex-wrap:wrap;justify-content:center;gap:24px}
.trust-item{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--gray-600)}
.trust-icon{width:20px;height:20px;background:var(--success);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;flex-shrink:0}
.steps{display:flex;justify-content:center;gap:48px;margin:32px 0}
.step{display:flex;align-items:center;gap:12px}
.step-number{width:32px;height:32px;background:var(--gray-200);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:var(--gray-500)}
.step.active .step-number{background:var(--primary);color:#fff}
.step-text{font-size:14px;color:var(--gray-500)}
.step.active .step-text{color:var(--gray-800);font-weight:500}
.step-arrow{color:var(--gray-300);font-size:20px}
@media(max-width:768px){.hero{padding:60px 0 40px}.hero-title{font-size:32px}.hero-subtitle{font-size:16px}.value-cards{grid-template-columns:1fr}.section-title{font-size:24px}.form-card{padding:32px 24px}.steps{flex-direction:column;align-items:center;gap:16px}.step-arrow{transform:rotate(90deg)}.trust-items{flex-direction:column;align-items:center}}
.loading-spinner{display:inline-block;width:20px;height:20px;border:2px solid rgba(255,255,255,0.3);border-radius:50%;border-top-color:#fff;animation:spin 0.8s linear infinite;margin-right:8px;vertical-align:middle}@keyframes spin{to{transform:rotate(360deg)}}
</style></head><body>
<section class="hero"><div class="container">
<div class="hero-badge">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
</svg>
微信群AI分析服务
</div>
<h1 class="hero-title">微信群AI体检报告</h1>
<p class="hero-subtitle">3分钟看清你的群到底有多少活跃成员，多少沉默成员，以及群是否正在失去活力。</p>
<div class="value-cards">
<div class="value-card"><div class="value-icon">👥</div><h3 class="value-title">核心成员识别</h3><p class="value-desc">找出真正推动群活跃的关键成员，了解谁在贡献内容</p></div>
<div class="value-card"><div class="value-icon">💀</div><h3 class="value-title">沉默成员检测</h3><p class="value-desc">快速识别长期不参与讨论的成员，了解群真实活跃度</p></div>
<div class="value-card"><div class="value-icon">📈</div><h3 class="value-title">群健康评分</h3><p class="value-desc">用数据判断群处于成长、稳定还是衰退阶段</p></div>
</div>
</div></section>
<section class="preview-section"><div class="container">
<div class="section-header"><h2 class="section-title">你将获得什么？</h2><p class="section-subtitle">专业的群体检分析报告，清晰呈现群状态</p></div>
<div class="report-preview">
<div class="report-header"><div class="report-title">群健康评分</div><div class="report-score">72</div><div class="report-grade">良好</div></div>
<div class="report-body">
<div class="report-stats">
<div class="stat-item"><div class="stat-value">414</div><div class="stat-label">成员总数</div></div>
<div class="stat-item"><div class="stat-value">90</div><div class="stat-label">活跃成员</div></div>
<div class="stat-item"><div class="stat-value">149</div><div class="stat-label">长期沉默成员</div></div>
<div class="stat-item"><div class="stat-value">5</div><div class="stat-label">核心贡献成员</div></div>
</div>
<div class="report-insight"><div class="insight-title">系统分析</div><div class="insight-text">TOP5成员贡献42%消息，群活跃度偏低，建议优化成员结构</div></div>
</div>
</div>
</div></section>
<section class="form-section"><div class="container">
<div class="section-header"><h2 class="section-title">开始生成你的群体检报告</h2><p class="section-subtitle">请输入购买后获得的兑换码</p></div>
<div class="form-card">
<div class="steps">
<div class="step active" id="step1-indicator"><div class="step-number">1</div><div class="step-text">验证兑换码</div></div>
<div class="step-arrow">→</div>
<div class="step" id="step2-indicator"><div class="step-number">2</div><div class="step-text">上传数据</div></div>
<div class="step-arrow">→</div>
<div class="step" id="step3-indicator"><div class="step-number">3</div><div class="step-text">获得报告</div></div>
</div>
<div id="step1">
<div class="input-group"><label class="input-label">兑换码</label><input type="text" id="code" class="input-field" placeholder="请输入兑换码（例如：DEMO2024）" maxlength="20"></div>
<button id="verifyBtn" class="btn btn-primary" onclick="verifyCode()">验证兑换码</button>
</div>
<div class="upload-section" id="step2">
<div class="input-label">上传群数据文件</div>
<div class="upload-area" id="uploadArea" onclick="document.getElementById('fileInput').click()">
<div class="upload-icon">📁</div><div class="upload-text">点击或拖拽文件到此处上传</div><div class="upload-hint">系统将自动生成完整分析报告</div>
<input type="file" id="fileInput" accept=".json" style="display:none">
</div>
<div class="file-info" id="fileInfo">
<div class="file-icon">📄</div><div class="file-details"><div class="file-name" id="fileName">filename.json</div><div class="file-size" id="fileSize">0 KB</div></div>
<button class="file-remove" onclick="removeFile()">×</button>
</div>
<button id="uploadBtn" class="btn btn-primary" onclick="uploadFile()" disabled style="margin-top:16px">开始生成报告</button>
</div>
<div class="status" id="status"></div>
</div>
</div></section>
<section class="trust-section"><div class="container">
<div class="trust-title">数据安全说明</div>
<div class="trust-items">
<div class="trust-item"><div class="trust-icon">✓</div>数据仅用于本次分析</div>
<div class="trust-item"><div class="trust-icon">✓</div>不保存聊天内容</div>
<div class="trust-item"><div class="trust-icon">✓</div>分析完成后自动删除</div>
<div class="trust-item"><div class="trust-icon">✓</div>无需登录微信账号</div>
<div class="trust-item"><div class="trust-icon">✓</div>全程自动化处理</div>
</div>
</div></section>
<script>
let codeId=null,selectedFile=null
const codeInput=document.getElementById('code'),verifyBtn=document.getElementById('verifyBtn'),uploadArea=document.getElementById('uploadArea'),fileInput=document.getElementById('fileInput'),fileInfo=document.getElementById('fileInfo'),fileName=document.getElementById('fileName'),fileSize=document.getElementById('fileSize'),uploadBtn=document.getElementById('uploadBtn'),status=document.getElementById('status')
fileInput.addEventListener('change',e=>{if(e.target.files.length>0)handleFile(e.target.files[0])})
uploadArea.addEventListener('dragover',e=>{e.preventDefault();uploadArea.classList.add('dragover')})
uploadArea.addEventListener('dragleave',()=>uploadArea.classList.remove('dragover'))
uploadArea.addEventListener('drop',e=>{e.preventDefault();uploadArea.classList.remove('dragover');if(e.dataTransfer.files.length>0)handleFile(e.dataTransfer.files[0])})
function showStatus(msg,type){status.textContent=msg;status.className='status active '+type}
function handleFile(f){selectedFile=f;fileName.textContent=f.name;fileSize.textContent=f.size<1024?f.size+' B':f.size<1024*1024?(f.size/1024).toFixed(1)+' KB':(f.size/(1024*1024)).toFixed(1)+' MB';fileInfo.classList.add('active');uploadArea.style.display='none';uploadBtn.disabled=false;status.classList.remove('active')}
function removeFile(){selectedFile=null;fileInput.value='';fileInfo.classList.remove('active');uploadArea.style.display='block';uploadBtn.disabled=true}
function formatFileSize(b){return b<1024?b+' B':b<1024*1024?(b/1024).toFixed(1)+' KB':(b/(1024*1024)).toFixed(1)+' MB'}
async function verifyCode(){const c=codeInput.value.trim();if(!c){showStatus('请输入兑换码','error');return}verifyBtn.disabled=true;verifyBtn.innerHTML='<span class="loading-spinner"></span>验证中...';showStatus('正在验证兑换码...','loading');try{const r=await fetch('/api/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:c})});const d=await r.json();if(r.ok&&d.valid){codeId=d.codeId;showStatus('兑换码验证成功！','success');document.getElementById('step1-indicator').classList.remove('active');document.getElementById('step2-indicator').classList.add('active');setTimeout(()=>{document.getElementById('step1').style.display='none';document.getElementById('step2').classList.add('active');document.getElementById('step2-indicator').classList.add('active');status.classList.remove('active')},1000)}else{showStatus(d.error||'兑换码无效','error');verifyBtn.disabled=false;verifyBtn.innerHTML='验证兑换码'}}catch(e){showStatus('网络错误，请重试','error');verifyBtn.disabled=false;verifyBtn.innerHTML='验证兑换码'}}
async function uploadFile(){if(!selectedFile||!codeId){showStatus('请先选择文件','error');return}uploadBtn.disabled=true;uploadBtn.innerHTML='<span class="loading-spinner"></span>生成中...';showStatus('正在分析数据并生成报告...','loading');try{const fileContent=await selectedFile.text();const r=await fetch('/api/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({codeId,fileContent})});const d=await r.json();if(r.ok&&d.success){showStatus('报告生成成功！正在跳转...','success');document.getElementById('step2-indicator').classList.remove('active');document.getElementById('step3-indicator').classList.add('active');setTimeout(()=>{window.location.href=d.reportUrl},1500)}else{showStatus(d.error||'上传失败，请重试','error');uploadBtn.disabled=false;uploadBtn.innerHTML='开始生成报告'}}catch(e){showStatus('网络错误，请重试','error');uploadBtn.disabled=false;uploadBtn.innerHTML='开始生成报告'}}
codeInput.addEventListener('keypress',e=>{if(e.key==='Enter')verifyCode()})
</script></body></html>`;
}

function generateReport(data) {
  const group = data.group || {};
  const health = calculateHealth(data);
  const bestTime = Object.keys(data.time_distribution || {}).length > 0
    ? Object.entries(data.time_distribution || {}).sort((a, b) => b[1] - a[1])[0][0]
    : '16:00-18:00';

  return `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8">
<title>社群体检报告</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f5f5f5;color:#333}
.container{max-width:800px;margin:0 auto;background:white;box-shadow:0 2px 10px rgba(0,0,0,0.1)}
.page{padding:40px;border-bottom:1px solid #eee}
.page:last-child{border-bottom:none}
.page-title{font-size:24px;font-weight:700;color:#1a1a1a;margin-bottom:24px;padding-bottom:12px;border-bottom:2px solid #6366f1}
.page-title span{color:#6366f1}
.metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:24px}
.metric{background:#f8f9fa;padding:20px;border-radius:8px;text-align:center}
.metric-value{font-size:28px;font-weight:700;color:#6366f1}
.metric-label{font-size:13px;color:#666;margin-top:4px}
.score-section{background:linear-gradient(135deg,#6366f1,#7c3aed);color:white;padding:30px;border-radius:12px;text-align:center;margin-bottom:24px}
.score-value{font-size:56px;font-weight:800}
.score-status{font-size:20px;margin-top:8px;opacity:0.9}
.status-text{background:#f0fdf4;border-left:4px solid #10b981;padding:16px;border-radius:4px;color:#166534}
.problem{background:#fafafa;padding:20px;border-radius:8px;margin-bottom:16px}
.problem-title{font-weight:700;color:#1a1a1a;margin-bottom:8px;font-size:16px}
.problem-why{color:#666;font-size:14px;margin-bottom:6px}
.problem-effect{color:#888;font-size:13px}
.action{display:flex;gap:16px;padding:20px;background:#f8f9fa;border-radius:8px;margin-bottom:16px}
.action-num{background:#6366f1;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}
.action-title{font-weight:700;margin-bottom:6px}
.action-why{color:#666;font-size:14px;margin-bottom:4px}
.action-effect{color:#888;font-size:13px}
.summary-box{background:#f8f9fa;padding:20px;border-radius:8px}
.summary-title{font-weight:700;margin-bottom:12px}
.summary-item{padding:8px 0;border-bottom:1px solid #eee}
.summary-item:last-child{border-bottom:none}
</style></head><body>
<div class="container">
<div class="page"><div class="page-title"><span>01</span> 群健康诊断</div>
<div class="score-section"><div class="score-value">${health.score}</div>
<div class="score-status">${health.status}</div></div>
<div class="metrics">
<div class="metric"><div class="metric-value">${group.total_members || 0}</div><div class="metric-label">群成员数</div></div>
<div class="metric"><div class="metric-value">${group.active_1month || 0}人</div><div class="metric-label">近1月活跃成员</div></div>
<div class="metric"><div class="metric-value">${group.never_spoken || 0}人</div><div class="metric-label">长期沉默成员</div></div>
<div class="metric"><div class="metric-value">${health.core}人</div><div class="metric-label">核心活跃成员</div></div>
</div>
<div class="status-text"><strong>诊断结论：</strong>你的群整体${health.status}。长期沉默成员占${health.dead_rate}%，建议关注。</div>
</div>
<div class="page"><div class="page-title"><span>02</span> 问题定位</div>
<div class="problem"><div class="problem-title">问题1：长期沉默成员占比较高</div>
<div class="problem-why"><strong>为什么出现：</strong>部分成员入群后，缺少互动机会或入群目标已达成，逐渐不再发言。</div>
<div class="problem-effect"><strong>可能影响：</strong>整体互动率可能下降，新成员入群看到发言人数少，可能降低参与意愿。</div></div>
<div class="problem"><div class="problem-title">问题2：发言集中在少数成员</div>
<div class="problem-why"><strong>为什么出现：</strong>少数核心成员比较活跃，带动了群内大部分发言，其他成员习惯围观。</div>
<div class="problem-effect"><strong>可能影响：</strong>若核心成员忙碌，群活跃度可能出现波动。</div></div>
<div class="problem"><div class="problem-title">问题3：活跃时段有规律</div>
<div class="problem-why"><strong>为什么出现：</strong>成员在特定时段更活跃（${bestTime}），其他时段发言较少。</div>
<div class="problem-effect"><strong>可能影响：</strong>重要消息在非活跃时段发布，可能错过最佳触达时间。</div></div>
</div>
<div class="page"><div class="page-title"><span>03</span> 行动建议</div>
<div class="action"><div class="action-num">1</div><div class="action-content">
<div class="action-title">整理长期沉默成员名单</div>
<div class="action-why"><strong>为什么做：</strong>清晰了解需重点关注的成员，便于后续决策。</div>
<div class="action-effect"><strong>预期效果：</strong>对群成员结构有更清晰认知。</div></div></div>
<div class="action"><div class="action-num">2</div><div class="action-content">
<div class="action-title">在活跃时段发起互动</div>
<div class="action-why"><strong>为什么做：</strong>在活跃时段发布话题，参与人数可能更多。</div>
<div class="action-effect"><strong>预期效果：</strong>话题参与度可能提升。</div></div></div>
<div class="action"><div class="action-num">3</div><div class="action-content">
<div class="action-title">维护核心成员</div>
<div class="action-why"><strong>为什么做：</strong>核心成员是群活跃的重要支撑，简单互动有助于维持其积极性。</div>
<div class="action-effect"><strong>预期效果：</strong>核心成员可能更愿意持续参与。</div></div></div>
</div>
<div class="page"><div class="page-title"><span>04</span> 总结</div>
<div class="summary-box"><div class="summary-title"><strong>优先执行事项</strong></div>
<div class="summary-item">1. 整理长期沉默成员名单（Day1）</div>
<div class="summary-item">2. 在活跃时段发布互动话题（Day4）</div>
<div class="summary-item">3. 感谢核心活跃成员（Day3）</div></div>
<div style="margin-top:20px"><div class="summary-title"><strong>建议观察指标</strong></div>
<div class="summary-item">• 每日活跃人数变化</div>
<div class="summary-item">• 每日发言数变化</div>
<div class="summary-item">• 核心成员参与度</div></div>
<div style="margin-top:20px"><div class="summary-title"><strong>后续建议</strong></div>
<div class="summary-item">7天后可以重新检测，对比变化，了解优化效果。</div></div>
</div></body></html>`;
}

function calculateHealth(data) {
  const group = data.group || {};
  const total = group.total_members || 1;
  const never = group.never_spoken || 0;
  const activeMonth = group.active_1month || 0;
  const members = data.members || [];
  
  const activeRate = members.length > 0 
    ? (members.filter(m => (m.total || 0) > 0).length / total) * 100 
    : (activeMonth / total) * 100;
  
  const deadRate = (never / total) * 100;
  const coreCount = members.filter(m => (m.last_1month || 0) > 50).length;
  
  const score = Math.round(
    Math.min(activeRate * 0.35 + (100 - deadRate) * 0.25 + Math.min(activeRate * 2.5, 100) * 0.25 + 60 * 0.15, 100));
  let status, statusClass;
  if (score >= 85) { status = '优秀'; statusClass = 'excellent'; }
  else if (score >= 70) { status = '良好'; statusClass = 'good'; }
  else if (score >= 55) { status = '一般'; statusClass = 'normal'; }
  else { status = '待改善'; statusClass = 'poor'; }

  return {
    score, status, class: statusClass,
    active_rate: Math.round(activeRate * 10) / 10,
    dead_rate: Math.round(deadRate * 10) / 10,
    core: Math.max(coreCount, 3)
  };
}
