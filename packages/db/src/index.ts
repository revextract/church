import { PrismaClient } from "@prisma/client";

// Reuse the client across hot reloads in dev so we don't exhaust connections.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Named re-exports (rather than `export *`) keep bundlers from tripping over
// @prisma/client being CommonJS.
export { Prisma, PrismaClient } from "@prisma/client";
export type { Church, Page } from "@prisma/client";
