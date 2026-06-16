// 研究二：企业扭亏进程阶段对战略投资止损决策的影响
// Cognition.run 代码编辑器版：复制全部代码到 Source code。

(function injectStyle() {
  const style = document.createElement('style');
  style.textContent = `
    body { background: #f7f8fa; }
    .jspsych-display-element { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", Arial, sans-serif; color:#101828; line-height:1.72; }
    .card { max-width:900px; margin:0 auto; background:white; border-radius:18px; padding:34px 44px; box-shadow:0 8px 28px rgba(16,24,40,.08); text-align:left; }
    .center { text-align:center; }
    .tag { display:inline-block; padding:6px 14px; border-radius:999px; background:#eef4ff; color:#1d4ed8; font-weight:700; margin-bottom:14px; }
    .title { font-size:30px; font-weight:800; margin:10px 0 24px; text-align:center; }
    .big { font-size:36px; font-weight:850; letter-spacing:.04em; text-align:center; margin:18px 0; }
    .focus { font-weight:850; text-decoration:underline; text-decoration-thickness:2px; text-underline-offset:4px; }
    .blue { color:#1d4ed8; } .red { color:#b42318; } .green { color:#067647; }
    .muted { color:#667085; font-size:15px; }
    .notice { background:#f1f5ff; border-left:5px solid #3b82f6; padding:16px 20px; border-radius:12px; margin:22px 0; }
    .warning { background:#fff7ed; border:1px solid #fed7aa; padding:16px 20px; border-radius:12px; margin:22px 0; }
    .data-box { background:#f9fafb; border:1px solid #eaecf0; border-radius:14px; padding:18px 22px; margin:16px 0; }
    .gain { color:#067647; font-weight:800; } .loss { color:#b42318; font-weight:800; }
    .row { display:flex; align-items:center; gap:14px; margin:14px 0; flex-wrap:wrap; }
    .row label { min-width:150px; font-weight:700; text-align:right; }
    input[type="text"], input[type="number"], select { font-size:18px; padding:8px 12px; border:1px solid #d0d5dd; border-radius:8px; min-width:220px; }
    .scale-block { margin:24px 0; }
    .scale-title { font-size:20px; font-weight:800; margin-bottom:8px; }
    .scale-line { display:grid; grid-template-columns:auto 1fr auto 40px; gap:12px; align-items:center; font-size:16px; }
    .scale-line input[type=range] { width:100%; }
    .ceo-visual { max-width:430px; margin:12px auto 20px; background:linear-gradient(145deg,#f8fafc,#eef4ff); border-radius:20px; padding:20px; text-align:center; border:1px solid #e2e8f0; }
    .timeline-bar { height:16px; border-radius:999px; background:#e5e7eb; overflow:hidden; margin:20px 0 8px; }
    .timeline-fill { height:100%; background:linear-gradient(90deg,#93c5fd,#2563eb); border-radius:999px; }
    @media (max-width:700px) { .card { padding:26px 24px; margin:0 8px; } .title{font-size:25px;} .big{font-size:30px;} .row label{text-align:left; min-width:120px;} .scale-line{grid-template-columns:1fr;} }
  `;
  document.head.appendChild(style);
})();

const STUDY_VERSION = "study2_turnaround_v1_datapipe";
const DATAPIPE_EXPERIMENT_ID = "DWsnQFuFkw1G";
const START_BALANCE = 3000; // 单位：万元
const CONDITIONS = ["mid_loss_recovery", "small_loss_recovery", "profit_after_turnaround"];
const CONDITION_LABELS = {
  mid_loss_recovery: "亏损收窄至中亏阶段",
  small_loss_recovery: "亏损收窄至小亏阶段",
  profit_after_turnaround: "扭亏为盈并稳定盈利阶段"
};
let subject_id = jsPsych.randomization.randomID(12);
let condition = getConditionFromURL() || jsPsych.randomization.sampleWithoutReplacement(CONDITIONS, 1)[0];
let balance = START_BALANCE;
let stopped = false;
let stop_point = null;
let stop_reason = null;
let demographics = {};
let conditionMonths = makeOperationSequence(condition);
let strategicRounds = makeStrategicSequence();

