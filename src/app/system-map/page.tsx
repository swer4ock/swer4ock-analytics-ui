"use client";

import React from "react";

export default function SystemMapPage() {
  return (
    <main style={{ padding: 0, margin: 0 }}>
      <iframe
        src="/docs/gemini.html"
        title="Интерактивная Карта Системы"
        style={{ border: "none", width: "100%", height: "100vh" }}
      />
    </main>
  );
}
