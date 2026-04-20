<![CDATA[<div align="center">

# 🏟️ SmartStadium

**Intelligent Crowd Management & Navigation System**

*Narendra Modi Stadium, Ahmedabad · IPL 2025 · Gujarat Titans vs Mumbai Indians*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Cloud_Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://smartstadium-1064148922722.asia-south1.run.app)
&nbsp;
[![GitHub](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dtnotdt/smart-crowd-detection-app)

---

A real-time crowd management dashboard for smart stadiums.
Built for the world's largest cricket stadium — **132,000 capacity**.

Digital twin visualization · Predictive analytics · Smart routing · Emergency response · Group tracking

---

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white)
![Cloud Run](https://img.shields.io/badge/Cloud_Run-4285F4?style=flat-square&logo=google-cloud&logoColor=white)

</div>

---

## 🎯 The Problem

Managing **132,000+ spectators** at the world's largest cricket stadium presents critical challenges:

| Challenge | SmartStadium Solution |
|:--|:--|
| Crowd bottlenecks at gates | 🗺️ Smart routing with 3 path options (Fastest / Least Crowded / Balanced) |
| Long food & washroom queues | ⏱️ Live wait times with least-busy counter recommendations |
| Emergency evacuation planning | 🚨 One-tap SOS mode with exit routing & incident tracking |
| Group coordination in massive venues | 👥 QR-based group tracking with AI meetup suggestions |
| Reactive (not proactive) management | 📈 Predictive analytics — "Gate B +20% in 10 mins" |

---

## ✨ Features

### 🔮 Digital Twin Overlay
- Real-time heatmap visualization across 10 stadium zones (green → yellow → red)
- Animated crowd dots simulating movement via Brownian motion
- Hover any zone for tooltip: **crowd %**, **avg wait time**, **state** (Calm / Busy / High Risk)
- Toggle overlay on/off from the sidebar

### 🗺️ Smart Routing Engine
- **3 route options** for every destination:
  - 🚀 **Fastest** — shortest path (4 min, 280m)
  - 🌿 **Least Crowded** — avoids high-density zones (7 min, 420m)
  - ⚖️ **Balanced** — optimal trade-off (5 min, 330m)
- Animated route polylines drawn on the SVG stadium map
- ETA bar with one-tap alternate route switching

### 📈 Crowd Prediction Panel
- AI-simulated forecasts per zone, updating every 10 seconds
- Example: *"Gate A will increase by 20% in 10 mins"*
- Live rolling trend mini-graph with 12-point data window
- Positioned as a floating widget on the map view

### 💡 Smart Nudge System
- Context-aware toast notifications triggered by crowd imbalance
- Examples:
  - *"Gate C is significantly less crowded right now"*
  - *"Food Court 3 has no queue — order now"*
  - *"It's 34°C — water stations at Gate B and D"*
- Automatic scheduling: rotates tips every 18s, imbalance check every 35s

### 🍽️ Queue Enhancement
- Live wait times per counter with dynamic jitter (updates every 8s)
- Food order status tracking: ⏳ **Preparing** / ✅ **Ready**
- 🌟 Least-busy counter auto-highlighted
- Full food menu: Main Course, Beverages, Snacks — with cart & checkout

### 👥 Group Tracking (QR-Based)
- **Create Group** → generates unique ID + mock QR code
- **Join Group** via QR scan simulation
- Each member rendered as a **colored dot** on the stadium map
- 📍 **Find My Group** — routes to nearest member with ETA
- 🤝 **Suggest Meetup** — calculates midpoint with lowest crowd density

### 🚨 Emergency Mode
- Floating **SOS button** always visible on the map
- On activation:
  - All 4 exits highlighted with **pulsing green markers**
  - **Safest path** calculated from current position (Gate D, 2 min, Clear)
  - Active incident panel with 3 mock scenarios
  - Per-exit distance and crowd state display

### 📊 Admin Analytics Dashboard
- Real-time stats: total crowd (87,400), active alerts, staff on duty, food orders
- Zone breakdown with capacity bars and percentage labels
- Staff management: roster, dispatch all, broadcast, open gates, send medical
- **🔮 What-If Simulation**: toggle scenarios like "Close Gate C" or "Restrict Gate A to 50%" and watch the heatmap update dynamically

---

## 🖥️ Screens

### Landing
Branded entry with IPL 2025 theming, ticket scan animation, guest login, and admin portal.

### Main App — Attendee View
| Tab | Contents |
|:--|:--|
| **Navigate** | Seat finder, 3 smart route cards, avoid-crowds toggle, digital twin toggle |
| **Heatmap** | Zone density bars for all 10 zones, crowd surge simulation |
| **Food** | Full stadium menu with prices, availability, cart system |
| **Waits** | Wait time grid (9 locations) + food counter order tracking |
| **Groups** | Create/join group, QR display, member list, find & meetup |

**Map overlays:** heatmap ellipses · crowd dots · route polylines · seat marker · user dot · exit highlights · group member dots

### Admin Panel
| Tab | Contents |
|:--|:--|
| **Dashboard** | Crowd stats, zone bars, extended analytics, surge trigger, staff dispatch |
| **Alerts** | Active alerts with severity dots, timestamped history log |
| **Staff Mgmt** | 6-person roster, broadcast / open gate / send medical actions |
| **Analytics** | What-If simulation (4 scenarios), crowd trend chart, gate volume chart |

---

## 🏗️ Architecture

```
SmartStadium App
├── Landing Screen ─── Scan Ticket / Guest / Admin Login
├── Main App
│   ├── Sidebar (5 tabs: Navigate, Heatmap, Food, Waits, Groups)
│   ├── SVG Stadium Map (800×600 viewBox)
│   │   ├── Heatmap Layer (10 zone ellipses)
│   │   ├── Crowd Dots Layer (static)
│   │   ├── Digital Twin Layer (animated Brownian dots)
│   │   ├── Route Layer (polylines with arrows)
│   │   ├── Group Dots Layer (colored member markers)
│   │   └── Exit Highlights Layer (emergency pulsing)
│   ├── Event Banner (IPL countdown + live clock + temp)
│   ├── Crowd Prediction Panel (floating widget)
│   └── Emergency Overlay (full-screen SOS mode)
├── Admin Panel
│   ├── Left: Dashboard / Alerts / Staff / Analytics tabs
│   └── Right: Admin SVG Map with heatmap + crowd dots
└── Toast System (notifications + smart nudges)
```

**Simulation intervals:**

| Engine | Interval | Behavior |
|:--|:--|:--|
| Zone density | 4s | ±2% random walk (bounds: 15–98%) |
| Digital twin dots | 800ms | Brownian motion within zone ellipses |
| Wait times | 8s | ±2 min jitter (bounds: 1–30 min) |
| Crowd predictions | 10s | ±4% forecast variation |
| Smart nudges | 18s | Rotates 6 contextual tips |
| Imbalance nudges | 35s | Fires when >80% and <45% zones coexist |
| Clock + countdown | 1s | Live IST time + countdown to 7:30 PM |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|:--|:--|:--|
| Structure | HTML5 | Semantic markup, SVG stadium map |
| Styling | CSS3 | Custom properties, keyframe animations, glassmorphism |
| Logic | Vanilla JS | Simulation engine, DOM rendering, state management |
| Fonts | Google Fonts | Space Grotesk (headings) + DM Sans (body) |
| Graphics | Inline SVG | Stadium map, routes, heatmap, crowd dots |
| Container | Docker + nginx:alpine | Static file serving on port 8080 |
| Hosting | Google Cloud Run | Serverless, auto-scaling, Mumbai region |

**Why zero dependencies?** The entire app is **3 files (~95KB)**. No React, no build tools, no npm. Instant load, zero supply chain risk, ~25MB Docker image, works offline by opening the HTML file directly.

---

## 🚀 Getting Started

**Run locally (no setup required):**

```bash
git clone https://github.com/dtnotdt/smart-crowd-detection-app.git
cd smart-crowd-detection-app

# Just open in browser
open SmartStadium_Enhanced.html

# Or use a local server
python3 -m http.server 8080
# → http://localhost:8080
```

**Run with Docker:**

```bash
docker build -t smartstadium .
docker run -p 8080:8080 smartstadium
# → http://localhost:8080
```

**Deploy to Cloud Run:**

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
gcloud run deploy smartstadium --source . --region asia-south1 --allow-unauthenticated
```

---

## 📁 Project Structure

```
smart-crowd-detection-app/
├── SmartStadium_Enhanced.html   # HTML structure & SVG map (559 lines)
├── style_enhanced.css           # Complete design system (315 lines)
├── script_enhanced.js           # Simulation engine & logic (918 lines)
├── Dockerfile                   # nginx:alpine container
├── nginx.conf                   # Server config (port 8080, gzip, caching)
├── .dockerignore                # Docker build exclusions
├── .gitignore                   # Git exclusions
└── README.md                    # Documentation
```

---

## 🔑 Demo Credentials

| Role | How to Access |
|:--|:--|
| **Guest** | Click *"Continue as Guest"* on landing |
| **Ticket Holder** | Click *"Scan Ticket"* → tap scan area → *"Enter Stadium"* |
| **Admin** | Username: `admin` · Password: `admin123` |

---

## 🏟️ Venue Context

| Detail | Value |
|:--|:--|
| Stadium | Narendra Modi Stadium (Motera) |
| Location | Ahmedabad, Gujarat, India |
| Capacity | ~132,000 (world's largest cricket stadium) |
| Event | IPL 2025 — Gujarat Titans vs Mumbai Indians |
| Zones Modeled | 10 (4 gates + 5 sections + food court) |
| Simulated Crowd | ~87,400 attendees (66% capacity) |

---

<div align="center">

**Built with ❤️ for smarter stadiums**

[Live Demo](https://smartstadium-1064148922722.asia-south1.run.app) · [Source Code](https://github.com/dtnotdt/smart-crowd-detection-app)

</div>
]]>
