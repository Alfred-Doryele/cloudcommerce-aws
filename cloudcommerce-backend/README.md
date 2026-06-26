# CloudCommerce — Catalog & Orders API

Zero-dependency Node service. You containerize this in **Lab 3** and run it on ECS Fargate.

## Run locally
```bash
node server.js
# GET  http://localhost:8080/health
# GET  http://localhost:8080/products
# POST http://localhost:8080/orders   (body: {"items":[{"id":"p1","qty":2}]})
```

## Build & run with Docker
```bash
docker build -t cloudcommerce-api .
docker run -p 8080:8080 cloudcommerce-api
```

## Build for Graviton (ARM64 / cheaper Fargate)
```bash
docker buildx build --platform linux/arm64 -t cloudcommerce-api:arm64 .
```

The ALB health check should target `GET /health`. The storefront calls
`GET /products` and `POST /orders` once you set `API_BASE` in the site's `config.js`.
