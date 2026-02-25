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
  ArrowRight,
} from "lucide-react";

const services = [
  { key: "containers", Icon: Building2, color: "bg-red-50 text-primary" },
  { key: "transport", Icon: Truck, color: "bg-green-50 text-accent" },
  { key: "hazardous", Icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
  { key: "consulting", Icon: ClipboardCheck, color: "bg-blue-50 text-blue-600" },
  { key: "sanitation", Icon: Droplets, color: "bg-cyan-50 text-cyan-600" },
  { key: "confidential", Icon: FileKey, color: "bg-purple-50 text-purple-600" },
];

export default function ServicesPage() {
  const t = useTranslations("services");

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

        {/* Services Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ key, Icon, color }) => (
            <div
              key={key}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-text">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-primary p-8 text-center sm:p-12">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            {useTranslations("contact")("subtitle")}
          </h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-accent-dark"
            >
              {t("viewCatalog")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-bold text-white transition-all hover:border-white hover:bg-white/10"
            >
              {useTranslations("common")("contactUs")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
