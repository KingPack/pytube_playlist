from celery import Celery
import os

# Configurações de ambiente (vindas do docker-compose)
BROKER_URL = os.getenv("CELERY_BROKER_URL", "amqp://guest:guest@rabbitmq:5672//")
RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/1")

celery_app = Celery(
    "worker",
    broker=BROKER_URL,
    backend=RESULT_BACKEND,
)

# Importa automaticamente tasks definidas em tasks.py
celery_app.autodiscover_tasks(["worker"])
