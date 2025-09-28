FROM python:3.13.7-slim-bookworm

RUN apt-get update && \
    apt-get upgrade && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY website/static/js/three.*.js ./website/static/js/

EXPOSE 8000

CMD ["python", "-m", "gunicorn", "-w", "2", "-b", "0.0.0.0:8000", "app:app"]