import { useState } from "react";
import { cut } from "../lib/cut";

const ROSTER = [
  { name: "ALEANDRE", role: "Programmer", x: 0, w: 33, stats: { CODE: 90, ART: 40, DSGN: 60 } },
  { name: "ANDHIKA", role: "Game Designer", x: 33, w: 22, stats: { CODE: 60, ART: 50, DSGN: 90 } },
  { name: "ADITYA", role: "Artist", x: 55, w: 17, stats: { CODE: 45, ART: 92, DSGN: 65 } },
  { name: "DAFFA", role: "Programmer", x: 72, w: 28, stats: { CODE: 85, ART: 35, DSGN: 70 } },
];


export default function TeamSection() {
  const [hover, setHover] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [pt, setPt] = useState({ x: 0, y: 0 });

  const move = (e: React.PointerEvent, i: number) => {
    setPt({
      x: Math.max(8, Math.min(e.clientX + 18, window.innerWidth - 246)),
      y: Math.max(8, Math.min(e.clientY + 14, window.innerHeight - 190)),
    });
    setHover(i);
  };
  const p = hover !== null ? ROSTER[hover] : null;

  return (
    <section id="penggary" className="team-landing-section bg-white px-6 pb-20 pt-16 text-[#0b1a08]">
      <div className="team-landing-inner mx-auto max-w-6xl">
        <h2 className="font-['Bebas_Neue'] text-[clamp(56px,9vw,120px)] leading-[.9]">PENGGARY HANDAL</h2>
        <p className="font-mono text-xs opacity-60">{"// CHARACTER SELECT — arahkan kursor atau ketuk salah satu anggota"}</p>
      </div>

      <div className="team-landing-stage relative mx-auto mt-6 max-w-[900px] select-none">
        <img src="/Assets/AnggotaGary/AllMember.png" alt="Foto tim GARY: Aleandre, Andhika, Aditya, Daffa" className="team-landing-image pointer-events-none block w-full" />
        <div aria-hidden className="absolute -bottom-1.5 left-[4%] right-[4%] h-2.5 bg-[#0b1a08]" />
        {ROSTER.map((m, i) => {
          const on = hover === i || picked === i;
          return (
            <button key={m.name} type="button" aria-label={`${m.name}, ${m.role}`}
              className="group absolute inset-y-0 cursor-pointer outline-none"
              style={{ left: `${m.x}%`, width: `${m.w}%` }}
              onPointerMove={(e) => move(e, i)} onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)} onBlur={() => setHover(null)}
              onClick={() => setPicked(i)}>
              <span className={`absolute left-1.5 top-[8%] h-5 w-5 border-l-[3px] border-t-[3px] border-lime-500 transition-opacity ${on ? "opacity-100" : "opacity-0"}`} />
              <span className={`absolute bottom-[6%] right-1.5 h-5 w-5 border-b-[3px] border-r-[3px] border-lime-500 transition-opacity ${on ? "opacity-100" : "opacity-0"}`} />
              <span style={cut(6)} className={`absolute bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 font-mono text-[11px] font-bold ${on ? "bg-lime-400 text-[#0b1a08]" : "bg-[#0b1a08] text-lime-400"}`}>
                P{i + 1} {m.name}
              </span>
            </button>
          );
        })}
      </div>

      {p && (
        <div style={{ ...cut(10), left: pt.x, top: pt.y }}
          className="team-hud pointer-events-none fixed z-50 w-[230px] bg-[#0A0D0A]/95 p-3.5 font-mono text-[11px] text-[#e8f5d8] shadow-[inset_0_0_0_1px_#a3e635]">
          <div className="font-['Bebas_Neue'] text-[34px] leading-none text-lime-400">{p.name}</div>
          <div className="mb-2.5 mt-0.5 text-[#9db88a]">{p.role} · LV.{20 + (p.stats.CODE % 9)}</div>
          {Object.entries(p.stats).map(([k, v]) => (
            <div key={k} className="my-1.5 grid grid-cols-[44px_1fr_24px] items-center gap-1.5">
              <span>{k}</span>
              <span className="h-2 bg-[#1d281a]"><span className="block h-full bg-lime-400" style={{ width: `${v}%` }} /></span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      )}

      <div style={cut(10)} className="team-landing-status mx-auto mt-9 min-h-14 max-w-[560px] bg-[#0b1a08] px-4 py-3.5 font-mono text-xs text-[#e8f5d8]">
        &gt; {picked === null ? "Pilih karakter…" : <><b className="text-lime-400">P{picked + 1} {ROSTER[picked].name}</b> dipilih — {ROSTER[picked].role}. READY!</>}
      </div>
    </section>
  );
}