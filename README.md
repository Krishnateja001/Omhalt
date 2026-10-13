# Omhalt

Omhalt is a starter workspace with a Python API for reading audio file metadata
and a React + TypeScript interface for uploading audio files.

## Requirements

- Python 3.9+
- Node.js 20+
- npm

## Start the API

```sh
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs at <http://localhost:8000>. Interactive API documentation is at
<http://localhost:8000/docs>.

## Start the web app

In another terminal:

```sh
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. The interface sends audio uploads to the
API at `http://localhost:8000`.

The API uses Python's `soundfile` module (backed by libsndfile) to read audio
metadata. Supported formats depend on the installed libsndfile build.
