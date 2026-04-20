/* =========================================================
   SMARTSTADIUM — FULL SCRIPT (Original + All New Features)
   Venue: Narendra Modi Stadium, Ahmedabad | IPL: GT vs MI
   ========================================================= */

/* ===== STATE ===== */
let currentScreen = 'landing';
let currentTab = 'nav';
let currentRoute = 0;
let surgeActive = false;
let showDots = true;
let showTwin = true;
let avoidCrowd = false;
let groupCreated = false;
let groupId = null;
let emergencyActive = false;
let cartItems = [];
let whatIfActive = {};

/* ===== ZONE DATA ===== */
const zones = [
  { id:'gateA', name:'Gate A',    cx:85,  cy:284, rx:60, ry:55, base:88, cur:88 },
  { id:'gateB', name:'Gate B',    cx:400, cy:80,  rx:70, ry:50, base:62, cur:62 },
  { id:'gateC', name:'Gate C',    cx:705, cy:284, rx:60, ry:55, base:45, cur:45 },
  { id:'gateD', name:'Gate D',    cx:400, cy:520, rx:70, ry:50, base:38, cur:38 },
  { id:'sec101', name:'Sec 101',  cx:220, cy:240, rx:65, ry:50, base:70, cur:70 },
  { id:'sec102', name:'Sec 102',  cx:400, cy:215, rx:55, ry:40, base:55, cur:55 },
  { id:'sec103', name:'Sec 103',  cx:580, cy:240, rx:65, ry:50, base:42, cur:42 },
  { id:'sec104', name:'Sec 104',  cx:220, cy:370, rx:65, ry:50, base:60, cur:60 },
  { id:'sec105', name:'Sec 105',  cx:580, cy:370, rx:65, ry:50, base:48, cur:48 },
];

/* ===== ROUTE DATA ===== */
const routes = [
  { label:'Via Gate B', type:'Fastest',       eta:'4 min', dist:'280 m', tag:'fastest',  crowd:'Medium', steps:['🚶 Walk north along Main Concourse','🚪 Enter through Gate B','🎫 Scan at turnstile K2','🪑 Follow signs to Block B, Row 7'] },
  { label:'Via Gate C', type:'Least Crowded', eta:'7 min', dist:'420 m', tag:'quiet',    crowd:'Low',    steps:['🚶 Head east on East Corridor','🚪 Enter Gate C (less busy now)','🎫 Scan at turnstile F4','🪑 Follow signs to Block B, Row 7'] },
  { label:'Via Gate D', type:'Balanced',      eta:'5 min', dist:'330 m', tag:'balanced', crowd:'Medium', steps:['🚶 Walk south concourse','🚪 Use Gate D (open lane)','🎫 Scan at turnstile H1','🪑 Follow signs to Block B, Row 7'] },
];

/* ===== FOOD DATA ===== */
const foodMenu = [
  { cat:'🍽 Main Course', items:[
    { name:'Paneer Tikka Wrap',   price:'₹220', avail:'Available', eta:8  },
    { name:'Veg Biryani Bowl',    price:'₹180', avail:'Available', eta:6  },
    { name:'Masala Dosa',         price:'₹120', avail:'Available', eta:5  },
    { name:'Butter Chicken Naan', price:'₹280', avail:'High demand',eta:12 },
  ]},
  { cat:'🥤 Beverages', items:[
    { name:'Mango Lassi',  price:'₹90',  avail:'Available', eta:3 },
    { name:'Masala Chai',  price:'₹60',  avail:'Available', eta:2 },
    { name:'Cold Drinks',  price:'₹80',  avail:'Available', eta:1 },
  ]},
  { cat:'🍿 Snacks', items:[
    { name:'Samosa (2pc)', price:'₹80',  avail:'Available', eta:4 },
    { name:'Popcorn',      price:'₹100', avail:'Available', eta:2 },
    { name:'Bhel Puri',    price:'₹70',  avail:'Low stock', eta:3 },
  ]},
];

/* ===== WAIT DATA ===== */
let waitData = [
  { name:'Gate A',       time:18, unit:'min' },
  { name:'Gate B',       time:6,  unit:'min' },
  { name:'Gate C',       time:3,  unit:'min', best:true },
  { name:'Gate D',       time:9,  unit:'min' },
  { name:'Food Court 1', time:14, unit:'min' },
  { name:'Food Court 2', time:4,  unit:'min' },
  { name:'Snack Bar',    time:2,  unit:'min', best:true },
  { name:'WC-A',         time:5,  unit:'min' },
  { name:'WC-B',         time:2,  unit:'min', best:true },
];

/* ===== QUEUE ENHANCEMENT DATA ===== */
let queueData = [
  { name:'Counter 1 (Food Ct.)', wait:14, orders:[ { id:'#4821', status:'preparing' }, { id:'#4819', status:'ready' } ] },
  { name:'Counter 2 (Food Ct.)', wait:6,  orders:[ { id:'#4817', status:'ready' } ], least:true },
  { name:'Counter 3 (Snack Bar)',wait:2,  orders:[], least:false },
  { name:'Counter 4 (East)',     wait:9,  orders:[ { id:'#4823', status:'preparing' } ] },
];

