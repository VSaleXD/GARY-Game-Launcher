import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "../Components/SiteNav";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import type { Resource } from "../types/content";

type ResourcePageProps = { kind: Resource["kind"]; title: string; intro: string };

export default function ResourcePage({ kind, title, intro }: ResourcePageProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

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
  const weeklyMeetOne = resources.find((resource) =>
    resource.title.toLowerCase().includes("weekly meet 1") && resource.file_url !== "#",
  );

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
        <Link className="green-button upload-trigger" to={`/upload?kind=${kind}`}>Upload {kind === "material" ? "PDF / PPT" : "dokumentasi"}</Link>
        {kind === "material" && weeklyMeetOne && (
          <section className="pdf-viewer-section">
            <div className="pdf-viewer-heading">
              <div><span className="resource-category">WEEKLY MEET 1</span><h2>{weeklyMeetOne.title}</h2></div>
              <a className="resource-link" href={weeklyMeetOne.file_url} target="_blank" rel="noreferrer">Buka penuh ↗</a>
            </div>
            <iframe title={weeklyMeetOne.title} src={weeklyMeetOne.file_url} />
          </section>
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
              {resource.file_url !== "#" && <a className="resource-link" href={resource.file_url} target="_blank" rel="noreferrer">Buka file →</a>}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
