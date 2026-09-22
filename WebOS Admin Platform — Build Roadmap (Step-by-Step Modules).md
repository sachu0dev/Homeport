# WebOS Admin Platform — Build Roadmap (Step-by-Step Modules)

2026-09-22 · @Someone

## Build Philosophy

Build the **shell** before any real capability, and build every phase so the previous phase still works when the next one lands. Nothing here is skipped ahead of its dependencies — the highest-risk, most DevOps-heavy features (CI/CD, resource allocation, dynamic routing) are pushed to the very end, on purpose, because they're furthest from current experience and least needed to prove the concept.

Each phase below has:

- **Goal** — what should be true when it's done
- **Modules** — the concrete pieces to build, in order
- **Definition of done** — a checkable end state before moving on
- **Constraint to hold throughout** — this ships as a single, self-hosted package installed via `git clone` plus one install command on the user's own server, so every phase should default to the lightest-weight option that works rather than the most feature-rich one

Rule of thumb: if a phase can't be demoed (clicked through, visibly working) at the end of it, it's not actually done — keep it small enough that it can be.

## Phase 0 — Project Setup, Packaging & Scaffolding

**Goal:** an empty but running project, frontend and backend both up, talking to each other.

**Modules:**

1. Scaffold frontend: Vite + React + TypeScript
2. Install & configure Tailwind CSS + shadcn/ui
3. Scaffold backend: Fastify + TypeScript, one health-check route
4. Wire frontend → backend with a basic API client (fetch/axios) and confirm the health-check round-trips
5. Set up repo structure (`/apps/web`, `/apps/api` or similar), linting, formatting, `.env` handling
6. Local dev scripts (`dev`, `build`) that run both sides together
7. Decide the production packaging shape now: the backend will serve the compiled frontend build as static files from one process — dev mode can still run `apps/web` and `apps/api` separately for convenience, but `build` must produce a single deployable package
8. Sketch the install flow shape (`git clone` → one install command) even before it does anything — an empty `install.sh` that just confirms Node is present is enough for now; real logic comes in Phase 4

**Definition of done:** `npm run dev` boots a blank page that successfully calls the backend and shows "API OK" — and `npm run build` produces a single folder/package where the backend can serve the built frontend statically.

## Phase 1 — Desktop Shell (static visual foundation)

**Goal:** the desktop *looks* right — no real windows or data yet, just the visual shell.

**Modules:**

1. `Desktop` component — full-screen background/wallpaper container
2. `Topbar` — logo, clock, placeholder user menu
3. `Taskbar` — static bar at the bottom (empty for now)
4. `DesktopIcon` — clickable icons on the desktop (no action yet, just visual)
5. `AppLauncher` — a launcher panel/menu that opens and closes (still empty)
6. Establish the visual identity here (via `frontend-design` guidance) rather than defaulting to generic shadcn styling — this is the platform's first impression

**Definition of done:** a static, styled desktop screen that looks like a real product, with a clock that ticks and a launcher that opens/closes — nothing is wired to real functionality yet.

## Phase 2 — Window Manager Core

**Goal:** windows that open, drag, resize, minimize, maximize, and stack correctly — still with dummy/placeholder content inside them.

**Modules:**

1. `window-manager/store.ts` (Zustand) — holds the array of open `WindowInstance`s: `id`, `appId`, `x`, `y`, `width`, `height`, `minimized`, `maximized`, `focused`, `zIndex`
2. `window-manager/actions.ts` — `openWindow`, `closeWindow`, `focusWindow`, `minimizeWindow`, `maximizeWindow`, `moveWindow`, `resizeWindow`
3. `Window` component wrapped in `react-rnd` — title bar, minimize/maximize/close controls, drag + resize
4. Z-index / focus handling — clicking a window brings it to front
5. `Taskbar` now reflects real open windows (click to restore/minimize)
6. Two or three dummy windows with placeholder content, opened from the (still-empty) `AppLauncher`, to prove the manager handles multiple windows at once

