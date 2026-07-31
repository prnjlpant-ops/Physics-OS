# Physics OS

A personal study operating system for IIT JAM and JEST preparation — local-first,
syllabus-first, dark, minimal. See `PRD.md` for the full product vision and
`Claude_Rules.md` for the standing project rules.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
npm run electron:dev
```

## Build

```bash
npm run build
npm run lint
npm run type-check
```

## Packaging

```bash
npm run package:win
```

This produces a Windows portable executable and NSIS installer in the release folder.

## Running the Application

```bash
npm run electron:start
```

## Running the Packaged Executable

After packaging, launch one of the generated files from the release folder:

- release/Physics OS-Portable-<version>.exe
- release/Physics OS Setup <version>.exe

Stack: React 19 + React Router 7 + Vite 7 + Tailwind CSS 4. Plain JavaScript
(JSX), no TypeScript, no backend — everything persists to `localStorage`.

## Folder Layout

```
src/
  assets/          Static assets
  components/      Reusable UI + feature-specific components, grouped by feature
    ui/            Sprint 0 — generic primitives (Button, Card, Modal, Input)
    errorHandling/ Sprint 0 — ErrorBoundary + FallbackUI
    <feature>/      e.g. timer/, planner/, mockTests/ — components used by one feature
  constants/       Static config: navigation, subjects, status enums, theme tokens
  context/         React context providers (StudyTimerContext, MasterIndexProvider)
  data/            Static/seed data, including the imported JEST blueprint
  engine/          Feature-specific business logic + models (one "engine" per
                   sprint's feature — blueprint import, daily study, planner,
                   knowledge base, master index, roadmap, syllabus)
  hooks/           Feature-specific hooks, mostly small localStorage-backed
                   stores (bookmarks, statuses, revision queues, settings)
  layouts/         Route layout shells (AppLayout: sidebar + top bar + outlet)
  pages/           One file per route, grouped into subfolders that mirror
                   the URL structure (subject/, subject/chapter/, mockTests/,
                   errorLearning/, analytics/, syllabus/, home/)
  router/          The single React Router route tree (router/index.jsx)
  services/        Sprint 0 — reusable, feature-agnostic infrastructure
                   (Storage, Settings, Logger, Theme, Navigation)
  styles/          Global CSS + Tailwind theme tokens
  types/           Sprint 0 — shared, source-agnostic data model shapes
  utils/           Small stateless helpers (formatting, slugify, storage
                   helpers for Notes/Study Sessions, etc.)
```

## Architecture

**Routing.** `src/router/index.jsx` is the single route tree, rendered inside
`AppLayout` (sidebar + top bar + `<Outlet />`). Nested routes mirror nested
UI (e.g. a Subject's Chapters, a Chapter's Resource types). `App.jsx` wraps
the router in the Sprint 0 `ErrorBoundary` so a render error in one page
doesn't take down the whole app.

**Feature modules.** Most features follow the same shape: `constants/` for
enums/config → `engine/` for the model + business logic → `hooks/` for a
small React state wrapper around localStorage → `components/<feature>/` for
UI → `pages/` for the routed screens. Sprint 0 does not change this pattern
for any existing feature.

**Storage.** Every existing feature persists to `localStorage` directly via
its own small `readAll`/`writeAll` pair (see `utils/notesStorage.js`,
`hooks/useFavorites.js`, etc.), each dispatching a custom event so other
mounted components stay in sync. That pattern is unchanged. Sprint 0 adds
`services/StorageService.js` as the single reusable storage layer new
modules should build on instead of writing another bespoke wrapper —
existing modules were **not** migrated to it in this sprint, to avoid
touching ~30 working files for a foundation-only sprint.

**Settings.** Several features already own a narrow, feature-specific
settings store (Knowledge Base root path, Planner defaults, Mock Test
defaults). Sprint 0 adds `services/SettingsService.js` as a separate,
centralized store for app-level settings (theme, default study hours,
default session length, app version). The two systems currently coexist;
migrating a feature setting into the centralized store is future work, not
done here.

**Theme.** The app ships one VS Code inspired dark theme by design (see
PRD) — `index.html` hardcodes `<html class="dark">`. `styles/index.css`
defines a handful of Tailwind `@theme` CSS variables; most components
instead use raw hex Tailwind values (`bg-[#1e1e1e]`, etc.) directly, and
that is intentionally unchanged in this sprint. `constants/themeTokens.js`
names that same palette for new code to reference, and
`services/ThemeService.js` centralizes reading/applying the active theme.

**Error handling.** `components/errorHandling/ErrorBoundary.jsx` (class
component, as required by React) catches render errors beneath it, routes
them through `services/LoggerService.js`, and renders
`components/errorHandling/FallbackUI.jsx` instead of a blank screen.

**Shared models vs. engine models.** `src/types/` holds plain,
source-agnostic data shapes (Subject, Chapter, Topic, Resource,
StudySession, Task, PYQ, Analytics, KnowledgeBase, Settings) — data only, no
logic. Several features already have their own richer, purpose-built model
files in `src/engine/` (e.g. `taskModel.js` for the Daily Study Engine,
`blueprintModel.js` for the syllabus import pipeline) — those are unchanged
and remain the source of truth for their own feature.

## How Future Modules Should Be Added

1. Add any new enums/config to `src/constants/`.
2. If the module needs a data shape not already in `src/types/`, add it
   there as a plain factory function (data only — no side effects).
3. Persist state through `services/StorageService.js` rather than calling
   `localStorage` directly.
4. Build business logic in a new `src/engine/<feature>Service.js` (+ a model
   file if the shape is feature-specific), following the existing
   Model/Service split.
5. Wrap that in a hook under `src/hooks/` if a component needs reactive
   state from it.
6. Build UI in `src/components/<feature>/`, reaching for the primitives in
   `src/components/ui/` (`Button`, `Card`, `Modal`, `Input`) before writing
   new markup.
7. Add the route to `src/router/index.jsx` and, if it needs deep-linking
   from elsewhere in the app, a path builder in
   `services/NavigationService.js`.
8. Add the nav entry to `constants/navigation.js` if it belongs in the
   sidebar.
