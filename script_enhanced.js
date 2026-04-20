/* =========================================================
   SMARTSTADIUM — FULL SCRIPT (Production Grade)
   Venue: Narendra Modi Stadium, Ahmedabad | IPL: GT vs MI
   ========================================================= */

/* ===== DOM CACHE & HELPERS ===== */
const $el = id => document.getElementById(id);
const $qs = sel => document.querySelector(sel);
const $qsa = sel => document.querySelectorAll(sel);

/**
 * Sanitizes input to prevent basic XSS and limit length
 * @param {string} str - User input string
 * @returns {string} Sanitized string (max 50 chars)
 */
function sanitizeInput(str) {
  if (!str) return '';
  return String(str).replace(/[<>]/g, '').substring(0, 50);
}

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

// New feature states
let currentScenario = 'normal';
let autoModeActive = true;
let qrScanner = null;
let scannedTickets = new Set();
let dirtyFlags = { heatmap: true, zones: true, twinDots: true, stress: true };
let simulationEngineId = null;

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

/* ===== WAIT & QUEUE DATA ===== */
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
  { name:'Officer Mehta',  loc:'Sec 101',   status:'Patrolling',color:'#3b82f6'},
  { name:'Officer Kumar',  loc:'Food Court',status:'Dispatched',color:'#ffcc00'},
  { name:'Officer Singh',  loc:'Gate C',    status:'On Duty',  color:'#00e676' },
  { name:'Officer Rao',    loc:'Medical',   status:'Standby',  color:'#8ba4c4' },
];

/* ===== GROUP DATA ===== */
const groupColors = ['#ff6b6b','#4ecdc4','#ffe66d','#a8e6cf','#dda0dd'];
let groupMembers = [];

/* ===== PREDICTION & EMERGENCY DATA ===== */
const predData = [
  { zone:'Gate A', dir:'up',   pct:20, mins:10 },
  { zone:'Gate B', dir:'down', pct:12, mins:8  },
  { zone:'Sec 103',dir:'up',   pct:15, mins:15 },
  { zone:'Gate D', dir:'down', pct:8,  mins:5  },
];
const chartPoints = [12,18,22,17,25,30,28,35,38,34,40,42];
const exitData = [
  { name:'Gate D (South)', dist:'120 m', state:'Clear',    safest:true  },
  { name:'Gate B (North)', dist:'210 m', state:'Clear',    safest:false },
  { name:'Gate C (East)',  dist:'265 m', state:'Moderate', safest:false },
  { name:'Gate A (West)',  dist:'310 m', state:'Busy',     safest:false },
];
const incidentData = [
  { title:'Minor overcrowding — Gate A', detail:'Staff deployed. Situation under control.' },
  { title:'Medical assistance — Section 103', detail:'Paramedic team en route.' },
];

/* =========================================================
   1. NAVIGATION & INITIALIZATION
   ========================================================= */

function goTo(id) {
  $qsa('.screen').forEach(s => s.classList.remove('active'));
  $el(id).classList.add('active');
  currentScreen = id;
  
  if (id === 'scan-screen') {
    // Reset scan screen state
    $el('scanSuccess').classList.add('hidden');
    $el('manual-scan-area').style.display = 'block';
    $el('qr-reader-container').style.display = 'none';
  }
  if (id === 'main-app') initMainApp();
  if (id === 'admin-panel') initAdminPanel();
}

function loginAsGuest() {
  // Show the Google OAuth modal
  const overlay = $el('oauthOverlay');
  if (overlay) {
    overlay.classList.add('active');
    overlay.focus && overlay.focus();
  }
}

/**
 * Called by Google Identity Services after a successful sign-in.
 * Decodes the JWT credential to extract name/email/picture.
 * @param {Object} response - GSI credential response
 */
