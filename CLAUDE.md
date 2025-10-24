# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Development Commands

- **Dev server**: `npm run dev` - Start Vite development server
- **Build**: `npm run build` - TypeScript compilation + Vite build
- **Preview**: `npm run preview` - Preview production build
- **Lint/Typecheck**: `npm run lint` - Run TypeScript compiler without emit for
  type checking
- **Format**: `npm run biome:format` - Format code with Biome
- **Lint check**: `npm run biome:check` - Check code with Biome linter
- **Auto-fix**: `npm run biome:unsafefix` - Auto-fix with Biome (unsafe)

## Architecture Overview
This is a React + TypeScript application built with Vite, using TanStack Router
for routing and Zustand for state management. It's a Minecraft datapack/voxel
editor studio application.

### Core Technologies
- **Build Tool**: Vite with Rolldown
- **Framework**: React 19 with React Compiler
- **Routing**: TanStack Router (file-based routing in `src/routes/`)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query with persistence
- **Styling**: TailwindCSS v4
- **Linting/Formatting**: Biome (replaces ESLint/Prettier)
- **Core Engine**: @voxelio/breeze for datapack/voxel operations

### Project Structure
```
src/
├── components/          # React components
│   ├── layout/         # Layout components (Navbar, Footer, etc.)
│   ├── pages/          # Page-specific components
│   ├── tools/          # Core editor tools and elements
│   │   ├── elements/   # Voxel element renderers (recipe, loot, etc.)
│   │   ├── sidebar/    # Editor sidebar components
│   │   ├── debug/      # Editor debug panels
│   │   └── elements.ts # All data abouts Tabs and Href Navigation elements
│   │   └── Store.ts    # Main Zustand store for configurator state
│   └── ui/            # Reusable UI components (Not Shadcn)
├── lib/               # Utilities and hooks
│   ├── hook/         # Custom React hooks
│   ├── i18n/         # Internationalization containting i18nServer.ts (Server Side) and i18nStore.ts (Client Side)
│   └── utils/        # General utilities
├── routes/           # TanStack Router file-based routes
├── i18n/             # Translation files containing en.json and fr.json
└── globals.css       # Global styles
```

### Key Architectural Concepts

#### Voxel Studio

- **Main Store**: `src/components/tools/Store.ts` - Central Zustand store
  managing:
  - Voxel elements and datapack compilation
  - Current element selection and editing
  - Registry caching and sorting
  - Route navigation history per concept
- **Query Provider**: TanStack Query for server state with persistence

#### Routing Pattern

- Uses TanStack Router with file-based routing
- Parameterized routes like `/$lang/studio` for internationalization
- Nested layouts with `Outlet` components

#### Translation System
- For Voxel Studio, we need to use <Translate> component. Take a string props "content". Put a translation key like: "registry:key_name".
- Registry is json file at `src/i18n/studio/<lang>/<registry>.json`.
- If you don't provider a registry, i will use `src/i18n/studio/<lang>.json`.
- For some special cases, you can use a hook like `useTranslate("registry:key_name");`.

#### Element System

- Powered by `@voxelio/breeze` library for Minecraft datapack operations
- Elements stored in Map with identifier-based keys
- Registry-based organization (recipes, loot tables, textures, etc.)
- Real-time compilation and validation

#### Code Style
- **Biome Configuration**: 4-space indents, 140 char line width, double quotes
- **Import Aliases**: `@/` for src root, `@lib/*` and `@routes/*` for specific
  paths
- **React Patterns**: Uses React 19 features with React Compiler enabled

Rules:
- No code redundancy.
- No "any" type. For type "unknown", it is preferable to request authorization.
- Avoid globalthis.
- Prefer modern and standards logic 2024 abb 2025.
- Methods must be less than 10 lines of code and must do one thing correctly.
- No Legacy or Deprecated support.
- At the end of each sessions, check with `npm run lint`
- Avoid unnecessary re-renders with zustand or React.
- useEffect and useLayoutEffect is completely prohibited; you must ask for permission to use it. https://react.dev/learn/you-might-not-need-an-effect
- useMemo, useCallback are deprecated and are automacly done by React 19.
- useForwardRef is deprecated, use ref as props.