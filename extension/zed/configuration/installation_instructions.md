This extension starts the spongebin MCP server so the agent can create pastes via the `create_paste` tool.

For a local checkout, build the sibling package first:

```bash
bun run --cwd extension/mcp build
```

Otherwise the extension installs `spongebin-mcp` from npm.

Optional settings:

- `base_url` — spongebin instance (default `https://spongebin.dev`)
- `default_language` — fallback language id (default `text`)
- `theme` — paste theme (default `catppuccin-mocha`)

Node.js is required (Zed's bundled Node is used automatically).
