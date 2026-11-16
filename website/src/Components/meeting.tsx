import { useEffect, useRef, useState } from "react";
import { cut } from "../lib/cut";
import Gary1 from "../../Assets/Galleri/Gary1.jpeg";
import Gary2 from "../../Assets/Galleri/Gary2.jpeg";
import Gary3 from "../../Assets/Galleri/Gary3.jpeg";
import Gary4 from "../../Assets/Galleri/Gary4.jpeg";
import Agsn from "../../Assets/Galleri/AGSN.webp";
import WeeklyMeet from "../../Assets/Galleri/WeeklyMeet.jpg";

const F = "font-['Oxanium',sans-serif]";

const SHOTS = [
  { id: "weekly-meet", file: "WeeklyMeet.jpg", src: WeeklyMeet, tag: "WEEKLY MEET 2026/2027", title: "New Beginnings", desc: "Pertemuan pertama GARY setelah sekian lama." },
  { id: "agsn", file: "agsn.jpeg", src: Agsn, tag: "EVENT", title: "AGSN — Booth Game Reality", desc: "GARY memperkenalkan komunitas dan game buatan anggota ke mahasiswa baru." },
  { id: "gary1", file: "gary1.jpeg", src: Gary1, tag: "WEEKLY MEET 2024/2025", title: "Momen GARY #1", desc: "Pertemuan awal GARY yang masih di RKU 2.01." },
  { id: "gary2", file: "gary2.jpeg", src: Gary2, tag: "WEEKLY MEET 2024/2025", title: "Momen GARY #2", desc: "Membahas projek game bersama." },
  { id: "gary3", file: "gary4.jpeg", src: Gary4, tag: "WEEKLY MEET 2025/2026", title: "Momen GARY #3", desc: "Online meet GARY." },
  {id: "gary4", file: "gary3.jpeg", src: Gary3, tag: "WEEKLY MEET 2025/2026", title: "Momen GARY #4", desc: "Kumpul terakhir kali di RKU 2.01." },
];

const N = SHOTS.length, AUTO_MS = 6000;

