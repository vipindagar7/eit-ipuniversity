# Deployment Guide — eit-ipuniversity

Domain: **ipuniversity.in** (DNS hosted at Hostinger)
VPS: `172.236.188.49` — also runs `chatbot-api` and `erp-feedback-backend` under PM2
App directory: `/home/eit-ipuniversity`
PM2 process name: `eit-ipuniversity`
Port: `3009`
Database: local MongoDB (`mongodb://localhost:27017/college_platform`)

## 1. DNS (Hostinger)

Zone for `ipuniversity.in` should have exactly one A record at the root:

```
@   A   172.236.188.49
```

`www` is a CNAME that follows the root automatically — don't add a
separate A record for it, DNS doesn't allow a CNAME and another record
type on the same name at once:

```
www   CNAME   ipuniversity.in.
```

**We hit two real issues getting here, worth knowing if DNS ever looks
broken again:**
- The zone originally had **two A records on `@`** (one to the VPS, one to
  a stray `2.57.91.91` — almost certainly Hostinger's default parking
  page IP). That caused the site to resolve to the wrong server roughly
  half the time. Fixed by deleting the second A record, keeping only
  `172.236.188.49`.
- Trying to add a second record type (like an A record) on a name that
  already has a CNAME throws "DNS resource record is not valid or
  conflicts with another resource record" — this is a hard DNS rule, not
  a Hostinger bug. If `www` needs to change, edit or delete the existing
  CNAME rather than adding alongside it.

Verify before touching Nginx/SSL:
```bash
dig +short ipuniversity.in
dig +short www.ipuniversity.in
```
Both must return only `172.236.188.49`. That A record's TTL is 14400s (4
hours), so changes can take a few hours to fully clear cached resolvers
worldwide — don't chase "it's still wrong" for the first hour or two.

## 2. First-time app setup

```bash
cd /home/eit-ipuniversity

# .env already has MONGODB_URI and NEXTAUTH_SECRET set — confirm the rest
# (SMTP, Google Sheets service account) against .env.example if those
# features are needed.

# Confirm local MongoDB is actually running:
sudo systemctl status mongod
sudo systemctl enable mongod   # if not already enabled

# One-time admin account:
npm run seed:admin
# then remove ADMIN_PASSWORD from .env

npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
```

## 3. Nginx

```bash
sudo cp deploy/nginx-college-platform.conf /etc/nginx/sites-available/eit-ipuniversity
sudo nano /etc/nginx/sites-available/eit-ipuniversity
```

Set:
```nginx
server_name ipuniversity.in www.ipuniversity.in;
```

Enable and reload:
```bash
sudo ln -s /etc/nginx/sites-available/eit-ipuniversity /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Before going further, confirm no other app on this VPS already claims this
`server_name` (it shouldn't, but cheap to check):
```bash
sudo nginx -T | grep server_name
```

At this point `http://ipuniversity.in` should load the site over plain HTTP.

## 4. Firewall check (only if certbot fails at the "Connection refused" stage)

```bash
sudo ufw status
sudo ufw allow 'Nginx Full'   # opens 80 + 443 if not already allowed
```

Also check your VPS provider's dashboard for a separate cloud-level
firewall — `ufw` only covers the OS, not any network firewall in front of
it.

## 5. Enable HTTPS

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ipuniversity.in -d www.ipuniversity.in
```

Say **yes** to the HTTP→HTTPS redirect prompt. Certbot edits the Nginx
config automatically to add the SSL server block.

Verify:
```bash
curl -I https://ipuniversity.in
sudo certbot renew --dry-run     # confirms auto-renewal works
```

## 6. Update env vars for HTTPS

```bash
nano /home/eit-ipuniversity/.env
```
```
NEXT_PUBLIC_SITE_URL=https://ipuniversity.in
NEXTAUTH_URL=https://ipuniversity.in
```

```bash
pm2 restart eit-ipuniversity --update-env
```

`NEXTAUTH_URL` being wrong breaks admin login; `NEXT_PUBLIC_SITE_URL` feeds
every SEO tag (canonical URLs, sitemap, Open Graph).

## 7. Every deploy after this: `deploy.sh`

```bash
cd /home/eit-ipuniversity
./deploy.sh
```

Pulls latest `main`, `npm install`, `npm run build`, `pm2 restart
eit-ipuniversity`, tests + restarts Nginx.

## Useful commands

```bash
pm2 status                                        # all 3 apps on this VPS
pm2 logs eit-ipuniversity --lines 50 --nostream
pm2 restart eit-ipuniversity --update-env         # after any .env change
curl -I http://127.0.0.1:3009                     # confirm app itself is up
curl -I https://ipuniversity.in                   # confirm it's reachable end-to-end
```

## Known gotchas from getting this far (check these first if something breaks)

- **Misplaced components**: `CollegeForm.tsx` must be in `components/admin/`,
  not `components/forms/`. If "Module not found" reappears after a pull:
  ```bash
  find /home/eit-ipuniversity/components -iname "*.tsx" | sort
  ```
- **Stale `.js`/`.ts` duplicates**: a syntax error pointing at TypeScript
  syntax inside a `.js` file means a leftover duplicate — delete the wrong one.
- **Build before restart, always**: `pm2 restart` just re-runs `next start`
  against whatever's already in `.next/` — new code needs `npm run build`
  first. `deploy.sh` always does this in the right order.
- **DNS round-robin conflicts**: if the site ever intermittently "disappears"
  again, check for a second A record on `@` the same way as before —
  `dig +short ipuniversity.in` should only ever return one IP.
