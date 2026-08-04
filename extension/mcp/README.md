# spongebin-mcp

MCP server that creates [spongebin](https://spongebin.dev) pastes.

## tools

- `create_paste` — uploads `content` and returns a shareable URL

## environment

| variable | default | description |
| --- | --- | --- |
| `SPONGEBIN_BASE_URL` | `https://spongebin.dev` | spongebin instance |
| `SPONGEBIN_DEFAULT_LANGUAGE` | `text` | fallback language |
| `SPONGEBIN_THEME` | `catppuccin-mocha` | paste theme |

## development

from the repo root:

```bash
bun install
bun run --cwd extension/mcp start
```

## local zed / cursor config

```json
{
  "context_servers": {
    "spongebin": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/spongebin/extension/mcp/src/index.ts"],
      "env": {
        "SPONGEBIN_BASE_URL": "https://spongebin.dev"
      }
    }
  }
}
```

## publish

```bash
bun run --cwd extension/mcp build
bun run --cwd extension/mcp prepublishOnly
npm publish --cwd extension/mcp --access public
```

The Zed extension (`extension/zed`) installs this package from npm.
