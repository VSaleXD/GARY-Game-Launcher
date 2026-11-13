import PacmanGame from "./game";
import { cut } from "../lib/cut";

export default function hero() {
  return (
    <section className="relative overflow-hidden bg-[#0A0D0A] px-6 pb-20 pt-10 text-[#e8f5d8]">
      {/* pola piksel pojok kiri atas */}
      <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-[260px] w-[420px]"
        style={{
          background: "conic-gradient(#173512 25%,#0e260c 0 50%,#173512 0 75%,#0e260c 0) 0 0/28px 28px",
          WebkitMaskImage: "linear-gradient(135deg,#000 15%,transparent 62%)",
          maskImage: "linear-gradient(135deg,#000 15%,transparent 62%)",
        }} />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_1.1fr]">
        <div>
          <span style={cut(6)} className="inline-block bg-lime-400 py-1.5 pl-2.5 pr-3.5 font-mono text-xs font-bold text-[#0b1a08]">
            &gt; GAME DEVELOPMENT COMMUNITY / IPB UNIVERSITY
          </span>
          <h1 className="my-4 font-['Bebas_Neue'] text-[clamp(64px,10vw,140px)] leading-[.9] tracking-wide">
            Belajar.<br /><em className="not-italic text-lime-400">Berkarya.</em><br />Bermain.
          </h1>
          <p className="max-w-[46ch] text-sm leading-7 opacity-80">
            GARY adalah rumah bagi mahasiswa IPB yang ingin belajar, membuat, dan berbagi pengalaman dalam dunia pengembangan game.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5 font-mono text-[13px] font-bold">
            <a href="#game-hub" style={cut(8)} className="bg-lime-400 px-6 py-3.5 text-[#0b1a08] transition-colors hover:bg-white">Jelajahi Game Hub →</a>
            <a href="#about" className="text-lime-400 hover:text-white">Kenali GARY ↓</a>
          </div>
        </div>
        <PacmanGame />
      </div>
    </section>
  );
}