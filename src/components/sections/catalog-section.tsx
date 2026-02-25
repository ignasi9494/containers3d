"use client";

import { useTranslations } from "next-intl";
import { containers } from "@/lib/containers";
import { ContainerCard3D } from "@/components/3d/container-card-3d";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export function CatalogSection() {
  const t = useTranslations("catalog");

  // Show a selection of products from each category as preview
  const previewContainers = containers.slice(0, 4);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-text sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-lg text-text-muted">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {previewContainers.map((container) => (
            <ContainerCard3D key={container.id} container={container} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {t("filterAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
