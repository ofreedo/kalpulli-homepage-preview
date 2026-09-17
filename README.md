# Kalpulli Ehecacoatl — Site Redesign

Static HTML/CSS/JS multi-page site redesign for **Kalpulli Ehecacoatl Danza y Cultura**, an indigenous Mexica dance and cultural preservation group based in Watsonville, CA. Built as a static prototype intended to be exported back into the group's live WordPress/Elementor site. Started as a single-file homepage prototype; as of the 8-page expansion, shared header/footer/fonts/seal-watermark/reveal-on-scroll CSS and JS live in `css/site.css` and `js/site.js`, linked by every page — see "Multi-page architecture" below before assuming `index.html`'s old single-file pattern still applies everywhere.

- **Live preview:** https://ofreedo.github.io/kalpulli-homepage-preview/
- **Repo:** https://github.com/ofreedo/kalpulli-homepage-preview (currently **public** — see Known Issues below)
- **Local dev:** plain static file server, no build step

## Running locally

No build tooling — plain HTML files, a shared CSS/JS pair, and local asset folders.

```bash
cd /Users/alfredoramirez/Desktop/Claude/kalpulli-homepage-preview
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Multi-page architecture

The site is now 8 pages: `index.html` (homepage) plus `about.html`, `book-us.html`, `contact.html`, `dia-de-muertos.html`, `donate.html`, `gallery.html`, `join-us.html`. All 8 link the same two shared files:

- `css/site.css` — fonts (`@font-face`), `:root` custom properties, base resets, header/nav/mobile-nav/hamburger, footer, buttons, the fixed seal watermark, section rhythm helpers (`.kicker`, `.section-title`, `.underline-accent`), the reveal-on-scroll motion system, and cross-page interior-page components: `.page-banner` (dark simplified hero for every non-homepage page), `.dark-section` (opaque `--ink` content block — **not** the homepage's `.meaning`, see below), `.cta-band` (solid red CTA strip), and `.ph-photo` (dashed-border placeholder for missing photography, with a `.dark-section .ph-photo` override so it stays legible on dark backgrounds instead of reading as muddy brown).
- `js/site.js` — the seal watermark visibility toggle, mobile hamburger nav open/close, and the shared `IntersectionObserver` reveal-on-scroll setup.

Both are versioned via a query string (`css/site.css?v=2`, `js/site.js?v=1`) — **bump the number on every page that links it whenever you edit the shared file**, or browsers will keep serving a stale cached copy indefinitely (hit this repeatedly during the build: edits looked like they weren't taking effect, page reloads and even plain query-string busting on the *page* URL didn't help, because browsers cache sub-resources by their own URL — only bumping the stylesheet's own `?v=N` forces a fresh fetch). If a change to `site.css`/`site.js` doesn't seem to be rendering, suspect this before assuming the CSS is wrong.

`index.html` alone keeps its own additional inline `<style>`/`<script>` for homepage-only sections that don't exist elsewhere: `.hero`/`.hero-video` (Vimeo background), `.meaning`/`.meaning-terms`/`.watermark-band` (Meaning of the Name), `.cards`/`.card` (Get Involved), `.quote-section`, `.highlights*` (the gallery carousel), `.banner*`/`.footer-banner`, plus the parallax/cursor-tracking JS and `syncWatermarkBandPosition` (both reference homepage-only elements).

**A real bug hit while building the first interior page, worth remembering:** the homepage's dark "Meaning of the Name" section uses `class="meaning"`, but `.meaning`'s actual background/layout CSS lives only in `index.html`'s own inline `<style>` block, not in `css/site.css` (correctly, since its grid layout and serpent-banner background are homepage-specific). Reusing `class="meaning"` on a new page pulls in none of that — the section renders with a **transparent background**, letting the fixed seal watermark bleed through unblocked and collide with the text. The fix was a separate, genuinely shared `.dark-section` class added to `site.css` — use that (not `.meaning`) for any dark opaque content block on interior pages.

## File structure

```
kalpulli-homepage-preview/
├── index.html               # homepage: HTML + homepage-only <style>/<script>, links css/site.css + js/site.js
├── about.html                # About Us: intro, Mission & Vision, Our Name, Board of Directors
├── book-us.html              # Book Us: services, booking considerations, past presentations
├── contact.html               # Contact Us: direct contacts (real phone numbers — see Known issues), FAQ, PR team
├── dia-de-muertos.html        # Día de Muertos Ceremony: about, event recap stats, altar glossary, donors
├── donate.html                 # Donate: placeholder only — source PDF (pdf-page-mockups/Donate.pdf) was empty
├── gallery.html                # Gallery: placeholder only — source PDF (pdf-page-mockups/Gallery.pdf) was empty
├── join-us.html                # Join Us: class schedule/location, member benefits (Temazcal, Workshops, Ceremonies)
├── css/
│   └── site.css              # shared CSS across all 8 pages — see "Multi-page architecture" above
├── js/
│   └── site.js               # shared JS across all 8 pages
├── pdf-page-mockups/          # client-supplied PDF content briefs, one per interior page (source material, not part of the live build)
├── fonts/                  # licensed brand fonts, self-hosted (project ROOT, not assets/fonts)
│   ├── Migra-Extrabold.otf       # headings, font-weight:800
│   ├── Migra-Extralight.otf      # quote block only, font-weight:200 italic
│   ├── GlacialIndifference-Bold.otf     # body/nav/buttons, font-weight:700
│   └── GlacialIndifference-Regular.otf  # body copy, font-weight:400
└── assets/
    ├── new_logo.png          # current official seal (transparent corners, 2000×2000px square) — header, footer, and fixed watermark on every page. Replaced the earlier logo_.webp mid-session.
    ├── 4-v2.png              # current "Meaning of the Name" banner artwork on the homepage — replaced scaled.webp mid-session (see the seal-watermark section below for the sizing/positioning saga that followed)
    ├── For_site.png         # transparent spiral/serpent cutout motif — tiled watermark texture, divider accents, card icons
    ├── startframe.png       # exact first frame of the hero Vimeo video, used as the poster/fallback image (prevents flash-of-mismatched-image on load)
    ├── drum-circle.jpg      # Free Danza Classes card + Book Us hero background + gallery slide
    ├── marigold-arch.jpg    # Día de Muertos card + hero fallback + gallery slide
    ├── Santa-Cruz-Dance-Week2026.png   # Presentations card + gallery slide
    ├── tedx-stage.jpg       # TEDx Mission College gallery slide
    ├── tandy-beal-stage.png # footer banner + gallery slide + Featured Performances
    ├── dia-de-muertos-1.png # Día de Muertos gallery slide + Dia de los Muertos page hero background
    ├── logo_.webp, scaled.webp, 4.png  # superseded assets, still on disk but no longer referenced — logo_.webp and scaled.webp were replaced by new_logo.png/4-v2.png; 4.png was a rejected revision of 4-v2.png (wrong aspect ratio, kept unused for reference)
    └── (additional dia-de-muertos-*.png variants may exist — not all are wired into any page yet)
