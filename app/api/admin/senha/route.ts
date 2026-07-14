import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminByEmail, updateAdminPassword } from "@/lib/db";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const { senhaAtual, novaSenha } = await req.json();
  if (!senhaAtual || !novaSenha || String(novaSenha).length < 6) {
    return NextResponse.json(
      { erro: "Informe a senha atual e uma nova senha com pelo menos 6 caracteres." },
      { status: 400 }
    );
  }

  const admin = await getAdminByEmail(session.email);
  if (!admin) {
    return NextResponse.json({ erro: "Administrador não encontrado." }, { status: 404 });
  }

  const confere = await bcrypt.compare(senhaAtual, admin.password_hash);
  if (!confere) {
    return NextResponse.json({ erro: "Senha atual incorreta." }, { status: 401 });
  }

  const novoHash = await bcrypt.hash(novaSenha, 10);
  await updateAdminPassword(admin.email, novoHash);

  return NextResponse.json({ ok: true });
}
