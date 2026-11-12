import { useMemo, useState, type CSSProperties } from "react";

type Game = [string, string, string, string, string, string];
type GameCardProps = { game: Game };
type HubProps = { onBack: () => void };

const GAMES: Game[] = [
  ["BRAKING BAD", "RACING", "Rasakan sensasi balapan dan tantangan kecepatan di lintasan yang penuh kejutan.", "#3a2a00", "game_braking_bad.png", "https://vsalexs.itch.io/braking-bad"],
  ["TIME DISORDER", "ACTION", "Hadapi kekacauan waktu dan temukan jalan keluar dari dunia yang terus berubah.", "#1a2a3a", "game_time_disorder.png", "https://vsalexs.itch.io/time-disorder"],
  ["BALLDREAM", "SPORT", "Buktikan kemampuanmu dan raih kemenangan dalam petualangan sepak bola.", "#0a3a1a", "game_balldream.png", "https://allione-studio.itch.io/balldream"],
  ["DISTRACT", "ADVENTURE", "Hadapi berbagai gangguan dan temukan cara untuk mencapai tujuanmu.", "#3a0a2a", "game_distract.png", "https://darith-dev.itch.io/distract"],
  ["INSECTROPY", "ADVENTURE", "Masuki dunia serangga yang penuh misteri dan tantangan.", "#2a3a0a", "game_insectropy.png", "https://hamgarian.itch.io/insectropy"],
  ["CODE DEFENDER", "STRATEGY", "Gunakan logika dan strategi untuk mempertahankan sistem dari ancaman.", "#0a2a3a", "game_code_defender.png", "https://raftfeed.itch.io/ini-projek-gekave"],
  ["DINE", "SIMULATION", "Kelola restoranmu dan layani pelanggan dalam pengalaman memasak yang unik.", "#3a1a0a", "game_dine.png", "https://rad3nz.itch.io/dine"],
  ["ARCHEMISTS CHRONICLES", "RPG", "Ikuti perjalanan para penyihir dan ungkap rahasia dunia yang penuh misteri.", "#2a0a3a", "game_archemists_chronicles.png", "https://zephx.itch.io/archemists-chronicles"],
  ["UPRISING", "ACTION", "Bangkit melawan kekuatan yang menguasai dunia dan tentukan masa depanmu.", "#3a0a0a", "game_uprising.png", "https://zephx.itch.io/uprising0"],
  ["PUAKA", "HORROR", "Hadapi kengerian dan misteri yang tersembunyi di balik dunia yang gelap.", "#0a0a0a", "game_puaka.png", "https://zephx.itch.io/puaka"],
  ["ECHOES", "PUZZLE PLATFORMER", "Kematianmu sebelumnya akan membantumu melewati puzzle dan rintangan.", "#4D96FF", "game_echoes.png", "https://ramjing.itch.io/echoes"],
  ["HOP", "VERTICAL PLATFORMER", "Atur kekuatan lompatan kelinci untuk mencapai puncak tanpa jatuh dan mati.", "#4D96FF", "game_hop.png", "https://ramjing.itch.io/hop"],
  ["MAGISTAR", "TOWER DEFENSE", "Gunakan kombinasi elemen untuk mempertahankan istana dari serangan musuh.", "#A66CFF", "game_magistar.png", "https://faizbyp.itch.io/magistar"],
  ["DYSTOPIA RUN", "ENDLESS RUNNER", "Berlari melewati rintangan sambil mengatur energi lompatan untuk bertahan hidup.", "#FFD166", "game_dystopia_run.png", "https://as-linkon.itch.io/dystopia-run"],
  ["IPB RUNNERS", "ENDLESS RUNNER", "Mahasiswa IPB melompati mobil hingga akhirnya berakhir di ruang wisuda.", "#FFD166", "game_ipb_runners.png", "https://rafifrr.itch.io/ipb-runners"],
];

const GAMES_PER_PAGE = 8;

function GameCard({ game }: GameCardProps) {
  const [title, genre, description, color, image, url] = game;

  return (
    <article className="game-card">
      <div className="game-thumb" style={{ "--thumb-color": color } as CSSProperties}>
        <img src={`/Assets/Images/${image}`} alt={title} />
        <span className="genre-tag">{genre}</span>
      </div>
      <div className="game-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <a className="play-btn" href={url} target="_blank" rel="noreferrer">
          ▶ PLAY GAME
        </a>
      </div>
    </article>
  );
}

export default function GaryGameHub({ onBack }: HubProps) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(GAMES.length / GAMES_PER_PAGE);
  const visibleGames = useMemo(
    () => GAMES.slice(page * GAMES_PER_PAGE, (page + 1) * GAMES_PER_PAGE),
    [page],
  );

  return (
    <div className="hub-page">
      <nav className="site-nav">
        <button className="brand-button" onClick={onBack}>
          <img src="/Assets/Images/gary_logo.png" alt="GARY" />
          <span>GARY<span className="accent">.</span></span>
        </button>
        <div className="nav-links">
          <button className="nav-link active">Game Hub</button>
          <button className="nav-link" onClick={onBack}>Tentang GARY</button>
        </div>
        <button className="outline-button" onClick={onBack}>Kembali</button>
      </nav>

      <main className="hub-wrap">
        <header className="hub-header">
          <p className="eyebrow">GARY COMMUNITY / IPB</p>
          <h1><span>GARY</span> GAME HUB</h1>
          <p>Temukan karya game mahasiswa IPB.</p>
        </header>

        <section className="hub-toolbar">
          <div>
            <h2>Koleksi Game</h2>
            <p>Mainkan dan dukung karya developer GARY.</p>
          </div>
          <button className="green-button" onClick={onBack}>+ Tambahkan Game</button>
        </section>

        <section className="game-grid">
          {visibleGames.map((game) => <GameCard key={game[0]} game={game} />)}
        </section>

        <div className="pagination">
          <button className="page-arrow" disabled={page === 0} onClick={() => setPage(page - 1)}>‹</button>
          <div className="page-dots">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                aria-label={`Halaman ${index + 1}`}
                className={`page-dot ${index === page ? "active" : ""}`}
                onClick={() => setPage(index)}
              />
            ))}
          </div>
          <button className="page-arrow" disabled={page === pageCount - 1} onClick={() => setPage(page + 1)}>›</button>
        </div>
      </main>
    </div>
  );
}
