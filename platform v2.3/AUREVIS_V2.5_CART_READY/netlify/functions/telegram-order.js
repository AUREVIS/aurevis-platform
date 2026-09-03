export default async (request) => {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  const token = Netlify.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Netlify.env.get("TELEGRAM_CHAT_ID");

  if (!token || !chatId) {
    return json({ ok: false, error: "Telegram is not configured" }, 500);
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const clean = (value, fallback = "—") => {
    const result = String(value ?? "").trim().slice(0, 500);
    return result || fallback;
  };

  const money = (value) => `${new Intl.NumberFormat("hy-AM").format(Number(value || 0))} ֏`;
  const items = Array.isArray(payload?.items) ? payload.items.slice(0, 60) : [];

  if (!payload?.orderNumber || !payload?.phone || !payload?.address || !items.length) {
    return json({ ok: false, error: "Missing order information" }, 400);
  }

  const itemLines = items.map((item, index) => {
    const quantity = Math.max(1, Number(item?.quantity || 1));
    const price = Math.max(0, Number(item?.price || 0));
    const volume = clean(item?.volume, "");
    return `${index + 1}. ${clean(item?.name)}${volume ? ` (${volume})` : ""} × ${quantity} — ${money(price * quantity)}`;
  });

  const benefitLines = payload?.isHoReCa
    ? [
        "",
        "🏢 HoReCa պատվեր",
        `🎁 Սառույցի նվեր՝ ${Math.max(0, Number(payload?.iceGiftKg || 0))} կգ`,
        `💰 Cashback՝ ${Math.max(0, Number(payload?.cashbackRate || 0))}%`,
      ]
    : [];

  const paymentLabels = {
    cash: "Կանխիկ՝ առաքման պահին",
    card: "Քարտով՝ առաքման պահին",
    transfer: "Փոխանցումով / հետվճարով",
  };
  const paymentMethod = paymentLabels[payload?.paymentMethod] || paymentLabels.cash;

  const text = [
    "🛍 ՆՈՐ ՊԱՏՎԵՐ — AUREVIS",
    `Պատվեր՝ #${clean(payload.orderNumber)}`,
    "",
    `👤 Հաճախորդ՝ ${clean(payload.customer)}`,
    `📞 Հեռախոս՝ ${clean(payload.phone)}`,
    `📍 Հասցե՝ ${clean(payload.address)}`,
    "",
    "Ապրանքներ՝",
    ...itemLines,
    "",
    `💳 Ընդհանուր՝ ${money(payload.total)}`,
    `💵 Վճարում՝ ${paymentMethod}`,
    `📝 Նշում՝ ${clean(payload.notes)}`,
    ...benefitLines,
  ].join("\n").slice(0, 4096);

  const telegram = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  const result = await telegram.json();
  return json(result, telegram.ok ? 200 : 502);
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
