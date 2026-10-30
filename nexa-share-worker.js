// Cloudflare Worker (free) — rich link previews for NEXA share links.
// Deploy: dash.cloudflare.com → Workers → Create → paste this → Settings → Variables:
//   SB_URL = https://YOUR-PROJECT.supabase.co    SB_KEY = your Supabase anon key
//   APP_URL = https://xclonesky.github.io/NEXA/
// Then set PREVIEW:'https://YOUR-WORKER.workers.dev' in NXK (top of the v3 script) so shared links look like  <worker>/p/CODE
const h=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export default{async fetch(req,env){
  const [,t,code]=new URL(req.url).pathname.split('/');const app=env.APP_URL||'https://xclonesky.github.io/NEXA/';
  let title='NEXA — Modern Dating & Connections',desc='Meet new people, spark real conversations.',img=app+'nexa-og-image.png';
  if((t==='p'||t==='s')&&code){try{
    const r=await fetch(`${env.SB_URL}/rest/v1/rpc/${t==='p'?'get_public_post':'get_public_story'}`,{method:'POST',headers:{apikey:env.SB_KEY,Authorization:'Bearer '+env.SB_KEY,'Content-Type':'application/json'},body:JSON.stringify({p_code:code})});
    const d=await r.json();if(d&&d.id){const n=(d.profile&&(d.profile.full_name||d.profile.username))||'Someone';
      title=`${n} on NEXA`;desc=(d.content||(t==='s'?'Watch this story on NEXA':'See this post on NEXA')).slice(0,180);
      if(d.media_url&&d.media_type!=='video')img=d.media_url;}
  }catch(e){}}
  const to=`${app}#/${t}/${code||''}`;
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><title>${h(title)}</title><meta property="og:type" content="article"><meta property="og:site_name" content="NEXA"><meta property="og:title" content="${h(title)}"><meta property="og:description" content="${h(desc)}"><meta property="og:image" content="${h(img)}"><meta name="twitter:card" content="summary_large_image"><meta http-equiv="refresh" content="0;url=${h(to)}"></head><body><script>location.replace(${JSON.stringify(to)})</script><a href="${h(to)}">Open in NEXA</a></body></html>`,{headers:{'content-type':'text/html;charset=utf-8','cache-control':'public,max-age=300'}});
}};
