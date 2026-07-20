import { LogoutButton } from "@/components/LogoutButton";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="flex items-center justify-between bg-brand-red px-6 py-4 text-brand-white shadow-sm">
        <div>
          <h1 className="text-lg font-bold">Portal de Aprovação</h1>
          <p className="text-sm text-brand-white/80">
            Posts do mês para revisar e aprovar
          </p>
        </div>
        <LogoutButton />
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
