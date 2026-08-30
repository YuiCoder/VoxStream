const $=id=>document.getElementById(id);
const copy={
es:{live:"AL AIRE",idle:"EN ESPERA",connect:"Conectar",cut:"Cortar",src:"Fuentes",
twH:"Escribe tu canal, sin #. El chat se lee en vivo. No pide contraseña.",
ttH:"Usuario sin @. En esta web pública TikTok se prueba con Ensayo. Twitch sí es chat real.",
twPh:"canal, sin #",ttPh:"usuario, sin @",demo:"Ensayo",demoH:"Chat simulado para probar la voz.",
voice:"Voz",ttsOn:"Leer en voz alta",name:"Decir el nombre",test:"Probar voz",
pause:"Pausa",resume:"Seguir",skip:"Saltar",waiting:"En silencio",reading:"Leyendo",
queue:"en cola",speak:"Voxlive listo para leer tu chat.",stage:"Escenario",studio:"Estudio",
rate:"Velocidad",voiceL:"Voz",twOk:"Escuchando el chat",twBad:"No se pudo abrir Twitch.",
ttWeb:"En esta página TikTok usa Ensayo. Twitch sí es real."},
en:{live:"ON AIR",idle:"IDLE",connect:"Connect",cut:"Cut",src:"Sources",
twH:"Channel, no #. Live chat. No password.",
ttH:"Username, no @. On this public page TikTok uses Rehearsal. Twitch is live.",
twPh:"channel, no #",ttPh:"username, no @",demo:"Rehearsal",demoH:"Simulated chat to try the voice.",
voice:"Voice",ttsOn:"Read aloud",name:"Say the name",test:"Test voice",
pause:"Pause",resume:"Resume",skip:"Skip",waiting:"Silent",reading:"Reading",
queue:"queued",speak:"Voxlive is ready to read your chat.",stage:"Stage",studio:"Studio",
rate:"Rate",voiceL:"Voice",twOk:"Listening to chat",twBad:"Could not open Twitch.",
ttWeb:"On this page TikTok uses Rehearsal. Twitch is live."}
};
let lang="es",ttsOn=true,readName=true,paused=false,rate=1,twitchOn=false,tiktokOn=false,demoOn=true;
let twitchSock=null,demoTimer=null,selectedVoice="",speaking=null,msgN=0;
const queue=[],feed=$("feed");
const demoScript=[
{platform:"tiktok",kind:"chat",user:"valeria.r",display:"valeria.r",text:"hola, acabo de entrar"},
{platform:"twitch",kind:"chat",user:"nexo_",display:"nexo_",text:"vamos con todo hoy"},
{platform:"tiktok",kind:"gift",user:"mar.ok",display:"mar.ok",text:"envió Rosa",giftName:"Rosa",giftCount:5},
{platform:"twitch",kind:"chat",user:"SofiaPlays",display:"SofiaPlays",text:"ese clip estuvo brutal"},
{platform:"tiktok",kind:"follow",user:"diego.live",display:"diego.live",text:"empezó a seguir"},
{platform:"twitch",kind:"bits",user:"kai",display:"kai",text:"cheer 100",bits:100},
{platform:"tiktok",kind:"chat",user:"luna.tt",display:"luna.tt",text:"ponte esa canción otra vez"},
{platform:"twitch",kind:"sub",user:"mira",display:"mira",text:"se suscribió"}
];
const t=()=>copy[lang];
function applyLang(){const c=t();$("h-src").textContent=c.src;$("h-voice").textContent=c.voice;$("twitch-h").textContent=c.twH;$("tiktok-h").textContent=c.ttH;$("demo-l").textContent=c.demo;$("demo-h").textContent=c.demoH;$("tts-l").textContent=c.ttsOn;$("name-l").textContent=c.name;$("test").textContent=c.test;$("skip").textContent=c.skip;$("pause").textContent=paused?c.resume:c.pause;$("twitch").placeholder=c.twPh;$("tiktok").placeholder=c.ttPh;$("twitch-btn").textContent=twitchOn?c.cut:c.connect;$("tiktok-btn").textContent=tiktokOn?c.cut:c.connect;$("now-k").textContent=speaking?c.reading:c.waiting;$("stage").textContent=document.body.classList.contains("stage")?c.studio:c.stage;$("rate-l").textContent=c.rate;$("voice-l").textContent=c.voiceL;refreshPill();}
function escapeHtml(s){return String(s).replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">");}
function initials(name){const raw=String(name||"?").trim();return raw.slice(0,2).toUpperCase();}
function clock(ts){const d=new Date(ts||Date.now());return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");}
function setDot(id,state){$(id).className="dot"+(state==="live"?" live":state==="error"?" err":state==="connecting"?" wait":"");}
function refreshPill(){const live=twitchOn||tiktokOn||demoOn;$("livepill").textContent=live?t().live:t().idle;$("livepill").className="pill"+(live?"":" off");$("msgcount").textContent=msgN?msgN+" "+(lang==="es"?"mensajes":"messages"):"";}
function addMsg(m){msgN++;const wrap=document.createElement("article");wrap.className="msg"+(m.kind!=="chat"?" event":"");wrap.innerHTML='<div class="av">'+escapeHtml(initials(m.displayName||m.user))+'</div><div><div class="name">'+escapeHtml(m.displayName||m.user)+(m.source==="demo"?'<span class="tag">Ensayo</span>':'')+'</div><div class="body">'+escapeHtml(m.text||'')+'</div></div><div><div class="time">'+clock(m.ts)+'</div><div class="plat">'+escapeHtml(m.platform||'')+'</div></div>';feed.appendChild(wrap);feed.scrollTop=feed.scrollHeight;while(feed.children.length>220)feed.removeChild(feed.firstChild);refreshPill();considerSpeak(m);}
function speechText(m){const name=readName?(m.displayName||m.user):"";const es=lang==="es";if(m.kind==="gift"){const g=m.giftName||(es?"un regalo":"a gift");const n=m.giftCount&&m.giftCount>1?" x"+m.giftCount:"";return es?(name?name+" envió "+g+n:"enviaron "+g+n):(name?name+" sent "+g+n:"sent "+g+n);}if(m.kind==="follow")return es?(name?name+" empezó a seguir":"nuevo follow"):(name?name+" followed":"new follow");if(m.kind==="sub")return es?(name?name+" se suscribió":"nueva suscripción"):(name?name+" subscribed":"new sub");if(m.kind==="bits")return es?(name?name+" mandó "+(m.bits||"")+" bits":"bits"):(name?name+" cheered "+(m.bits||"")+" bits":"bits");if(name)return es?name+" dice: "+m.text:name+" says: "+m.text;return m.text||"";}
function considerSpeak(m){if(!ttsOn||m.kind==="system")return;if(m.kind==="chat"&&String(m.text||"").trim().startsWith("!"))return;queue.push(m);$("q").textContent=queue.length+" "+t().queue;kick();}
function pickVoice(){const voices=speechSynthesis.getVoices();if(selectedVoice){const exact=voices.find(v=>v.name===selectedVoice);if(exact)return exact;}return voices.find(v=>v.lang.toLowerCase().startsWith(lang))||voices[0]||null;}
function fillVoices(){const sel=$("voice");const voices=speechSynthesis.getVoices();const prev=selectedVoice||sel.value;sel.innerHTML="";voices.forEach(v=>{const o=document.createElement("option");o.value=v.name;o.textContent=v.name+" ("+v.lang+")";sel.appendChild(o);});if(prev&&[...sel.options].some(o=>o.value===prev))sel.value=prev;selectedVoice=sel.value;}
function kick(){if(paused||speaking||!window.speechSynthesis)return;const next=queue.shift();$("q").textContent=queue.length+" "+t().queue;if(!next){speaking=null;$("now-k").textContent=t().waiting;$("now-text").textContent="—";$("now-user").textContent="";return;}speaking=next;$("now-k").textContent=t().reading;$("now-text").textContent=next.text||"";$("now-user").textContent=(next.displayName||next.user||"")+(next.platform?" · "+next.platform:"");const u=new SpeechSynthesisUtterance(speechText(next));u.lang=lang==="es"?"es-US":"en-US";u.rate=rate;const pref=pickVoice();if(pref)u.voice=pref;u.onend=()=>{speaking=null;kick();};u.onerror=()=>{speaking=null;kick();};speechSynthesis.speak(u);}
function startDemo(){stopDemo();demoOn=true;$("demo").checked=true;let i=0;const tick=()=>{const item=demoScript[i%demoScript.length];i++;addMsg({platform:item.platform,kind:item.kind,user:item.user,displayName:item.display,text:item.text,giftName:item.giftName,giftCount:item.giftCount,bits:item.bits,ts:Date.now(),source:"demo"});};tick();demoTimer=setInterval(tick,2800);refreshPill();}
function stopDemo(){demoOn=false;$("demo").checked=false;if(demoTimer)clearInterval(demoTimer);demoTimer=null;refreshPill();}
function parseTwitch(raw){let tags={},rest=raw;if(rest.startsWith("@")){const sp=rest.indexOf(" ");rest.slice(1,sp).split(";").forEach(p=>{const parts=p.split("=");tags[parts[0]]=parts[1]||"";});rest=rest.slice(sp+1);}const prefixEnd=rest.startsWith(":")?rest.indexOf(" "):-1;const prefix=prefixEnd>0?rest.slice(1,prefixEnd):"";const after=prefixEnd>0?rest.slice(prefixEnd+1):rest;const cmdEnd=after.indexOf(" :");const head=cmdEnd>=0?after.slice(0,cmdEnd):after;const text=cmdEnd>=0?after.slice(cmdEnd+2):"";const parts=head.split(" ");return {tags:tags,nick:prefix.split("!")[0],cmd:parts[0],text:text};}
function startTwitch(channel){stopTwitch();channel=channel.replace(/^#/,"").trim().toLowerCase();if(channel.length<3)return;twitchOn=true;setDot("twitch-dot","connecting");$("twitch-st").textContent="…";applyLang();const nick="justinfan"+Math.floor(10000+Math.random()*80000);const ws=new WebSocket("wss://irc-ws.chat.twitch.tv:443");twitchSock=ws;ws.onopen=()=>{ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands");ws.send("PASS SCHMOOPIIE");ws.send("NICK "+nick);ws.send("JOIN #"+channel);};ws.onmessage=ev=>{String(ev.data).split("\r\n").forEach(line=>{if(!line)return;if(line.startsWith("PING")){ws.send("PONG :tmi.twitch.tv");return;}const m=parseTwitch(line);if(m.cmd==="001"||m.cmd==="JOIN"){twitchOn=true;setDot("twitch-dot","live");$("twitch-st").textContent=t().twOk;applyLang();}if(m.cmd==="PRIVMSG"){addMsg({platform:"twitch",kind:"chat",user:m.nick,displayName:(m.tags["display-name"]||m.nick),text:m.text,ts:Date.now(),source:"live",bits:m.tags.bits?Number(m.tags.bits):0});}});};ws.onerror=()=>{setDot("twitch-dot","error");$("twitch-st").textContent=t().twBad;twitchOn=false;applyLang();};ws.onclose=()=>{if(twitchSock===ws){twitchOn=false;setDot("twitch-dot","");applyLang();}};}
function stopTwitch(){if(twitchSock){try{twitchSock.close();}catch(e){}twitchSock=null;}twitchOn=false;setDot("twitch-dot","");$("twitch-st").textContent="—";}
function startTikTok(user){user=user.replace(/^@/,"").trim();if(user.length<2)return;tiktokOn=true;setDot("tiktok-dot","live");$("tiktok-st").textContent=t().ttWeb;if(!demoOn)startDemo();applyLang();}
function stopTikTok(){tiktokOn=false;setDot("tiktok-dot","");$("tiktok-st").textContent="—";}
function save(){localStorage.setItem("voxlive",JSON.stringify({lang:lang,twitch:$("twitch").value,tiktok:$("tiktok").value,ttsOn:ttsOn,readName:readName,rate:rate,selectedVoice:selectedVoice}));}
function load(){try{const s=JSON.parse(localStorage.getItem("voxlive")||"{}");if(s.lang)lang=s.lang;if(s.twitch)$("twitch").value=s.twitch;if(s.tiktok)$("tiktok").value=s.tiktok;if(typeof s.ttsOn==="boolean"){ttsOn=s.ttsOn;$("tts").checked=ttsOn;}if(typeof s.readName==="boolean"){readName=s.readName;$("readname").checked=readName;}if(s.rate){rate=Number(s.rate);$("rate").value=rate;$("rate-v").textContent=rate.toFixed(1)+"×";}if(s.selectedVoice)selectedVoice=s.selectedVoice;$("es").classList.toggle("on",lang==="es");$("en").classList.toggle("on",lang==="en");}catch(e){}}
$("es").onclick=function(){lang="es";$("es").classList.add("on");$("en").classList.remove("on");applyLang();save();};
$("en").onclick=function(){lang="en";$("en").classList.add("on");$("es").classList.remove("on");applyLang();save();};
$("tts").onchange=function(e){ttsOn=e.target.checked;if(!ttsOn){speechSynthesis.cancel();queue.length=0;speaking=null;kick();}save();};
$("readname").onchange=function(e){readName=e.target.checked;save();};
$("voice").onchange=function(e){selectedVoice=e.target.value;save();};
$("rate").oninput=function(e){rate=Number(e.target.value);$("rate-v").textContent=rate.toFixed(1)+"×";save();};
$("demo").onchange=function(e){if(e.target.checked)startDemo();else stopDemo();};
$("test").onclick=function(){const u=new SpeechSynthesisUtterance(t().speak);u.lang=lang==="es"?"es-US":"en-US";u.rate=rate;const pref=pickVoice();if(pref)u.voice=pref;speechSynthesis.speak(u);};
$("skip").onclick=function(){speechSynthesis.cancel();speaking=null;kick();};
$("pause").onclick=function(){paused=!paused;$("pause").textContent=paused?t().resume:t().pause;if(paused)speechSynthesis.pause();else{speechSynthesis.resume();kick();}};
$("stage").onclick=function(){document.body.classList.toggle("stage");applyLang();};
$("twitch-btn").onclick=function(){if(twitchOn)stopTwitch();else{stopDemo();startTwitch($("twitch").value);}applyLang();save();};
$("tiktok-btn").onclick=function(){if(tiktokOn)stopTikTok();else startTikTok($("tiktok").value);applyLang();save();};
$("twitch").onchange=save;$("tiktok").onchange=save;
speechSynthesis.onvoiceschanged=fillVoices;load();fillVoices();applyLang();startDemo();
