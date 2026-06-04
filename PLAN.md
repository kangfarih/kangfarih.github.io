# Next.js Migration Plan (from hugo-public)

## Decision: Base Template
- Use **Vercel Portfolio Starter Kit** as the foundation and adapt it to our content and Hugo behavior.
- Primary objective remains: keep the site static-first and preserve content parity, then iterate on UX and styling.

## Status (Current Phase)
Completed:
- Phase 0 — Content Audit (CONTENT_AUDIT.md + ASSET_MANIFEST.md)
- Phase 0.2 — Template Fit Check (Tailwind + Geist + starter-kit layout integrated; build is green)
- Phase 0.5 — Search Index (portfolios implemented; posts added as well)
- Phase 1.5 — Adopt Vercel Starter Kit (hard cutover: global layout/nav/footer + Tailwind baseline)
- Phase 1/2 — Content routes (portfolios + posts list/detail) migrated to the starter-kit style

In progress / next:
- Mobile UX polish (validate drawer behavior on real mobile viewport/devices)
- SEO expansion (sitemap/robots + richer metadata if desired)
- Static hosting configuration for GitHub Pages (output export/basePath) when ready to deploy

## Goals
- Match the current Hugo site’s behavior and structure (routes, layout, and UI patterns) while migrating to a maintainable Next.js architecture.
- Introduce reusable components (header/footer/sidebar/toc/content shell) so list/detail pages (e.g. portfolios) share the same layout primitives.
- Separate “data” from “view” (MVC-ish): content/model loading in a data layer, route pages acting as controllers, UI components acting as views.
- Minimize regressions: prioritize parity with `hugo-public/` first, then refactor/modernize safely.

## Current Hugo Baseline (What We’re Matching)
### Page types
- **Home**: one-page sections (hero/about/skills/experiences/projects/recent-posts) + navbar anchors + footer.
- **List pages**: `/portfolios/`, `/posts/`, and folder lists like `/portfolios/company-profile/`.
  - Left sidebar with hierarchical tree, collapsible sections (`fa-plus-circle` / `fa-minus-circle`), active highlighting.
  - Main content = card grid (Filter/Search in Hugo appears present but not functionally filtering in shipped JS).
- **Detail pages**: `/portfolios/<slug>/`, `/posts/<slug>/`
  - Left sidebar tree (same as list, but with active item highlighting and expanded parent folder).
  - Main content area with hero image header, author/date/title/body.
  - Right-side TOC derived from headings in the content.

### Notable DOM/CSS conventions to keep
- Shared identifiers/classes across pages:
  - `#sidebar-section`, `.sidebar-holder`, `#search-box`, `.sidebar-tree`, `#tree`, `#list-heading`, `.subtree`
  - `#content-section`, `.content-section`, `.wrapper`
  - `#toc-section`, `.toc-holder`, `.toc`
- Hugo markup places a `<div class="subtree">` inside `<ul id="tree">` (invalid HTML but works). We can keep this for pixel parity or adjust to valid markup and update CSS accordingly.

## Migration Method (Reliable, low-regression)
Principle: treat the live Hugo site (`hugo-public` / production) as the behavioral specification, and change one variable at a time.

Why:
- Code-only analysis misses small but important UX rules (e.g. which routes hide the main menu, when sidebar toggles apply).
- Re-implementing layout + behavior + styling at once compounds regressions and makes debugging ambiguous.

Approach:
- Behavior-first notes: capture expected behavior and DOM anchors per page type (sidebar/toc/toggles/breakpoints).
- Implement reusable primitives first (shell/sidebar/toc/list/detail) and reuse across routes.
- Keep Hugo CSS for parity; delay Tailwind until the UI is stable.

## Reusable Component Inventory (Target)
Goal: define a small set of reusable building blocks, then assemble pages by composition.

Layout primitives:
- `AppShell` (global): header + footer wrapper for all routes.
  - Variants: home shows main menu; content routes show brand + optional sidebar toggler.
- `ContentShell` (content pages): 3-column layout container
  - Regions: `sidebar` (left), `content` (center), `toc` (right, optional)
  - Used by: posts/portfolios list and detail pages.

Navigation primitives:
- `SidebarTree` (left nav): Hugo-like tree list
  - Features: expand/collapse folders, active highlighting, auto-expand active ancestors, sticky holder
  - Used by: portfolios list/detail, posts list/detail.
- `SidebarSearch` (optional enhancement): input + wiring
  - For parity: input present but can be no-op
  - For enhancements: filter cards and/or sidebar nodes.

Content primitives:
- `CardGrid` (list): post/portfolio cards
  - DOM parity: `#post-card-holder`, `.post-card`, `.post-card-link`, `.card-*`
  - Used by: portfolios list routes, posts list routes.
- `ContentBody` (detail): MDX-rendered body + hero + author/date/title
  - Used by: portfolio detail, post detail.
