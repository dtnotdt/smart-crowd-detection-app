<div align="center">

<img src="./smart_stadium_hero.png" alt="SmartStadium Hero Banner" width="100%" style="border-radius: 10px; margin-bottom: 20px;">

# 🏟️ SmartStadium

**Intelligent Crowd Management & Navigation System**

*Narendra Modi Stadium, Ahmedabad · IPL 2025 · Gujarat Titans vs Mumbai Indians*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Cloud_Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://smartstadium-1064148922722.asia-south1.run.app)
&nbsp;
[![GitHub](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dtnotdt/smart-crowd-detection-app)

---

A real-time crowd management dashboard for smart stadiums.  
Built for the world's largest cricket stadium — **132,000 capacity**.

*Digital twin visualization · Predictive analytics · Smart routing · Emergency response · Group tracking*

---

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white)
![Cloud Run](https://img.shields.io/badge/Cloud_Run-4285F4?style=flat-square&logo=google-cloud&logoColor=white)

</div>

<br>

## 🎯 The Problem

Managing **132,000+ spectators** at the world's largest cricket stadium presents critical challenges. Here's how SmartStadium solves them:

> **The Goal:** Shift from reactive incident handling to proactive, data-driven venue intelligence.

| 🚨 Challenge | 🚀 SmartStadium Solution |
| :--- | :--- |
| **Crowd bottlenecks at gates** | 🗺️ **Smart routing** with 3 path options (Fastest / Least Crowded / Balanced) |
| **Long food & washroom queues**| ⏱️ **Live wait times** with least-busy counter recommendations |
| **Emergency evacuation** | 🚨 **One-tap SOS mode** with exit routing & incident tracking |
| **Group coordination** | 👥 **QR-based group tracking** with AI meetup suggestions |
| **Reactive management** | 📈 **Predictive analytics** — *"Gate B +20% in 10 mins"* |

<br>

## ✨ Core Features

### 🔮 Digital Twin Overlay
- **Real-time heatmap visualization** across 10 stadium zones (green → yellow → red).
- **Animated crowd dots** simulating movement via Brownian motion.
- **Hover analytics:** Tooltips showing crowd %, average wait time, and zone state.

### 🗺️ Smart Routing Engine
- **3 route options** for every destination:
  - 🚀 *Fastest* — shortest path (4 min, 280m)
  - 🌿 *Least Crowded* — avoids high-density zones (7 min, 420m)
  - ⚖️ *Balanced* — optimal trade-off (5 min, 330m)
- **Live ETA** and alternate route switching directly on the SVG map.

### 🎭 Live Scenario Simulator (New)
- **4 scenario modes:** Normal, Peak Crowd, Match End Rush, and Emergency.
- Instantly shifts crowd dynamics and heatmap data to reflect real-world scenarios.

### 📷 Live QR Scanner & Validation (New)
- **Real device camera integration** using `html5-qrcode`.
- Scans JSON QR tickets with format validation and duplicate scan prevention.
- Seamlessly transitions authenticated users into the stadium map.

### 😰 Automated Stress Indicator (New)
- **Real-time weighted formula** combining average wait times and density.
- Dynamically shifts between 😌 Relaxed, 😐 Moderate, and 😰 High Stress modes.

### 🤖 Auto-Mode Engine (New)
- Detects high-capacity zones proactively (e.g., density > 92%).
- Automatically nudges users with context-aware alert toasts.

### 📈 Predictive Analytics & Nudges
- **AI-simulated forecasts:** E.g., *"Gate A will increase by 20% in 10 mins"*.
- **Live rolling trend graphs** updating every 10 seconds.
- **Context-aware toast notifications:**
  - 🍔 *"Food Court 3 has no queue — order now"*
  - 💧 *"It's 34°C — water stations at Gate B and D"*

### 🍽️ Dynamic Queue Enhancement
- **Live wait times** per counter with dynamic jitter updates.
- **Food order status tracking:** ⏳ *Preparing* / ✅ *Ready*.
- **Smart suggestions:** Auto-highlights the least-busy counters.

### 👥 Group Tracking (QR-Based)
- **Create & Join Groups** via QR scan simulation.
- **Live tracking:** Each member is rendered as a colored dot on the map.
- **Find My Group & Meetup:** Calculates the optimal midpoint with the lowest crowd density.

### 🚨 Emergency SOS Mode
- **Instant activation:** Highlights all 4 exits with pulsing green markers.
- **Safest path calculation:** Routes from the current position to the safest exit.
- **Live incident panel:** Displays distance and crowd state for evacuation.

<br>

## 🖥️ Application Screens

### 👥 Attendee View
| Tab | Contents |
|:--|:--|
| **Navigate** | Seat finder, 3 smart route cards, avoid-crowds toggle, digital twin toggle |
| **Heatmap** | Zone density bars for all 10 zones, crowd surge simulation |
| **Food** | Full stadium menu with prices, availability, cart system |
| **Waits** | Wait time grid (9 locations) + food counter order tracking |
| **Groups** | Create/join group, QR display, member list, find & meetup |

### 🛡️ Admin Panel
| Tab | Contents |
|:--|:--|
| **Dashboard** | Crowd stats, zone bars, extended analytics, surge trigger, staff dispatch |
| **Alerts** | Active alerts with severity dots, timestamped history log |
| **Staff Mgmt** | 6-person roster, broadcast / open gate / send medical actions |
| **Analytics** | What-If simulation (4 scenarios), crowd trend chart, gate volume chart |

<br>

## 🛠️ Tech Stack & Architecture

> **Why zero dependencies?** 
> The entire app is **3 files (~95KB)**. No React, no build tools, no npm. Instant load, zero supply chain risk, ~25MB Docker image, works offline by opening the HTML file directly.

| Layer | Technology | Purpose |
|:--|:--|:--|
| **Structure** | HTML5 | Semantic markup, SVG stadium map |
| **Styling** | CSS3 | Custom properties, keyframe animations, glassmorphism |
| **Logic** | Vanilla JS | Simulation engine, DOM rendering, state management |
| **Container** | Docker + nginx | Static file serving on port 8080 |
| **Hosting** | Google Cloud Run | Serverless, auto-scaling, Mumbai region |

<br>

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
```

**Deploy to Cloud Run:**
```bash
gcloud run deploy smartstadium --source . --region asia-south1 --allow-unauthenticated
```

<br>

## 🔑 Demo Credentials

| Role | How to Access |
|:--|:--|
| **Guest** | Click *"Continue as Guest"* on landing |
| **Ticket Holder** | Click *"Scan Ticket"* → tap scan area → *"Enter Stadium"* |
| **Admin** | Username: `admin` <br> Password: `admin123` |

---

<div align="center">

**Built with ❤️ for smarter stadiums**

[Live Demo](https://smartstadium-1064148922722.asia-south1.run.app) · [Source Code](https://github.com/dtnotdt/smart-crowd-detection-app)

</div>
