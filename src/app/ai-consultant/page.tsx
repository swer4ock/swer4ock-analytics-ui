"use client";

import React, { useEffect, useState } from "react";

export default function AIConsultantPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendWith = async (text: string) => {
    if (!text.trim()) return;
    const next: { role: "user" | "assistant"; content: string }[] = [
      ...messages,
      { role: "user" as const, content: text },
    ];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Ошибка: ${e?.message || e}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!input.trim()) return;
    await sendWith(input);
  };

  // Автозапуск запроса из параметра URL ?q=...
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const q = url.searchParams.get('q');
    if (q) {
      // Если сообщений ещё не было — автозапуск
      if (messages.length === 0) {
        // Небольшая задержка, чтобы UI успел смонтироваться
        setTimeout(() => { void sendWith(q); }, 50);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>🤖 AI‑консультант по данным</h1>
      <p style={{ color: '#6c757d', marginBottom: 16 }}>
        Задайте вопрос по данным (Avito, продажи, стратегии). В следующей итерации подключим реальный LLM (Gemini/OpenAI) и Supabase‑grounding.
      </p>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, minHeight: 360, background: '#fff' }}>
        {messages.length === 0 && (
          <div style={{ color: '#888' }}>Пока нет сообщений. Спросите, например: «Покажи контакты по Казани для Сэлтка за последние 7 дней»</div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} style={{
            padding: '8px 12px',
            margin: '8px 0',
            borderRadius: 8,
            background: m.role === 'user' ? '#e7f3ff' : '#f8f9fa',
            border: '1px solid #e1e1e1'
          }}>
            <strong>{m.role === 'user' ? 'Вы' : 'Консультант'}:</strong> {m.content}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Ваш вопрос..."
          style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #e1e1e1' }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #e1e1e1', background: '#4f46e5', color: '#fff', fontWeight: 600 }}
        >
          {loading ? 'Отправка…' : 'Отправить'}
        </button>
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: '#6c757d' }}>
        Подключение к реальной модели потребует API ключ и доступ к Supabase. Эту заглушку можно расширить для ответов с графиками и SQL.
      </div>
    </main>
  );
}