jsPsych.data.addProperties({ subject_id, experiment_version: STUDY_VERSION, condition, condition_label: CONDITION_LABELS[condition], start_balance: START_BALANCE, unit: "万元" });

function getConditionFromURL() { const c = new URLSearchParams(window.location.search).get("condition"); return CONDITIONS.includes(c) ? c : null; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function jitterAmount(base, width) { return base + randInt(-width, width); }
function formatMoney(x) { const sign = x > 0 ? "+" : ""; return `${sign}${x} 万元`; }
function moneyClass(x) { return x >= 0 ? "gain" : "loss"; }

function makeOperationSequence(cond) {
  let seq = [];
  function pushPhase(label, n, base, width) { for (let i=0;i<n;i++) seq.push({stage:label, result:jitterAmount(base,width)}); }
  pushPhase("起步小亏", 5, -20, 5);
  pushPhase("业务扩张中亏", 5, -40, 5);
  pushPhase("压力峰值大亏", 3, -70, 5);
  pushPhase("亏损开始收窄", 5, -40, 5);
  if (cond === "mid_loss_recovery") {
    pushPhase("仍处于中亏", 10, -40, 5);
  } else if (cond === "small_loss_recovery") {
    pushPhase("亏损进一步收窄至小亏", 10, -20, 5);
  } else {
    pushPhase("小亏接近盈亏平衡", 5, -20, 5);
    pushPhase("扭亏为盈并稳定盈利", 8, 40, 5);
  }
  return seq.map((m, idx) => ({ month: idx+1, stage:m.stage, result:m.result }));
}
function makeStrategicSequence() {
  return [
    { round:1, result:-20, stage:"小额前期投入" },
    { round:2, result:-22, stage:"小额前期投入" },
    { round:3, result:-28, stage:"亏损略有增加" },
    { round:4, result:-35, stage:"中等投入压力" },
    { round:5, result:-45, stage:"亏损继续放大" },
    { round:6, result:-55, stage:"较大投入压力" },
    { round:7, result:-65, stage:"项目压力峰值" },
    { round:8, result:-55, stage:"亏损开始收窄" },
    { round:9, result:-40, stage:"亏损继续收窄" },
    { round:10, result:-25, stage:"接近阶段性转折" },
    { round:11, result:180, stage:"初步战略回报" },
    { round:12, result:220, stage:"后期战略回报" }
  ];
}
function scaleHTML(name, title, left, right, defaultVal=4) {
  return `<div class="scale-block"><div class="scale-title">${title}</div><div class="scale-line"><span>1 ${left}</span><input type="range" name="${name}" min="1" max="7" value="${defaultVal}" oninput="document.getElementById('${name}_val').innerText=this.value" required><span>7 ${right}</span><strong id="${name}_val">${defaultVal}</strong></div></div>`;
}
function ceoSVG(gender) {
  if (gender === "female") return `<div class="ceo-visual"><svg width="320" height="190" viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="20" width="290" height="150" rx="20" fill="#f5f3ff" stroke="#c4b5fd"/><rect x="42" y="42" width="236" height="32" rx="10" fill="#ede9fe"/><text x="160" y="64" text-anchor="middle" font-size="20" font-weight="800" fill="#6d28d9">女性 CEO 决策情境</text><circle cx="104" cy="108" r="28" fill="#f9a8d4"/><path d="M74 150 C82 128,126 128,136 150" fill="#7c3aed"/><path d="M82 102 C86 70,128 70,132 103 C124 88,93 88,82 102" fill="#111827"/><rect x="168" y="96" width="88" height="10" rx="5" fill="#8b5cf6"/><rect x="168" y="118" width="66" height="10" rx="5" fill="#c4b5fd"/><rect x="168" y="140" width="96" height="10" rx="5" fill="#ddd6fe"/></svg></div>`;
  return `<div class="ceo-visual"><svg width="320" height="190" viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="20" width="290" height="150" rx="20" fill="#eff6ff" stroke="#93c5fd"/><rect x="42" y="42" width="236" height="32" rx="10" fill="#dbeafe"/><text x="160" y="64" text-anchor="middle" font-size="20" font-weight="800" fill="#1d4ed8">男性 CEO 决策情境</text><circle cx="104" cy="108" r="28" fill="#bfdbfe"/><path d="M74 150 C82 128,126 128,136 150" fill="#1e3a8a"/><path d="M82 92 C94 70,126 74,132 98 C118 87,96 87,82 92" fill="#111827"/><rect x="168" y="96" width="96" height="10" rx="5" fill="#2563eb"/><rect x="168" y="118" width="66" height="10" rx="5" fill="#93c5fd"/><rect x="168" y="140" width="84" height="10" rx="5" fill="#bfdbfe"/></svg></div>`;
}

const welcome = { type: jsPsychHtmlButtonResponse, stimulus: `<div class="card center"><div class="tag">研究二：企业扭亏进程与战略投资决策</div><div class="title">CEO经营决策模拟实验</div><p>请想象你正在作为一家公司的 <span class="focus blue">CEO</span> 做经营决策。</p><p>你的任务不是简单追求眼前账户数字最大化，而是在 <span class="focus">公司账户安全</span> 与 <span class="focus">长期发展机会</span> 之间做出平衡。</p><div class="notice">本实验采用“基础参与奖励 + 表现相关奖励”的方式。表现相关奖励会参考你在任务中的最终公司账户表现进行核算，但不是账户金额与实际奖励的一一对应。</div><p class="muted">请在安静环境中完成，中途不要刷新或退出页面。</p></div>`, choices:["开始"] };

const demographics_trial = { type: jsPsychSurveyHtmlForm, html: `<div class="card"><div class="title">基本信息与过往经历</div><p class="center"><span class="focus">下面几个问题主要了解你过去经历中的一般倾向</span>，没有标准答案。</p><div class="row"><label>姓名/昵称/学号：</label><input name="participant_name" type="text" placeholder="建议填写拼音或学号" required></div><div class="row"><label>年龄：</label><input name="age" type="number" min="10" max="80" required></div><div class="row"><label>性别：</label><select name="gender" required><option value="">请选择</option><option value="female">女</option><option value="male">男</option></select></div>${scaleHTML("risk_preference","1. 在你过去的经历中，面对不确定但可能有较好结果的事情时，你通常愿意承担一定风险吗？","完全不愿意","非常愿意",4)}${scaleHTML("loss_sensitivity","2. 在你过去的经历中，损失100元带来的难受感，通常会比得到100元带来的开心感更强吗？","完全不同意","非常同意",4)}${scaleHTML("endowment_feeling","3. 在你过去的经历中，当账户里平白无故多出一笔钱时，你会很快觉得这笔钱已经是“我的钱”吗？","完全不同意","非常同意",4)}${scaleHTML("sunk_cost_tendency","4. 在你过去的经历中，如果你已经在某件事上投入了很多时间、金钱或精力，即使后来不太顺利，你也会更想继续坚持吗？","完全不同意","非常同意",4)}</div>`, button_label:"继续", on_finish:function(data){ const r=data.response||{}; demographics={ participant_name:r.participant_name, age:Number(r.age), gender:r.gender, risk_preference:Number(r.risk_preference), loss_sensitivity:Number(r.loss_sensitivity), endowment_feeling:Number(r.endowment_feeling), sunk_cost_tendency:Number(r.sunk_cost_tendency)}; jsPsych.data.addProperties(demographics); data.phase="demographics_controls"; Object.assign(data, demographics); }};

const ceo_context = { type: jsPsychHtmlButtonResponse, stimulus:function(){ return `<div class="card"><div class="tag">CEO角色导入</div>${ceoSVG(demographics.gender)}<div class="title">你现在是一家科技公司的 CEO</div><p>这家公司经历过业务扩张和市场波动。你需要带领公司走出经营压力，并判断哪些项目值得继续投入。</p><div class="warning"><p><span class="focus red">请注意：</span>你管理的是 <span class="focus">公司账户</span>，不是个人零花钱。</p><p>你的判断需要在 <span class="focus">维持公司账户安全</span> 与 <span class="focus">争取长期发展机会</span> 之间做平衡。</p></div></div>`; }, choices:["进入公司经营模拟"], on_finish:d=>d.phase="ceo_context" };

const operation_intro = { type: jsPsychHtmlButtonResponse, stimulus:`<div class="card"><div class="tag">第一阶段：公司经营历程</div><div class="title">你正在努力运营一家公司</div><p><span class="focus">请想象：</span>你刚接手一家正在发展中的科技公司。公司业务正在推进，但市场环境并不稳定。</p><p>接下来你会连续经历若干个经营月。每个月结束后，你会看到公司账户变化。</p><div class="notice">这一阶段你暂时不需要做战略项目选择，但 <span class="focus">请务必认真</span> 查看每个月的经营结果。</div><div class="data-box center">公司初始账户资金为：<span class="big">${START_BALANCE} 万元</span></div></div>`, choices:["开始运营"], on_finish:d=>d.phase="operation_intro" };

function makeOperationMonthTrial(m){ return { type:jsPsychHtmlButtonResponse, stimulus:function(){ balance += m.result; const pct=Math.round((m.month/conditionMonths.length)*100); return `<div class="card"><div class="tag">CEO经营简报</div><div class="title">第 ${m.month} 个经营月</div><div class="timeline-bar"><div class="timeline-fill" style="width:${pct}%"></div></div><p class="muted center">经营进程：${m.month} / ${conditionMonths.length}</p><div class="data-box center"><p>本月公司经营状态：<span class="${moneyClass(m.result)}">${formatMoney(m.result)}</span></p><div class="big">当前公司账户余额：${balance} 万元</div></div><p class="center muted">请查看本月公司账户变化后，再继续经营。</p></div>`; }, choices:["坚持继续经营"], on_finish:function(data){ data.phase="phase1_operation"; data.operation_month=m.month; data.operation_stage=m.stage; data.operation_result=m.result; data.operation_balance=balance; data.operation_view_rt=data.rt; }}; }

const manipulation_check = { type: jsPsychSurveyHtmlForm, html:function(){ return `<div class="card"><div class="title">公司经营状态更新</div><div class="data-box center"><p>第一阶段经营已经结束。</p><div class="big">当前公司账户余额：${balance} 万元</div></div><p class="center">请站在 <span class="focus blue">CEO</span> 的角度，根据刚才的 <span class="focus">公司账户变化</span> 回答下面几个问题。</p><div class="scale-block"><div class="scale-title">作为CEO，你觉得公司目前的经营状态更接近：</div><div class="row" style="justify-content:center;"><select name="perceived_status" required><option value="">请选择</option><option value="loss">仍处于亏损压力</option><option value="improving_loss">亏损正在收窄</option><option value="near_break_even">接近盈亏平衡</option><option value="profit">已经进入盈利状态</option></select></div></div>${scaleHTML("balance_satisfaction","此刻你对公司账户状态的满意程度：","很不满意","很满意",4)}${scaleHTML("management_responsibility","此刻你觉得自己对公司账户资金负有管理责任的程度：","完全没有","非常强",4)}</div>`; }, button_label:"进入战略投资决策", on_finish:function(data){ const r=data.response||{}; data.phase="manipulation_check"; data.phase1_final_balance=balance; data.perceived_status=r.perceived_status; data.balance_satisfaction=Number(r.balance_satisfaction); data.management_responsibility=Number(r.management_responsibility); jsPsych.data.addProperties({phase1_final_balance:balance, perceived_status:r.perceived_status, balance_satisfaction:Number(r.balance_satisfaction), management_responsibility:Number(r.management_responsibility)}); }};

const strategic_intro = { type: jsPsychHtmlButtonResponse, stimulus:`<div class="card"><div class="tag">第二阶段：战略投资项目</div><div class="title">现在，公司面临一个新的战略产品项目</div><p>这个项目短期内需要持续投入，可能拖累公司账户表现；但如果坚持到合适阶段，也可能为公司带来后续战略价值。</p><div class="notice"><p><span class="focus blue">你的任务：</span>作为 CEO，请在每一轮项目结果出现后，判断公司是否应该 <span class="focus">继续投入下一轮</span>，还是 <span class="focus red">停止并锁定剩余资金</span>。</p><p><span class="focus blue">决策原则：</span>请在 <span class="focus">维持公司账户安全</span> 与 <span class="focus">争取长期发展机会</span> 之间做平衡。</p></div><p>你可以选择在该项目的任何一轮结束后停止投资。一旦停止，实验将结束，公司账户剩余资金将保留并锁定。</p></div>`, choices:["开始战略项目"], on_finish:d=>d.phase="strategic_intro" };

function makeStrategicRatingTrial(r){ return { type:jsPsychSurveyHtmlForm, html:function(){ const projected=balance+r.result; return `<div class="card"><div class="tag">CEO战略项目评估</div><div class="title">项目第 ${r.round} 个决策月</div><div class="data-box center"><p>本月项目结果：<span class="${moneyClass(r.result)}">${formatMoney(r.result)}</span></p><p class="muted">项目状态：${r.stage}</p><div class="big">当前公司账户余额：${projected} 万元</div></div><p class="center">请先评估你此刻的感受，然后进入正式决策。</p>${scaleHTML("phase2_intention","如果还能进入下一轮，你认为公司继续投入的意愿/必要性有多强？","完全不想继续","非常想继续",4)}${scaleHTML("phase2_anxiety","作为CEO，此刻你对公司账户和项目走势感到焦虑吗？","完全不焦虑","非常焦虑",4)}${scaleHTML("phase2_hesitation","此刻你对继续还是停止有多纠结？","完全不纠结","非常纠结",4)}</div>`; }, button_label:"进入正式决策", on_finish:function(data){ data.phase="phase2_rating"; data.phase2_round=r.round; data.phase2_result=r.result; data.phase2_stage=r.stage; data.phase2_balance_preview=balance+r.result; data.phase2_intention=Number(data.response.phase2_intention); data.phase2_anxiety=Number(data.response.phase2_anxiety); data.phase2_hesitation=Number(data.response.phase2_hesitation); data.phase2_rating_rt=data.rt; }}; }
function makeStrategicDecisionTrial(r){ return { type:jsPsychHtmlButtonResponse, stimulus:function(){ balance += r.result; const isFinal = r.round===strategicRounds.length; if(isFinal){ stop_point=r.round; stop_reason="forced_end"; stopped=true; return `<div class="card"><div class="tag">项目结束</div><div class="title">项目已到达预设结束点</div><div class="data-box center"><p>本月项目结果：<span class="${moneyClass(r.result)}">${formatMoney(r.result)}</span></p><div class="big">最终公司账户余额：${balance} 万元</div></div><p class="center">你已坚持到项目预设结束点。请确认并进入结束页。</p></div>`;} return `<div class="card center"><div class="tag">正式决策</div><div class="title">项目第 ${r.round} 个决策月</div><div class="data-box"><p>本月项目结果：<span class="${moneyClass(r.result)}">${formatMoney(r.result)}</span></p><div class="big">当前公司账户余额：${balance} 万元</div></div><p>作为 CEO，你是否决定让公司继续投入下一轮？</p></div>`; }, choices:function(){ return r.round===strategicRounds.length ? ["确认并结束"] : ["继续投入下一轮", "停止并锁定剩余资金"]; }, on_finish:function(data){ const isFinal=r.round===strategicRounds.length; let decision=null, label=null; if(isFinal){ decision=9; label="forced_end"; } else if(data.response===0){ decision=1; label="continue"; } else { decision=0; label="stop"; stopped=true; stop_point=r.round; stop_reason="voluntary_stop"; } data.phase="phase2_decision"; data.phase2_round=r.round; data.phase2_result=r.result; data.phase2_stage=r.stage; data.phase2_balance=balance; data.phase2_decision=decision; data.phase2_decision_label=label; data.phase2_decision_rt=data.rt; data.stop_point=stop_point; data.stop_reason=stop_reason; data.final_balance=stopped?balance:null; if(balance<=0){ stopped=true; stop_point=r.round; stop_reason="bankrupt_stop"; data.stop_point=stop_point; data.stop_reason=stop_reason; data.final_balance=balance; } }}; }
function conditionalStrategicNode(r){ return { timeline:[makeStrategicRatingTrial(r), makeStrategicDecisionTrial(r)], conditional_function:function(){ return !stopped; }}; }

const summary = { type: jsPsychSurveyHtmlForm, html:function(){ if(stop_point==null){ stop_point=strategicRounds.length; stop_reason="forced_end"; } return `<div class="card"><div class="title">任务结束前的小结</div><div class="data-box center"><p>你的战略项目止损点：<span class="focus">${stop_point}</span></p><p>停止原因：<span class="focus">${stop_reason==="voluntary_stop"?"主动停止":"项目到达预设结束点"}</span></p><div class="big">最终公司账户余额：${balance} 万元</div></div>${scaleHTML("task_involvement","刚才做任务时，你在多大程度上代入了公司CEO的角色？","完全没有代入","非常代入",4)}${scaleHTML("strategy_belief","你觉得这个战略项目后期可能带来价值的程度：","完全不可能","非常可能",4)}${scaleHTML("task_seriousness","你刚才完成任务时的认真程度：","很不认真","非常认真",5)}</div>`; }, button_label:"提交并结束", on_finish:function(data){ data.phase="post_task_summary"; data.stop_point=stop_point; data.stop_reason=stop_reason; data.final_balance=balance; data.task_involvement=Number(data.response.task_involvement); data.strategy_belief=Number(data.response.strategy_belief); data.task_seriousness=Number(data.response.task_seriousness); jsPsych.data.addProperties({stop_point, stop_reason, final_balance:balance, task_involvement:data.task_involvement, strategy_belief:data.strategy_belief, task_seriousness:data.task_seriousness}); }};

const save_to_datapipe = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: DATAPIPE_EXPERIMENT_ID,
  filename: function() {
    const safeName = (demographics.participant_name || "anon").replace(/[^a-zA-Z0-9_\-]/g, "").slice(0, 20) || "anon";
    const t = new Date().toISOString().replace(/[:.]/g, "-");
    return `study2_${condition}_${safeName}_${subject_id}_${t}.csv`;
  },
  data_string: function() {
    return jsPsych.data.get().csv();
  },
  on_finish: function(data) {
    data.phase = "datapipe_save";
    data.datapipe_experiment_id = DATAPIPE_EXPERIMENT_ID;
  }
};

const end = { type:jsPsychHtmlButtonResponse, stimulus:function(){ console.log("Experiment finished. Data sent to DataPipe/OSF:", `study2_turnaround_${subject_id}.csv`); return `<div class="card center"><div class="title">实验结束，感谢参与</div><p>你的实验数据已经自动保存。完成到这个页面即可。</p></div>`; }, choices:["完成"], on_finish:d=>d.phase="end" };

let timeline = [welcome, demographics_trial, ceo_context, operation_intro];
for(const m of conditionMonths) timeline.push(makeOperationMonthTrial(m));
timeline.push(manipulation_check, strategic_intro);
for(const r of strategicRounds) timeline.push(conditionalStrategicNode(r));
timeline.push(summary, save_to_datapipe, end);
jsPsych.run(timeline);
