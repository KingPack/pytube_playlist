FROM python:3.13

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Instalar uv
RUN pip install --no-cache-dir uv

WORKDIR /app

# Copiar dependências (compartilha lockfile com backend)
COPY back-end/pyproject.toml back-end/uv.lock* ./

RUN uv sync --frozen

# Copiar código backend (caso worker use models ou funções dele)
COPY back-end/ ./back-end

# Copiar código do worker
COPY worker/ ./worker

# Rodar Celery
CMD ["uv", "run", "celery", "-A", "worker.celery_app", "worker", "--loglevel=info"]
