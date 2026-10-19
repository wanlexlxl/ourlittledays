/* ==========================================================================
   两人小日子 · 我们的手账
   零依赖单页应用：组件化渲染 + 哈希路由 + localStorage 持久化
   结构：CONFIG / 图标 / 工具 / 数据 / 组件 / 视图 / 渲染 / 事件 / 启动
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ 配置 */

  var CONFIG = {
    spaceName: '我们的空间',
    couple: {
      a: { name: '小熙', emoji: '🍀' },
      b: { name: '小雅', emoji: '🍑' }
    },
    startDate: '2025-12-08',   // 在一起的开始日期，用于计算「第 N 天」
    freezeDate: null,          // 传 'YYYY-MM-DD' 可把「今天」固定在某天，方便截图对照
    storageKey: 'our-little-days:v1'
  };

  /* -------------------------------------------------------------- 线性图标 */

  var PATHS = {
    clover: '<circle cx="12" cy="8" r="3.4"/><circle cx="8" cy="14.4" r="3.4"/><circle cx="16" cy="14.4" r="3.4"/><path d="M12 17.8V21"/>',
    grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/>',
    listChecks: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 7h8"/><path d="M13 12h8"/><path d="M13 17h8"/>',
    wallet: '<path d="M19 8V6.5A2.5 2.5 0 0 0 16.5 4H6a3 3 0 0 0 0 6h13a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3V7"/><path d="M16.6 13.6h.01"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C9.8 3 11 5.5 12 8c1-2.5 2.2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    piggy: '<path d="M5 13.6a5.6 5.6 0 0 1 5.6-5.6h2.8a5.6 5.6 0 0 1 5.6 5.6V15a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3z"/><path d="M8.4 7.6 7 4.6l3 .7"/><path d="M19 12.6h2"/><path d="M10.6 10.6h3.6"/><path d="M9 18v2.2"/><path d="M15 18v2.2"/><circle cx="9" cy="12.4" r=".9" fill="currentColor" stroke="none"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.6A5.4 5.4 0 0 0 16.6 3c-1.8 0-3 .5-4.6 2-1.6-1.5-2.8-2-4.6-2A5.4 5.4 0 0 0 2 8.4c0 2.4 1.5 4.1 3 5.6l7 7Z"/>',
    sparkles: '<path d="M12 3.2 10.2 8.6a2 2 0 0 1-1.3 1.3L3.5 11.7l5.4 1.8a2 2 0 0 1 1.3 1.3L12 20.2l1.8-5.4a2 2 0 0 1 1.3-1.3l5.4-1.8-5.4-1.8a2 2 0 0 1-1.3-1.3Z"/><path d="M5 2.5v3"/><path d="M3.5 4h3"/><path d="M19 17.5v3"/><path d="M17.5 19h3"/>',
    share: '<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.4 10.8 7.2-4.1"/><path d="m8.4 13.2 7.2 4.1"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    arrowUpRight: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
    arrowRight: '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
    download: '<path d="M20.5 15.5v3a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5v-3"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M12 15V3.5"/>',
    upload: '<path d="M20.5 15.5v3a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5v-3"/><path d="m7.5 8 4.5-4.5L16.5 8"/><path d="M12 3.5V15"/>',
    trash: '<path d="M3.5 6.5h17"/><path d="M8.5 6.5V4.8A1.8 1.8 0 0 1 10.3 3h3.4a1.8 1.8 0 0 1 1.8 1.8v1.7"/><path d="M18.5 6.5v12.7a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V6.5"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    message: '<path d="M21 11.6a8.6 8.6 0 0 1-9.2 8.6 9 9 0 0 1-3.9-.9L3 21l1.6-4.6A8.5 8.5 0 0 1 3.5 11 8.6 8.6 0 0 1 12 2.5h.4A8.6 8.6 0 0 1 21 11.1z"/>',
    send: '<path d="M21 3 10.5 13.5"/><path d="M21 3l-6.5 18-4-8.5L2 8.5 21 3z"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.6" cy="9.4" r="1.6"/><path d="m3.6 17.2 5-4.4 3.6 3 3-2.6 5.2 4.4"/>',
    sliders: '<path d="M4 6h9"/><path d="M17 6h3"/><path d="M4 12h3"/><path d="M11 12h9"/><path d="M4 18h7"/><path d="M15 18h5"/><circle cx="15" cy="6" r="2.2"/><circle cx="9" cy="12" r="2.2"/><circle cx="13" cy="18" r="2.2"/>',
    calendar: '<path d="M8 3v3.5"/><path d="M16 3v3.5"/><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17"/>',
    receipt: '<path d="M5 3.5 7 5l2-1.5L11 5l2-1.5L15 5l2-1.5 2 1.5v17l-2-1.4L15 22l-2-1.4L11 22l-2-1.4L7 22l-2-1.4z"/><path d="M8.5 9h7"/><path d="M8.5 13h7"/><path d="M8.5 16.5h4"/>',
    sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2"/>',
    check: '<path d="m20 6.5-11 11-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
    pen: '<path d="M12.5 20H21"/><path d="M16.4 3.6a2.1 2.1 0 0 1 3 3L7.5 18.5 3.5 20l1.5-4z"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
    leaf: '<path d="M11.5 20.5c-6 0-9-3.4-9-8.9 0-5.6 4-9.1 9.1-9.1h8.9v9.1c0 5.5-3.4 8.9-9 8.9z"/><path d="M20.5 3.5C15 6 11 11 9.4 20.5"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.6a3.2 3.2 0 0 1 0 6.3"/><path d="M17.5 14.6a5.5 5.5 0 0 1 3 4.9"/>'
  };

  function icon(name, size, cls) {
    var s = size || 18;
    return '<svg class="ico ' + (cls || '') + '" width="' + s + '" height="' + s +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (PATHS[name] || '') + '</svg>';
  }

  /* ------------------------------------------------------------ 通用工具 */

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function today() {
    var d = CONFIG.freezeDate ? new Date(CONFIG.freezeDate + 'T12:00:00') : new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  }

  function isoDay(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }

  function fmtCN(d) {
    return (d.getMonth() + 1) + '月' + d.getDate() + '日星期' + '日一二三四五六'.charAt(d.getDay());
  }

  function fmtMD(d) { return (d.getMonth() + 1) + '月' + d.getDate() + '日'; }

  function dayLabel(offset) {
    if (offset === 0) return '今天';
    if (offset === -1) return '昨天';
    var d = today();
    d.setDate(d.getDate() + offset);
    return fmtMD(d);
  }

  // 记录里存的是绝对日期（YYYY-MM-DD），显示时再换算成「今天/昨天」。
  // 早先版本存的是「相对天数」，过一天就会一直显示"今天"，这里做兼容。
  function recordOffset(rec) {
    if (rec && rec.date) {
      var d = new Date(rec.date + 'T12:00:00');
      if (!isNaN(d.getTime())) return Math.round((d - today()) / 86400000);
    }
    return (rec && typeof rec.day === 'number') ? rec.day : 0;
  }

  function entryDate(e) {
    if (e && e.date) {
      var fixed = new Date(e.date + 'T12:00:00');
      if (!isNaN(fixed.getTime())) return fixed;
    }
    var d = today();
    d.setDate(d.getDate() + ((e && typeof e.day === 'number') ? e.day : 0));
    return d;
  }

  function daysTogether() {
    var start = new Date(CONFIG.startDate + 'T12:00:00');
    var diff = Math.round((today() - start) / 86400000) + 1;
    return diff > 0 ? diff : 1;
  }

  function num(n, dec) {
    var d = dec === undefined ? 2 : dec;
    return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function uid(prefix) {
    return (prefix || 'x') + (window.crypto && window.crypto.randomUUID
      ? window.crypto.randomUUID() : Date.now().toString(36) + randomSalt());
  }

  function money(value) {
    var n = Number(value);
    return Number.isFinite(n) && n > 0 && n <= 1000000000 ? Math.round(n * 100) / 100 : 0;
  }

  function validDay(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    var d = new Date(value + 'T12:00:00');
    return !isNaN(d.getTime()) && isoDay(d) === value;
  }

  function editTime(rec) { return Math.max(Date.now(), Number(rec && rec.updatedAt || 0) + 1); }

  function safeImageUrl(url) {
    return typeof url === 'string' && (/^https?:\/\//i.test(url) || /^data:image\/(jpeg|png|webp|gif);base64,[a-z0-9+/=]+$/i.test(url));
  }

  var LIST_KEYS = ['todos', 'ledger', 'wishes', 'savingsLog', 'moods', 'posts', 'comments'];

  // 所有入口共用校验；旧版相对日期只迁移一次，之后固定保存。
  function normalizeData(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('INVALID_DATA');
    var data = JSON.parse(JSON.stringify(input));
    var anchor = validDay(String(data.exportedAt || '').slice(0, 10))
      ? new Date(String(data.exportedAt).slice(0, 10) + 'T12:00:00') : today();
    function records(list) {
      if (!Array.isArray(list)) throw new Error('INVALID_DATA');
      return list.map(function (r) {
        if (!r || typeof r !== 'object' || Array.isArray(r) || typeof r.id !== 'string' ||
            !/^[a-z0-9_-]{1,128}$/i.test(r.id)) throw new Error('INVALID_DATA');
        Object.keys(r).forEach(function (k) {
          if (['images'].indexOf(k) < 0 && r[k] !== null && typeof r[k] === 'object') throw new Error('INVALID_DATA');
        });
        ['text', 'title', 'name', 'emoji', 'cat', 'who', 'mood', 'note', 'time', 'tag', 'when', 'status', 'postId', 'wishId', 'hash', 'salt'].forEach(function (k) {
          if (r[k] !== undefined && typeof r[k] !== 'string') throw new Error('INVALID_DATA');
        });
        ['amount', 'target', 'saved', 'savedBase', 'updatedAt', 'day'].forEach(function (k) {
          if (r[k] !== undefined && (typeof r[k] !== 'number' || !Number.isFinite(r[k]))) throw new Error('INVALID_DATA');
        });
        ['done', 'deleted'].forEach(function (k) {
          if (r[k] !== undefined && typeof r[k] !== 'boolean') throw new Error('INVALID_DATA');
        });
        if (r.images !== undefined && (!Array.isArray(r.images) || r.images.some(function (u) { return !safeImageUrl(u); }))) throw new Error('INVALID_DATA');
        return r;
      });
    }
    LIST_KEYS.forEach(function (key) {
      data[key] = records(data[key] === undefined ? [] : data[key]);
      data[key].forEach(function (r) {
        if (key === 'ledger' && (typeof r.amount !== 'number' || !r.amount || Math.abs(r.amount) > 1000000000)) throw new Error('INVALID_DATA');
        if (key === 'savingsLog' && !money(r.amount)) throw new Error('INVALID_DATA');
        if (key === 'wishes' && !money(r.target)) throw new Error('INVALID_DATA');
        if (key === 'todos' && !r.text && !r.deleted) throw new Error('INVALID_DATA');
        if (key === 'moods' && !r.mood) throw new Error('INVALID_DATA');
        if (key === 'comments' && (!r.postId || !r.text)) throw new Error('INVALID_DATA');
        if (key === 'posts' && !r.deleted && !r.text && !(r.images && r.images.length)) throw new Error('INVALID_DATA');
        if (key !== 'todos' && key !== 'wishes' && !validDay(r.date)) {
          var d = r.updatedAt ? new Date(r.updatedAt) : new Date(anchor);
          d.setDate(d.getDate() + (r.day || 0));
          r.date = isoDay(d);
        }
        if (key === 'todos' && !validDay(r.dueDate) && (r.when === '今天' || r.when === '明天')) {
          var due = new Date(anchor);
          due.setDate(due.getDate() + (r.when === '明天' ? 1 : 0));
          r.dueDate = isoDay(due);
        }
      });
    });
    data.auth = data.auth || { accounts: [], currentId: null };
    data.auth.accounts = records(data.auth.accounts || []);
    if (data.auth.accounts.some(function (a) { return !a.name || !a.salt || !a.hash; })) throw new Error('INVALID_DATA');
    var saving = data.saving || {};
    data.saving = { goal: money(saving.goal) || 20000, updatedAt: Number(saving.updatedAt) || 0, saved: 0 };
    recalculateSavings(data);
    return data;
  }

  function recalculateSavings(data) {
    var logs = (data.savingsLog || []).filter(function (l) { return !l.deleted; });
    data.saving.saved = Math.round(logs.reduce(function (s, l) { return s + (l.amount || 0); }, 0) * 100) / 100;
    (data.wishes || []).forEach(function (w) {
      var total = logs.filter(function (l) { return l.wishId === w.id; })
        .reduce(function (s, l) { return s + (l.amount || 0); }, 0);
      if (w.savedBase === undefined) w.savedBase = Math.max(0, (w.saved || 0) - total);
      w.saved = Math.round((w.savedBase + total) * 100) / 100;
      w.status = w.target > 0 && w.saved >= w.target ? '已完成'
        : w.saved > 0 || w.status === '已完成' ? '进行中' : (w.status || '等你一起商量');
    });
  }

  /* ------------------------------------------------------------ 账号密码 */

  var EMOJIS = ['🍀', '🍑', '🌻', '🐣', '🌙', '🐳', '🍓', '🐰'];

  var authDraft = {
    slots: [
      { name: '', emoji: EMOJIS[0], pw: '' },
      { name: '', emoji: EMOJIS[1], pw: '' }
    ],
    pickId: null
  };

  function toHex(buf) {
    var out = '';
    var bytes = new Uint8Array(buf);
    for (var i = 0; i < bytes.length; i++) out += ('0' + bytes[i].toString(16)).slice(-2);
    return out;
  }

  function randomSalt() {
    var arr = new Uint8Array(8);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(arr);
    } else {
      for (var i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
    }
    return toHex(arr.buffer);
  }

  // 密码只在这台设备上校验：加盐后做 SHA-256，明文不落盘。
  // 若浏览器不提供 SubtleCrypto（例如用非本机的 http 地址打开），退化成弱校验，并明确告知。
  function hashPassword(password, salt) {
    var data = salt + '::' + password;
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(data)).then(toHex);
    }
    var h = 5381;
    for (var i = 0; i < data.length; i++) h = ((h << 5) + h + data.charCodeAt(i)) >>> 0;
    return Promise.resolve('weak-' + h.toString(16));
  }

  /* ------------------------------------------------------------ 初始数据 */

  function seed() {
    return {
      view: 'overview',
      auth: { accounts: [], currentId: null },
      todos: [], ledger: [], wishes: [], savingsLog: [], moods: [], posts: [], comments: [],
      saving: { goal: 20000, saved: 0, updatedAt: 0 }
    };
  }

  var MOODS = [
    { emoji: '😄', label: '开心' },
    { emoji: '🙂', label: '平静' },
    { emoji: '🥰', label: '想你' },
    { emoji: '😔', label: '低落' },
    { emoji: '😤', label: '有点气' },
    { emoji: '😴', label: '累了' }
  ];

  /* ------------------------------------------------------------ 读写状态 */

  var state = loadState();

  function loadState() {
    var base = seed();
    try {
      var raw = localStorage.getItem(CONFIG.storageKey);
      if (!raw) return base;
      var saved = normalizeData(JSON.parse(raw));
      Object.keys(saved).forEach(function (k) {
        if (saved[k] !== undefined && saved[k] !== null) base[k] = saved[k];
      });
      try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(base)); } catch (err) { /* 保存时会再提示 */ }
    } catch (err) {
      if (window.console) console.warn('本地数据读取失败，原始文件仍保留。', err);
      // 不自动覆盖损坏的原始数据，留出导出或人工恢复的机会。
      setTimeout(function () { window.alert('本机记录读取失败。请先备份浏览器中的原始数据，再重新载入；当前页面已停止保存和同步。'); }, 0);
      base.readError = true;
    }
    return base;
  }

  function saveState() {
    if (state.readError) { toast('本机数据读取失败，请先备份恢复。'); return; }
    recalculateSavings(state);
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
    } catch (err) {
      if (window.console) console.warn('本地数据保存失败。', err);
      toast('本机保存失败（空间不足或浏览器限制），请立即导出备份。');
    }
    markDirty();
  }

  /* ------------------------------------------------------------ 同步 */

  var SYNC = {
    enabled: false,
    ready: false,        // 是否已经和服务端核对过一次
    autoOk: false,       // 「跟随本页」时同源到底有没有 server.py
    lastError: '',       // 最近一次同步失败的原因，方便排查
    fails: 0,            // 连续失败次数（用于退避）
    nextTry: 0,          // 下一次允许重试的时间戳
    status: 'local',     // local | syncing | ok | offline | needtoken | badkey
    rev: 0,
    dirty: false,
    busy: false,
    timer: null,
    timer2: null,
    token: '',
    snapshot: null,      // 上一次确认「服务端已经拿到」的数据快照
    lastAt: 0,
    cfg: null,
    epoch: 0,
    verified: false
  };

  var CLIENT_ID = uid('c');

  /* ------------------------------------------- 同步后端配置（每台设备各存各的） */

  var SYNC_CFG_KEY = CONFIG.storageKey + ':sync';

  function defaultSyncCfg() {
    return { mode: 'auto', url: '', token: '', sbUrl: '', sbKey: '', pass: '', accessToken: '' };
  }

  function loadSyncCfg() {
    var out = defaultSyncCfg();
    try {
      var raw = localStorage.getItem(SYNC_CFG_KEY);
      if (!raw) return out;
      var cfg = JSON.parse(raw);
      Object.keys(out).forEach(function (k) {
        if (typeof cfg[k] === 'string') out[k] = cfg[k];
      });
      if (typeof cfg.mode === 'string') out.mode = cfg.mode;
    } catch (err) { /* 用默认值 */ }
    return out;
  }

  function saveSyncCfg(cfg) {
    try {
      localStorage.setItem(SYNC_CFG_KEY, JSON.stringify(cfg));
    } catch (err) {
      if (window.console) console.warn('同步设置保存失败。', err);
    }
  }

  function trimSlashes(url) {
    return String(url || '').replace(/\/+$/, '');
  }

  // auto：只有确认同源真的跑着 server.py 才用；静态托管上不会误判成"离线"
  // server：自己填一个地址（VPS、内网穿透都算）
  // supabase：免费云数据库，电脑不用开
  function activeMode(settings) {
    var cfg = settings || SYNC.cfg || defaultSyncCfg();
    if (cfg.mode === 'off') return 'off';
    if (cfg.mode === 'supabase') {
      return (cfg.sbUrl && cfg.sbKey && cfg.pass) ? 'supabase' : 'off';
    }
    if (cfg.mode === 'server') return cfg.url ? 'server' : 'off';
    return SYNC.autoOk ? 'server' : 'off';
  }

  function apiPath(settings) {
    var cfg = settings || SYNC.cfg || defaultSyncCfg();
    if (cfg.mode === 'server' && cfg.url) return trimSlashes(cfg.url) + '/api/state';
    return 'api/state';
  }

  /* --------------------------------------------------- 加密（Supabase 专用） */

  function sbReady() {
    return !!(window.crypto && window.crypto.subtle && window.TextEncoder);
  }

  // 空间 ID 只当行的主键用，不由它承担保密职责（保密靠 AES-GCM）
  function fnv1a(text) {
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ('0000000' + h.toString(16)).slice(-8);
  }

  function sbSpaceId(settings) {
    var cfg = settings || SYNC.cfg || defaultSyncCfg();
    var seed = trimSlashes(cfg.sbUrl) + '|' + cfg.pass;
    return 'space-' + fnv1a(seed) + fnv1a(seed.split('').reverse().join(''));
  }

  function bytesToB64(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }

  function b64ToBytes(text) {
    var raw = atob(text);
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  var sbKeyCache = null;

  function deriveKey(pass, space) {
    var identity = pass + '\n' + space;
    if (sbKeyCache && sbKeyCache.identity === identity) return sbKeyCache.promise;
    var promise = window.crypto.subtle.importKey(
      'raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']
    ).then(function (base) {
      return window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: new TextEncoder().encode(space), iterations: 150000, hash: 'SHA-256' },
        base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
      );
    });
    sbKeyCache = { identity: identity, promise: promise };
    return promise;
  }

  function encryptJson(obj, settings) {
    var cfg = settings || SYNC.cfg;
    return deriveKey(cfg.pass, sbSpaceId(cfg)).then(function (key) {
      var iv = window.crypto.getRandomValues(new Uint8Array(12));
      return window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv }, key, new TextEncoder().encode(JSON.stringify(obj))
      ).then(function (buf) {
        return bytesToB64(iv) + '.' + bytesToB64(new Uint8Array(buf));
      });
    });
  }

  function decryptJson(text, settings) {
    var cfg = settings || SYNC.cfg;
    var parts = String(text || '').split('.');
    if (parts.length !== 2) return Promise.reject(new Error('DECRYPT_FORMAT'));
    return deriveKey(cfg.pass, sbSpaceId(cfg)).then(function (key) {
      return window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: b64ToBytes(parts[0]) }, key, b64ToBytes(parts[1])
      ).then(function (buf) {
        return JSON.parse(new TextDecoder().decode(buf));
      }).catch(function () {
        throw new Error('DECRYPT_FAILED');
      });
    });
  }

  /* --------------------------------------------------------- 两个后端适配 */

  function jsonOrThrow(res) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('NEED_TOKEN');
    }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  // 带超时的 fetch：网络被墙/丢包时 fetch 会一直挂着不返回，
  // 没有这个保护界面就会永远停在「同步中」，而且不会再重试。
  function fetchWithTimeout(url, options, ms) {
    var opts = Object.assign({}, options || {});
    var limit = ms || 12000;
    if (typeof AbortController === 'undefined') return fetch(url, opts);
    var ctrl = new AbortController();
    var timer = setTimeout(function () {
      try { ctrl.abort(); } catch (e) { /* 忽略 */ }
    }, limit);
    opts.signal = ctrl.signal;
    if (!opts.cache) opts.cache = 'no-store';
    return fetch(url, opts).then(function (res) {
      // 超时覆盖响应体下载，避免收到响应头后仍无限等待 JSON。
      return res.text().then(function (body) {
        return new Response([204, 205, 304].indexOf(res.status) >= 0 ? null : body,
          { status: res.status, statusText: res.statusText, headers: res.headers });
      });
    }).then(function (res) {
      clearTimeout(timer);
      return res;
    }, function (err) {
      clearTimeout(timer);
      if (err && (err.name === 'AbortError' || String(err).toLowerCase().indexOf('abort') >= 0)) {
        throw new Error('TIMEOUT');
      }
      throw err;
    });
  }

  function sbHeaders(extra, settings) {
    var cfg = settings || SYNC.cfg;
    var head = { apikey: cfg.sbKey, Accept: 'application/json' };
    // 新 publishable key 不是 JWT；只有旧 anon JWT 才可放在 Bearer 中。
    if (cfg.sbKey && cfg.sbKey.indexOf('eyJ') === 0) head.Authorization = 'Bearer ' + cfg.sbKey;
    if (cfg.accessToken) head['X-Space-Token'] = cfg.accessToken;
    if (extra) Object.keys(extra).forEach(function (k) { head[k] = extra[k]; });
    return head;
  }

  function apiPull(force, settings, revision) {
    var cfg = settings || SYNC.cfg;
    var rev = revision === undefined ? SYNC.rev : revision;
    if (activeMode(cfg) === 'supabase') return sbPull(force, cfg, rev);
    return fetchWithTimeout(apiPath(cfg) + '?since=' + (force ? 0 : rev), {
      cache: 'no-store',
      headers: syncHeaders(null, cfg.token || SYNC.token)
    }).then(jsonOrThrow).then(function (res) {
      if (res.unchanged) return { unchanged: true, rev: res.rev };
      return { rev: res.rev || 0, data: res.data };
    });
  }

  function apiPush(epoch) {
    var cfg = Object.assign({}, SYNC.cfg);
    if (activeMode(cfg) === 'supabase') return sbPush(cfg, epoch);
    var snapshot = JSON.stringify(syncedPayload());
    return fetchWithTimeout(apiPath(cfg), {
      method: 'POST', cache: 'no-store',
      headers: syncHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ data: JSON.parse(snapshot), client: CLIENT_ID })
    }).then(jsonOrThrow).then(function (res) {
      return { rev: res.rev || 0, data: res.data, snapshot: snapshot };
    });
  }

  function sbPull(force, settings, revision) {
    var cfg = settings || SYNC.cfg;
    var rev = revision === undefined ? SYNC.rev : revision;
    var table = trimSlashes(cfg.sbUrl) + '/rest/v1/little_days' +
      '?id=eq.' + encodeURIComponent(sbSpaceId(cfg)) + '&select=rev,payload';
    return fetchWithTimeout(table, { cache: 'no-store', headers: sbHeaders(null, cfg) })
      .then(jsonOrThrow).then(function (rows) {
        if (!Array.isArray(rows) || rows.length > 1) throw new Error('INVALID_DATA');
        if (!rows.length) return { rev: 0, data: null };
        var row = rows[0];
        if (!Number.isSafeInteger(row.rev) || row.rev < 0) throw new Error('INVALID_DATA');
        if (!force && row.rev === rev) return { unchanged: true, rev: row.rev };
        return decryptJson(row.payload, cfg).then(function (data) {
          return { rev: row.rev, data: normalizeData(data) };
        });
      });
  }

  function tokenHash(token) {
    return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)).then(toHex);
  }

  function sbPush(cfg, epoch) {
    // 先合并另一台设备的新记录。PATCH 的版本条件使并发写入只能有一个成功。
    return sbPull(true, cfg).then(function (latest) {
      if (epoch !== SYNC.epoch) throw new Error('STALE_SYNC');
      if (latest.data) applyRemote(latest.data);
      var snapshot = JSON.stringify(syncedPayload());
      return Promise.all([encryptJson(JSON.parse(snapshot), cfg),
        cfg.accessToken ? tokenHash(cfg.accessToken) : Promise.resolve(null)]).then(function (values) {
        if (epoch !== SYNC.epoch) throw new Error('STALE_SYNC');
        var row = {
          id: sbSpaceId(cfg), rev: latest.rev + 1, payload: values[0],
          updated_at: new Date().toISOString()
        };
        if (values[1]) row.access_token_hash = values[1];
        var url = trimSlashes(cfg.sbUrl) + '/rest/v1/little_days';
        if (latest.data) url += '?id=eq.' + encodeURIComponent(row.id) + '&rev=eq.' + latest.rev;
        return fetchWithTimeout(url, {
          method: latest.data ? 'PATCH' : 'POST', cache: 'no-store',
          headers: sbHeaders({ 'Content-Type': 'application/json', Prefer: 'return=representation' }, cfg),
          body: JSON.stringify(row)
        }).then(function (res) {
          if (res.status === 409) {
            // RLS 隐藏已有行时也会返回空列表；不能把错误访问密钥误认成新空间。
            return sbPull(true, cfg).then(function (current) {
              throw new Error(current.data ? 'SYNC_CONFLICT' : 'NEED_TOKEN');
            });
          }
          return jsonOrThrow(res);
        }).then(function (rows) {
          if (!Array.isArray(rows) || rows.length !== 1 || rows[0].rev !== row.rev) throw new Error('SYNC_CONFLICT');
          return { rev: row.rev, snapshot: snapshot };
        });
      });
    });
  }

  // 参与同步的内容：记录 + 账号；不含「我是谁」「当前页面」这些每台设备自己的状态
  function syncedPayload(source) {
    var data = source || state;
    var payload = {
      todos: data.todos,
      ledger: data.ledger,
      wishes: data.wishes,
      saving: data.saving,
      savingsLog: data.savingsLog,
      moods: data.moods,
      posts: data.posts,
      comments: data.comments,
      auth: { accounts: data.auth.accounts }
    };
    // 顺序不代表变更，统一快照顺序，避免两台设备反复互相上传同一批记录。
    LIST_KEYS.forEach(function (key) {
      payload[key] = payload[key].slice().sort(function (a, b) { return String(a.id).localeCompare(String(b.id)); });
    });
    function canonical(value) {
      if (Array.isArray(value)) return value.map(canonical);
      if (!value || typeof value !== 'object') return value;
      var out = Object.create(null);
      Object.keys(value).sort().forEach(function (k) { out[k] = canonical(value[k]); });
      return out;
    }
    return canonical(payload);
  }

  function mergeList(a, b) {
    var byId = Object.create(null);
    var order = [];
    [a || [], b || []].forEach(function (src) {
      src.forEach(function (rec) {
        if (!rec || rec.id === undefined) return;
        var prev = byId[rec.id];
        if (!prev) {
          byId[rec.id] = rec;
          order.push(rec.id);
        } else if ((rec.updatedAt || 0) > (prev.updatedAt || 0) ||
          ((rec.updatedAt || 0) === (prev.updatedAt || 0) &&
            (rec.deleted && !prev.deleted || !!rec.deleted === !!prev.deleted && JSON.stringify(rec) > JSON.stringify(prev)))) {
          byId[rec.id] = rec;
        }
      });
    });
    return order.map(function (id) { return byId[id]; });
  }

  // 不同记录按 id 合并；同一记录采用 updatedAt 较新的版本。
  function mergeStates(local, remote) {
    if (!remote) return local;
    remote = normalizeData(remote);
    var logs = mergeList(local.savingsLog, remote.savingsLog);
    var liveLogs = logs.filter(function (l) { return !l.deleted; });
    var localAuth = local.auth || {};
    var remoteAuth = remote.auth || {};
    var mergedAccounts = mergeList(remoteAuth.accounts, localAuth.accounts);
    if (mergedAccounts.length > 2) throw new Error('ACCOUNT_CONFLICT');
    var localSaving = local.saving || {};
    var remoteSaving = remote.saving || {};
    var goalSource = (localSaving.updatedAt || 0) > (remoteSaving.updatedAt || 0)
      ? localSaving : (localSaving.updatedAt || 0) < (remoteSaving.updatedAt || 0)
        ? remoteSaving : ((localSaving.goal || 0) > (remoteSaving.goal || 0) ? localSaving : remoteSaving);
    var out = {
      view: local.view,
      auth: {
        accounts: mergedAccounts,
        currentId: localAuth.currentId || null      // 登录身份只属于这台设备
      },
      todos: mergeList(local.todos, remote.todos),
      ledger: mergeList(local.ledger, remote.ledger),
      wishes: mergeList(local.wishes, remote.wishes),
      savingsLog: logs,
      moods: mergeList(local.moods, remote.moods),
      posts: mergeList(local.posts, remote.posts),
      comments: mergeList(local.comments, remote.comments),
      saving: {
        goal: goalSource.goal || 20000,
        updatedAt: goalSource.updatedAt || 0,
        saved: liveLogs.reduce(function (s, l) { return s + (l.amount || 0); }, 0)
      }
    };
    recalculateSavings(out);
    return out;
  }

  function readToken() {
    try {
      var fromUrl = new URLSearchParams(location.search).get('token');
      if (fromUrl) {
        localStorage.setItem(CONFIG.storageKey + ':token', fromUrl);
        return fromUrl;
      }
      return localStorage.getItem(CONFIG.storageKey + ':token') || '';
    } catch (err) {
      return '';
    }
  }

  function syncHeaders(extra, token) {
    var head = Object.assign({}, extra || {});
    if (token || SYNC.token) head['X-Sync-Token'] = token || SYNC.token;
    return head;
  }

  function setSyncStatus(status) {
    if (SYNC.status === status) return;
    SYNC.status = status;
    updateSyncChip();
  }

  function syncInit() {
    var epoch = ++SYNC.epoch;
    if (SYNC.timer2) clearTimeout(SYNC.timer2);
    SYNC.cfg = loadSyncCfg();
    SYNC.token = SYNC.cfg.token || readToken();
    SYNC.ready = false;
    SYNC.verified = false;
    SYNC.rev = 0;
    SYNC.snapshot = null;
    SYNC.dirty = false;
    SYNC.busy = false;
    SYNC.enabled = false;
    SYNC.autoOk = false;
    SYNC.lastError = '';
    SYNC.fails = 0;
    SYNC.nextTry = 0;
    if (state.readError) { setSyncStatus('dataerror'); return; }

    if (SYNC.cfg.mode === 'auto' && /^https?:$/.test(location.protocol)) {
      setSyncStatus('local');
      // GitHub Pages 没有自建 API，不必每次发送一个必然 404 的请求。
      if (/\.github\.io$/i.test(location.hostname)) return;
      fetchWithTimeout('api/ping', { cache: 'no-store' }, 5000)
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (res) {
          if (epoch !== SYNC.epoch) return;
          SYNC.autoOk = !!(res && res.ok);
          if (SYNC.autoOk) startSync();
        }).catch(function () { /* 没有同源服务，保留本机模式 */ });
      return;
    }
    startSync();
  }

  function startSync() {
    SYNC.enabled = activeMode() !== 'off';
    if (!SYNC.enabled) { setSyncStatus('local'); return; }
    setSyncStatus('syncing');
    if (!SYNC.timer) {
      SYNC.timer = setInterval(tick, 5000);
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) tick();
      });
      window.addEventListener('online', function () { SYNC.nextTry = 0; tick(); });
    }
    pull(true);
  }

  function syncBlocked() {
    return ['badkey', 'needtoken', 'dataerror', 'accountconflict'].indexOf(SYNC.status) >= 0;
  }

  function tick() {
    if (!SYNC.enabled || SYNC.busy || document.hidden || syncBlocked()) return;
    if (Date.now() < SYNC.nextTry) return;
    // 初次读取没有成功，绝不能直接拿本机内容覆盖云端。
    if (!SYNC.verified) { pull(true); return; }
    if (JSON.stringify(syncedPayload()) !== SYNC.snapshot) { push(); return; }
    pull(false);
  }

  function beginSync() {
    if (SYNC.status !== 'offline') setSyncStatus('syncing');
  }

  function handleSyncError(err) {
    var code = String(err && err.message ? err.message : err);
    var friendly = code;
    if (code === 'TIMEOUT') friendly = '请求超时，请检查网络后重试';
    else if (/failed to fetch|networkerror|load failed|abort/i.test(code)) friendly = '暂时连不上服务器';
    else if (/^HTTP 5\d\d$/.test(code)) friendly = '云端出错（' + code + '），稍后自动重试';
    else if (code === 'SYNC_CONFLICT') friendly = '另一台设备刚保存了内容，正在等待合并重试';
    else if (code === 'ACCOUNT_CONFLICT') friendly = '本机和云端存在不同的账号。请先导出本机备份，再清空本机并重新连接已有空间';
    else if (code === 'INVALID_DATA') friendly = '记录格式异常，已停止自动上传，请先导出备份';
    else if (code === 'NEED_TOKEN') friendly = '请检查 API key、空间访问密钥及 Supabase 权限策略';
    SYNC.lastError = friendly;
    SYNC.fails += 1;
    SYNC.nextTry = Date.now() + Math.min(60000, 5000 * Math.pow(2, Math.min(SYNC.fails - 1, 4)));
    if (code === 'DECRYPT_FAILED' || code === 'DECRYPT_FORMAT') setSyncStatus('badkey');
    else if (code === 'NEED_TOKEN') setSyncStatus('needtoken');
    else if (code === 'INVALID_DATA') setSyncStatus('dataerror');
    else if (code === 'ACCOUNT_CONFLICT') setSyncStatus('accountconflict');
    else setSyncStatus('offline');
    updateSyncChip();
  }

  function syncSucceeded() {
    SYNC.fails = 0;
    SYNC.nextTry = 0;
    SYNC.lastError = '';
    SYNC.lastAt = Date.now();
    SYNC.dirty = JSON.stringify(syncedPayload()) !== SYNC.snapshot;
    setSyncStatus(SYNC.dirty ? 'syncing' : 'ok');
    if (SYNC.dirty) {
      if (SYNC.timer2) clearTimeout(SYNC.timer2);
      SYNC.timer2 = setTimeout(tick, 500);
    }
  }

  function pull(force) {
    if (!SYNC.enabled || SYNC.busy || syncBlocked()) return;
    var epoch = SYNC.epoch;
    SYNC.busy = true;
    return apiPull(force).then(function (res) {
      if (epoch !== SYNC.epoch) return;
      var first = !SYNC.ready;
      if (!res.unchanged) {
        SYNC.rev = res.rev || 0;
        if (res.data) applyRemote(res.data);
        SYNC.snapshot = res.data ? JSON.stringify(syncedPayload(normalizeData(res.data))) : '';
      }
      SYNC.verified = true;
      SYNC.ready = true;
      SYNC.busy = false;
      syncSucceeded();
      if (first) safeRender();
    }).catch(function (err) {
      if (epoch !== SYNC.epoch) return;
      SYNC.busy = false;
      var firstFail = !SYNC.ready;
      SYNC.ready = true;
      handleSyncError(err);
      if (firstFail) safeRender();
    });
  }

  function push() {
    if (!SYNC.enabled || syncBlocked()) return;
    if (!SYNC.verified) return pull(true);
    if (SYNC.busy) { SYNC.dirty = true; return; }
    var epoch = SYNC.epoch;
    SYNC.busy = true;
    beginSync();
    return apiPush(epoch).then(function (res) {
      if (epoch !== SYNC.epoch) return;
      SYNC.rev = res.rev || 0;
      if (res.data) applyRemote(res.data);
      // 必须记住实际发出的快照，不能把请求期间的新编辑也算成已上传。
      SYNC.snapshot = res.snapshot;
      SYNC.busy = false;
      syncSucceeded();
    }).catch(function (err) {
      if (epoch !== SYNC.epoch) return;
      SYNC.busy = false;
      SYNC.dirty = true;
      handleSyncError(err);
    });
  }

  function markDirty() {
    if (!SYNC.enabled || syncBlocked()) return;
    if (JSON.stringify(syncedPayload()) === SYNC.snapshot) return;
    SYNC.dirty = true;
    if (SYNC.timer2) clearTimeout(SYNC.timer2);
    SYNC.timer2 = setTimeout(tick, 500);
  }

  function applyRemote(remote) {
    if (!remote) return;
    var before = JSON.stringify(syncedPayload());
    state = mergeStates(state, remote);
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
    } catch (err) { /* 忽略 */ }
    if (JSON.stringify(syncedPayload()) !== before) safeRender();
  }

  var pendingRender = false;

  // 用户正在输入时不要重画（否则会丢焦点）
  function safeRender() {
    var ae = document.activeElement;
    var view = document.getElementById('view');
    if (document.querySelector('.modal') || ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) {
      pendingRender = true;
      return;
    }
    var drafts = [];
    if (view) view.querySelectorAll('input:not([type="file"]), textarea, select').forEach(function (el) {
      drafts.push({ id: el.id, post: el.dataset.post, enter: el.dataset.enter, value: el.value });
    });
    pendingRender = false;
    render();
    drafts.forEach(function (d) {
      var el = d.id ? document.getElementById(d.id) : document.querySelector('[data-post="' + d.post + '"][data-enter="' + d.enter + '"]');
      if (el) el.value = d.value;
    });
    renderPendingImages();
  }

  function syncChip() {
    var labels = {
      local: '仅本机',
      syncing: '同步中',
      ok: '已同步',
      offline: '离线 · 待同步',
      needtoken: '需要口令',
      badkey: '口令不对',
      dataerror: '数据需检查',
      accountconflict: '账号冲突'
    };
    var tips = {
      local: '数据只存在这台设备上。想让手机也能一起编辑，点「同步设置」接上云。',
      syncing: '正在和同步服务交换数据…',
      ok: '本机改动已确认保存到云端，另一台设备联网后会自动获取。',
      offline: '连不上同步服务，改动先存在本机，恢复后会自动补上。',
      needtoken: '服务端要求访问口令，请到「同步设置」里填写。',
      badkey: '同步口令不对，解不开云端数据（没有覆盖云端）。',
      dataerror: '数据格式异常，已停止上传。请先导出备份。',
      accountconflict: '本机和云端账号不同，已停止上传。请先导出备份。'
    };
    var s = SYNC.status;
    return '<span class="sync-chip ' + s + '" title="' + (tips[s] || '') + '">' +
      '<i class="sync-dot"></i>' + (labels[s] || '仅本机') + '</span>';
  }

  function syncHint() {
    var hints = {
      local: '现在数据只保存在这台设备上。点「同步设置」接上云，两台手机就能看到同一份记录。',
      syncing: '正在同步…',
      ok: '本机改动已保存到云端，另一台设备联网后会自动获取。',
      offline: '暂时连不上云端' + (SYNC.lastError ? '（' + SYNC.lastError + '）' : '') + '，改动已经存在本机，恢复后会自动补上去。',
      needtoken: '服务端要求访问口令：到「同步设置」里填上。',
      badkey: '同步口令不对，云端的数据解不开，已经停止上传。',
      dataerror: SYNC.lastError || '数据格式异常，已停止同步，请先备份。',
      accountconflict: SYNC.lastError || '账号冲突，请先导出本机备份。'
    };
    return hints[SYNC.status] || hints.local;
  }

  function updateSyncChip() {
    var nodes = document.querySelectorAll('.sync-chip');
    for (var i = 0; i < nodes.length; i++) {
      var box = document.createElement('div');
      box.innerHTML = syncChip();
      if (nodes[i].parentNode) nodes[i].parentNode.replaceChild(box.firstChild, nodes[i]);
    }
    var hint = document.getElementById('sync-hint');
    if (hint) hint.textContent = syncHint();
    var summary = document.getElementById('overview-sync-hint');
    if (summary) summary.textContent = SYNC.enabled ? syncHint() : '从今天起，把值得记住的小事写在这里。';
  }

  function importRecords() {
    var picker = document.createElement('input');
    picker.type = 'file';
    picker.accept = 'application/json,.json';
    picker.addEventListener('change', function () {
      var file = picker.files && picker.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var raw = JSON.parse(String(reader.result));
          if (!LIST_KEYS.some(function (k) { return Object.prototype.hasOwnProperty.call(raw, k); })) throw new Error('INVALID_DATA');
          var data = normalizeData(raw);
          var before = JSON.stringify(syncedPayload());
          state = mergeStates(state, data);
          saveState();
          render();
          toast(JSON.stringify(syncedPayload()) === before
            ? '这个文件和现在的记录是一样的。'
            : '已经并进来了，重复的不会重复算。');
        } catch (err) {
          toast(err.message === 'ACCOUNT_CONFLICT' ? '备份属于另一套账号，未导入。请使用同一空间的备份。' : '文件格式不正确，原来的记录没有改动。');
        }
      };
      reader.readAsText(file);
    });
    picker.click();
  }

  /* --------------------------------------------------------- 同步设置面板 */

  var syncDraft = null;

  var SUPABASE_SQL = "-- 两人小日子：新项目建表 / 可选的空间权限升级（整段执行）\n-- 已有空间：先导出 JSON；备份 Project URL、原同步口令。\n-- 两台设备更新网页，并配置相同的随机访问密钥（至少 24 位）。\n-- 本表应专用于本站；脚本会替换该表的全部 RLS 策略。\nbegin;\n\ncreate table if not exists public.little_days (\n  id text primary key,\n  rev bigint not null default 0,\n  payload text not null,\n  updated_at timestamptz not null default now(),\n  access_token_hash text\n);\nalter table public.little_days add column if not exists access_token_hash text;\n\n-- 已有空间必须取消下面两行的注释，替换密钥和空间 ID 后一起执行。\n-- update public.little_days set access_token_hash =\n--   encode(sha256(convert_to('替换成你生成的空间访问密钥', 'UTF8')), 'hex') where id = '替换成同步设置中显示的空间ID';\n\n-- 防止直接运行后把已有空间锁住；出错会回滚整段脚本。\ndo $$\nbegin\n  if exists (select 1 from public.little_days where access_token_hash is null) then\n    raise exception '已有空间尚未设置访问密钥：请先填写上面的 UPDATE，并为表中每个空间设置密钥。';\n  end if;\nend $$;\n\nalter table public.little_days enable row level security;\ndo $$\ndeclare p record;\nbegin\n  for p in select policyname from pg_policies\n    where schemaname = 'public' and tablename = 'little_days'\n  loop\n    execute format('drop policy %I on public.little_days', p.policyname);\n  end loop;\nend $$;\n\ncreate policy \"little_days scoped access\" on public.little_days\nfor all to anon\nusing (\n  length(coalesce(current_setting('request.headers', true)::json->>'x-space-token', '')) >= 24\n  and access_token_hash = encode(sha256(convert_to(\n    coalesce(current_setting('request.headers', true)::json->>'x-space-token', ''), 'UTF8')), 'hex')\n)\nwith check (\n  length(coalesce(current_setting('request.headers', true)::json->>'x-space-token', '')) >= 24\n  and access_token_hash = encode(sha256(convert_to(\n    coalesce(current_setting('request.headers', true)::json->>'x-space-token', ''), 'UTF8')), 'hex')\n);\nrevoke all on public.little_days from anon;\ngrant select, insert, update on public.little_days to anon;\ncommit;\n";

  var MEDIA_SQL = "-- 可选：先完成 supabase-security.sql，再配置图片桶。\n-- 图片通过公开 URL 展示，没有加密；本脚本仅收紧上传与对象列表权限。\nbegin;\ninsert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)\nvalues ('media', 'media', true, 2097152, array['image/jpeg'])\non conflict (id) do update set public = true, file_size_limit = 2097152,\n  allowed_mime_types = array['image/jpeg'];\n\ndrop policy if exists \"media upload\" on storage.objects;\ndrop policy if exists \"media read\" on storage.objects;\ncreate policy \"media upload\" on storage.objects\nfor insert to anon with check (\n  bucket_id = 'media'\n  and exists (\n    select 1 from public.little_days as room\n    where room.id = (storage.foldername(name))[1]\n      and room.access_token_hash = encode(sha256(convert_to(\n        coalesce(current_setting('request.headers', true)::json->>'x-space-token', ''), 'UTF8')), 'hex')\n  )\n);\ncreate policy \"media read\" on storage.objects\nfor select to anon using (\n  bucket_id = 'media'\n  and exists (\n    select 1 from public.little_days as room\n    where room.id = (storage.foldername(name))[1]\n      and room.access_token_hash = encode(sha256(convert_to(\n        coalesce(current_setting('request.headers', true)::json->>'x-space-token', ''), 'UTF8')), 'hex')\n  )\n);\ncommit;\n";

  function openSyncModal() {
    syncDraft = Object.assign({}, SYNC.cfg || loadSyncCfg());
    renderSyncModal();
  }

  function captureSyncForm() {
    if (!syncDraft) return;
    var nodes = document.querySelectorAll('[data-cfg]');
    for (var i = 0; i < nodes.length; i++) syncDraft[nodes[i].dataset.cfg] = nodes[i].value.trim();
  }

  function syncModeBtn(mode, label) {
    return '<button class="seg-btn' + (syncDraft.mode === mode ? ' on' : '') + '"' +
      ' data-action="sync-mode" data-mode="' + mode + '">' + label + '</button>';
  }

  function syncFields() {
    if (syncDraft.mode === 'server') {
      return '<div class="field"><label for="sync-url">服务地址</label>' +
          '<input class="input" id="sync-url" data-cfg="url" value="' + esc(syncDraft.url) +
          '" placeholder="https://你的地址（留空＝跟随本页）" /></div>' +
        '<div class="field" style="margin-bottom:0"><label for="sync-token">访问口令（服务端设了才填）</label>' +
          '<input class="input" id="sync-token" data-cfg="token" value="' + esc(syncDraft.token) +
          '" placeholder="没有就留空" /></div>';
    }
    if (syncDraft.mode === 'supabase') {
      return '<div class="field"><label for="sync-sburl">Project URL</label>' +
          '<input class="input" id="sync-sburl" data-cfg="sbUrl" value="' + esc(syncDraft.sbUrl) +
          '" placeholder="https://xxxxxxxx.supabase.co" /></div>' +
        '<div class="field"><label for="sync-sbkey">publishable key 或 anon public key</label>' +
          '<input class="input" id="sync-sbkey" data-cfg="sbKey" value="' + esc(syncDraft.sbKey) +
          '" placeholder="eyJhbGciOiJIUzI1NiIs..." /></div>' +
        '<div class="field" style="margin-bottom:0"><label for="sync-pass">同步口令（两台设备必须一样）</label>' +
          '<input class="input" id="sync-pass" type="password" data-cfg="pass" value="' + esc(syncDraft.pass) +
          '" placeholder="建议 16 位以上；已有空间请保持原口令" /></div>' +
        '<div class="field"><label for="sync-access">空间访问密钥（启用权限升级后必填）</label>' +
          '<input class="input" id="sync-access" type="password" autocomplete="off" data-cfg="accessToken" value="' + esc(syncDraft.accessToken || '') + '" placeholder="两台设备一致，至少 24 位；旧项目可留空" />' +
          '<button class="auth-link" data-action="generate-access-token">生成随机访问密钥</button></div>' +
        '<p class="dim">当前空间 ID：<code>' + esc(sbSpaceId(syncDraft)) + '</code>（权限迁移时使用）</p>' +
        '<div class="sync-note">' +
          '<details class="sync-help">' +
            '<summary>怎么搭？点开看步骤和要复制的 SQL</summary>' +
            '<div class="sync-help-body">' +
              '<p>新项目：先填 URL、公开 API key、同步口令和随机访问密钥，再运行下面的 SQL。已有项目请先导出备份，按 SQL 注释填写 UPDATE，为原空间设置访问密钥后再运行。两台设备都要更新配置。</p>' +
              '<pre class="sql" id="sync-sql">' + esc(SUPABASE_SQL) + '</pre>' +
              '<button class="btn btn-ghost btn-copy" data-action="copy-sql">' + icon('check', 14) + '复制这段 SQL</button>' +
            '</div>' +
          '</details>' +
          '<p class="dim">文字记录上传前会加密。新项目请填写空间访问密钥；已有项目先按更新说明迁移权限。修改同步口令会切换到另一个空间，不是修改登录密码。</p>' +
        '</div>' +
        '<div class="sync-note">' +
          '<details class="sync-help">' +
            '<summary>想让「说说」能发图片？点开跑这段 SQL</summary>' +
            '<div class="sync-help-body">' +
              '<p><b>先完成上面的空间权限配置并保存一次记录，再运行这段。</b>建立公开的 <b>media</b> 桶，上传需要空间访问密钥。' +
              '图片压缩后传到 Supabase Storage，帖子里只存链接。图片没有加密，知道图片链接的人可以查看，请自行决定是否使用公开图片桶。</p>' +
              '<pre class="sql" id="media-sql">' + esc(MEDIA_SQL) + '</pre>' +
              '<button class="btn btn-ghost btn-copy" data-action="copy-media-sql">' + icon('check', 14) + '复制图片用 SQL</button>' +
            '</div>' +
          '</details>' +
        '</div>';
    }
    if (syncDraft.mode === 'auto') {
      return '<p class="sync-hint">适合「页面本身就是从 server.py 打开的」这种情况，不用填地址。</p>';
    }
    return '<p class="sync-hint">只在这台设备上保存，不和其他设备互通。</p>';
  }

  function renderSyncModal() {
    var shareable = /^https?:$/.test(location.protocol) &&
      (syncDraft.mode === 'supabase' || syncDraft.mode === 'server');
    var shareBtn = shareable
      ? '<button class="btn btn-ghost" data-action="copy-setup">' + icon('share', 15) + '复制配置链接</button>'
      : '';
    document.getElementById('modal-root').innerHTML =
      '<div class="modal-scrim" data-action="close-modal">' +
        '<div class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
          '<div class="modal-head">' +
            '<div><h2 class="modal-title" id="modal-title">同步设置</h2>' +
            '<p class="modal-sub">两台设备填一样的内容，就能看到同一份记录。</p></div>' +
            '<button class="icon-btn" data-action="close-modal" aria-label="关闭">' + icon('x', 18) + '</button>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="seg">' +
              syncModeBtn('off', '不用同步') + syncModeBtn('auto', '跟随本页') +
              syncModeBtn('server', '自建服务') + syncModeBtn('supabase', 'Supabase') +
            '</div>' +
            syncFields() +
            (shareable ? '<p class="dim" style="font-size:12px;line-height:1.7;color:var(--text-dim);margin-top:10px">' +
              '「复制配置链接」会把上面这些（含同步口令）打包进一条链接。对方点开就自动配好，只剩登录。' +
              '只发给对方本人，别发群里。</p>' : '') +
            '<p class="sync-link" id="sync-link" hidden></p>' +
          '</div>' +
          '<p class="sync-hint" id="sync-test-result">当前状态：' + (syncDraft.mode === 'off' ? '仅本机' : '待测试') + '</p>' +
          '<div class="modal-actions">' +
            shareBtn +
            '<button class="btn btn-ghost" data-action="sync-diag">诊断</button>' +
            '<button class="btn btn-ghost" data-action="sync-test">' + icon('share', 15) + '测试连接</button>' +
            '<button class="btn btn-primary" data-action="sync-save">' + icon('check', 16) + '保存并同步</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function testSyncConnection() {
    captureSyncForm();
    var box = document.getElementById('sync-test-result');
    function say(msg) { if (box) box.textContent = msg; }

    if (syncDraft.mode === 'supabase' && !sbReady()) {
      say('这个浏览器不支持加密（需要安全上下文），换 Chrome / Edge / Safari 试试。');
      return;
    }
    var cfg = Object.assign({}, syncDraft);
    if (activeMode(cfg) === 'off') {
      say(syncDraft.mode === 'off' ? '当前选择的是「不用同步」。' : '信息还不完整，把地址 / key / 口令填全。');
      return;
    }
    say('正在连接…');
    apiPull(true, cfg, 0)
      .then(function (res) {
        if (!res.data) say('连接成功，当前凭据下未读到数据。若空间已经存在，请核对访问密钥和权限；新空间保存后才会创建。');
        else say('连上了 ✓ 云端已有数据（rev ' + res.rev + '），说明口令和地址都对。');
      })
      .catch(function (err) {
        var code = String(err && err.message);
        if (code === 'DECRYPT_FAILED' || code === 'DECRYPT_FORMAT') {
          say('连上了，但同步口令不对，解不开云端的数据。');
        } else if (code === 'NEED_TOKEN') {
          say('服务端要求访问口令，填对再试。');
        } else {
          say('连不上：' + code + '。检查地址、key 是否复制完整。');
        }
      });
  }

  function saveSyncSettings() {
    captureSyncForm();
    if (syncDraft.mode === 'supabase') {
      if (!syncDraft.sbUrl || !syncDraft.sbKey) { toast('Supabase 的 URL 和 key 都要填。'); return; }
      if ((syncDraft.pass || '').length < 6) { toast('同步口令至少 6 位。'); return; }
      if (!sbReady()) { toast('这个浏览器不支持加密，换 Chrome / Edge / Safari。'); return; }
      try {
        var url = new URL(syncDraft.sbUrl);
        if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('URL');
        syncDraft.sbUrl = url.origin;
      } catch (err) { toast('Project URL 请填写 https:// 开头的项目根地址。'); return; }
      if (/^sb_secret_/.test(syncDraft.sbKey)) { toast('不能在网页中使用 secret key，请换 publishable 或 anon key。'); return; }
      try {
        if (syncDraft.sbKey.indexOf('eyJ') === 0 && JSON.parse(b64urlDecode(syncDraft.sbKey.split('.')[1])).role === 'service_role') {
          toast('不能在网页中使用 service_role key，请换 anon key。'); return;
        }
      } catch (err) { toast('API key 格式不正确，请重新复制。'); return; }
      if (syncDraft.accessToken && syncDraft.accessToken.length < 24) { toast('空间访问密钥至少 24 位。'); return; }
    }
    if (syncDraft.mode === 'server' && syncDraft.url && !/^https?:\/\//.test(syncDraft.url)) {
      toast('服务地址要以 http:// 或 https:// 开头。');
      return;
    }
    saveSyncCfg(syncDraft);
    SYNC.cfg = JSON.parse(JSON.stringify(syncDraft));
    closeModal();
    syncInit();
    render();
    toast(syncDraft.mode === 'off' ? '已经改成仅本机。' : '同步设置已保存，正在同步…');
  }

  function copySql() {
    var text = SUPABASE_SQL;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast('SQL 已复制，粘贴到 Supabase 的 SQL Editor 里 Run。');
      }).catch(function () { toast('复制失败，手动选中那段 SQL 吧。'); });
    } else {
      toast('这个环境不能自动复制，手动选中那段 SQL 吧。');
    }
  }

  function copyMediaSql() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(MEDIA_SQL).then(function () {
        toast('图片用 SQL 已复制，粘贴到 SQL Editor 里 Run。');
      }).catch(function () { toast('复制失败，手动选中那段 SQL 吧。'); });
    } else {
      toast('这个环境不能自动复制，手动选中那段 SQL 吧。');
    }
  }

  /* ------------------------------------------------- 一键把配置发给对方 */

  function b64urlEncode(text) {
    return bytesToB64(new TextEncoder().encode(text))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function b64urlDecode(text) {
    var s = String(text || '').replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return new TextDecoder().decode(b64ToBytes(s));
  }

  function setupPayload(src) {
    var cfg = src || SYNC.cfg || loadSyncCfg();
    var out = { m: cfg.mode };
    if (cfg.url) out.u = cfg.url;
    if (cfg.token) out.t = cfg.token;
    if (cfg.sbUrl) out.s = cfg.sbUrl;
    if (cfg.sbKey) out.k = cfg.sbKey;
    if (cfg.pass) out.p = cfg.pass;
    if (cfg.accessToken) out.a = cfg.accessToken;
    return out;
  }

  function buildSetupLink(cfg) {
    return location.origin + location.pathname + '#setup=' + b64urlEncode(JSON.stringify(setupPayload(cfg)));
  }

  function copySetupLink() {
    captureSyncForm();
    var link = buildSetupLink(syncDraft);
    var box = document.getElementById('sync-link');
    if (box) {
      box.hidden = false;
      box.textContent = link;
      if (box.scrollIntoView) box.scrollIntoView({ block: 'nearest' });
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(function () {
        toast('配置链接已复制，发给对方点一下就能自动配好。');
      }).catch(function () { toast('复制失败，长按下面那行链接手动复制吧。'); });
    } else {
      toast('这个环境不能自动复制，长按下面那行链接手动复制吧。');
    }
  }

  // 对方点开带 #setup= 的链接时，直接把配置装好，并把这段从地址栏抹掉
  function applySetupFromHash() {
    var hash = location.hash || '';
    if (hash.indexOf('#setup=') !== 0) return false;
    var data = null;
    try {
      data = JSON.parse(b64urlDecode(hash.slice(7)));
    } catch (err) {
      data = null;
    }
    try {
      history.replaceState(null, '', location.pathname + location.search + '#/');
    } catch (err) {
      location.hash = '#/';
    }
    if (!data || !data.m) {
      toast('这个配置链接读不出来，可能复制的时候被截断了。');
      return false;
    }
    var cfg = defaultSyncCfg();
    cfg.mode = ['supabase', 'server', 'auto', 'off'].indexOf(data.m) >= 0 ? data.m : 'auto';
    cfg.url = data.u || '';
    cfg.token = data.t || '';
    cfg.sbUrl = data.s || '';
    cfg.sbKey = data.k || '';
    cfg.pass = data.p || '';
    cfg.accessToken = data.a || '';
    if ([cfg.url, cfg.token, cfg.sbUrl, cfg.sbKey, cfg.pass, cfg.accessToken].some(function (s) { return typeof s !== 'string'; })) {
      toast('配置链接格式不正确。'); return false;
    }
    saveSyncCfg(cfg);
    SYNC.cfg = cfg;
    toast('同步配置已就绪，正在连接…');
    return true;
  }

  /* ------------------------------------------------------- 修改自己的密码 */

  function openPasswordModal() {
    var me = currentUser();
    if (!me) return;
    document.getElementById('modal-root').innerHTML =
      '<div class="modal-scrim" data-action="close-modal">' +
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
          '<div class="modal-head">' +
            '<div><h2 class="modal-title" id="modal-title">修改密码</h2>' +
            '<p class="modal-sub">改的是 ' + esc(me.name) + ' 自己的密码，另一台设备也会同步过去。</p></div>' +
            '<button class="icon-btn" data-action="close-modal" aria-label="关闭">' + icon('x', 18) + '</button>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="field"><label for="pw-cur">当前密码</label>' +
              '<input class="input" id="pw-cur" type="password" maxlength="32" data-enter="save-pw" /></div>' +
            '<div class="field"><label for="pw-new">新密码（至少 4 位）</label>' +
              '<input class="input" id="pw-new" type="password" maxlength="32" data-enter="save-pw" /></div>' +
            '<div class="field" style="margin-bottom:0"><label for="pw-new2">再输一次新密码</label>' +
              '<input class="input" id="pw-new2" type="password" maxlength="32" data-enter="save-pw" /></div>' +
            '<p class="auth-error" id="pw-error"></p>' +
          '</div>' +
          '<div class="modal-actions">' +
            '<button class="btn btn-ghost" data-action="close-modal">取消</button>' +
            '<button class="btn btn-primary" data-action="save-pw">' + icon('check', 16) + '保存新密码</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    var first = document.getElementById('pw-cur');
    if (first) first.focus();
  }

  function valueOf(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }

  function savePassword() {
    var me = currentUser();
    if (!me) return;
    var cur = valueOf('pw-cur');
    var n1 = valueOf('pw-new');
    var n2 = valueOf('pw-new2');
    var errBox = document.getElementById('pw-error');
    function fail(msg) {
      if (errBox) errBox.textContent = msg;
      toast(msg);
    }
    if (!cur) return fail('请输入当前密码。');
    if (n1.length < 4) return fail('新密码至少 4 位。');
    if (n1 !== n2) return fail('两次输入的新密码不一样。');
    if (n1 === cur) return fail('新密码和当前密码一样，不用改。');

    hashPassword(cur, me.salt).then(function (h) {
      if (h !== me.hash) return fail('当前密码不对。');
      var salt = randomSalt();
      return hashPassword(n1, salt).then(function (nextHash) {
        me.salt = salt;
        me.hash = nextHash;
        me.updatedAt = editTime(me);
        saveState();
        closeModal();
        render();
        toast('密码改好了，下次请用新密码登录。');
      });
    });
  }

  /* ---------------------------------------------------------- 派生数据 */

  // 删掉的记录留一个「墓碑」（deleted:true + 新的 updatedAt），
  // 否则另一台设备按 id 求并集时会把它复活。
  function alive(list) {
    return (list || []).filter(function (r) { return !r.deleted; });
  }

  function killRecord(kind, id) {
    var rec = (state[kind] || []).filter(function (r) { return r.id === id; })[0];
    if (!rec) return false;
    rec.deleted = true;
    rec.updatedAt = editTime(rec);
    return true;
  }

  function findRecord(kind, id) {
    return (state[kind] || []).filter(function (r) { return r.id === id; })[0];
  }

  function expenses(filterFn) {
    return alive(state.ledger).filter(function (e) { return e.amount < 0; }).filter(filterFn);
  }

  function sum(list) {
    return Math.round(list.reduce(function (s, e) { return s + e.amount; }, 0) * 100) / 100;
  }

  function todaySpend() {
    return Math.abs(sum(expenses(function (e) { return recordOffset(e) === 0; })));
  }

  function monthSpend() {
    var t = today();
    return Math.abs(sum(expenses(function (e) {
      var d = entryDate(e);
      return d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
    })));
  }

  function monthIncome() {
    var t = today();
    return sum(alive(state.ledger).filter(function (e) {
      if (e.amount <= 0) return false;
      var d = entryDate(e);
      return d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
    }));
  }

  function openWishCount() {
    return alive(state.wishes).filter(function (w) { return w.status !== '已完成'; }).length;
  }

  function pendingWishCount() {
    return alive(state.wishes).filter(function (w) { return w.status === '等你一起商量'; }).length;
  }

  function savingPct() {
    return Math.min(100, Math.round((savedTotal() / state.saving.goal) * 100));
  }

  function savedTotal() {
    return sum(alive(state.savingsLog));
  }

  function moodOf(who, day) {
    var list = alive(state.moods).filter(function (m) { return m.who === who && recordOffset(m) === day; });
    list.sort(function (a, b) {
      return (b.updatedAt || 0) - (a.updatedAt || 0) || String(b.time || '').localeCompare(String(a.time || '')) || String(b.id).localeCompare(String(a.id));
    });
    return list.length ? list[0] : null;
  }

  function postComments(postId) {
    return alive(state.comments).filter(function (c) { return c.postId === postId; });
  }

  function person(who) {
    var list = accounts();
    var acc = list[who === 'b' ? 1 : 0];
    if (acc) return { name: acc.name, emoji: acc.emoji };
    return who === 'b' ? CONFIG.couple.b : CONFIG.couple.a;
  }

  /* --------------------------------------------------------- 登录身份 */

  function accounts() {
    return (state.auth && state.auth.accounts) || [];
  }

  function currentUser() {
    var list = accounts();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === state.auth.currentId) return list[i];
    }
    return null;
  }

  function indexOfUser(id) {
    var list = accounts();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return i;
    }
    return 0;
  }

  function currentWho() {
    return indexOfUser(state.auth.currentId) === 1 ? 'b' : 'a';
  }

  function currentName() {
    var u = currentUser();
    return u ? u.name : CONFIG.couple.a.name;
  }

  /* ------------------------------------------------------------- 侧边栏 */

  function sidebar() {
    var me = currentUser() || { name: CONFIG.couple.a.name, emoji: CONFIG.couple.a.emoji };
    var role = moodOf(currentWho(), 0) ? '今天的记录者' : '已登录';
    var items = [
      { view: 'overview', label: '今日总览', ic: 'grid' },
      { view: 'todos', label: '每日待办', ic: 'listChecks' },
      { view: 'posts', label: '我们的说说', ic: 'message' },
      { view: 'ledger', label: '双人账本', ic: 'wallet' },
      { view: 'wishes', label: '心愿清单', ic: 'gift', badge: pendingWishCount() },
      { view: 'savings', label: '一起存钱', ic: 'piggy' },
      { view: 'moods', label: '心情日记', ic: 'heart' }
    ];

    var nav = items.map(function (it) {
      var badge = it.badge ? '<span class="nav-badge">' + it.badge + '</span>' : '';
      return '<button class="nav-item' + (state.view === it.view ? ' active' : '') + '"' +
        ' data-action="nav" data-view="' + it.view + '"' +
        ' aria-current="' + (state.view === it.view ? 'page' : 'false') + '" title="' + it.label + '">' +
        icon(it.ic, 18) + '<span class="label">' + it.label + '</span>' + badge +
        '</button>';
    }).join('');

    return '' +
      '<div class="brand">' +
        '<span class="brand-mark">' + icon('clover', 19) + '</span>' +
        '<span class="brand-text">' +
          '<span class="brand-name">两人小日子</span>' +
          '<span class="brand-sub">OUR LITTLE EVERYDAY</span>' +
        '</span>' +
      '</div>' +

      '<div class="side-label"><span>我们的生活手账</span>' + icon('heart', 14) + '</div>' +

      '<nav class="nav" aria-label="功能导航">' + nav + '</nav>' +

      '<div class="side-note">' +
        icon('leaf', 16) +
        '<p>不必把生活过得很满，有你在，就刚刚好。</p>' +
        '<small>little things, with you.</small>' +
      '</div>' +

      '<div class="side-links">' +
        '<button class="side-link" data-action="export">' + icon('download', 16) + '<span>导出我们的记录</span></button>' +
        '<button class="side-link" data-action="import">' + icon('upload', 16) + '<span>导入记录</span></button>' +
        '<button class="side-link" data-action="sync-settings">' + icon('sliders', 16) + '<span>同步设置</span></button>' +
        '<button class="side-link" data-action="install">' + icon('download', 16) + '<span>装成 App</span></button>' +
      '</div>' +

      '<button class="account" data-action="account" aria-haspopup="dialog">' +
        '<span class="avatar">' + esc(me.emoji) + '</span>' +
        '<span class="account-text">' +
          '<span class="account-role">' + role + '</span>' +
          '<span class="account-name">' + esc(me.name) + '</span>' +
        '</span>' +
        icon('chevronDown', 16, 'account-chev') +
      '</button>';
  }

  /* --------------------------------------------------------------- 顶栏 */

  function topbar() {
    var v = VIEWS[state.view] || VIEWS.overview;
    return '' +
      '<div class="crumbs">' +
        '<button class="icon-btn burger" data-action="open-drawer" aria-label="打开导航">' + icon('menu', 20) + '</button>' +
        '<span class="crumb">' + CONFIG.spaceName + '</span>' +
        '<span class="crumb-sep">›</span>' +
        '<span class="crumb current">' + v.title + '</span>' +
      '</div>' +
      '<div class="top-actions">' +
        syncChip() +
        '<span class="hint"><i class="hint-dot"></i><span>我们的记录</span></span>' +
        '<button class="icon-btn" data-action="share" aria-label="分享我们的空间">' + icon('share', 18) + '</button>' +
        '<button class="btn btn-primary btn-split" data-action="quick" data-kind="menu">' +
          icon('plus', 17) + '<span class="btn-label">记录一下</span>' +
          '<i class="sep"></i>' + icon('chevronDown', 15, 'chev') +
        '</button>' +
      '</div>';
  }

  /* ----------------------------------------------------------- 公共组件 */

  function pageHead(v) {
    return '<section class="page-head reveal">' +
      '<div>' +
        '<p class="eyebrow">' + v.eyebrow + '</p>' +
        '<h1 class="h1">' + v.h1 + '<span class="h1-emoji">' + v.emoji + '</span></h1>' +
        '<p class="lede">' + v.lede + '</p>' +
      '</div>' +
      '<p class="date-pill">' + icon('calendar', 16) + '<span>' + fmtCN(today()) + '</span></p>' +
      '</section>';
  }

  function noticeBar() {
    return '<section class="notice reveal" style="--d:40ms">' +
      '<p class="notice-text">' + icon('sparkles', 16) +
        '<span id="overview-sync-hint">' + esc(SYNC.enabled ? syncHint() : '从今天起，把值得记住的小事写在这里。') + '</span></p>' +
      '<button class="link flat" data-action="nav" data-view="todos">开始我们的记录' +
        icon('arrowRight', 15) + '</button>' +
      '</section>';
  }

  function sparks() {
    return '<span class="spark s1">' + icon('sparkles', 15) + '</span>' +
      '<span class="spark warm s2">' + icon('sparkles', 11) + '</span>' +
      '<span class="spark s3">' + icon('sparkles', 10) + '</span>' +
      '<span class="spark warm s4">' + icon('sparkles', 14) + '</span>';
  }

  function branchSvg() {
    return '<svg class="branch" viewBox="0 0 160 200" fill="none" stroke="rgba(143,180,119,.5)" ' +
      'stroke-width="1.2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M22 196C50 150 76 92 106 24"/>' +
      '<path d="M106 24c15-6 27-1 32 9-15 5-27 0-32-9z"/>' +
      '<path d="M96 54c-14 1-25-7-26-19 14-2 25 5 26 19z"/>' +
      '<path d="M84 86c-14 1-25-7-26-19 14-2 25 5 26 19z"/>' +
      '<path d="M70 120c-14 1-25-7-26-19 14-2 25 5 26 19z"/>' +
      '<path d="M56 154c-14 1-25-7-26-19 14-2 25 5 26 19z"/>' +
      '</svg>';
  }

  function heroCard() {
    return '<section class="hero reveal" style="--d:80ms">' +
      '<div class="hero-copy">' +
        '<span class="chip"><i class="dot"></i>两个人的小世界</span>' +
        '<h2 class="hero-title">把日子写下来，<br>把彼此放在心上。</h2>' +
        '<p class="hero-desc">一笔账、一件小事、一句今天的心情，<br>平凡的每一天，都值得一起珍藏。</p>' +
        '<button class="link hero-link" data-action="quick" data-kind="mood">' +
          '今天，也想听听你的心情' + icon('arrowUpRight', 15) + '</button>' +
      '</div>' +
      '<div class="hero-art">' +
        '<div class="orbit"></div>' +
        '<div class="blobs">' +
          '<div class="blob blob-a"><span>' + esc(person('a').emoji) + '</span></div>' +
          '<div class="blob blob-b"><span>' + esc(person('b').emoji) + '</span></div>' +
          '<span class="knot">' + icon('heart', 13) + '</span>' +
        '</div>' +
        sparks() +
        '<div class="daycount">' +
          '<p class="daycount-line">我们在一起的第<span class="daycount-num">' + daysTogether() + '</span>天</p>' +
          '<p class="daycount-en">YOU &amp; ME, DAY BY DAY</p>' +
        '</div>' +
      '</div>' +
      branchSvg() +
      '</section>';
  }

  function statCards() {
    var cards = [
      {
        title: '今天的小花瓣', ic: 'receipt',
        value: '<span class="cur">¥</span>' + num(todaySpend()),
        note: '本月累计 ¥' + num(monthSpend())
      },
      {
        title: '等我们完成', ic: 'listChecks',
        value: String(openWishCount()),
        note: '不着急，一件一件来'
      },
      {
        title: '等你一起商量', ic: 'gift',
        value: String(pendingWishCount()),
        note: '每个心愿，都值得被看见'
      },
      {
        title: '我们一起存下', ic: 'sprout',
        value: '<span class="cur">¥</span>' + num(savedTotal(), 0),
        note: '共同存的小目标已到 ' + savingPct() + '%'
      }
    ];

    return '<section class="stat-grid">' + cards.map(function (c, i) {
      return '<article class="card stat reveal" style="--d:' + (120 + i * 50) + 'ms">' +
        '<div class="stat-top">' +
          '<h3 class="stat-title">' + c.title + '</h3>' +
          '<span class="stat-icon">' + icon(c.ic, 16) + '</span>' +
        '</div>' +
        '<p class="stat-value">' + c.value + '</p>' +
        '<div class="stat-foot"><span>' + c.note + '</span>' + icon('arrowUpRight', 12, 'arrow') + '</div>' +
        '</article>';
    }).join('') + '</section>';
  }

  function delButton(kind, id, label) {
    return '<button class="row-x" data-action="del" data-kind="' + kind + '" data-id="' + id + '"' +
      ' aria-label="删除' + (label ? '：' + esc(label) : '') + '" title="删除">' +
      icon('trash', 14) + '</button>';
  }

  function todoRow(t) {
    return '<li class="todo-row' + (t.done ? ' done' : '') + '">' +
      '<button class="check' + (t.done ? ' on' : '') + '" data-action="toggle-todo" data-id="' + t.id + '"' +
        ' role="checkbox" aria-checked="' + (t.done ? 'true' : 'false') + '"' +
        ' aria-label="' + esc(t.text) + '">' + icon('check', 13) + '</button>' +
      '<div class="todo-main">' +
        '<p class="todo-text">' + esc(t.text) + '</p>' +
        '<p class="todo-when">' + esc(t.dueDate ? t.dueDate + ' · ' + todoGroup(t) : t.when) + '</p>' +
      '</div>' +
      '<span class="tag">' + esc(t.tag) + '</span>' +
      delButton('todos', t.id, t.text) +
      '</li>';
  }

  function moodCard(who, mood) {
    var p = person(who);
    var line = mood ? esc(mood.mood) + ' ' + esc(mood.note) : '还没有记录今天的心情';
    return '<article class="mood-card ' + who + '" data-action="nav" data-view="moods" tabindex="0" role="button">' +
      '<div class="row1">' +
        '<span class="mood-ava">' + esc(p.emoji) + '</span>' +
        '<span class="mood-name">' + esc(p.name) + '</span>' +
        (mood ? '<i class="dot"></i>' : '') +
      '</div>' +
      '<p class="mood-quote">' + line + '</p>' +
      '<p class="mood-time">' + (mood ? '今天 ' + esc(mood.time) : '等一句话就好') + '</p>' +
      '</article>';
  }

  function todoPanel() {
    var list = alive(state.todos).filter(function (t) { return !t.done && (todoGroup(t) === '今天' || todoGroup(t) === '逾期'); }).slice(0, 3);
    return '<section class="card panel reveal" style="--d:340ms">' +
      '<div class="card-head">' +
        '<div><h3 class="card-title">今天的小事</h3>' +
        '<p class="card-sub">普通日常，也要一起认真对待。</p></div>' +
        '<button class="link flat" data-action="nav" data-view="todos">查看全部' + icon('arrowUpRight', 15) + '</button>' +
      '</div>' +
      (list.length ? '<ul>' + list.map(todoRow).join('') + '</ul>'
        : '<p class="empty">今天还没有安排，慢慢来。</p>') +
      '</section>';
  }

  function moodPanel() {
    return '<section class="card panel reveal" style="--d:380ms">' +
      '<div class="card-head">' +
        '<div><h3 class="card-title">今天的心情</h3>' +
        '<p class="card-sub">你的每一种情绪，我都想知道</p></div>' +
        '<button class="link flat" data-action="nav" data-view="moods">心情日记' + icon('arrowUpRight', 15) + '</button>' +
      '</div>' +
      '<div class="mood-grid">' +
        moodCard('a', moodOf('a', 0)) +
        moodCard('b', moodOf('b', 0)) +
      '</div>' +
      '</section>';
  }

  /* --------------------------------------------------------------- 视图 */

  function todoGroup(t) {
    if (t.done) return '已完成';
    if (!validDay(t.dueDate)) return '本周';
    var offset = recordOffset({ date: t.dueDate });
    return offset < 0 ? '逾期' : offset === 0 ? '今天' : offset === 1 ? '明天' : '以后';
  }

  var VIEWS = {

    overview: {
      title: '今日总览',
      eyebrow: 'A LITTLE LIFE, A LOT OF LOVE',
      h1: '又是有你的一天',
      emoji: '🌞',
      lede: '把平凡的小日子，过成我们喜欢的样子。',
      render: function () {
        return pageHead(VIEWS.overview) + noticeBar() + heroCard() + statCards() +
          '<div class="cols">' + todoPanel() + moodPanel() + '</div>';
      }
    },

    todos: {
      title: '每日待办',
      eyebrow: 'TODAY, TOGETHER',
      h1: '一件一件，慢慢来做',
      emoji: '✅',
      lede: '不着急，我们有的是时间。',
      render: function () {
        var groups = ['逾期', '今天', '明天', '以后', '本周', '已完成'];
        var all = alive(state.todos);
        var done = all.filter(function (t) { return t.done; }).length;
        var pct = all.length ? Math.round((done / all.length) * 100) : 0;

        return pageHead(VIEWS.todos) +
          '<section class="card panel reveal" style="--d:40ms">' +
            '<div class="card-head">' +
              '<div><h3 class="card-title">今天的进度</h3>' +
              '<p class="card-sub">' + done + ' / ' + all.length + ' 件小事已经打勾</p></div>' +
              '<span class="tag">' + pct + '%</span>' +
            '</div>' +
            '<div class="bar"><i class="bar-fill" style="width:' + pct + '%"></i></div>' +
            '<div class="inline-form">' +
              '<input class="input" id="new-todo" data-enter="add-todo" placeholder="想一起做点什么？" aria-label="新的待办" />' +
              '<input class="input date-input" id="new-todo-date" type="date" value="' + isoDay(today()) + '" aria-label="待办日期" />' +
              '<button class="btn btn-primary" data-action="add-todo">' + icon('plus', 16) + '加一件</button>' +
            '</div>' +
          '</section>' +
          groups.map(function (g, i) {
            var rows = all.filter(function (t) { return todoGroup(t) === g; });
            if (!rows.length) return '';
            return '<section class="card panel reveal" style="--d:' + (80 + i * 40) + 'ms">' +
              '<div class="card-head"><div><h3 class="card-title">' + g + '</h3>' +
              '<p class="card-sub">' + rows.filter(function (t) { return t.done; }).length + ' / ' + rows.length + ' 已完成</p></div></div>' +
              '<ul>' + rows.map(todoRow).join('') + '</ul></section>';
          }).join('') +
          (all.length ? '' : '<p class="empty">还没有待办，写一件试试。</p>');
      }
    },

    ledger: {
      title: '双人账本',
      eyebrow: 'OUR LITTLE LEDGER',
      h1: '每一笔，都是生活的样子',
      emoji: '🧾',
      lede: '记账不是为了省，是为了记得。',
      render: function () {
        var expense = monthSpend();
        var income = monthIncome();
        var live = alive(state.ledger);
        var rows = live.slice().sort(function (a, b) { return recordOffset(b) - recordOffset(a); });
        var cards = [
          { t: '本月支出', v: '<span class="cur">¥</span>' + num(expense), ic: 'receipt' },
          { t: '本月收入', v: '<span class="cur">¥</span>' + num(income), ic: 'sprout' },
          { t: '本月结余', v: '<span class="cur">¥</span>' + num(income - expense), ic: 'target' }
        ];
        return pageHead(VIEWS.ledger) +
          '<section class="summary-grid">' + cards.map(function (c, i) {
            return '<article class="card stat reveal" style="--d:' + (40 + i * 40) + 'ms">' +
              '<div class="stat-top"><h3 class="stat-title">' + c.t + '</h3>' +
              '<span class="stat-icon">' + icon(c.ic, 16) + '</span></div>' +
              '<p class="stat-value">' + c.v + '</p></article>';
          }).join('') + '</section>' +
          '<section class="card panel reveal" style="--d:120ms">' +
            '<div class="card-head"><div><h3 class="card-title">记一笔</h3>' +
              '<p class="card-sub">金额填正数就行，收入还是支出靠左边选</p></div></div>' +
            '<div class="inline-form">' +
              '<select class="input select-input" id="new-ledger-kind" aria-label="收入还是支出">' +
                '<option value="out">支出</option><option value="in">收入</option>' +
              '</select>' +
              '<input class="input" id="new-ledger" data-enter="add-ledger" placeholder="这笔钱花在哪了？" aria-label="账目名称" />' +
              '<input class="input num-input" id="new-ledger-amount" data-enter="add-ledger" type="number" min="0" step="0.01" placeholder="金额" aria-label="金额" />' +
              '<input class="input date-input" id="new-ledger-date" type="date" value="' + isoDay(today()) + '" max="' + isoDay(today()) + '" aria-label="记账日期" />' +
              '<button class="btn btn-primary" data-action="add-ledger">' + icon('plus', 16) + '记一笔</button>' +
            '</div>' +
          '</section>' +
          '<section class="card panel reveal" style="--d:160ms">' +
            '<div class="card-head"><div><h3 class="card-title">最近的记录</h3>' +
              '<p class="card-sub">一共 ' + live.length + ' 笔，都是我们一起过的日子</p></div>' +
              '<span class="tag warm">今天 ¥' + num(todaySpend()) + '</span></div>' +
            (rows.length ? '<ul>' + rows.map(ledgerRow).join('') + '</ul>'
              : '<p class="empty">还没有记录，记第一笔试试。</p>') +
          '</section>';
      }
    },

    wishes: {
      title: '心愿清单',
      eyebrow: 'WISHES WE SHARE',
      h1: '想和你一起完成的事',
      emoji: '🎁',
      lede: '每个心愿，都值得被看见。',
      render: function () {
        return pageHead(VIEWS.wishes) +
          '<section class="card panel reveal" style="--d:40ms">' +
            '<div class="card-head"><div><h3 class="card-title">再加一个心愿</h3>' +
              '<p class="card-sub">写下来，就离实现近一点</p></div></div>' +
            '<div class="inline-form">' +
              '<input class="input" id="new-wish" data-enter="add-wish" placeholder="比如：一起去看一场演唱会" aria-label="新的心愿" />' +
              '<input class="input num-input" id="new-wish-target" data-enter="add-wish" type="number" min="0" step="100" placeholder="目标金额" aria-label="目标金额" />' +
              '<button class="btn btn-primary" data-action="add-wish">' + icon('plus', 16) + '记下心愿</button>' +
            '</div>' +
          '</section>' +
          '<section class="wish-grid">' + alive(state.wishes).map(function (w, i) {
            return wishCard(w, 80 + i * 40);
          }).join('') + '</section>';
      }
    },

    savings: {
      title: '一起存钱',
      eyebrow: 'SAVING TOGETHER',
      h1: '把想要的，一点点存出来',
      emoji: '🪙',
      lede: '共同存的小目标，已经开始了。',
      render: function () {
        var pct = savingPct();
        var logs = alive(state.savingsLog).slice().sort(function (a, b) { return recordOffset(b) - recordOffset(a); });
        var saved = savedTotal();
        return pageHead(VIEWS.savings) +
          '<section class="card panel reveal" style="--d:40ms">' +
            '<div class="goal-wrap">' +
              ring(pct) +
              '<div>' +
                '<h3 class="card-title">我们的小目标</h3>' +
                '<p class="card-sub">已经存下 ¥' + num(saved, 0) + '，离目标还有 ¥' +
                  num(Math.max(0, state.saving.goal - saved), 0) + '</p>' +
                '<div class="bar" style="margin:18px 0 14px"><i class="bar-fill" style="width:' + pct + '%"></i></div>' +
                '<div class="wish-meta"><span>目标 ¥' + num(state.saving.goal, 0) + '</span>' +
                  '<button class="auth-link" data-action="goal">改目标</button></div>' +
                '<div class="inline-form" style="margin-top:18px">' +
                  '<select class="input select-wide" id="saving-wish" aria-label="存进哪个目标">' +
                    '<option value="">共同小目标</option>' +
                    alive(state.wishes).map(function (w) {
                      return '<option value="' + w.id + '">' + esc(w.title) + '</option>';
                    }).join('') +
                  '</select>' +
                  '<input class="input num-input" id="new-saving" data-enter="add-saving" type="number" min="0" step="1" placeholder="金额" aria-label="存入金额" />' +
                  '<button class="btn btn-primary" data-action="add-saving">' + icon('plus', 16) + '存进去</button>' +
                  '<button class="btn btn-ghost" data-action="save-money" data-amount="100">+100</button>' +
                  '<button class="btn btn-ghost" data-action="save-money" data-amount="500">+500</button>' +
                  '<button class="btn btn-ghost" data-action="save-money" data-amount="1000">+1000</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</section>' +
          '<section class="card panel reveal" style="--d:120ms">' +
            '<div class="card-head"><div><h3 class="card-title">心愿进度</h3>' +
              '<p class="card-sub">存进心愿的钱同时算进上面的总目标</p></div></div>' +
            (alive(state.wishes).length
              ? '<ul>' + alive(state.wishes).map(wishProgressRow).join('') + '</ul>'
              : '<p class="empty">还没有心愿，去「心愿清单」加一个。</p>') +
          '</section>' +
          '<section class="card panel reveal" style="--d:160ms">' +
            '<div class="card-head"><div><h3 class="card-title">存入记录</h3>' +
              '<p class="card-sub">每一次存下，都是朝着同一个方向</p></div></div>' +
            (logs.length ? '<ul>' + logs.map(function (l) {
              var w = l.wishId ? findRecord('wishes', l.wishId) : null;
              return '<li class="ledger-row">' +
                '<span class="cat">' + (w ? esc(w.emoji) : '🪙') + '</span>' +
                '<div class="todo-main"><p class="todo-text">' + esc(l.who) + ' 存了一笔' +
                  (w ? ' · ' + esc(w.title) : '') + '</p>' +
                '<p class="todo-when">' + dayLabel(recordOffset(l)) + '</p></div>' +
                '<span class="amount in">+' + num(l.amount, 0) + '</span>' +
                delButton('savingsLog', l.id, l.who + ' 存入 ' + l.amount) +
                '</li>';
            }).join('') + '</ul>' : '<p class="empty">还没有存入记录。</p>') +
          '</section>';
      }
    },

    moods: {
      title: '心情日记',
      eyebrow: 'HOW ARE YOU TODAY',
      h1: '你的每一种情绪，我都想知道',
      emoji: '💗',
      lede: '今天也想听听你的心情。',
      render: function () {
        var picker = ['a', 'b'].map(function (who) {
          var p = person(who);
          var cur = moodOf(who, 0);
          return '<section class="card panel reveal" style="--d:' + (who === 'a' ? 40 : 80) + 'ms">' +
            '<div class="card-head"><div><h3 class="card-title">' + esc(p.name) + ' 今天的心情</h3>' +
            '<p class="card-sub">' + (cur ? esc(cur.mood) + ' ' + esc(cur.note) : '选一个最接近的表情吧') + '</p></div>' +
            (cur ? '<span class="tag">' + esc(cur.time) + '</span>' : '') + '</div>' +
            '<div class="mood-picker">' + MOODS.map(function (m) {
              return '<button class="mood-btn' + (cur && cur.mood === m.emoji ? ' on' : '') + '"' +
                ' data-action="set-mood" data-who="' + who + '" data-mood="' + m.emoji + '">' +
                '<span>' + m.emoji + '</span><span>' + m.label + '</span></button>';
            }).join('') + '</div></section>';
        }).join('');

        var history = alive(state.moods).slice().sort(function (a, b) { return recordOffset(b) - recordOffset(a); });

        return pageHead(VIEWS.moods) + picker +
          '<section class="card panel reveal" style="--d:120ms">' +
            '<div class="card-head"><div><h3 class="card-title">我们的心情流水</h3>' +
              '<p class="card-sub">一共 ' + history.length + ' 条，都是真实的我们</p></div></div>' +
            (history.length ? '<ul>' + history.map(function (m) {
              return '<li class="history-row">' +
                '<span class="history-emoji">' + esc(m.mood) + '</span>' +
                '<div class="todo-main"><p class="history-note">' + esc(m.note) + '</p>' +
                '<p class="history-time">' + esc(person(m.who).name) + ' · ' + dayLabel(recordOffset(m)) + ' ' + esc(m.time) + '</p></div>' +
                delButton('moods', m.id, m.note) +
                '</li>';
            }).join('') + '</ul>' : '<p class="empty">还没有心情记录。</p>') +
          '</section>';
      }
    },

    posts: {
      title: '我们的说说',
      eyebrow: 'WORDS BETWEEN US',
      h1: '想说什么，就写下来',
      emoji: '💬',
      lede: '一句废话、一件小事、一个忽然冒出来的想法。',
      render: function () {
        var me = currentUser() || { emoji: '🍀' };
        var list = alive(state.posts).slice().sort(function (a, b) {
          var da = recordOffset(a), db = recordOffset(b);
          if (da !== db) return db - da;
          return String(b.time || '').localeCompare(String(a.time || ''));
        });

        return pageHead(VIEWS.posts) +
          '<section class="card panel reveal" style="--d:40ms">' +
            '<div class="composer">' +
              '<span class="avatar">' + esc(me.emoji) + '</span>' +
              '<input class="input" id="new-post" data-enter="add-post" maxlength="300"' +
                ' placeholder="此刻想和你说点什么？" aria-label="新的说说" />' +
              '<button class="btn btn-ghost btn-sm" data-action="pick-image" title="添加图片">' +
                icon('image', 16) + '图片</button>' +
              '<button class="btn btn-primary" data-action="add-post">' + icon('send', 15) + '发布</button>' +
            '</div>' +
            '<div class="composer-images" id="post-images"></div>' +
            '<input type="file" id="post-image-input" accept="image/*" multiple hidden />' +
          '</section>' +
          (list.length
            ? '<section class="feed">' + list.map(postCard).join('') + '</section>'
            : '<p class="empty">还没有说说，写第一条吧。</p>');
      }
    }
  };

  function postCard(p) {
    var who = person(p.who);
    var comments = postComments(p.id);
    return '<article class="card post reveal">' +
      '<div class="post-head">' +
        '<span class="post-ava">' + esc(who.emoji) + '</span>' +
        '<div class="post-meta">' +
          '<p class="post-name">' + esc(who.name) + '</p>' +
          '<p class="post-time">' + dayLabel(recordOffset(p)) + ' ' + esc(p.time || '') + '</p>' +
        '</div>' +
        delButton('posts', p.id, p.text) +
      '</div>' +
      (p.text ? '<p class="post-text">' + esc(p.text) + '</p>' : '') +
      (p.images && p.images.length
        ? '<div class="post-imgs">' + p.images.filter(safeImageUrl).map(function (u) {
            return '<a href="' + esc(u) + '" target="_blank" rel="noopener">' +
              '<img class="post-img" src="' + esc(u) + '" loading="lazy" alt="图片" /></a>';
          }).join('') + '</div>'
        : '') +
      '<div class="comments">' +
        (comments.length ? comments.map(function (c) {
          return '<div class="comment">' +
            '<span class="c-name">' + esc(person(c.who).name) + '</span>' +
            '<span class="c-text">' + esc(c.text) + '</span>' +
            delButton('comments', c.id, c.text) +
            '</div>';
        }).join('') : '') +
        '<div class="comment-row">' +
          '<input class="input" data-post="' + p.id + '" data-enter="add-comment" maxlength="200"' +
            ' placeholder="写句评论…" aria-label="评论" />' +
          '<button class="btn btn-ghost btn-sm" data-action="add-comment" data-post="' + p.id + '">发送</button>' +
        '</div>' +
      '</div>' +
      '</article>';
  }

  function ledgerRow(e) {
    var income = e.amount > 0;
    return '<li class="ledger-row">' +
      '<span class="cat">' + esc(e.cat) + '</span>' +
      '<div class="todo-main">' +
        '<p class="todo-text">' + esc(e.title) + '</p>' +
        '<p class="todo-when">' + dayLabel(recordOffset(e)) + ' · ' + esc(e.who) + '</p>' +
      '</div>' +
      '<span class="amount ' + (income ? 'in' : 'out') + '">' +
        (income ? '+' : '−') + num(Math.abs(e.amount)) + '</span>' +
      delButton('ledger', e.id, e.title) +
      '</li>';
  }

  function wishCard(w, delay) {
    var pct = Math.min(100, Math.round((w.saved / w.target) * 100));
    var done = w.status === '已完成';
    return '<article class="card wish reveal" style="--d:' + (delay || 80) + 'ms">' +
      '<div class="wish-top">' +
        '<span class="wish-emoji">' + esc(w.emoji) + '</span>' +
        '<span class="wish-title">' + esc(w.title) + '</span>' +
        '<span class="tag' + (done ? '' : (w.status === '等你一起商量' ? ' warm' : '')) + '" ' +
          'style="margin-left:auto">' + esc(w.status) + '</span>' +
      '</div>' +
      '<div class="bar"><i class="bar-fill' + (done ? '' : '') + '" style="width:' + pct + '%"></i></div>' +
      '<div class="wish-meta"><span>已存 ¥' + num(w.saved, 0) + '</span>' +
        '<span>目标 ¥' + num(w.target, 0) + '</span></div>' +
      '<div class="wish-meta"><span>' + pct + '%</span>' +
        '<span style="display:flex;align-items:center;gap:4px">' +
          (done ? '已经实现啦' : '还差 ¥' + num(Math.max(0, w.target - w.saved), 0)) +
          delButton('wishes', w.id, w.title) + '</span></div>' +
      '</article>';
  }

  function ring(pct) {
    var r = 84;
    var c = 2 * Math.PI * r;
    var offset = c * (1 - pct / 100);
    return '<div class="ring">' +
      '<svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">' +
        '<defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#8FB477"/><stop offset="1" stop-color="#CDE3BD"/>' +
        '</linearGradient></defs>' +
        '<circle cx="100" cy="100" r="' + r + '" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="12"/>' +
        '<circle cx="100" cy="100" r="' + r + '" fill="none" stroke="url(#ringGrad)" stroke-width="12" ' +
          'stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + offset.toFixed(1) + '"/>' +
      '</svg>' +
      '<div class="ring-center">' +
        '<p class="ring-num">' + pct + '%</p>' +
        '<p class="ring-label">YOUR SHARED GOAL</p>' +
      '</div>' +
      '</div>';
  }

  /* --------------------------------------------------------- 登录 / 建号 */

  function authBrand() {
    return '<div class="auth-brand">' +
      '<span class="brand-mark">' + icon('clover', 19) + '</span>' +
      '<span class="brand-text">' +
        '<span class="brand-name">两人小日子</span>' +
        '<span class="brand-sub">OUR LITTLE EVERYDAY</span>' +
      '</span>' +
      '</div>';
  }

  function authSyncRow() {
    // 登录页也显示同步状态：让新人一眼看出这台设备连没连上
    return '<div class="auth-sync">' + syncChip() + '</div>';
  }

  function renderAuth() {
    var app = document.getElementById('app');
    var root = document.getElementById('auth-root');
    if (!root) return;
    if (app) app.hidden = true;
    closeDrawer();
    var tb = document.getElementById('tabbar');
    if (tb) tb.innerHTML = '';
    document.getElementById('modal-root').innerHTML = '';
    document.title = '登录 · 两人小日子';
    // 正在跟服务端核对「这个空间里有没有账号」，先别急着让人重新建号
    if (SYNC.enabled && !SYNC.ready) {
      root.innerHTML = '<div class="auth"><div class="auth-card">' + authBrand() +
        authSyncRow() +
        '<h1 class="auth-title">正在连接我们的空间…</h1>' +
        '<p class="auth-sub">先看看这台设备上的账号是不是最新的。</p>' +
        '</div></div>';
      return;
    }
    root.innerHTML = accounts().length ? loginHtml() : onboardingHtml();
  }

  function onboardingHtml() {
    var slots = [0, 1].map(function (i) {
      var d = authDraft.slots[i];
      return '<div class="auth-slot">' +
        '<div class="slot-head">' +
          '<span class="slot-ava">' + d.emoji + '</span>' +
          '<span class="slot-name">第 ' + (i + 1) + ' 个账号</span>' +
          '<div class="emoji-row">' + EMOJIS.map(function (e) {
            return '<button class="emoji-btn' + (d.emoji === e ? ' on' : '') + '"' +
              ' data-action="pick-emoji" data-slot="' + i + '" data-emoji="' + e + '"' +
              ' aria-label="用 ' + e + ' 做头像">' + e + '</button>';
          }).join('') + '</div>' +
        '</div>' +
        '<div class="field"><label for="auth-name-' + i + '">昵称</label>' +
          '<input class="input" id="auth-name-' + i + '" maxlength="12" data-enter="auth-submit"' +
            ' value="' + esc(d.name) + '" placeholder="' + (i === 0 ? '比如：小熙' : '比如：小雅') + '" /></div>' +
        '<div class="field" style="margin-bottom:0"><label for="auth-pw-' + i + '">密码（至少 4 位）</label>' +
          '<input class="input" id="auth-pw-' + i + '" type="password" maxlength="32" data-enter="auth-submit"' +
            ' value="' + esc(d.pw) + '" placeholder="只有你们两个人知道" /></div>' +
        '</div>';
    }).join('');

    return '<div class="auth"><div class="auth-card">' + authBrand() +
      authSyncRow() +
      authWarn() +
      '<h1 class="auth-title">先建一个只属于你们的空间</h1>' +
      '<p class="auth-sub">两个人各有一个账号，这样账本和心情才知道是谁记下的。' +
      '密码以加盐摘要保存，启用同步后摘要会随加密记录同步。登录用于区分记录身份。</p>' +
      '<div class="auth-slots">' + slots + '</div>' +
      '<p class="auth-error" id="auth-error"></p>' +
      '<div class="auth-foot">' +
        '<span class="auth-links">' +
          '<button class="auth-link" data-action="sync-settings">同步设置</button>' +
          '<button class="auth-link" data-action="import">恢复备份</button>' +
          '<button class="auth-link" data-action="export">导出备份</button>' +
          '<button class="auth-link" data-action="reset-space">清空本机数据</button>' +
        '</span>' +
        '<button class="btn btn-primary" data-action="auth-submit">' + icon('check', 16) + '创建并进入</button>' +
      '</div>' +
      '</div></div>';
  }

  // 建号页上的提醒：防止「云端明明有账号、只是没连上」的时候又建一套
  function authWarn() {
    var cfg = SYNC.cfg || loadSyncCfg();
    var configured = !!(cfg.sbUrl || cfg.url);

    if (SYNC.status === 'offline' || syncBlocked()) {
      var why = {
        offline: '连不上你们的云端',
        needtoken: '云端需要访问口令',
        badkey: '同步口令不对，解不开云端数据',
        dataerror: '记录格式需要检查',
        accountconflict: '本机与云端账号冲突'
      }[SYNC.status];
      return '<div class="auth-warn is-bad">' +
        '<b>' + why + '</b>' +
        (SYNC.lastError ? '<span>' + esc(SYNC.lastError) + '</span>' : '') +
        '<p>先别在下面建号。可能只是网络问题，过一会儿会自动重试；也可以点重试。</p>' +
        '<div class="auth-warn-actions">' +
          '<button class="btn btn-ghost btn-sm" data-action="sync-retry">重试连接</button>' +
          '<button class="btn btn-ghost btn-sm" data-action="sync-settings">同步设置</button>' +
        '</div>' +
        '</div>';
    }

    if (!configured) {
      return '<div class="auth-warn">' +
        '<b>这台设备还没接上你们的空间</b>' +
        '<p>如果空间已经建好了，先点「同步设置」填一次，或者让 TA 把「配置链接」发给你。' +
        '<b>别急着在下面建号</b>——那会多出一套重复账号。</p>' +
        '<div class="auth-warn-actions">' +
          '<button class="btn btn-ghost btn-sm" data-action="sync-settings">去同步设置</button>' +
        '</div>' +
        '</div>';
    }
    return '';
  }

  /* --------------------------------------------------------- 同步自检 */

  function runDiagnostics() {
    var box = document.getElementById('sync-test-result');
    var cfg = syncDraft || SYNC.cfg || loadSyncCfg();
    function say(lines) {
      if (!box) return;
      box.style.whiteSpace = 'pre-wrap';
      box.textContent = lines.join('\n');
    }

    var lines = [];
    lines.push('网址：' + location.host + location.pathname);
    lines.push('打开方式：' + (isStandalone() ? '主屏 App' : '浏览器') + ' · ' + location.protocol);
    lines.push('安全上下文：' + (window.isSecureContext ? '是' : '否') +
      ' · 加密 API：' + (sbReady() ? '可用' : '不可用'));
    lines.push('同步方式：' + cfg.mode + ' · 配置完整：' +
      (cfg.mode === 'supabase'
        ? (cfg.sbUrl && cfg.sbKey && cfg.pass ? '是' : '否（URL/key/口令缺一个）')
        : (cfg.mode === 'server' ? (cfg.url ? '是' : '跟随本页') : '—')));
    lines.push('本机账号：' + accounts().length + ' 个 · 同一空间：' + (cfg.mode === 'supabase' ? sbSpaceId(cfg) : '—'));
    lines.push('最近错误：' + (SYNC.lastError || '无'));
    say(lines.concat(['', '正在测网络…']));

    var checks = [];
    checks.push(fetchWithTimeout('api/ping', { cache: 'no-store' }, 8000)
      .then(function (r) { return '同源 /api/ping → HTTP ' + r.status; })
      .catch(function (e) { return '同源 /api/ping → 不通（' + e.message + '）'; }));

    if (cfg.sbUrl && cfg.sbKey) {
      checks.push(fetchWithTimeout(trimSlashes(cfg.sbUrl) + '/rest/v1/', {
        cache: 'no-store',
        headers: sbHeaders(null, cfg)
      }, 8000).then(function (r) { return 'Supabase → HTTP ' + r.status; })
        .catch(function (e) { return 'Supabase → 连不上（' + e.message + '）'; }));
    }

    Promise.all(checks).then(function (extra) {
      say(lines.concat(extra));
    });
  }

  function loginHtml() {
    var list = accounts();
    var picked = authDraft.pickId || (list[0] && list[0].id);
    return '<div class="auth"><div class="auth-card">' + authBrand() +
      authSyncRow() +
      '<h1 class="auth-title">今天是谁在记录？</h1>' +
      '<p class="auth-sub">选一个账号，输入密码进来。两个人的记录都在同一个空间里，' +
      '谁记的会写在每一条上。</p>' +
      '<div class="pick-grid">' + list.map(function (u) {
        return '<button class="pick' + (u.id === picked ? ' on' : '') + '"' +
          ' data-action="auth-pick" data-id="' + u.id + '" aria-pressed="' + (u.id === picked ? 'true' : 'false') + '">' +
          '<span class="pick-ava">' + esc(u.emoji) + '</span>' +
          '<span class="pick-name">' + esc(u.name) + '</span>' +
          '<span class="pick-note">' + (u.id === picked ? '已选择' : '点我') + '</span>' +
          '</button>';
      }).join('') + '</div>' +
      '<div class="field" style="margin-top:22px"><label for="auth-pw">密码</label>' +
        '<input class="input" id="auth-pw" type="password" maxlength="32" data-enter="auth-submit"' +
          ' placeholder="输入你的密码" /></div>' +
      '<p class="auth-error" id="auth-error"></p>' +
      '<div class="auth-foot">' +
        '<span class="auth-links">' +
          '<button class="auth-link" data-action="sync-settings">同步设置</button>' +
          '<button class="auth-link" data-action="import">恢复备份</button>' +
          '<button class="auth-link" data-action="export">导出备份</button>' +
          '<button class="auth-link" data-action="reset-space">清空本机缓存</button>' +
        '</span>' +
        '<button class="btn btn-primary" data-action="auth-submit">' + icon('arrowRight', 16) + '进入我们的空间</button>' +
      '</div>' +
      '</div></div>';
  }

  function captureDraft() {
    [0, 1].forEach(function (i) {
      var n = document.getElementById('auth-name-' + i);
      var p = document.getElementById('auth-pw-' + i);
      if (n) authDraft.slots[i].name = n.value;
      if (p) authDraft.slots[i].pw = p.value;
    });
  }

  function pickEmoji(el) {
    captureDraft();
    var i = Number(el.dataset.slot) || 0;
    authDraft.slots[i].emoji = el.dataset.emoji;
    renderAuth();
  }

  function authPick(id) {
    authDraft.pickId = id;
    renderAuth();
    var pw = document.getElementById('auth-pw');
    if (pw) pw.focus();
  }

  function authFail(msg) {
    var err = document.getElementById('auth-error');
    if (err) err.textContent = msg;
    toast(msg);
  }

  function submitAuth() {
    var list = accounts();

    if (!list.length) {
      if (state.readError || SYNC.enabled && (!SYNC.verified || syncBlocked())) {
        return authFail('尚未成功核对云端账号，请先检查同步设置，避免重复创建空间。');
      }
      captureDraft();
      var a = authDraft.slots[0];
      var b = authDraft.slots[1];
      var na = a.name.trim();
      var nb = b.name.trim();
      if (!na || !nb) return authFail('两个人的昵称都要填哦。');
      if (na === nb) return authFail('两个人的昵称不能一样，不然分不清谁是谁。');
      if (a.pw.length < 4 || b.pw.length < 4) return authFail('密码至少 4 位。');
      if (a.pw === b.pw) return authFail('两个人的密码最好不一样。');

      var salts = [randomSalt(), randomSalt()];
      Promise.all([hashPassword(a.pw, salts[0]), hashPassword(b.pw, salts[1])]).then(function (hashes) {
        state.auth.accounts = [
          { id: uid('u'), name: na, emoji: a.emoji, salt: salts[0], hash: hashes[0], since: isoDay(today()), updatedAt: Date.now() },
          { id: uid('u'), name: nb, emoji: b.emoji, salt: salts[1], hash: hashes[1], since: isoDay(today()), updatedAt: Date.now() }
        ];
        state.auth.currentId = state.auth.accounts[0].id;
        state.view = 'overview';
        authDraft.pickId = null;
        saveState();
        render();
        toast('空间建好了，欢迎 ' + na + '。');
      });
      return;
    }

    var picked = authDraft.pickId || list[0].id;
    var pwInput = document.getElementById('auth-pw');
    var pw = pwInput ? pwInput.value : '';
    if (!pw) return authFail('请输入密码。');
    var acc = list[indexOfUser(picked)];

    hashPassword(pw, acc.salt).then(function (h) {
      if (h !== acc.hash) {
        if (pwInput) { pwInput.value = ''; pwInput.focus(); }
        return authFail('密码不对，再想想？');
      }
      state.auth.currentId = acc.id;
      saveState();
      render();
      toast('欢迎回来，' + acc.name + '。');
    });
  }

  function doLogout() {
    clearPendingImages();
    closeModal();
    state.auth.currentId = null;
    authDraft.pickId = null;
    saveState();
    render();
    toast('已经退出，下次见。');
  }

  function resetSpace() {
    if (!window.confirm('会清空这台设备上的所有记录和账号，确定要重新开始吗？')) return;
    try {
      localStorage.removeItem(CONFIG.storageKey);
    } catch (err) { /* 忽略 */ }
    clearPendingImages();
    state = seed();
    authDraft = {
      slots: [
        { name: '', emoji: EMOJIS[0], pw: '' },
        { name: '', emoji: EMOJIS[1], pw: '' }
      ],
      pickId: null
    };
    closeModal();
    syncInit();
    render();
    toast('已清空本机缓存；同步开启时会重新读取云端记录。');
  }

  function openAccountModal() {
    var me = currentUser();
    if (!me) return;
    var list = accounts();
    document.getElementById('modal-root').innerHTML =
      '<div class="modal-scrim" data-action="close-modal">' +
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
          '<div class="modal-head">' +
            '<div><h2 class="modal-title" id="modal-title">账号</h2>' +
            '<p class="modal-sub">这个空间里一共 ' + list.length + ' 个账号，记录是共享的。</p></div>' +
            '<button class="icon-btn" data-action="close-modal" aria-label="关闭">' + icon('x', 18) + '</button>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="account-now">' +
            '<span class="pick-ava">' + esc(me.emoji) + '</span>' +
            '<div>' +
              '<p class="slot-name">' + esc(me.name) + '</p>' +
              '<p class="pick-note">当前登录 · ' + (moodOf(currentWho(), 0) ? '今天的记录者' : '还没有记录今天的心情') + '</p>' +
            '</div>' +
            '<button class="btn btn-ghost btn-sm" data-action="change-pw" style="margin-left:auto">修改密码</button>' +
          '</div>' +
          '<div class="sync-row">' +
            syncChip() +
            '<div class="sync-actions">' +
              '<button class="btn btn-ghost" data-action="sync-now">' + icon('share', 15) + '立即同步</button>' +
              '<button class="btn btn-ghost" data-action="import">' + icon('download', 15) + '导入记录</button>' +
              '<button class="btn btn-ghost" data-action="export">' + icon('upload', 15) + '导出备份</button>' +
            '</div>' +
          '</div>' +
          '<p class="sync-hint" id="sync-hint">' + syncHint() + '</p>' +
          '</div>' +
          '<div class="modal-actions">' +
            '<button class="btn btn-ghost" data-action="logout">' + icon('users', 16) + '切换账号 / 退出</button>' +
            '<button class="btn btn-primary" data-action="close-modal">继续记录</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* --------------------------------------------------------------- 渲染 */

  function render() {
    if (!currentUser()) { renderAuth(); return; }
    document.getElementById('auth-root').innerHTML = '';
    document.getElementById('app').hidden = false;
    var v = VIEWS[state.view] || VIEWS.overview;
    document.getElementById('sidebar').innerHTML = sidebar();
    document.getElementById('topbar').innerHTML = topbar();
    document.getElementById('view').innerHTML = v.render();
    renderPendingImages();
    var tb = document.getElementById('tabbar');
    if (tb) tb.innerHTML = tabbar();
    document.title = v.title + ' · 两人小日子';
  }

  function setHash(view) {
    try {
      history.replaceState(null, '', '#/' + view);
    } catch (err) {
      // 以 file:// 直接打开时浏览器不允许改写历史记录，忽略即可
    }
  }

  function go(view) {
    if (!VIEWS[view]) return;
    state.view = view;
    saveState();
    closeDrawer();
    render();
    setHash(view);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  /* --------------------------------------------------------------- 弹窗 */

  var modal = { kind: 'expense', mood: '🙂' };

  function segBtn(kind, label) {
    return '<button class="seg-btn' + (modal.kind === kind ? ' on' : '') + '"' +
      ' data-action="switch-kind" data-kind="' + kind + '">' + label + '</button>';
  }

  function modalFields() {
    if (modal.kind === 'todo') {
      return '<div class="field"><label for="modal-input">想一起做的一件小事</label>' +
        '<input class="input" id="modal-input" data-enter="save-modal" placeholder="比如：周末去逛花市" /></div>';
    }
    if (modal.kind === 'mood') {
      return '<div class="field"><label>今天的情绪</label>' +
        '<div class="mood-picker">' + MOODS.map(function (m) {
          return '<button class="mood-btn' + (modal.mood === m.emoji ? ' on' : '') + '"' +
            ' data-action="pick-mood" data-mood="' + m.emoji + '"><span>' + m.emoji + '</span>' +
            '<span>' + m.label + '</span></button>';
        }).join('') + '</div></div>' +
        '<div class="field"><label for="modal-input">想说的话</label>' +
        '<input class="input" id="modal-input" data-enter="save-modal" placeholder="一句话就够，我懂。" /></div>';
    }
    return '<div class="field"><label for="modal-input">这笔钱花在了哪里</label>' +
        '<input class="input" id="modal-input" data-enter="save-modal" placeholder="比如：一起喝的奶茶" /></div>' +
      '<div class="field"><label for="modal-amount">金额（元）</label>' +
        '<input class="input" id="modal-amount" type="number" min="0" step="0.01" data-enter="save-modal" placeholder="0.00" /></div>';
  }

  function openModal(kind) {
    modal.kind = (kind === 'expense' || kind === 'todo' || kind === 'mood') ? kind
      : (kind === 'menu' ? 'expense' : (kind || 'expense'));
    document.getElementById('modal-root').innerHTML =
      '<div class="modal-scrim" data-action="close-modal">' +
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
          '<div class="modal-head">' +
            '<div><h2 class="modal-title" id="modal-title">记录一下</h2>' +
            '<p class="modal-sub">写下来的日子，才不会被忘记。</p></div>' +
            '<button class="icon-btn" data-action="close-modal" aria-label="关闭">' + icon('x', 18) + '</button>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="seg">' + segBtn('expense', '记一笔') + segBtn('todo', '记件小事') + segBtn('mood', '记句心情') + '</div>' +
            modalFields() +
          '</div>' +
          '<div class="modal-actions">' +
            '<button class="btn btn-ghost" data-action="close-modal">再想想</button>' +
            '<button class="btn btn-primary" data-action="save-modal">' + icon('check', 16) + '收进手账</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    var input = document.getElementById('modal-input');
    if (input) input.focus();
  }

  function closeModal() {
    document.getElementById('modal-root').innerHTML = '';
    if (pendingRender) setTimeout(safeRender, 0);
  }

  function saveModal() {
    var input = document.getElementById('modal-input');
    var value = input ? input.value.trim() : '';
    var now = new Date();
    var time = pad2(now.getHours()) + ':' + pad2(now.getMinutes());

    if (modal.kind === 'expense') {
      var amountEl = document.getElementById('modal-amount');
      var amount = money(amountEl && amountEl.value);
      if (!amount) { toast('金额还没填呢～'); return; }
      state.ledger.push({
        id: uid('l'), title: value || '一笔小开销', cat: '💸',
        who: currentName(), amount: -amount, day: 0, date: isoDay(today()), updatedAt: Date.now()
      });
      saveState(); closeModal(); render();
      toast('记下了 ¥' + num(amount) + '，谢谢你为这个家花的钱。');
      return;
    }

    if (modal.kind === 'todo') {
      if (!value) { toast('写点什么吧～'); return; }
      state.todos.push({ id: uid('t'), text: value, when: '今天', dueDate: isoDay(today()), tag: '一起', done: false, updatedAt: Date.now() });
      saveState(); closeModal(); render();
      toast('加进今天的小事里了。');
      return;
    }

    var who = currentWho();
    var existing = moodOf(who, 0);
    if (existing) {
      existing.mood = modal.mood;
      existing.note = value || existing.note;
      existing.time = time;
      existing.updatedAt = editTime(existing);
    } else {
      state.moods.push({
        id: uid('m'), day: 0, date: isoDay(today()), who: who, mood: modal.mood,
        note: value || '今天也想和你说说话。', time: time, updatedAt: Date.now()
      });
    }
    saveState(); closeModal(); render();
    toast('心情已经收好了。');
  }

  /* --------------------------------------------------------- 交互动作 */

  function toggleTodo(id) {
    var t = state.todos.filter(function (x) { return x.id === id; })[0];
    if (!t) return;
    t.done = !t.done;
    t.updatedAt = editTime(t);
    saveState();
    render();
    if (t.done) toast('完成啦：' + t.text);
  }

  function addTodoFromForm() {
    var el = document.getElementById('new-todo');
    if (!el) return;
    var value = el.value.trim();
    if (!value) { toast('写点什么吧～'); return; }
    var dueDate = valueOf('new-todo-date') || isoDay(today());
    if (!validDay(dueDate)) { toast('请选择有效的待办日期。'); return; }
    state.todos.push({ id: uid('t'), text: value, when: '今天', dueDate: dueDate, tag: '一起', done: false, updatedAt: Date.now() });
    saveState(); render(); toast('加进今天的小事里了。');
  }

  function addWishFromForm() {
    var el = document.getElementById('new-wish');
    if (!el) return;
    var value = el.value.trim();
    if (!value) { toast('写一个心愿吧～'); return; }
    var targetEl = document.getElementById('new-wish-target');
    var target = targetEl && targetEl.value ? money(targetEl.value) : 2000;
    if (!target) { toast('目标请填写大于 0、最多十亿元的金额。'); return; }
    state.wishes.push({ id: uid('w'), emoji: '✨', title: value, target: target, saved: 0, savedBase: 0, status: '等你一起商量', updatedAt: Date.now() });
    saveState(); render(); toast('心愿已经放进清单了，目标 ¥' + num(target, 0) + '。');
  }

  function deleteRecord(kind, id) {
    var rec = findRecord(kind, id);
    if (!rec) return;
    var label = rec.text || rec.title || rec.note || rec.who || '这条记录';
    if (!window.confirm('删除「' + label + '」？\n两台设备都会一起删掉。')) return;
    if (kind === 'posts') state.comments.forEach(function (c) {
      if (c.postId === id && !c.deleted) killRecord('comments', c.id);
    });
    if (!killRecord(kind, id)) return;
    saveState();
    render();
    toast('已经删掉了。');
  }

  function addLedgerFromForm() {
    var titleEl = document.getElementById('new-ledger');
    var amountEl = document.getElementById('new-ledger-amount');
    var kindEl = document.getElementById('new-ledger-kind');
    var title = titleEl ? titleEl.value.trim() : '';
    var amount = money(amountEl && amountEl.value);
    var income = !!(kindEl && kindEl.value === 'in');
    if (!title) { toast('这笔钱是干嘛的？写一句吧。'); return; }
    if (!amount) { toast('金额还没填。'); return; }
    var date = valueOf('new-ledger-date') || isoDay(today());
    if (!validDay(date) || date > isoDay(today())) { toast('记账日期请选择今天或之前的日期。'); return; }
    state.ledger.push({
      id: uid('l'), title: title, cat: income ? '💰' : '💸',
      who: currentName(), amount: income ? amount : -amount, day: 0, date: date, updatedAt: Date.now()
    });
    saveState(); render();
    toast((income ? '记下一笔收入 ¥' : '记下一笔支出 ¥') + num(amount));
  }

  function addSavingFromForm() {
    var el = document.getElementById('new-saving');
    var amount = money(el && el.value);
    if (!amount) { toast('想存多少？填个数字。'); return; }
    saveMoney(amount, selectedWishId());
  }

  function addPostFromForm() {
    var el = document.getElementById('new-post');
    var text = el ? el.value.trim() : '';
    if (pendingImages.some(function (i) { return i.uploading; })) {
      toast('还有图片在上传，等一秒再发。');
      return;
    }
    var images = pendingImages.map(function (i) { return i.url; })
      .filter(function (u) { return u && u.indexOf('blob:') !== 0; });
    if (!text && !images.length) { toast('写点什么或者加张图再发布吧。'); return; }
    var now = new Date();
    state.posts.push({
      id: uid('p'), who: currentWho(), text: text, images: images, day: 0, date: isoDay(today()),
      time: pad2(now.getHours()) + ':' + pad2(now.getMinutes()), updatedAt: Date.now()
    });
    clearPendingImages();
    saveState(); render();
    toast(images.length ? '发出去了，' + images.length + ' 张图。' : '已经发出去了。');
  }

  /* --------------------------------------------------------- 说说配图 */

  var pendingImages = [];

  function clearPendingImages() {
    pendingImages.forEach(function (it) { if (it.preview) URL.revokeObjectURL(it.preview); });
    pendingImages = [];
  }

  function compressOnce(file, maxSide, quality) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        try {
          var scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          var w = Math.max(1, Math.round(img.width * scale));
          var h = Math.max(1, Math.round(img.height * scale));
          var canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          canvas.toBlob(function (blob) {
            URL.revokeObjectURL(url);
            if (blob) resolve(blob); else reject(new Error('no blob'));
          }, 'image/jpeg', quality);
        } catch (err) {
          URL.revokeObjectURL(url);
          reject(err);
        }
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('load failed'));
      };
      img.src = url;
    });
  }

  // 手机原图动辄几 MB，先压到能传的大小
  function compressImage(file) {
    return compressOnce(file, 1400, 0.72).then(function (blob) {
      if (blob && blob.size > 450 * 1024) return compressOnce(file, 1000, 0.58);
      return blob;
    });
  }

  function blobToDataUrl(blob) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(String(fr.result)); };
      fr.onerror = function () { reject(new Error('read failed')); };
      fr.readAsDataURL(blob);
    });
  }

  function uploadToStorage(blob) {
    var cfg = SYNC.cfg;
    var bucket = cfg.mediaBucket || 'media';
    var name = sbSpaceId(cfg) + '/' + uid('p') + '.jpg';
    var base = trimSlashes(cfg.sbUrl);
    return fetchWithTimeout(base + '/storage/v1/object/' + bucket + '/' + name, {
      method: 'POST',
      headers: sbHeaders({
        'Content-Type': 'image/jpeg',
        'x-upsert': 'false',
        'cache-control': 'max-age=31536000'
      }, cfg),
      body: blob
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return base + '/storage/v1/object/public/' + bucket + '/' + name;
    });
  }

  // 配了 Supabase 就传到 Storage（帖子里只存链接，同步数据不会被图片撑大）；
  // 没配就保存内联图片；开启同步后也会随记录同步，注意本机容量。
  function saveImage(blob) {
    var cfg = SYNC.cfg || {};
    if (activeMode() === 'supabase' && cfg.sbUrl && cfg.sbKey) {
      return uploadToStorage(blob);
    }
    return blobToDataUrl(blob);
  }

  function renderPendingImages() {
    var box = document.getElementById('post-images');
    if (!box) return;
    box.innerHTML = pendingImages.map(function (it, i) {
      return '<div class="thumb' + (it.uploading ? ' uploading' : '') + '">' +
        '<img src="' + esc(it.url) + '" alt="" />' +
        (it.uploading ? '<span class="thumb-tip">上传中…</span>' : '') +
        '<button class="thumb-x" data-action="drop-image" data-i="' + i + '" aria-label="移除图片">' +
        icon('x', 12) + '</button></div>';
    }).join('');
  }

  function pickImage() {
    var input = document.getElementById('post-image-input');
    if (input) input.click();
  }

  function onImagePicked(input) {
    var files = Array.prototype.slice.call(input.files || [])
      .filter(function (f) { return /^image\//.test(f.type); });
    input.value = '';
    if (!files.length) return;
    if (pendingImages.length + files.length > 3) {
      toast('一条说说最多 3 张图。');
      return;
    }
    files.forEach(function (file) {
      var preview = URL.createObjectURL(file);
      var item = { url: preview, preview: preview, uploading: true };
      pendingImages.push(item);
      renderPendingImages();
      compressImage(file).then(function (blob) {
        return saveImage(blob).then(function (finalUrl) {
          URL.revokeObjectURL(preview);
          if (pendingImages.indexOf(item) < 0) return;
          item.url = finalUrl;
          item.uploading = false;
          renderPendingImages();
        });
      }).catch(function () {
        URL.revokeObjectURL(preview);
        var index = pendingImages.indexOf(item);
        if (index < 0) return;
        pendingImages.splice(index, 1);
        renderPendingImages();
        toast('图片处理或上传失败，请检查网络及 Storage 权限后重新选择。');
      });
    });
  }

  function dropImage(index) {
    var i = Number(index);
    if (isNaN(i) || !pendingImages[i]) return;
    if (pendingImages[i].preview) URL.revokeObjectURL(pendingImages[i].preview);
    pendingImages.splice(i, 1);
    renderPendingImages();
  }

  /* ------------------------------------------------------- 改存钱目标 */

  function openGoalModal() {
    var goal = state.saving.goal || 20000;
    document.getElementById('modal-root').innerHTML =
      '<div class="modal-scrim" data-action="close-modal">' +
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
          '<div class="modal-head">' +
            '<div><h2 class="modal-title" id="modal-title">改存钱目标</h2>' +
            '<p class="modal-sub">两个人共用一个目标，改了会同步到另一台设备。</p></div>' +
            '<button class="icon-btn" data-action="close-modal" aria-label="关闭">' + icon('x', 18) + '</button>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="field" style="margin-bottom:0"><label for="goal-input">目标金额（元）</label>' +
              '<input class="input" id="goal-input" type="number" min="1" step="100" value="' + goal + '" data-enter="save-goal" /></div>' +
            '<p class="auth-error" id="goal-error"></p>' +
          '</div>' +
          '<div class="modal-actions">' +
            '<button class="btn btn-ghost" data-action="close-modal">取消</button>' +
            '<button class="btn btn-primary" data-action="save-goal">' + icon('check', 16) + '保存目标</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    var el = document.getElementById('goal-input');
    if (el) { el.focus(); el.select(); }
  }

  function saveGoal() {
    var el = document.getElementById('goal-input');
    var v = money(el && el.value);
    if (!v || v < 1) {
      var errBox = document.getElementById('goal-error');
      if (errBox) errBox.textContent = '填一个大于 0 的金额。';
      toast('填一个大于 0 的金额。');
      return;
    }
    state.saving.goal = Math.round(v);
    state.saving.updatedAt = editTime(state.saving);
    saveState();
    closeModal();
    render();
    toast('目标改成 ¥' + num(state.saving.goal, 0) + ' 了。');
  }

  function addCommentFrom(el) {
    var postId = el && el.dataset ? el.dataset.post : '';
    if (!postId) return;
    var input = document.querySelector('[data-post="' + postId + '"][data-enter="add-comment"]');
    var text = input ? input.value.trim() : '';
    if (!text) { toast('写句评论吧。'); return; }
    var now = new Date();
    state.comments.push({
      id: uid('c'), postId: postId, who: currentWho(), text: text, day: 0, date: isoDay(today()),
      time: pad2(now.getHours()) + ':' + pad2(now.getMinutes()), updatedAt: Date.now()
    });
    saveState(); render();
    toast('评论已经加上。');
  }

  /* --------------------------------------------------- 装成 App（PWA） */

  var installPrompt = null;

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    installPrompt = e;
  });
  window.addEventListener('appinstalled', function () {
    installPrompt = null;
    toast('装好啦，桌面上的图标就是它。');
  });

  function isStandalone() {
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
    return navigator.standalone === true;
  }

  function isIOSDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function swReadyText() {
    if (!('serviceWorker' in navigator)) return '这个浏览器不支持离线缓存';
    return navigator.serviceWorker.controller
      ? '已启用（离线可用）'
      : '已注册，刷新一次后生效';
  }

  function openInstallModal() {
    var standalone = isStandalone();
    var ios = isIOSDevice();
    var steps = ios
      ? '<ol class="install-steps">' +
          '<li>用 <b>Safari</b> 打开这个网址（微信内置浏览器不行）</li>' +
          '<li>点底部 <b>分享</b> 按钮 → <b>添加到主屏幕</b></li>' +
          '<li>桌面上会出现三叶草图标，点开就是全屏</li>' +
        '</ol>'
      : '<ol class="install-steps">' +
          '<li>点浏览器右上角的 <b>⋮</b>（或 <b>≡</b>）</li>' +
          '<li>找 <b>「安装应用」</b> 或 <b>「添加到主屏幕」</b></li>' +
          '<li>如果「安装应用」点了没反应：那是这台手机的系统拦住了安装包（国产安卓常见），' +
            '改用 <b>「添加到主屏幕」</b> 建快捷方式就行，差别只是打开时可能有地址栏</li>' +
        '</ol>';

    document.getElementById('modal-root').innerHTML =
      '<div class="modal-scrim" data-action="close-modal">' +
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
          '<div class="modal-head">' +
            '<div><h2 class="modal-title" id="modal-title">装成 App</h2>' +
            '<p class="modal-sub">加到主屏幕后就没有地址栏了，数据还是同一份。</p></div>' +
            '<button class="icon-btn" data-action="close-modal" aria-label="关闭">' + icon('x', 18) + '</button>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="install-status">' +
              '<p><span>现在是不是 App 模式</span><b>' + (standalone ? '是，已经在全屏运行' : '不是，还在浏览器里') + '</b></p>' +
              '<p><span>离线缓存</span><b>' + swReadyText() + '</b></p>' +
              '<p><span>一键安装按钮</span><b>' + (standalone ? '—' : (installPrompt ? '可用' : '浏览器没给（用下面的方法）')) + '</b></p>' +
            '</div>' +
            (installPrompt && !standalone
              ? '<div style="margin-top:16px">' +
                  '<button class="btn btn-primary" data-action="install-app">' + icon('download', 16) + '安装到主屏幕</button>' +
                '</div>'
              : '') +
            '<p class="sync-hint" style="margin-top:16px">手动装：</p>' +
            steps +
          '</div>' +
          '<div class="modal-actions">' +
            '<button class="btn btn-ghost" data-action="close-modal">知道了</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function installApp() {
    if (!installPrompt) { toast('浏览器没给一键安装的入口，用下面的手动方法。'); return; }
    var p = installPrompt;
    installPrompt = null;
    p.prompt();
    if (p.userChoice) {
      p.userChoice.then(function (res) {
        if (res && res.outcome === 'accepted') toast('装好了。');
        closeModal();
      }).catch(function () { closeModal(); });
    } else {
      closeModal();
    }
  }

  function tabbar() {
    var items = [
      { view: 'overview', label: '总览', ic: 'grid' },
      { view: 'todos', label: '待办', ic: 'listChecks' },
      { view: 'ledger', label: '记账', ic: 'wallet' },
      { view: 'posts', label: '说说', ic: 'message' },
      { view: '__more', label: '更多', ic: 'menu' }
    ];
    return '<nav class="tabbar" aria-label="底部导航">' + items.map(function (it) {
      var more = it.view === '__more';
      var active = !more && state.view === it.view;
      return '<button class="tab' + (active ? ' active' : '') + '"' +
        ' data-action="' + (more ? 'open-drawer' : 'nav') + '"' +
        (more ? '' : ' data-view="' + it.view + '"') +
        ' aria-current="' + (active ? 'page' : 'false') + '">' +
        icon(it.ic, 20) + '<span>' + it.label + '</span></button>';
    }).join('') + '</nav>';
  }

  function setMood(who, mood) {
    var existing = moodOf(who, 0);
    var now = new Date();
    var time = pad2(now.getHours()) + ':' + pad2(now.getMinutes());
    if (existing) {
      existing.mood = mood;
      existing.time = time;
      existing.updatedAt = editTime(existing);
    } else {
      state.moods.push({
        id: uid('m'), day: 0, date: isoDay(today()), who: who, mood: mood,
        note: mood === '😔' ? '有点不开心，但没关系。' : '今天也记一笔。', time: time,
        updatedAt: Date.now()
      });
    }
    saveState(); render();
    toast(person(who).name + ' 今天的心情是 ' + mood);
  }

  function saveMoney(amount, wishId) {
    amount = money(amount);
    if (!amount) { toast('请填写有效的正数金额。'); return; }
    var wish = wishId ? findRecord('wishes', wishId) : null;
    if (wishId && (!wish || wish.deleted)) { toast('这个心愿已被删除，请重新选择。'); return; }
    var now = new Date();
    var time = pad2(now.getHours()) + ':' + pad2(now.getMinutes());
    state.savingsLog.push({
      id: uid('s'), who: currentName(), amount: amount, day: 0, date: isoDay(today()), time: time,
      wishId: wishId || '', updatedAt: Date.now()
    });
    state.saving.saved = savedTotal();
    saveState(); render();
    toast(wish
      ? '存下 ¥' + num(amount, 0) + '，记在「' + wish.title + '」上了。'
      : '存下 ¥' + num(amount, 0) + '，离目标更近了一点。');
  }

  function selectedWishId() {
    var sel = document.getElementById('saving-wish');
    return sel ? sel.value : '';
  }

  function pickWishToSave(id) {
    var sel = document.getElementById('saving-wish');
    if (sel) sel.value = id;
    var amt = document.getElementById('new-saving');
    if (amt) { amt.focus(); if (amt.select) amt.select(); }
  }

  function wishProgressRow(w) {
    var pct = w.target ? Math.min(100, Math.round((w.saved / w.target) * 100)) : 0;
    return '<li class="wish-row">' +
      '<span class="cat">' + esc(w.emoji) + '</span>' +
      '<div class="todo-main">' +
        '<p class="todo-text">' + esc(w.title) + '</p>' +
        '<div class="bar" style="margin:7px 0 6px"><i class="bar-fill" style="width:' + pct + '%"></i></div>' +
        '<p class="todo-when">已存 ¥' + num(w.saved, 0) + ' / 目标 ¥' + num(w.target, 0) + ' · ' + pct + '%</p>' +
      '</div>' +
      '<button class="btn btn-ghost btn-sm" data-action="pick-wish" data-wish="' + w.id + '">存一点</button>' +
      '</li>';
  }

  function exportData() {
    var payload = Object.assign({ schemaVersion: 2, exportedAt: new Date().toISOString(), space: CONFIG.spaceName }, syncedPayload());
    var contents = state.readError ? localStorage.getItem(CONFIG.storageKey) : JSON.stringify(payload, null, 2);
    var blob = new Blob([contents], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = '我们的手账-' + isoDay(today()) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast('已经导出成 JSON 文件了。');
  }

  function shareSpace() {
    var text = '两人小日子 · 我们在一起的第 ' + daysTogether() + ' 天。';
    var link = location.origin + location.pathname + '#/' + state.view;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text + ' ' + link).then(function () {
        toast('空间链接已经复制好啦。');
      }).catch(function () { toast(text); });
    } else {
      toast(text);
    }
  }

  function toast(msg) {
    var wrap = document.getElementById('toast');
    if (!wrap) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = icon('check', 15) + '<span>' + esc(msg) + '</span>';
    wrap.appendChild(el);
    setTimeout(function () {
      el.classList.add('out');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 240);
    }, 2300);
  }

  /* --------------------------------------------------------- 抽屉与遮罩 */

  function openDrawer() {
    document.getElementById('app').classList.add('drawer-open');
    document.getElementById('scrim').hidden = false;
    document.body.classList.add('drawer-lock');
  }

  function closeDrawer() {
    var app = document.getElementById('app');
    if (app) app.classList.remove('drawer-open');
    var scrim = document.getElementById('scrim');
    if (scrim) scrim.hidden = true;
    document.body.classList.remove('drawer-lock');
  }

  /* ------------------------------------------------------------- 事件 */

  function run(action, el) {
    switch (action) {
      case 'nav':
      case 'go':
        go(el.dataset.view);
        break;
      case 'toggle-todo':
        toggleTodo(el.dataset.id);
        break;
      case 'quick':
        openModal(el.dataset.kind);
        break;
      case 'switch-kind':
        modal.kind = el.dataset.kind;
        openModal(modal.kind);
        break;
      case 'pick-mood':
        modal.mood = el.dataset.mood;
        openModal('mood');
        break;
      case 'save-modal':
        saveModal();
        break;
      case 'close-modal':
        closeModal();
        break;
      case 'set-mood':
        setMood(el.dataset.who, el.dataset.mood);
        break;
      case 'save-money':
        saveMoney(Number(el.dataset.amount) || 0, selectedWishId());
        break;
      case 'pick-wish':
        pickWishToSave(el.dataset.wish);
        break;
      case 'add-todo':
        addTodoFromForm();
        break;
      case 'add-wish':
        addWishFromForm();
        break;
      case 'export':
        exportData();
        break;
      case 'share':
        shareSpace();
        break;
      case 'open-drawer':
        openDrawer();
        break;
      case 'close-drawer':
        closeDrawer();
        break;
      case 'account':
        openAccountModal();
        break;
      case 'sync-settings':
        openSyncModal();
        break;
      case 'sync-mode':
        captureSyncForm();
        syncDraft.mode = el.dataset.mode;
        renderSyncModal();
        break;
      case 'sync-test':
        testSyncConnection();
        break;
      case 'sync-save':
        saveSyncSettings();
        break;
      case 'generate-access-token':
        captureSyncForm();
        syncDraft.accessToken = randomSalt() + randomSalt() + randomSalt();
        renderSyncModal();
        toast('已生成访问密钥；已有空间请先完成 SQL 权限迁移，再保存同步设置。');
        break;
      case 'copy-sql':
        copySql();
        break;
      case 'copy-setup':
        copySetupLink();
        break;
      case 'del':
        deleteRecord(el.dataset.kind, el.dataset.id);
        break;
      case 'add-ledger':
        addLedgerFromForm();
        break;
      case 'add-saving':
        addSavingFromForm();
        break;
      case 'add-post':
        addPostFromForm();
        break;
      case 'add-comment':
        addCommentFrom(el);
        break;
      case 'pick-image':
        pickImage();
        break;
      case 'drop-image':
        dropImage(el.dataset.i);
        break;
      case 'goal':
        openGoalModal();
        break;
      case 'save-goal':
        saveGoal();
        break;
      case 'copy-media-sql':
        copyMediaSql();
        break;
      case 'sync-diag':
        runDiagnostics();
        break;
      case 'sync-retry':
        syncInit();
        toast('正在重新连接…');
        break;
      case 'install':
        openInstallModal();
        break;
      case 'install-app':
        installApp();
        break;
      case 'change-pw':
        openPasswordModal();
        break;
      case 'save-pw':
        savePassword();
        break;
      case 'sync-now':
        if (!SYNC.enabled) { openSyncModal(); break; }
        if (syncBlocked()) { openSyncModal(); break; }
        SYNC.nextTry = 0;
        tick();
        toast('正在同步…');
        break;
      case 'import':
        closeModal();
        importRecords();
        break;
      case 'logout':
        doLogout();
        break;
      case 'reset-space':
        resetSpace();
        break;
      case 'auth-submit':
        submitAuth();
        break;
      case 'auth-pick':
        authPick(el.dataset.id);
        break;
      case 'pick-emoji':
        pickEmoji(el);
        break;
      case 'mock':
        toast(el.dataset.msg || '这个功能还在路上～');
        break;
      default:
        break;
    }
  }

  document.addEventListener('click', function (ev) {
    var el = ev.target.closest ? ev.target.closest('[data-action]') : null;
    if (!el) return;
    var action = el.dataset.action;
    // 只有点到遮罩本身才关闭弹窗；点弹窗内容（含关闭按钮）交给各自的 data-action 处理
    if (action === 'close-modal' && el.classList.contains('modal-scrim') && ev.target !== el) return;
    ev.preventDefault();
    run(action, el);
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.isComposing || ev.keyCode === 229) return;
    if (ev.key === 'Enter' && ev.target && ev.target.dataset && ev.target.dataset.enter) {
      ev.preventDefault();
      run(ev.target.dataset.enter, ev.target);
      return;
    }
    if (ev.key === 'Escape') {
      closeModal();
      closeDrawer();
    }
  });

  window.addEventListener('hashchange', function () {
    var v = location.hash.replace(/^#\/?/, '');
    if (VIEWS[v] && v !== state.view) {
      state.view = v;
      render();
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  });

  /* --------------------------------------------------------------- 启动 */

  function init() {
    var fromHash = location.hash.replace(/^#\/?/, '');
    if (VIEWS[fromHash]) state.view = fromHash;
    if (!VIEWS[state.view]) state.view = 'overview';
    applySetupFromHash();
    syncInit();
    render();
    if (!location.hash) setHash(state.view);
    registerSW();
    var day = isoDay(today());
    setInterval(function () {
      if (!document.hidden && day !== isoDay(today())) { day = isoDay(today()); safeRender(); }
    }, 60000);
  }

  // 装成 App 用：注册 Service Worker（file:// 下浏览器不允许，跳过即可）
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
    try {
      navigator.serviceWorker.register('sw.js').catch(function () { /* 失败不影响使用 */ });
    } catch (err) { /* 忽略 */ }
  }

  document.addEventListener('focusout', function () {
    if (!pendingRender) return;
    setTimeout(safeRender, 0);
  });

  document.addEventListener('change', function (ev) {
    if (ev.target && ev.target.id === 'post-image-input') onImagePicked(ev.target);
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== CONFIG.storageKey || !event.newValue || state.readError) return;
    try {
      var next = mergeStates(state, JSON.parse(event.newValue));
      if (JSON.stringify(syncedPayload(next)) === JSON.stringify(syncedPayload())) return;
      state = next;
      saveState();
      safeRender();
    } catch (err) { toast('另一个标签页的数据无法合并，请先导出备份。'); }
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
