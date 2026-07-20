import type { PostStatus } from "@/lib/types";

const STATUS_CONFIG: Record<PostStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Aguardando aprovação",
    className: "bg-brand-graphite text-brand-white",
  },
  APPROVED: {
    label: "✓ Aprovado",
    className: "bg-brand-gold text-brand-graphite",
  },
  CHANGES_REQUESTED: {
    label: "Alteração solicitada",
    className: "bg-brand-red text-brand-white",
  },
};

export function StatusBadge({ status }: { status: PostStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
}
