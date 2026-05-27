# Image Python légère
FROM python:3.12-slim

# Dossier de travail
WORKDIR /app

# Installe les dépendances Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie tout le projet
COPY backend/ ./backend/
COPY frontend/dist/ ./frontend/dist/

# Hugging Face impose le port 7860
EXPOSE 7860

# Lance FastAPI sur le port 7860
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]