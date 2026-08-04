# spongebin (Zed)

Zed extension that exposes spongebin as an MCP server in the agent panel.

> Zed no longer supports custom command/slash-command extensions for editor actions. The supported path for this kind of integration is an [MCP server extension](https://zed.dev/docs/extensions/mcp-extensions).

## what it does

Installs and runs [`spongebin-mcp`](../mcp) so the agent can call `create_paste` with the current selection or file contents.

## settings

Configured under the `spongebin` context server:

```json
{
  "context_servers": {
    "spongebin": {
      "settings": {
        "base_url": "https://spongebin.dev",
        "default_language": "text",
        "theme": "catppuccin-mocha"
      }
    }
  }
}
```

## development

1. Publish (or `npm link`) `extension/mcp` as `spongebin-mcp`, **or** skip the wrapper and point Zed at the local MCP server:

```json
{
  "context_servers": {
    "spongebin": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/spongebin/extension/mcp/src/index.ts"]
    }
  }
}
```

2. In Zed: **extensions** → **Install Dev Extension** → select `extension/zed`.

3. Enable the `spongebin` context server in **Settings → AI → MCP Servers**.

## publishing to the Zed marketplace

This repo hosts the extension under `extension/zed`. When opening a PR to [`zed-industries/extensions`](https://github.com/zed-industries/extensions), add:

```toml
[spongebin]
submodule = "extensions/spongebin"
path = "extension/zed"
version = "0.0.1"
```

`spongebin-mcp` must be published to npm first so the extension can install it.
