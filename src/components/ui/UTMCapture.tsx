"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";
import { UTM_KEYS } from "@/lib/utm";

/**
 * Reads utm_* params from the current URL query string and writes any present
 * values into React Hook Form state. Generic over the form shape — used by both
 * the lead form and the quote calculator (both include the utm_* fields).
 *
 * Must be rendered inside a <Suspense> boundary because useSearchParams()
 * requires one in the App Router.
 */
export function UTMCapture<T extends FieldValues>({
  setValue,
}: {
  setValue: UseFormSetValue<T>;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    for (const key of UTM_KEYS) {
      const val = searchParams.get(key);
      if (val) setValue(key as Path<T>, val as PathValue<T, Path<T>>);
    }
  }, [searchParams, setValue]);
  return null;
}
