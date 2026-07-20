import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="flex items-center justify-between bg-brand-graphite px-6 py-4 text-brand-white shadow-sm">
        <Link href="/admin" className="text-lg font-bold">
          Painel da Agência
        </Link>
        <LogoutButton />
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
