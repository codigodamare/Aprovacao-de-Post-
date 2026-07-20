"use client";

import { useState } from "react";
import type { CommentDTO, Role } from "@/lib/types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CommentThread({
  postId,
  comments,
  currentRole,
  onCommentAdded,
}: {
  postId: string;
  comments: CommentDTO[];
  currentRole: Role;
  onCommentAdded: () => void;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setSending(false);
    if (res.ok) {
      setText("");
      onCommentAdded();
    }
  }

  return (
    <div className="mt-4 border-t border-neutral-200 pt-4">
      {comments.length > 0 && (
        <ul className="mb-3 flex flex-col gap-2">
          {comments.map((comment) => {
            const isMine = comment.authorRole === currentRole;
            return (
              <li
                key={comment.id}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  isMine
                    ? "ml-auto bg-brand-red text-brand-white"
                    : "bg-neutral-100 text-brand-graphite"
                }`}
              >
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide opacity-80">
                  {comment.authorRole === "AGENCY" ? "Agência" : "Cliente"} ·{" "}
                  {formatTime(comment.createdAt)}
                </p>
                <p>{comment.text}</p>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escrever um comentário..."
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="rounded-md bg-brand-graphite px-4 py-2 text-sm font-medium text-brand-white transition hover:bg-black disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