/* ===== STAFF DATA ===== */
const staff = [
  { name:'Officer Patel',  loc:'Gate A',    status:'On Duty',  color:'#00e676' },
  { name:'Officer Sharma', loc:'Gate B',    status:'On Duty',  color:'#00e676' },
  { name:'Officer Mehta',  loc:'Sec 101',   status:'Patrolling',color:'#0099ff'},
  { name:'Officer Kumar',  loc:'Food Court',status:'Dispatched',color:'#ffcc00'},
  { name:'Officer Singh',  loc:'Gate C',    status:'On Duty',  color:'#00e676' },
  { name:'Officer Rao',    loc:'Medical',   status:'Standby',  color:'#8ba4c4' },
];

/* ===== GROUP DATA ===== */
const groupColors = ['#ff6b6b','#4ecdc4','#ffe66d','#a8e6cf','#dda0dd'];
let groupMembers = [];

/* ===== CROWD PREDICTION DATA ===== */
const predData = [
  { zone:'Gate A', dir:'up',   pct:20, mins:10 },
  { zone:'Gate B', dir:'down', pct:12, mins:8  },
  { zone:'Sec 103',dir:'up',   pct:15, mins:15 },
  { zone:'Gate D', dir:'down', pct:8,  mins:5  },
];

/* ===== MINI CHART DATA ===== */
const chartPoints = [12,18,22,17,25,30,28,35,38,34,40,42];

/* ===== EMERGENCY DATA ===== */
const exitData = [
  { name:'Gate D (South)', dist:'120 m', state:'Clear',    safest:true  },
  { name:'Gate B (North)', dist:'210 m', state:'Clear',    safest:false },
  { name:'Gate C (East)',  dist:'265 m', state:'Moderate', safest:false },
  { name:'Gate A (West)',  dist:'310 m', state:'Busy',     safest:false },
];
const incidentData = [
  { title:'Minor overcrowding — Gate A entrance', detail:'Staff deployed. Situation under control.' },
  { title:'Medical assistance — Section 103, Row 14', detail:'Paramedic team en route.' },
  { title:'Suspicious package alert — West Concourse', detail:'Security investigating. Area cleared.' },
];

/* ===== NAVIGATION ===== */
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  currentScreen = id;
  if(id === 'main-app') initMainApp();
  if(id === 'admin-panel') initAdminPanel();
}

function loginAsGuest() {
  document.getElementById('userName').textContent = 'Guest';
  goTo('main-app');
}

function loginTicket() {
  document.getElementById('userName').textContent = 'Alex J.';
  goTo('main-app');
}

function doAdminLogin() {
  const u = document.getElementById('adminUser').value.trim();
  const p = document.getElementById('adminPass').value.trim();
  const err = document.getElementById('loginErr');
  if(u === 'admin' && p === 'admin123') { err.classList.remove('show'); goTo('admin-panel'); }
  else { err.classList.add('show'); }
}

function simulateScan() {
  const overlay = document.getElementById('scanningOverlay');
  overlay.classList.remove('hidden');
  setTimeout(() => {
    overlay.classList.add('hidden');
    document.getElementById('scanSuccess').classList.remove('hidden');
  }, 1800);
}

/* ===== TAB SWITCHING ===== */
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const tabs = ['nav','heatmap','food','waits','groups'];
  const idx = tabs.indexOf(tab);
  if(idx >= 0) { document.querySelectorAll('.tab-btn')[idx].classList.add('active'); }
  const el = document.getElementById('tab-'+tab);
  if(el) el.classList.add('active');
  currentTab = tab;
  if(tab === 'food') renderFood();
  if(tab === 'waits') renderWaits();
  if(tab === 'groups') renderGroups();
  if(tab === 'heatmap') renderZones();
}

/* ===== ROUTING ===== */
function findRoute() {
  const seat = document.getElementById('seatInput').value || '102';
  document.getElementById('seatLabel').textContent = 'Seat ' + seat;
  document.getElementById('seatMarker').style.display = '';
  document.getElementById('etaBar').style.display = 'flex';
  selectRoute(0);
  renderSmartRoutes();
  showToast('info','🗺 Route found to Seat ' + seat + ' — Gate B recommended');
}

function selectRoute(idx) {
  currentRoute = idx;
  [0,1,2].forEach(i => {
    const rp = document.getElementById('rp'+i);
    if(rp) rp.classList.toggle('active', i===idx);
  });
  const r = routes[idx];
  document.getElementById('etaTime').textContent = r.eta;
  document.getElementById('etaDist').textContent = r.dist + ' · ' + r.type;
  document.getElementById('routeType').textContent = r.type.toUpperCase();
  document.getElementById('etaBarTime').textContent = r.eta;
  document.getElementById('etaBarInfo').textContent = r.label + ' · ' + r.dist;
  const steps = document.getElementById('routeSteps');
  steps.innerHTML = r.steps.map(s=>`<div class="route-step"><span class="step-icon">${s.split(' ')[0]}</span>${s.substring(s.indexOf(' ')+1)}</div>`).join('');
  drawRoute(idx);
  // Update smart route cards selection
  document.querySelectorAll('.route-option-card').forEach((c,i) => c.classList.toggle('selected', i===idx));
}

function renderSmartRoutes() {
  const el = document.getElementById('smartRouteCards');
  const extras = [
    { type:'🚀 Fastest',        badge:'badge-fastest',  eta:'4 min', dist:'280 m', crowd:'Medium 62%' },
    { type:'🌿 Least Crowded',  badge:'badge-quiet',    eta:'7 min', dist:'420 m', crowd:'Low 38%'    },
    { type:'⚖ Balanced',        badge:'badge-balanced', eta:'5 min', dist:'330 m', crowd:'Medium 52%' },
  ];
  el.innerHTML = extras.map((r,i) => `
    <div class="route-option-card${i===currentRoute?' selected':''}" onclick="selectRoute(${i})">
      <div class="route-option-header">
        <span class="route-option-type">${r.type}</span>
        <span class="route-option-badge ${r.badge}">${i===currentRoute?'SELECTED':'SELECT'}</span>
      </div>
      <div class="route-option-stats">
        <div class="route-option-stat">ETA <span>${r.eta}</span></div>
        <div class="route-option-stat">Dist <span>${r.dist}</span></div>
        <div class="route-option-stat">Crowd <span>${r.crowd}</span></div>
      </div>
    </div>
  `).join('');
}

