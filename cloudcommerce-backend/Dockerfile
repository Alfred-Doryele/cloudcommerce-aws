# Tiny, no-dependency image. Multi-arch friendly (build for arm64 to use Graviton/Fargate ARM).
FROM node:20-alpine
WORKDIR /app
COPY server.js products.json ./
ENV PORT=8080
EXPOSE 8080
# basic container healthcheck (ECS also has its own via the target group)
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["node", "server.js"]
