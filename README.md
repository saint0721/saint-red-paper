# Saint Red Paper

Saint Red Paper is a paper-white Obsidian theme for research notes, lab logs, and long-form technical writing. It stays bright and quiet by default, uses red only where structure needs emphasis, and folds the main sidebar, callout, tab, typography, Dataview, and optional plugin refinements into one restrained visual language.

![Saint Red Paper hero preview](assets/saint-red-paper-hero.png)

## Preview

| Workspace | Reading surface |
| --- | --- |
| ![Workspace preview](assets/saint-red-paper-workspace.png) | ![Reading preview](assets/saint-red-paper-reading.png) |

The preview assets above are real captures from the live `Theme_Saint_Red_Paper_Demo.md` note inside Obsidian. The main workspace preview now shows the left sidebar, a live Dataview table in the note surface, a graph view in the upper-right dock, and an `Agent Client` panel in the lower-right dock so the screenshot reads like a real working setup instead of a staged mockup.

## What It Changes

- Keeps the main canvas close to white paper instead of tinting the whole workspace
- Tunes headings, spacing, blockquotes, callouts, and inline code for reading-heavy notes
- Gives sidebars, root tabs, links, tags, and notices a restrained red-paper language
- Adds a paper-like treatment for Dataview result tables so they feel closer to notes than widgets
- Adds a compact optional styling layer for `Agent Client` controls when that plugin is installed
- Includes built-in `Style Settings` hooks for width, rules, sidebar accents, links, tags, and table density
- Still behaves predictably even if `Style Settings` is not installed
- Ships as a compact theme package with `theme.css` and `manifest.json`

## Quick Install

Requires Obsidian `1.1.9` or later.

### Manual

1. Copy this folder into your vault's `.obsidian/themes/Saint Red Paper/` directory.
2. Open `Settings -> Appearance -> Themes`.
3. Select `Saint Red Paper`.

### Git clone

```bash
git clone https://github.com/saint0721/saint-red-paper.git "Saint Red Paper"
```

Then move or symlink the folder into `.obsidian/themes/Saint Red Paper/`.

### Optional plugin

The theme works without extra plugins, but `Style Settings` is recommended if you want to adjust the exposed theme variables from the UI instead of editing CSS.

### Optional plugin-specific styling

Saint Red Paper can also style some third-party plugin surfaces if they already exist in the user's vault. For example, the current theme includes a compact control treatment for `Agent Client` so its chat composer feels closer to the rest of the paper-like interface.

Important:

- The theme does **not** bundle `Agent Client` or any other plugin functionality.
- Users still need to install those plugins separately.
- What the theme can provide is visual integration, not plugin features.

## Best Fit

Saint Red Paper is designed for:

- research notes
- lab notebooks
- proposal drafts
- long-form technical writing
- clean light-mode daily knowledge work

It is a weaker fit for dashboard-heavy, card-heavy, or heavily gamified workspace styles.

## Recommended setup

- Font: `SUIT`
- Interface mode: Light
- Accent color: `#cd2623` if you want the OS-level accent to sit close to the theme palette
- Snippets: Disable older overlapping table/sidebar snippets once this theme is enabled

## Exposed Style Settings controls

- Note width
- Paragraph width
- Inline title rule width
- H1 rule width
- Sidebar active accent
- Sidebar active background
- Sidebar edge shadow opacity
- Link color
- Link hover color
- Tag shape
- Table vertical padding
- Table outer border color

## Before You Publish

If you plan to share the theme publicly, verify:

- Reading View and Live Preview both look correct
- Dataview tables do not reintroduce conflicting backgrounds
- No legacy snippets are still overriding table or sidebar styles
- `Style Settings` controls remain optional rather than required
- The current Obsidian version still respects the selectors used in `theme.css`
- Optional plugin-specific styling degrades safely when the target plugin is not installed

## Included Files

- `theme.css`: Theme source
- `manifest.json`: Obsidian theme manifest
- `assets/saint-red-paper-hero.png`: Main live workspace capture
- `assets/saint-red-paper-cover.svg`: Repo preview graphic
- `assets/saint-red-paper-workspace.png`: Live workspace preview with Dataview, graph, and Agent Client
- `assets/saint-red-paper-reading.png`: Live reading surface preview
- `CHANGELOG.md`: Release notes

## Links

- Homepage: https://github.com/saint0721/saint-red-paper
- Issues: https://github.com/saint0721/saint-red-paper/issues

For release history, see [CHANGELOG.md](CHANGELOG.md).
