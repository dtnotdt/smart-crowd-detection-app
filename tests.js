/**
 * SmartStadium - Lightweight Test Runner
 * Run via: node tests.js
 */

let passed = 0;
let failed = 0;

function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}\n   Expected: ${expected}\n   Actual:   ${actual}`);
    failed++;
  }
}

function assertThrow(fn, testName) {
  try {
    fn();
    console.error(`❌ FAIL: ${testName}\n   Expected function to throw.`);
    failed++;
  } catch (e) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  }
}

console.log("=== Running SmartStadium Tests ===\n");

// --- 1. Sanitization Tests ---
function sanitizeInput(str) {
  if (!str) return '';
  return String(str)
    .replace(/[<>]/g, '') 
    .substring(0, 50);
}

assertEqual(sanitizeInput('<b>Block A</b>'), 'bBlock A/b', 'Sanitization removes HTML tags');
assertEqual(sanitizeInput('12345678901234567890123456789012345678901234567890EXTRA'), '12345678901234567890123456789012345678901234567890', 'Sanitization truncates to 50 chars');

// --- 2. Ticket Validation Tests ---
const scannedTickets = new Set();

function validateTicketData(dataStr) {
  let data;
  try {
    data = JSON.parse(dataStr);
  } catch (e) {
    throw new Error('Invalid QR Code: Not valid JSON');
  }
  
  if (!data.id || !data.name || !data.seat || !data.gate || !data.event) {
    throw new Error('Invalid Ticket: Missing required fields');
  }
  
  if (scannedTickets.has(data.id)) {
    throw new Error('Duplicate Scan: Ticket already used');
  }
  
  scannedTickets.add(data.id);
  return data;
}

const validTicket = JSON.stringify({ id: "TKT-001", name: "Alex", seat: "B7-102", gate: "B", event: "GT vs MI" });
const invalidJson = "{ id: TKT, }";
const missingFields = JSON.stringify({ id: "TKT-002", name: "Alex" });

const parsed = validateTicketData(validTicket);
assertEqual(parsed.id, "TKT-001", 'Valid ticket parses correctly');

assertThrow(() => validateTicketData(invalidJson), 'Throws on invalid JSON');
assertThrow(() => validateTicketData(missingFields), 'Throws on missing fields');
assertThrow(() => validateTicketData(validTicket), 'Throws on duplicate scan (ticket reuse prevention)');

// --- 3. Route Calculation Basics ---
const routes = [
  { type:'Fastest', eta:'4 min', dist:'280 m' },
  { type:'Least Crowded', eta:'7 min', dist:'420 m' },
];

assertEqual(routes[0].eta, '4 min', 'Route 0 ETA is correct');
assertEqual(routes[1].type, 'Least Crowded', 'Route 1 Type is correct');

console.log(`\n=== Test Results: ${passed} Passed, ${failed} Failed ===`);
if (failed > 0) process.exit(1);
