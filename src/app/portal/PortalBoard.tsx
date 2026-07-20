"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { PostDTO, PostStatus } from "@/lib/types";
import { PostCard } from "@/components/PostCard";

export function PortalBoard({ clientName }: { clientName: string }) {
  const { data, mutate, isLoading } = useSWR<{ posts: PostDTO[] }>(
    "/api/posts",
    fetcher,
    { refreshInterval: 5000 }
  );

  async function updateStatus(postId: string, status: PostStatus) {
    await fetch(`/api/posts/${postId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    mutate();
  }

  const posts = data?.posts ?? [];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h2 className="text-xl font-semibold text-brand-graphite">{clientName}</h2>

      {isLoading && (
        <p className="text-sm text-neutral-500">Carregando posts...</p>
      )}

      {!isLoading && posts.length === 0 && (
        <p className="text-sm text-neutral-500">
          Nenhum post cadastrado para este mês ainda.
        </p>
      )}

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentRole="CLIENT"
          onCommentAdded={() => mutate()}
          actions={
            <>
              <button
                onClick={() => updateStatus(post.id, "APPROVED")}
                disabled={post.status === "APPROVED"}
                className="rounded-md bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-graphite transition hover:brightness-95 disabled:opacity-50"
              >
                Aprovar
              </button>
              <button
                onClick={() => updateStatus(post.id, "CHANGES_REQUESTED")}
                disabled={post.status === "CHANGES_REQUESTED"}
                className="rounded-md border border-brand-red px-4 py-2 text-sm font-semibold text-brand-red transition hover:bg-brand-red/5 disabled:opacity-50"
              >
                Pedir alteração
              </button>
            </>
          }
        />
      ))}
    </div>
  );
}
