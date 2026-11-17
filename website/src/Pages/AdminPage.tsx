import { useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "../Components/SiteNav";

const ACCESS_CODE = import.meta.env.VITE_GARY_UPLOAD_CODE as string | undefined;

export default function AdminPage() {
  const [accessCode, setAccessCode] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  function verifyAccess() {
    setError("");
    if (!ACCESS_CODE) {
      setError("Kode akses belum dikonfigurasi. Isi VITE_GARY_UPLOAD_CODE di .env.local.");
      return;
    }
    if (accessCode !== ACCESS_CODE) {
      setError("Kode akses tidak valid.");
      return;
    }
    setAuthorized(true);
  }

  return (
    <div className="hub-page">
      <SiteNav />
      <main className="resource-wrap upload-page">
        <header className="resource-header">
          <p className="eyebrow">GARY COMMUNITY / PENGURUS</p>
          <h1>Admin GARY</h1>
          <p>Kelola materi komunitas dan koleksi game GARY.</p>
        </header>

        {!authorized ? (
          <form
            className="access-form upload-form"
            onSubmit={(event) => {
              event.preventDefault();
              verifyAccess();
            }}
          >
            <h2>Kode akses pengurus</h2>
            <input
              type="password"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              placeholder="Kode akses"
              required
            />
            <button className="green-button" type="submit">Masuk admin</button>
            {error && <div className="error-notice">{error}</div>}
          </form>
        ) : (
          <section className="admin-actions">
            <Link className="upload-form admin-action" to="/upload?kind=material">
              <span className="resource-category">MATERI</span>
              <h2>Upload materi</h2>
              <p>Tambahkan file PDF, PPT, atau PPTX untuk weekly meet.</p>
            </Link>
            <Link className="upload-form admin-action" to="/upload?kind=documentation">
              <span className="resource-category">DOKUMENTASI</span>
              <h2>Upload dokumentasi</h2>
              <p>Tambahkan dokumentasi dan panduan komunitas.</p>
            </Link>
            <Link className="upload-form admin-action" to="/upload?kind=game">
              <span className="resource-category">GAME HUB</span>
              <h2>Upload game</h2>
              <p>Tambahkan game online beserta thumbnail ke Game Hub.</p>
            </Link>
          </section>
        )}

        <Link className="text-button" to="/">← Kembali ke beranda</Link>
      </main>
    </div>
  );
}
