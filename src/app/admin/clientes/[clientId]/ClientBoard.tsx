"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { PostDTO } from "@/lib/types";
import { PostCard } from "@/components/PostCard";

export function ClientBoard({
  clientId,
  clientName,
}: {
  clientId: string;
  clientName: string;
}) {
  const { data, mutate, isLoading } = useSWR<{ posts: PostDTO[] }>(
    `/api/posts?clientId=${clientId}`,
    fetcher,
    { refreshInterval: 5000 }
  );

  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !caption.trim() || !scheduledDate) return;
    setSubmitting(true);
    setError(null);

    try {
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("clientId", clientId);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });
      if (!uploadRes.ok) throw new Error("Falha no upload da mídia");
      const { url, mediaType } = await uploadRes.json();

      const postRes = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          mediaUrl: url,
          mediaType,
          caption,
          scheduledDate,
        }),
      });
      if (!postRes.ok) throw new Error("Falha ao criar o post");

      setFile(null);
      setCaption("");
      setScheduledDate("");
      setShowForm(false);
      mutate();
    } catch {
      setError("Não foi possível publicar o post. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  const posts = data?.posts ?? [];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-brand-graphite">{clientName}</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-brand-white transition hover:bg-brand-red-dark"
        >
          {showForm ? "Cancelar" : "+ Novo post"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-brand-white p-5 shadow-sm"
        >
          {error && (
            <p className="rounded-md bg-brand-red/10 px-3 py-2 text-sm text-brand-red">
              {error}
            </p>
          )}

          <label className="text-sm font-medium text-brand-graphite">
            Imagem ou vídeo
            <input
              type="file"
              accept="image/*,video/*"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full text-sm"
            />
          </label>

          <label className="text-sm font-medium text-brand-graphite">
            Legenda
            <textarea
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
            />
          </label>

          <label className="text-sm font-medium text-brand-graphite">
            Data de postagem
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="self-start rounded-md bg-brand-graphite px-5 py-2 text-sm font-semibold text-brand-white transition hover:bg-black disabled:opacity-50"
          >
            {submitting ? "Publicando..." : "Publicar para aprovação"}
          </button>
        </form>
      )}

      {isLoading && (
        <p className="text-sm text-neutral-500">Carregando posts...</p>
      )}

      {!isLoading && posts.length === 0 && (
        <p className="text-sm text-neutral-500">
          Nenhum post cadastrado ainda para este cliente.
        </p>
      )}

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentRole="AGENCY"
          onCommentAdded={() => mutate()}
        />
      ))}
    </div>
  );
}
