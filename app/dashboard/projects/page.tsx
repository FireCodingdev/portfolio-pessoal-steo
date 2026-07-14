"use client";

import { PageHeader, Card, Field, TextInput, TextArea, SaveBar, Loading, IconButton, AddButton } from "@/components/dashboard/FormKit";
import { useSection, novoId } from "@/lib/useSection";
import { defaultProjects, Project } from "@/lib/defaultContent";

export default function ProjectsEditor() {
  const { data, setData, carregando, salvando, status, salvar } = useSection<Project[]>("projects", defaultProjects);

  if (carregando) return <Loading />;

  function atualizar(i: number, campo: keyof Project, valor: any) {
    const novo = [...data];
    novo[i] = { ...novo[i], [campo]: valor };
    setData(novo);
  }

  return (
    <div>
      <PageHeader title="Projetos" description="Os projetos exibidos na sua vitrine de trabalhos." />

      <div className="space-y-4">
        {data.map((p, i) => (
          <Card key={p.id}>
            <div className="flex items-start gap-3">
              <Field label="Emoji">
                <TextInput value={p.emoji} onChange={(e) => atualizar(i, "emoji", e.target.value)} className="w-16 text-center text-lg" />
              </Field>
              <div className="flex-1">
                <Field label="Nome do projeto">
                  <TextInput value={p.nome} onChange={(e) => atualizar(i, "nome", e.target.value)} />
                </Field>
              </div>
              <div className="pt-6">
                <IconButton icon="fa-solid fa-trash" danger title="Remover projeto" onClick={() => setData(data.filter((_, idx) => idx !== i))} />
              </div>
            </div>
            <Field label="Descrição">
              <TextArea value={p.descricao} onChange={(e) => atualizar(i, "descricao", e.target.value)} />
            </Field>
            <Field label="Tags (separadas por vírgula)">
              <TextInput
                value={p.tags.join(", ")}
                onChange={(e) => atualizar(i, "tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                placeholder="Web, Full Stack..."
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Link do código (GitHub)">
                <TextInput value={p.linkCodigo} onChange={(e) => atualizar(i, "linkCodigo", e.target.value)} />
              </Field>
              <Field label="Link do demo">
                <TextInput value={p.linkDemo} onChange={(e) => atualizar(i, "linkDemo", e.target.value)} />
              </Field>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <AddButton
          label="Adicionar projeto"
          onClick={() =>
            setData([
              ...data,
              { id: novoId("proj"), emoji: "🚀", tags: [], nome: "Novo projeto", descricao: "", linkCodigo: "#", linkDemo: "#" },
            ])
          }
        />
      </div>

      <SaveBar onSave={() => salvar()} salvando={salvando} status={status} />
    </div>
  );
}
