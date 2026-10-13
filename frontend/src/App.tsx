import { useRef, useState } from "react";

type AudioMetadata = {
  filename: string;
  format: string;
  subtype: string;
  duration_seconds: number;
  sample_rate: number;
  channels: number;
  frames: number;
};

const API_URL = "http://localhost:8000/api/audio/metadata";

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFile(file?: File) {
    if (!file) return;

    setError("");
    setMetadata(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(API_URL, { method: "POST", body: formData });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Could not read this audio file.");
      }
      setMetadata(result as AudioMetadata);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not connect to the audio API.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Omhalt home">
          <span className="brand-mark" aria-hidden="true">
            ◖
          </span>
          omhalt
        </a>
        <span className="topbar-note">A quieter way to listen</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">YOUR AUDIO, UNDERSTOOD</p>
        <h1 id="page-title">
          Every sound
          <br />
          has a <span>story.</span>
        </h1>
        <p className="intro">
          Drop in an audio file and get to know what’s inside. Start with the
          details that make your sound yours.
        </p>

        <button
          className="upload-card"
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
        >
          <span className="upload-icon" aria-hidden="true">
            ↑
          </span>
          <span className="upload-title">
            {loading ? "Reading your audio…" : "Choose an audio file"}
          </span>
          <span className="upload-hint">WAV, FLAC, OGG and more · up to 50 MB</span>
          <span className="browse-link">{loading ? "Please wait" : "Browse files"}</span>
        </button>
        <input
          ref={inputRef}
          className="visually-hidden"
          type="file"
          accept="audio/*"
          onChange={(event) => handleFile(event.target.files?.[0])}
          aria-label="Choose an audio file"
        />

        {error && (
          <p className="message error-message" role="alert">
            {error}
          </p>
        )}

        {metadata && (
          <section className="results" aria-live="polite">
            <div className="results-heading">
              <div>
                <p className="eyebrow">FILE DETAILS</p>
                <h2>{metadata.filename}</h2>
              </div>
              <span className="format-pill">
                {metadata.format} · {metadata.subtype}
              </span>
            </div>
            <dl className="stats">
              <div>
                <dt>Duration</dt>
                <dd>{formatDuration(metadata.duration_seconds)}</dd>
              </div>
              <div>
                <dt>Sample rate</dt>
                <dd>{(metadata.sample_rate / 1000).toFixed(1)} kHz</dd>
              </div>
              <div>
                <dt>Channels</dt>
                <dd>{metadata.channels}</dd>
              </div>
              <div>
                <dt>Frames</dt>
                <dd>{metadata.frames.toLocaleString()}</dd>
              </div>
            </dl>
          </section>
        )}
      </section>

      <footer className="footer">
        <span>Made for the sounds worth keeping.</span>
        <span>OMHALT · AUDIO READER</span>
      </footer>
    </main>
  );
}
