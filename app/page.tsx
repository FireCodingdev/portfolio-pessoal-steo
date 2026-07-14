import { getAllContent } from "@/lib/db";
import PublicSite, { PublicSiteContent } from "@/components/site/PublicSite";
import { defaultContentMap } from "@/lib/defaultContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function HomePage() {
  let content: PublicSiteContent;
  try {
    content = (await getAllContent()) as PublicSiteContent;
  } catch (err) {
    // Se o banco de dados ainda não estiver configurado (ou a conexão falhar),
    // o site continua funcionando com o conteúdo padrão. O erro é logado para
    // que uma falha real de conexão não seja confundida com "o CRM não salva".
    console.error("Falha ao buscar conteúdo do banco, usando conteúdo padrão:", err);
    content = defaultContentMap as unknown as PublicSiteContent;
  }

  return <PublicSite content={content} />;
}
