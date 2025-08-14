
# SDH Chat Backend (NestJS + Socket.IO)

## Quick start (local)
```bash
yarn
cp .env.example .env
# adjust CORS_ORIGIN/PORT if needed
yarn start:dev
```

The server exposes a Socket.IO gateway. The frontend connects passing `?nick=YourNick` as a query.

## Docker (dev)
Build and run:
```bash
docker build -t sdh-chat-backend .
docker run -p 3000:3000 --env-file .env sdh-chat-backend
```