function drawRoute(idx) {
  const layer = document.getElementById('routeLayer');
  const paths = [
    'M400,490 L400,460 L400,380 L400,280 L400,200',
    'M400,490 L500,490 L600,400 L650,300 L580,230',
    'M400,490 L400,520 L480,520 L560,440 L560,360 L520,280 L470,220',
  ];
  const colors = ['#0099ff','#00e676','#00d4aa'];
  layer.innerHTML = `<path d="${paths[idx]}" fill="none" stroke="${colors[idx]}" stroke-width="3" stroke-dasharray="8,4" opacity=".8" marker-end="url(#arrowBlue)"/>`;
}

/* ===== TOGGLES ===== */
function toggleAvoid() { avoidCrowd = !avoidCrowd; document.getElementById('avoidToggle').classList.toggle('on',avoidCrowd); showToast('info','Avoid crowded: '+(avoidCrowd?'ON':'OFF')); }
function toggleLiveLoc() { const t = document.getElementById('liveLocToggle'); t.classList.toggle('on'); showToast('info','Live tracking '+(t.classList.contains('on')?'enabled':'paused')); }
function toggleDots() { showDots = !showDots; document.getElementById('dotsToggle').classList.toggle('on',showDots); document.getElementById('crowdDots').style.opacity = showDots?1:0; }
function toggleTwin() { showTwin = !showTwin; document.getElementById('twinToggle').classList.toggle('on',showTwin); document.getElementById('twinDots').style.opacity = showTwin?1:0; document.getElementById('heatmapLayer').style.opacity = showTwin?'0.55':0; }

/* ===== SURGE ===== */
function toggleSurge() {
  surgeActive = !surgeActive;
  zones.forEach(z => { z.cur = surgeActive ? Math.min(98, z.base + 20 + Math.random()*15|0) : z.base; });
  document.getElementById('surgeIndicator').className = surgeActive ? 'badge-red' : 'badge-green';
  document.getElementById('surgeIndicator').textContent = surgeActive ? 'SURGE' : 'NORMAL';
  document.getElementById('surgeBtn').textContent = surgeActive ? '✓ Surge Active' : '⚡ Simulate Crowd Surge';
  renderZones();
  updateHeatmap();
  if(surgeActive) {
    showToast('danger','⚡ Crowd surge detected at Gate A!');
    setTimeout(()=>showNudge('Gate C is significantly less crowded right now','Try entering via Gate C — 3 min ETA'), 1500);
  }
}

/* ===== ZONES ===== */
function getZoneColor(pct) {
  if(pct >= 80) return '#ff4444';
  if(pct >= 55) return '#ffcc00';
  return '#00e676';
}

function renderZones() {
  const el = document.getElementById('zoneList');
  el.innerHTML = zones.map(z => `
    <div class="zone-item">
      <span class="zone-name">${z.name}</span>
      <div class="zone-bar-wrap"><div class="zone-bar" style="width:${z.cur}%;background:${getZoneColor(z.cur)}"></div></div>
      <span class="zone-pct">${z.cur}%</span>
    </div>
  `).join('');
  renderAdminZones();
}

function renderAdminZones() {
  const el = document.getElementById('adminZones');
  if(!el) return;
  el.innerHTML = zones.map(z => `
    <div class="zone-item">
      <span class="zone-name">${z.name}</span>
      <div class="zone-bar-wrap"><div class="zone-bar" style="width:${z.cur}%;background:${getZoneColor(z.cur)}"></div></div>
      <span class="zone-pct">${z.cur}%</span>
    </div>
  `).join('');
  // update most crowded zone stat
  const sorted = [...zones].sort((a,b)=>b.cur-a.cur);
  const mc = document.getElementById('mostCrowdedZone');
  if(mc) mc.textContent = sorted[0].name + ' — ' + sorted[0].cur + '%';
  const avgW = document.getElementById('avgWaitTime');
  if(avgW) avgW.textContent = (waitData.reduce((a,b)=>a+b.time,0)/waitData.length).toFixed(0)+' min';
}

/* ===== FOOD RENDERING ===== */
function renderFood() {
  const el = document.getElementById('foodView');
  let html = '';
  foodMenu.forEach(cat => {
    html += `<div class="food-section"><div class="food-section-title">${cat.cat}</div>`;
    cat.items.forEach(item => {
      html += `<div class="food-item">
        <div>
          <div class="food-name">${item.name}</div>
          <div class="food-avail" style="color:${item.avail.includes('Low')||item.avail.includes('High')?'var(--yellow)':'var(--text3)'}">${item.avail} · ~${item.eta}min</div>
        </div>
        <div style="display:flex;align-items:center;gap:.5rem">
          <span class="food-price">${item.price}</span>
          <button class="food-add" onclick="addToCart('${item.name}',${item.price.replace(/[^\d]/g,'')})">+</button>
        </div>
      </div>`;
    });
    html += '</div>';
  });
  if(cartItems.length > 0) {
    const total = cartItems.reduce((a,b)=>a+b.price,0);
    html += `<div class="cart-bar"><span class="cart-bar-text">${cartItems.length} item(s) · ₹${total}</span><button class="cart-bar-btn" onclick="checkout()">Checkout</button></div>`;
  }
  el.innerHTML = html;
}

