"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck, Clock, Award, Truck } from "lucide-react";

const featureIcons = [
  { key: "certified", Icon: ShieldCheck },
  { key: "emergency", Icon: Clock },
  { key: "experience", Icon: Award },
  { key: "transport", Icon: Truck },
];

export function FeaturesSection() {
  const t = useTranslations("features");

  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-extrabold text-text sm:text-4xl">
          {t("title")}
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureIcons.map(({ key, Icon }) => (
            <div
              key={key}
              className="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-text">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-text-muted">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
