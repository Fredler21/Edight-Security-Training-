import { notFound } from "next/navigation";
import { getModuleBySlug, modules } from "@/data/modules";
import ModuleView from "@/components/ModuleView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const module = getModuleBySlug(slug);
  if (!module) return { title: "Module Not Found" };
  return {
    title: `${module.title} — EdLight Security Training`,
    description: module.description,
  };
}

export default async function ModulePage({ params }: Props) {
  const { slug } = await params;
  const module = getModuleBySlug(slug);

  if (!module) {
    notFound();
  }

  return <ModuleView module={module} />;
}
