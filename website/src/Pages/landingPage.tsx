type LandingPageProps = { onOpenHub: () => void };

export default function LandingPage({ onOpenHub }: LandingPageProps) {
  return (
    <div className="landing-page">
      <nav className="site-nav landing-nav">
        <button className="brand-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src="/Assets/Images/gary_logo.png" alt="GARY" />
          <span>GARY<span className="accent">.</span></span>
        </button>
        <div className="nav-links">
          <a className="nav-link active" href="#home">Home</a>
          <a className="nav-link" href="#about">Tentang</a>
          <a className="nav-link" href="#features">Fitur</a>
        </div>
        <button className="outline-button" onClick={onOpenHub}>Buka Game Hub</button>
      </nav>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <p className="eyebrow">GAME DEVELOPMENT COMMUNITY / IPB</p>
            <h1>Belajar.<br /><span>Berkarya.</span><br />Bermain.</h1>
            <p className="hero-description">
              GARY adalah rumah bagi mahasiswa IPB yang ingin belajar,
              membuat, dan berbagi pengalaman dalam dunia pengembangan game.
            </p>
            <div className="hero-actions">
              <button className="green-button" onClick={onOpenHub}>Jelajahi Game Hub <span>→</span></button>
              <a className="text-button" href="#about">Kenali GARY <span>↓</span></a>
            </div>
          </div>
          <div className="hero-art" aria-label="Ilustrasi GARY">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="hero-logo"><img src="/Assets/Images/gary_logo.png" alt="" /></div>
            <span className="float-label label-one">CREATE</span>
            <span className="float-label label-two">PLAY</span>
            <span className="float-label label-three">GROW</span>
          </div>
        </section>

        <section className="about-section" id="about">
          <div>
            <p className="eyebrow">SATU KOMUNITAS, BANYAK KEMUNGKINAN</p>
            <h2>Tempat ide game<br /><span>menjadi nyata.</span></h2>
          </div>
          <p className="section-description">
            Dari konsep pertama sampai game yang bisa dimainkan. Temukan teman
            satu visi, pelajari hal baru, dan tunjukkan karya terbaikmu bersama GARY.
          </p>
        </section>

        <section className="feature-section" id="features">
          <article><strong>01</strong><h3>Game Hub</h3><p>Mainkan dan temukan game buatan developer GARY.</p><button onClick={onOpenHub}>Lihat koleksi →</button></article>
          <article><strong>02</strong><h3>Kolaborasi</h3><p>Cari tim dan teman untuk mewujudkan ide game-mu.</p><button onClick={onOpenHub}>Segera hadir →</button></article>
          <article><strong>03</strong><h3>Belajar bersama</h3><p>Akses materi, dokumentasi, dan pengalaman komunitas.</p><button onClick={onOpenHub}>Segera hadir →</button></article>
        </section>
      </main>
      <footer><span>GARY COMMUNITY — IPB</span><span>LEARN • DEVELOP • FUN</span></footer>
    </div>
  );
}
