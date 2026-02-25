"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ModelViewerWrapper } from "@/components/3d/model-viewer-wrapper";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-primary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-light">
              {t("tagline")}
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
              {t("subtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center rounded-xl bg-accent px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-accent-dark hover:shadow-xl"
              >
                {t("cta")}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-bold text-white transition-all hover:border-white hover:bg-white/10"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[350px] w-full max-w-lg lg:h-[450px]">
            <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-sm" />
            <ModelViewerWrapper
              src="/models/skip-5m3.glb"
              alt="Contenidor 3D interactiu"
              autoRotate
              cameraOrbit="30deg 70deg 110%"
            />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-1 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path
            d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
