import { Link } from "react-router-dom";
import SiteNav from "../Components/SiteNav";
import TeamSection from "../Components/teamSection";
import SpriteViewport from "../Components/spriteViewport";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <SiteNav />
      <main>
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <p className="eyebrow">GAME DEVELOPMENT COMMUNITY / IPB University</p>
            <h1>Learn.<br /><span>Develop.</span><br />Fun.</h1>
            <p className="hero-description">Komunitas game development IPB University. Kami ngoding, gambar, dan bersenang-senang — dari game jam sampai proyek yang dipamerkan.</p>
            <div className="hero-actions">
              <Link className="green-button" to="/game-hub">Jelajahi Game Hub <span>→</span></Link>
              <a className="text-button" href="#about">Kenali GARY <span>↓</span></a>
            </div>
          </div>
          <SpriteViewport />
        </section>

      </main>
      <div className="about-section" id="about">
        <h2>Tentang GARY</h2>
        <p>GARY adalah komunitas pengembang game di IPB University. Kami mengadakan game jam, workshop, dan proyek kolaboratif untuk belajar dan bersenang-senang bersama.</p>
        <p>Komunitas ini terbuka untuk semua mahasiswa IPB yang tertarik dengan pengembangan game, baik pemula maupun yang sudah berpengalaman. Bergabunglah dengan kami untuk belajar, mengembangkan keterampilan, dan menciptakan game yang menyenangkan!</p>
        <TeamSection /> 
      </div>
      


      <footer><span>GARY COMMUNITY — IPB</span><span>LEARN • DEVELOP • FUN</span></footer>
    </div>
  );
}
