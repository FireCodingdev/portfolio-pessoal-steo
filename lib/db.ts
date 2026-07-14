import { sql } from "@vercel/postgres";
import { defaultContentMap, ContentSection } from "./defaultContent";

let schemaReady = false;

/**
 * Cria as tabelas necessárias caso ainda não existam. É seguro chamar
 * várias vezes (idempotente) — usamos "IF NOT EXISTS" em tudo.
 */
export async function ensureSchema() {
  if (schemaReady) return;

  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      section TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      assunto TEXT,
      mensagem TEXT,
      status TEXT NOT NULL DEFAULT 'novo',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      meta JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  schemaReady = true;
}

// ---------- Conteúdo do site ----------

export async function getContent<T = any>(section: ContentSection): Promise<T> {
  await ensureSchema();
  const { rows } = await sql`SELECT data FROM site_content WHERE section = ${section} LIMIT 1;`;
  if (rows.length === 0) {
    return (defaultContentMap as any)[section] as T;
  }
  return rows[0].data as T;
}

export async function getAllContent() {
  await ensureSchema();
  const { rows } = await sql`SELECT section, data FROM site_content;`;
  const map: Record<string, any> = { ...defaultContentMap };
  for (const row of rows) {
    map[row.section] = row.data;
  }
  return map;
}

export async function setContent(section: ContentSection, data: any) {
  await ensureSchema();
  await sql`
    INSERT INTO site_content (section, data, updated_at)
    VALUES (${section}, ${JSON.stringify(data)}::jsonb, now())
    ON CONFLICT (section)
    DO UPDATE SET data = ${JSON.stringify(data)}::jsonb, updated_at = now();
  `;
}

// ---------- Leads (mensagens de contato) ----------

export async function createLead(input: {
  nome: string;
  email: string;
  assunto?: string;
  mensagem?: string;
}) {
  await ensureSchema();
  const { rows } = await sql`
    INSERT INTO leads (nome, email, assunto, mensagem)
    VALUES (${input.nome}, ${input.email}, ${input.assunto ?? ""}, ${input.mensagem ?? ""})
    RETURNING id, nome, email, assunto, mensagem, status, created_at;
  `;
  return rows[0];
}

export async function listLeads(limit = 200) {
  await ensureSchema();
  const { rows } = await sql`
    SELECT id, nome, email, assunto, mensagem, status, created_at
    FROM leads
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;
  return rows;
}

export async function updateLeadStatus(id: number, status: string) {
  await ensureSchema();
  await sql`UPDATE leads SET status = ${status} WHERE id = ${id};`;
}

export async function deleteLead(id: number) {
  await ensureSchema();
  await sql`DELETE FROM leads WHERE id = ${id};`;
}

export async function countLeads() {
  await ensureSchema();
  const { rows } = await sql`SELECT COUNT(*)::int AS total FROM leads;`;
  return rows[0].total as number;
}

export async function countLeadsSince(days: number) {
  await ensureSchema();
  const { rows } = await sql`
    SELECT COUNT(*)::int AS total FROM leads
    WHERE created_at >= now() - (${days} || ' days')::interval;
  `;
  return rows[0].total as number;
}

// ---------- Eventos (downloads de currículo, visualizações, etc.) ----------

export async function logEvent(type: string, meta: Record<string, any> = {}) {
  await ensureSchema();
  await sql`INSERT INTO events (type, meta) VALUES (${type}, ${JSON.stringify(meta)}::jsonb);`;
}

export async function countEvents(type: string) {
  await ensureSchema();
  const { rows } = await sql`SELECT COUNT(*)::int AS total FROM events WHERE type = ${type};`;
  return rows[0].total as number;
}

export async function countEventsSince(type: string, days: number) {
  await ensureSchema();
  const { rows } = await sql`
    SELECT COUNT(*)::int AS total FROM events
    WHERE type = ${type} AND created_at >= now() - (${days} || ' days')::interval;
  `;
  return rows[0].total as number;
}

/** Retorna contagem de eventos por dia (últimos N dias) para gráficos simples. */
export async function eventsPerDay(type: string, days = 14) {
  await ensureSchema();
  const { rows } = await sql`
    SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS dia, COUNT(*)::int AS total
    FROM events
    WHERE type = ${type} AND created_at >= now() - (${days} || ' days')::interval
    GROUP BY 1
    ORDER BY 1 ASC;
  `;
  return rows as { dia: string; total: number }[];
}

export async function leadsPerDay(days = 14) {
  await ensureSchema();
  const { rows } = await sql`
    SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS dia, COUNT(*)::int AS total
    FROM leads
    WHERE created_at >= now() - (${days} || ' days')::interval
    GROUP BY 1
    ORDER BY 1 ASC;
  `;
  return rows as { dia: string; total: number }[];
}

// ---------- Administrador ----------

export async function getAdminByEmail(email: string) {
  await ensureSchema();
  const { rows } = await sql`SELECT * FROM admin_users WHERE email = ${email} LIMIT 1;`;
  return rows[0] ?? null;
}

export async function countAdmins() {
  await ensureSchema();
  const { rows } = await sql`SELECT COUNT(*)::int AS total FROM admin_users;`;
  return rows[0].total as number;
}

export async function createAdmin(email: string, passwordHash: string) {
  await ensureSchema();
  const { rows } = await sql`
    INSERT INTO admin_users (email, password_hash)
    VALUES (${email}, ${passwordHash})
    RETURNING id, email;
  `;
  return rows[0];
}

export async function updateAdminPassword(email: string, passwordHash: string) {
  await ensureSchema();
  await sql`UPDATE admin_users SET password_hash = ${passwordHash} WHERE email = ${email};`;
}
