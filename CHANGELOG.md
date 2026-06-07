# Changelog

## Unreleased

## 0.2.9 - 2026-06-07

- Added the repository-local `assets/saint-red-paper-community.png` preview expected by the Obsidian Community page metadata.
- Removed remaining `!important` declarations from the theme CSS and split source files for community review compatibility.
- Cleaned the README file list so it only describes files currently included in this minimal theme package.

## 0.2.8 - 2026-06-06

- Refreshed the README for the new Obsidian Community directory flow and removed obsolete PR/submission wording.
- Restored the canonical uppercase `README.md` filename for GitHub and community directory compatibility.
- Addressed community theme review feedback around selector duplication, unsupported decoration properties, contrast, hex formatting, and optional integration selectors.
- Removed the temporary package/build-script files so the repository remains a minimal Obsidian theme package.

## 0.2.7 - 2026-05-29

- Refined Markdown and Dataview tables around a cleaner paper-like layout: no outer red box, a stronger red header rule, subtle body row rules, and less rounded framing.
- Added optional red table dividers for Markdown tables. Put `<hr>` in the first cell of a blank row to render a red divider across the table.
- Simplified inline code in light mode so backtick text uses the same red tone as table headers without a filled chip background or border.
- Simplified Properties multi-value pills for topics, tags, and aliases by removing the rounded capsule background and using normal text color for the values.
- Refined the optional `Agent Client` surface for research-oriented use, including stronger light-mode inline code accents, a cleaner empty-state treatment, a layered composer well, and a softer diagonal background glow behind the conversation area.

## 0.2.6 - 2026-03-15

- Replaced the README gallery with the final `main-light` and `main-dark` workspace captures so the public theme page shows only the two canonical desktop previews.
- Refined Dataview tables so light and dark mode share the same rounded surface treatment without stray gradient bands or mismatched header cells.
- Added a dedicated Markdown table styling layer with a cleaner paper-table presentation and a unified header row tone.
- Polished the optional `Agent Client` surface so the usage chip can sit back on the left edge without fighting the selector controls.

## 0.2.5 - 2026-03-15

- Added the actual dark main workspace capture to the README preview grid.
- Removed legacy preview assets that were no longer used by the repository.

## 0.2.4 - 2026-03-15

- Replaced the README previews with named actual desktop captures from the same real workspace instead of mixed mockup-style report shots.
- Simplified the README gallery to a hero plus light/dark workspace pair.
- Tightened the light-mode palette so it feels closer in weight and contrast to the dark presentation while keeping light as the primary identity.

## 0.2.3 - 2026-03-15

- Replaced the report-style preview assets with actual captures from a real experiment note so the README visuals lean on existing Obsidian content instead of staged mockup-like surfaces.
- Refreshed the dark preview with the same real note structure and kept the community submission screenshot as a smaller actual UI capture.

## 0.2.2 - 2026-03-15

- Added a true light-first but dark-capable pass so Saint Red Paper no longer relies on token-only dark compatibility.
- Restyled dark surfaces for markdown reading, Dataview tables, inline code, blockquotes, sidebars, and graph view with a restrained red-paper palette.
- Rebuilt the README previews around a sidebar-free technical report workspace for light mode and added a dedicated dark-mode preview image.
- Shrunk the community submission screenshot to a submission-friendly `512x288` size.

## 0.2.1 - 2026-03-15

- Rebuilt the main preview assets around a real Obsidian workspace layout with the left sidebar open, a live Dataview table in the note surface, a graph view in the upper-right dock, and `Agent Client` in the lower-right dock.
- Added a dedicated 16:9 community submission screenshot and documented the ready-to-paste community theme metadata.
- Retinted the graph view from neutral gray to a restrained red-paper palette and regenerated the preview screenshots with the updated graph panel.
- Added `versions.json` so future GitHub releases can be consumed through Obsidian's theme update flow.
- Refined the optional `Agent Client` control styling so the composer, selectors, usage chip, and send button sit closer to the Saint Red Paper visual language.
- Clarified in the README that plugin-specific support is styling-only and does not bundle plugin functionality.

## 0.2.0 - 2026-03-13

- Prepared the theme for GitHub distribution.
- Added repository documentation and a preview asset.
- Replaced placeholder preview renders with live Obsidian capture images for the README gallery.
- Promoted a live full-workspace capture to the main README hero image.
- Added default values for `Style Settings`-driven custom properties so the theme behaves predictably without the plugin.
- Kept the theme package minimal with `theme.css` and `manifest.json` as the runtime-critical files.

## 0.1.0 - 2026-03-13

- Initial packaged version of Saint Red Paper.