function handleGoogleSignIn(response) {
  try {
    // Decode the JWT payload (base64url, middle segment)
    const payload = JSON.parse(atob(response.credential.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
    const name    = sanitizeInput(payload.given_name || payload.name || 'User');
    const email   = sanitizeInput(payload.email || '');
    const picture = payload.picture || '';

    // Close the modal
    const overlay = $el('oauthOverlay');
    if (overlay) overlay.classList.remove('active');

    // Set display name
    const userNameEl = $el('userName');
    if (userNameEl) userNameEl.textContent = name;

    // Optionally store for later use
    window._guestUser = { name, email, picture, role: 'google' };

    goTo('main-app');
    showToast('success', `👋 Welcome, ${name}!`);
  } catch (e) {
    console.error('Google sign-in decode error:', e);
    skipGoogleSignIn(); // graceful fallback
  }
}

/** Skip Google sign-in and continue as anonymous guest. */
function skipGoogleSignIn() {
  const overlay = $el('oauthOverlay');
  if (overlay) overlay.classList.remove('active');
  $el('userName').textContent = 'Guest';
  window._guestUser = { name: 'Guest', role: 'guest' };
  goTo('main-app');
}

function doAdminLogin() {
  const u = sanitizeInput($el('adminUser').value.trim());
  const p = sanitizeInput($el('adminPass').value.trim());
  const err = $el('loginErr');
  if(u === 'admin' && p === 'admin123') { 
    err.classList.remove('show'); 
    goTo('admin-panel'); 
  } else { 
    err.classList.add('show'); 
  }
}

/* =========================================================
   2. QR TICKET SCANNER (New Feature)
   ========================================================= */

function startQRScanner() {
  if (typeof Html5Qrcode === 'undefined') {
    showToast('warn', 'Scanner library not loaded. Falling back to simulation.');
    simulateScan('B7-102', 'Gate B');
    return;
  }

  $el('manual-scan-area').style.display = 'none';
  $el('qr-reader-container').style.display = 'block';

  qrScanner = new Html5Qrcode("qr-reader");
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };

  qrScanner.start({ facingMode: "environment" }, config, onTicketScanned, (err) => {
    // Ignore frequent scan errors (expected while searching)
  }).catch(err => {
    console.error("QR Start failed:", err);
    showToast('danger', 'Camera access denied or unavailable.');
    stopQRScanner();
  });
}

function stopQRScanner() {
  if (qrScanner && qrScanner.isScanning) {
    qrScanner.stop().catch(console.error);
  }
  $el('qr-reader-container').style.display = 'none';
  $el('manual-scan-area').style.display = 'block';
}

function onTicketScanned(decodedText) {
  stopQRScanner();
  $el('scanningOverlay').classList.remove('hidden');
  
  setTimeout(() => {
    $el('scanningOverlay').classList.add('hidden');
    try {
      const ticket = validateTicketData(decodedText);
      showTicketSuccess(ticket);
    } catch (e) {
      showToast('danger', '❌ ' + e.message);
    }
  }, 800); // Artificial delay for UX
}

/**
 * Validates JSON ticket data and prevents reuse
 */
function validateTicketData(dataStr) {
  let data;
  try {
    data = JSON.parse(dataStr);
  } catch (e) { throw new Error('Invalid QR Code format'); }
  
  if (!data.id || !data.name || !data.seat || !data.gate || !data.event) {
    throw new Error('Invalid Ticket: Missing required data fields');
  }
  
  if (scannedTickets.has(data.id)) {
    throw new Error('Duplicate Scan: Ticket already entered');
  }
  
  scannedTickets.add(data.id);
  return data;
}

function showTicketSuccess(ticket) {
  $el('manual-scan-area').style.display = 'none';
  $el('scanSuccess').classList.remove('hidden');
  
  $el('ticketName').textContent = sanitizeInput(ticket.name);
  $el('ticketSeat').textContent = sanitizeInput(ticket.seat);
  $el('ticketGate').textContent = sanitizeInput(ticket.gate);
  $el('ticketEvent').textContent = sanitizeInput(ticket.event);
  
  // Set global user info for main app
  $el('userName').textContent = sanitizeInput(ticket.name.split(' ')[0]);
  $el('seatInput').value = sanitizeInput(ticket.seat.split('-')[1]);
}

function loginTicket() {
  goTo('main-app');
  // Auto-trigger navigation to their seat
  setTimeout(() => {
    findRoute();
    showToast('success', '📍 Auto-routing to your seat');
  }, 1000);
}

// Simulators for demo purposes
function simulateScan(seat, gate) {
  const mockTicket = JSON.stringify({
    id: 'TKT-' + Math.floor(Math.random()*10000),
    name: 'Alex Johnson',
    seat: 'B7-' + seat,
    gate: gate,
    event: 'GT vs MI'
  });
  onTicketScanned(mockTicket);
}

function simulateDuplicateScan() {
  // Add a fake ticket to the set first, then try to scan it
  scannedTickets.add('TKT-DUPE');
  const mockTicket = JSON.stringify({ id: 'TKT-DUPE', name: 'Thief', seat: 'V1', gate: 'A', event: 'GT vs MI' });
  onTicketScanned(mockTicket);
}

/* =========================================================
   3. MAIN APP & TAB SWITCHING
   ========================================================= */

function initMainApp() {
  if (!simulationEngineId) startSimulationEngine();
  renderZones();
  renderFood();
  renderWaits();
  renderPredPanel();
  initTwinDots();
}

function switchTab(tab) {
  $qsa('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  $qsa('.tab-content').forEach(c => c.classList.remove('active'));
  
  const tabs = ['nav','heatmap','food','waits','groups'];
  const idx = tabs.indexOf(tab);
  if (idx >= 0) { 
    const btn = $qsa('.tab-btn')[idx];
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
  }
  
  const content = $el('tab-'+tab);
  if (content) content.classList.add('active');
  
  currentTab = tab;
  if(tab === 'food') renderFood();
  if(tab === 'waits') renderWaits();
  if(tab === 'groups') renderGroups();
  if(tab === 'heatmap') renderZones();
}

/* =========================================================
   4. ROUTING & SMART ROUTES
   ========================================================= */

// Debounce route finding
let findRouteTimeout = null;
function findRoute() {
  if (findRouteTimeout) clearTimeout(findRouteTimeout);
  
  findRouteTimeout = setTimeout(() => {
    const seatRaw = $el('seatInput').value || '102';
    const seat = sanitizeInput(seatRaw);
    
    $el('seatLabel').textContent = 'Seat ' + seat;
    $el('seatMarker').style.display = '';
    $el('etaBar').style.display = 'flex';
    
    selectRoute(0);
    renderSmartRoutes();
    showToast('info','🗺 Route found to Seat ' + seat);
  }, 300);
}

function selectRoute(idx) {
  currentRoute = idx;
  [0,1,2].forEach(i => {
    const rp = $el('rp'+i);
    if(rp) rp.classList.toggle('active', i===idx);
  });
  
  const r = routes[idx];
  $el('etaTime').textContent = r.eta;
  $el('etaDist').textContent = r.dist + ' · ' + r.type;
  $el('routeType').textContent = r.type.toUpperCase();
  $el('etaBarTime').textContent = r.eta;
  $el('etaBarInfo').textContent = r.label + ' · ' + r.dist;
  
  const steps = $el('routeSteps');
  steps.innerHTML = r.steps.map(s => {
    const icon = s.split(' ')[0];
    const text = s.substring(s.indexOf(' ')+1);
    // Sanitized implicitly since it comes from constant routes array
    return `<div class="route-step"><span class="step-icon">${icon}</span>${text}</div>`;
  }).join('');
  
  drawRoute(idx);
  
  // Update smart route cards
  $qsa('.route-option-card').forEach((c,i) => c.classList.toggle('selected', i===idx));
}

function renderSmartRoutes() {
  const container = $el('smartRouteCards');
  const extras = [
    { type:'🚀 Fastest',        badge:'badge-fastest',  eta:'4 min', dist:'280 m', crowd:'Medium 62%' },
    { type:'🌿 Least Crowded',  badge:'badge-quiet',    eta:'7 min', dist:'420 m', crowd:'Low 38%'    },
    { type:'⚖ Balanced',        badge:'badge-balanced', eta:'5 min', dist:'330 m', crowd:'Medium 52%' },
  ];
  
  container.innerHTML = extras.map((r,i) => `
    <div class="route-option-card${i===currentRoute?' selected':''}" onclick="selectRoute(${i})" tabindex="0" role="button">
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
  const layer = $el('routeLayer');
  const paths = [
    'M400,490 L400,460 L400,380 L400,280 L400,200',
    'M400,490 L500,490 L600,400 L650,300 L580,230',
    'M400,490 L400,520 L480,520 L560,440 L560,360 L520,280 L470,220',
  ];
  const colors = ['#3b82f6','#00e676','#00d4aa'];
  layer.innerHTML = `<path d="${paths[idx]}" fill="none" stroke="${colors[idx]}" stroke-width="3" stroke-dasharray="8,4" opacity=".8" marker-end="url(#arrowBlue)"/>`;
}

/* =========================================================
   5. MAP TOGGLES & OVERLAYS
   ========================================================= */

function toggleAvoid() { 
  avoidCrowd = !avoidCrowd; 
  const t = $el('avoidToggle');
  t.classList.toggle('on', avoidCrowd); 
  t.setAttribute('aria-checked', avoidCrowd);
  showToast('info', 'Avoid crowded: ' + (avoidCrowd ? 'ON' : 'OFF')); 
}

function toggleLiveLoc() { 
  const t = $el('liveLocToggle'); 
  const isOn = t.classList.toggle('on'); 
  t.setAttribute('aria-checked', isOn);
  showToast('info', 'Live tracking ' + (isOn ? 'enabled' : 'paused')); 
}

function toggleDots() { 
  showDots = !showDots; 
  const t = $el('dotsToggle');
  t.classList.toggle('on', showDots); 
  t.setAttribute('aria-checked', showDots);
  $el('crowdDots').style.opacity = showDots ? 1 : 0; 
}

function toggleTwin() { 
  showTwin = !showTwin; 
  const t = $el('twinToggle');
  t.classList.toggle('on', showTwin); 
  t.setAttribute('aria-checked', showTwin);
  $el('twinDots').style.opacity = showTwin ? 1 : 0; 
  $el('heatmapLayer').style.opacity = showTwin ? '0.55' : 0; 
}

/* =========================================================
   6. DYNAMIC UI RENDERERS (Heatmap, Zones, Chart)
   ========================================================= */

function getZoneColor(pct) {
  if(pct >= 80) return '#ff4444';
  if(pct >= 55) return '#ffcc00';
  return '#00e676';
}

function renderZoneList(containerId) {
  const container = $el(containerId);
  if (!container) return;
  
  container.innerHTML = zones.map(z => `
    <div class="zone-item">
      <span class="zone-name">${z.name}</span>
      <div class="zone-bar-wrap">
        <div class="zone-bar" style="width:${z.cur}%;background:${getZoneColor(z.cur)}"></div>
      </div>
      <span class="zone-pct">${z.cur}%</span>
    </div>
  `).join('');
}

function renderZones() {
  if (!dirtyFlags.zones) return;
  renderZoneList('zoneList');
  renderAdminZones();
  dirtyFlags.zones = false;
}

function renderAdminZones() {
  renderZoneList('adminZones');
  
  // Update most crowded zone stat
  const sorted = [...zones].sort((a,b) => b.cur - a.cur);
  const mc = $el('mostCrowdedZone');
  if (mc) mc.textContent = `${sorted[0].name} — ${sorted[0].cur}%`;
  
  const avgW = $el('avgWaitTime');
  if (avgW) avgW.textContent = (waitData.reduce((a,b)=>a+b.time,0)/waitData.length).toFixed(0)+' min';
}

function updateHeatmap() {
  if (!dirtyFlags.heatmap) return;
  const layer = $el('heatmapLayer');
  const adminLayer = $el('adminHeatmap');
  
  if (layer) {
    layer.innerHTML = zones.map(z => {
      const alpha = (z.cur / 100) * 0.55;
      const col = z.cur>=80 ? `rgba(255,68,68,${alpha})` : z.cur>=55 ? `rgba(255,204,0,${alpha})` : `rgba(0,230,118,${alpha})`;
      return `<ellipse cx="${z.cx}" cy="${z.cy}" rx="${z.rx}" ry="${z.ry}" fill="${col}" class="heatmap-cell"
        onmouseenter="showHeatmapTooltip(event,'${z.name}',${z.cur})"
        onmouseleave="hideHeatmapTooltip()"/>`;
    }).join('');
  }

  if (adminLayer) {
    adminLayer.innerHTML = zones.map(z => {
      const alpha = (z.cur/100) * 0.6;
      const col = z.cur>=80 ? `rgba(255,68,68,${alpha})` : z.cur>=55 ? `rgba(255,204,0,${alpha})` : `rgba(0,230,118,${alpha})`;
      return `<ellipse cx="${z.cx}" cy="${z.cy}" rx="${z.rx}" ry="${z.ry}" fill="${col}" opacity="1"/>`;
    }).join('');
  }
  dirtyFlags.heatmap = false;
}

function showHeatmapTooltip(e, name, pct) {
  const tt = $el('heatmapTooltip');
  const wait = Math.max(1, Math.round(pct/8));
  const state = pct>=80 ? '<span class="state-high">🔴 High Risk</span>' : pct>=55 ? '<span class="state-busy">🟡 Busy</span>' : '<span class="state-calm">🟢 Calm</span>';
  
  // Safe since inputs are from constant array
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
  $el('heatmapTooltip').style.display = 'none';
}

/* =========================================================
   7. DIGITAL TWIN DOTS (RAF Optimized)
   ========================================================= */

let twinDotPositions = [];

function initTwinDots() {
  twinDotPositions = [];
  zones.forEach(z => {
    const count = Math.round(z.cur / 12);
    for(let i=0;i<count;i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random();
      twinDotPositions.push({
        cx: z.cx + Math.cos(angle) * z.rx * 0.8 * r,
        cy: z.cy + Math.sin(angle) * z.ry * 0.8 * r,
        vx: (Math.random() - .5) * 0.5,
        vy: (Math.random() - .5) * 0.5,
        color: getZoneColor(z.cur),
        zone: z,
      });
    }
  });
}

function renderCrowdDots(containerId, divisor, radius, opacity) {
  const container = $el(containerId);
  if (!container) return;
  
  let dots = '';
  zones.forEach(z => {
    const count = Math.round(z.cur / divisor);
    for(let i=0;i<count;i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.8;
      const cx = z.cx + Math.cos(angle) * z.rx * r;
      const cy = z.cy + Math.sin(angle) * z.ry * r;
      dots += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${radius}" fill="${getZoneColor(z.cur)}" opacity="${opacity}"/>`;
    }
  });
  container.innerHTML = dots;
}

