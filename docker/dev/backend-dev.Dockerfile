FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYDEVD_DISABLE_FILE_VALIDATION=1 \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Instalar uv e debugpy
RUN pip install --no-cache-dir uv debugpy==1.8.17

# Instalar ffmpeg de forma mais limpa
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copiar dependências primeiro (cache)
COPY back-end/pyproject.toml back-end/uv.* ./

# Resolver deps
RUN uv pip compile pyproject.toml -o requirements.txt \
    && pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY back-end/ .

EXPOSE 8000 5678

CMD ["python", "-Xfrozen_modules=off", \
     "-m", "debugpy", \
     "--listen", "0.0.0.0:5678", \
     "--wait-for-client", \
     "-m", "uvicorn", \
     "api.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--reload"]
