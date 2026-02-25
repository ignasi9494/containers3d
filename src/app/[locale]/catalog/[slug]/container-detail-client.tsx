"use client";

import { useTranslations } from "next-intl";
import { ContainerViewer } from "@/components/3d/container-viewer";
import { ContainerCard3D } from "@/components/3d/container-card-3d";
import { Link } from "@/i18n/navigation";
import { containers } from "@/lib/containers";
import type { Container } from "@/types/container";
import { ArrowLeft } from "lucide-react";

interface ContainerDetailClientProps {
  container: Container;
}

export function ContainerDetailClient({
  container,
}: ContainerDetailClientProps) {
  const t = useTranslations();

  const relatedContainers = containers
    .filter(
      (c) => c.category === container.category && c.id !== container.id
    )
    .slice(0, 3);

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/catalog"
          className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("nav.catalog")}
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContainerViewer
              src={container.modelPath}
              poster={container.posterPath}
              alt={t(container.nameKey)}
              className="h-[400px] lg:h-[500px]"
            />
          </div>

          <div className="lg:col-span-2">
            <h1 className="text-3xl font-extrabold text-text">
              {t(container.nameKey)}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-text-muted">
              {t(container.descriptionKey)}
            </p>

            <div className="mt-6">
              <h2 className="text-lg font-bold text-text">
                {t("catalog.specs")}
              </h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="bg-surface px-4 py-3 text-sm font-medium text-text-muted">
                        {t("common.dimensions")}
                      </td>
                      <td className="px-4 py-3 text-sm text-text">
                        {container.specs.length / 1000}m x{" "}
                        {container.specs.width / 1000}m x{" "}
                        {container.specs.height / 1000}m
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-surface px-4 py-3 text-sm font-medium text-text-muted">
                        {t("common.capacity")}
                      </td>
                      <td className="px-4 py-3 text-sm text-text">
                        {container.specs.capacity}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-surface px-4 py-3 text-sm font-medium text-text-muted">
                        {t("common.weight")}
                      </td>
                      <td className="px-4 py-3 text-sm text-text">
                        {container.specs.weight} kg
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-surface px-4 py-3 text-sm font-medium text-text-muted">
                        {t("common.material")}
                      </td>
                      <td className="px-4 py-3 text-sm text-text">
                        {container.specs.material}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-bold text-text">{t("catalog.idealUses")}</h2>
              <p className="mt-2 text-sm text-text-muted">
                {t(container.useCasesKey)}
              </p>
            </div>

            <Link
              href="/contact"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-accent px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-accent-dark"
            >
              {t("common.requestQuote")}
            </Link>
          </div>
        </div>

        {relatedContainers.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-text">
              {t("catalog.relatedContainers")}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedContainers.map((c) => (
                <ContainerCard3D key={c.id} container={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
