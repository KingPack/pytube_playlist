FROM python:3.13

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Instalar uv
RUN pip install --no-cache-dir uv uvicorn

WORKDIR /app

# Copiar pyproject e lockfile primeiro (para cache eficiente)
COPY back-end/pyproject.toml back-end/uv.* ./

# Instalar dependências travadas
RUN uv sync --frozen

# Copiar código do backend
COPY back-end/ .

EXPOSE 8000

# Rodar FastAPI
CMD ["uv", "run", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