function addToCart(name, price) {
  cartItems.push({name,price});
  renderFood();
  showToast('success','🛒 Added ' + name + ' to cart');
}

function checkout() {
  showToast('success','✅ Order placed! Estimated pickup: ~12 min');
  cartItems = [];
  renderFood();
}

/* ===== WAITS RENDERING (Enhanced) ===== */
function renderWaits() {
  const wg = document.getElementById('waitGrid');
  wg.innerHTML = waitData.map(w => {
    const color = w.time <= 3 ? 'var(--green)' : w.time <= 8 ? 'var(--yellow)' : 'var(--red)';
    return `<div class="wait-card${w.best?' best':''}">
      <div class="wait-name">${w.name}</div>
      <div class="wait-time" style="color:${color}">${w.time} min</div>
      <div class="wait-sub">${w.best?'🌟 Best option':w.time<=5?'Short wait':w.time<=10?'Moderate':'Long queue'}</div>
    </div>`;
  }).join('');

  // NEW: Queue enhancement
  const qe = document.getElementById('queueEnhanced');
  if(qe) {
    qe.innerHTML = queueData.map(q => `
      <div class="queue-item${q.least?' least-busy':''}">
        <div>
          <div class="queue-name">${q.name}${q.least?' 🌟':''}</div>
          ${q.orders.length>0?`<div style="margin-top:.25rem;display:flex;gap:.3rem;flex-wrap:wrap">${q.orders.map(o=>`<span class="order-status ${o.status}">${o.id}: ${o.status==='ready'?'✓ Ready':'⏳ Preparing'}</span>`).join('')}</div>`:'<div style="font-size:.67rem;color:var(--text3)">No active orders</div>'}
        </div>
        <div class="queue-wait-val ${q.wait<=4?'low':q.wait<=9?'mid':'high'}">${q.wait}m</div>
      </div>
    `).join('');
  }
}

/* ===== GROUPS RENDERING ===== */
function renderGroups() {
  const el = document.getElementById('groupStatus');
  if(!groupCreated) {
    el.innerHTML = `<div style="font-size:.78rem;color:var(--text2);text-align:center;padding:.5rem 0">No active group. Create one to start tracking your friends!</div>`;
    document.getElementById('groupQRCard').style.display = 'none';
    document.getElementById('groupMembersCard').style.display = 'none';
  } else {
    el.innerHTML = `<div class="group-id-chip">Group <strong>${groupId}</strong> — Active</div>`;
    document.getElementById('groupQRCard').style.display = '';
    document.getElementById('groupMembersCard').style.display = '';
    document.getElementById('groupIdLabel').textContent = 'Group Code: ' + groupId;
    document.getElementById('memberCount').textContent = groupMembers.length + ' members';
    const ml = document.getElementById('groupMembersList');
    ml.innerHTML = groupMembers.map(m=>`
      <div class="group-member-row">
        <div class="group-member-dot" style="background:${m.color}"></div>
        <span style="flex:1">${m.name}</span>
        <span style="font-size:.7rem;color:var(--text3)">${m.zone}</span>
      </div>
    `).join('');
    renderGroupDots();
  }
}

function createGroup() {
  groupId = 'GT-' + (Math.random()*9000+1000|0);
  groupCreated = true;
  groupMembers = [
    { name:'You (Alex)',   zone:'Gate D area',  color:groupColors[0], cx:400, cy:490 },
    { name:'Riya',         zone:'Food Court',   color:groupColors[1], cx:290, cy:310 },
    { name:'Dev',          zone:'Sec 101',      color:groupColors[2], cx:220, cy:230 },
    { name:'Priya',        zone:'Gate B area',  color:groupColors[3], cx:400, cy:100 },
  ];
  renderGroups();
  renderQR();
  showToast('success','👥 Group ' + groupId + ' created! Share QR to invite.');
}

function joinGroupPrompt() {
  showToast('info','📷 Point camera at group QR code to join');
}

function renderQR() {
  const el = document.getElementById('groupQRDisplay');
  // Procedurally generate a mock QR-looking pattern
  const seed = groupId ? groupId.charCodeAt(3) : 42;
  const cells = [];
  const sz = 7;
  for(let r=0;r<sz;r++) for(let c=0;c<sz;c++) {
    // Corners always dark for QR look
    const isCorner = (r<3&&c<3)||(r<3&&c>=4)||(r>=4&&c<3);
    const val = isCorner ? (r===1&&c===1||r===1&&c===5||r===5&&c===1 ? 0 : (r<3||c<3||r>=4||c<3)?1:0) : ((seed*r*c+r+c)%3===0?1:0);
    cells.push(val);
  }
  el.innerHTML = `<div class="qr-mock">${cells.map(v=>`<div class="qr-cell" style="background:${v?'#000':'#fff'}"></div>`).join('')}</div>`;
}

function renderGroupDots() {
  const g = document.getElementById('groupDots');
  if(!g || !groupCreated) return;
  g.innerHTML = groupMembers.map((m,i) => `
    <g>
      <circle cx="${m.cx}" cy="${m.cy}" r="10" fill="${m.color}" opacity=".25"/>
      <circle cx="${m.cx}" cy="${m.cy}" r="5" fill="${m.color}" stroke="#fff" stroke-width="1.5"/>
      <text x="${m.cx+8}" y="${m.cy-6}" font-size="7" fill="${m.color}" font-family="Space Grotesk" font-weight="600">${m.name.split(' ')[0]}</text>
    </g>
  `).join('');
}

