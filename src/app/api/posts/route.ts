import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const queryClientId = url.searchParams.get("clientId");
  const clientId = session.role === "CLIENT" ? session.clientId : queryClientId;

  if (!clientId) {
    return NextResponse.json({ error: "clientId é obrigatório" }, { status: 400 });
  }

  const posts = await db.post.findMany({
    where: { clientId },
    orderBy: { scheduledDate: "asc" },
    include: {
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { email: true, role: true } } },
      },
    },
  });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "AGENCY") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const { clientId, mediaUrl, mediaType, caption, scheduledDate } = body;

  if (!clientId || !mediaUrl || !mediaType || !caption || !scheduledDate) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const post = await db.post.create({
    data: {
      clientId,
      mediaUrl,
      mediaType,
      caption,
      scheduledDate: new Date(scheduledDate),
    },
  });

  return NextResponse.json({ post });
}
