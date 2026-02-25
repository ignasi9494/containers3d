"use client";

import { ModelViewerWrapper } from "./model-viewer-wrapper";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Container } from "@/types/container";
import { ArrowRight } from "lucide-react";

interface ContainerCard3DProps {
  container: Container;
}

export function ContainerCard3D({ container }: ContainerCard3DProps) {
  const t = useTranslations();

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-64 bg-surface">
        <ModelViewerWrapper
          src={container.modelPath}
          poster={container.posterPath}
          alt={t(container.nameKey)}
          autoRotate
          interactionPrompt={false}
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-text">
          {t(container.nameKey)}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-text-muted">
          {t(container.descriptionKey)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-text-muted">
            {container.specs.capacity}
          </span>
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-text-muted">
            {container.specs.length / 1000}m x{" "}
            {container.specs.width / 1000}m x{" "}
            {container.specs.height / 1000}m
          </span>
        </div>
        <Link
          href={`/catalog/${container.slug}`}
          className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-accent"
        >
          {t("common.viewDetails")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
