import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { countAdmins, createAdmin, getAdminByEmail } from "@/lib/db";
import { signSessionToken, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ erro: "Informe email e senha." }, { status: 400 });
    }

    const emailNormalizado = String(email).trim().toLowerCase();
    const total = await countAdmins();

    // Primeiro acesso: se ainda não existe nenhum administrador cadastrado no
    // banco, provisionamos automaticamente usando as variáveis de ambiente
    // ADMIN_EMAIL e ADMIN_PASSWORD definidas na Vercel.
    if (total === 0) {
      const envEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
      const envPassword = process.env.ADMIN_PASSWORD || "";

      if (!envEmail || !envPassword) {
        return NextResponse.json(
          {
            erro:
              "Nenhum administrador configurado. Defina ADMIN_EMAIL e ADMIN_PASSWORD nas variáveis de ambiente da Vercel.",
          },
          { status: 500 }
        );
      }

      if (emailNormalizado !== envEmail || password !== envPassword) {
        return NextResponse.json({ erro: "Email ou senha inválidos." }, { status: 401 });
      }

      const hash = await bcrypt.hash(envPassword, 10);
      await createAdmin(envEmail, hash);

      const token = await signSessionToken({ email: envEmail });
      const res = NextResponse.json({ ok: true });
      res.cookies.set(sessionCookieOptions.name, token, sessionCookieOptions);
      return res;
    }

    const admin = await getAdminByEmail(emailNormalizado);
    if (!admin) {
      return NextResponse.json({ erro: "Email ou senha inválidos." }, { status: 401 });
    }

    const confere = await bcrypt.compare(password, admin.password_hash);
    if (!confere) {
      return NextResponse.json({ erro: "Email ou senha inválidos." }, { status: 401 });
    }

    const token = await signSessionToken({ email: admin.email });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(sessionCookieOptions.name, token, sessionCookieOptions);
    return res;
  } catch (err: any) {
    return NextResponse.json({ erro: err.message || "Erro ao fazer login." }, { status: 500 });
  }
}
