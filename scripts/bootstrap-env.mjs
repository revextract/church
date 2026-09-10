// Copies each package's .env.example to .env when it doesn't exist yet.
// A plain shell loop would not run on Windows, and this is the first thing
// anyone does after cloning.
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const targets = ["packages/db", "apps/admin", "apps/client"];

let created = 0;
for (const target of targets) {
  const example = join(root, target, ".env.example");
  const env = join(root, target, ".env");

  if (!existsSync(example)) {
    console.warn(`skip ${target}: no .env.example`);
    continue;
  }
  if (existsSync(env)) {
    console.log(`keep ${target}/.env (already exists)`);
    continue;
  }
  copyFileSync(example, env);
  console.log(`create ${target}/.env`);
  created += 1;
}

console.log(
  created > 0
    ? `\nCreated ${created} .env file(s). Edit DATABASE_URL if your Postgres differs.`
    : "\nNothing to do; all .env files were already present.",
);
