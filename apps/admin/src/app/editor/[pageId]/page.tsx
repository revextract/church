import { notFound } from "next/navigation";
import { prisma } from "@church/db";
import { toPuckData } from "@church/puck-config";
import { EditorClient } from "./editor-client";

export const dynamic = "force-dynamic";

type EditorPageProps = {
  params: Promise<{ pageId: string }>;
};

export default async function EditorPage({ params }: EditorPageProps) {
  const { pageId } = await params;

  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { church: true },
  });

  if (!page) notFound();

  return (
    <EditorClient
      pageId={page.id}
      path={page.path}
      churchName={page.church.name}
      initialData={toPuckData(page.puckJson)}
    />
  );
}
