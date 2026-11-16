import { useEffect, useMemo, useState, type CSSProperties } from "react";
import SiteNav from "../Components/SiteNav";
import { seedGames } from "../data/seed";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import type { Game } from "../types/content";


const GAMES_PER_PAGE = 8;

function GameCard({ game }: { game: Game }) {
  return (
    <article className="game-card">
      <div className="game-thumb" style={{ "--thumb-color": game.color } as CSSProperties}>
        <img src={game.image_url} alt={game.title} />
        <span className="genre-tag">{game.genre}</span>
      </div>
      <div className="game-info"><h3>{game.title}</h3><p>{game.description}</p><a className="play-btn" href={game.game_url} target="_blank" rel="noreferrer">▶ PLAY GAME</a></div>
    </article>
  );
}

export default function GaryGameHub() {
  const [games, setGames] = useState<Game[]>(seedGames);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Semua");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.from("games").select("id,title,genre,description,color,image_url,game_url").order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(`Data game belum dapat dimuat: ${fetchError.message}`);
        else if (data?.length) setGames(data as Game[]);
      });
  }, []);

  const genres = ["Semua", ...Array.from(new Set(games.map((game) => game.genre))).sort()];
  const filteredGames = useMemo(() => games.filter((game) =>
    (genre === "Semua" || game.genre === genre) &&
    `${game.title} ${game.description} ${game.genre}`.toLowerCase().includes(query.toLowerCase()),
  ), [games, genre, query]);
  const pageCount = Math.max(1, Math.ceil(filteredGames.length / GAMES_PER_PAGE));
  const visibleGames = filteredGames.slice(page * GAMES_PER_PAGE, (page + 1) * GAMES_PER_PAGE);

  useEffect(() => setPage(0), [query, genre]);

  return (
    <div className="hub-page">
      <SiteNav />
      <main className="hub-wrap">
        <header className="hub-header"><p className="eyebrow">GARY COMMUNITY / IPB University</p><h1><span>GARY</span> GAME HUB</h1><p >Learn  •  Develop  •  Fun</p></header>
        {!hasSupabaseConfig && <div className="notice">Mode prototype aktif. Jalankan SQL di <code>supabase/schema.sql</code> dan isi <code>.env.local</code> untuk memakai database.</div>}
        {error && <div className="error-notice">{error}</div>}
        <section className="hub-toolbar">
          <div><h2>Koleksi Game</h2><p>{filteredGames.length} game ditemukan</p></div>
          <div className="game-filters"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari game..." /><select value={genre} onChange={(event) => setGenre(event.target.value)}>{genres.map((item) => <option key={item}>{item}</option>)}</select></div>
        </section>
        <section className="game-grid">{visibleGames.map((game) => <GameCard key={game.id} game={game} />)}</section>
        {visibleGames.length === 0 && <p className="empty-state">Game yang kamu cari belum ditemukan.</p>}
        <div className="pagination"><button className="page-arrow" disabled={page === 0} onClick={() => setPage(page - 1)}>‹</button><div className="page-dots">{Array.from({ length: pageCount }, (_, index) => <button key={index} aria-label={`Halaman ${index + 1}`} className={`page-dot ${index === page ? "active" : ""}`} onClick={() => setPage(index)} />)}</div><button className="page-arrow" disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}>›</button></div>
      </main>
    </div>
  );
}
