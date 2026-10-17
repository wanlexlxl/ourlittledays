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

  function entryDate(e) {
    var d = today();
    d.setDate(d.getDate() + e.day);
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
    return (prefix || 'x') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
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
    // 所有示例记录的 day 都是「距今几天」，并收敛到本月内，保证首次打开时数据好看
    var monthRoom = Math.max(1, today().getDate() - 1);
    var ago = function (n) { return -Math.min(n, monthRoom); };

    return {
      view: 'overview',
      auth: { accounts: [], currentId: null },
      todos: [
        { id: 't1', text: '一起去超市补充冰箱', when: '今天', tag: '一起', done: false },
        { id: 't2', text: '把阳台的花浇一下', when: '今天', tag: '一起', done: false },
        { id: 't3', text: '一起做一顿晚饭', when: '今天', tag: '一起', done: false },
        { id: 't4', text: '帮小雅取快递', when: '明天', tag: '小熙', done: false },
        { id: 't5', text: '整理上个月的照片', when: '本周', tag: '一起', done: true }
      ],
      ledger: [
        { id: 'l1', title: '楼下咖啡', cat: '☕', who: '小熙', amount: -32, day: 0 },
        { id: 'l2', title: '路边的花', cat: '💐', who: '小熙', amount: -46.5, day: 0 },
        { id: 'l3', title: '两个人的早餐', cat: '🥐', who: '小雅', amount: -18, day: 0 },
        { id: 'l4', title: '地铁', cat: '🚇', who: '小熙', amount: -6, day: 0 },
        { id: 'l5', title: '水果', cat: '🍑', who: '小雅', amount: -24, day: 0 },
        { id: 'l6', title: '外卖晚餐', cat: '🍜', who: '小雅', amount: -121, day: ago(1) },
        { id: 'l7', title: '超市采购', cat: '🛒', who: '小熙', amount: -386.4, day: ago(2) },
        { id: 'l8', title: '电影票两张', cat: '🎬', who: '小雅', amount: -98, day: ago(4) },
        { id: 'l9', title: '日用品', cat: '🧴', who: '小熙', amount: -148.6, day: ago(6) },
        { id: 'l10', title: '水电燃气', cat: '💡', who: '小熙', amount: -180, day: ago(8) },
        { id: 'l11', title: '房租', cat: '🏠', who: '小熙', amount: -1800, day: ago(11) },
        { id: 'l12', title: '小雅的工资', cat: '💰', who: '小雅', amount: 12000, day: ago(9) }
      ],
      wishes: [
        { id: 'w1', emoji: '🏝️', title: '一起去看海', target: 6000, saved: 2400, status: '进行中' },
        { id: 'w2', emoji: '📷', title: '买一台拍立得', target: 1200, saved: 1200, status: '已完成' },
        { id: 'w3', emoji: '🎂', title: '给小雅过生日', target: 2000, saved: 600, status: '等你一起商量' },
        { id: 'w4', emoji: '🪴', title: '阳台改造成小花园', target: 3000, saved: 1200, status: '进行中' }
      ],
      saving: { goal: 20000, saved: 6800 },
      savingsLog: [
        { id: 's1', who: '小熙', amount: 1000, day: ago(6) },
        { id: 's2', who: '小雅', amount: 800, day: ago(13) },
        { id: 's3', who: '小熙', amount: 5000, day: ago(21) }
      ],
      moods: [
        { id: 'm1', day: 0, who: 'a', mood: '🥰', note: '有你在的日子，普通也很甜。', time: '12:40' },
        { id: 'm2', day: 0, who: 'b', mood: '🙂', note: '今天有点累，但回家看到你就好了。', time: '21:05' },
        { id: 'm3', day: ago(1), who: 'a', mood: '😄', note: '晚上一起做了番茄意面，意外地成功。', time: '22:10' },
        { id: 'm4', day: ago(2), who: 'b', mood: '😴', note: '加班到很晚，先睡啦。', time: '23:40' },
        { id: 'm5', day: ago(3), who: 'a', mood: '🙂', note: '阴天，适合窝在沙发上看剧。', time: '20:15' },
        { id: 'm6', day: ago(5), who: 'b', mood: '😤', note: '为一颗葱吵了两句，五分钟就和好了。', time: '19:30' }
      ]
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
      var saved = JSON.parse(raw);
      Object.keys(saved).forEach(function (k) {
        if (saved[k] !== undefined && saved[k] !== null) base[k] = saved[k];
      });
    } catch (err) {
      if (window.console) console.warn('本地数据读取失败，已回到示例数据。', err);
    }
    return base;
  }

  function saveState() {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
    } catch (err) {
      if (window.console) console.warn('本地数据保存失败。', err);
    }
    markDirty();
  }

  /* ------------------------------------------------------------ 同步 */

  var SYNC = {
    enabled: false,
    ready: false,        // 是否已经和服务端核对过一次
    status: 'local',     // local | syncing | ok | offline | needtoken | badkey
    rev: 0,
    dirty: false,
    busy: false,
    timer: null,
    timer2: null,
    token: '',
    snapshot: null,      // 上一次确认「服务端已经拿到」的数据快照
    lastAt: 0,
    cfg: null
  };

  var CLIENT_ID = uid('c');

  /* ------------------------------------------- 同步后端配置（每台设备各存各的） */

  var SYNC_CFG_KEY = CONFIG.storageKey + ':sync';

  function defaultSyncCfg() {
    return { mode: 'auto', url: '', token: '', sbUrl: '', sbKey: '', pass: '' };
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

  // auto：页面就是从自建服务（server.py）打开的，用同源接口
  // server：自己填一个地址（VPS、内网穿透都算）
  // supabase：免费云数据库，电脑不用开
  function activeMode() {
    var cfg = SYNC.cfg || defaultSyncCfg();
    if (cfg.mode === 'off') return 'off';
    if (cfg.mode === 'supabase') {
      return (cfg.sbUrl && cfg.sbKey && cfg.pass) ? 'supabase' : 'off';
    }
    if (cfg.mode === 'server') return cfg.url ? 'server' : 'off';
    if (location.protocol === 'http:' || location.protocol === 'https:') return 'server';
    return 'off';
  }

  function apiPath() {
    var cfg = SYNC.cfg || defaultSyncCfg();
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

  function sbSpaceId() {
    var cfg = SYNC.cfg || defaultSyncCfg();
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
    if (sbKeyCache) return sbKeyCache;
    sbKeyCache = window.crypto.subtle.importKey(
      'raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']
    ).then(function (base) {
      return window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: new TextEncoder().encode(space), iterations: 150000, hash: 'SHA-256' },
        base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
      );
    });
    return sbKeyCache;
  }

  function encryptJson(obj) {
    return deriveKey(SYNC.cfg.pass, sbSpaceId()).then(function (key) {
      var iv = window.crypto.getRandomValues(new Uint8Array(12));
      return window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv }, key, new TextEncoder().encode(JSON.stringify(obj))
      ).then(function (buf) {
        return bytesToB64(iv) + '.' + bytesToB64(new Uint8Array(buf));
      });
    });
  }

  function decryptJson(text) {
    var parts = String(text || '').split('.');
    if (parts.length !== 2) return Promise.reject(new Error('DECRYPT_FORMAT'));
    return deriveKey(SYNC.cfg.pass, sbSpaceId()).then(function (key) {
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
      setSyncStatus('needtoken');
      throw new Error('NEED_TOKEN');
    }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  function sbHeaders(extra) {
    var cfg = SYNC.cfg;
    var head = {
      'apikey': cfg.sbKey,
      'Authorization': 'Bearer ' + cfg.sbKey,
      'Accept': 'application/json'
    };
    if (extra) Object.keys(extra).forEach(function (k) { head[k] = extra[k]; });
    return head;
  }

  function apiPull(force) {
    if (activeMode() === 'supabase') return sbPull(force);
    return fetch(apiPath() + '?since=' + (force ? 0 : SYNC.rev), {
      cache: 'no-store',
      headers: syncHeaders()
    }).then(jsonOrThrow).then(function (res) {
      if (res.unchanged) return { unchanged: true, rev: res.rev };
      return { rev: res.rev || 0, data: res.data };
    });
  }

  function apiPush() {
    if (activeMode() === 'supabase') return sbPush();
    return fetch(apiPath(), {
      method: 'POST',
      cache: 'no-store',
      headers: syncHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ data: syncedPayload(), client: CLIENT_ID })
    }).then(jsonOrThrow).then(function (res) {
      return { rev: res.rev || 0, data: res.data };
    });
  }

  function sbPull(force) {
    var table = trimSlashes(SYNC.cfg.sbUrl) + '/rest/v1/little_days' +
      '?id=eq.' + encodeURIComponent(sbSpaceId()) + '&select=rev,payload';
    return fetch(table, { cache: 'no-store', headers: sbHeaders() })
      .then(jsonOrThrow)
      .then(function (rows) {
        if (!rows || !rows.length) return { rev: 0, data: null };
        var row = rows[0];
        if (!force && row.rev && row.rev === SYNC.rev) return { unchanged: true, rev: row.rev };
        return decryptJson(row.payload).then(function (data) {
          return { rev: row.rev || 0, data: data };
        });
      });
  }

  function sbPush() {
    return encryptJson(syncedPayload()).then(function (payload) {
      var row = {
        id: sbSpaceId(),
        rev: (SYNC.rev || 0) + 1,
        payload: payload,
        updated_at: new Date().toISOString()
      };
      return fetch(trimSlashes(SYNC.cfg.sbUrl) + '/rest/v1/little_days', {
        method: 'POST',
        cache: 'no-store',
        headers: sbHeaders({
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation'
        }),
        body: JSON.stringify([row])
      });
    }).then(jsonOrThrow).then(function (rows) {
      var saved = (rows && rows[0]) || {};
      return { rev: saved.rev || ((SYNC.rev || 0) + 1) };
    });
  }

  // 参与同步的内容：记录 + 账号；不含「我是谁」「当前页面」这些每台设备自己的状态
  function syncedPayload() {
    return {
      todos: state.todos,
      ledger: state.ledger,
      wishes: state.wishes,
      saving: state.saving,
      savingsLog: state.savingsLog,
      moods: state.moods,
      auth: { accounts: accounts() }
    };
  }

  function mergeList(a, b) {
    var byId = {};
    var order = [];
    [a || [], b || []].forEach(function (src) {
      src.forEach(function (rec) {
        if (!rec || rec.id === undefined) return;
        var prev = byId[rec.id];
        if (!prev) {
          byId[rec.id] = rec;
          order.push(rec.id);
        } else if ((rec.updatedAt || 0) > (prev.updatedAt || 0)) {
          byId[rec.id] = rec;
        }
      });
    });
    return order.map(function (id) { return byId[id]; });
  }

  // 按 id 求并集：两个人同时改也不会互相覆盖，只会合并
  function mergeStates(local, remote) {
    if (!remote) return local;
    var logs = mergeList(local.savingsLog, remote.savingsLog);
    var localAuth = local.auth || {};
    var remoteAuth = remote.auth || {};
    var out = {
      view: local.view,
      auth: {
        accounts: mergeList(localAuth.accounts, remoteAuth.accounts),
        currentId: localAuth.currentId || null      // 登录身份只属于这台设备
      },
      todos: mergeList(local.todos, remote.todos),
      ledger: mergeList(local.ledger, remote.ledger),
      wishes: mergeList(local.wishes, remote.wishes),
      savingsLog: logs,
      moods: mergeList(local.moods, remote.moods),
      saving: {
        goal: (remote.saving && remote.saving.goal) || (local.saving && local.saving.goal) || 20000,
        saved: logs.reduce(function (s, l) { return s + (l.amount || 0); }, 0)
      }
    };
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

  function syncHeaders(extra) {
    var head = extra || {};
    if (SYNC.token) head['X-Sync-Token'] = SYNC.token;
    return head;
  }

  function setSyncStatus(status) {
    if (SYNC.status === status) return;
    SYNC.status = status;
    updateSyncChip();
  }

  function syncInit() {
    SYNC.cfg = loadSyncCfg();
    SYNC.token = SYNC.cfg.token || readToken();
    sbKeyCache = null;
    SYNC.enabled = activeMode() !== 'off';
    SYNC.ready = false;
    SYNC.rev = 0;
    SYNC.snapshot = null;
    SYNC.dirty = false;
    SYNC.busy = false;
    SYNC.status = SYNC.enabled ? 'syncing' : 'local';
    updateSyncChip();
    if (!SYNC.enabled) return;
    if (!SYNC.timer) {
      SYNC.timer = setInterval(tick, 5000);
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) tick();
      });
    }
    pull(true);
  }

  function tick() {
    if (!SYNC.enabled || SYNC.busy || document.hidden) return;
    // 本地和「服务端已确认」的内容不一致，就先推上去，再拉
    if (SYNC.snapshot === null || JSON.stringify(syncedPayload()) !== SYNC.snapshot) {
      push();
      return;
    }
    pull(false);
  }

  function handleSyncError(err) {
    var code = String(err && err.message);
    if (code === 'DECRYPT_FAILED' || code === 'DECRYPT_FORMAT') setSyncStatus('badkey');
    else if (code !== 'NEED_TOKEN') setSyncStatus('offline');
  }

  function pull(force) {
    if (!SYNC.enabled || SYNC.busy) return;
    SYNC.busy = true;
    apiPull(force)
      .then(function (res) {
        SYNC.busy = false;
        var first = !SYNC.ready;
        SYNC.ready = true;
        if (res.unchanged) {
          setSyncStatus('ok');
          if (first) render();
          return;
        }
        SYNC.rev = res.rev || 0;
        if (res.data) applyRemote(res.data);
        setSyncStatus('ok');
        SYNC.lastAt = Date.now();
        if (first) render();
      })
      .catch(function (err) {
        SYNC.busy = false;
        var firstFail = !SYNC.ready;
        SYNC.ready = true;
        handleSyncError(err);
        if (firstFail) render();
      });
  }

  function push() {
    if (!SYNC.enabled) return;
    if (SYNC.busy) { SYNC.dirty = true; return; }
    SYNC.busy = true;
    SYNC.dirty = false;
    setSyncStatus('syncing');
    apiPush()
      .then(function (res) {
        SYNC.busy = false;
        SYNC.rev = res.rev || 0;
        if (res.data) applyRemote(res.data);
        SYNC.snapshot = JSON.stringify(syncedPayload());
        setSyncStatus('ok');
        SYNC.lastAt = Date.now();
      })
      .catch(function (err) {
        SYNC.busy = false;
        SYNC.dirty = true;
        handleSyncError(err);
      });
  }

  function markDirty() {
    if (!SYNC.enabled) return;
    if (SYNC.snapshot !== null && JSON.stringify(syncedPayload()) === SYNC.snapshot) return;
    SYNC.dirty = true;
    if (SYNC.timer2) clearTimeout(SYNC.timer2);
    SYNC.timer2 = setTimeout(push, 500);
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
    if (ae && view && /^(INPUT|TEXTAREA)$/.test(ae.tagName) && view.contains(ae)) {
      pendingRender = true;
      return;
    }
    render();
  }

  function syncChip() {
    var labels = {
      local: '仅本机',
      syncing: '同步中',
      ok: '已同步',
      offline: '离线 · 待同步',
      needtoken: '需要口令',
      badkey: '口令不对'
    };
    var tips = {
      local: '数据只存在这台设备上。想让手机也能一起编辑，点「同步设置」接上云。',
      syncing: '正在和同步服务交换数据…',
      ok: '两台设备看到的是一样的。',
      offline: '连不上同步服务，改动先存在本机，恢复后会自动补上。',
      needtoken: '服务端要求访问口令，请到「同步设置」里填写。',
      badkey: '同步口令不对，解不开云端数据（没有覆盖云端）。'
    };
    var s = SYNC.status;
    return '<span class="sync-chip ' + s + '" title="' + (tips[s] || '') + '">' +
      '<i class="sync-dot"></i>' + (labels[s] || '仅本机') + '</span>';
  }

  function syncHint() {
    var hints = {
      local: '现在数据只保存在这台设备上。点「同步设置」接上云，两台手机就能看到同一份记录。',
      syncing: '正在同步…',
      ok: '两台设备看到的是一样的，改动会在几秒内互相出现。',
      offline: '暂时连不上云端，改动已经存在本机，恢复后会自动补上去。',
      needtoken: '服务端要求访问口令：到「同步设置」里填上。',
      badkey: '同步口令不对，云端的数据解不开。为了避免覆盖，已经停止上传。'
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
  }

  function importRecords() {    var picker = document.createElement('input');
    picker.type = 'file';
    picker.accept = 'application/json,.json';
    picker.addEventListener('change', function () {
      var file = picker.files && picker.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(String(reader.result));
          var before = JSON.stringify(syncedPayload());
          state = mergeStates(state, data);
          saveState();
          render();
          toast(JSON.stringify(syncedPayload()) === before
            ? '这个文件和现在的记录是一样的。'
            : '已经并进来了，重复的不会重复算。');
        } catch (err) {
          toast('这个文件读不出来，确认是导出的 JSON 吗？');
        }
      };
      reader.readAsText(file);
    });
    picker.click();
  }

  /* --------------------------------------------------------- 同步设置面板 */

  var syncDraft = null;

  var SUPABASE_SQL =
    'create table if not exists public.little_days (\n' +
    '  id text primary key,\n' +
    '  rev bigint not null default 0,\n' +
    '  payload text not null,\n' +
    '  updated_at timestamptz not null default now()\n' +
    ');\n\n' +
    'alter table public.little_days enable row level security;\n\n' +
    'create policy "little_days read"   on public.little_days for select to anon using (true);\n' +
    'create policy "little_days write"  on public.little_days for insert to anon with check (true);\n' +
    'create policy "little_days update" on public.little_days for update to anon using (true) with check (true);';

  function openSyncModal() {
    captureSyncForm();
    if (!syncDraft) syncDraft = JSON.parse(JSON.stringify(SYNC.cfg || loadSyncCfg()));
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
        '<div class="field"><label for="sync-sbkey">anon public key</label>' +
          '<input class="input" id="sync-sbkey" data-cfg="sbKey" value="' + esc(syncDraft.sbKey) +
          '" placeholder="eyJhbGciOiJIUzI1NiIs..." /></div>' +
        '<div class="field" style="margin-bottom:0"><label for="sync-pass">同步口令（两台设备必须一样）</label>' +
          '<input class="input" id="sync-pass" type="password" data-cfg="pass" value="' + esc(syncDraft.pass) +
          '" placeholder="至少 6 位；忘了就解不开云端数据" /></div>' +
        '<div class="sync-note">' +
          '<details class="sync-help">' +
            '<summary>怎么搭？点开看步骤和要复制的 SQL</summary>' +
            '<div class="sync-help-body">' +
              '<p><b>三步：</b>登录 supabase.com 建一个免费项目 → 左侧 SQL Editor 里粘贴下面这段并 Run → ' +
              '再到 Project Settings → API 复制 Project URL 和 anon public key 填到上面。</p>' +
              '<pre class="sql" id="sync-sql">' + esc(SUPABASE_SQL) + '</pre>' +
              '<button class="btn btn-ghost btn-copy" data-action="copy-sql">' + icon('check', 14) + '复制这段 SQL</button>' +
            '</div>' +
          '</details>' +
          '<p class="dim">上传前会用同步口令在本机加密（AES-GCM），云端只能看到乱码。</p>' +
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
    var backup = SYNC.cfg;
    SYNC.cfg = syncDraft;
    if (activeMode() === 'off') {
      SYNC.cfg = backup;
      say(syncDraft.mode === 'off' ? '当前选择的是「不用同步」。' : '信息还不完整，把地址 / key / 口令填全。');
      return;
    }
    say('正在连接…');
    apiPull(true)
      .then(function (res) {
        SYNC.cfg = backup;
        if (!res.data) say('连上了 ✓ 但云端还没有数据——两台设备第一次用属于正常，保存后会创建。');
        else say('连上了 ✓ 云端已有数据（rev ' + res.rev + '），说明口令和地址都对。');
      })
      .catch(function (err) {
        SYNC.cfg = backup;
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
        me.updatedAt = Date.now();
        saveState();
        closeModal();
        render();
        toast('密码改好了，下次请用新密码登录。');
      });
    });
  }

  /* ---------------------------------------------------------- 派生数据 */

  function expenses(filterFn) {
    return state.ledger.filter(function (e) { return e.amount < 0; }).filter(filterFn);
  }

  function sum(list) {
    return list.reduce(function (s, e) { return s + e.amount; }, 0);
  }

  function todaySpend() {
    return Math.abs(sum(expenses(function (e) { return e.day === 0; })));
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
    return sum(state.ledger.filter(function (e) {
      if (e.amount <= 0) return false;
      var d = entryDate(e);
      return d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
    }));
  }

  function openWishCount() {
    return state.wishes.filter(function (w) { return w.status !== '已完成'; }).length;
  }

  function pendingWishCount() {
    return state.wishes.filter(function (w) { return w.status === '等你一起商量'; }).length;
  }

  function savingPct() {
    return Math.min(100, Math.round((state.saving.saved / state.saving.goal) * 100));
  }

  function moodOf(who, day) {
    var list = state.moods.filter(function (m) { return m.who === who && m.day === day; });
    return list.length ? list[list.length - 1] : null;
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
      '</div>' +

      '<button class="account" data-action="account" aria-haspopup="dialog">' +
        '<span class="avatar">' + me.emoji + '</span>' +
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
        '<span class="hint"><i class="hint-dot"></i><span>灵感示例</span></span>' +
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
        '<span>先逛逛我们的理想日常 · 这里展示的是可体验的示例数据</span></p>' +
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
          '<div class="blob blob-a"><span>' + CONFIG.couple.a.emoji + '</span></div>' +
          '<div class="blob blob-b"><span>' + CONFIG.couple.b.emoji + '</span></div>' +
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
        value: '<span class="cur">¥</span>' + num(state.saving.saved, 0),
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

  function todoRow(t) {
    return '<li class="todo-row' + (t.done ? ' done' : '') + '">' +
      '<button class="check' + (t.done ? ' on' : '') + '" data-action="toggle-todo" data-id="' + t.id + '"' +
        ' role="checkbox" aria-checked="' + (t.done ? 'true' : 'false') + '"' +
        ' aria-label="' + esc(t.text) + '">' + icon('check', 13) + '</button>' +
      '<div class="todo-main">' +
        '<p class="todo-text">' + esc(t.text) + '</p>' +
        '<p class="todo-when">' + esc(t.when) + '</p>' +
      '</div>' +
      '<span class="tag">' + esc(t.tag) + '</span>' +
      '</li>';
  }

  function moodCard(who, mood) {
    var p = person(who);
    var line = mood ? mood.mood + ' ' + esc(mood.note) : '还没有记录今天的心情';
    return '<article class="mood-card ' + who + '" data-action="nav" data-view="moods" tabindex="0" role="button">' +
      '<div class="row1">' +
        '<span class="mood-ava">' + p.emoji + '</span>' +
        '<span class="mood-name">' + p.name + '</span>' +
        (mood ? '<i class="dot"></i>' : '') +
      '</div>' +
      '<p class="mood-quote">' + line + '</p>' +
      '<p class="mood-time">' + (mood ? '今天 ' + mood.time : '等一句话就好') + '</p>' +
      '</article>';
  }

  function todoPanel() {
    var list = state.todos.slice(0, 3);
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
        var groups = ['今天', '明天', '本周'];
        var done = state.todos.filter(function (t) { return t.done; }).length;
        var pct = state.todos.length ? Math.round((done / state.todos.length) * 100) : 0;

        return pageHead(VIEWS.todos) +
          '<section class="card panel reveal" style="--d:40ms">' +
            '<div class="card-head">' +
              '<div><h3 class="card-title">今天的进度</h3>' +
              '<p class="card-sub">' + done + ' / ' + state.todos.length + ' 件小事已经打勾</p></div>' +
              '<span class="tag">' + pct + '%</span>' +
            '</div>' +
            '<div class="bar"><i class="bar-fill" style="width:' + pct + '%"></i></div>' +
            '<div class="inline-form">' +
              '<input class="input" id="new-todo" data-enter="add-todo" placeholder="想一起做点什么？" aria-label="新的待办" />' +
              '<button class="btn btn-primary" data-action="add-todo">' + icon('plus', 16) + '加一件</button>' +
            '</div>' +
          '</section>' +
          groups.map(function (g, i) {
            var rows = state.todos.filter(function (t) { return t.when === g; });
            if (!rows.length) return '';
            return '<section class="card panel reveal" style="--d:' + (80 + i * 40) + 'ms">' +
              '<div class="card-head"><div><h3 class="card-title">' + g + '</h3>' +
              '<p class="card-sub">' + rows.filter(function (t) { return t.done; }).length + ' / ' + rows.length + ' 已完成</p></div></div>' +
              '<ul>' + rows.map(todoRow).join('') + '</ul></section>';
          }).join('') +
          (state.todos.length ? '' : '<p class="empty">还没有待办，写一件试试。</p>');
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
        var rows = state.ledger.slice().sort(function (a, b) { return b.day - a.day; });
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
          '<section class="card panel reveal" style="--d:160ms">' +
            '<div class="card-head"><div><h3 class="card-title">最近的记录</h3>' +
              '<p class="card-sub">一共 ' + state.ledger.length + ' 笔，都是我们一起过的日子</p></div>' +
              '<span class="tag warm">今天 ¥' + num(todaySpend()) + '</span></div>' +
            '<ul>' + rows.map(ledgerRow).join('') + '</ul>' +
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
              '<button class="btn btn-primary" data-action="add-wish">' + icon('plus', 16) + '记下心愿</button>' +
            '</div>' +
          '</section>' +
          '<section class="wish-grid">' + state.wishes.map(function (w, i) {
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
        var logs = state.savingsLog.slice().sort(function (a, b) { return b.day - a.day; });
        return pageHead(VIEWS.savings) +
          '<section class="card panel reveal" style="--d:40ms">' +
            '<div class="goal-wrap">' +
              ring(pct) +
              '<div>' +
                '<h3 class="card-title">我们的小目标</h3>' +
                '<p class="card-sub">已经存下 ¥' + num(state.saving.saved, 0) + '，离目标还有 ¥' +
                  num(Math.max(0, state.saving.goal - state.saving.saved), 0) + '</p>' +
                '<div class="bar" style="margin:18px 0 14px"><i class="bar-fill" style="width:' + pct + '%"></i></div>' +
                '<div class="wish-meta"><span>目标 ¥' + num(state.saving.goal, 0) + '</span><span>' + pct + '%</span></div>' +
                '<div class="inline-form" style="margin-top:18px">' +
                  '<button class="btn btn-ghost" data-action="save-money" data-amount="100">存 ¥100</button>' +
                  '<button class="btn btn-ghost" data-action="save-money" data-amount="500">存 ¥500</button>' +
                  '<button class="btn btn-primary" data-action="save-money" data-amount="1000">存 ¥1000</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</section>' +
          '<section class="card panel reveal" style="--d:120ms">' +
            '<div class="card-head"><div><h3 class="card-title">存入记录</h3>' +
              '<p class="card-sub">每一次存下，都是朝着同一个方向</p></div></div>' +
            (logs.length ? '<ul>' + logs.map(function (l) {
              return '<li class="ledger-row">' +
                '<span class="cat">🪙</span>' +
                '<div class="todo-main"><p class="todo-text">' + esc(l.who) + ' 存了一笔</p>' +
                '<p class="todo-when">' + dayLabel(l.day) + '</p></div>' +
                '<span class="amount in">+' + num(l.amount, 0) + '</span></li>';
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
            '<div class="card-head"><div><h3 class="card-title">' + p.name + ' 今天的心情</h3>' +
            '<p class="card-sub">' + (cur ? cur.mood + ' ' + esc(cur.note) : '选一个最接近的表情吧') + '</p></div>' +
            (cur ? '<span class="tag">' + cur.time + '</span>' : '') + '</div>' +
            '<div class="mood-picker">' + MOODS.map(function (m) {
              return '<button class="mood-btn' + (cur && cur.mood === m.emoji ? ' on' : '') + '"' +
                ' data-action="set-mood" data-who="' + who + '" data-mood="' + m.emoji + '">' +
                '<span>' + m.emoji + '</span><span>' + m.label + '</span></button>';
            }).join('') + '</div></section>';
        }).join('');

        var history = state.moods.slice().sort(function (a, b) { return b.day - a.day; });

        return pageHead(VIEWS.moods) + picker +
          '<section class="card panel reveal" style="--d:120ms">' +
            '<div class="card-head"><div><h3 class="card-title">我们的心情流水</h3>' +
              '<p class="card-sub">一共 ' + history.length + ' 条，都是真实的我们</p></div></div>' +
            (history.length ? '<ul>' + history.map(function (m) {
              return '<li class="history-row">' +
                '<span class="history-emoji">' + m.mood + '</span>' +
                '<div class="todo-main"><p class="history-note">' + esc(m.note) + '</p>' +
                '<p class="history-time">' + person(m.who).name + ' · ' + dayLabel(m.day) + ' ' + m.time + '</p></div>' +
                '</li>';
            }).join('') + '</ul>' : '<p class="empty">还没有心情记录。</p>') +
          '</section>';
      }
    }
  };

  function ledgerRow(e) {
    var income = e.amount > 0;
    return '<li class="ledger-row">' +
      '<span class="cat">' + e.cat + '</span>' +
      '<div class="todo-main">' +
        '<p class="todo-text">' + esc(e.title) + '</p>' +
        '<p class="todo-when">' + dayLabel(e.day) + ' · ' + esc(e.who) + '</p>' +
      '</div>' +
      '<span class="amount ' + (income ? 'in' : 'out') + '">' +
        (income ? '+' : '−') + num(Math.abs(e.amount)) + '</span>' +
      '</li>';
  }

  function wishCard(w, delay) {
    var pct = Math.min(100, Math.round((w.saved / w.target) * 100));
    var done = w.status === '已完成';
    return '<article class="card wish reveal" style="--d:' + (delay || 80) + 'ms">' +
      '<div class="wish-top">' +
        '<span class="wish-emoji">' + w.emoji + '</span>' +
        '<span class="wish-title">' + esc(w.title) + '</span>' +
        '<span class="tag' + (done ? '' : (w.status === '等你一起商量' ? ' warm' : '')) + '" ' +
          'style="margin-left:auto">' + esc(w.status) + '</span>' +
      '</div>' +
      '<div class="bar"><i class="bar-fill' + (done ? '' : '') + '" style="width:' + pct + '%"></i></div>' +
      '<div class="wish-meta"><span>已存 ¥' + num(w.saved, 0) + '</span>' +
        '<span>目标 ¥' + num(w.target, 0) + '</span></div>' +
      '<div class="wish-meta"><span>' + pct + '%</span>' +
        '<span>' + (done ? '已经实现啦' : '还差 ¥' + num(Math.max(0, w.target - w.saved), 0)) + '</span></div>' +
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
    if (!SYNC.enabled) return '';
    return '<div class="auth-sync">' + syncChip() + '</div>';
  }

  function renderAuth() {
    var app = document.getElementById('app');
    var root = document.getElementById('auth-root');
    if (!root) return;
    if (app) app.hidden = true;
    closeDrawer();
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
      '<h1 class="auth-title">先建一个只属于你们的空间</h1>' +
      '<p class="auth-sub">两个人各有一个账号，这样账本和心情才知道是谁记下的。' +
      '密码只保存在这台设备上，不会上传到任何服务器。</p>' +
      '<div class="auth-slots">' + slots + '</div>' +
      '<p class="auth-error" id="auth-error"></p>' +
      '<div class="auth-foot">' +
        '<span class="auth-links">' +
          '<button class="auth-link" data-action="sync-settings">同步设置</button>' +
          '<button class="auth-link" data-action="reset-space">清空本机数据</button>' +
        '</span>' +
        '<button class="btn btn-primary" data-action="auth-submit">' + icon('check', 16) + '创建并进入</button>' +
      '</div>' +
      '</div></div>';
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
          '<span class="pick-ava">' + u.emoji + '</span>' +
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
          '<button class="auth-link" data-action="reset-space">忘记密码？清空本机数据</button>' +
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
    state = seed();
    authDraft = {
      slots: [
        { name: '', emoji: EMOJIS[0], pw: '' },
        { name: '', emoji: EMOJIS[1], pw: '' }
      ],
      pickId: null
    };
    closeModal();
    render();
    toast('已经清空，重新开始吧。');
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
            '<span class="pick-ava">' + me.emoji + '</span>' +
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
  }

  function saveModal() {
    var input = document.getElementById('modal-input');
    var value = input ? input.value.trim() : '';
    var now = new Date();
    var time = pad2(now.getHours()) + ':' + pad2(now.getMinutes());

    if (modal.kind === 'expense') {
      var amountEl = document.getElementById('modal-amount');
      var amount = Math.abs(parseFloat(amountEl && amountEl.value ? amountEl.value : '0')) || 0;
      if (!amount) { toast('金额还没填呢～'); return; }
      state.ledger.push({
        id: uid('l'), title: value || '一笔小开销', cat: '💸',
        who: currentName(), amount: -amount, day: 0, updatedAt: Date.now()
      });
      saveState(); closeModal(); render();
      toast('记下了 ¥' + num(amount) + '，谢谢你为这个家花的钱。');
      return;
    }

    if (modal.kind === 'todo') {
      if (!value) { toast('写点什么吧～'); return; }
      state.todos.push({ id: uid('t'), text: value, when: '今天', tag: '一起', done: false, updatedAt: Date.now() });
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
      existing.updatedAt = Date.now();
    } else {
      state.moods.push({
        id: uid('m'), day: 0, who: who, mood: modal.mood,
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
    t.updatedAt = Date.now();
    saveState();
    render();
    if (t.done) toast('完成啦：' + t.text);
  }

  function addTodoFromForm() {
    var el = document.getElementById('new-todo');
    if (!el) return;
    var value = el.value.trim();
    if (!value) { toast('写点什么吧～'); return; }
    state.todos.push({ id: uid('t'), text: value, when: '今天', tag: '一起', done: false, updatedAt: Date.now() });
    saveState(); render(); toast('加进今天的小事里了。');
  }

  function addWishFromForm() {
    var el = document.getElementById('new-wish');
    if (!el) return;
    var value = el.value.trim();
    if (!value) { toast('写一个心愿吧～'); return; }
    state.wishes.push({ id: uid('w'), emoji: '✨', title: value, target: 2000, saved: 0, status: '等你一起商量', updatedAt: Date.now() });
    saveState(); render(); toast('心愿已经放进清单了。');
  }

  function setMood(who, mood) {
    var existing = moodOf(who, 0);
    var now = new Date();
    var time = pad2(now.getHours()) + ':' + pad2(now.getMinutes());
    if (existing) {
      existing.mood = mood;
      existing.time = time;
      existing.updatedAt = Date.now();
    } else {
      state.moods.push({
        id: uid('m'), day: 0, who: who, mood: mood,
        note: mood === '😔' ? '有点不开心，但没关系。' : '今天也记一笔。', time: time,
        updatedAt: Date.now()
      });
    }
    saveState(); render();
    toast(person(who).name + ' 今天的心情是 ' + mood);
  }

  function saveMoney(amount) {
    var now = new Date();
    var time = pad2(now.getHours()) + ':' + pad2(now.getMinutes());
    state.saving.saved += amount;
    state.savingsLog.push({
      id: uid('s'), who: currentName(), amount: amount, day: 0, time: time, updatedAt: Date.now()
    });
    saveState(); render();
    toast('存下 ¥' + num(amount, 0) + '，离目标更近了一点。');
  }

  function exportData() {
    var payload = {
      exportedAt: new Date().toISOString(),
      space: CONFIG.spaceName,
      todos: state.todos,
      ledger: state.ledger,
      wishes: state.wishes,
      saving: state.saving,
      savingsLog: state.savingsLog,
      moods: state.moods
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
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
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text + ' ' + location.href).then(function () {
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
        saveMoney(Number(el.dataset.amount) || 0);
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
      case 'copy-sql':
        copySql();
        break;
      case 'copy-setup':
        copySetupLink();
        break;
      case 'change-pw':
        openPasswordModal();
        break;
      case 'save-pw':
        savePassword();
        break;
      case 'sync-now':
        if (!SYNC.enabled) { toast('现在是仅本机模式：用 server.py 打开页面才能同步。'); break; }
        SYNC.snapshot = null;
        push();
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
  }

  document.addEventListener('focusout', function () {
    if (!pendingRender) return;
    pendingRender = false;
    setTimeout(render, 0);
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
