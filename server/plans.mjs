export const PLANS = {
  free: {
    id: "free",
    live: true,
    seats: 1,
    maxQueue: 12,
    twitch: true,
    tiktokUserKey: true,
    tiktokHosted: false,
    youtube: false,
    elevenlabsByok: false,
    extraFilters: false
  },
  plus: {
    id: "plus",
    live: false,
    seats: 1,
    maxQueue: 24,
    twitch: true,
    tiktokUserKey: true,
    tiktokHosted: false,
    youtube: false,
    elevenlabsByok: false,
    extraFilters: true
  },
  pro: {
    id: "pro",
    live: false,
    seats: 1,
    maxQueue: 40,
    twitch: true,
    tiktokUserKey: true,
    tiktokHosted: true,
    youtube: true,
    elevenlabsByok: true,
    extraFilters: true
  },
  ultra: {
    id: "ultra",
    live: false,
    seats: 3,
    maxQueue: 80,
    twitch: true,
    tiktokUserKey: true,
    tiktokHosted: true,
    youtube: true,
    elevenlabsByok: true,
    extraFilters: true
  }
};

export function priceTable() {
  return {
    plus: Number(process.env.PLUS_PRICE_CENTS || 1000),
    pro: Number(process.env.PRO_PRICE_CENTS || 1900),
    ultra: Number(process.env.ULTRA_PRICE_CENTS || 3900)
  };
}

export function publicPlans() {
  const prices = priceTable();
  return Object.values(PLANS).map((p) => ({
    ...p,
    priceCents: p.id === "free" ? 0 : prices[p.id] || null,
    billed: p.live ? "now" : "not_for_sale"
  }));
}
