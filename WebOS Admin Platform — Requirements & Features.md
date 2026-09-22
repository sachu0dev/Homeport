# WebOS Admin Platform — Requirements & Features

2026-09-22 · @Someone

## Overview & Vision

A browser-based, desktop-style admin platform for managing Linux servers — styled like a macOS / Windows desktop environment rather than a typical SaaS dashboard. The browser isn't literally an operating system; it's a **web desktop shell** (window manager, taskbar, app launcher) sitting on top of a normal web app. Every server-management capability — files, users, logs, database, terminal, deployments — is registered as an "app" that opens in its own draggable, resizable window.

This is a personal project built out of interest, not a direct competitive response to Coolify, CapRover, or Cloudron — though it sits in the same broad space (self-hosted deployment/management tooling).

Distribution matters as much as the UI: this isn't a hosted SaaS control plane. A user `git clone`s the repo, runs one install command on their own server, and the installer handles account creation and permissions from there — the whole thing runs as a single, resource-conscious package on the server it manages, not as a separate service somewhere else.

## Target Users & Problem

**Primary user:** founders who had their website or app built by an agency or generated with AI tools, and who lack the technical background to manage a server, SSH in, or run deployment commands.

**Problem being solved:** these users own (or need) a Linux server but have no safe, guided way to:

- Deploy or update their application
- See what's running and whether it's healthy
- Manage files, logs, or a database without a terminal
- Configure a domain, CI/CD, or multiple apps on one box

**Builder context:** 4–5 years of full-stack experience, comfortable with basic server administration and load balancing concepts, but no hands-on experience with advanced orchestration (e.g. Kubernetes). This shapes which features are near-term vs. long-term — see Feasibility & Risk Assessment below.

## Product Concept: The Web-Desktop Metaphor

```
Browser
└── Web Desktop
    ├── Desktop / Wallpaper
    ├── Top bar / Taskbar
    ├── App Launcher
    ├── Window Manager
    │   ├── Files
    │   ├── Users
    │   ├── Logs
    │   ├── Database
    │   ├── Terminal
    │   └── Settings
    └── Backend APIs
```

A user opens "Files", drags it around, minimizes it, opens "Logs" beside it, switches between apps from the taskbar. Underneath, it's still an ordinary web app — the desktop is a rendering metaphor, not a real OS.

The key architectural decision: the **shell** (window manager, taskbar, launcher, desktop) is kept strictly separate from the **apps** (Files, Users, Logs, Terminal, etc.). Apps are registered against an **App Registry** rather than hardcoded into the shell:

```ts
registerApp({
  id: "files",
  name: "Files",
  icon: FolderIcon,
  component: FilesApp,
  defaultWidth: 900,
  defaultHeight: 600,
})
```

This means the shell never needs to know what a given app does — adding a new capability later (Backup Manager, Billing, Monitoring) is just registering another app, not modifying the platform.

In practice this ships as a **single installable package**, not a hosted service: a user runs `git clone` plus one install command directly on the Linux server they want to manage. The installer creates the first admin account, requests the OS-level permission the process needs, and registers itself as a background service. One process serves both the API and the built frontend, mounted at a fixed path (e.g. `/web-admin`) on that same server — so "frontend" and "backend" stay two logical apps in the codebase, but ship and run as one package.

## Core Feature List (MVP / Phase 1 scope)

The smallest set of things that need to work end-to-end before anything else is added:

- [ ] Desktop shell UI — wallpaper, top bar, taskbar, app launcher
- [ ] Window manager — open, close, drag, resize, minimize, maximize, focus, z-index
- [ ] App registry / plugin architecture — apps are registered components, never hardcoded into the shell
- [ ] One real, working app end-to-end (e.g. Files or Users) talking to an actual backend
- [ ] Session-based auth + basic access control (a single admin user is fine for MVP)
- [ ] Backend API (Fastify/Node) that the shell and apps call

MVP is done when a user can log in, see the desktop, open one real app in a window, and do something useful in it — nothing about deployment, CI/CD, or multi-app hosting yet.

## Extended Feature List (later phases)

Everything beyond MVP, roughly in the order it becomes valuable:

- [ ] File browser with real server file access (via a backend agent)
- [ ] Static file serving/browsing for frontend framework builds
- [ ] Framework template library (start with Next.js, add others later) for one-click scaffolding
- [ ] Guided / one-click deployment from a template or a repo
- [ ] Terminal app (xterm.js + node-pty) connected to a real backend shell
- [ ] Code editor app (Monaco)
- [ ] Logs viewer
- [ ] Database browser
- [ ] Multi-app hosting on a single server
- [ ] Reverse proxy / routing layer for multiple apps and domains
- [ ] Process manager / supervisor — keep apps alive, restart on crash, report status
- [ ] Step-by-step setup wizard covering the full server configuration flow
- [ ] Automatic CI/CD setup via the wizard — no manual commands
- [ ] CPU / resource allocation controls (e.g. cores per app, via cgroups)