**Definition of done:** several windows can be open simultaneously, dragged, resized, minimized to the taskbar, restored, and maximized — all state-driven, none of it real app data yet.

## Phase 3 — App Registry & Plugin Architecture

**Goal:** apps become pluggable — the shell no longer knows what any specific app does.

**Modules:**

1. `apps/registry.ts` — a typed registry: `{ id, name, icon, component, defaultWidth, defaultHeight }`
2. `registerApp()` — apps add themselves to the registry rather than being imported ad hoc into the shell
3. Wire `AppLauncher` and `DesktopIcon`s to the registry — they render whatever's registered, nothing hardcoded
4. `openApp(appId)` — looks up the registry entry and calls `openWindow()` with its defaults
5. Convert the Phase 2 dummy windows into 1–2 minimal registered apps (still placeholder content) to prove the registry pattern end-to-end

**Definition of done:** adding a brand-new app is just calling `registerApp()` in one file — no changes to `Desktop`, `Taskbar`, `WindowManager`, or `AppLauncher` required.

## Phase 4 — Backend API Skeleton, Auth & Install Bootstrap

**Goal:** a real backend with real auth — plus the install flow that creates the first admin account and secures the permissions the app needs to manage the server it's running on.

**Modules:**

1. SQLite (via Drizzle) schema for the platform's own state: users table, sessions table
2. Session-based auth (login/logout, session cookie); no public sign-up — accounts are created only by the installer or by an existing admin
3. Auth middleware on the Fastify side; protected route pattern
4. Basic RBAC scaffold (roles table or enum) even if only one role is used today
5. **Install script**, run as part of the `git clone` → install command flow: prompts for the first admin username/password, writes the initial admin user and session secret, and checks/requests whatever OS-level permission the process needs (e.g. access to the relevant directories/services, or a scoped sudo request where genuinely required)
6. Register the process as a persistent service on install (e.g. a systemd unit) so it survives reboots instead of needing to be started manually
7. Frontend: login screen served from the same package, same process, at the configured path (e.g. `/web-admin`) — no separate hosted sign-up flow

**Definition of done:** running the install command on a clean server ends with a working admin account, the app running as a background service, and the login screen reachable at the configured path (e.g. `/web-admin`) — with zero manual config-file editing.

## Phase 5 — First Real App Wired End-to-End

**Goal:** prove the whole stack works together with ONE real app, before building more. This is the most important milestone in the whole roadmap — everything after it is repeating the same pattern.

**Modules:**

1. Pick the simplest genuinely useful app — **Files** (list/browse a directory) is the recommended first pick since it's core to the product
2. Backend: a small file-API route (list directory contents, read a file) with strict path validation/sandboxing
3. Frontend: `FilesApp` component — registered via `registerApp()`, using TanStack Query to fetch real data, TanStack Table or a simple list to render it
4. Wire it into a real window: opens from the launcher, shows real server data, handles loading/error states
5. Confirm the full loop: launcher → registry → window → API client → auth-protected backend route → real data → rendered in a draggable window

**Definition of done:** opening "Files" from the launcher shows the real contents of a real directory on the server, in a window that behaves exactly like the Phase 2 dummy windows did.

## Phase 6 — Core Utility Apps

**Goal:** flesh out the app library, repeating the Phase 5 pattern for each. Build these roughly in this order — each is progressively more involved:

1. **Users app** — CRUD on the users table built in Phase 4; reuses the exact same pattern as Files
2. **Logs app** — tail/stream application or server logs; first use of WebSockets for live data
3. **Database browser** — read-only table/query viewer against Postgres; introduces schema introspection
4. **Terminal app** — xterm.js on the frontend, node-pty on the backend, connected over WebSocket; this is the highest-value "wow" feature and also the most security-sensitive (a real shell exposed over the web needs careful auth + scoping)
5. **Code editor app** — Monaco Editor, wired to the Files backend from Phase 5 for open/save

