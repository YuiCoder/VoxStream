# DOMAIN.md — voxstream.app

Owner wants the product on a real domain. Bot does not buy domains.

## You buy and point

1. Buy **voxstream.app** (Cloudflare, Porkbun, or Namecheap). `.app` requires HTTPS. That is fine; GitHub Pages already serves HTTPS.
2. GitHub repo → Settings → Pages → Custom domain → `voxstream.app`
3. At the registrar, add:
   - `A` @ → `185.199.108.153` `185.199.109.153` `185.199.110.153` `185.199.111.153`
   - `AAAA` @ → `2606:50c0:8000::153` `2606:50c0:8001::153` `2606:50c0:8002::153` `2606:50c0:8003::153`
   - `CNAME` `www` → `yuicoder.github.io`
4. Wait for GitHub to show the certificate as ready.

## Then tell this thread

We flip:
- Railway `PUBLIC_ORIGIN=https://voxstream.app`
- OAuth still callbacks on Railway (`APP_URL`). Do not change those.
- After login, studio URL becomes `https://voxstream.app/studio.html` (Pages custom domain drops `/VoxStream/`).
- CORS already allows `PUBLIC_ORIGIN`.

Do not start the flip until the domain resolves. Keep `yuicoder.github.io/VoxStream/` working until then.

`voxstream.net` is someone else's radio panel. Do not buy that.
