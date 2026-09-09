/* voxstream-i18n 3 */
(function () {
  var KEY = "voxstream-lang";
  var dict = {
    en: {
      "nav.home": "Home", "nav.how": "How", "nav.features": "Features", "nav.plans": "Plans",
      "nav.future": "Future", "nav.faq": "FAQ", "nav.account": "Account", "nav.studio": "Open studio",
      "home.kicker": "Live chat reader",
      "home.h1": "Twitch chat, read out loud.",
      "home.lead": "Open it in Chrome. Nothing to install. Free needs no account.",
      "home.fine": "Free to use. Plus and Pro: sign in, then the Ko-fi shop. Stream tips, bits, and subs do not grant a plan.",
      "home.mock": "Studio preview",
      "how.h2": "How it works",
      "how.lead": "Three steps. Free never needs an account.",
      "how.s1t": "Open the studio", "how.s1p": "Use the link. Nothing to install.",
      "how.s2t": "Connect Twitch", "how.s2p": "A live channel. No password.",
      "how.s3t": "Chat is read out loud", "how.s3p": "Click Probar voz once, then the chat is heard.",
      "how.more": "Need OBS? Open Stage from the studio header, or studio.html#stage.",
      "feat.h2": "What is live today (Free)",
      "feat.1t": "Live Twitch", "feat.1p": "Real chat. No password.",
      "feat.2t": "Demo", "feat.2p": "Practice messages so you can hear the voice.",
      "feat.3t": "Browser voice", "feat.3p": "Chrome reads the chat after Test voice.",
      "feat.4t": "Stage mode", "feat.4p": "Clean OBS view at #stage.",
      "feat.5t": "Filters", "feat.5p": "Gifts, follows, subs, bots, emotes.",
      "feat.6t": "Queue", "feat.6p": "Read queue with a cap, clear, and skip.",
      "feat.7t": "Twitch reconnect", "feat.7p": "If IRC drops, the studio joins again.",
      "feat.8t": "Bits", "feat.8p": "Reads Twitch bits. Bits do not grant a plan.",
      "plans.h2": "Plans",
      "plans.hint": "Plus or Pro: 1) sign in with GitHub or Google, 2) buy the VoxStream product in the Ko-fi shop with the same email. Stream tips do not count.",
      "plans.free": "Active", "plans.shop": "Ko-fi shop", "plans.later": "Later",
      "plans.f1": "Web studio", "plans.f2": "Live Twitch", "plans.f3": "Demo",
      "plans.f4": "Read aloud", "plans.f5": "Stage mode",
      "plans.f6": "Browser voice", "plans.f7": "Filters, queue, bits",
      "plans.p1": "Extra filters", "plans.p2": "Longer queue", "plans.p3": "GitHub or Google account",
      "plans.pr1": "Everything in Plus", "plans.pr2": "Longer queue than Plus",
      "plans.pr3": "ElevenLabs BYOK later", "plans.pr4": "YouTube when it opens",
      "plans.u1": "Everything in Pro", "plans.u2": "Extra seats", "plans.u3": "Not this pass",
      "plans.buyPlus": "Buy Plus", "plans.buyPro": "Buy Pro",
      "acct.h1": "Account", "acct.lead": "Sign in to see your email and plan. Free needs no account.", "acct.out": "Not signed in", "acct.in": "Signed in", "acct.plan": "Plan", "acct.email": "Email", "acct.outbtn": "Sign out",
      "fut.h2": "What comes next",
      "fut.lead": "Same studio. No new SKUs. Nothing here is for sale as a new product.",
      "fut.1": "YouTube live chat (later)",
      "fut.2": "Custom domain later",
      "fut.3": "More voices",
      "fut.4": "Ultra seats later. Not this pass."
    },
  };

  function apply() {
    document.documentElement.lang = "en";
    var table = dict.en;
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var k = nodes[i].getAttribute("data-i18n");
      if (table[k]) nodes[i].textContent = table[k];
    }
  }
  apply();
})();