## Feasibility & Risk Assessment

| Feature | Difficulty | Notes |
| --- | --- | --- |
| Desktop shell UI | Low | Standard frontend work, well within existing skillset |
| File browser | Low–Medium | Needs a backend agent exposing a safe file API; access control is the hard part |
| Static file serving | Low | Nginx or a lightweight server handles this |
| Framework template library | Medium | Grows in effort as more frameworks are added |
| Guided deployment | Medium–High | Needs reliable builds and process starts on arbitrary user code; edge cases across frameworks add up |
| Multi-app hosting | Medium | Needs process isolation and a reverse proxy, with careful port/domain namespacing |
| CPU / core allocation | High | Requires process-level resource control (cgroups) — genuine systems/DevOps territory, outside current experience |
| Setup wizard | Low–Medium | UI/flow work; complexity depends on how much it has to configure underneath |
| Automatic CI/CD | High | Pipelines, webhooks, and triggers reliably across frameworks — a common source of edge cases |
| Reverse proxy / routing | Medium–High | Doable with Nginx/Caddy, but needs dynamic reconfiguration as apps are added or removed |
| Process management | Medium–High | Needs a supervisor to keep apps alive, restart on crash, and report status |
| Installer / permission bootstrap | Medium | Scripting a clean install (admin account, systemd service, OS permission checks) is mostly straightforward, but getting permission handling safe and reliable across different Linux setups takes care |
| Single-package resource footprint | Low–Medium | Mainly build-tooling work (serving the frontend build from the backend process) plus disciplined dependency choices — straightforward, but easy to bloat if not watched |

**Highest risk:** CPU/resource allocation, automatic CI/CD, and reliable guided deployment across many frameworks. These sit closest to the current DevOps knowledge gap, and are also where competitors (Coolify, CapRover, Cloudron) have invested the most engineering time — which is exactly why they're pushed to a later phase in the build roadmap rather than tackled early.

Permission/installer safety is worth watching too — a broken install script on someone's production server is a bad first impression, and mishandled sudo/permission requests are an easy way to erode trust.

## Tech Stack Requirements

**Frontend (shell + apps)**

- React + TypeScript, built with Vite
- Tailwind CSS + shadcn/ui (open-code components, easy to restyle away from a "default SaaS" look)
- react-rnd — draggable/resizable windows
- Zustand — desktop/window-manager state
- Lucide React — icons
- TanStack Query — data fetching/caching
- TanStack Table — data tables (Users, Database browser, etc.)
- Recharts — charts (Analytics/monitoring apps)

**Specialized app tech**

- xterm.js + node-pty — real terminal in the browser, backed by an actual shell process
- Monaco Editor — in-browser code editor

**Backend**

- Fastify + TypeScript, serving both the API and the compiled frontend build from one process
- SQLite (via Drizzle) for the platform's own state (admin user, sessions, config) — zero extra service to install, keeps the footprint small; swap for PostgreSQL only if you outgrow a single-server install
- WebSockets — realtime (terminal I/O, live logs, process status)
- Redis — optional, deferred until something genuinely needs shared state across processes; skip it for the initial single-process install

**Storage & Auth**

- Local server filesystem for file browsing/static serving — the app already runs on the server it manages, so no external storage is needed for the core features
- S3-compatible storage — optional, only if/when off-server backups or large-asset handling are added later
- Session-based auth + RBAC

**Infra building blocks (later phases only)**

- Nginx or Caddy — reverse proxy / routing
- systemd or a custom supervisor — process management
- cgroups — CPU/resource allocation

**Distribution & Packaging**

- Single package: one `git clone` plus one install command (e.g. `./install.sh` or `npm run install-server`)
- Backend serves the compiled frontend as static files from the same process — one process, one port, mounted at a configurable path (e.g. `/web-admin`)
- Installer creates the first admin account, requests/verifies the OS-level permission the process needs, and registers itself as a persistent service (e.g. systemd) so it survives reboots
- Built and run with the resource footprint in mind — this process shares the box with the user's actual application(s)

## Non-Goals / Explicitly Out of Scope

- Not building a literal operating system or hypervisor — this is a web app that manages a Linux box, not a kernel-level product
- Not targeting Kubernetes-style orchestration or multi-node clusters in the near term
- Not trying to match every Coolify / CapRover / Cloudron feature before shipping a usable core
- CPU/resource allocation, automatic CI/CD, and dynamic reverse-proxy routing are explicitly deferred to a later phase — not part of MVP
- Not committing to a specific retro OS skin (e.g. React95/98.css) — shadcn/ui gives more control over a distinct visual identity unless a retro look is specifically wanted later
- Not a hosted, multi-tenant SaaS — each install is a single package a user runs on their own server; there's no central service managing other people's servers
