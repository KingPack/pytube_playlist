FROM python:3.13

# Variáveis de ambiente
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYDEVD_DISABLE_FILE_VALIDATION=1

WORKDIR /app

# Instalar uv (resolver deps) e debugpy
RUN pip install --no-cache-dir uv debugpy==1.8.17

# Copiar apenas arquivos de dependência primeiro (para cache eficiente)
COPY back-end/pyproject.toml back-end/uv.* ./

# Gerar requirements.txt e instalar com pip
RUN uv pip compile pyproject.toml -o requirements.txt \
    && pip install --no-cache-dir -r requirements.txt

# Copiar código do backend
COPY back-end/ .

# Expor portas
EXPOSE 8000 5678

# Comando final: iniciar com debugpy + uvicorn
CMD ["python", "-Xfrozen_modules=off", \
     "-m", "debugpy", \
     "--listen", "0.0.0.0:5678", \
     "--wait-for-client", \
     "-m", "uvicorn", \
     "api.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--reload"]