# spongebin (Zed)

Zed does **not** let extensions register arbitrary command-palette actions the way VS Code does.

From the [extension docs](https://zed.dev/docs/extensions/developing-extensions), extensions can only ship languages, themes, icon themes, snippets, debuggers, and MCP servers. Custom slash commands were removed. So there is no supported way to publish a marketplace extension that adds `spongebin: upload` to the palette like the VS Code package.

## closest equivalent: a Zed task

Zed tasks show up via **task: spawn** in the command palette, and you can bind one to a key.

This folder ships:

- `upload.ts` — uploads selection (via `$ZED_SELECTED_TEXT`) or the current file
- `tasks.json` — task template for this repo

### use in this repo

copy/symlink the task into the worktree:

```bash
mkdir -p .zed
cp extension/zed/tasks.json .zed/tasks.json
```

then **task: spawn** → `spongebin: upload`.

optional keymap (`~/.config/zed/keymap.json`):

```json
[
  {
    "context": "Workspace",
    "bindings": {
      "cmd-shift-u": ["task::Spawn", { "task_name": "spongebin: upload" }]
    }
  }
]
```

### use in other projects

point the task `args` at your local checkout of `upload.ts`, or set `SPONGEBIN_BASE_URL` / `SPONGEBIN_THEME` in the task `env`.

## why not MCP?

An MCP server would only expose tools to the agent panel. That is not a user-facing upload command, so it is the wrong shape for this.
