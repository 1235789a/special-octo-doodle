#!/usr/bin/env python3
"""社群体检报告 - 本地服务器"""

import json
import sqlite3
import uuid
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse

DB_FILE = 'local.db'
PORT = 3000


def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'active', max_uses INTEGER DEFAULT 1,
        used_count INTEGER DEFAULT 0)''')
    c.execute('''CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT, task_id TEXT UNIQUE NOT NULL,
        code_id INTEGER NOT NULL, status TEXT DEFAULT 'pending',
        file_name TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME, result_url TEXT)''')
    c.execute('INSERT OR IGNORE INTO codes (code, max_uses) VALUES (?, ?)', ('DEMO2024', 10))
    c.execute('INSERT OR IGNORE INTO codes (code, max_uses) VALUES (?, ?)', ('VIP888888', 5))
    conn.commit()
    conn.close()


class Handler(SimpleHTTPRequestHandler):
    def send_cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/' or parsed.path == '/index.html':
            self.serve_index()
        elif parsed.path.startswith('/api/report/'):
            task_id = parsed.path.split('/api/report/')[1]
            self.serve_report(task_id)
        else:
            self.send_error(404)

    def do_POST(self):
        parsed = urlparse(self.path)
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        data = json.loads(body) if body else {}

        if parsed.path == '/api/verify':
            self.api_verify(data)
        elif parsed.path == '/api/upload':
            self.api_upload(data)
        else:
            self.send_error(404)

    def api_verify(self, data):
        code = data.get('code', '').strip()
        if not code:
            self.send_json({'error': '请输入兑换码'}, 400)
            return
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute('SELECT * FROM codes WHERE code = ? AND status = ?', (code, 'active'))
        result = c.fetchone()
        conn.close()
        if not result:
            self.send_json({'valid': False, 'error': '兑换码无效'}, 400)
            return
        code_id, _, _, max_uses, used_count = result[:5]
        if used_count >= max_uses:
            self.send_json({'valid': False, 'error': '兑换码已用完'}, 400)
            return
        self.send_json({'valid': True, 'codeId': code_id, 'remaining': max_uses - used_count})

    def api_upload(self, data):
        code_id = data.get('codeId')
        file_content = data.get('fileContent', '{}')
        if not code_id:
            self.send_json({'error': '缺少兑换码'}, 400)
            return
        task_id = str(uuid.uuid4())
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute('''INSERT INTO tasks (task_id, code_id, status, completed_at, result_url)
                     VALUES (?, ?, 'completed', datetime('now'), ?)''',
                  (task_id, code_id, f'/api/report/{task_id}'))
        c.execute('UPDATE codes SET used_count = used_count + 1 WHERE id = ?', (code_id,))
        conn.commit()
        conn.close()
        Path('output').mkdir(exist_ok=True)
        with open(f'output/{task_id}.json', 'w', encoding='utf-8') as f:
            f.write(file_content)
        self.send_json({'success': True, 'taskId': task_id, 'reportUrl': f'/api/report/{task_id}'})

    def serve_index(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.send_cors()
        self.end_headers()
        self.wfile.write(INDEX_HTML.encode('utf-8'))

    def serve_report(self, task_id):
        json_file = f'output/{task_id}.json'
        if Path(json_file).exists():
            with open(json_file, 'r', encoding='utf-8') as f:
                report_data = json.load(f)
            html = generate_report(report_data)
        else:
            html = DEMO_REPORT
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.send_cors()
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False)
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_cors()
        self.end_headers()
        self.wfile.write(body.encode('utf-8'))


def calculate_health(data):
    group = data.get('group', {})
    total = group.get('total_members', 1)
    never = group.get('never_spoken', 0)
    active = group.get('active_1month', 0)
    members = data.get('members', [])
    active_rate = (len([m for m in members if m.get('total', 0) > 0]) / total) * 100
    dead_rate = (never / total) * 100
    core = len([m for m in members if m.get('last_1month', 0) > 50])
    score = round(active_rate * 0.35 + (100 - dead_rate) * 0.25 + min(active / total * 100 * 2.5, 100) * 0.25 + 60 * 0.15, 1)
    if score >= 85: status, cls = '优秀', 'excellent'
    elif score >= 70: status, cls = '良好', 'good'
    elif score >= 55: status, cls = '一般', 'normal'
    else: status, cls = '待改善', 'poor'
    return {'score': score, 'status': status, 'cls': cls, 'active_rate': round(active_rate, 1), 'dead_rate': round(dead_rate, 1), 'core': core}


def generate_report(data):
    group = data.get('group', {})
    members = data.get('members', [])
    time_dist = data.get('time_distribution', {})
    h = calculate_health(data)
    best = max(time_dist.items(), key=lambda x: x[1])[0] if time_dist else '16:00-18:00'
    return f'''<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><title>社群体检报告</title>
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f5f5f5;color:#333}}
.container{{max-width:800px;margin:0 auto;background:white;box-shadow:0 2px 10px rgba(0,0,0,0.1)}}
.page{{padding:40px;border-bottom:1px solid #eee}}
.page:last-child{{border-bottom:none}}
.page-title{{font-size:24px;font-weight:700;color:#1a1a1a;margin-bottom:24px;padding-bottom:12px;border-bottom:2px solid #6366f1}}
.page-title span{{color:#6366f1}}
.metrics{{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:24px}}
.metric{{background:#f8f9fa;padding:20px;border-radius:8px;text-align:center}}
.metric-value{{font-size:28px;font-weight:700;color:#6366f1}}
.metric-label{{font-size:13px;color:#666;margin-top:4px}}
.score-section{{background:linear-gradient(135deg,#6366f1,#7c3aed);color:white;padding:30px;border-radius:12px;text-align:center;margin-bottom:24px}}
.score-value{{font-size:56px;font-weight:800}}
.score-status{{font-size:20px;margin-top:8px;opacity:0.9}}
.status-text{{background:#f0fdf4;border-left:4px solid #10b981;padding:16px;border-radius:4px;color:#166534}}
.problem{{background:#fafafa;padding:20px;border-radius:8px;margin-bottom:16px}}
.problem-title{{font-weight:700;color:#1a1a1a;margin-bottom:8px;font-size:16px}}
.problem-why{{color:#666;font-size:14px;margin-bottom:6px}}
.problem-effect{{color:#888;font-size:13px}}
.action{{display:flex;gap:16px;padding:20px;background:#f8f9fa;border-radius:8px;margin-bottom:16px}}
.action-num{{background:#6366f1;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}}
.action-title{{font-weight:700;margin-bottom:6px}}
.action-why{{color:#666;font-size:14px;margin-bottom:4px}}
.action-effect{{color:#888;font-size:13px}}
.summary-box{{background:#f8f9fa;padding:20px;border-radius:8px}}
.summary-title{{font-weight:700;margin-bottom:12px}}
.summary-item{{padding:8px 0;border-bottom:1px solid #eee}}
.summary-item:last-child{{border-bottom:none}}
</style></head><body>
<div class="container">
<div class="page"><div class="page-title"><span>01</span> 群健康诊断</div>
<div class="score-section"><div class="score-value">{h['score']}分</div>
<div class="score-status">{h['status']}</div></div>
<div class="metrics">
<div class="metric"><div class="metric-value">{group.get('total_members', 0)}</div><div class="metric-label">群成员数</div></div>
<div class="metric"><div class="metric-value">{group.get('active_1month', 0)}人</div><div class="metric-label">近1月活跃成员</div></div>
<div class="metric"><div class="metric-value">{group.get('never_spoken', 0)}人</div><div class="metric-label">长期沉默成员</div></div>
<div class="metric"><div class="metric-value">{h['core']}人</div><div class="metric-label">核心活跃成员</div></div>
</div>
<div class="status-text"><strong>诊断结论：</strong>你的群整体{h['status']}。长期沉默成员占{h['dead_rate']}%，建议关注。</div>
</div>
<div class="page"><div class="page-title"><span>02</span> 问题定位</div>
<div class="problem"><div class="problem-title">问题1：长期沉默成员占比较高</div>
<div class="problem-why"><strong>为什么出现：</strong>部分成员入群后，缺少互动机会或入群目标已达成，逐渐不再发言。</div>
<div class="problem-effect"><strong>可能影响：</strong>整体互动率可能下降，新成员入群看到发言人数少，可能降低参与意愿。</div></div>
<div class="problem"><div class="problem-title">问题2：发言集中在少数成员</div>
<div class="problem-why"><strong>为什么出现：</strong>少数核心成员比较活跃，带动大部分发言，其他成员习惯围观。</div>
<div class="problem-effect"><strong>可能影响：</strong>若核心成员忙碌，群活跃度可能出现波动。</div></div>
<div class="problem"><div class="problem-title">问题3：活跃时段有规律</div>
<div class="problem-why"><strong>为什么出现：</strong>成员在特定时段更活跃（{best}），其他时段发言较少。</div>
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
</div></body></html>'''


DEMO_REPORT = generate_report({
    'group': {'name': '演示群', 'total_members': 414, 'active_1month': 90, 'never_spoken': 149},
    'members': [],
    'time_distribution': {'16:00-18:00': 1256, '20:00-22:00': 1089}
})


INDEX_HTML = '''<!DOCTYPE html>
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
</script></body></html>'''


def main():
    init_db()
    Path('output').mkdir(exist_ok=True)
    Path('data').mkdir(exist_ok=True)
    with open('data/sample.json', 'w', encoding='utf-8') as f:
        json.dump({
            'generated_at': '2026-06-07',
            'group': {
                'name': '运营交流群',
                'total_members': 414,
                'total_messages': 28650,
                'active_1month': 90,
                'never_spoken': 149
            },
            'members': [
                {'name': '张小明', 'total': 2156, 'last_1month': 156, 'tag': '🔥超活跃'},
                {'name': '李大红', 'total': 1890, 'last_1month': 132, 'tag': '🔥超活跃'},
                {'name': '王美丽', 'total': 1650, 'last_1month': 98, 'tag': '🔥超活跃'},
                {'name': '刘小华', 'total': 1230, 'last_1month': 87, 'tag': '🟢活跃'},
                {'name': '陈小丽', 'total': 980, 'last_1month': 65, 'tag': '🟢活跃'},
                {'name': '周星星', 'total': 750, 'last_1month': 45, 'tag': '🟢活跃'},
                {'name': '吴天天', 'total': 520, 'last_1month': 32, 'tag': '🟡偶尔'},
                {'name': '郑月月', 'total': 380, 'last_1month': 18, 'tag': '🟡偶尔'},
                {'name': '冯大地', 'total': 240, 'last_1month': 8, 'tag': '🟡偶尔'},
                {'name': '陈小球', 'total': 95, 'last_1month': 3, 'tag': '🟠低频'},
                {'name': '郑老六', 'total': 45, 'last_1month': 1, 'tag': '🟠低频'},
                {'name': '赵六六', 'total': 0, 'last_1month': 0, 'tag': '💀死号'},
                {'name': '钱七七', 'total': 0, 'last_1month': 0, 'tag': '💀死号'},
                {'name': '孙八八', 'total': 0, 'last_1month': 0, 'tag': '💀死号'},
                {'name': '周九九', 'total': 0, 'last_1month': 0, 'tag': '💀死号'}
            ],
            'time_distribution': {
                '08:00-10:00': 890,
                '10:00-12:00': 1256,
                '12:00-14:00': 2100,
                '14:00-16:00': 1580,
                '16:00-18:00': 2890,
                '18:00-20:00': 1890,
                '20:00-22:00': 3200,
                '22:00-24:00': 1650
            }
        }, f, ensure_ascii=False, indent=2)
    server = HTTPServer(('0.0.0.0', PORT), Handler)
    print(f'🚀 服务器已启动！')
    print(f'📍 访问地址：http://localhost:{PORT}')
    print(f'🎁 测试兑换码：DEMO2024, VIP888888')
    print(f'📁 项目目录：{Path.cwd()}')
    print(f'⏹️ 停止服务器：按 Ctrl+C')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n✅ 服务器已停止')
        server.shutdown()


if __name__ == '__main__':
    main()