// Called via requestAnimationFrame in the simulation engine
function animateTwinDots() {
  if (!showTwin) return;
  
  let dirty = false;
  twinDotPositions.forEach(d => {
    d.cx += d.vx + (Math.random()-.5)*0.3;
    d.cy += d.vy + (Math.random()-.5)*0.3;
    
    // Bounds check within zone ellipse
    const dx = d.cx - d.zone.cx;
    const dy = d.cy - d.zone.cy;
    if (Math.abs(dx) > d.zone.rx*0.9) { d.vx *= -1; dirty = true; }
    if (Math.abs(dy) > d.zone.ry*0.9) { d.vy *= -1; dirty = true; }
    
    d.cx = Math.max(d.zone.cx - d.zone.rx*0.9, Math.min(d.zone.cx + d.zone.rx*0.9, d.cx));
    d.cy = Math.max(d.zone.cy - d.zone.ry*0.9, Math.min(d.zone.cy + d.zone.ry*0.9, d.cy));
  });

  if (dirty || dirtyFlags.twinDots) {
    const g = $el('twinDots');
    if (g) {
      g.innerHTML = twinDotPositions.map(d => 
        `<circle cx="${d.cx.toFixed(1)}" cy="${d.cy.toFixed(1)}" r="2.2" fill="${d.color}" opacity="0.7"/>`
      ).join('');
    }
    dirtyFlags.twinDots = false;
  }
}

