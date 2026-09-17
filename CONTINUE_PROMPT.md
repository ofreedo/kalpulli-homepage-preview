I'm continuing work on a homepage redesign for Kalpulli Ehecacoatl Danza y Cultura, an indigenous Mexica dance and cultural group in Watsonville, CA. This is a static HTML prototype meant to eventually be exported into their live WordPress/Elementor site.

**Start by reading `/Users/alfredoramirez/Desktop/Claude/kalpulli-homepage-preview/README.md`** — it documents the full file structure, brand system, section-by-section layout, and several fragile/already-debugged pieces (font paths, the fixed seal watermark's opacity behavior, a real CSS animation+transition conflict bug). Don't re-derive any of that from scratch; it's already written up.

## Key paths

- Main file (everything lives in one file — HTML + `<style>` + `<script>`, no build step): `/Users/alfredoramirez/Desktop/Claude/kalpulli-homepage-preview/index.html`
- Fonts (project root, **not** `assets/fonts` — that path doesn't exist and was a real bug earlier): `/Users/alfredoramirez/Desktop/Claude/kalpulli-homepage-preview/fonts/`
- Images: `/Users/alfredoramirez/Desktop/Claude/kalpulli-homepage-preview/assets/`
- To preview locally: ask the user to run `python3 -m http.server 8080` from the project folder in their own terminal, then open `http://localhost:8080`. **Do not try to run this yourself** — the Bash tool is broken in this environment (proxy communication failure on every command, confirmed repeatedly). Hand the user exact shell commands to run instead, including `git` commands.

## Live deployment

- GitHub repo: `https://github.com/ofreedo/kalpulli-homepage-preview` (currently public — **flag this to the user early**: the `fonts/` folder contains commercially licensed fonts (Migra, Glacial Indifference) that probably shouldn't be in a public repo. The original plan was a private repo + Netlify, since GitHub Pages doesn't serve private repos on free tiers. This was never resolved.)
- Live URL: `https://ofreedo.github.io/kalpulli-homepage-preview/`
- To ship changes: `cd /Users/alfredoramirez/Desktop/Claude/kalpulli-homepage-preview && git add . && git commit -m "..." && git push` — give this to the user to run, don't attempt it yourself.

## Environment gotchas (learned the hard way, don't rediscover)

1. **Bash tool is fully broken** — every single command fails with a proxy error, even `echo test`. Never attempt shell commands yourself; always hand the exact command to the user.
2. **The browser preview pane's screenshot tool frequently returns stale frames**, especially right after `scrollTo()` or a reload. If a screenshot looks wrong or unchanged after an edit, don't trust it blindly — verify with `javascript_tool` (`getComputedStyle`, `getBoundingClientRect`, `classList.contains`) first. Wait 1-2 seconds after any scroll/reload before screenshotting.
3. When reading binary files (fonts, images) with the Read tool, it'll error "cannot read binary files" — that's expected and actually confirms the file exists at that path; it's not a real failure.

## Where things stand as of this handoff

The homepage is visually complete through: header/mobile nav, hero (Vimeo video with poster-frame fix so there's no flash), Mission & Vision, Meaning of the Name (with name-etymology content), an asymmetric photo-card grid ("Healthy Change in the Community"), a quote section, an Apple-"Get the Highlights"-style auto-advancing photo gallery with timed dot-nav and play/pause/replay, a footer banner, and footer.

A `position:fixed` rotating seal watermark sits behind the page, visible only in plain cream sections (not inside the dark Meaning section, red Quote section, or dark Footer — those are intentionally fully opaque per explicit user direction after the seal was found visually colliding with text). This took several rounds of debugging — read the "fixed seal watermark" section of the README before changing its opacity/z-index/background values again, since some of those values encode fixes for real bugs (not arbitrary choices).

## Not yet done / likely next steps

- Real destination URLs — every nav link and CTA button currently points to `#`.
- Resolve the public-repo-with-licensed-fonts issue (private repo + Netlify, or strip fonts from the public repo and load them another way).
- Some card/section copy was written by the assistant as scaffolding, not sourced from the client — needs review before being treated as final.
- The actual goal is porting this into WordPress/Elementor — that conversion hasn't started; this is still a static HTML reference build.

Ask the user what they want to work on next rather than assuming — this file is a landing point, not a task list to execute unprompted.
