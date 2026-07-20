import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PortalBoard } from "./PortalBoard";

export default async function PortalPage() {
  const session = await getSession();
  if (!session || session.role !== "CLIENT" || !session.clientId) {
    redirect("/login");
  }

  const client = await db.client.findUnique({
    where: { id: session.clientId },
  });
  if (!client) redirect("/login");

  return <PortalBoard clientName={client.name} />;
}