- `TOC` (detail): heading list derived from content
  - Used by: portfolio detail, post detail.

Cross-cutting:
- `SearchIndexBuilder` (build-time): generates JSON index for client-side search
  - Portfolios-only in Phase 0.5; posts can be added later if desired.

## Route-to-Component Mapping
Home:
- `/`
  - `AppShell` (home menu variant)
  - Home sections components (Hero/About/Skills/Experiences/Projects/RecentPosts)

Portfolios:
- `/portfolios/` (list)
  - `AppShell` (content variant)
  - `ContentShell` + `SidebarTree` + `CardGrid`
  - Enhancement: `SidebarSearch` filters `CardGrid` using portfolios search index
- `/portfolios/<folder>/` (nested list)
  - Same as list, but `CardGrid` shows entries under prefix, `SidebarTree` still shows full tree
- `/portfolios/<slug>/` (detail)
  - `AppShell` (content variant)
  - `ContentShell` + `SidebarTree` + `ContentBody` + `TOC`

Posts:
- `/posts/` (list)
  - `AppShell` (content variant)
  - `ContentShell` + `SidebarTree` + `CardGrid`
- `/posts/<slug>/` (detail)
  - `AppShell` (content variant)
  - `ContentShell` + `SidebarTree` + `ContentBody` + `TOC`

## Proposed Next.js Architecture (MVC-ish)
### Models (data shape)
- `ContentEntry` (already present): `{ kind, slug, href, title, date?, summary?, hero? }`
- `SidebarTreeNode` (new): `{ label, href, children[], isExpanded?, isActive? }`
- `PageContext` (new): `{ kind, activeHref, baseHref }`
- `TocItem` (already present): `{ id, text, depth }`

### Data layer (services)
Create/centralize content and navigation “data” functions:
- `contentService`
  - `listEntries(kind, prefix?)` (already exists)
  - `getEntrySource(kind, slug)` (already exists)
  - `extractToc(source)` (already exists)
- `sidebarService` (new)
  - `buildSidebarTree(entries, { baseHref, activeSlug })`:
    - Produces the same hierarchy Hugo displays.
    - Marks active node, and auto-expands ancestor folders.
  - `getSidebarFlat(entries)` only if needed (legacy compatibility).

### Controllers (route pages)
Route pages are responsible for:
- loading data (models) from the data layer
- deciding whether request is list vs detail
- passing the minimal data down to reusable view components

Example (portfolios):
- `src/app/portfolios/page.tsx` (controller)
  - `entries = listEntries("portfolios")`
  - render list view with shared layout shell
- `src/app/portfolios/[...slug]/page.tsx` (controller)
  - if leaf: load entry source + toc + all entries for sidebar
  - else: list entries under prefix and render list view

### Views (reusable components)
Create a shared page shell so all list/detail pages have the same structure:
- `AppShell` / `SiteLayout` (existing `layout.tsx`) for global header/footer
- `ContentShell` (new reusable layout component)
  - props: `{ sidebar, content, toc }`
  - renders `.wrapper` + `#sidebar-section` + `#content-section` + optional `#toc-section`
- `Sidebar` (new shared component)
  - renders the Hugo-like DOM/class/id structure
  - accepts `tree` + `kind` + `activeHref`
  - implements collapsible folders client-side (replacing Hugo’s icon toggles)
  - search box behavior:
    - For parity: keep the input but no filtering (matches shipped Hugo behavior), OR
    - Optional enhancement: filter sidebar nodes and/or cards (explicitly non-parity)
- `Toc` (shared)
  - renders `#TableOfContents` equivalent
- `ContentList` (shared)
  - renders card grid matching Hugo classes (`#post-card-holder`, `.post-card`, `.post-card-link`)
- `ContentDetail` (shared)
  - renders hero header, author/date/title/body matching Hugo structure

## Styling Strategy (Hybrid Hugo CSS → Tailwind later)
Goal: use the Vercel starter-kit Tailwind baseline as the primary styling system and migrate page-by-page.

Current approach:
- We are already on the Tailwind/starter-kit layout for global shell and major routes.
- Keep the Hugo site as a behavior/content reference, but do not reintroduce Hugo CSS globally (avoid global collisions).

Next steps:
- Stabilize responsive behavior (sidebar drawer, TOC visibility rules) and ensure accessibility (focus trapping, escape to close).
- Expand SEO defaults (metadata coverage, sitemap/robots) before deployment.

## Migration Steps (Action Plan)
### Phase 0 — Content Audit (Required)
Goal: document everything we already have (content + routes + assets) before adopting the new template.

Deliverables:
- A content inventory document:
  - Home page sections and their data sources
  - Portfolios index + nested folders + detail pages
  - Posts index + nested folders + detail pages
  - Image assets used by each section/page
- A “route map” for Hugo (what exists today), used as parity acceptance criteria.

Source of truth for audit:
- `hugo-public/` (rendered HTML) as the behavioral reference
- `src/content/profile.json` and `src/content/{posts,portfolios}/**.mdx` as the content sources we will migrate

