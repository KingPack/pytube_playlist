# 🎧 Music Downloader API

Um projeto real com propósito educacional: backend de uma aplicação para baixar músicas MP3 de plataformas de streaming.

## 🚀 Objetivo do Projeto

Este repositório faz parte de um projeto prático com o objetivo de ensinar **programação backend moderna** com **Python**, **FastAPI**, **microserviços** e **AWS**. A aplicação tem uma funcionalidade real: permitir o download de músicas MP3 a partir de plataformas públicas de música, respeitando os termos de uso de cada serviço.

É voltado tanto para desenvolvedores iniciantes quanto para quem deseja contribuir com um projeto colaborativo que será usado de verdade.

## 🧱 Tecnologias Utilizadas

* **Python 3.11+**
* **FastAPI** – para criação de APIs performáticas e modernas
* **Docker** – ambiente isolado e consistente
* **AWS** – infraestrutura em nuvem (S3, Lambda, etc)
* **Microserviços** – arquitetura distribuída e escalável
* **SQLAlchemy** / **PostgreSQL** – persistência de dados
* **Celery** + **Redis** – fila de tarefas assíncronas (downloads, conversões)
* **Pytest** – testes automatizados

## 📁 Estrutura Inicial do Projeto

```py
music-downloader-backend/
├── app/
│   ├── api/               # Rotas da API
│   ├── core/              # Configurações e utilitários
│   ├── models/            # Modelos de dados
│   ├── services/          # Integrações externas (ex: plataformas de música)
│   └── workers/           # Tarefas assíncronas
├── tests/
├── docker-compose.yml
├── requirements.txt
├── README.md
└── main.py
```

## 📌 Funcionalidades Planejadas

* [ ] Buscar música por nome/artista
* [ ] Fazer download da faixa em MP3
* [ ] Converter formatos de áudio
* [ ] Armazenar músicas temporariamente no S3
* [ ] Monitorar status de tarefas (download, conversão)
* [ ] Histórico de downloads por usuário

## 🤝 Contribuindo

Quer aprender, ensinar ou ajudar no desenvolvimento? Toda contribuição é bem-vinda!

### Como começar:

1. Faça um fork do projeto
2. Clone seu fork:

   ```bash
   git clone https://github.com/KingPack/pytube_playlist.git
   ```
3. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```
4. Inicie o servidor:

   ```bash
   uvicorn main:app --reload
   ```

### Sugestões de contribuição:

* Melhorias nas rotas da API
* Integrações com novas plataformas de música
* Testes automatizados
* Documentação e tutoriais
* Configuração de deploy (Docker, CI/CD, AWS Lambda)

## 📚 Licença

Este projeto é licenciado sob a **GNU GENERAL PUBLIC LICENSE**. Consulte o arquivo `LICENSE` para mais detalhes.

## ✨ Propósito Educacional

Este projeto nasceu para **ensinar programação com propósito real**, e será usado como base para **aulas e treinamentos**. O backend será conectado futuramente a um frontend e uma CLI.
