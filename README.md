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
docker compose up -d          # Postgres 16 on :5432
```

If you already run Postgres locally, skip the compose file and create a
`church_platform` database yourself.

Point both apps at it by copying `.env.example` to `.env` in `packages/db`,
`apps/admin` and `apps/client`:

```bash
for d in packages/db apps/admin apps/client; do cp "$d/.env.example" "$d/.env"; done
```

The default URL matches the compose file:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/church_platform?schema=public"
```

Then create the schema and seed a church:

```bash
pnpm db:migrate  # apply prisma/migrations (use db:push for throwaway changes)
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

The client picks the church from the request host: the first label of
`grace-chapel.example.com` is the slug. A bare host (`localhost`, an IP)
carries no tenant, so it falls back to `DEFAULT_CHURCH_SLUG` from
`apps/client/.env`. To exercise real multi-tenant routing locally, use
`http://grace-chapel.localhost:4321`, which resolves without any hosts-file
entry.

## Data model

- `Church`: id, name, unique slug
- `Page`: id, churchId, path, `puckJson` (the editor layout), unique per
  `(churchId, path)`
