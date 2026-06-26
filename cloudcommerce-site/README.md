# CloudCommerce — Storefront

The deployable front end for the **AWS Solutions Architect Capstone**. Static, no build step.

```
cloudcommerce-site/
├── index.html          # storefront
├── error.html          # custom 404
├── assets/
│   ├── styles.css
│   ├── app.js          # catalog + cart logic (API or static fallback)
│   └── config.js       # set API_BASE here once your backend is live
└── data/
    └── products.json   # the catalog (Labs 1–2). Backend mirrors this shape later.
```

## Preview locally
Open `index.html` directly, or (better, so `fetch` works):
```bash
cd cloudcommerce-site
python3 -m http.server 8080
# visit http://localhost:8080
```

## Deploy (the short version — full walkthrough is in the Lab Guide)
```bash
aws s3 sync . s3://YOUR-BUCKET --delete
aws cloudfront create-invalidation --distribution-id YOUR-DIST-ID --paths "/*"
```

## Static mode vs. connected mode
- **Static mode (default):** products load from `data/products.json`. All you need for Lab 1.
- **Connected mode:** set `window.API_BASE` in `assets/config.js` to your ALB URL.
  The site then calls `GET {API_BASE}/products` and `POST {API_BASE}/orders`,
  and the on-page **Status** panel flips to *Live API*.

> This is a teaching demo. No real orders are placed and no payment is taken.
