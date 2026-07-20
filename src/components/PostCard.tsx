import type { ReactNode } from "react";
import type { PostDTO, Role } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { CommentThread } from "@/components/CommentThread";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export function PostCard({
  post,
  currentRole,
  onCommentAdded,
  actions,
}: {
  post: PostDTO;
  currentRole: Role;
  onCommentAdded: () => void;
  actions?: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-neutral-200 bg-brand-white shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <div className="flex w-full items-center justify-center bg-brand-graphite sm:w-64">
          {post.mediaType === "VIDEO" ? (
            <video
              src={post.mediaUrl}
              controls
              className="max-h-72 w-full object-contain"
            />
          ) : (
            <img
              src={post.mediaUrl}
              alt={post.caption}
              className="max-h-72 w-full object-contain"
            />
          )}
        </div>

        <div className="flex-1 p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium capitalize text-neutral-500">
              {formatDate(post.scheduledDate)}
            </span>
            <StatusBadge status={post.status} />
          </div>

          <p className="whitespace-pre-wrap text-brand-graphite">{post.caption}</p>

          {actions && <div className="mt-4 flex gap-2">{actions}</div>}

          <CommentThread
            postId={post.id}
            comments={post.comments}
            currentRole={currentRole}
            onCommentAdded={onCommentAdded}
          />
        </div>
      </div>
    </article>
  );
}
