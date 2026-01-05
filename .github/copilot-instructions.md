# Tadabor: AI Coding Agent Instructions

Tadabor is a React 19 + TypeScript web application for browsing and annotating the Quran. Users can write personal notes/reflections on verses, roots, and translations—stored either locally (browser IndexedDB) or in the cloud (with authentication).

## Architecture Overview

### Core Tech Stack

- **Frontend**: React 19, TypeScript, Vite (dev server), React Router 7
- **State Management**: Redux Toolkit for global UI state + Zustand for notes + TanStack Query for async operations
- **Backend**: tRPC (type-safe RPC framework) with authentication
- **UI**: Chakra UI v3 (theming, components)
- **Data**: Dexie (IndexedDB), quran-tools (Quran data manipulation)
- **i18n**: react-i18next (Arabic/English, RTL support)
- **PWA**: vite-plugin-pwa (offline support, service workers)

### Major Components & Data Flow

**Provider Chain** (`src/index.tsx` → `src/components/Custom/AppProviders.tsx`):

1. Redux store (global state)
2. Chakra UI provider
3. React Query provider (tRPC integration)
4. Browser Router (routing)
5. Error boundaries

**Core Data Providers**:

- **QuranProvider** (`src/context/QuranProvider.tsx`): Loads and caches Quran text, chapters, and roots via `quran-tools` class. Fetches from `/res/quran_v2.json`, `/res/chapters.json`, `/res/quranRoots-0.0.18.json` with retry logic (3 attempts, exponential backoff).
- **UserProvider** (`src/components/Custom/UserProvider.tsx`): Manages authentication, token refresh via tRPC auth mutations.
- **NotesProvider** (`src/components/Custom/NotesProvider.tsx`): Syncs local/cloud notes using Zustand stores.

### Redux Store Structure (`src/store/index.ts`)

**Global Slices**: settings, navigation, user, translations

**Page-Specific Slices** (e.g., `qbPage`, `rbPage`): Store UI state like selected chapters, search filters, scroll positions.

### Notes State Management (Zustand)

Two separate note stores with identical structure:

- **localNotes** (`src/store/zustand/localNotes.ts`): Browser-only, uses `dbNotes.saveLocal()` (IndexedDB)
- **cloudNotes** (`src/store/zustand/cloudNotes.ts`): Synced to backend, uses `dbNotes.saveCloud()` + tRPC `uploadNote` mutation

Both follow pattern:

```
data: { [noteId]: NoteProps }
dataKeys: string[]  // List of note IDs
dataLoading: { [noteId]: boolean }
dataComplete: { [noteId]: boolean }  // Has note been fetched?
loading: boolean  // Initial load state
```

### Critical Custom Hooks

**`useNote({ noteID, noteType, noteKey, isVisible })`** (`src/hooks/useNote.ts`):

- Central hook for note CRUD. Returns: `{ text, setText, direction, setDirection, save, isSaved, isSynced, isOutOfSync, ... }`
- Automatically routes to local OR cloud store based on `useAppSelector(state => state.user.isLogged)`
- Handles dual-sync: IndexedDB save + optional tRPC upload for cloud notes
- Computes `isOutOfSync` by comparing `date_synced < date_modified`

**`useQuran()`** (`src/context/useQuran.tsx`): Access to `quranClass` instance for searching, getting verses/chapters/roots.

**`usePageNav(navKey)`** (`src/hooks/usePageNav.ts`): Updates global navigation state (breadcrumb, current page).

### Note Type System

Notes are identified by format: `{type}:{key}` or custom UUID

- **verse**: e.g., `"verse:1:1"` (chapter:verse), text stored with direction (RTL/LTR)
- **root**: e.g., `"root:1"` (root:index)
- **translation**: e.g., `"translation:1:1"` (chapter:verse for translation notes)

Note structure (`src/types/index.ts`):

```typescript
LocalNoteProps = {
  id,
  uuid,
  key,
  type,
  text,
  dir,
  date_created,
  date_modified,
};
CloudNoteProps =
  LocalNoteProps + { authorId, date_synced, isDeleted, isPublished };
```

## Critical Developer Workflows

### Build & Run

```bash
npm install
npm start      # Dev server at http://localhost:3000, HMR enabled
npm run build  # TypeScript check + Vite build → /build
npm run lint   # ESLint (must pass, --max-warnings 0)
npm run theme  # Regenerate Chakra theme types
```

### Common Commands

- **Type Check**: Run `npm run build` or `tsc` (tsconfig.json enforces strict mode)
- **Reset Data**: Clear IndexedDB in DevTools (Application tab)
- **PWA Test**: Disable network in DevTools Network tab; app should still work offline

### Debugging Notes Workflow

1. Open DevTools → Application → IndexedDB → tadaborDatabase
2. Inspect `local_notes` or `cloud_notes` table
3. Use Zustand devtools or console logs to track `localNotes`/`cloudNotes` store changes
4. Check browser Console for `useNote` hooks logging (`note.save()` calls)

## Project-Specific Patterns & Conventions

### File Organization

- `src/pages/`: Page components (lazy-loaded via React Router)
- `src/components/`: Organized by responsibility (Custom, Generic, Layout, Note, Pages, ui)
- `src/store/slices/`: Redux slices split into global/ (shared) and pages/ (UI state)
- `src/store/zustand/`: Zustand stores for notes (local and cloud)
- `src/hooks/`: Custom React hooks (auth, notes, page nav, screen size)
- `src/util/`: Utilities (db.ts for Dexie, trpc.ts client, fetchData.ts for static data)
- `src/context/`: React Context providers (Quran, User)