function findMyGroup() {
  const nearest = groupMembers[1];
  showToast('info','📍 Routing to ' + nearest.name + ' at ' + nearest.zone);
  drawRoute(0);
  document.getElementById('etaBar').style.display = 'flex';
  document.getElementById('etaBarTime').textContent = '3 min';
  document.getElementById('etaBarInfo').textContent = 'To ' + nearest.name + ' · 180 m';
}

function suggestMeetup() {
  const el = document.getElementById('meetupResult');
  el.innerHTML = `<strong style="color:var(--accent2)">🤝 Suggested Meetup Point:</strong><br>
    <span style="color:var(--text1)">Food Court 2 (Gate C side)</span><br>
    <span style="color:var(--text3);font-size:.7rem">Midpoint with lowest crowd density — ~38% occupancy. ETA for all members: 4–6 min.</span>`;
  el.classList.add('show');
  showToast('success','🤝 Meetup point suggested: Food Court 2');
}

/* ===== SMART NUDGE SYSTEM ===== */
const nudges = [
  { icon:'🚪', title:'Less Crowded Entry', text:'Gate C currently has only 3-min wait. Gate A is backed up.' },
  { icon:'🍕', title:'No Queue at Food Court 3', text:'Counter 3 (Snack Bar) has zero wait right now.' },
  { icon:'🚽', title:'WC-B is Free', text:'Washroom B has 2-min wait vs 9-min at WC-A.' },
  { icon:'📍', title:'Your seat reachable in 4 min', text:'Start heading now — halftime crowd forming.' },
  { icon:'🌡', title:'Hydration Reminder', text:'It\'s 34°C at Narendra Modi Stadium. Water stations at Gate B and Gate D.' },
  { icon:'🎶', title:'Pre-Match Show Starting', text:'BCCI DJ set starts in 10 min near North Stand.' },
];
let nudgeIndex = 0;

function showNudge(title, text, icon='💡') {
  const wrap = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className = 'toast info';
  t.style.flexDirection = 'column';
  t.innerHTML = `<div class="nudge-toast-title">${icon} ${title}</div><div class="nudge-toast-text">${text}</div>`;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 6000);
}

