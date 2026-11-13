import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import SiteNav from "../Components/SiteNav";
import { seedResources } from "../data/seed";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import type { Resource } from "../types/content";

type ResourcePageProps = { kind: Resource["kind"]; title: string; intro: string };

export default function ResourcePage({ kind, title, intro }: ResourcePageProps) {
  const [resources, setResources] = useState<Resource[]>(seedResources.filter((item) => item.kind === kind));
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.from("resources").select("id,title,description,category,file_url,kind").eq("kind", kind).order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(`Data ${kind} belum dapat dimuat: ${fetchError.message}`);
        else if (data) setResources(data as Resource[]);
      });
  }, [kind]);

  const filtered = useMemo(() => resources.filter((resource) =>
    `${resource.title} ${resource.description} ${resource.category}`.toLowerCase().includes(query.toLowerCase()),
  ), [query, resources]);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setUploadMessage("");

    if (!supabase) {
      setError("Supabase belum terhubung. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di Website/.env.local.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const titleValue = String(form.get("title") ?? "").trim();
    const categoryValue = String(form.get("category") ?? "").trim();
    const file = form.get("file");

    if (!titleValue || !categoryValue || !(file instanceof File) || file.size === 0) {
      setError("Judul, kategori, dan file wajib diisi.");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Format file harus PDF, PPT, atau PPTX.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Ukuran file maksimal 20 MB.");
      return;
    }

    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${kind}/${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("resources").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) {
      setUploading(false);
      setError(`Upload gagal: ${uploadError.message}`);
      return;
    }

    const { data: publicFile } = supabase.storage.from("resources").getPublicUrl(path);
    const { data: inserted, error: insertError } = await supabase.from("resources").insert({
      title: titleValue,
      description: `File ${file.name}`,
      category: categoryValue,
      file_url: publicFile.publicUrl,
      kind,
    }).select("id,title,description,category,file_url,kind").single();

    setUploading(false);
    if (insertError) {
      setError(`File sudah diunggah, tetapi metadata gagal disimpan: ${insertError.message}`);
      return;
    }
    if (inserted) setResources((current) => [inserted as Resource, ...current]);
    setUploadMessage("File berhasil diunggah.");
    event.currentTarget.reset();
  }

  return (
    <div className="hub-page">
      <SiteNav />
      <main className="resource-wrap">
        <header className="resource-header">
          <p className="eyebrow">GARY COMMUNITY / IPB</p>
          <h1>{title}</h1>
          <p>{intro}</p>
        </header>
        {!hasSupabaseConfig && <div className="notice">Mode prototype aktif. Hubungkan Supabase untuk memuat data komunitas.</div>}
        {error && <div className="error-notice">{error}</div>}
        {uploadMessage && <div className="notice">{uploadMessage}</div>}
        <button className="green-button upload-trigger" type="button" onClick={() => setShowUploadForm((visible) => !visible)}>
          {showUploadForm ? "Tutup upload" : kind === "material" ? "Upload PDF / PPT" : "Upload dokumentasi"}
        </button>
        {showUploadForm && (
          <form className="upload-form" onSubmit={handleUpload}>
            <h2>Upload {kind === "material" ? "Materi" : "Dokumentasi"}</h2>
            <p>Format PDF, PPT, atau PPTX. Maksimal 20 MB.</p>
            <div className="upload-fields">
              <input name="title" placeholder="Judul file" required />
              <input name="category" placeholder="Kategori, contoh: Godot" required />
              <input name="file" type="file" accept=".pdf,.ppt,.pptx,application/pdf" required />
              <button className="green-button" type="submit" disabled={uploading}>
                {uploading ? "Mengunggah..." : "Upload file"}
              </button>
            </div>
          </form>
        )}
        <div className="resource-toolbar">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Cari ${kind === "material" ? "materi" : "dokumentasi"}...`} />
        </div>
        <section className="resource-grid">
          {filtered.map((resource) => (
            <article className="resource-card" key={resource.id}>
              <span className="resource-category">{resource.category}</span>
              <h2>{resource.title}</h2>
              <p>{resource.description}</p>
              <a className="resource-link" href={resource.file_url} target="_blank" rel="noreferrer">
                {resource.file_url === "#" ? "File segera tersedia" : "Buka materi →"}
              </a>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
