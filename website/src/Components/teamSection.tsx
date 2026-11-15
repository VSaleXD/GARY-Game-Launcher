import { useState } from "react";
import { cut } from "../lib/cut";

// Taruh AllMember-trim.webp di public/Assets/AnggotaGary/ (foto sudah dipotong rapat & diperkecil)
const IMG = "/Assets/AnggotaGary/AllMember-trim.webp";
const F = "font-['Oxanium',sans-serif]";

// x & w = area hover (% lebar foto) · cx = posisi name plate (% lebar foto)
const ROSTER = [
  { name: "ALEANDRE", role: "Programmer", x: 0, w: 32, cx: 17, stats: { CODE: 90, ART: 40, DSGN: 60 } },
  { name: "ANDHIKA", role: "Game Designer", x: 32, w: 18, cx: 38, stats: { CODE: 60, ART: 50, DSGN: 90 } },
  { name: "ADITYA", role: "Artist", x: 50, w: 22, cx: 65, stats: { CODE: 45, ART: 92, DSGN: 65 } },
  { name: "DARITH", role: "Programmer", x: 72, w: 28, cx: 88, stats: { CODE: 85, ART: 35, DSGN: 70 } },
];

export default function TeamSection() {
  const [hover, setHover] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [pt, setPt] = useState({ x: 0, y: 0 });

  const place = (x: number, y: number) =>
    setPt({ x: Math.max(8, Math.min(x, window.innerWidth - 246)), y: Math.max(8, Math.min(y, window.innerHeight - 200)) });
  const enter = (e: React.PointerEvent, i: number) => { place(e.clientX + 18, e.clientY + 14); setHover(i); };
  const leave = (e: React.PointerEvent) => { if (e.pointerType !== "touch") setHover(null); };
  const focus = (e: React.FocusEvent, i: number) => {
    const r = e.currentTarget.getBoundingClientRect();
    place(r.left + r.width / 2 - 115, r.top + 24); setHover(i);
  };
  const p = hover !== null ? ROSTER[hover] : null;

  return (
    <section id="penggary" className="w-full bg-white text-[#0b1a08]"
      style={{
        backgroundImage: "linear-gradient(rgba(11,26,8,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(11,26,8,.06) 1px,transparent 1px)",
        backgroundSize: "32px 32px",
      }}>


      <div className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        <span style={cut(6)} className="inline-block bg-lime-400 py-1.5 pl-2.5 pr-3.5 font-mono text-xs font-bold">&gt; CHARACTER SELECT</span>
        <h2 className={`${F} m-0 mt-3 text-[clamp(44px,8vw,104px)] font-extrabold leading-[.95] tracking-tight`}>PENGGARY HANDAL</h2>
        
        {/* PANGGUNG — di tengah */}
        <div className="mx-auto mt-10 w-full max-w-[720px] select-none">
          <div className="relative">
            <img src={IMG} alt="Foto tim GARY: Aleandre, Andhika, Aditya, Daffa" className="pointer-events-none block h-auto w-full" />
            {ROSTER.map((r, i) => {
              const on = hover === i || picked === i;
              return (
                <button key={r.name} type="button" aria-label={`${r.name}, ${r.role}`}
                  className="absolute inset-y-0 cursor-pointer border-0 bg-transparent p-0 outline-none"
                  style={{ left: `${r.x}%`, width: `${r.w}%` }}
                  onPointerEnter={(e) => enter(e, i)} onPointerMove={(e) => place(e.clientX + 18, e.clientY + 14)}
                  onPointerLeave={leave} onFocus={(e) => focus(e, i)} onBlur={() => setHover(null)}
                  onClick={() => setPicked(i)}>
                  <span className={`absolute left-1 top-[4%] block h-6 w-6 border-l-[3px] border-t-[3px] border-lime-500 transition-opacity ${on ? "opacity-100" : "opacity-0"}`} />
                  <span className={`absolute bottom-[3%] right-1 block h-6 w-6 border-b-[3px] border-r-[3px] border-lime-500 transition-opacity ${on ? "opacity-100" : "opacity-0"}`} />
                </button>
              );
            })}
          </div>
          <div aria-hidden className="h-3 bg-[#0b1a08]" style={cut(6)} />
          <div className="relative mt-3 h-9">
            {ROSTER.map((r, i) => {
              const on = hover === i || picked === i;
              return (
                <button key={r.name} type="button" tabIndex={-1} style={{ ...cut(6), left: `${r.cx}%` }}
                  onPointerEnter={(e) => enter(e, i)} onPointerLeave={leave} onClick={() => setPicked(i)}
                  className={`absolute top-0 -translate-x-1/2 whitespace-nowrap border-0 px-3 py-2 transition-colors ${on ? "bg-lime-400" : "bg-[#0b1a08]"}`}>
                  <span className={`font-mono text-[11px] font-bold ${on ? "text-[#0b1a08]" : "text-lime-400"}`}>
                    P{i + 1}<span className="hidden sm:inline"> {r.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CARD HUD — muncul hanya saat hover / fokus / ketuk */}
      {p && (
        <div style={{ ...cut(10), left: pt.x, top: pt.y }}
          className="pointer-events-none fixed z-50 w-[230px] bg-[#0A0D0A]/95 p-3.5 font-mono text-[11px] text-[#e8f5d8] shadow-[inset_0_0_0_1px_#a3e635]">
          <div className={`${F} text-[34px] font-extrabold leading-none text-lime-400`}>{p.name}</div>
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
    </section>
  );
}
