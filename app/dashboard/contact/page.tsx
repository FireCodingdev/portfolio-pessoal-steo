"use client";

import { PageHeader, Card, Field, TextInput, TextArea, SaveBar, Loading } from "@/components/dashboard/FormKit";
import { useSection } from "@/lib/useSection";
import { defaultContact, ContactContent } from "@/lib/defaultContent";

export default function ContactEditor() {
  const { data, setData, carregando, salvando, status, salvar } = useSection<ContactContent>("contact", defaultContact);

  if (carregando) return <Loading />;

  return (
    <div>
      <PageHeader title="Contato" description="Seus canais de contato exibidos no site." />

      <Card>
        <Field label="Texto de introdução">
          <TextArea value={data.textoIntro} onChange={(e) => setData({ ...data, textoIntro: e.target.value })} />
        </Field>
        <Field label="Email">
          <TextInput value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
        </Field>
      </Card>

      <Card className="mt-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Link do LinkedIn">
            <TextInput value={data.linkedin} onChange={(e) => setData({ ...data, linkedin: e.target.value })} />
          </Field>
          <Field label="Texto exibido do LinkedIn">
            <TextInput value={data.linkedinLabel} onChange={(e) => setData({ ...data, linkedinLabel: e.target.value })} />
          </Field>
          <Field label="Link do GitHub">
            <TextInput value={data.github} onChange={(e) => setData({ ...data, github: e.target.value })} />
          </Field>
          <Field label="Texto exibido do GitHub">
            <TextInput value={data.githubLabel} onChange={(e) => setData({ ...data, githubLabel: e.target.value })} />
          </Field>
          <Field label="WhatsApp (com DDI+DDD, só números)" hint="Ex: 5511932056685">
            <TextInput value={data.whatsapp} onChange={(e) => setData({ ...data, whatsapp: e.target.value })} />
          </Field>
          <Field label="Texto exibido do WhatsApp">
            <TextInput value={data.whatsappLabel} onChange={(e) => setData({ ...data, whatsappLabel: e.target.value })} />
          </Field>
        </div>
      </Card>

      <SaveBar onSave={() => salvar()} salvando={salvando} status={status} />
    </div>
  );
}
