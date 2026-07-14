import { getAllContent } from "@/lib/db";
import PublicSite, { PublicSiteContent } from "@/components/site/PublicSite";
import { defaultContentMap } from "@/lib/defaultContent";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let content: PublicSiteContent;
  try {
    content = (await getAllContent()) as PublicSiteContent;
  } catch {
    // Se o banco de dados ainda não estiver configurado, o site continua
    // funcionando normalmente com o conteúdo padrão.
    content = defaultContentMap as unknown as PublicSiteContent;
  }

  return <PublicSite content={content} />;
}
