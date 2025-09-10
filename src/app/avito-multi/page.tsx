"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

function AvitoMultiComponent() {
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

export default function AvitoMultiCompanyPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: 'center', color: '#6c757d' }}>Загрузка...</div>}>
      <AvitoMultiComponent />
    </Suspense>
  );
}