Each app is registered the same way as Files — no shell changes required, per the Phase 3 architecture.

**Definition of done:** all five apps open from the launcher, run side-by-side in independent windows, and each does one real thing correctly.

## Phase 7 — Multi-App Hosting & Reverse Proxy

**Goal:** the platform can deploy and serve more than one user application on the same server — this is where the product starts doing what it's actually for.

**Modules:**

1. Framework template library, starting with a single framework (Next.js) — a scaffold/build runner that can take a template or repo and produce a runnable build
2. Static file serving/browsing for frontend builds (Nginx or a lightweight Node static server)
3. Reverse proxy layer (Nginx or Caddy) with dynamic config — route incoming domains/subdomains to the right app/port
4. Port/namespace allocation so multiple deployed apps don't collide
5. A **Deployments app** in the shell to trigger and monitor these

**Definition of done:** two independent user apps, deployed through the platform, are both reachable on their own domains/subdomains at the same time, from the same server.

This proxy layer is for the apps your users deploy through the platform — the admin panel itself keeps running at its own fixed install path (e.g. `/web-admin`) regardless of what else is being proxied on the box.

## Phase 8 — Process Management & Setup Wizard

**Goal:** deployed apps stay alive without manual intervention, and a non-technical user can configure a fresh server without touching a terminal.

**Modules:**

1. Process supervisor (systemd-style, or a lightweight custom one) — keeps each deployed app running, restarts on crash
2. Process status reporting — surfaced in the Deployments app (running/crashed/restarting)
3. Step-by-step setup wizard UI — walks a new user through initial server configuration (domain, first deploy, etc.)
4. Wizard drives the same backend flows built in Phases 4–7 — no new backend capability, just a guided UI over what already exists

**Definition of done:** a killed app process comes back on its own within seconds; a brand-new server can be taken from empty to "one app deployed and running" purely through the wizard, no terminal involved.

## Phase 9 — CI/CD Automation & Resource Allocation (highest risk, last)

**Goal:** the two hardest, riskiest pieces — tackled last, with everything else already proven and working.

**Modules:**

1. Webhook-based CI/CD trigger (e.g. push to repo → auto-rebuild → auto-redeploy) for the one framework supported so far
2. Build pipeline UI in the wizard — configure CI/CD without commands
3. Expand framework template support beyond the first one, now that the pipeline pattern is proven
4. CPU/resource allocation controls via cgroups — assign cores/limits per deployed app
5. Surface resource usage and limits in the Deployments app

This phase is expected to take the longest and involve the most learning — both CI/CD reliability and cgroups are genuine DevOps territory outside current experience. Leaning on existing tools (e.g. a lightweight CI runner, documented cgroups wrappers) rather than building from scratch is recommended here.

**Definition of done:** pushing a code change to a connected repo redeploys the app automatically; a deployed app can be given a CPU/resource limit that's actually enforced.

## Summary: Phase-by-Phase Checklist

- [ ] Phase 0 — Project Setup, Packaging & Scaffolding
- [ ] Phase 1 — Desktop Shell (static visual foundation)
- [ ] Phase 2 — Window Manager Core
- [ ] Phase 3 — App Registry & Plugin Architecture
- [ ] Phase 4 — Backend API Skeleton, Auth & Install Bootstrap
- [ ] Phase 5 — First Real App Wired End-to-End (Files)
- [ ] Phase 6 — Core Utility Apps (Users, Logs, Database, Terminal, Code Editor)
- [ ] Phase 7 — Multi-App Hosting & Reverse Proxy
- [ ] Phase 8 — Process Management & Setup Wizard
- [ ] Phase 9 — CI/CD Automation & Resource Allocation

See the companion **Requirements & Features** doc for the full feature list and feasibility notes behind each phase.
