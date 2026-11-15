import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteNav from "../Components/SiteNav";
import { supabase } from "../lib/supabase";
import type { Resource } from "../types/content";

const ACCESS_CODE = import.meta.env.VITE_GARY_UPLOAD_CODE as string | undefined;

export default function UploadPage() {
  const [params] = useSearchParams();
  const kind: Resource["kind"] = params.get("kind") === "documentation" ? "documentation" : "material";
  const label = kind === "material" ? "Materi" : "Dokumentasi";
  const [accessCode, setAccessCode] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  function verifyAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!ACCESS_CODE) {
      setError("Kode akses belum dikonfigurasi. Isi VITE_GARY_UPLOAD_CODE di Website/.env.local.");
      return;
    }
    if (accessCode !== ACCESS_CODE) {
      setError("Kode akses tidak valid.");
      return;
    }
    setAuthorized(true);
  }

  async function uploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!supabase) {
      setError("Supabase belum terhubung. Periksa konfigurasi .env.local.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const category = String(data.get("category") ?? "").trim();
    const file = data.get("file");
    const allowed = ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    if (!title || !category || !(file instanceof File) || file.size === 0) {
      setError("Judul, kategori, dan file wajib diisi.");
      return;
    }
    if (!allowed.includes(file.type) || file.size > 20 * 1024 * 1024) {
      setError("File harus PDF, PPT, atau PPTX dan maksimal 20 MB.");
      return;
    }
    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${kind}/${crypto.randomUUID()}-${safeName}`;
    const { error: storageError } = await supabase.storage.from("resources").upload(path, file, { contentType: file.type });
    if (storageError) {
      setUploading(false);
      setError(
        storageError.message.toLowerCase().includes("bucket not found")
          ? "Bucket Supabase 'resources' belum dibuat. Jalankan SQL setup Storage di supabase/schema.sql."
          : `Upload gagal: ${storageError.message}`,
      );
      return;
    }
    const { data: publicFile } = supabase.storage.from("resources").getPublicUrl(path);
    const { error: recordError } = await supabase.from("resources").insert({
      title,
      description: `File ${file.name}`,
      category,
      file_url: publicFile.publicUrl,
      kind,
    });
    setUploading(false);
    if (recordError) {
      setError(`File terunggah, tetapi metadata gagal disimpan: ${recordError.message}`);
      return;
    }
    setMessage("File berhasil diunggah.");
    event.currentTarget.reset();
  }

  return (
    <div className="hub-page">
      <SiteNav />
      <main className="resource-wrap upload-page">
        <header className="resource-header">
          <p className="eyebrow">GARY COMMUNITY / PENGURUS</p>
          <h1>Upload {label}</h1>
          <p>Halaman khusus pengurus GARY untuk menambahkan file komunitas.</p>
        </header>
        {!authorized ? (
          <form className="access-form upload-form" onSubmit={verifyAccess}>
            <h2>Kode akses pengurus</h2>
            <input type="password" value={accessCode} onChange={(event) => setAccessCode(event.target.value)} placeholder="Kode akses" required />
            <button className="green-button" type="submit">Verifikasi akses</button>
          </form>
        ) : (
          <form className="upload-form" onSubmit={uploadFile}>
            <h2>Upload {label}</h2>
            <p>Format PDF, PPT, atau PPTX. Maksimal 20 MB.</p>
            <div className="upload-fields">
              <input name="title" placeholder="Judul file" required />
              <input name="category" placeholder="Kategori, contoh: Godot" required />
              <input name="file" type="file" accept=".pdf,.ppt,.pptx,application/pdf" required />
              <button className="green-button" type="submit" disabled={uploading}>{uploading ? "Mengunggah..." : "Upload file"}</button>
            </div>
          </form>
        )}
        {error && <div className="error-notice">{error}</div>}
        {message && <div className="notice">{message}</div>}
        <Link className="text-button" to={kind === "material" ? "/materi" : "/dokumentasi"}>← Kembali ke {label}</Link>
      </main>
    </div>
  );
}