/* ===== TOAST SYSTEM ===== */
function showToast(type, msg) {
  const wrap = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  const icons = { success:'✅', warn:'⚠️', danger:'🚨', info:'ℹ️' };
  t.innerHTML = `<span>${icons[type]||'•'}</span><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 4500);
}

/* ===== HEATMAP LAYER ===== */
function updateHeatmap() {
  const layer = document.getElementById('heatmapLayer');
  const adminLayer = document.getElementById('adminHeatmap');
  if(!layer) return;

  let cells = zones.map(z => {
    const alpha = (z.cur / 100) * 0.55;
    const col = z.cur>=80 ? `rgba(255,68,68,${alpha})` : z.cur>=55 ? `rgba(255,204,0,${alpha})` : `rgba(0,230,118,${alpha})`;
    return `<ellipse cx="${z.cx}" cy="${z.cy}" rx="${z.rx}" ry="${z.ry}" fill="${col}" class="heatmap-cell"
      onmouseenter="showHeatmapTooltip(event,'${z.name}',${z.cur})"
      onmouseleave="hideHeatmapTooltip()"/>`;
  }).join('');
  layer.innerHTML = cells;

  if(adminLayer) {
    adminLayer.innerHTML = zones.map(z => {
      // scale to admin SVG (800x600 same)
      const alpha = (z.cur/100)*0.6;
      const col = z.cur>=80?`rgba(255,68,68,${alpha})`:z.cur>=55?`rgba(255,204,0,${alpha})`:`rgba(0,230,118,${alpha})`;
      return `<ellipse cx="${z.cx}" cy="${z.cy}" rx="${z.rx}" ry="${z.ry}" fill="${col}" opacity="1"/>`;
    }).join('');
  }
}

function showHeatmapTooltip(e, name, pct) {
  const tt = document.getElementById('heatmapTooltip');
  const wait = Math.max(1, Math.round(pct/8));
  const state = pct>=80?'<span class="state-high">🔴 High Risk</span>':pct>=55?'<span class="state-busy">🟡 Busy</span>':'<span class="state-calm">🟢 Calm</span>';
  tt.innerHTML = `
    <div class="heatmap-tooltip-title">${name}</div>
    <div class="heatmap-tooltip-row"><span>Crowd</span><span style="color:${getZoneColor(pct)};font-weight:600">${pct}%</span></div>
    <div class="heatmap-tooltip-row"><span>Avg Wait</span><span>${wait} min</span></div>
    <div class="heatmap-tooltip-row"><span>State</span>${state}</div>
  `;
  tt.style.display = 'block';
  tt.style.left = (e.clientX + 12) + 'px';
  tt.style.top = (e.clientY - 10) + 'px';
}

function hideHeatmapTooltip() {
  document.getElementById('heatmapTooltip').style.display = 'none';
}

/* ===== DIGITAL TWIN DOTS ===== */
let twinDotPositions = [];
function initTwinDots() {
  twinDotPositions = [];
  // Spawn dots spread across zones
  zones.forEach(z => {
    const count = Math.round(z.cur / 12);
    for(let i=0;i<count;i++) {
      const angle = Math.random()*Math.PI*2;
      const r = Math.random();
      twinDotPositions.push({
        cx: z.cx + Math.cos(angle)*z.rx*0.8*r,
        cy: z.cy + Math.sin(angle)*z.ry*0.8*r,
        vx: (Math.random()-.5)*0.5,
        vy: (Math.random()-.5)*0.5,
        color: getZoneColor(z.cur),
        zone: z,
      });
    }
  });
}

function updateTwinDots() {
  if(!showTwin) return;
  twinDotPositions.forEach(d => {
    d.cx += d.vx + (Math.random()-.5)*0.3;
    d.cy += d.vy + (Math.random()-.5)*0.3;
    // bounce within zone
    const dx = d.cx - d.zone.cx, dy = d.cy - d.zone.cy;
    if(Math.abs(dx) > d.zone.rx*0.9) d.vx *= -1;
    if(Math.abs(dy) > d.zone.ry*0.9) d.vy *= -1;
    d.cx = Math.max(d.zone.cx-d.zone.rx*0.9, Math.min(d.zone.cx+d.zone.rx*0.9, d.cx));
    d.cy = Math.max(d.zone.cy-d.zone.ry*0.9, Math.min(d.zone.cy+d.zone.ry*0.9, d.cy));
  });
  const g = document.getElementById('twinDots');
  if(g) g.innerHTML = twinDotPositions.map(d=>`<circle cx="${d.cx.toFixed(1)}" cy="${d.cy.toFixed(1)}" r="2.2" fill="${d.color}" opacity="0.7"/>`).join('');
}

/* ===== CROWD PREDICTION PANEL ===== */
function renderPredPanel() {
  const el = document.getElementById('predItems');
  if(!el) return;
  el.innerHTML = predData.map(p => `
    <div class="pred-item">
      <span class="${p.dir==='up'?'pred-arrow-up':'pred-arrow-dn'}">${p.dir==='up'?'▲':'▼'}</span>
      <span><strong style="color:var(--text1)">${p.zone}</strong> will ${p.dir==='up'?'increase':'decrease'} by <strong style="color:var(--text1)">${p.pct}%</strong> in ${p.mins} min</span>
    </div>
  `).join('');
  renderMiniChart();
}

function renderMiniChart() {
  const svg = document.getElementById('miniChart');
  if(!svg) return;
  const W=200, H=38, n=chartPoints.length;
  const max=Math.max(...chartPoints), min=Math.min(...chartPoints);
  const xs = chartPoints.map((_,i)=>(i/(n-1))*W);
  const ys = chartPoints.map(v=>H - ((v-min)/(max-min+1))*(H-6)-2);
  const path = xs.map((x,i)=>`${i===0?'M':'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const fillPath = path + ` L${W},${H} L0,${H} Z`;
  svg.innerHTML = `
    <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00d4aa" stop-opacity=".3"/><stop offset="100%" stop-color="#00d4aa" stop-opacity="0"/></linearGradient></defs>
    <path d="${fillPath}" fill="url(#cg)"/>
    <path d="${path}" fill="none" stroke="var(--accent2)" stroke-width="1.5"/>
    ${xs.map((x,i)=>`<circle cx="${x.toFixed(1)}" cy="${ys[i].toFixed(1)}" r="2" fill="var(--accent2)" opacity="0.8"/>`).join('')}
  `;
}

/* ===== EMERGENCY MODE ===== */
function toggleEmergency() {
  emergencyActive = !emergencyActive;
  const overlay = document.getElementById('emergencyOverlay');
  overlay.classList.toggle('active', emergencyActive);

  if(emergencyActive) {
    renderExits();
    renderIncidents();
    highlightExits(true);
    showToast('danger','🚨 Emergency mode activated. Follow exit instructions.');
  } else {
    highlightExits(false);
  }
}

function renderExits() {
  const el = document.getElementById('exitList');
  el.innerHTML = exitData.map(e => `
    <div class="emergency-exit-item">
      <span class="exit-name">${e.safest?'⭐ ':''}${e.name}</span>
      <div style="text-align:right">
        <div class="exit-dist">${e.dist}</div>
        <div class="exit-state" style="color:${e.state==='Clear'?'var(--green)':e.state==='Moderate'?'var(--yellow)':'var(--red)'}">${e.state}</div>
      </div>
    </div>
  `).join('');
}

function renderIncidents() {
  const el = document.getElementById('incidentList');
  el.innerHTML = incidentData.map(inc => `
    <div class="emergency-alert-item">
      <div class="emergency-alert-title">⚠️ ${inc.title}</div>
      <div class="emergency-alert-sub">${inc.detail}</div>
    </div>
  `).join('');
}

function highlightExits(on) {
  const g = document.getElementById('exitHighlights');
  if(!g) return;
  if(on) {
    const exitPts = [{cx:85,cy:284},{cx:400,cy:65},{cx:705,cy:284},{cx:400,cy:520}];
    g.innerHTML = exitPts.map((p,i)=>`
      <circle cx="${p.cx}" cy="${p.cy}" r="22" fill="rgba(0,230,118,0.2)" stroke="#00e676" stroke-width="2" stroke-dasharray="4,2"/>
      <text x="${p.cx}" y="${p.cy+4}" text-anchor="middle" fill="#00e676" font-size="8" font-family="Space Grotesk" font-weight="700">EXIT</text>
    `).join('');
    g.style.opacity = '1';
    g.style.animation = 'exitPulse 1.5s ease-in-out infinite';
  } else {
    g.innerHTML = '';
    g.style.opacity = '0';
  }
}

/* ===== ADMIN PANEL ===== */
function initAdminPanel() {
  renderAdminZones();
  renderAlerts();
  renderStaff();
  renderGateVolumeChart();
  updateHeatmap();
}

function adminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(c=>c.classList.remove('active'));
  document.querySelectorAll('.admin-tab').forEach(b=>{ if(b.textContent.toLowerCase().startsWith(tab)) b.classList.add('active'); });
  const el = document.getElementById('atab-'+tab);
  if(el) el.classList.add('active');
}