export default function MeetingGallery() {
  const box = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [manual, setManual] = useState(false);
  const [hover, setHover] = useState(false);
  const [fs, setFs] = useState(false);
  const [fill, setFill] = useState(true); // layar penuh: true = foto memenuhi layar (crop), false = tampil utuh
  const [ui, setUi] = useState(true);
  const timer = useRef<number | undefined>(undefined);
  const wake = () => { setUi(true); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setUi(false), 2500); };
  const s = SHOTS[i];

  const go = (n: number, byUser = true) => { setI((n + N) % N); if (byUser) setManual(true); };
  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else box.current?.requestFullscreen?.();
  };

  useEffect(() => {
    const h = () => { const on = document.fullscreenElement === box.current; setFs(on); if (on) wake(); else window.clearTimeout(timer.current); };
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  useEffect(() => {
    if (manual || hover || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % N), AUTO_MS);
    return () => clearInterval(t);
  }, [manual, hover]);

  const arrow = (label: string, side: string, d: number) => (
    <button type="button" aria-label={d > 0 ? "Foto berikutnya" : "Foto sebelumnya"} onClick={() => go(i + d)} style={cut(8)}
      className={`group absolute top-1/2 z-10 -translate-y-1/2 border-0 bg-[#0A0D0A]/80 px-3 py-5 transition-all hover:bg-lime-400 ${side} ${fs && !ui ? "pointer-events-none opacity-0" : ""}`}>
      <span className="font-mono text-lg font-bold text-lime-400 group-hover:text-[#0b1a08]">{label}</span>
    </button>
  );

  return (
    <section id="galeri" className="relative w-full overflow-hidden bg-[#0A0D0A] text-[#e8f5d8]"
      style={{
        backgroundImage: "linear-gradient(rgba(163,230,53,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(163,230,53,.05) 1px,transparent 1px)",
        backgroundSize: "32px 32px",
      }}>
      <style>{"@keyframes galfade{from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:none}}"}</style>
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-[240px] w-[420px]"
        style={{
          background: "conic-gradient(#173512 25%,#0e260c 0 50%,#173512 0 75%,#0e260c 0) 0 0/28px 28px",
          WebkitMaskImage: "linear-gradient(225deg,#000 10%,transparent 60%)", maskImage: "linear-gradient(225deg,#000 10%,transparent 60%)",
        }} />

      <div className="relative mx-auto max-w-6xl px-6 pt-20">
        <span style={cut(6)} className="inline-block bg-lime-400 py-1.5 pl-2.5 pr-3.5 font-mono text-xs font-bold text-[#0b1a08]">&gt; MEETING LOG</span>
        <h2 className={`${F} m-0 mt-3 text-[clamp(44px,8vw,104px)] font-extrabold leading-[.95] tracking-tight`}>
          GARY <span className="text-lime-400">IN ACTION</span>
        </h2>
      </div>

      {/* VIEWER — lebar penuh, bisa layar penuh */}
      <div className="relative mx-auto w-full max-w-[1760px] px-3 pb-20 sm:px-6">
        <div ref={box} tabIndex={0} aria-roledescription="carousel" aria-label="Galeri foto GARY"
          style={fs ? undefined : cut(16)}
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onMouseMove={fs ? wake : undefined}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(i + 1);
            if (e.key === "ArrowLeft") go(i - 1);
            if (e.key === "f" || e.key === "F") toggleFs();
          }}
          className={`flex flex-col bg-[#101510] outline-none ${fs ? "relative h-screen bg-black" : "shadow-[0_0_0_1px_rgba(163,230,53,.25)]"}`}>
          <div className={`flex items-center justify-between gap-3 px-3 py-2 font-mono text-[11px] text-[#9db88a] transition-opacity ${fs ? `absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/85 to-transparent ${ui ? "" : "pointer-events-none opacity-0"}` : "border-b border-lime-400/15 bg-[#0d120d]"}`}>
            <span className="truncate"><b className="text-lime-400">▣</b> Gallery</span>
            <span className="flex shrink-0 items-center gap-3">
              <span>{String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}</span>
              {fs && (
                <span className="text-lime-400">◸</span>
              )}
              <button type="button" onClick={toggleFs} aria-label={fs ? "Keluar layar penuh" : "Layar penuh"}
                className="border border-lime-400/30 bg-[#182018] px-2 py-1 transition-colors hover:border-lime-400 hover:bg-lime-400">
                <span className="font-mono text-[11px] font-bold text-lime-400 hover:text-[#0b1a08]">{fs ? "✕ KELUAR" : "⛶ LAYAR PENUH"}</span>
              </button>
            </span>
          </div>

          <div onDoubleClick={toggleFs}
            className={`relative overflow-hidden bg-black ${fs ? "absolute inset-0 h-full w-full" : "aspect-[4/3] max-h-[85vh] w-full sm:aspect-[16/9]"}`}>
            <div key={s.id} className="absolute inset-0" style={{ animation: "galfade .45s ease-out" }}>
              <img src={s.src} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl" />
              <img src={s.src} alt={s.title} className={`relative h-full w-full ${fs && fill ? "object-cover" : "object-contain"}`} style={fs && fill ? { objectPosition: "center 35%" } : undefined} />
            </div>
            {arrow("◀", "left-3", -1)}
            {arrow("▶", "right-3", 1)}
            <span aria-hidden className={`pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[3px] border-t-[3px] border-lime-400 ${fs ? "hidden" : ""}`} />
            <span aria-hidden className={`pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[3px] border-r-[3px] border-lime-400 ${fs ? "hidden" : ""}`} />
          </div>

          <div className={`flex flex-wrap items-end justify-between gap-4 transition-opacity ${fs ? `absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 to-transparent px-8 pb-8 pt-24 ${ui ? "" : "pointer-events-none opacity-0"}` : "border-t border-lime-400/15 p-4"}`}>
            <div className="min-w-0 flex-1" aria-live="polite">
              <span style={cut(5)} className="inline-block bg-lime-400 px-2.5 py-1 font-mono text-[10px] font-bold text-[#0b1a08]">{s.tag}</span>
              <div className={`${F} mt-2 text-2xl font-extrabold leading-tight sm:text-3xl`}>{s.title}</div>
              <p className="mt-1 max-w-[70ch] font-mono text-xs leading-relaxed text-[#9db88a]">{s.desc}</p>
            </div>
            <div className="flex gap-1.5" role="tablist" aria-label="Pilih foto">
              {SHOTS.map((x, n) => (
                <button key={x.id} type="button" role="tab" aria-selected={n === i} aria-label={`Foto ${n + 1}`} onClick={() => go(n)}
                  className={`h-2 border-0 p-0 transition-all ${n === i ? "w-8 bg-lime-400" : "w-4 bg-[#2a3a24] hover:bg-lime-400/60"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}