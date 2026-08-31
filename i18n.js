(function () {
  var KEY = "voxstream-lang";
  var dict = {
    en: {
      "nav.home": "Home", "nav.how": "How", "nav.features": "Features", "nav.plans": "Plans",
      "nav.future": "Future", "nav.faq": "FAQ", "nav.account": "Account", "nav.studio": "Open studio",
      "home.kicker": "Live chat reader",
      "home.h1": "Twitch and TikTok chat, read out loud.",
      "home.lead": "Open it in Chrome. Nothing to install. Free needs no account.",
      "home.fine": "Free to use. Plus and Pro: sign in, then the Ko-fi shop. Stream tips, bits, and subs do not grant a plan.",
      "home.mock": "Studio preview",
      "how.h2": "How it works",
      "how.lead": "Three steps. Free never needs an account.",
      "how.s1t": "Open the studio", "how.s1p": "Use the link. Nothing to install.",
      "how.s2t": "Connect Twitch or TikTok", "how.s2p": "A live channel, or TikTok LIVE plus your Euler key.",
      "how.s3t": "Chat is read out loud", "how.s3p": "Click Probar voz once, then the chat is heard.",
      "how.more": "Need OBS? Open Stage from the studio header, or studio.html#stage.",
      "feat.h2": "What is live today (Free)",
      "feat.1t": "Live Twitch", "feat.1p": "Real chat. No password.",
      "feat.2t": "Demo", "feat.2p": "Practice messages so you can hear the voice and TikTok.",
      "feat.3t": "Real TikTok", "feat.3p": "Free Euler key plus an open LIVE.",
      "feat.4t": "Stage mode", "feat.4p": "Clean OBS view at #stage.",
      "feat.5t": "Filters", "feat.5p": "Gifts, follows, subs, bots, emotes.",
      "feat.6t": "Queue", "feat.6p": "Read queue with a cap, clear, and skip.",
      "feat.7t": "Twitch reconnect", "feat.7p": "If IRC drops, the studio joins again.",
      "feat.8t": "Bits", "feat.8p": "Reads Twitch bits. Bits do not grant a plan.",
      "plans.h2": "Plans",
      "plans.hint": "Plus or Pro: 1) sign in with GitHub or Google, 2) buy the VoxStream product in the Ko-fi shop with the same email. Stream tips do not count.",
      "plans.free": "Active", "plans.shop": "Ko-fi shop", "plans.later": "Later",
      "plans.f1": "Web studio", "plans.f2": "Live Twitch", "plans.f3": "Demo",
      "plans.f4": "TikTok with your Euler key", "plans.f5": "Stage mode",
      "plans.f6": "Browser voice", "plans.f7": "Filters, queue, bits",
      "plans.p1": "Extra filters", "plans.p2": "Longer queue", "plans.p3": "GitHub or Google account",
      "plans.pr1": "Everything in Plus", "plans.pr2": "Hosted TikTok later",
      "plans.pr3": "ElevenLabs BYOK later", "plans.pr4": "YouTube when it opens",
      "plans.u1": "Everything in Pro", "plans.u2": "Extra seats", "plans.u3": "Not this pass",
      "plans.buyPlus": "Buy Plus", "plans.buyPro": "Buy Pro",
      "acct.h1": "Account", "acct.lead": "Sign in to see your email and plan. Free needs no account.", "acct.out": "Not signed in", "acct.in": "Signed in", "acct.plan": "Plan", "acct.email": "Email", "acct.outbtn": "Sign out",
      "fut.h2": "What comes next",
      "fut.lead": "Same studio. No new SKUs. Nothing here is for sale as a new product.",
      "fut.1": "YouTube live chat (later)",
      "fut.2": "TikTok without pasting your Euler key (Pro)",
      "fut.3": "More voices",
      "fut.4": "Ultra seats later. Not this pass."
    },
    es: {
      "nav.home": "Inicio", "nav.how": "Cómo", "nav.features": "Hoy", "nav.plans": "Planes",
      "nav.future": "Futuro", "nav.faq": "FAQ", "nav.account": "Cuenta", "nav.studio": "Abrir estudio",
      "home.kicker": "Lector de chat en vivo",
      "home.h1": "El chat de Twitch y TikTok se oye solo.",
      "home.lead": "Ábrelo en Chrome. Sin instalar. Free no necesita cuenta.",
      "home.fine": "Uso gratuito. Plus y Pro: entra, luego la shop Ko-fi. Tips, bits y subs del stream no otorgan.",
      "home.mock": "Vista del estudio",
      "how.h2": "Cómo funciona",
      "how.lead": "Tres pasos. Free nunca necesita cuenta.",
      "how.s1t": "Abre el estudio", "how.s1p": "Entra al link. Sin instalar nada.",
      "how.s2t": "Conecta Twitch o TikTok", "how.s2p": "Canal en directo, o TikTok con LIVE y clave Euler.",
      "how.s3t": "El chat se lee solo", "how.s3p": "Un clic en Probar voz y el chat se oye.",
      "how.more": "¿OBS? Abre Escenario en el estudio, o studio.html#stage.",
      "feat.h2": "Qué hay hoy (Free)",
      "feat.1t": "Twitch en vivo", "feat.1p": "Chat real, sin contraseña.",
      "feat.2t": "Ensayo", "feat.2p": "Mensajes de prueba para oír la voz y TikTok.",
      "feat.3t": "TikTok real", "feat.3p": "Clave Euler gratis y el LIVE abierto.",
      "feat.4t": "Modo escenario", "feat.4p": "Vista limpia para OBS, en #stage.",
      "feat.5t": "Filtros", "feat.5p": "Regalos, follows, subs, bots y emotes.",
      "feat.6t": "Cola", "feat.6p": "Cola de lectura con tope, vaciar y saltar.",
      "feat.7t": "Twitch reconecta", "feat.7p": "Si se cae el IRC, el estudio vuelve a entrar.",
      "feat.8t": "Bits", "feat.8p": "Lee bits de Twitch. Los bits no otorgan plan.",
      "plans.h2": "Planes",
      "plans.hint": "Plus o Pro: 1) entra con GitHub o Google, 2) compra el producto VoxStream en la shop Ko-fi con el mismo email. Tips del stream no cuentan.",
      "plans.free": "Activo", "plans.shop": "Tienda Ko-fi", "plans.later": "Más adelante",
      "plans.f1": "Estudio web", "plans.f2": "Twitch en vivo", "plans.f3": "Ensayo",
      "plans.f4": "TikTok con tu clave Euler", "plans.f5": "Modo escenario",
      "plans.f6": "Voz del navegador", "plans.f7": "Filtros, cola, bits",
      "plans.p1": "Filtros extra", "plans.p2": "Cola más larga", "plans.p3": "Cuenta GitHub o Google",
      "plans.pr1": "Todo lo Plus", "plans.pr2": "TikTok hospedado, después",
      "plans.pr3": "ElevenLabs BYOK, después", "plans.pr4": "YouTube cuando abra",
      "plans.u1": "Todo lo Pro", "plans.u2": "Asientos extra", "plans.u3": "No es esta pasada",
      "plans.buyPlus": "Comprar Plus", "plans.buyPro": "Comprar Pro",
      "acct.h1": "Cuenta", "acct.lead": "Entra para ver tu email y plan. Free no necesita cuenta.", "acct.out": "No has entrado", "acct.in": "Sesión iniciada", "acct.plan": "Plan", "acct.email": "Email", "acct.outbtn": "Salir",
      "fut.h2": "Qué viene",
      "fut.lead": "El mismo estudio. Sin SKUs nuevos. Nada de esto se vende como producto extra.",
      "fut.1": "Chat de YouTube (después)",
      "fut.2": "TikTok sin pegar tu clave Euler (Pro)",
      "fut.3": "Más voces",
      "fut.4": "Asientos Ultra después. No es esta pasada."
    },
    pt: {
      "nav.home": "Início", "nav.how": "Como", "nav.features": "Recursos", "nav.plans": "Planos",
      "nav.future": "Futuro", "nav.faq": "FAQ", "nav.account": "Conta", "nav.studio": "Abrir estúdio",
      "home.kicker": "Leitor de chat ao vivo",
      "home.h1": "Chat da Twitch e TikTok, lido em voz alta.",
      "home.lead": "Abra no Chrome. Nada para instalar. O Free não precisa de conta.",
      "home.fine": "Grátis. Plus e Pro: entre, depois a loja Ko-fi. Tips, bits e subs do stream não dão plano.",
      "home.mock": "Prévia do estúdio",
      "how.h2": "Como funciona",
      "how.lead": "Três passos. O Free nunca precisa de conta.",
      "how.s1t": "Abra o estúdio", "how.s1p": "Use o link. Nada para instalar.",
      "how.s2t": "Conecte Twitch ou TikTok", "how.s2p": "Um canal ao vivo, ou TikTok LIVE com sua chave Euler.",
      "how.s3t": "O chat é lido em voz alta", "how.s3p": "Clique em Probar voz uma vez.",
      "how.more": "OBS? Abra Stage no estúdio, ou studio.html#stage.",
      "feat.h2": "O que está no ar hoje (Free)",
      "feat.1t": "Twitch ao vivo", "feat.1p": "Chat real. Sem senha.",
      "feat.2t": "Demo", "feat.2p": "Mensagens de prática para ouvir a voz.",
      "feat.3t": "TikTok real", "feat.3p": "Chave Euler grátis e LIVE aberto.",
      "feat.4t": "Modo palco", "feat.4p": "Vista limpa para OBS em #stage.",
      "feat.5t": "Filtros", "feat.5p": "Presentes, follows, subs, bots, emotes.",
      "feat.6t": "Fila", "feat.6p": "Fila de leitura com limite, limpar e pular.",
      "feat.7t": "Twitch reconecta", "feat.7p": "Se o IRC cair, o estúdio entra de novo.",
      "feat.8t": "Bits", "feat.8p": "Lê bits da Twitch. Bits não dão plano.",
      "plans.h2": "Planos",
      "plans.hint": "Plus ou Pro: 1) entre com GitHub ou Google, 2) compre na loja Ko-fi com o mesmo email. Tips do stream não contam.",
      "plans.free": "Ativo", "plans.shop": "Loja Ko-fi", "plans.later": "Depois",
      "plans.f1": "Estúdio web", "plans.f2": "Twitch ao vivo", "plans.f3": "Demo",
      "plans.f4": "TikTok com sua chave Euler", "plans.f5": "Modo palco",
      "plans.f6": "Voz do navegador", "plans.f7": "Filtros, fila, bits",
      "plans.p1": "Filtros extra", "plans.p2": "Fila maior", "plans.p3": "Conta GitHub ou Google",
      "plans.pr1": "Tudo do Plus", "plans.pr2": "TikTok hospedado depois",
      "plans.pr3": "ElevenLabs BYOK depois", "plans.pr4": "YouTube quando abrir",
      "plans.u1": "Tudo do Pro", "plans.u2": "Assentos extra", "plans.u3": "Não nesta etapa",
      "plans.buyPlus": "Comprar Plus", "plans.buyPro": "Comprar Pro",
      "acct.h1": "Conta", "acct.lead": "Entre para ver seu email e plano. O Free não precisa de conta.", "acct.out": "Não entrou", "acct.in": "Sessão iniciada", "acct.plan": "Plano", "acct.email": "Email", "acct.outbtn": "Sair",
      "fut.h2": "O que vem depois",
      "fut.lead": "O mesmo estúdio. Sem SKUs novos.",
      "fut.1": "Chat do YouTube (depois)",
      "fut.2": "TikTok sem colar sua chave Euler (Pro)",
      "fut.3": "Mais vozes",
      "fut.4": "Assentos Ultra depois. Não nesta etapa."
    },
    ja: {
      "nav.home": "ホーム", "nav.how": "使い方", "nav.features": "機能", "nav.plans": "プラン",
      "nav.future": "今後", "nav.faq": "FAQ", "nav.account": "アカウント", "nav.studio": "スタジオを開く",
      "home.kicker": "ライブチャット読み上げ",
      "home.h1": "TwitchとTikTokのチャットを読み上げます。",
      "home.lead": "Chromeで開くだけ。インストール不要。Freeはアカウント不要です。",
      "home.fine": "無料。PlusとProはログイン後にKo-fiショップ。配信のチップ・Bits・サブはプランになりません。",
      "home.mock": "スタジオのプレビュー",
      "how.h2": "使い方",
      "how.lead": "3ステップ。Freeにアカウントは不要です。",
      "how.s1t": "スタジオを開く", "how.s1p": "リンクを開くだけ。インストール不要。",
      "how.s2t": "TwitchかTikTokをつなぐ", "how.s2p": "配信中のチャンネル、またはLIVEとEulerキー。",
      "how.s3t": "チャットが読み上げられる", "how.s3p": "Probar vozを一度押します。",
      "how.more": "OBSはスタジオのStage、または studio.html#stage。",
      "feat.h2": "今使えるもの（Free）",
      "feat.1t": "Twitchライブ", "feat.1p": "本物のチャット。パスワードなし。",
      "feat.2t": "デモ", "feat.2p": "声とTikTokを試す練習メッセージ。",
      "feat.3t": "本物のTikTok", "feat.3p": "無料のEulerキーと開いているLIVE。",
      "feat.4t": "ステージ", "feat.4p": "OBS向けのきれいな表示（#stage）。",
      "feat.5t": "フィルター", "feat.5p": "ギフト、フォロー、サブ、ボット、エモート。",
      "feat.6t": "キュー", "feat.6p": "上限つき読み上げキュー。クリアとスキップ。",
      "feat.7t": "Twitch再接続", "feat.7p": "IRCが切れてもスタジオが入り直します。",
      "feat.8t": "Bits", "feat.8p": "Twitch Bitsを読みます。Bitsはプランになりません。",
      "plans.h2": "プラン",
      "plans.hint": "Plus / Pro：1) GitHubかGoogleで入る 2) 同じメールでKo-fiショップ。配信チップは無効。",
      "plans.free": "利用中", "plans.shop": "Ko-fiショップ", "plans.later": "あとで",
      "plans.f1": "Webスタジオ", "plans.f2": "Twitchライブ", "plans.f3": "デモ",
      "plans.f4": "自分のEulerキーでTikTok", "plans.f5": "ステージ",
      "plans.f6": "ブラウザ音声", "plans.f7": "フィルター、キュー、Bits",
      "plans.p1": "追加フィルター", "plans.p2": "長いキュー", "plans.p3": "GitHub / Googleアカウント",
      "plans.pr1": "Plusのすべて", "plans.pr2": "ホストTikTokは後",
      "plans.pr3": "ElevenLabs BYOKは後", "plans.pr4": "YouTubeは後から",
      "plans.u1": "Proのすべて", "plans.u2": "追加シート", "plans.u3": "今は対象外",
      "plans.buyPlus": "Plusを買う", "plans.buyPro": "Proを買う",
      "acct.h1": "アカウント", "acct.lead": "メールとプランを見るにはログイン。Freeはアカウント不要です。", "acct.out": "未ログイン", "acct.in": "ログイン中", "acct.plan": "プラン", "acct.email": "メール", "acct.outbtn": "ログアウト",
      "fut.h2": "これから",
      "fut.lead": "同じスタジオ。新しいSKUはありません。",
      "fut.1": "YouTubeライブチャット（後）",
      "fut.2": "Eulerキーを貼らないTikTok（Pro）",
      "fut.3": "声を増やす",
      "fut.4": "Ultraシートは後。今は対象外。"
    }
  };

  function readLang() {
    try {
      var v = localStorage.getItem(KEY);
      if (v && dict[v]) return v;
    } catch (e) {}
    return "en";
  }
  function writeLang(code) {
    try { localStorage.setItem(KEY, code); } catch (e) {}
  }
  function apply(code) {
    if (!dict[code]) code = "en";
    writeLang(code);
    document.documentElement.lang = code;
    var table = dict[code];
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var k = nodes[i].getAttribute("data-i18n");
      if (table[k]) nodes[i].textContent = table[k];
    }
    var btns = document.querySelectorAll("[data-i18n-bar] [data-lang]");
    for (var j = 0; j < btns.length; j++) {
      if (btns[j].getAttribute("data-lang") === code) btns[j].classList.add("on");
      else btns[j].classList.remove("on");
    }
  }
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    var code = t.getAttribute("data-lang");
    if (!code || !dict[code]) return;
    e.preventDefault();
    apply(code);
  });
  apply(readLang());
})();
