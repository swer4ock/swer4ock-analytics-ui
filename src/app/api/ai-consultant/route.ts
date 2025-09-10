import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body?.messages as { role: 'user' | 'assistant'; content: string }[] | undefined;
    const last = messages?.[messages.length - 1]?.content || '';

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      // OpenAI Chat Completions API (non-streaming)
      const systemPrompt =
        'Ты — AI‑консультант по аналитике. Отвечай кратко и по делу. ' +
        'Если вопрос предполагает SQL к Supabase, опиши понятный шаг‑за‑шагом план запроса и названия вероятных представлений (например: analytics.v_bidder_summary, public.v_avito_analytics). ' +
        'Если требуется фильтр по компании, используй значения: seltka, iltech, mituroom. Не выдумывай данные — предлагай следующий шаг.';

      const openaiMessages = [
        { role: 'system', content: systemPrompt },
        ...(messages || []).map(m => ({ role: m.role, content: m.content })),
      ];

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: openaiMessages,
          temperature: 0.2,
          max_tokens: 600,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return new NextResponse(`OpenAI error: ${errText}`, { status: 502 });
      }
      const data = await res.json();
      const answer = data?.choices?.[0]?.message?.content ?? 'Не удалось получить ответ от модели.';
      return NextResponse.json({ answer });
    }

    // Fallback: Заглушка ответа
    const answer = `Пока я заглушка (без OPENAI_API_KEY). Вы спросили: "${last}". ` +
      `Когда зададите ключ, буду вызывать OpenAI и подсказывать, какие представления Supabase использовать (например, analytics.v_bidder_summary, public.v_avito_analytics) с фильтром p_company (seltka/iltech/mituroom).`;
    return NextResponse.json({ answer });
  } catch (e: any) {
    return new NextResponse(`Bad Request: ${e?.message || e}`, { status: 400 });
  }
}
