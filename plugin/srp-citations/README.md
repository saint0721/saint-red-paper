# SRP Citations

Companion plugin for the Saint Red Paper theme. It adds the paper-writing features a theme cannot do on its own. The theme styles everything; this plugin only marks citations, captions, and cross-references and adds two commands.

## What it does
- Citation numbers such as `[14]`, `[1, 2]`, `[3–5]` take the link color in Live Preview, reading view, and PDF.
- Click a citation to jump to its entry in the reference list; hover to preview the entry.
- `Table: caption` (or `표: 설명`) on the line above a table becomes the table title.
- `![[image.png|caption]]` shows the caption under the image.
- `{#tab:name}` / `{#fig:name}` at the end of a caption names it; `@tab:name` / `@fig:name` in the text shows its current number.
- In Live Preview, the reference list drops its bullets and uses a hanging indent, as in reading view.
- Command `Renumber citations by first appearance`: renumbers `[n]` in the text by first appearance and reorders the reference list; uncited entries move to the end; numbers that are not in the reference list are left alone.
- Status bar `PDF ≈ n p`: estimated PDF pages, excluding the reference list, using the PDF export page size and scale. Click to recount.

## Reference list format
The reference list is the numbered list under the last heading named References, Bibliography, 참고문헌, or 출처:

```md
## References
- \[1\] Author, Title, Venue, Year.
- \[2\] Author, Title, Venue, Year.
```

## Notes
- Table and figure numbers follow the theme's numbering setting (Style Settings > Saint Red Paper > Academic) and its Table/Figure labels.
- The page estimate runs a little low, because page breaks before headings and tables are not counted.
