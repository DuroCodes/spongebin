# spongebin (zed)

zed does not let extensions register command palette actions like vs code. instead, we register a task that can be spawned from the command palette or the run menu.

## install

requires [bun](https://bun.sh) on `PATH`.

```bash
curl -fsSL https://raw.githubusercontent.com/DuroCodes/spongebin/main/extension/zed/src/cli.ts | bun run - install
```

or from a local clone:

```bash
bun run --cwd extension/zed install
```

uninstall:

```bash
curl -fsSL https://raw.githubusercontent.com/DuroCodes/spongebin/main/extension/zed/src/cli.ts | bun run - uninstall
# or from a clone: bun run --cwd extension/zed uninstall
```

that will:

1. copy the upload script (+ shared helpers) to `~/.local/share/spongebin`
2. create or update `~/.config/zed/tasks.json` with a `spongebin: upload` task (replacing any previous one with that label)

then in zed: **task: spawn** → **spongebin: upload**.

## development

this worktree also has `.zed/tasks.json` pointing at `$ZED_WORKTREE_ROOT/extension/zed/src/upload.ts`, so you can try the task here without installing globally.

## env

| variable                     | default                    | description                      |
| ---------------------------- | -------------------------- | -------------------------------- |
| `SPONGEBIN_BASE_URL`         | `https://spongebin.dev`    | spongebin instance               |
| `SPONGEBIN_THEME`            | `catppuccin-mocha`         | paste theme                      |
| `SPONGEBIN_DEFAULT_LANGUAGE` | `text`                     | fallback language                |
| `SPONGEBIN_HOME`             | `~/.local/share/spongebin` | install dir used by the cli      |
| `SPONGEBIN_REF`              | `main`                     | git ref for remote installs      |
