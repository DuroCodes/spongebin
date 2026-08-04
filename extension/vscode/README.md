# spongebin (vs code)

create spongebin pastes directly from your editor.

## commands

- `spongebin: upload` — uploads the selection if one exists, otherwise the whole file

## settings

- `spongebin.baseUrl` (default: `https://spongebin.dev`)
- `spongebin.defaultLanguage` (default: `text`)
- `spongebin.theme` (default: `catppuccin-mocha`)

## development

from the repo root:

```bash
bun install
bun run --cwd extension/vscode compile
```

then **Run and Debug** → **Run Extension** (`F5`). that opens an Extension Development Host with the extension loaded from `extension/vscode/`.
