import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const VALID_STATUSES = ["PENDING", "APPROVED", "CHANGES_REQUESTED"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (typeof status !== "string" || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  const post = await db.post.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
  }

  if (session.role === "CLIENT" && post.clientId !== session.clientId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const updated = await db.post.update({
    where: { id },
    data: { status: status as "PENDING" | "APPROVED" | "CHANGES_REQUESTED" },
  });

  return NextResponse.json({ post: updated });
}
