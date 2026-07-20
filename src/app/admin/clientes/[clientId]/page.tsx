import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ClientBoard } from "./ClientBoard";

export const dynamic = "force-dynamic";

export default async function AdminClientPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = await db.client.findUnique({ where: { id: clientId } });
  if (!client) notFound();

  return <ClientBoard clientId={client.id} clientName={client.name} />;
}
