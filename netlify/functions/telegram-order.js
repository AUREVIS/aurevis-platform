export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), { status: 405 });
  }

  const token = Netlify.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Netlify.env.get("TELEGRAM_CHAT_ID");

  if (!token || !chatId) {
    return new Response(JSON.stringify({ ok: false, error: "Telegram is not configured" }), { status: 500 });
  }

  const payload = await request.json();
  const text = payload?.text || "AUREVIS test message";

  const telegram = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });

  const result = await telegram.json();
  return new Response(JSON.stringify(result), {
    status: telegram.ok ? 200 : 502,
    headers: { "Content-Type": "application/json" }
  });
};
