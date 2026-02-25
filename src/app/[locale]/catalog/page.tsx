"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { containers } from "@/lib/containers";
import { ContainerCard3D } from "@/components/3d/container-card-3d";
import type { ContainerCategory } from "@/types/container";

type Filter = "all" | ContainerCategory;

export default function CatalogPage() {
  const t = useTranslations("catalog");
  const [filter, setFilter] = useState<Filter>("all");

  const filteredContainers =
    filter === "all"
      ? containers
      : containers.filter((c) => c.category === filter);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "embalajes", label: t("filterEmbalajes") },
    { key: "contenedores", label: t("filterContenedores") },
    { key: "maquinaria", label: t("filterMaquinaria") },
  ];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-text sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-lg text-text-muted">{t("subtitle")}</p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-primary text-white"
                  : "bg-surface text-text-muted hover:bg-surface-dark"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-sm text-text-muted">
          {filteredContainers.length} {filter === "all" ? t("productCount") : t("productCountFiltered")}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredContainers.map((container) => (
            <ContainerCard3D key={container.id} container={container} />
          ))}
        </div>
      </div>
    </div>
  );
}