/* =========================================================
   8. NEW FEATURES (Scenarios, Stress, Auto-Mode)
   ========================================================= */

function applyScenario(scenarioId) {
  currentScenario = scenarioId;
  autoModeActive = (scenarioId === 'normal'); // Disable auto-mode if manually setting scenario
  
  if (scenarioId === 'normal') {
    zones.forEach(z => z.cur = z.base);
    if (emergencyActive) toggleEmergency();
    showToast('info', 'Switched to Normal scenario');
  } 
  else if (scenarioId === 'peak') {
    zones.forEach(z => z.cur = Math.min(98, z.base + 25));
    if (emergencyActive) toggleEmergency();
    showToast('warn', 'Switched to Peak Crowd scenario');
  }
  else if (scenarioId === 'end') {
    // Exits overflow, inner stands empty
    zones.forEach(z => {
      if (z.id.startsWith('gate')) z.cur = 95;
      else z.cur = 20;
    });
    if (emergencyActive) toggleEmergency();
    showToast('info', 'Switched to Match End Rush scenario');
  }
  else if (scenarioId === 'emergency') {
    zones.forEach(z => z.cur = z.id==='gateA' ? 98 : z.base);
    if (!emergencyActive) toggleEmergency();
    showToast('danger', 'Emergency scenario activated');
  }

  dirtyFlags.zones = true;
  dirtyFlags.heatmap = true;
  dirtyFlags.stress = true;
  renderZones();
  updateHeatmap();
  calculateStressLevel();
}

