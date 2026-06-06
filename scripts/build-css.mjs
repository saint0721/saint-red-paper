import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const sources = [
  "foundation.css",
  "workspace.css",
  "components.css",
  "editorial.css",
  "navigation.css",
  "properties.css",
  "settings.css",
  "tables.css",
  "integrations.css",
];

const output = sources
  .map((file) => readFileSync(join(root, "src/theme", file), "utf8").trimEnd())
  .join("\n\n");

writeFileSync(join(root, "theme.css"), `${output}\n`);
