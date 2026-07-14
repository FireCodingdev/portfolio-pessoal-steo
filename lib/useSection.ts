"use client";

import { useEffect, useState } from "react";
import { ContentSection } from "./defaultContent";

export function useSection<T>(section: ContentSection, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [status, setStatus] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  useEffect(() => {
    let ativo = true;
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((all) => {
        if (ativo && all[section]) setData(all[section]);
      })
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [section]);

  async function salvar(novoDado?: T) {
    setSalvando(true);
    setStatus(null);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: novoDado ?? data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.erro || "Erro ao salvar.");
      setStatus({ tipo: "ok", texto: "Alterações salvas com sucesso!" });
    } catch (err: any) {
      setStatus({ tipo: "erro", texto: err.message || "Erro ao salvar." });
    } finally {
      setSalvando(false);
      setTimeout(() => setStatus(null), 4000);
    }
  }

  return { data, setData, carregando, salvando, status, salvar };
}

export function novoId(prefixo: string) {
  return `${prefixo}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}
