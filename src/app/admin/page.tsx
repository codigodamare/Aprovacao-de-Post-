import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const clients = await db.client.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { posts: true } },
      posts: { where: { status: "CHANGES_REQUESTED" }, select: { id: true } },
    },
  });

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h2 className="text-xl font-semibold text-brand-graphite">Clientes</h2>

      {clients.length === 0 && (
        <p className="text-sm text-neutral-500">Nenhum cliente cadastrado ainda.</p>
      )}

      <ul className="flex flex-col gap-3">
        {clients.map((client) => (
          <li key={client.id}>
            <Link
              href={`/admin/clientes/${client.id}`}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-brand-white px-5 py-4 shadow-sm transition hover:border-brand-red"
            >
              <div>
                <p className="font-medium text-brand-graphite">{client.name}</p>
                <p className="text-sm text-neutral-500">
                  {client._count.posts}{" "}
                  {client._count.posts === 1 ? "post" : "posts"}
                </p>
              </div>
              {client.posts.length > 0 && (
                <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-semibold text-brand-white">
                  {client.posts.length} pedindo alteração
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