```

**Important path note:** fonts live at `/fonts/*.otf` (project root), **not** `/assets/fonts/*.otf`. This was the source of a real bug earlier in development — the CSS `@font-face` rules pointed at the wrong path for a while, causing silent fallback to Playfair Display/Figtree. If fonts ever look wrong again, check this first. Note `css/site.css` itself lives one directory level deeper than `index.html`, so its own `@font-face`/`background-image` `url()` paths are `../fonts/...` and `../assets/...` — a deliberate, necessary difference from the paths used inside `index.html`'s own inline `<style>`, not an inconsistency to "fix."

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
5. **Meaning of the Name** (`.meaning`) — dark solid section, serpent banner background (`4-v2.png`, superseded the earlier `scaled.webp`), the three name-meaning terms (Kalpulli/Ehecatl/Coatl).
6. **Healthy Change in the Community** (`Get Involved`) — asymmetric 3-card grid (one large feature card + two stacked), real photos, spiral-glyph icons rotated per card.
7. **Quote** (`"La danza es la oración del cuerpo."`) — solid red section, breathing-pulse animation on the text.
8. **Get the Highlights** — Apple "Get the Highlights" style gallery: 6 real-photo slides, auto-advancing timed dot-nav with progress-fill pills, play/pause/replay button, pauses when scrolled off-screen.
9. **Footer banner** — full-bleed photo with tagline overlay.
10. **Footer** — solid dark, contact info, nav links, social.

## The fixed seal watermark (current, fragile state — read before touching)

There's a `position:fixed` rotating seal (`#sealWatermark`, built from `new_logo.png`, superseded the earlier `logo_.webp`) present on **every page** (its visibility logic lives in `js/site.js`, shared, not homepage-only) that's meant to be visible behind the page from the Meaning section onward on the homepage, and from page-load onward on interior pages. Both behaviors come from the same shared code: `js/site.js` gates visibility on `!sealMeaningSection || sealMeaningSection.getBoundingClientRect().bottom <= 0` — on the homepage `sealMeaningSection` resolves to the real `.meaning` element, so that clause requires scrolling past it; on interior pages, which have no `.meaning` element at all, `sealMeaningSection` is `null` and `!sealMeaningSection` short-circuits to `true` immediately, so the gate is trivially satisfied from page-load. This went through several iterations and the current behavior is:

- **Visible (opacity `.5`) at full strength in plain cream sections** — Mission, Get Involved, Get the Highlights. The base `section{}` rule no longer sets its own `background` (the old `rgba(247,244,239,0.9)` tint was removed) — sections are transparent by default and inherit `body`'s `--cream` fill, so the seal paints unblended wherever it's allowed to show, per explicit user request after comparing the diluted vs. full-strength look. (The two-tone look of the seal artwork itself — solid red ring vs. lighter black/gray glyph — was raised as a possible follow-up but the user chose to leave the source image untouched.)
- **Fully hidden inside color-block sections** — `.meaning` (dark), `.quote-section` (red), `footer` (dark), and the hero all have their own solid/opaque backgrounds — the seal does **not** show through these, by explicit user request after it was found to visually collide with text in the Meaning section.
- **Gated on two conditions, both checked on every scroll tick:**
  1. **Past the "Meaning of the Name" section.** The seal is the same serpent glyph explained in that section, so it's deliberately held back until `.meaning`'s `getBoundingClientRect().bottom <= 0` (i.e. fully scrolled off the top) — revealing it earlier (e.g. behind the Mission heading) played as visual noise before the visitor has any context for what the symbol means. It re-hides if the user scrolls back above that point.
  2. **A cream section is actually behind the seal's fixed screen position.** An earlier version toggled visibility once when `window.scrollY` crossed a single marker div (`data-seal-reveal-start`). That caused a real, reproducible bug: because the seal is `position:fixed` at a constant point on screen, the marker-crossing moment did not line up with a cream section actually occupying that screen position — the seal would flip "on" while a dark/opaque section was still visually covering it, only becoming visible a bit later once cream content scrolled into that exact spot. Fixed by checking, on every scroll tick, whether any `[data-seal-cream]` section's `getBoundingClientRect()` currently spans the seal's fixed vertical center (`window.innerHeight / 2`) — an allowlist, not a blacklist of known-opaque sections, specifically so a new section added later defaults to hidden instead of silently leaking the watermark.
- **Performance note (iOS Safari jank, fixed):** the visibility check originally used `document.elementFromPoint()` instead of the geometry math above. It gave identical results but forces a synchronous layout on every call — running that on every rAF tick during a scroll gesture (potentially 60-120+ times per fling) caused visible stutter on iOS Safari once scrolling reached the point where the seal starts toggling. Switched to plain `getBoundingClientRect()` range checks against the (currently 3) `[data-seal-cream]` sections, which reads layout without forcing it. Also added `animation-play-state:paused` on `.seal-watermark img` (running only while `.is-visible`, line ~164) so the 90s `sealSpin` rotation isn't running for the entire page lifetime on a `position:fixed` layer before the user has even scrolled to it — one more thing competing with the compositor during scroll. If new jank ever shows up again on iOS specifically, suspect scroll-handler DOM reads first (`getBoundingClientRect`/`elementFromPoint`/`offsetTop` etc. all force layout if called after a style write in the same frame).
  
  Both conditions are ANDed together in `updateSealVisibility()` in `js/site.js` (search for `sealMeaningSection`) — the old `data-seal-reveal-start` marker div is gone, replaced by a direct reference to `.meaning`, which resolves to `null` (and therefore trivially "passes") on any page without a `.meaning` section — see "Multi-page architecture" above for why that's correct on interior pages, not a bug.
- **Known engine quirk (already fixed, don't reintroduce):** the seal element is split into an outer `<div class="seal-watermark">` (handles `position:fixed` + opacity transition) wrapping an inner `<img>` (handles the continuous `sealSpin` rotation animation). Combining an `infinite` CSS animation and a separate opacity transition on the *same* element caused the opacity to be silently stuck at 0, even when force-set inline — this was a real, reproducible bug, not a red herring. Keep them on separate elements.

## Known issues / open items

- **Repo is public**, but `fonts/*.otf` are commercial licensed files (Migra, Glacial Indifference), and `contact.html` now contains two real personal cell phone numbers (group representatives). Both are a real exposure concern on a public repo — the original plan was a **private** repo + Netlify deploy (Netlify supports deploying from private repos on free tiers; GitHub Pages does not). This was never resolved, and the phone numbers were added anyway per explicit user confirmation (asked twice, given the public-repo status) — revisit before wider distribution.
- Migra is only licensed in Extrabold (800) and Extralight (200) — there is no mid-weight. Every heading uses 800 except the quote block (200 italic, browser-synthesized oblique since there's no real italic file).
- Internal navigation is fully wired — homepage nav (desktop + mobile), hero CTAs, Get Involved card buttons, footer "Get In Touch" links, and every interior page's own header/footer/CTA all point to real pages. What's still `#`: social media icons/links (no real Facebook/Instagram URLs provided), and the footer's "Privacy Notice"/"User Agreement" links (no such pages exist or were requested).
- **`donate.html` and `gallery.html` are placeholder-only pages** — their source PDFs (`pdf-page-mockups/Donate.pdf`, `Gallery.pdf`) were completely empty (no text, no images). Both ship with an honest "page in progress" notice rather than invented content; replace once real content/photos are supplied.
- Every photo placeholder across the 6 new interior pages (`.ph-photo`) is a labeled dashed-border box, not a real image — About Us (4 photos + 9 board member headshots), Book Us (2 past-presentation photos), Contact (1 photo + 2 rep photos + 3 PR team photos), Dia de Muertos (1 altar photo + 4 moment photos), Join Us (3 benefit-card photos), Donate/Gallery (placeholder grids). All need real photography before this goes further than a prototype.
- Card copy in a few places is still scaffold-quality, written by the assistant to fill space rather than sourced from the client — flag for review before treating as final copy. This also applies to some section headings/framing on the 6 new interior pages, which restructure the PDF content into the site's section-based visual language rather than reproducing the PDFs verbatim.
- **The eventual goal is exporting this design back into WordPress/Elementor** (the group's real site runs on Elementor) — this static file is a design reference, not the final deliverable. No Elementor-specific conversion work has started yet, and the new shared-CSS/JS multi-page structure (vs. the homepage's original single-file pattern) will need its own translation strategy for Elementor's page/template model.

## Environment quirks (matters for whoever continues this)

- The **Bash tool has been completely broken across every session** in this environment (proxy communication failure on every command, including trivial ones like `echo`). All file moves, `git` commands, and `mkdir`/`cp` had to be handed to the user to run themselves in their own Terminal — including starting/restarting the local `python3 -m http.server 8080` dev server, which the assistant cannot do itself.
- The **in-app browser preview pane has a recurring stale-screenshot bug** — `computer{action:"screenshot"}` frequently returns a frame from *before* the most recent scroll or DOM change, especially right after `scrollTo()` or `location.reload()`. This was hit dozens of times across sessions. The reliable workaround: verify state via `javascript_tool` (`getComputedStyle`, `getBoundingClientRect`, class checks) rather than trusting screenshots, and when a screenshot is genuinely needed, wait 1-2s after any scroll/reload before capturing.
- The **browser preview pane's `file://` mode is unreliable for this project** — opening a local file directly (rather than through the `http.server`) sometimes silently rewrites the document into a `data:` URL, breaking every relative asset path (`assets/*.png` 404s, `naturalWidth` reads `0` even though `complete` is `true`). This caused a real debugging detour once (looked exactly like a JS positioning bug, was actually the watermark image never loading in that broken preview mode). Always verify against `http://localhost:8080` — don't trust a `file://` tab's rendering or measurements for anything beyond the crudest sanity check.
- **Browsers cache `<link>`/`<script>`-loaded sub-resources by their own URL, independent of the parent page.** Repeatedly edited `css/site.css` mid-session and kept seeing the old version rendered, even after reloading the page, navigating in a brand-new tab, and adding a cache-busting query string to the *page* URL — none of that busts the cache on the *stylesheet's own* URL. The only fix that worked: append/bump a version query string directly on the `<link>`/`<script>` tag itself (`css/site.css?v=2`). Every page now does this — see "Multi-page architecture" above. If a CSS/JS edit doesn't seem to be taking effect, bump the version number before assuming the code is wrong.
