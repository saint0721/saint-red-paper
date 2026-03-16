# Saint Red Paper

Saint Red Paper is a light-first Obsidian theme for research notes, lab logs, and long-form technical writing. It keeps light mode as the primary visual identity, but now also includes a matching dark mode so the same note structures remain usable when the workspace switches to dark.

<div align="center">

<a href="https://github.com/obsidianmd/obsidian-releases/pull/11051">Community Theme PR</a> · <a href="https://github.com/saint0721/saint-red-paper/stargazers">Star on GitHub</a> · <a href="https://github.com/saint0721/saint-red-paper/issues">Issues</a>

[![Obsidian Community Theme PR](https://img.shields.io/badge/Obsidian%20Community-PR%20open-f28c28)](https://github.com/obsidianmd/obsidian-releases/pull/11051)
[![GitHub stars](https://img.shields.io/github/stars/saint0721/saint-red-paper?style=social)](https://github.com/saint0721/saint-red-paper/stargazers)

<strong>If Saint Red Paper fits your workflow, please star the repo.</strong>

</div>

![Saint Red Paper light workspace](assets/main-light.png)
![Saint Red Paper dark workspace](assets/main-dark.png)

Saint Red Paper is currently submitted to the official Obsidian community theme list. Feedback, bug reports, and workspace screenshots are always welcome in [Issues](https://github.com/saint0721/saint-red-paper/issues).

## Community Theme Metadata

If you want to submit Saint Red Paper to the official Obsidian community theme list, the current ready-to-paste metadata is:

```json
{
  "name": "Saint Red Paper",
  "author": "saintkim",
  "repo": "saint0721/saint-red-paper",
  "screenshot": "assets/main-light.png",
  "modes": ["dark", "light"]
}
```

Notes:

- `modes` is declared as `["dark", "light"]`, but Saint Red Paper is still intentionally positioned as a light-first theme.
- `publish` is omitted for now because Obsidian Publish support has not been explicitly validated yet.
- The screenshot field above now points to the main light workspace capture kept in this repository.

## What It Changes

- Keeps the main canvas close to white paper instead of tinting the whole workspace
- Tunes headings, spacing, blockquotes, callouts, and inline code for reading-heavy notes
- Gives sidebars, root tabs, links, tags, and notices a restrained red-paper language
- Adds a paper-like treatment for Dataview result tables so they feel closer to notes than widgets
- Extends the same visual language into a matching dark mode instead of leaving dark as a token-only fallback
- Adds a compact optional styling layer for `Agent Client` controls when that plugin is installed
- Fits well with `make.md`'s `Navigator` panel if you want the workspace captures to feel closer to the author's setup
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

The theme works without extra plugins, but these companion plugins are recommended if you want a setup close to the light and dark workspace captures above:

- `Style Settings` for adjusting exposed theme variables from the UI
- `Dataview` if you want result tables like the ones shown in the demo captures
- `Agent Client` if you want the matching chat workflow shown in the workspace captures
- `make.md` if you want the `Navigator` panel shown in the author's workspace layout

### Optional plugin-specific styling

Saint Red Paper can also style some third-party plugin surfaces if they already exist in the user's vault. In practice, `Agent Client` is the main companion plugin currently styled by the theme, and the screenshots intentionally show that integration because it fits the research-note workflow the theme is built around. Some workspace captures may also reflect layout influence from `make.md`, especially its `Navigator` view, even though the theme does not bundle that plugin.

Important:

- The theme does **not** bundle `Agent Client` or any other plugin functionality.
- Users still need to install those plugins separately.
- If you want the workspace screenshots to look closer to the author's vault, install the companion plugins separately, including `make.md` for `Navigator`.
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
- `assets/main-light.png`: Main live light workspace capture
- `assets/main-dark.png`: Main live dark workspace capture
- `CHANGELOG.md`: Release notes

## Links

- Homepage: https://github.com/saint0721/saint-red-paper
- Issues: https://github.com/saint0721/saint-red-paper/issues

For release history, see [CHANGELOG.md](CHANGELOG.md).