### Phase 0.2 — Template Fit Check (Vercel Starter Kit)
Goal: ensure the Vercel template can satisfy our constraints before integrating.

Checklist:
- Works with static-first hosting (no required server-only features)
- Supports Markdown/MDX content and per-page metadata
- Allows custom routes for portfolios with nested folders
- Can host a left-sidebar navigation pattern (template may not include it by default)

Notes (repo alignment):
- We keep a local reference copy of Vercel examples under `_template/` for comparison only; it is excluded from TypeScript checks.
- Tailwind and PostCSS are added to the repo so we can adopt the starter kit styles incrementally while migrating routes.

### Phase 0.5 — Portfolios Search (Static, client-side)
Goal: add a working search for portfolios pages only (enhancement; Hugo’s shipped search input is present but not functional).

Build-time artifact:
- Generate a static index file (example): `public/search/portfolios.json`

Index format (example):
- `version`: string (to bust caches when format changes)
- `generatedAt`: ISO string
- `items`: array of:
  - `href`: string (e.g. `/portfolios/company-profile/natraco/`)
  - `title`: string
  - `summary`: string
  - `tags`: string[] (optional; can be derived later)
  - `bodyText`: string (plain text extracted from MDX body)

Generation rules:
- Source of truth stays as MDX in `src/content/portfolios/**.mdx`
- Extract `title/summary/date/hero` from frontmatter
- Extract `bodyText` by stripping markdown/MDX syntax and components into readable plain text
  - Keep this conservative (better to miss some formatting than include raw JSX/URLs)

Runtime behavior:
- Load `portfolios.json` only on portfolios list/detail pages (or on-demand when the search input is focused)
- Search scope: `title + summary + bodyText`
- Results behavior:
  - On list pages: filter the card grid as the user types
  - Optional: highlight matched terms in results (future enhancement)
  - Optional: filter the sidebar tree (future enhancement; not required)

Performance strategy:
- Keep index small: store plain text only; no HTML
- Lazy-load the JSON so it doesn’t affect home page performance
- If index grows large later, split by top-level folder (`company-profile`, etc.) or paginate results client-side

### Phase 1 — Layout Unification (Portfolios first)
- Introduce `ContentShell` so portfolio list + portfolio detail share the same structure.
- Introduce shared `Sidebar` component:
  - Implements the Hugo tree structure (folders + leaf entries)
  - Active highlighting + auto-expand ancestors
  - Collapsible folders (plus/minus icon)
- Swap both portfolios list and portfolios detail to use the same Sidebar component.

### Phase 1.5 — Adopt Vercel Starter Kit (Implementation Cutover)
Goal: rebase our UI on the Vercel Portfolio Starter Kit while preserving our content model and parity checklist.

Strategy:
- Bring the template in as the “outer shell” (layout, typography, metadata helpers).
- Keep our content loading and routing rules (posts/portfolios, nested slugs).
- Port features over incrementally (sidebar, TOC, card grid, search index) using parity checks.

### Phase 2 — Extend to Posts
- Reuse the same `ContentShell` and `Sidebar` for posts list/detail.
- Ensure posts sidebar content matches Hugo expectations (verify Hugo’s posts sidebar content; current Hugo output appears inconsistent).

### Phase 3 — Clean Up JS behaviors
- Replace remaining Hugo JS behaviors with React/Next equivalents:
  - sidebar/toc toggling on smaller breakpoints
  - smooth-scroll for hash links (home anchors)
- Remove any unused legacy JS that no longer applies.

### Phase 4 — Tailwind Migration (after parity)
- Convert inline styles to Tailwind utilities component-by-component:
  - Start with layout primitives (`ContentShell`, `Sidebar`, `Toc`, card grid).
  - Then migrate detail-page typography and spacing.
- Keep parity verification as a hard gate (compare against `hugo-public`).

### Phase 5 — Data & Content Improvements (optional)
- If desired, add actual search/filter behavior for list pages (cards and/or sidebar tree).
- Add tests/fixtures to ensure new behavior doesn’t regress parity.

## Acceptance Criteria (Definition of Done)
- **Portfolios list** matches Hugo:
  - sidebar on left, sticky, tree structure and labels match
  - folder expand/collapse and active state match
  - card grid matches (DOM classes + responsive behavior)
- **Portfolios detail** matches Hugo:
  - same sidebar tree, active highlighting, expanded parent folder
  - TOC matches headings and indentation
- CSS is stable: no page unexpectedly affected by unrelated CSS file load order.
- No broken routes (including nested folder lists like `/portfolios/company-profile/`).

## Notes / Decisions to Confirm
- Sidebar search: keep as non-functional for strict Hugo parity, or implement real filtering?
- HTML validity: keep Hugo’s `div.subtree` inside `ul.tree` for pixel parity, or normalize markup and adjust CSS?
