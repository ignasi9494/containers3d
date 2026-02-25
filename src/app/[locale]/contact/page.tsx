"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { containers } from "@/lib/containers";
import { Phone, Mail, MapPin, Send } from "lucide-react";

interface ContactForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  containerType: string;
  message: string;
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const tc = useTranslations();
  const ft = useTranslations("footer");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>();

  async function onSubmit(data: ContactForm) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-text sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-lg text-text-muted">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text">
                    {t("name")} *
                  </label>
                  <input
                    {...register("name", { required: true })}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">Required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text">
                    {t("company")}
                  </label>
                  <input
                    {...register("company")}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text">
                    {t("email")} *
                  </label>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">Required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text">
                    {t("phone")}
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text">
                  {t("containerType")}
                </label>
                <select
                  {...register("containerType")}
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">{t("selectContainer")}</option>
                  {containers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {tc(c.nameKey)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text">
                  {t("message")} *
                </label>
                <textarea
                  {...register("message", { required: true })}
                  rows={5}
                  placeholder={t("messagePlaceholder")}
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">Required</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-accent-dark disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {t("submit")}
              </button>

              {status === "success" && (
                <p className="rounded-lg bg-green-50 p-3 text-center text-sm text-green-700">
                  {t("success")}
                </p>
              )}
              {status === "error" && (
                <p className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
                  {t("error")}
                </p>
              )}
            </form>
          </div>

          <div className="space-y-4">
            {/* Central Bages */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-text">{ft("centralBages")}</h3>
              <div className="mt-4 space-y-3">
                <a
                  href="tel:+34938764444"
                  className="flex items-center gap-3 text-sm text-text-muted transition-colors hover:text-primary"
                >
                  <Phone className="h-5 w-5 text-accent" />
                  (+34) 93 876 44 44
                </a>
                <a
                  href="mailto:vvsa@vilavila.com"
                  className="flex items-center gap-3 text-sm text-text-muted transition-colors hover:text-primary"
                >
                  <Mail className="h-5 w-5 text-accent" />
                  vvsa@vilavila.com
                </a>
                <div className="flex items-start gap-3 text-sm text-text-muted">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span>Pol. Ind. Pla dels Vinyats II, c/ de l&apos;Energia, 2, 08250 Sant Joan de Vilatorrada</span>
                </div>
              </div>
            </div>

            {/* Osona */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-text">{ft("osona")}</h3>
              <div className="mt-4 space-y-3">
                <a
                  href="tel:+34938572689"
                  className="flex items-center gap-3 text-sm text-text-muted transition-colors hover:text-primary"
                >
                  <Phone className="h-5 w-5 text-accent" />
                  (+34) 93 857 26 89
                </a>
                <a
                  href="mailto:osona@vilavila.com"
                  className="flex items-center gap-3 text-sm text-text-muted transition-colors hover:text-primary"
                >
                  <Mail className="h-5 w-5 text-accent" />
                  osona@vilavila.com
                </a>
                <div className="flex items-start gap-3 text-sm text-text-muted">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span>Pol. Ind. Can Valent&iacute;, c/ Torrent Fara&oacute;, 46, 08508 Les Masies de Voltreg&agrave;</span>
                </div>
              </div>
            </div>

            {/* Vallès */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-text">{ft("valles")}</h3>
              <div className="mt-4 space-y-3">
                <a
                  href="tel:+34937337700"
                  className="flex items-center gap-3 text-sm text-text-muted transition-colors hover:text-primary"
                >
                  <Phone className="h-5 w-5 text-accent" />
                  (+34) 93 733 77 00
                </a>
                <a
                  href="mailto:valles@vilavila.com"
                  className="flex items-center gap-3 text-sm text-text-muted transition-colors hover:text-primary"
                >
                  <Mail className="h-5 w-5 text-accent" />
                  valles@vilavila.com
                </a>
                <div className="flex items-start gap-3 text-sm text-text-muted">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span>Pol. Ind. La Llana, Avda. La Llana, 111, 08191 Rub&iacute;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
