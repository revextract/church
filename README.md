# Church Platform

White-labeled website builder for churches. pnpm monorepo.

```
apps/
  admin    Next.js (App Router) + Tailwind + Puck: the visual editor
  client   Astro + Tailwind + @astrojs/react: the public church sites
packages/
  db           Prisma schema + shared PrismaClient
  puck-config  Puck component library shared by editor and renderer
```

The editor and the renderer must agree on component names and props, so the
Puck config lives in `packages/puck-config` and both apps import it. Adding a
block means adding it there once.

## Getting started

```bash
pnpm install
```

Point both apps at Postgres: copy `.env.example` to `.env` in
`packages/db`, `apps/admin` and `apps/client`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/church_platform?schema=public"
```

Then create the schema and seed a church:

```bash
pnpm db:push     # push schema.prisma to Postgres
pnpm db:generate # regenerate the Prisma client
pnpm db:seed     # creates "Grace Chapel" with a "/" page
```

## Running

```bash
pnpm dev         # both apps
```

- Admin: http://localhost:3000, which lists churches and pages; each links to
  `/editor/<pageId>`, which mounts `<Puck>`. Publish writes `puckJson` back
  via `PUT /api/pages/<pageId>`.
- Client: http://localhost:4321, where `[...slug].astro` looks the page up by
  church slug + path and renders it through Puck's headless `<Render>` from
  `@puckeditor/core/rsc`. No `client:*` directive, so the browser gets HTML
  and no JavaScript.

In dev the client resolves the church from `DEFAULT_CHURCH_SLUG`; in
production it uses the request hostname's first label (`grace-chapel.example.com`).

## Data model

- `Church`: id, name, unique slug
- `Page`: id, churchId, path, `puckJson` (the editor layout), unique per
  `(churchId, path)`
