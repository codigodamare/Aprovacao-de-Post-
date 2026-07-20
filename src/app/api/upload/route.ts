import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "AGENCY") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const clientId = formData.get("clientId");

  if (!(file instanceof File) || typeof clientId !== "string") {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const client = await db.client.findUnique({ where: { id: clientId } });
  if (!client) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
  }

  const mediaType = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`;

  const blob = await put(`${client.slug}/${filename}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url, mediaType });
}
