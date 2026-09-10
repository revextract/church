import Link from "next/link";
import { FileText } from "lucide-react";
import { prisma } from "@church/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const churches = await prisma.church.findMany({
    include: { pages: { orderBy: { path: "asc" } } },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Church Platform Admin</h1>
      <p className="mt-2 text-slate-500">
        Pick a page to open it in the visual editor.
      </p>

      {churches.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No churches yet. Run <code className="font-mono">pnpm db:push</code> and
          seed one to get started.
        </p>
      ) : (
        <ul className="mt-10 space-y-8">
          {churches.map((church) => (
            <li key={church.id}>
              <h2 className="text-xl font-semibold">{church.name}</h2>
              <p className="text-sm text-slate-500">/{church.slug}</p>
              <ul className="mt-3 space-y-1">
                {church.pages.map((page) => (
                  <li key={page.id}>
                    <Link
                      href={`/editor/${page.id}`}
                      className="inline-flex items-center gap-2 rounded px-2 py-1 text-blue-600 hover:bg-blue-50"
                    >
                      <FileText size={16} aria-hidden />
                      {page.path}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
