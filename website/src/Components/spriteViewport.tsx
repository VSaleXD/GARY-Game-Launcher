import { useEffect, useRef, useState } from "react";
import { cut } from "../lib/cut";

const SRC = "Assets/sprites/player.png";
const FW = 17, COLS = 3, SCALE = 5, FPS = 8;
const ANIM = { idle: [0, 1, 2], walk: [3, 4, 5], attack: [6, 7, 8] } as const;
const SKINS = [
  { id: "Skull", filter: "none" },
  { id: "Skull_Toxic", filter: "sepia(1) saturate(6) hue-rotate(35deg)" },
  { id: "Skull_Blood", filter: "sepia(1) saturate(7) hue-rotate(-35deg)" },
];
type Anim = keyof typeof ANIM;

export default function SpriteViewport() {
  const vp = useRef<HTMLDivElement>(null);
  const sp = useRef<HTMLDivElement>(null);
  const target = useRef<{ x: number; y: number } | null>(null);
  const attackUntil = useRef(0);
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const [skin, setSkin] = useState(0);

  useEffect(() => {
    const v = vp.current!, s = sp.current!;
    const pos = { x: v.clientWidth / 2, y: v.clientHeight / 2 };
    let dir = 1, anim: Anim = "idle", t0 = 0, raf = 0, last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      let a: Anim = "idle";
      const t = target.current;
      if (now < attackUntil.current) a = "attack";
      else if (t) {
        const dx = t.x - pos.x, dy = t.y - pos.y, d = Math.hypot(dx, dy);
        if (d > 6) {
          const k = (Math.min(d * 4, 170) * dt) / d;
          pos.x += dx * k; pos.y += dy * k; a = "walk";
          if (Math.abs(dx) > 3) dir = dx < 0 ? -1 : 1;
        }
      }
      if (a !== anim) { anim = a; t0 = now; }
      const f = ANIM[anim], i = f[Math.floor(((now - t0) / 1000) * FPS) % f.length];
      s.style.backgroundPosition = `-${(i % COLS) * FW}px -${Math.floor(i / COLS) * FW}px`;
      s.style.transform = `translate(${pos.x - FW / 2}px,${pos.y - FW / 2}px) scale(${dir * SCALE},${SCALE})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const local = (e: React.PointerEvent) => {
    const r = vp.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
  };

  return (
    <div style={cut(16)} className="bg-[#101510] shadow-[0_0_0_1px_rgba(163,230,53,.2)]">
      <div className="flex justify-between gap-2 border-b border-lime-400/15 bg-[#0d120d] px-3 py-2 font-mono text-[11px] text-[#9db88a]">
        <span><b className="text-lime-400">▣</b> Scene · 2D</span>
        <span>X: {coord.x} &nbsp; Y: {coord.y}</span>
      </div>
      <div
        ref={vp}
        aria-label="Viewport interaktif: gerakkan kursor, klik untuk menyerang"
        className="relative h-[320px] cursor-crosshair touch-none overflow-hidden md:h-[380px]"
        style={{
          backgroundColor: "#0c110c",
          backgroundImage:
            "linear-gradient(rgba(163,230,53,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(163,230,53,.16) 1px,transparent 1px),linear-gradient(rgba(163,230,53,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(163,230,53,.05) 1px,transparent 1px)",
          backgroundSize: "32px 32px,32px 32px,8px 8px,8px 8px",
        }}
        onPointerMove={(e) => {
          const p = local(e); target.current = { x: p.x, y: p.y };
          setCoord({ x: Math.round((p.x - p.w / 2) / SCALE), y: Math.round((p.y - p.h / 2) / SCALE) });
        }}
        onPointerLeave={() => (target.current = null)}
        onPointerDown={(e) => {
          const p = local(e); target.current = { x: p.x, y: p.y };
          attackUntil.current = performance.now() + (ANIM.attack.length * 1000) / FPS;
        }}
      >
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-red-500/50" />
        <div className="pointer-events-none absolute bottom-0 top-0 left-1/2 w-px bg-blue-400/50" />
        <div
          ref={sp}
          className="absolute left-0 top-0 will-change-transform"
          style={{
            width: FW, height: FW, transformOrigin: `${FW / 2}px ${FW / 2}px`,
            backgroundImage: `url(${SRC})`, backgroundSize: `${FW * COLS}px ${FW * COLS}px`,
            imageRendering: "pixelated", filter: SKINS[skin].filter,
          }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-1.5 border-t border-lime-400/15 bg-[#0d120d] p-2.5 font-mono text-[11px]">
        <span className="mr-1 text-[#6d8a5a]">NODE ▸</span>
        {SKINS.map((k, i) => (
          <button key={k.id} type="button" aria-pressed={skin === i} onClick={() => setSkin(i)}
            className={`border px-2.5 py-1.5 transition-colors ${skin === i ? "border-lime-400 bg-lime-400 font-bold text-[#0b1a08]" : "border-lime-400/15 bg-[#182018] text-[#cfe6b8] hover:border-lime-400"}`}>
            {k.id}
          </button>
        ))}
        <span className="ml-auto hidden text-[#6d8a5a] sm:inline">gerak: kursor · klik: attack</span>
      </div>
    </div>
  );
}