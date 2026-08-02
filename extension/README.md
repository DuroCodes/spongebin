# spongebin (extension)

create spongebin pastes directly from your editor.

## commands

- `spongebin: Upload from Selection`
- `spongebin: Upload Entire File`

## settings

- `spongebin.baseUrl` (default: `http://127.0.0.1:3000`)
- `spongebin.defaultLanguage` (default: `text`)
- `spongebin.theme` (default: `catppuccin-mocha`)

## development

from the repo root (workspaces install shared + extension deps):

```bash
bun install
cd extension
bun run compile
```

then run the extension via vs code: `Run and Debug` → `Run Extension`.

language names and file-extension mappings live in `@spongebin/shared` and are shared with the web app.
