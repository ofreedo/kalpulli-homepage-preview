# Kalpulli Ehecacoatl — Homepage Redesign

Static HTML/CSS/JS homepage redesign for **Kalpulli Ehecacoatl Danza y Cultura**, an indigenous Mexica dance and cultural preservation group based in Watsonville, CA. Built as a single-file static prototype intended to be exported back into the group's live WordPress/Elementor site.

- **Live preview:** https://ofreedo.github.io/kalpulli-homepage-preview/
- **Repo:** https://github.com/ofreedo/kalpulli-homepage-preview (currently **public** — see Known Issues below)
- **Local dev:** plain static file server, no build step

## Running locally

No build tooling — it's one HTML file with embedded CSS/JS plus local asset folders.

```bash
cd /Users/alfredoramirez/Desktop/Claude/kalpulli-homepage-preview
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## File structure

```
kalpulli-homepage-preview/
├── index.html              # entire site: HTML + <style> + <script>, no build step
├── fonts/                  # licensed brand fonts, self-hosted (project ROOT, not assets/fonts)
│   ├── Migra-Extrabold.otf       # headings, font-weight:800
│   ├── Migra-Extralight.otf      # quote block only, font-weight:200 italic
│   ├── GlacialIndifference-Bold.otf     # body/nav/buttons, font-weight:700
│   └── GlacialIndifference-Regular.otf  # body copy, font-weight:400
└── assets/
    ├── logo_.webp           # official circular seal (Kalpulli Ehecacoatl serpent glyph) — used in header, footer, and as the fixed rotating watermark
    ├── For_site.png         # transparent spiral/serpent cutout motif — tiled watermark texture, divider accents, card icons
    ├── scaled.webp          # wide two-headed-serpent banner artwork — background of the "Meaning of the Name" section
    ├── startframe.png       # exact first frame of the hero Vimeo video, used as the poster/fallback image (prevents flash-of-mismatched-image on load)
    ├── drum-circle.jpg      # Free Danza Practices card + gallery slide
    ├── marigold-arch.jpg    # Día de Muertos card + hero fallback + gallery slide
    ├── Santa-Cruz-Dance-Week2026.png   # Presentations card + gallery slide
    ├── tedx-stage.jpg       # TEDx Mission College gallery slide
    ├── tandy-beal-stage.png # footer banner + gallery slide + Featured Performances
    ├── dia-de-muertos-1.png # Día de Muertos gallery slide (skull-paint dancer, offering vessel)
    └── (additional dia-de-muertos-*.png variants may exist — not all are wired into index.html yet)
