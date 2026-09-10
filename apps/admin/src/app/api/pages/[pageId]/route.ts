import { NextResponse } from "next/server";
import { Prisma, prisma } from "@church/db";

type RouteContext = {
  params: Promise<{ pageId: string }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  const { pageId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const puckJson = (body as { puckJson?: unknown })?.puckJson;
  if (!puckJson || typeof puckJson !== "object") {
    return NextResponse.json({ error: "Missing `puckJson`" }, { status: 400 });
  }

  try {
    const page = await prisma.page.update({
      where: { id: pageId },
      data: { puckJson: puckJson as Prisma.InputJsonValue },
    });
    return NextResponse.json({ id: page.id, updatedAt: page.updatedAt });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    throw error;
  }
}
