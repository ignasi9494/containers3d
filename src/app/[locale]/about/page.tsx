"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Building2,
  Truck,
  AlertTriangle,
  ClipboardCheck,
  Droplets,
  FileKey,
  ShieldCheck,
  Award,
  Leaf,
} from "lucide-react";

const serviceIcons = {
  containers: Building2,
  transport: Truck,
  hazardous: AlertTriangle,
  consulting: ClipboardCheck,
  sanitation: Droplets,
  confidential: FileKey,
};

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-text sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-lg text-text-muted">{t("subtitle")}</p>
        </div>

        {/* Description + History */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-base leading-relaxed text-text-muted">
              {t("description")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              {t("history")}
            </p>
          </div>

          <div className="rounded-2xl bg-primary p-8 text-white">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-accent-light" />
              <h2 className="text-xl font-bold">{t("certificationsTitle")}</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              {t("certificationsDesc")}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, label: "ISO 9001:2015" },
                { icon: Leaf, label: "ISO 14001:2015" },
                { icon: FileKey, label: "UNE-EN 15713" },
                { icon: Award, label: "EcoVadis Silver" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2"
                >
                  <Icon className="h-4 w-4 text-accent-light" />
                  <span className="text-xs font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-extrabold text-text sm:text-3xl">
            {t("servicesTitle")}
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(
              Object.keys(serviceIcons) as Array<keyof typeof serviceIcons>
            ).map((key) => {
              const Icon = serviceIcons[key];
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-text">
                    {t(`services.${key}`)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-accent-dark hover:shadow-xl"
          >
            {useTranslations("services")("viewCatalog")}
          </Link>
        </div>
      </div>
    </div>
  );
}
