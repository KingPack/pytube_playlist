FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY back-end/pyproject.toml back-end/uv.lock* ./

RUN uv sync --frozen

COPY back-end/ ./back-end
COPY worker/ ./worker

CMD ["uv", "run", "celery", "-A", "worker.celery_app", "worker", "--loglevel=info"]
