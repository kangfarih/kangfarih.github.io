# Content Audit (Hugo → Next.js)

Goal: document current content and route structure from `hugo-public/` before migrating to the Vercel Portfolio Starter Kit.

## Sources of Truth
- Rendered baseline: `hugo-public/` (HTML/CSS/JS behavior reference)
- Structured home data: [profile.json](file:///Users/appfuxion/repo/kangfarih.github.io/src/content/profile.json)
- MDX content:
  - `src/content/portfolios/**.mdx`
  - `src/content/posts/**.mdx`

## Home Page (`/`)
Primary data source: [profile.json](file:///Users/appfuxion/repo/kangfarih.github.io/src/content/profile.json)

### Home Section → Data Mapping (profile.json)
Use this as the migration map when wiring Vercel Portfolio Starter Kit components to our existing content.

| Section | Source keys |
|---|---|
| Hero | `greeting`, `name`, `designation`, `taglines`, `homeBackgroundRules`, `authorImage` |
| About | `aboutMarkdown`, `resumeUrl`, `socials` |
| Soft Skills | `softSkills` |
| Skills | `skills` |
| Experiences | `experiences` |
| Projects (filters) | `projectFilters` |
| Projects (cards) | `projects` |
| Recent Posts | `recentPosts` |
| Footer | `lastUpdate` |

**Hero**
- Greeting: `Hi, I am Farih`
- Name: `Farih Muhammad`
- Designation: `Front End Engineer`
- Taglines: 5 rotating lines
- Background image set: 5 responsive variants (`homeBackgroundRules`)
- Author image: `authorImage`

**About**
- About text: `aboutMarkdown`
- Resume link: `resumeUrl`
- Social links: 4 (`mail`, GitHub, GitLab, LinkedIn)
- Soft skills: 6 circular items (100% each)

**Skills**
- Count: 9 skill cards
- Each skill has: `name`, `logo`, `url`, `summary`

**Experiences**
- Count: 5 entries
- Snapshot:
  - Front End Engineer — PT Appfuxion Consulting Indonesia (May 2023 - Present, Jakarta, Indonesia)
  - Front End Developer — Creatella Venture (Apr 2021 - Apr 2023, Singapore - Remote)
  - Front End Engineer — Plexus Studio (Mar 2018 - Aug 2020, Bandung)
  - Front End Programmer — Gema Cipta Piranti (March 2016 - May 2017, Bandung)
  - Front End Freelance — Freelancer (Aug 2020 - Apr 2021, Remote)

**Projects**
- Filters: 5 filter buttons
- Count: 9 project cards
- Each project has: `title`, `logo`, `role`, `timeline`, `url`, `repo`, `tags`, `summary`

**Recent Posts**
- Count: 3 cards (these currently point to portfolio URLs)
  - `/portfolios/myslife-mobile-app/` (May 6, 2023)
  - `/portfolios/profile-web/` (January 31, 2021)
  - `/portfolios/web-admin-template/` (June 1, 2020)

## Portfolios (`/portfolios/…`)
Primary content sources:
- MDX: `src/content/portfolios/**.mdx`
- Baseline HTML: `hugo-public/portfolios/**`

### Route Structure
- Index list: `/portfolios/`
- Nested folder list: `/portfolios/company-profile/`
- Detail pages: `/portfolios/<slug>/` and `/portfolios/<folder>/<slug>/`

### Content Inventory
Total portfolio pages: 12

**Top-level portfolios (8)**
- `/portfolios/ar-mobile-apps/` — Mobile Augmented Reality
- `/portfolios/casual-game-prototype/` — Casual Game Prototype
- `/portfolios/encrypted-audio-player/` — Encrypted Audio
- `/portfolios/interactive-web-video/` — Interactive Web Video
- `/portfolios/myslife-mobile-app/` — MySlife - Mobile App
- `/portfolios/profile-web/` — Profile Website
- `/portfolios/ragasukma-comic/` — Ragasukma Comic App
- `/portfolios/web-admin-template/` — General Admin Template

**Folders (1)**
- `/portfolios/company-profile/` (4 children)
  - `/portfolios/company-profile/8villages/` — 8Villages Website
  - `/portfolios/company-profile/indessota/` — Indessota
  - `/portfolios/company-profile/natraco/` — Natraco Website
  - `/portfolios/company-profile/vdp/` — VDP Website

### Per-page Metadata (Frontmatter)
Each MDX page provides (varies by page):
- `title`
- `date`
- `summary`
- `hero` (image path under `/portfolios/...`)

### Detail Page Content Pattern (Portfolios)
Observed across `src/content/portfolios/**.mdx` and baseline `hugo-public/portfolios/**`:
- Most portfolio detail pages use consistent H3 sections: `Overview`, `Role`, and (usually) `Footage`.
- The Table of Contents in Hugo is derived from these headings.
- 11/12 portfolio pages embed video using `<ResponsiveIframe ... />` (MDX component). `Profile Website` is the only one without it.

| Href | Title | Section Headings (H3) | Has ResponsiveIframe |
|---|---|---|---|
| /portfolios/ar-mobile-apps/ | Mobile Augmented Reality | Overview, Role, Footage | Yes |
| /portfolios/casual-game-prototype/ | Casual Game Prototype | Overview, Role, Footage | Yes |
| /portfolios/company-profile/8villages/ | 8Villages Website | Overview, Role, Footage | Yes |
| /portfolios/company-profile/indessota/ | Indessota | Overview, Role, Footage | Yes |
| /portfolios/company-profile/natraco/ | Natraco Website | Overview, Role, Footage | Yes |
| /portfolios/company-profile/vdp/ | VDP Website | Overview, Role, Footage | Yes |
| /portfolios/encrypted-audio-player/ | Encrypted Audio | Overview, Role, Footage | Yes |
| /portfolios/interactive-web-video/ | Interactive Web Video | Overview, Role, Footage | Yes |
| /portfolios/myslife-mobile-app/ | MySlife - Mobile App | Overview, Role, Footage | Yes |
| /portfolios/profile-web/ | Profile Website | Overview, Role | No |
| /portfolios/ragasukma-comic/ | Ragasukma Comic App | Overview, Role, Footage | Yes |
| /portfolios/web-admin-template/ | General Admin Template | Overview, Role, Footage | Yes |

### Frontmatter Table (Portfolios)
| Href | Title | Date | Hero | Summary |
| --- | --- | --- | --- | --- |
| /portfolios/ar-mobile-apps/ | Mobile Augmented Reality | January 6, 2020 | /portfolios/ar-mobile-apps/hero.jpg | An augmented reality apps as simulator of First4Figures products. This the project that I am working in when I was a pa… |
| /portfolios/casual-game-prototype/ | Casual Game Prototype | February 6, 2020 | /portfolios/casual-game-prototype/hero.jpg | The project goal is to build casual game prototype. It's when I was part of Plexus.id Team, and being Front End Program… |
| /portfolios/company-profile/8villages/ | 8Villages Website | May 6, 2019 | /portfolios/company-profile/8villages/hero.jpg | A website for company profile that I work with whe I was part of Plexus.id team. All of the apps made for web and build… |
| /portfolios/company-profile/indessota/ | Indessota | May 6, 2019 | /portfolios/company-profile/indessota/hero.jpg | A website for company profile that I work with whe I was part of Plexus.id team. All of the apps made for web and build… |
| /portfolios/company-profile/natraco/ | Natraco Website | May 6, 2019 | /portfolios/company-profile/natraco/hero.jpg | A website for company profile that I work with whe I was part of Plexus.id team. All of the apps made for web and build… |
| /portfolios/company-profile/vdp/ | VDP Website | March 1, 2019 | /portfolios/company-profile/vdp/hero.jpg | I build a company profile website as a freelance side job. All of the apps made for web and build with plain web and jq… |
| /portfolios/encrypted-audio-player/ | Encrypted Audio | January 6, 2019 | /portfolios/encrypted-audio-player/hero.jpg | This is a project about an audio player with encrypted data to play. I am building as a freelancer two similar applicat… |
| /portfolios/interactive-web-video/ | Interactive Web Video | April 6, 2020 | /portfolios/interactive-web-video/hero.jpg | The project is about a web player with clickable tag. I am working this as a freelancer for DreamTechnology. All of the… |
| /portfolios/myslife-mobile-app/ | MySlife - Mobile App | May 6, 2023 | /portfolios/myslife-mobile-app/hero.png | A mobile app of MySLife products. This the project that I am working in when I was a part of Creatella Team. There are … |
| /portfolios/profile-web/ | Profile Website | January 31, 2021 | /portfolios/profile-web/hero.png | A personal project to create profile and portfolio web. Also to post something related to project and professional matt… |
| /portfolios/ragasukma-comic/ | Ragasukma Comic App | March 1, 2020 | /portfolios/ragasukma-comic/hero.jpg | A mobile apps for reading and buy a comic made by Ragasukma. I was doing the project when still being part of Plexus.id… |
| /portfolios/web-admin-template/ | General Admin Template | June 1, 2020 | /portfolios/web-admin-template/hero.png | This project is made to demonstrate my experince from build an admin website. when I was a part of Plexus.id Team. It w… |

### Behavior Notes (Baseline Hugo)
- Left sidebar is the primary navigation on portfolios routes.
- Sidebar contains a tree with collapsible folder (`Company Profile`) and active highlighting on detail pages.
- Detail pages include a right-side Table of Contents derived from headings in the content.

## Posts (`/posts/…`)
Primary content sources:
- MDX: `src/content/posts/**.mdx`
- Baseline HTML: `hugo-public/posts/**`

Notes:
- The MDX structure mirrors portfolios (including a `company-profile` folder).
- Some Hugo output pages may show inconsistencies in sidebar labels; treat `hugo-public` as behavioral reference and `src/content/posts` as content truth.

### Detail Page Content Pattern (Posts)
Observed across `src/content/posts/**.mdx` and baseline `hugo-public/posts/**`:
- Posts mirror the portfolio detail structure and use consistent H3 sections: `Overview`, `Role`, and (usually) `Footage`.
- The Table of Contents in Hugo is derived from these headings.
- 11/12 posts embed video using `<ResponsiveIframe ... />` (MDX component). `Profile Website` is the only one without it.

| Href | Title | Section Headings (H3) | Has ResponsiveIframe |
|---|---|---|---|
| /posts/ar-mobile-apps/ | Mobile Augmented Reality | Overview, Role, Footage | Yes |
| /posts/casual-game-prototype/ | Casual Game Prototype | Overview, Role, Footage | Yes |
| /posts/company-profile/8villages/ | 8Villages Website | Overview, Role, Footage | Yes |
| /posts/company-profile/indessota/ | Indessota | Overview, Role, Footage | Yes |
| /posts/company-profile/natraco/ | Natraco Website | Overview, Role, Footage | Yes |
| /posts/company-profile/vdp/ | VDP Website | Overview, Role, Footage | Yes |
| /posts/encrypted-audio-player/ | Encrypted Audio | Overview, Role, Footage | Yes |
| /posts/interactive-web-video/ | Interactive Web Video | Overview, Role, Footage | Yes |
| /posts/myslife-mobile-app/ | MySlife - Mobile App | Overview, Role, Footage | Yes |
| /posts/profile-web/ | Profile Website | Overview, Role | No |
| /posts/ragasukma-comic/ | Ragasukma Comic App | Overview, Role, Footage | Yes |
| /posts/web-admin-template/ | General Admin Template | Overview, Role, Footage | Yes |

### Frontmatter Table (Posts)
| Href | Title | Date | Hero | Summary |
| --- | --- | --- | --- | --- |
| /posts/ar-mobile-apps/ | Mobile Augmented Reality | January 6, 2020 | /posts/ar-mobile-apps/hero.jpg | An augmented reality apps as simulator of First4Figures products. This the project that I am working in when I was a pa… |
| /posts/casual-game-prototype/ | Casual Game Prototype | February 6, 2020 | /posts/casual-game-prototype/hero.jpg | The project goal is to build casual game prototype. It's when I was part of Plexus.id Team, and being Front End Program… |
| /posts/company-profile/8villages/ | 8Villages Website | May 6, 2019 | /posts/company-profile/8villages/hero.jpg | A website for company profile that I work with whe I was part of Plexus.id team. All of the apps made for web and build… |
| /posts/company-profile/indessota/ | Indessota | May 6, 2019 | /posts/company-profile/indessota/hero.jpg | A website for company profile that I work with whe I was part of Plexus.id team. All of the apps made for web and build… |
| /posts/company-profile/natraco/ | Natraco Website | May 6, 2019 | /posts/company-profile/natraco/hero.jpg | A website for company profile that I work with whe I was part of Plexus.id team. All of the apps made for web and build… |
| /posts/company-profile/vdp/ | VDP Website | March 1, 2019 | /posts/company-profile/vdp/hero.jpg | I build a company profile website as a freelance side job. All of the apps made for web and build with plain web and jq… |
| /posts/encrypted-audio-player/ | Encrypted Audio | January 6, 2019 | /posts/encrypted-audio-player/hero.jpg | This is a project about an audio player with encrypted data to play. I am building as a freelancer two similar applicat… |
| /posts/interactive-web-video/ | Interactive Web Video | April 6, 2020 | /posts/interactive-web-video/hero.jpg | The project is about a web player with clickable tag. I am working this as a freelancer for DreamTechnology. All of the… |
| /posts/myslife-mobile-app/ | MySlife - Mobile App | May 6, 2023 | /posts/myslife-mobile-app/hero.png | A mobile app of MySLife products. This the project that I am working in when I was a part of Creatella Team. There are … |
| /posts/profile-web/ | Profile Website | January 31, 2021 | /posts/profile-web/hero.png | A personal project to create profile and portfolio web. Also to post something related to project and professional matt… |
| /posts/ragasukma-comic/ | Ragasukma Comic App | March 1, 2020 | /posts/ragasukma-comic/hero.jpg | A mobile apps for reading and buy a comic made by Ragasukma. I was doing the project when still being part of Plexus.id… |
| /posts/web-admin-template/ | General Admin Template | June 1, 2020 | /posts/web-admin-template/hero.png | This project is made to demonstrate my experince from build an admin website. when I was a part of Plexus.id Team. It w… |

## Asset Notes
- Home hero background images: under `/images/star-background*.jpg`
- Author image: under `/images/author/…`
- Portfolio hero images: under `/portfolios/<slug>/hero.*` or `/portfolios/<folder>/<slug>/hero.*`