```

**Important path note:** fonts live at `/fonts/*.otf` (project root), **not** `/assets/fonts/*.otf`. This was the source of a real bug earlier in development — the CSS `@font-face` rules pointed at the wrong path for a while, causing silent fallback to Playfair Display/Figtree. If fonts ever look wrong again, check this first.

## Brand system

- **Colors:** `--red:#BC2217` (brick red), `--ink:#2b2b2b` (near-black), `--cream:#F7F4EF` (off-white), all defined as CSS custom properties at the top of `index.html`.
- **Fonts:** Migra (serif, headings only, weight 800 except the quote block at weight 200 italic) + Glacial Indifference (sans, everything else, weights 400/700 only — there is no 500/600 file, don't reference those weights).
- **Name meaning (drives content + motion themes throughout):** *Kalpulli* = a learning community / place of ceremonial gathering. *Ehecatl* = wind — first breath at birth, life-giving rain. *Coatl* = serpent — movement, transformation, knowledge. The tagline **"Moving with the wind, grounded in tradition"** is a direct translation of the group's name and is used as the hero headline.
- **Motion system:** parallax (Ehecatl/wind), staggered reveal-on-scroll (Kalpulli/gathering), self-drawing underline accents (Coatl/serpent — an SVG path with `stroke-dashoffset` animation).

## Section-by-section map (top to bottom)

1. **Fixed header** — logo, nav, hamburger menu on mobile (`<900px`), Donate button. Header height is synced to `.hero`'s top offset via JS (`syncHeaderOffset()`) so it never drifts if the logo wraps to more lines.
2. **Mobile nav** — slide-in panel from the right, dark scrim, closes on link click / Escape / outside click.
3. **Hero** — full-bleed Vimeo background video (id `1213705488`), `startframe.png` as poster to avoid a flash before the video paints, cursor-reactive parallax, staggered text entrance on load.
4. **Mission & Vision** — plain cream section, tiled spiral watermark texture.
5. **Meaning of the Name** (`.meaning`) — dark solid section, serpent banner background (`scaled.webp`), the three name-meaning terms (Kalpulli/Ehecatl/Coatl).
6. **Healthy Change in the Community** (`Get Involved`) — asymmetric 3-card grid (one large feature card + two stacked), real photos, spiral-glyph icons rotated per card.
7. **Quote** (`"La danza es la oración del cuerpo."`) — solid red section, breathing-pulse animation on the text.
8. **Get the Highlights** — Apple "Get the Highlights" style gallery: 6 real-photo slides, auto-advancing timed dot-nav with progress-fill pills, play/pause/replay button, pauses when scrolled off-screen.
9. **Footer banner** — full-bleed photo with tagline overlay.
10. **Footer** — solid dark, contact info, nav links, social.

## The fixed seal watermark (current, fragile state — read before touching)

There's a `position:fixed` rotating seal (`#sealWatermark`, built from `logo_.webp`) that's meant to be visible behind the page from the Meaning section onward. This went through several iterations this session and the current behavior is:

- **Visible (opacity `.5`) at full strength in plain cream sections** — Mission, Get Involved, Get the Highlights. The base `section{}` rule no longer sets its own `background` (the old `rgba(247,244,239,0.9)` tint was removed) — sections are transparent by default and inherit `body`'s `--cream` fill, so the seal paints unblended wherever it's allowed to show, per explicit user request after comparing the diluted vs. full-strength look. (The two-tone look of the seal artwork itself — solid red ring vs. lighter black/gray glyph — was raised as a possible follow-up but the user chose to leave the source image untouched.)
- **Fully hidden inside color-block sections** — `.meaning` (dark), `.quote-section` (red), `footer` (dark), and the hero all have their own solid/opaque backgrounds — the seal does **not** show through these, by explicit user request after it was found to visually collide with text in the Meaning section.
- **Gated on two conditions, both checked on every scroll tick:**
  1. **Past the "Meaning of the Name" section.** The seal is the same serpent glyph explained in that section, so it's deliberately held back until `.meaning`'s `getBoundingClientRect().bottom <= 0` (i.e. fully scrolled off the top) — revealing it earlier (e.g. behind the Mission heading) played as visual noise before the visitor has any context for what the symbol means. It re-hides if the user scrolls back above that point.
  2. **A cream section is actually behind the seal's fixed screen position.** An earlier version toggled visibility once when `window.scrollY` crossed a single marker div (`data-seal-reveal-start`). That caused a real, reproducible bug: because the seal is `position:fixed` at a constant point on screen, the marker-crossing moment did not line up with a cream section actually occupying that screen position — the seal would flip "on" while a dark/opaque section was still visually covering it, only becoming visible a bit later once cream content scrolled into that exact spot. Fixed by checking, on every scroll tick, whether any `[data-seal-cream]` section's `getBoundingClientRect()` currently spans the seal's fixed vertical center (`window.innerHeight / 2`) — an allowlist, not a blacklist of known-opaque sections, specifically so a new section added later defaults to hidden instead of silently leaking the watermark.
- **Performance note (iOS Safari jank, fixed):** the visibility check originally used `document.elementFromPoint()` instead of the geometry math above. It gave identical results but forces a synchronous layout on every call — running that on every rAF tick during a scroll gesture (potentially 60-120+ times per fling) caused visible stutter on iOS Safari once scrolling reached the point where the seal starts toggling. Switched to plain `getBoundingClientRect()` range checks against the (currently 3) `[data-seal-cream]` sections, which reads layout without forcing it. Also added `animation-play-state:paused` on `.seal-watermark img` (running only while `.is-visible`, line ~164) so the 90s `sealSpin` rotation isn't running for the entire page lifetime on a `position:fixed` layer before the user has even scrolled to it — one more thing competing with the compositor during scroll. If new jank ever shows up again on iOS specifically, suspect scroll-handler DOM reads first (`getBoundingClientRect`/`elementFromPoint`/`offsetTop` etc. all force layout if called after a style write in the same frame).
  
  Both conditions are ANDed together in `updateSealVisibility()` (in the `<script>` block, search for `sealMeaningSection`) — the old `data-seal-reveal-start` marker div is gone, replaced by a direct reference to `.meaning`.
- **Known engine quirk (already fixed, don't reintroduce):** the seal element is split into an outer `<div class="seal-watermark">` (handles `position:fixed` + opacity transition) wrapping an inner `<img>` (handles the continuous `sealSpin` rotation animation). Combining an `infinite` CSS animation and a separate opacity transition on the *same* element caused the opacity to be silently stuck at 0, even when force-set inline — this was a real, reproducible bug, not a red herring. Keep them on separate elements.

## Known issues / open items

- **Repo is public**, but `fonts/*.otf` are commercial licensed files (Migra, Glacial Indifference). They are currently pushed to a public repo, which is a license concern — the original plan was a **private** repo + Netlify deploy (Netlify supports deploying from private repos on free tiers; GitHub Pages does not). This was never resolved — revisit before wider distribution.
- Migra is only licensed in Extrabold (800) and Extralight (200) — there is no mid-weight. Every heading uses 800 except the quote block (200 italic, browser-synthesized oblique since there's no real italic file).
- Some `dia-de-muertos-*.png` files exist in `assets/` (confirmed via GitHub API listing) that aren't referenced in `index.html` — could be additional gallery slide candidates.
- No real destination links yet — nav items, "Learn More" / "Book Us" / "Join Us" buttons all point to `#`. This needs real URLs (or real WordPress page slugs) before going further than a visual prototype.
- Card copy in a few places is still scaffold-quality, written by the assistant to fill space rather than sourced from the client — flag for review before treating as final copy.
- **The eventual goal is exporting this design back into WordPress/Elementor** (the group's real site runs on Elementor) — this static file is a design reference, not the final deliverable. No Elementor-specific conversion work has started yet.

## Environment quirks (matters for whoever continues this)

- The **Bash tool has been completely broken all session** in this environment (proxy communication failure on every command, including trivial ones like `echo`). All file moves, `git` commands, and `mkdir`/`cp` had to be handed to the user to run themselves in their own Terminal.
- The **in-app browser preview pane has a recurring stale-screenshot bug** — `computer{action:"screenshot"}` frequently returns a frame from *before* the most recent scroll or DOM change, especially right after `scrollTo()` or `location.reload()`. This was hit dozens of times this session. The reliable workaround: verify state via `javascript_tool` (`getComputedStyle`, `getBoundingClientRect`, class checks) rather than trusting screenshots, and when a screenshot is genuinely needed, wait 1-2s after any scroll/reload before capturing.
