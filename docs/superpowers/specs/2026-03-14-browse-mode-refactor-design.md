# Browse Mode Refactor — Design Spec
**Date:** 2026-03-14
**Status:** Approved

---

## Problem

The current Browse Mode in `app/page.tsx` has several UX issues:

1. **"All Properties" section is redundant** — every property already appears in Top Rated or New Listings
2. **Sections feel identical** — same horizontal scroll, same card, no visual hierarchy
3. **Horizontal scroll is invisible on mobile** — no peek of off-screen cards
4. **"See all" expands in-place** — pushes content down, user loses scroll context
5. **No logged-out state in Recommended slot** — silent absence, missed engagement opportunity
6. **Filter state is local** — lost on navigation, not shareable/bookmarkable

---

## Goals

- Improve discoverability and section clarity
- Make filters persistent across navigation using URL search params
- Replace in-place "See all" expansion with dedicated pages
- Add mobile scroll peek to signal more content
- Add login CTA in Recommended slot for logged-out users
- Extract Browse Mode into a clean component boundary

---

## Architecture

### Route Group: `app/(browse)/`

A Next.js route group shares the search bar and filter chips across all browse pages via a shared layout. Filter state lives in URL search params so it survives navigation and supports bookmarking.

```
app/
  (browse)/
    layout.tsx          ← search bar + filter chips (reads/writes URL params)
    page.tsx            ← home: sectioned browse (Recommended, Top Rated, New Listings)
    top-rated/
      page.tsx          ← full Top Rated grid
    new-listings/
      page.tsx          ← full New Listings grid
    recommended/
      page.tsx          ← full Recommended grid
    _components/
      BrowseSection.tsx ← extracted PropertySection with mobile peek fix
      RecommendedCTA.tsx ← login prompt card for logged-out users
  _hooks/
    useBrowseFilters.ts ← reads/writes URL search params for filter state
```

### URL Search Params Schema

| Param | Type | Example |
|-------|------|---------|
| `q` | string | `?q=poodle` |
| `petTypes` | comma-separated | `?petTypes=dog,cat` |
| `minRating` | number | `?minRating=4` |
| `maxPrice` | number | `?maxPrice=1000` |

---

## Components

### `useBrowseFilters` hook
- Reads current URL search params and returns typed filter state
- Provides `setFilter(key, value)` that calls `router.replace` with updated params
- Used by both the layout (chips) and pages (filtering logic)

### `(browse)/layout.tsx`
- Renders `SearchBar` and the quick filter chips strip
- Wraps `{children}` — all browse pages inherit this UI
- Reads/writes filter state via `useBrowseFilters`
- Existing `app/layout.tsx` keeps `DesktopNav`, `BottomNav`, `Toaster`, providers — untouched

### `(browse)/page.tsx` (home)
- Reads `filteredProperties` based on URL params
- Renders 3 sections: Recommended, Top Rated, New Listings
- Removes "All Properties" section entirely
- "See all" buttons navigate to `/top-rated`, `/new-listings`, `/recommended` — URL params carry over automatically

### `BrowseSection.tsx`
- Extracted from current `PropertySection` in `page.tsx`
- Mobile horizontal scroll container gets `pr-10` so last visible card is partially clipped — signals more cards
- No expand-in-place behavior (removed)
- Accepts `seeAllHref` prop — renders as `<Link>` instead of button

### `RecommendedCTA.tsx`
- Renders when user is logged out in the Recommended slot
- Dashed-border card with heart icon, short copy, and a teal "Log in" button
- Matches card dimensions so it sits naturally in the scroll row

### "See all" pages (`/top-rated`, `/new-listings`, `/recommended`)
- Full grid layout: `grid-cols-2 md:grid-cols-3 xl:grid-cols-5`
- Page heading + property count
- Back navigation returns to `/` — URL params preserved so filters remain active
- Fetches full dataset (no slice)

---

## Data Flow

```
URL params
    ↓
useBrowseFilters (hook)
    ↓               ↓
layout.tsx       page.tsx / see-all pages
(chips UI)       (filter + render properties)
```

Pages fetch all properties once, then filter client-side using URL param values — same pattern as current implementation.

---

## What Is Removed

- `expandedTopRated`, `expandedNewListings`, `expandedRecommended` state — no longer needed
- "All Properties" section
- In-place "See all" expand logic in `PropertySection`
- Filter state (`useState` for filters, search) from `page.tsx` — moves to URL

---

## What Is Preserved

- `PropertyCard` — unchanged
- `PropertyList` — unchanged
- `FilterPanel` drawer — unchanged, triggered from SearchBar
- `app/layout.tsx` — unchanged
- All existing API calls (`getProperties`, `getRecommendedProperties`)
- Desktop grid layout patterns

---

## Non-Goals

- No new card designs or visual redesign of PropertyCard
- No server-side filtering (client-side filtering is sufficient at current scale)
- No pagination on "see all" pages
