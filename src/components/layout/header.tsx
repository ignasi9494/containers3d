"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/catalog", label: t("catalog") },
    { href: "/services", label: t("services") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  const languages = [
    { code: "ca" as const, label: "CA" },
    { code: "es" as const, label: "ES" },
    { code: "en" as const, label: "EN" },
  ];

  function switchLocale(newLocale: "es" | "ca" | "en") {
    router.replace(pathname, { locale: newLocale });
    setLangMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-xl font-extrabold text-primary tracking-tight">Vil&agrave; Vila</span>
          <span className="text-xs font-semibold text-accent leading-tight">Serveis<br />ambientals</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-text-muted transition-colors hover:bg-surface hover:text-primary"
            >
              <Globe className="h-4 w-4" />
              <span className="uppercase">{locale}</span>
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-20 overflow-hidden rounded-md border border-gray-100 bg-white shadow-lg">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLocale(lang.code)}
                    className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-surface ${
                      locale === lang.code
                        ? "font-semibold text-primary"
                        : "text-text-muted"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="hidden rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark sm:block"
          >
            {tc("requestQuote")}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-text-muted md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-surface hover:text-primary ${
                  pathname === link.href ? "text-primary bg-surface" : "text-text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 block rounded-lg bg-accent px-3 py-2 text-center text-base font-semibold text-white"
            >
              {tc("requestQuote")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