function calculateStressLevel() {
  if (!dirtyFlags.stress) return;
  
  const avgDensity = zones.reduce((a,b) => a+b.cur, 0) / zones.length;
  const avgWait = waitData.reduce((a,b) => a+b.time, 0) / waitData.length;
  
  // Formula: Density matters slightly more than waits
  const stressScore = (avgDensity * 0.6) + (Math.min(avgWait * 3, 100) * 0.4);
  
  const el = $el('stressValue');
  const emoji = $el('stressEmoji');
  
  if (!el || !emoji) return;
  
  if (stressScore < 45) {
    el.textContent = 'Relaxed';
    el.className = 'stress-value relaxed';
    emoji.textContent = '😌';
  } else if (stressScore < 75) {
    el.textContent = 'Moderate';
    el.className = 'stress-value moderate';
    emoji.textContent = '😐';
  } else {
    el.textContent = 'High Stress';
    el.className = 'stress-value high';
    emoji.textContent = '😰';
  }
  dirtyFlags.stress = false;
}

function autoModeEngineTick() {
  if (!autoModeActive || currentScenario !== 'normal') return;
  
  const maxZone = [...zones].sort((a,b) => b.cur - a.cur)[0];
  
  if (maxZone.cur > 92 && Math.random() > 0.5) {
    showNudge(`High capacity at ${maxZone.name}`, 'Consider alternative routes to avoid the bottleneck.', '⚠️');
  }
}

/* =========================================================
   9. FOOD & WAITS
   ========================================================= */

function renderFood() {
  const el = $el('foodView');
  if (!el) return;
  
  let html = '';
  foodMenu.forEach(cat => {
    html += `<div class="food-section"><div class="food-section-title">${cat.cat}</div>`;
    cat.items.forEach(item => {
      // Safe interpolation, items defined in constant above
      html += `<div class="food-item" tabindex="0" role="button">
        <div>
          <div class="food-name">${item.name}</div>
          <div class="food-avail" style="color:${item.avail.includes('Low')||item.avail.includes('High')?'var(--yellow)':'var(--text3)'}">${item.avail} · ~${item.eta}min</div>
        </div>
        <div style="display:flex;align-items:center;gap:.5rem">
          <span class="food-price">${item.price}</span>
          <button class="food-add" aria-label="Add ${item.name} to cart" onclick="addToCart('${item.name}',${item.price.replace(/[^\d]/g,'')})">+</button>
        </div>
      </div>`;
    });
    html += '</div>';
  });
  
  if(cartItems.length > 0) {
    const total = cartItems.reduce((a,b) => a+b.price, 0);
    html += `<div class="cart-bar"><span class="cart-bar-text">${cartItems.length} item(s) · ₹${total}</span><button class="cart-bar-btn" onclick="checkout()">Checkout</button></div>`;
  }
  el.innerHTML = html;
}

function addToCart(name, price) {
  cartItems.push({name,price});
  renderFood();
  showToast('success', '🛒 Added ' + sanitizeInput(name) + ' to cart');
}

function checkout() {
  showToast('success','✅ Order placed! Estimated pickup: ~12 min');
  cartItems = [];
  renderFood();
}

