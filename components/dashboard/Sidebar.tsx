"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Visão Geral", icon: "fa-solid fa-gauge-high" },
  { href: "/dashboard/leads", label: "Mensagens (Leads)", icon: "fa-solid fa-inbox" },
  { href: "/dashboard/hero", label: "Início (Hero)", icon: "fa-solid fa-house" },
  { href: "/dashboard/about", label: "Sobre Mim", icon: "fa-solid fa-user" },
  { href: "/dashboard/skills", label: "Habilidades", icon: "fa-solid fa-code" },
  { href: "/dashboard/projects", label: "Projetos", icon: "fa-solid fa-diagram-project" },
  { href: "/dashboard/experience", label: "Experiência", icon: "fa-solid fa-briefcase" },
  { href: "/dashboard/education", label: "Educação", icon: "fa-solid fa-graduation-cap" },
  { href: "/dashboard/contact", label: "Contato", icon: "fa-solid fa-address-card" },
  { href: "/dashboard/settings", label: "Configurações", icon: "fa-solid fa-gear" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 bg-dark-1 border-r border-white/10 h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="font-display font-bold text-lg text-white">
          CRM <span className="text-pink">Portfólio</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">Painel administrativo</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-pink/15 text-pink-soft border border-pink/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <i className={`${link.icon} w-4 text-center`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5"
        >
          <i className="fa-solid fa-arrow-up-right-from-square w-4 text-center" />
          Ver site
        </a>
        <button
          onClick={sair}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-pink-soft hover:bg-pink/10"
        >
          <i className="fa-solid fa-right-from-bracket w-4 text-center" />
          Sair
        </button>
      </div>
    </aside>
  );
}
