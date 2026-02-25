import { notFound } from "next/navigation";
import { getContainerBySlug, containers } from "@/lib/containers";
import { ContainerDetailClient } from "./container-detail-client";

export function generateStaticParams() {
  return containers.map((c) => ({ slug: c.slug }));
}

export default async function ContainerDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const container = getContainerBySlug(slug);

  if (!container) {
    notFound();
  }

  return <ContainerDetailClient container={container} />;
}
