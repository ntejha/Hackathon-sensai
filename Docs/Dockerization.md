# 🚀 Dockerization Guide

This document describes how to Dockerize the frontend and backend of the project, test it locally, push it to GitHub Packages, and create a release.

---

## 📁 Project Structure

```
Hackathon-sensai/
│
├── sensai-ai/          # Backend
├── sensai-frontend/    # Frontend
├── release-v0.0.1.zip  # Final zipped release artifact
├── README.md
└── LICENSE
```

---

## 🔧 Step 1: Dockerizing the Backend (`sensai-ai`)

**Dockerfile (located inside `sensai-ai/`)**:

```
FROM python:3.13.1-slim-bookworm

RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    curl \
    wget \
    fontconfig \
    libfreetype6 \
    libjpeg62-turbo \
    libpng16-16 \
    libx11-6 \
    libxcb1 \
    libxext6 \
    libxrender1 \
    xfonts-75dpi \
    xfonts-base \
    ffmpeg \
    poppler-utils

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs git

# Install libssl1.1
RUN wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
RUN dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb

# Install wkhtmltopdf
RUN wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.bullseye_amd64.deb \
    && dpkg -i wkhtmltox_0.12.6.1-2.bullseye_amd64.deb \
    && apt-get install -f \
    && rm wkhtmltox_0.12.6.1-2.bullseye_amd64.deb

# Verify wkhtmltopdf installation
RUN wkhtmltopdf --version

# Copy requirements.txt to the container
COPY requirements.txt ./

# Install app dependencies
RUN pip install -r requirements.txt

COPY src /src

RUN test -f /src/api/.env && rm -f /src/api/.env || true
RUN test -f /src/api/.env.aws && rm -f /src/api/.env.aws || true

# Expose the port on which your FastAPI app listens
# EXPOSE 8001
EXPOSE 8002

# Only expose one port where everything is hosted
EXPOSE 8501

ARG S3_BUCKET_NAME

ARG S3_FOLDER_NAME

ARG ENV

ARG OPENAI_API_KEY

ARG GOOGLE_CLIENT_ID

ARG BUGSNAG_API_KEY

ARG SLACK_USER_SIGNUP_WEBHOOK_URL

ARG SLACK_COURSE_CREATED_WEBHOOK_URL

ARG SLACK_USAGE_STATS_WEBHOOK_URL

ARG PHOENIX_ENDPOINT

ARG PHOENIX_API_KEY

RUN printf "OPENAI_API_KEY=$OPENAI_API_KEY\nGOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID\nS3_BUCKET_NAME=$S3_BUCKET_NAME\nS3_FOLDER_NAME=$S3_FOLDER_NAME\nENV=$ENV\nBUGSNAG_API_KEY=$BUGSNAG_API_KEY\nSLACK_USER_SIGNUP_WEBHOOK_URL=$SLACK_USER_SIGNUP_WEBHOOK_URL\nSLACK_COURSE_CREATED_WEBHOOK_URL=$SLACK_COURSE_CREATED_WEBHOOK_URL\nSLACK_USAGE_STATS_WEBHOOK_URL=$SLACK_USAGE_STATS_WEBHOOK_URL\nPHOENIX_ENDPOINT=$PHOENIX_ENDPOINT\nPHOENIX_API_KEY=$PHOENIX_API_KEY" >> /src/api/.env

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*


CMD ["sh", "-c", "cd /src && python startup.py && uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload"]

```

**Build & Test Locally:**

```bash
cd sensai-ai
docker build -t sensai-backend .
docker run -d -p 8000:8000 sensai-backend
```

---

## 🌐 Step 2: Dockerizing the Frontend (`sensai-frontend`)

**Dockerfile (located inside `sensai-frontend/`)**:

```Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
```

**Build & Test Locally:**

```bash
cd sensai-frontend
docker build -t sensai-frontend .
docker run -d -p 3000:3000 sensai-frontend
```

---

## 🐳 Step 3: Push to GitHub Packages (GHCR)

### Authenticate with GitHub:

```bash
echo "<YOUR_GITHUB_PAT>" | docker login ghcr.io -u <your-github-username> --password-stdin
```

### Tag & Push Backend:

```bash
docker tag sensai-backend ghcr.io/<your-github-username>/sensai-backend:0.0.1
docker push ghcr.io/<your-github-username>/sensai-backend:0.0.1
```

### Tag & Push Frontend:

```bash
docker tag sensai-frontend ghcr.io/<your-github-username>/sensai-frontend:0.0.1
docker push ghcr.io/<your-github-username>/sensai-frontend:0.0.1
```

> ✅ Ensure both packages are marked **public** in the GitHub Packages settings under each repo.

---

## 📦 Step 4: Create a Release

### Create `release-v0.0.1.zip`

```bash
zip -r release-v0.0.1.zip sensai-ai sensai-frontend
```

Make sure `release-v0.0.1.zip` is at the root of the repo.

### Publish GitHub Release:

```bash
gh release create v0.0.1 ./release-v0.0.1.zip --title "Initial Release" --notes "Dockerized both frontend and backend, tested, and published to GHCR."
```

If you don't have the GitHub CLI (`gh`) installed, get it here:
👉 [https://cli.github.com/](https://cli.github.com/)

---

## ✅ Final Checklist

* [x] Dockerfiles created in both `sensai-ai` and `sensai-frontend`
* [x] Tested both images locally with `docker run`
* [x] Tagged and pushed both images to GitHub Container Registry (GHCR)
* [x] Created a zipped release archive
* [x] Published GitHub release with CLI


