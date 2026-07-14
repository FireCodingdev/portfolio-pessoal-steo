"use client";

import { ReactNode } from "react";

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
      {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-dark-1 border border-white/10 rounded-2xl p-6 ${className}`}>{children}</div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full bg-dark-2 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-pink transition-colors";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className || ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-[100px] resize-y ${props.className || ""}`} />;
}

export function SaveBar({
  onSave,
  salvando,
  status,
}: {
  onSave: () => void;
  salvando: boolean;
  status: { tipo: "ok" | "erro"; texto: string } | null;
}) {
  return (
    <div className="flex items-center gap-3 sticky bottom-0 bg-dark/95 backdrop-blur border-t border-white/10 -mx-6 md:-mx-10 px-6 md:px-10 py-4 mt-8">
      <button
        onClick={onSave}
        disabled={salvando}
        className="bg-pink hover:bg-pink-light disabled:opacity-60 text-white font-semibold text-sm rounded-lg px-5 py-2.5 transition-colors flex items-center gap-2"
      >
        <i className="fa-solid fa-floppy-disk" />
        {salvando ? "Salvando..." : "Salvar alterações"}
      </button>
      {status && (
        <span className={`text-sm ${status.tipo === "ok" ? "text-emerald-400" : "text-pink-soft"}`}>
          {status.texto}
        </span>
      )}
    </div>
  );
}

export function IconButton({
  icon,
  onClick,
  title,
  danger,
}: {
  icon: string;
  onClick: () => void;
  title?: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
        danger
          ? "border-pink/30 text-pink-soft hover:bg-pink/10"
          : "border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <i className={icon} />
    </button>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border border-dashed border-white/15 hover:border-pink/40 text-gray-400 hover:text-pink-soft rounded-xl py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
    >
      <i className="fa-solid fa-plus" /> {label}
    </button>
  );
}

export function Loading() {
  return (
    <div className="flex items-center gap-2 text-gray-500 text-sm py-10">
      <i className="fa-solid fa-circle-notch fa-spin" /> Carregando...
    </div>
  );
}
