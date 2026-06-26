# CloudCommerce — AWS Solutions Architect Capstone

Three pieces that work together as a hire-ready portfolio project.

| File | What it is | How to use it |
|------|-----------|---------------|
| **CloudCommerce_AWS_SAA_Capstone.html** | The **showcase** — interactive architecture, decisions, Well-Architected, cost, outcomes, interview kit. | Host it (S3 + CloudFront) or open locally. This is what you *present*. |
| **CloudCommerce_Guided_Lab.html** | The **guided build lab** — 12 step-by-step labs from empty account to live platform, with copy-able commands, checkpoints, and a teardown. | Open it and build along. This is what you *do*. |
| **cloudcommerce-site/** | The **deployable storefront** — minimalist static site you push to S3/CloudFront in Lab 1. | Deploy in Lab 1; connect to your API in Lab 3. |
| **cloudcommerce-backend/** | The **catalog & orders API** — zero-dependency Node service you containerize in Lab 3. | Build → ECR → Fargate in Lab 3. |

## The fastest path to something live
1. Open **CloudCommerce_Guided_Lab.html**.
2. Do **Lab 0** (safe setup + budget alarm) and **Lab 1** (deploy `cloudcommerce-site`).
   In ~90 minutes you have a global, CDN-backed storefront on your own AWS account.
3. Continue through Lab 3 to bring the backend online, then go as deep as you like.
4. **Always finish Lab 11 (teardown)** the day you build, so hourly resources don't bill.

## Preview the storefront locally
```bash
cd cloudcommerce-site && python3 -m http.server 8080   # http://localhost:8080
```

## Run the backend locally
```bash
cd cloudcommerce-backend && node server.js             # http://localhost:8080/products
```

> Educational project. "CloudCommerce" is fictional; no real orders or payments.
> Not affiliated with or endorsed by AWS. Tear down resources you aren't using.