### Redux Usage Conventions

- **Selectors**: Use `useAppSelector()` not `useSelector()`. Create selector functions for reusable queries.
- **Async Thunks**: Used in slices for async operations. Check completion flags to avoid duplicate fetches.
- **Actions**: Dispatched via `useAppDispatch()`. Page actions (e.g., `qbPageActions.setSearchPanel()`) manage UI state.

### Component Patterns

- **Verse Display**: Use `<BaseVerseItem>` (`src/components/Custom/BaseVerseItem.tsx`) as wrapper for all verse lists. Handles selection, highlighting, key events.
- **Modals/Forms**: Chakra `useDisclosure()` for open/close state. Notes use `<NoteForm>` component.
- **Note Rendering**: Each page needing notes uses `useNote()` hook. Pass `isVisible={isElementVisible}` to lazy-load.
- **Searching**: Pages use `quranService.search*()` methods from quran-tools (e.g., `searchRoots()`, `searchVerses()`).

### State Management Patterns

- **Dual-Mode App**: Check `state.user.isLogged` to decide local vs. cloud operations
- **Optimistic UI**: Don't wait for backend; update Zustand immediately, handle sync errors gracefully
- **Lazy Loading Notes**: `useNote()` uses `useEffect()` with `isVisible` dependency; fetches on mount if not cached
- **Pagination**: Page-specific slices track `currentChapter`, `scrollKey`. Use `usePageNav()` to restore scroll on page re-entry

### tRPC Integration

- Client: `useTRPC()` hook from `src/util/trpc.ts` returns typed router proxy
- Mutations wrapped in `useMutation()` from TanStack Query (e.g., `uploadNote.mutateAsync()`)
- Error handling: Watch for Zod validation errors in `AppRouter` error shape

### Database (Dexie)

- **File**: `src/util/db.ts` defines schema (`ILocalNote`, `ICloudNote`, `IColor`, etc.)
- **Access**: Use `dbNotes.*`, `dbLetters.*`, `dbTags.*`, `dbColors.*` utilities from `src/util/dbFuncs.ts` (not Dexie directly in components)
- **Indexing**: Verse key = `chapter:verse`. Root key = root index. Use these for fast lookups.

### i18n

- **Setup**: `src/i18n.ts` initializes react-i18next with Arabic/English
- **Usage**: `const { t, i18n } = useTranslation()`. `i18n.dir()` returns "rtl" or "ltr"
- **Keys**: `t("nav.browser")`, `t("notes.no_notes")`, `t("ui.messages.save_success")`

## Integration Points & External Dependencies

### tRPC Backend

- Endpoints: `auth.{login, signUp, refresh, updateEmailOrUsername}`, `notes.{uploadNote, fetchNote, syncNotes, getNotesIndexes}`, `user.{getUser, getProfile}`, `admin.*`
- Auth: JWT token stored in localStorage, auto-refreshed via `auth.refresh` query
- Error Codes: 401 (unauthorized), 400 (bad request with Zod errors), 500 (server error)

### Quran Data

- Loaded from `/public/res/` (static JSON files, cached for 1 year)
- `quran-tools` library (npm package) provides `quranClass` for all Quran operations
- Methods: `getChapterName(suraid)`, `getVerses(chapter)`, `searchRoots(term)`, `getVerseTextByKey(key)`

### Cross-Page Communication

- Use Redux slices for shared UI state (e.g., `navigation.toolInspect`, `navigation.pageDirection`)
- Use Context for data sharing (e.g., `QuranContext` for Quran instance)
- Avoid prop drilling; prefer Redux for non-local state

## Key Files to Reference

- **App Entry**: `src/index.tsx`, `src/App.tsx` (route definitions)
- **State**: `src/store/index.ts` (Redux setup), `src/store/zustand/localNotes.ts` (notes pattern)
- **Core Hooks**: `src/hooks/useNote.ts`, `src/hooks/useAuth.ts`
- **Quran Data**: `src/context/QuranProvider.tsx`, `src/util/fetchData.ts`
- **UI Components**: `src/components/Custom/BaseVerseItem.tsx`, `src/components/Note/NoteForm.tsx`
- **Database**: `src/util/db.ts`, `src/util/dbFuncs.ts`, `src/util/trpc.ts`
- **Config**: `vite.config.ts` (build setup), `tsconfig.json` (strict mode), `eslint.config.js`

## Common Pitfalls to Avoid

1. **Don't mutate Zustand state directly** — use immer updates (handled by middleware)
2. **Don't fetch notes without `isVisible` check** — wastes bandwidth; use lazy loading
3. **Don't assume user is logged in** — always check `state.user.isLogged` before accessing cloud note
4. **Don't forget to set `date_modified`** — needed for sync conflict detection
5. **Don't hardcode URLs** — use relative paths (e.g., `/res/file.json`)
6. **Don't skip type checking** — run `npm run lint` and `tsc` before commit

## Testing & Validation

- **Type Safety**: All external data validated with Zod in backend; use strict TypeScript
- **Component Testing**: Manual testing in dev mode; PWA caching behavior tested by disabling network
- **Note Sync**: Manual verification using Zustand devtools + IndexedDB inspector
- **i18n**: Test RTL layout in Arabic; use `i18n.dir()` in components

---

**Last Updated**: January 5, 2026 | **Version**: 0.47.5
