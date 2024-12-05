"use client";

import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Locale, usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { CheckIcon, Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDirection } from "@/hooks/use-direction";
import { useTranslations } from "next-intl";

export function LocaleSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const { direction } = useDirection();
  const locale = useLocale();
  const t = useTranslations("LocaleSwitcher");
  const locales: Locale[] = ["en", "he"];

  const localeMap: Record<Locale, string> = {
    en: "English",
    he: "עברית",
  };

  function onChange(value: string) {
    const nextLocale = value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }

  return (
    <DropdownMenu dir={direction}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isPending}>
                <Languages className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>{t("language")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent>
        {locales.map((value) => (
          <DropdownMenuItem
            onSelect={() => onChange(value)}
            key={value}
            className="flex items-center justify-between"
          >
            {localeMap[value]}
            {value === locale && <CheckIcon className="h-3 w-3" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
