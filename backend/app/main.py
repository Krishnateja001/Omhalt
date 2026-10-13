from io import BytesIO

import soundfile as sf
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

MAX_UPLOAD_BYTES = 50 * 1024 * 1024

app = FastAPI(title="Omhalt Audio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/audio/metadata")
async def read_audio_metadata(file: UploadFile = File(...)):
    audio_bytes = await file.read(MAX_UPLOAD_BYTES + 1)
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")
    if len(audio_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail="The uploaded file exceeds the 50 MB limit.",
        )

    try:
        info = sf.info(BytesIO(audio_bytes))
    except (RuntimeError, ValueError) as exc:
        raise HTTPException(
            status_code=415,
            detail="The uploaded file is not a supported audio format.",
        ) from exc

    return {
        "filename": file.filename or "audio",
        "format": info.format,
        "subtype": info.subtype,
        "duration_seconds": info.duration,
        "sample_rate": info.samplerate,
        "channels": info.channels,
        "frames": info.frames,
    }
