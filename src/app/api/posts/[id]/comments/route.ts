import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function getAccessiblePost(id: string, session: { role: string; clientId: string | null }) {
  const post = await db.post.findUnique({ where: { id } });
  if (!post) return { post: null, error: NextResponse.json({ error: "Post não encontrado" }, { status: 404 }) };
  if (session.role === "CLIENT" && post.clientId !== session.clientId) {
    return { post: null, error: NextResponse.json({ error: "Não autorizado" }, { status: 403 }) };
  }
  return { post, error: null };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await getAccessiblePost(id, session);
  if (error) return error;

  const comments = await db.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: "asc" },
    include: { author: { select: { email: true, role: true } } },
  });

  return NextResponse.json({ comments });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const { text } = await request.json();
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Comentário vazio" }, { status: 400 });
  }

  const { error } = await getAccessiblePost(id, session);
  if (error) return error;

  const comment = await db.comment.create({
    data: {
      postId: id,
      authorId: session.userId,
      authorRole: session.role,
      text: text.trim(),
    },
    include: { author: { select: { email: true, role: true } } },
  });

  return NextResponse.json({ comment });
}
