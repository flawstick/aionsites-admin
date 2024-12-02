import { isRTL } from "@/lib/utils";
import { useLocale } from "next-intl";

interface Direction {
  direction: "rtl" | "ltr";
  rtl: boolean;
}

export function useDirection(): Direction {
  const locale = useLocale();
  const direction = isRTL(locale) ? "rtl" : "ltr";
  const isRtl = direction === "rtl";
  return { direction, rtl: isRtl };
}
