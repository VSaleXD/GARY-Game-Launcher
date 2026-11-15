import { useEffect, useRef, useState } from "react";
import { cut } from "../lib/cut";

type K = "idle" | "walk" | "attack";
type R = { x: number; y: number; w: number; h: number };
type P = { tol: number; gap: number; key: boolean };
type Cfg = { name: string; orig: string; src: string; w: number; h: number; frames: R[]; seq: Record<K, string>; fps: Record<K, number>; scale: number; feet: boolean; p: P; custom?: boolean };
type Mode = "auto" | "grid" | "manual";

const KEYS: K[] = ["idle", "walk", "attack"];
const COLOR: Record<K, string> = { idle: "#a3e635", walk: "#22d3ee", attack: "#fb7185" };
const HINT: Record<K, string> = { idle: "saat diam", walk: "saat berjalan", attack: "saat klik" };
const P0: P = { tol: 40, gap: 6, key: true };
const CHECKER = { backgroundImage: "conic-gradient(#1b251b 25%,#121912 0 50%,#1b251b 0 75%,#121912 0)", backgroundSize: "16px 16px" };

const gridFrames = (w: number, h: number, fw: number, fh: number, ox = 0, oy = 0, sp = 0) => {
  const out: R[] = [];
  for (let y = oy; y < h; y += fh + sp) for (let x = ox; x < w; x += fw + sp) {
    const rw = Math.min(fw, w - x), rh = Math.min(fh, h - y);
    if (rw > 0 && rh > 0) out.push({ x, y, w: rw, h: rh });
  }
  return out;
};
const parse = (s: string, n: number) => {
  const out: number[] = [];
  for (const part of s.split(",")) {
    const m = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) continue;
    const a = +m[1], b = m[2] !== undefined ? +m[2] : a, step = a <= b ? 1 : -1;
    for (let i = a; step > 0 ? i <= b : i >= b; i += step) if (i < n) out.push(i);
  }
  return out;
};
const all = (n: number) => { const s = n > 1 ? `0-${n - 1}` : "0"; return { idle: s, walk: s, attack: s }; };
const autoScale = (f: R[]) => Math.max(1, Math.min(8, Math.round(110 / Math.max(1, ...f.map((r) => r.h)))));
const DEFAULT: Cfg = {
  name: "player.png", orig: "/Assets/sprites/player.png", src: "/Assets/sprites/player.png", w: 50, h: 50,
  frames: gridFrames(50, 50, 17, 17), seq: { idle: "0-1", walk: "2-6", attack: "7-8" }, fps: { idle: 8, walk: 8, attack: 8 }, scale: 5, feet: false, p: P0,
};

