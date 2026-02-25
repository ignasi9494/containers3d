"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone, Mail } from "lucide-react";

export function CtaSection() {
  const t = useTranslations("common");
  const contact = useTranslations("contact");

  return (
    <section className="bg-primary py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          {contact("subtitle")}
        </h2>
        <p className="mt-4 text-lg text-white/70">
          {useTranslations("hero")("subtitle")}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-accent-dark"
          >
            {t("requestQuote")}
          </Link>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <a
            href="tel:+34938764444"
            className="flex items-center gap-2 text-white/70 transition-colors hover:text-white"
          >
            <Phone className="h-5 w-5" />
            <span>(+34) 93 876 44 44</span>
          </a>
          <a
            href="mailto:vvsa@vilavila.com"
            className="flex items-center gap-2 text-white/70 transition-colors hover:text-white"
          >
            <Mail className="h-5 w-5" />
            <span>vvsa@vilavila.com</span>
          </a>
        </div>
      </div>
    </section>
  );
}
