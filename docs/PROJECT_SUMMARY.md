# Project Summary

## Overview
`pytube_playlist` is a full-stack application focused on YouTube playlist/music extraction and download workflows.
It currently provides:

- A FastAPI backend for playlist metadata extraction and download task creation
- A React frontend to search and visualize playlist content
- A Celery worker for asynchronous media download and ZIP generation
- Redis + RabbitMQ support for rate limiting, idempotency, and task queueing

The project is educational and practical at the same time: it demonstrates modern backend/frontend integration with asynchronous processing.

## Main Stack
- Backend: Python, FastAPI, yt-dlp, Redis, Celery
- Frontend: React + Vite + Axios + Tailwind classes
- Async/Queue: Celery + RabbitMQ (broker) + Redis (result backend/cache)
- Infra: Docker Compose, Nginx (reverse proxy for `/api`)

## Repository Structure
- `back-end/`: FastAPI app, routers, schemas, internal middleware utilities
- `front-end/`: React app with routes/pages/components
- `worker/`: Celery app and media processing tasks
- `docker/`: backend/worker/frontend Dockerfiles
- `nginx/`: reverse proxy configuration
- `docker-compose.yml`: local orchestration

## Current Functional Scope
### Implemented
- Fetch playlist metadata and items from a YouTube playlist URL
- Optional pagination for playlist items in API
- Queue playlist download jobs asynchronously
- Backend protections: IP validation, rate limiting (token bucket via Redis), and idempotency checks (Redis payload hash)
- Frontend page to load and display playlist details and tracks

### In Progress / Partial
- Playlist selection UX exists, but download action in UI is still placeholder
- Single music download route exists, but response handling is incomplete
- Search route/files exist in structure but are not active in `main.py`

## API Endpoints (Current)
- `GET /api/playlist/`
- Params: `url`, `page`, `page_size`, `is_pagination`
- Returns playlist metadata and music list
- `POST /api/playlist/download_playlist`
- Body: playlist title/url/session + selected music items
- Returns Celery `task_id` with queue status
- `POST /api/music/download`
- Starts direct audio download using `yt-dlp` (no full response contract yet)

## Runtime Flow (Today)
1. Frontend sends playlist URL to backend.
2. Backend uses `yt-dlp` to extract playlist information.
3. Frontend renders playlist cards and selection tools.
4. Download request is submitted for selected items.
5. Backend validates IP, applies rate limit/idempotency.
6. Celery task is pushed to RabbitMQ.
7. Worker consumes task, downloads files, builds ZIP in `/app/downloads`.

## Important Notes
- Redis is used both for API controls (rate limit/idempotency) and Celery result backend.
- MongoDB is available in Docker Compose but is not yet used in current API flow.
- CORS currently allows `http://localhost:5173`.

## Suggested Next Steps
1. Complete frontend integration for `download_playlist` action and task-status polling.
2. Add task-status endpoint(s) in backend.
3. Standardize API responses (including `/api/music/download`).
4. Add tests (unit + integration) for playlist and safety middleware.
5. Expand docs with local development commands per service.
