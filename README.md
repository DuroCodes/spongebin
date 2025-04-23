<h1>
  <img src="public/sponge.png" width="32" style="vertical-align: middle;" />
  spongebin
</h1>

a pastebin for code snippets; rendered with shiki and monaco editor

## setup

> [!NOTE]
> you need a [neon](https://neon.tech/) database to run this project

1. clone the repo
2. install the dependencies

```bash
bun install
```

3. create a `.env` file in the root directory and add the following variables

```bash
DATABASE_URL="postgres://<your_neon_database_url>"
```

4. run the migrations

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

5. run the app

```bash
bun dev
```

6. enjoy 🎉
