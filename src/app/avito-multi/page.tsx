"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function AvitoMultiCompanyPage() {
  const search = useSearchParams();
  const query = search?.toString();
  const src = query ? `/docs/compani-avito.html?${query}` : "/docs/compani-avito.html";
  return (
    <main style={{ padding: 0, margin: 0 }}>
      <iframe
        src={src}
        title="Дашборд Авито: несколько компаний"
        style={{ border: "none", width: "100%", height: "100vh" }}
      />
    </main>
  );
}