function renderAlerts() {
  const el = document.getElementById('adminAlerts');
  if(!el) return;
  const alerts = [
    { msg:'Gate A capacity at 94% — risk of overflow', color:'var(--red)',    dot:'#ff4444' },
    { msg:'Sec 101 crowd density elevated',            color:'var(--yellow)', dot:'#ffcc00' },
    { msg:'Food Court 1 queue exceeding 15 min',       color:'var(--yellow)', dot:'#ffcc00' },
  ];
  el.innerHTML = alerts.map(a=>`
    <div class="alert-item">
      <div class="alert-dot" style="background:${a.dot}"></div>
      <span style="color:${a.color}">${a.msg}</span>
    </div>
  `).join('');
}

function renderStaff() {
  const el = document.getElementById('staffList');
  if(!el) return;
  el.innerHTML = staff.map(s=>`
    <div class="staff-row">
      <div class="staff-dot" style="background:${s.color}"></div>
      <span style="flex:1">${s.name}</span>
      <span style="color:var(--text3);font-size:.72rem">${s.loc}</span>
      <span style="color:${s.color};font-size:.7rem;margin-left:.4rem">${s.status}</span>
    </div>
  `).join('');
}

function renderGateVolumeChart() {
  const el = document.getElementById('gateVolumeChart');
  if(!el) return;
  const gates = [{name:'Gate A',val:94,col:'var(--red)'},{name:'Gate B',val:62,col:'var(--yellow)'},{name:'Gate C',val:45,col:'var(--green)'},{name:'Gate D',val:38,col:'var(--green)'}];
  el.innerHTML = gates.map(g=>`
    <div class="zone-item">
      <span class="zone-name">${g.name}</span>
      <div class="zone-bar-wrap"><div class="zone-bar" style="width:${g.val}%;background:${g.col}"></div></div>
      <span class="zone-pct">${g.val}%</span>
    </div>
  `).join('');
}

function adminTriggerSurge() { toggleSurge(); }

function dispatchAllStaff() {
  showToast('danger','🚨 All available staff dispatched to high-density zones');
  staff.forEach(s => { if(s.status==='On Duty') s.status='Dispatched'; s.color='#ffcc00'; });
  renderStaff();
}

function broadcastMsg() { showToast('info','📢 Announcement broadcast to all sections'); }
function openExtraGate() { showToast('success','🚪 Gate B Extra Lane opened — capacity increased by 35%'); }
function sendMedical() { showToast('warn','🚑 Medical team dispatched to Sector 103'); }

/* ===== WHAT-IF SIMULATION ===== */
function runWhatIf() {
  const wc = document.getElementById('wiGateC').checked;
  const wa = document.getElementById('wiGateA').checked;
  const wf = document.getElementById('wiFC2').checked;
  const we = document.getElementById('wiExtra').checked;
  const effects = [];

  if(wc) { zones.find(z=>z.id==='gateC').cur = 0;  effects.push('Gate C closed → Gate A & B crowds +22%'); }
  else   { zones.find(z=>z.id==='gateC').cur = 45; }

  if(wa) { zones.find(z=>z.id==='gateA').cur = Math.min(50, zones.find(z=>z.id==='gateA').base); effects.push('Gate A restricted → overflow to Gate B & D'); }
  else   { zones.find(z=>z.id==='gateA').cur = zones.find(z=>z.id==='gateA').base; }

  if(wf) { effects.push('Food Court 2 closed → Court 1 wait +8 min'); }
  if(we) { effects.push('Emergency Gate E open → overall wait time -18%'); zones.find(z=>z.id==='gateD').cur = Math.max(15, zones.find(z=>z.id==='gateD').cur - 20); }

  const el = document.getElementById('whatifEffect');
  if(effects.length > 0) {
    el.innerHTML = effects.map(e=>`<div style="padding:2px 0;border-bottom:1px solid rgba(255,204,0,.1)">⚡ ${e}</div>`).join('');
    el.classList.add('show');
    updateHeatmap();
    renderAdminZones();
    showToast('warn','🔮 What-If simulation updated heatmap');
  } else {
    el.classList.remove('show');
    zones.forEach(z=>z.cur=z.base);
    updateHeatmap();
    renderAdminZones();
  }
}

/* ===== CROWD DOTS ===== */
function updateAdminDots() {
  const g = document.getElementById('adminDots');
  if(!g) return;
  let dots = '';
  zones.forEach(z => {
    const count = Math.round(z.cur / 15);
    for(let i=0;i<count;i++) {
      const angle = Math.random()*Math.PI*2;
      const r = Math.random()*0.8;
      const cx = z.cx + Math.cos(angle)*z.rx*r;
      const cy = z.cy + Math.sin(angle)*z.ry*r;
      dots += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="2.5" fill="${getZoneColor(z.cur)}" opacity="0.65"/>`;
    }
  });
  g.innerHTML = dots;
}

function updateMainDots() {
  const g = document.getElementById('crowdDots');
  if(!g) return;
  let dots = '';
  zones.forEach(z => {
    const count = Math.round(z.cur / 14);
    for(let i=0;i<count;i++) {
      const angle = Math.random()*Math.PI*2;
      const r = Math.random()*0.8;
      const cx = z.cx + Math.cos(angle)*z.rx*r;
      const cy = z.cy + Math.sin(angle)*z.ry*r;
      const col = getZoneColor(z.cur);
      dots += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="2" fill="${col}" opacity="0.55"/>`;
    }
  });
  g.innerHTML = dots;
}