function renderWaits() {
  const wg = $el('waitGrid');
  if (wg) {
    wg.innerHTML = waitData.map(w => {
      const color = w.time <= 3 ? 'var(--green)' : w.time <= 8 ? 'var(--yellow)' : 'var(--red)';
      return `<div class="wait-card${w.best?' best':''}">
        <div class="wait-name">${w.name}</div>
        <div class="wait-time" style="color:${color}">${w.time} min</div>
        <div class="wait-sub">${w.best?'🌟 Best option':w.time<=5?'Short wait':w.time<=10?'Moderate':'Long queue'}</div>
      </div>`;
    }).join('');
  }

  const qe = $el('queueEnhanced');
  if (qe) {
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

/* =========================================================
   10. GROUPS & EMERGENCY
   ========================================================= */

function renderGroups() {
  const el = $el('groupStatus');
  if (!el) return;
  
  if (!groupCreated) {
    el.innerHTML = `<div style="font-size:.78rem;color:var(--text2);text-align:center;padding:.5rem 0">No active group. Create one to start tracking your friends!</div>`;
    $el('groupQRCard').style.display = 'none';
    $el('groupMembersCard').style.display = 'none';
  } else {
    el.innerHTML = `<div class="group-id-chip">Group <strong>${groupId}</strong> — Active</div>`;
    $el('groupQRCard').style.display = '';
    $el('groupMembersCard').style.display = '';
    $el('groupIdLabel').textContent = 'Group Code: ' + groupId;
    $el('memberCount').textContent = groupMembers.length + ' members';
    
    const ml = $el('groupMembersList');
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
  
  const qrEl = $el('groupQRDisplay');
  const cells = [];
  for(let r=0;r<7;r++) for(let c=0;c<7;c++) {
    const isCorner = (r<3&&c<3)||(r<3&&c>=4)||(r>=4&&c<3);
    const val = isCorner ? (r===1&&c===1||r===1&&c===5||r===5&&c===1 ? 0 : (r<3||c<3||r>=4||c<3)?1:0) : ((42*r*c+r+c)%3===0?1:0);
    cells.push(val);
  }
  qrEl.innerHTML = `<div class="qr-mock">${cells.map(v=>`<div class="qr-cell" style="background:${v?'#000':'#fff'}"></div>`).join('')}</div>`;
  
  showToast('success','👥 Group ' + groupId + ' created! Share QR to invite.');
}

function joinGroupPrompt() {
  showToast('info','📷 Point camera at group QR code to join');
}

function renderGroupDots() {
  const g = $el('groupDots');
  if(!g || !groupCreated) return;
  g.innerHTML = groupMembers.map((m) => `
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
  $el('etaBar').style.display = 'flex';
  $el('etaBarTime').textContent = '3 min';
  $el('etaBarInfo').textContent = 'To ' + nearest.name + ' · 180 m';
}

function suggestMeetup() {
  const el = $el('meetupResult');
  el.innerHTML = `<strong style="color:var(--accent2)">🤝 Suggested Meetup Point:</strong><br>
    <span style="color:var(--text1)">Food Court 2 (Gate C side)</span><br>
    <span style="color:var(--text3);font-size:.7rem">Midpoint with lowest crowd density — ~38% occupancy. ETA for all members: 4–6 min.</span>`;
  el.classList.add('show');
  showToast('success','🤝 Meetup point suggested: Food Court 2');
}

/* === EMERGENCY === */
function toggleEmergency() {
  emergencyActive = !emergencyActive;
  const overlay = $el('emergencyOverlay');
  overlay.classList.toggle('active', emergencyActive);

  if(emergencyActive) {
    const el = $el('exitList');
    el.innerHTML = exitData.map(e => `
      <div class="emergency-exit-item">
        <span class="exit-name">${e.safest?'⭐ ':''}${e.name}</span>
        <div style="text-align:right">
          <div class="exit-dist">${e.dist}</div>
          <div class="exit-state" style="color:${e.state==='Clear'?'var(--green)':e.state==='Moderate'?'var(--yellow)':'var(--red)'}">${e.state}</div>
        </div>
      </div>
    `).join('');
    
    $el('incidentList').innerHTML = incidentData.map(inc => `
      <div class="emergency-alert-item">
        <div class="emergency-alert-title">⚠️ ${inc.title}</div>
        <div class="emergency-alert-sub">${inc.detail}</div>
      </div>
    `).join('');
    
    const g = $el('exitHighlights');
    if (g) {
      const exitPts = [{cx:85,cy:284},{cx:400,cy:65},{cx:705,cy:284},{cx:400,cy:520}];
      g.innerHTML = exitPts.map(p=>`
        <circle cx="${p.cx}" cy="${p.cy}" r="22" fill="rgba(0,230,118,0.2)" stroke="#00e676" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="${p.cx}" y="${p.cy+4}" text-anchor="middle" fill="#00e676" font-size="8" font-family="Space Grotesk" font-weight="700">EXIT</text>
      `).join('');
      g.style.opacity = '1';
      g.style.animation = 'exitPulse 1.5s ease-in-out infinite';
    }
    showToast('danger','🚨 Emergency mode activated. Follow exit instructions.');
  } else {
    const g = $el('exitHighlights');
    if (g) { g.innerHTML = ''; g.style.opacity = '0'; }
  }
}

/* =========================================================
   11. ADMIN PANEL & PREDICTIONS
   ========================================================= */

function initAdminPanel() {
  renderAdminZones();
  const el = $el('adminAlerts');
  if (el) {
    const alerts = [
      { msg:'Gate A capacity at 94% — risk of overflow', color:'var(--red)',    dot:'#ff4444' },
      { msg:'Sec 101 crowd density elevated',            color:'var(--yellow)', dot:'#ffcc00' },
    ];
    el.innerHTML = alerts.map(a=>`<div class="alert-item"><div class="alert-dot" style="background:${a.dot}"></div><span style="color:${a.color}">${a.msg}</span></div>`).join('');
  }
  
  const sl = $el('staffList');
  if (sl) {
    sl.innerHTML = staff.map(s=>`<div class="staff-row"><div class="staff-dot" style="background:${s.color}"></div><span style="flex:1">${s.name}</span><span style="color:var(--text3);font-size:.72rem">${s.loc}</span><span style="color:${s.color};font-size:.7rem;margin-left:.4rem">${s.status}</span></div>`).join('');
  }
  
  updateHeatmap();
}

function adminTab(tab) {
  $qsa('.admin-tab').forEach(b=>b.classList.remove('active'));
  $qsa('.admin-tab-content').forEach(c=>c.classList.remove('active'));
  $qsa('.admin-tab').forEach(b=>{ if(b.textContent.toLowerCase().startsWith(tab)) b.classList.add('active'); });
  const el = $el('atab-'+tab);
  if(el) el.classList.add('active');
}

function renderPredPanel() {
  const el = $el('predItems');
  if(!el) return;
  el.innerHTML = predData.map(p => `
    <div class="pred-item">
      <span class="${p.dir==='up'?'pred-arrow-up':'pred-arrow-dn'}">${p.dir==='up'?'▲':'▼'}</span>
      <span><strong style="color:var(--text1)">${p.zone}</strong> will ${p.dir==='up'?'increase':'decrease'} by <strong style="color:var(--text1)">${p.pct}%</strong> in ${p.mins} min</span>
    </div>
  `).join('');
  
  const svg = $el('miniChart');
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

function adminTriggerSurge() { toggleSurge(); }
function dispatchAllStaff() {
  showToast('danger','🚨 All available staff dispatched to high-density zones');
  staff.forEach(s => { if(s.status==='On Duty') s.status='Dispatched'; s.color='#ffcc00'; });
  const sl = $el('staffList');
  if (sl) sl.innerHTML = staff.map(s=>`<div class="staff-row"><div class="staff-dot" style="background:${s.color}"></div><span style="flex:1">${s.name}</span><span style="color:var(--text3);font-size:.72rem">${s.loc}</span><span style="color:${s.color};font-size:.7rem;margin-left:.4rem">${s.status}</span></div>`).join('');
}
function broadcastMsg() { showToast('info','📢 Announcement broadcast to all sections'); }
function openExtraGate() { showToast('success','🚪 Gate B Extra Lane opened — capacity increased by 35%'); }
function sendMedical() { showToast('warn','🚑 Medical team dispatched to Sector 103'); }

function runWhatIf() {
  const wc = $el('wiGateC').checked;
  const wa = $el('wiGateA').checked;
  const wf = $el('wiFC2').checked;
  const we = $el('wiExtra').checked;
  const effects = [];

  if(wc) { zones.find(z=>z.id==='gateC').cur = 0;  effects.push('Gate C closed → Gate A & B crowds +22%'); }
  else   { zones.find(z=>z.id==='gateC').cur = 45; }

  if(wa) { zones.find(z=>z.id==='gateA').cur = Math.min(50, zones.find(z=>z.id==='gateA').base); effects.push('Gate A restricted → overflow to Gate B & D'); }
  else   { zones.find(z=>z.id==='gateA').cur = zones.find(z=>z.id==='gateA').base; }

  if(wf) { effects.push('Food Court 2 closed → Court 1 wait +8 min'); }
  if(we) { effects.push('Emergency Gate E open → overall wait time -18%'); zones.find(z=>z.id==='gateD').cur = Math.max(15, zones.find(z=>z.id==='gateD').cur - 20); }

  const el = $el('whatifEffect');
  if(effects.length > 0) {
    el.innerHTML = effects.map(e=>`<div style="padding:2px 0;border-bottom:1px solid rgba(255,204,0,.1)">⚡ ${e}</div>`).join('');
    el.classList.add('show');
    showToast('warn','🔮 What-If simulation updated heatmap');
  } else {
    el.classList.remove('show');
    zones.forEach(z=>z.cur=z.base);
  }
  
  dirtyFlags.zones = true;
  dirtyFlags.heatmap = true;
  renderZones();
  updateHeatmap();
}

/* =========================================================
   12. NOTIFICATIONS & CLOCK
   ========================================================= */

function showToast(type, msg) {
  const wrap = $el('toastWrap');
  if (!wrap) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  const icons = { success:'✅', warn:'⚠️', danger:'🚨', info:'ℹ️' };
  t.innerHTML = `<span aria-hidden="true">${icons[type]||'•'}</span><span>${sanitizeInput(msg)}</span>`;
  wrap.appendChild(t);
  
  setTimeout(() => {
    t.classList.add('fade-out');
    setTimeout(() => t.remove(), 300);
  }, 4500);
}

function showNudge(title, text, icon='💡') {
  const wrap = $el('toastWrap');
  if (!wrap) return;
  const t = document.createElement('div');
  t.className = 'toast info';
  t.style.flexDirection = 'column';
  t.innerHTML = `<div class="nudge-toast-title">${icon} ${sanitizeInput(title)}</div><div class="nudge-toast-text">${sanitizeInput(text)}</div>`;
  wrap.appendChild(t);
  setTimeout(() => {
    t.classList.add('fade-out');
    setTimeout(() => t.remove(), 300);
  }, 6000);
}

function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');
  const clockEl = $el('liveClock');
  if(clockEl) clockEl.textContent = hh+':'+mm+':'+ss;

  const matchTime = new Date(now);
  matchTime.setHours(19, 30, 0, 0);
  if(now > matchTime) matchTime.setDate(matchTime.getDate()+1);
  const diff = matchTime - now;
  const cdEl = $el('countdownVal');
  if(cdEl) {
    if(diff < 0) {
      cdEl.textContent = 'LIVE NOW';
      cdEl.classList.add('live-blink');
    } else {
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      cdEl.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }
  }
}

/* =========================================================
   13. SIMULATION ENGINE (Unified Loop)
   ========================================================= */

function startSimulationEngine() {
  // Fast RAF loop for smooth animation
  let lastTime = 0;
  function animationLoop(timestamp) {
    if (timestamp - lastTime > 40) { // ~24fps throttle for performance
      animateTwinDots();
      lastTime = timestamp;
    }
    requestAnimationFrame(animationLoop);
  }
  requestAnimationFrame(animationLoop);

  // 1s Clock Loop
  setInterval(updateClock, 1000);

  // 4s Density Simulation Loop
  setInterval(() => {
    if (currentScenario === 'normal' && !surgeActive) {
      zones.forEach(z => {
        const jitter = (Math.random() - 0.5) * 4;
        z.cur = Math.max(15, Math.min(98, z.base + jitter)) | 0;
      });
      dirtyFlags.zones = true;
      dirtyFlags.heatmap = true;
      dirtyFlags.stress = true;
      
      if (currentTab === 'heatmap' || currentScreen === 'admin-panel') renderZones();
      updateHeatmap();
      calculateStressLevel();
    }
  }, 4000);
  
  // 15s Auto Mode Engine Loop
  setInterval(autoModeEngineTick, 15000);
}

// Ensure Twin Dots init runs
initTwinDots();

/* =========================================================
   GOOGLE MAPS INTEGRATION
   ========================================================= */

let googleMap = null;
let mapViewActive = false;

/**
 * Called by Google Maps API once loaded (callback=initGoogleMap)
 * Centers on Narendra Modi Stadium, Ahmedabad
 */
function initGoogleMap() {
  const stadiumCoords = { lat: 23.0941, lng: 72.5949 };

  googleMap = new google.maps.Map(document.getElementById('google-map'), {
    center: stadiumCoords,
    zoom: 17,
    mapTypeId: 'satellite',
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT,
      mapTypeIds: ['satellite', 'roadmap', 'hybrid'],
    },
    streetViewControl: false,
    fullscreenControl: false,
    zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
    styles: [{ featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#e0e0e0' }] }],
  });

  // Stadium marker with custom icon
  const marker = new google.maps.Marker({
    position: stadiumCoords,
    map: googleMap,
    title: 'Narendra Modi Stadium',
    animation: google.maps.Animation.DROP,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 14,
      fillColor: '#a855f7',
      fillOpacity: 0.9,
      strokeColor: '#fff',
      strokeWeight: 2.5,
    },
  });

  // Info window with event details
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="font-family:'DM Sans',sans-serif;padding:6px;min-width:180px">
        <div style="font-weight:700;font-size:.9rem;margin-bottom:2px">🏟 Narendra Modi Stadium</div>
        <div style="font-size:.78rem;color:#555;margin-bottom:6px">Motera, Ahmedabad · 132,000 capacity</div>
        <div style="background:#7c3aed;color:#fff;border-radius:6px;padding:4px 8px;font-size:.75rem;font-weight:600;display:inline-block">🏏 GT vs MI · IPL 2025</div>
      </div>
    `,
  });

  marker.addListener('click', () => infoWindow.open(googleMap, marker));
  // Auto-open info window on load
  infoWindow.open(googleMap, marker);

  // Draw a circle showing the stadium boundary
  new google.maps.Circle({
    map: googleMap,
    center: stadiumCoords,
    radius: 280,
    strokeColor: '#a855f7',
    strokeOpacity: 0.6,
    strokeWeight: 2,
    fillColor: '#7c3aed',
    fillOpacity: 0.08,
  });
}

/**
 * Toggle between SVG Digital Twin and Google Maps real-world view
 */
function toggleMapView() {
  mapViewActive = !mapViewActive;
  const container = $el('google-map-container');
  const btn       = $el('mapToggleBtn');

  if (mapViewActive) {
    container.style.display = 'block';
    btn.textContent = '🏟 Digital Twin';
    btn.classList.add('active');
    // Trigger resize so Google Maps renders correctly inside the container
    if (googleMap) {
      google.maps.event.trigger(googleMap, 'resize');
      googleMap.setCenter({ lat: 23.0941, lng: 72.5949 });
    } else {
      showToast('warn', 'Maps still loading — try again in a moment');
      mapViewActive = false;
      container.style.display = 'none';
      btn.textContent = '🗺 Real Map';
      btn.classList.remove('active');
    }
  } else {
    container.style.display = 'none';
    btn.textContent = '🗺 Real Map';
    btn.classList.remove('active');
  }
}

/* =========================================================
   GOOGLE LOGIN INTEGRATION
   ========================================================= */

/**
 * Decodes the JWT token returned by Google
 */
function decodeJwtResponse(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

/**
 * Handles the Google Sign-In response
 */
function handleGoogleLogin(response) {
  try {
    const responsePayload = decodeJwtResponse(response.credential);
    
    // Store user info
    currentUser = {
      id: responsePayload.sub,
      name: responsePayload.name,
      email: responsePayload.email,
      picture: responsePayload.picture,
      role: 'user'
    };

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    // Show success toast
    showToast('success', `Welcome back, ${responsePayload.given_name}!`);

    // Transition to main app
    goTo('main-app');
    
    // Update UI with user profile if needed
    // (e.g. replacing 'Guest' with their name/picture in a profile menu)

  } catch (error) {
    console.error("Error decoding Google Login JWT:", error);
    showToast('error', 'Login failed. Please try again.');
  }
}
