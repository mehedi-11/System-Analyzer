# Device Analyzer

**Device Analyzer** is a multi-platform PC & Mobile diagnostic and performance intelligence system. It conducts comprehensive telemetry audits of hardware, software, real-time performance, and security posture; calculates a transparent, 100% explainable health score (0-100); and generates professional diagnostic reports with historical delta comparison.

---

## Architecture & Monorepo Structure

```
systemAnalyzer/
├── desktop/                  # Primary Windows PC Electron + React + Tailwind app
│   ├── src/
│   │   ├── main/             # Electron main process (Node.js runtime)
│   │   │   ├── collectors/   # Domain-specific collectors (OS, CPU, RAM, etc.)
│   │   │   ├── db/           # SQLite (better-sqlite3) & migration runner
│   │   │   │   └── migrations/ # Versioned SQL schema files
│   │   │   ├── ipc/          # Typed IPC channel registrations
│   │   │   ├── utils/        # PowerShell runner (-EncodedCommand) & Admin checker
│   │   │   └── index.ts      # Window lifecycle, single instance, secure webPreferences
│   │   ├── preload/          # Secure contextBridge API definition
│   │   │   └── index.ts
│   │   └── renderer/         # React 18 + Tailwind CSS + Lucide frontend
│   │       ├── src/
│   │       │   ├── components/ # Sidebar (10 pages), Header, AdminBanner, ThemeToggle
│   │       │   ├── context/    # ThemeContext (Dark/Light persisted to SQLite)
│   │       │   ├── pages/      # 10 Application pages
│   │       │   ├── types/      # Window deviceAnalyzer typings
│   │       │   ├── App.tsx
│   │       │   └── main.tsx
│   │       └── index.html
│   ├── scripts/              # Dev server runner, production builder, test runner
│   ├── tests/                # Automated unit tests (PowerShell & SQLite migrations)
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── shared/                   # Cross-platform types, contracts, and scoring schemas
│   ├── types/
│   │   └── index.ts          # Shared TypeScript interfaces
│   └── package.json
├── android/                  # Mobile Kotlin + Jetpack Compose app (Phase 7)
│   └── README.md
├── package.json              # Monorepo workspace root
└── README.md
```

---

## Phase 1 Deliverables Summary

1. **Monorepo Architecture**: Configured with npm workspaces (`desktop`, `shared`, and placeholder `android`).
2. **Secure Electron IPC**: Configured with `contextIsolation: true`, `nodeIntegration: false`, and strongly typed `window.deviceAnalyzer` preload API.
3. **Application Shell**:
   - Sidebar navigation with all **10 pages**: Dashboard, System Info, Performance Monitor, Hardware Analysis, Battery Analysis, Network Analysis, System Health, Reports, History, Settings.
   - Dynamic view routing and page transitions.
   - Dark/Light theme toggle persisted in SQLite database.
   - Administrator status badge and warning banner when running in standard user mode.
4. **SQLite Database & Migration System**:
   - Configured with `better-sqlite3` operating in WAL mode with foreign keys enabled.
   - Versioned migration runner tracking applied migrations in `schema_migrations`.
   - Initial schema `001_initial_schema.sql` creating:
     - `devices`, `scans`, `scan_hardware`, `scan_software`, `performance_samples`
     - `health_results`, `health_issues`, `alerts`, `reports`, `settings`
     - Retrieval indexes for performant historical queries.
5. **Sample PowerShell CIM Collector**:
   - Implemented `OperatingSystemCollector` using safe `-EncodedCommand` execution (eliminating shell injection and quoting bugs).
   - Collects OS Caption, Version, BuildNumber, Architecture, Boot time, Uptime, Memory available/free, and system directories.
   - Verified end-to-end through the IPC bridge and displayed live on Dashboard and System Info pages.
6. **Automated Unit Testing**:
   - Tested in Electron runtime verifying OS collector, PowerShell JSON parsing, admin detection, and all 11 database tables & seeds.

---

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- Windows 10 or 11

### Installation
From the root repository directory:
```bash
npm install
```

### Run in Development Mode
Starts the Vite React development server and launches Electron with live hot-reloading:
```bash
npm run dev
```

### Run Automated Unit Tests
Executes the test suites inside the Electron Node environment:
```bash
npm test
```

### Production Build
Compiles the React frontend with Vite and bundles main/preload processes with esbuild:
```bash
npm run build
```