/* ===== CLOCK & COUNTDOWN ===== */
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');
  const clockEl = document.getElementById('liveClock');
  if(clockEl) clockEl.textContent = hh+':'+mm+':'+ss;

  // Countdown to 19:30 IST (7:30 PM)
  const matchTime = new Date(now);
  matchTime.setHours(19, 30, 0, 0);
  if(now > matchTime) matchTime.setDate(matchTime.getDate()+1); // next day if past
  const diff = matchTime - now;
  const cdEl = document.getElementById('countdownVal');
  const cdLabel = document.getElementById('countdownLabel');
  if(cdEl) {
    if(diff <= 0) {
      cdEl.textContent = '● LIVE';
      cdEl.className = 'event-countdown-val live-blink';
      if(cdLabel) cdLabel.textContent = 'Match is';
    } else {
      const ch = String(Math.floor(diff/3600000)).padStart(2,'0');
      const cm = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
      const cs = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
      cdEl.textContent = ch+':'+cm+':'+cs;
      cdEl.className = 'event-countdown-val';
      if(cdLabel) cdLabel.textContent = 'Match starts in';
    }
  }

  // Temperature shimmer (mock realistic variation)
  const tempEl = document.getElementById('liveTemp');
  if(tempEl) {
    const temps = [33,34,34,34,33,34,35,34,33];
    tempEl.textContent = temps[now.getSeconds()%temps.length]+'°C';
  }
}

/* ===== DYNAMIC WAIT UPDATE ===== */
function tickWaits() {
  waitData.forEach(w => {
    const delta = (Math.random()-.4)*2|0;
    w.time = Math.max(1, Math.min(30, w.time+delta));
  });
  queueData.forEach(q => {
    const d = (Math.random()-.45)*1.5|0;
    q.wait = Math.max(1, Math.min(20, q.wait+d));
    q.least = q.wait === Math.min(...queueData.map(x=>x.wait));
  });
  const upEl = document.getElementById('waitUpdated');
  if(upEl) upEl.textContent = 'Updated just now';
  if(currentTab==='waits') renderWaits();
}

/* ===== CROWD PREDICTION TICK ===== */
function tickPred() {
  predData.forEach(p => {
    p.pct = Math.max(5, Math.min(40, p.pct + ((Math.random()-.5)*4|0)));
    p.mins = Math.max(2, Math.min(20, p.mins + ((Math.random()-.5)*2|0)));
  });
  chartPoints.push(Math.max(10, Math.min(50, chartPoints[chartPoints.length-1]+((Math.random()-.4)*6|0))));
  if(chartPoints.length>12) chartPoints.shift();
  renderPredPanel();
}

/* ===== NUDGE SCHEDULER ===== */
function scheduleNudges() {
  setInterval(()=>{
    if(currentScreen==='main-app' && Math.random()>.6) {
      const n = nudges[nudgeIndex % nudges.length];
      showNudge(n.title, n.text, n.icon);
      nudgeIndex++;
    }
  }, 18000);

  // Crowd imbalance nudge
  setInterval(()=>{
    const highZone = zones.filter(z=>z.cur>80);
    const lowZone = zones.filter(z=>z.cur<45);
    if(highZone.length>0 && lowZone.length>0 && currentScreen==='main-app') {
      showNudge(
        `${lowZone[0].name} is much quieter`,
        `Avoid ${highZone[0].name} (${highZone[0].cur}%). ${lowZone[0].name} only ${lowZone[0].cur}% full.`,
        '💡'
      );
    }
  }, 35000);
}

/* ===== MAIN APP INIT ===== */
function initMainApp() {
  renderZones();
  renderPredPanel();
  renderSmartRoutes();
  updateHeatmap();
  initTwinDots();
  if(groupCreated) renderGroupDots();
}

/* ===== MAIN SIMULATION LOOP ===== */
setInterval(()=>{
  if(currentScreen==='main-app') {
    updateTwinDots();
    updateMainDots();
  }
  if(currentScreen==='admin-panel') {
    updateAdminDots();
  }
}, 800);

setInterval(()=>{
  // Gently fluctuate zone densities
  zones.forEach(z => {
    const d = (Math.random()-.45)*2|0;
    z.cur = Math.max(15, Math.min(98, z.cur+d));
    z.base = Math.max(15, Math.min(98, z.base+(Math.random()>.8?d:0)));
  });
  if(currentScreen==='main-app') { renderZones(); updateHeatmap(); }
  if(currentScreen==='admin-panel') { renderAdminZones(); updateHeatmap(); }
}, 4000);

setInterval(tickWaits, 8000);
setInterval(tickPred, 10000);
setInterval(updateClock, 1000);
scheduleNudges();

// Kick off clock immediately
updateClock();

/* ===== EXIT PULSE KEYFRAME (injected) ===== */
const exitStyle = document.createElement('style');
exitStyle.textContent = `@keyframes exitPulse{0%,100%{opacity:1}50%{opacity:.5}}`;
document.head.appendChild(exitStyle);