/** Deteksi sprite otomatis: buang latar (warna sudut / alpha), cari bagian yang terhubung, gabungkan yang berdekatan. */
async function analyze(url: string, p: P) {
  const im = await new Promise<HTMLImageElement>((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
  const w = im.naturalWidth, h = im.naturalHeight, N = w * h;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
  const g = cv.getContext("2d", { willReadFrequently: true })!; g.drawImage(im, 0, 0);
  const id = g.getImageData(0, 0, w, h), d = id.data;
  const useColor = d[3] >= 250, t = p.tol * 3;
  const isBg = (i: number) => { const k = i * 4; return d[k + 3] < 20 || (useColor && Math.abs(d[k] - d[0]) + Math.abs(d[k + 1] - d[1]) + Math.abs(d[k + 2] - d[2]) <= t); };
  const out = new Uint8Array(N), st: number[] = [];
  const push = (i: number) => { if (!out[i] && isBg(i)) { out[i] = 1; st.push(i); } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (st.length) { const i = st.pop()!, x = i % w; if (x > 0) push(i - 1); if (x < w - 1) push(i + 1); if (i >= w) push(i - w); if (i < N - w) push(i + w); }
  const lab = new Uint8Array(N); let rects: R[] = [];
  for (let s = 0; s < N; s++) {
    if (out[s] || lab[s]) continue;
    lab[s] = 1; st.push(s);
    let x0 = w, y0 = h, x1 = 0, y1 = 0, a = 0;
    while (st.length) {
      const i = st.pop()!, x = i % w, y = (i - x) / w; a++;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const j = ny * w + nx; if (!out[j] && !lab[j]) { lab[j] = 1; st.push(j); }
      }
    }
    if (a >= 12) rects.push({ x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 });
  }
  const near = (a: R, b: R) => a.x - p.gap <= b.x + b.w && b.x - p.gap <= a.x + a.w && a.y - p.gap <= b.y + b.h && b.y - p.gap <= a.y + a.h;
  for (let ch = true; ch;) {
    ch = false;
    for (let i = 0; i < rects.length && !ch; i++) for (let j = i + 1; j < rects.length; j++) if (near(rects[i], rects[j])) {
      const a = rects[i], b = rects[j], x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
      rects[i] = { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y };
      rects.splice(j, 1); ch = true; break;
    }
  }
  rects.sort((a, b) => a.y + a.h / 2 - (b.y + b.h / 2));
  const mh = rects.map((r) => r.h).sort((a, b) => a - b)[rects.length >> 1] || 1, rows: R[][] = [];
  for (const r of rects) { const row = rows[rows.length - 1]; if (row && Math.abs(r.y + r.h / 2 - (row[0].y + row[0].h / 2)) < mh * 0.6) row.push(r); else rows.push([r]); }
  rects = rows.flatMap((r) => r.sort((a, b) => a.x - b.x));
  let clean = url;
  if (p.key) { for (let i = 0; i < N; i++) if (out[i]) d[i * 4 + 3] = 0; g.putImageData(id, 0, 0); clean = cv.toDataURL("image/png"); }
  return { w, h, rects, clean };
}

function Num({ l, v, min, max, on }: { l: string; v: number; min: number; max: number; on: (n: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-[10px] text-[#6d8a5a]">
      {l}
      <input type="number" value={v} min={min} max={max}
        onChange={(e) => { const n = parseInt(e.target.value, 10); if (!Number.isNaN(n)) on(Math.max(min, Math.min(max, n))); }}
        className="w-full border border-lime-400/20 bg-[#0a110c] px-2 py-1.5 text-xs text-[#e8f5d8] outline-none focus:border-lime-400" />
    </label>
  );
}

export default function SpriteViewport() {
  const vp = useRef<HTMLDivElement>(null);
  const sp = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const target = useRef<{ x: number; y: number } | null>(null);
  const attackUntil = useRef(0);
  const [slots, setSlots] = useState<Cfg[]>([DEFAULT]);
  const [cur, setCur] = useState(0);
  const [edit, setEdit] = useState<K>("idle");
  const [mode, setMode] = useState<Mode>("auto");
  const [gp, setGp] = useState({ fw: 16, fh: 16, ox: 0, oy: 0, sp: 0 });
  const [draw, setDraw] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const [dock, setDock] = useState(false);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [coord, setCoord] = useState({ x: 0, y: 0 });

  const c = slots[cur] ?? DEFAULT;
  const cfg = useRef(c);
  cfg.current = c;
  const n = c.frames.length;
  const sets = Object.fromEntries(KEYS.map((k) => [k, new Set(parse(c.seq[k], n))])) as Record<K, Set<number>>;

  const patch = (p: Partial<Cfg>) => setSlots((s) => s.map((x, i) => (i === cur ? { ...x, ...p } : x)));
  const setSeq = (k: K, v: string) => patch({ seq: { ...c.seq, [k]: v } });

  useEffect(() => {
    const v = vp.current!, s = sp.current!;
    const pos = { x: v.clientWidth / 2, y: v.clientHeight / 2 };
    let dir = 1, anim: K = "idle", t0 = 0, raf = 0, last = performance.now();
    const ro = new ResizeObserver(() => { pos.x = Math.min(pos.x, v.clientWidth); pos.y = Math.min(pos.y, v.clientHeight); });
    ro.observe(v);
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      let a: K = "idle";
      const t = target.current;
      if (now < attackUntil.current) a = "attack";
      else if (t) {
        const dx = t.x - pos.x, dy = t.y - pos.y, d = Math.hypot(dx, dy);
        if (d > 6) { const k = (Math.min(d * 4, 170) * dt) / d; pos.x += dx * k; pos.y += dy * k; a = "walk"; if (Math.abs(dx) > 3) dir = dx < 0 ? -1 : 1; }
      }
      if (a !== anim) { anim = a; t0 = now; }
      const C = cfg.current, l = parse(C.seq[anim], C.frames.length), L = l.length ? l : [0];
      const f = C.frames[L[Math.floor(((now - t0) / 1000) * Math.max(1, C.fps[anim])) % L.length]];
      if (f) {
        const oy = C.feet ? f.h : f.h / 2;
        s.style.width = f.w + "px"; s.style.height = f.h + "px"; s.style.backgroundPosition = `-${f.x}px -${f.y}px`;
        s.style.transformOrigin = `${f.w / 2}px ${oy}px`;
        s.style.transform = `translate(${pos.x - f.w / 2}px,${pos.y - oy}px) scale(${dir * C.scale},${C.scale})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const addFile = async (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return setErr("File harus berupa gambar (PNG, WebP, GIF, JPG).");
    if (slots.length >= 4) return setErr("Maksimal 4 sprite. Hapus salah satu dulu.");
    const url = URL.createObjectURL(f); setBusy(true);
    try {
      const r = await analyze(url, P0);
      const frames = r.rects.length ? r.rects : gridFrames(r.w, r.h, Math.min(r.w, r.h), Math.min(r.w, r.h));
      setSlots((s) => [...s, { name: f.name, orig: url, src: r.clean, w: r.w, h: r.h, frames, seq: all(frames.length), fps: { idle: 8, walk: 8, attack: 8 }, scale: autoScale(frames), feet: true, p: P0, custom: true }]);
      setCur(slots.length); setErr(""); setDock(true); setMode("auto"); setEdit("idle"); setSel(null);
    } catch { URL.revokeObjectURL(url); setErr("Gambar tidak bisa dibaca."); }
    setBusy(false);
  };
  const runAuto = async () => {
    setBusy(true);
    try {
      const r = await analyze(c.orig, c.p);
      if (!r.rects.length) setErr("Tidak ada sprite terdeteksi. Coba naikkan toleransi.");
      else { patch({ src: r.clean, frames: r.rects, seq: all(r.rects.length), scale: autoScale(r.rects), feet: true }); setErr(""); setSel(null); }
    } catch { setErr("Gagal memotong gambar."); }
    setBusy(false);
  };
  const applyGrid = () => {
    const f = gridFrames(c.w, c.h, gp.fw, gp.fh, gp.ox, gp.oy, gp.sp);
    if (!f.length) return setErr("Pengaturan grid tidak menghasilkan frame.");
    patch({ frames: f, seq: all(f.length), scale: autoScale(f), feet: false }); setErr(""); setSel(null);
  };
  const delFrame = (i: number) => {
    const fix = (s: string) => parse(s, n).filter((v) => v !== i).map((v) => (v > i ? v - 1 : v)).join(",");
    patch({ frames: c.frames.filter((_, j) => j !== i), seq: { idle: fix(c.seq.idle), walk: fix(c.seq.walk), attack: fix(c.seq.attack) } }); setSel(null);
  };
  const remove = () => { if (c.custom) { URL.revokeObjectURL(c.orig); setSlots((s) => s.filter((_, i) => i !== cur)); setCur(0); } };
  const append = (i: number, shift: boolean) => {
    const s = c.seq[edit], last = parse(s, n).at(-1) ?? i, add = shift ? `${last}-${i}` : `${i}`;
    setSeq(edit, s.trim() ? `${s},${add}` : add); setSel(i);
  };
  const copy = () => navigator.clipboard?.writeText(JSON.stringify({ frames: c.frames, animations: Object.fromEntries(KEYS.map((k) => [k, { frames: parse(c.seq[k], n), fps: c.fps[k] }])) }, null, 2));

  const local = (e: React.PointerEvent) => { const r = vp.current!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height }; };
  const img = (e: React.PointerEvent) => {
    const r = sheet.current!.getBoundingClientRect();
    return { x: Math.max(0, Math.min(c.w, Math.round(((e.clientX - r.left) / r.width) * c.w))), y: Math.max(0, Math.min(c.h, Math.round(((e.clientY - r.top) / r.height) * c.h))) };
  };
  const endDraw = () => {
    if (!draw) return;
    const x = Math.min(draw.x0, draw.x1), y = Math.min(draw.y0, draw.y1), w = Math.abs(draw.x1 - draw.x0), h = Math.abs(draw.y1 - draw.y0);
    setDraw(null);
    if (w >= 2 && h >= 2) { patch({ frames: [...c.frames, { x, y, w, h }], feet: true }); setSel(n); }
  };
  const btn = "border px-2.5 py-1.5 transition-colors";
  const ghost = `${btn} border-lime-400/15 bg-[#182018] hover:border-lime-400`;

  return (
    <div style={cut(16)} className="w-full min-w-0 max-w-full bg-[#101510] font-mono text-[11px] text-[#cfe6b8] shadow-[0_0_0_1px_rgba(163,230,53,.2)]">
      {/* spacer tak terlihat: membuat komponen "meminta" selebar layar, jadi lebar halaman tidak menyusut saat isinya berubah */}
      <div aria-hidden className="h-0 w-[100vw] max-w-full" />
      <div className="flex items-center justify-between gap-2 border-b border-lime-400/15 bg-[#0d120d] px-3 py-2 text-[#9db88a]">
        <span className="truncate"><b className="text-lime-400">▣</b> Scene · 2D · {c.name}</span>
        <span className="shrink-0">X: {coord.x} &nbsp; Y: {coord.y}</span>
      </div>

      <div ref={vp} aria-label="Viewport interaktif: gerakkan kursor, klik untuk attack, lepas file gambar untuk mengganti sprite"
        className="relative h-[300px] cursor-crosshair touch-none overflow-hidden md:h-[340px]"
        style={{ backgroundColor: "#0c110c", backgroundImage: "linear-gradient(rgba(163,230,53,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(163,230,53,.16) 1px,transparent 1px),linear-gradient(rgba(163,230,53,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(163,230,53,.05) 1px,transparent 1px)", backgroundSize: "32px 32px,32px 32px,8px 8px,8px 8px" }}
        onPointerMove={(e) => { const p = local(e); target.current = { x: p.x, y: p.y }; setCoord({ x: Math.round((p.x - p.w / 2) / c.scale), y: Math.round((p.y - p.h / 2) / c.scale) }); }}
        onPointerLeave={() => (target.current = null)}
        onPointerDown={(e) => { const p = local(e); target.current = { x: p.x, y: p.y }; const C = cfg.current; attackUntil.current = performance.now() + (Math.max(1, parse(C.seq.attack, C.frames.length).length) * 1000) / Math.max(1, C.fps.attack); }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFile(e.dataTransfer.files[0]); }}>
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-red-500/50" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 w-px bg-blue-400/50" />
        <div ref={sp} className="absolute left-0 top-0 will-change-transform" style={{ backgroundImage: `url(${c.src})`, backgroundSize: `${c.w}px ${c.h}px`, imageRendering: "pixelated" }} />
        {(drag || busy) && <div className="pointer-events-none absolute inset-3 grid place-items-center border-2 border-dashed border-lime-400 bg-lime-400/10 text-sm font-bold text-lime-400">{busy ? "⏳ MEMOTONG SPRITE…" : "▼ LEPAS FILE SPRITE DI SINI"}</div>}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-lime-400/15 bg-[#0d120d] p-2.5">
        <span className="mr-1 text-[#6d8a5a]">NODE ▸</span>
        {slots.map((s, i) => (
          <button key={s.orig} type="button" aria-pressed={cur === i} onClick={() => { setCur(i); setSel(null); }} title={s.name}
            className={`${btn} max-w-[130px] truncate ${cur === i ? "border-lime-400 bg-lime-400 font-bold text-[#0b1a08]" : "border-lime-400/15 bg-[#182018] hover:border-lime-400"}`}>{i === 0 ? "Player" : s.name}</button>
        ))}
        <input ref={file} type="file" accept="image/*" className="hidden" onChange={(e) => { addFile(e.target.files?.[0]); e.target.value = ""; }} />
        <button type="button" onClick={() => file.current?.click()} className={`${btn} border-dashed border-lime-400/60 text-lime-400 hover:bg-lime-400 hover:text-[#0b1a08]`}>＋ UPLOAD SPRITE</button>
        <button type="button" onClick={() => setDock(!dock)} aria-expanded={dock} className={`${ghost} ml-auto`}>{dock ? "▾" : "▸"} SPRITEFRAMES</button>
      </div>
      {err && <div role="alert" className="border-t border-red-400/30 bg-[#281818] px-3 py-2 text-red-200">⚠ {err}</div>}

      {dock && (
        <div className="grid gap-px border-t border-lime-400/15 bg-lime-400/10">
          {/* SHEET + PEMOTONG */}
          <div className="bg-[#0d120d] p-3">
            <div className="mb-2 flex justify-between text-[#6d8a5a]"><span>{n} frame</span><span>{c.w}×{c.h}px</span></div>
            <div ref={sheet} className={`relative w-full touch-none select-none overflow-hidden border border-lime-400/20 ${mode === "manual" ? "cursor-crosshair" : ""}`} style={{ aspectRatio: `${c.w} / ${c.h}`, maxHeight: 300, ...CHECKER }}
              onPointerDown={(e) => { if (mode !== "manual") return; e.currentTarget.setPointerCapture(e.pointerId); const p = img(e); setDraw({ x0: p.x, y0: p.y, x1: p.x, y1: p.y }); }}
              onPointerMove={(e) => { if (draw) { const p = img(e); setDraw({ ...draw, x1: p.x, y1: p.y }); } }} onPointerUp={endDraw}>
              <img src={c.src} alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full" style={{ imageRendering: "pixelated" }} />
              {c.frames.map((f, i) => {
                const hits = KEYS.filter((k) => sets[k].has(i)), mine = hits.includes(edit);
                const col = sel === i ? "#fff" : mine ? COLOR[edit] : hits[0] ? COLOR[hits[0]] : "rgba(163,230,53,.3)";
                return (
                  <button key={i} type="button" aria-label={`Frame ${i}`} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => append(i, e.shiftKey)}
                    className="absolute p-0 text-left leading-none"
                    style={{ left: `${(f.x / c.w) * 100}%`, top: `${(f.y / c.h) * 100}%`, width: `${(f.w / c.w) * 100}%`, height: `${(f.h / c.h) * 100}%`, boxShadow: `inset 0 0 0 ${mine || sel === i ? 2 : 1}px ${col}`, background: mine ? `${COLOR[edit]}22` : "transparent" }}>
                    <span className="bg-black/70 px-0.5 text-[9px] text-white/85">{i}</span>
                  </button>
                );
              })}
              {draw && <div className="pointer-events-none absolute border-2 border-dashed border-white bg-white/10" style={{ left: `${(Math.min(draw.x0, draw.x1) / c.w) * 100}%`, top: `${(Math.min(draw.y0, draw.y1) / c.h) * 100}%`, width: `${(Math.abs(draw.x1 - draw.x0) / c.w) * 100}%`, height: `${(Math.abs(draw.y1 - draw.y0) / c.h) * 100}%` }} />}
            </div>

            {mode === "auto" && (
              <div className="mt-3 grid grid-cols-2 items-end gap-2">
                <Num l="TOLERANSI LATAR" v={c.p.tol} min={0} max={120} on={(v) => patch({ p: { ...c.p, tol: v } })} />
                <Num l="GABUNG BAGIAN (px)" v={c.p.gap} min={0} max={64} on={(v) => patch({ p: { ...c.p, gap: v } })} />
                <label className="flex items-center gap-2 text-[10px] text-[#9db88a]"><input type="checkbox" checked={c.p.key} onChange={(e) => patch({ p: { ...c.p, key: e.target.checked } })} className="accent-lime-400" />hapus latar (transparan)</label>
                <button type="button" disabled={busy || !c.custom} onClick={runAuto} className={`${btn} border-lime-400 bg-lime-400 font-bold text-[#0b1a08] disabled:opacity-40`}>✂ POTONG ULANG</button>
              </div>
            )}
            {mode === "grid" && (
              <div className="mt-3 grid grid-cols-3 items-end gap-2">
                <Num l="LEBAR" v={gp.fw} min={1} max={c.w} on={(v) => setGp({ ...gp, fw: v })} />
                <Num l="TINGGI" v={gp.fh} min={1} max={c.h} on={(v) => setGp({ ...gp, fh: v })} />
                <Num l="JARAK" v={gp.sp} min={0} max={64} on={(v) => setGp({ ...gp, sp: v })} />
                <Num l="OFFSET X" v={gp.ox} min={0} max={c.w} on={(v) => setGp({ ...gp, ox: v })} />
                <Num l="OFFSET Y" v={gp.oy} min={0} max={c.h} on={(v) => setGp({ ...gp, oy: v })} />
                <button type="button" onClick={applyGrid} className={`${btn} border-lime-400 bg-lime-400 font-bold text-[#0b1a08]`}>▦ TERAPKAN</button>
              </div>
            )}
            {mode === "manual" && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-[#9db88a]">seret di sheet untuk membuat frame baru</span>
                {sel !== null && sel < n && <button type="button" onClick={() => delFrame(sel)} className={`${btn} border-red-400/40 bg-[#281818] text-red-200`}>✕ HAPUS #{sel}</button>}
                <button type="button" onClick={() => { patch({ frames: [], seq: { idle: "", walk: "", attack: "" } }); setSel(null); }} className={ghost}>KOSONGKAN</button>
              </div>
            )}
          </div>

          {/* ANIMASI */}
          <div className="bg-[#0d120d] p-3">
            <div className="mb-2 flex gap-1.5" role="tablist">
              {KEYS.map((k) => (
                <button key={k} type="button" role="tab" aria-selected={edit === k} onClick={() => setEdit(k)} className={`${btn} flex-1 uppercase ${edit === k ? "font-bold text-[#0b1a08]" : "border-lime-400/15 bg-[#182018]"}`}
                  style={edit === k ? { background: COLOR[k], borderColor: COLOR[k] } : { color: COLOR[k] }}>{k}</button>
              ))}
            </div>
            <p className="mb-2 text-[10px] text-[#6d8a5a]">animasi <b style={{ color: COLOR[edit] }}>{edit}</b> dimainkan {HINT[edit]}</p>
            <label className="flex flex-col gap-1 text-[10px] text-[#6d8a5a]">URUTAN FRAME (contoh: 0-3,5)
              <input value={c.seq[edit]} onChange={(e) => setSeq(edit, e.target.value)} className="w-full border border-lime-400/20 bg-[#0a110c] px-2 py-1.5 text-xs text-[#e8f5d8] outline-none focus:border-lime-400" style={{ borderColor: `${COLOR[edit]}66` }} />
            </label>
            <p className="mt-1 text-[10px] text-[#6d8a5a]">klik frame di sheet = tambah ke urutan · shift+klik = tambah rentang</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Num l="FPS" v={c.fps[edit]} min={1} max={60} on={(v) => patch({ fps: { ...c.fps, [edit]: v } })} />
              <Num l="SKALA" v={c.scale} min={1} max={16} on={(v) => patch({ scale: v })} />
            </div>
            <button type="button" onClick={() => patch({ feet: !c.feet })} className={`${ghost} mt-2 w-full`}>TITIK TUMPU: {c.feet ? "KAKI (bawah-tengah)" : "TENGAH"}</button>
            <div className="mt-3 flex gap-1.5">
              <button type="button" onClick={copy} className={ghost}>⧉ SALIN JSON</button>
              {c.custom && <button type="button" onClick={remove} className={`${btn} border-red-400/40 bg-[#281818] text-red-200 hover:border-red-300`}>✕ HAPUS SPRITE</button>}
            </div>
            <p className="mt-3 text-[10px] text-[#6d8a5a]">gerak: kursor · klik viewport: attack</p>
          </div>
        </div>
      )}
    </div>
  );
}
