import { useEffect, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import p5 from "p5";
import { cut } from "../lib/cut";

type RGB = [number, number, number];
type Ctrl = { dir: (d: number) => void; key: (k: string) => void; run: (r: boolean) => void };

const GAME_W = 1080, GAME_H = 1080, UW = 380, CELL = 40;
const COLS = GAME_W / CELL, ROWS = GAME_H / CELL, UI_X = GAME_W + 20;
const SPEED = 8, SPAWN_INTERVAL = 10 * 60, BOSS_INTERVAL = 60 * 60, PELLET_INTERVAL = 10 * 60;
const MAX_PELLETS = 3, POWERED_DURATION = 8 * 60;
const FONT = "JetBrains Mono, monospace";
const COLORS: RGB[] = [
  [255, 0, 0], [255, 184, 255], [0, 255, 255], [255, 184, 82],
  [255, 100, 100], [100, 255, 100], [100, 100, 255], [255, 255, 0],
];
const KEYDIR: Record<string, number> = {
  ArrowLeft: 0, a: 0, A: 0, ArrowRight: 1, d: 1, D: 1, ArrowUp: 2, w: 2, W: 2, ArrowDown: 3, s: 3, S: 3,
};

/** Port dari sketch canvas-sketch → p5 instance mode (tanpa canvas-sketch). */
function createSketch(ctrl: MutableRefObject<Ctrl>) {
  return (p: p5) => {
    type Ghost = { x: number; y: number; col: RGB; boss: boolean };
    type Pellet = { x: number; y: number; eaten: boolean };
    let pac = { x: 1, y: 1, dir: 1, mouth: 0, mouthDir: 1 };
    let score = 0, gameOver = false, ghosts: Ghost[] = [], dots: boolean[] = [], pellets: Pellet[] = [];
    let moveTimer = 0, spawnTimer = 0, bossTimer = 0, pelletTimer = 0, ghostCount = 4;
    let powered = false, poweredTimer = 0, running = false;

    const spawnPellet = () => {
      if (pellets.filter((q) => !q.eaten).length >= MAX_PELLETS) return;
      pellets.push({ x: Math.floor(p.random(1, COLS - 1)), y: Math.floor(p.random(1, ROWS - 1)), eaten: false });
    };
    const reset = () => {
      pac = { x: 1, y: 1, dir: 1, mouth: 0, mouthDir: 1 };
      score = 0; gameOver = false; ghostCount = 4;
      ghosts = [[13, 13], [14, 13], [13, 14], [14, 14]].map(([x, y], i) => ({ x, y, col: COLORS[i], boss: false }));
      spawnTimer = bossTimer = pelletTimer = moveTimer = poweredTimer = 0;
      powered = false; pellets = [];
      dots = new Array(COLS * ROWS).fill(true); dots[0] = false; // true = belum dimakan
      spawnPellet();
    };
    const spawnGhost = (boss: boolean) => {
      ghosts.push({
        x: Math.floor(p.random(COLS)), y: Math.floor(p.random(ROWS)),
        col: boss ? [255, 50, 50] : COLORS[ghostCount % COLORS.length], boss,
      });
      if (!boss) ghostCount++;
    };
    const moveGhosts = () => {
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const g of ghosts) {
        if (g.boss && moveTimer % 2 !== 0) continue;
        const [dx, dy] = p.random(dirs) as number[];
        g.x = (g.x + dx + COLS) % COLS; g.y = (g.y + dy + ROWS) % ROWS;
      }
    };

    // ---- kontrol dari React ----
    ctrl.current = {
      dir: (d) => (gameOver ? reset() : (pac.dir = d)),
      key: (k) => { if (gameOver) reset(); else if (k in KEYDIR) pac.dir = KEYDIR[k]; },
      run: (r) => (running = r),
    };

    // ---- gambar ----
    const drawPacman = () => {
      const px = pac.x * CELL + CELL / 2, py = pac.y * CELL + CELL / 2, r = CELL / 2 - 2, a = p.radians(pac.mouth);
      const [s, e] =
        pac.dir === 1 ? [a, p.TWO_PI - a] : pac.dir === 0 ? [p.PI + a, p.PI - a]
        : pac.dir === 3 ? [p.HALF_PI + a, p.HALF_PI - a] : [-p.HALF_PI + a, -p.HALF_PI - a];
      if (powered) p.fill(Math.floor(p.frameCount / 8) % 2 === 0 ? p.color(255, 255, 0) : p.color(255, 165, 0));
      else p.fill(255, 255, 0);
      p.noStroke(); p.arc(px, py, r * 2, r * 2, s, e, p.PIE);
    };
    const drawGhost = (g: Ghost) => {
      const gx = g.x * CELL + CELL / 2, gy = g.y * CELL + CELL / 2, r = CELL / 2 - 2 + (g.boss ? 10 : 0);
      const col: RGB = powered ? (Math.floor(p.frameCount / 10) % 2 === 0 ? [50, 50, 255] : [100, 100, 255]) : g.col;
      p.fill(...col); p.noStroke();
      p.arc(gx, gy, r * 2, r * 2, p.PI, 0, p.CHORD); p.rect(gx - r, gy, r * 2, r);
      const eo = g.boss ? 6 : 4, es = g.boss ? 12 : 8;
      p.fill(255); p.circle(gx - r / 3, gy - eo, es); p.circle(gx + r / 3, gy - eo, es);
      p.fill(powered ? p.color(255, 0, 0) : p.color(0, 0, 200));
      p.circle(gx - r / 3 + 2, gy - eo, es / 2); p.circle(gx + r / 3 + 2, gy - eo, es / 2);
      if (g.boss) { p.fill(255, 255, 0); p.textSize(14); p.textAlign(p.CENTER); p.text("BOSS", gx, gy - r - 4); }
    };
    const drawUI = () => {
      const barW = UW - 40;
      const line = (y: number) => { p.stroke(80, 80, 120); p.strokeWeight(1); p.line(UI_X, y, UI_X + UW - 20, y); p.noStroke(); };
      const bar = (y: number, prog: number, c: RGB) => {
        p.fill(40, 40, 60); p.rect(UI_X + 20, y, barW, 16, 8); p.fill(...c); p.rect(UI_X + 20, y, barW * prog, 16, 8);
      };
      const block = (y: number, label: string, val: string, c: RGB, prog: number) => {
        p.fill(180); p.textSize(20); p.textAlign(p.LEFT); p.text(label, UI_X + 20, y);
        p.fill(...c); p.textSize(40); p.text(val, UI_X + 20, y + 40);
        bar(y + 47, prog, c); line(y + 73);
      };
      p.fill(20, 20, 40); p.noStroke(); p.rect(GAME_W, 0, UW, GAME_H);
      p.stroke(80, 80, 120); p.strokeWeight(3); p.line(GAME_W, 0, GAME_W, GAME_H); p.noStroke();
      p.fill(255, 255, 0); p.textSize(48); p.textAlign(p.CENTER); p.text("PAC-MAN", UI_X + UW / 2 - 20, 80); line(100);
      p.textAlign(p.LEFT); p.fill(180); p.textSize(24); p.text("SCORE", UI_X + 20, 150);
      p.fill(255); p.textSize(52); p.text(`${score}`, UI_X + 20, 210); line(230);
      p.fill(180); p.textSize(24); p.text("GHOSTS", UI_X + 20, 270);
      p.fill(255, 80, 80); p.textSize(52); p.text(`${ghosts.length}`, UI_X + 20, 330); line(350);

      const gcd = Math.ceil((SPAWN_INTERVAL - spawnTimer) / 60), bcd = Math.ceil((BOSS_INTERVAL - bossTimer) / 60);
      block(385, "NEXT GHOST IN", `${gcd}s`, gcd <= 3 ? [255, 80, 80] : [80, 255, 180], 1 - spawnTimer / SPAWN_INTERVAL);
      block(488, "NEXT BOSS IN", `${bcd}s`, bcd <= 10 ? [255, 50, 50] : [255, 165, 0], 1 - bossTimer / BOSS_INTERVAL);
      block(591, `NEXT PELLET IN (${pellets.filter((q) => !q.eaten).length}/${MAX_PELLETS})`,
        `${Math.ceil((PELLET_INTERVAL - pelletTimer) / 60)}s`, [255, 200, 0], 1 - pelletTimer / PELLET_INTERVAL);

      if (powered) {
        p.fill(255, 165, 0); p.textSize(22);
        p.text(`⚡ POWERED! ${Math.ceil((POWERED_DURATION - poweredTimer) / 60)}s`, UI_X + 20, 694);
        bar(701, 1 - poweredTimer / POWERED_DURATION, [255, 165, 0]); line(727);
      }
      const cy = powered ? 757 : 700;
      p.fill(180); p.textSize(20); p.text("CONTROLS", UI_X + 20, cy);
      p.fill(220); p.textSize(17);
      p.text("← → ↑ ↓ / WASD  Gerak", UI_X + 20, cy + 30);
      p.text("⚪ Power Pellet  Makan ghost!", UI_X + 20, cy + 58);
      p.text("Restart  Tekan tombol saat Game Over", UI_X + 20, cy + 86);

      if (gameOver) {
        p.fill(0, 0, 0, 200); p.rect(GAME_W, 0, UW, GAME_H);
        p.textAlign(p.CENTER);
        p.fill(255, 0, 0); p.textSize(36); p.text("GAME OVER", UI_X + UW / 2 - 20, 720);
        p.fill(255); p.textSize(22); p.text("Final Score:", UI_X + UW / 2 - 20, 760);
        p.fill(255, 255, 0); p.textSize(48); p.text(`${score}`, UI_X + UW / 2 - 20, 820);
      }
    };

    p.setup = () => {
      const c = p.createCanvas(GAME_W + UW + 20, GAME_H);
      c.style("width", "100%"); c.style("height", "auto"); c.style("display", "block");
      p.textFont(FONT); reset();
    };

    p.draw = () => {
      p.background(0);
      if (!gameOver && running) {
        moveTimer++; spawnTimer++; bossTimer++; pelletTimer++;
        if (spawnTimer >= SPAWN_INTERVAL) { spawnTimer = 0; for (let i = 0; i < 4; i++) spawnGhost(false); }
        if (bossTimer >= BOSS_INTERVAL) { bossTimer = 0; for (let i = 0; i < 8; i++) spawnGhost(false); spawnGhost(true); }
        if (pelletTimer >= PELLET_INTERVAL) { pelletTimer = 0; spawnPellet(); }
        if (powered && ++poweredTimer >= POWERED_DURATION) { powered = false; poweredTimer = 0; }

        pac.mouth += 4 * pac.mouthDir;
        if (pac.mouth >= 35 || pac.mouth <= 0) pac.mouthDir *= -1;

        if (moveTimer >= SPEED) {
          moveTimer = 0;
          const [dx, dy] = [[-1, 0], [1, 0], [0, -1], [0, 1]][pac.dir];
          pac.x = (pac.x + dx + COLS) % COLS; pac.y = (pac.y + dy + ROWS) % ROWS;
          const i = pac.y * COLS + pac.x;
          if (dots[i]) { dots[i] = false; score += 10; }
          const pel = pellets.find((q) => q.x === pac.x && q.y === pac.y && !q.eaten);
          if (pel) { pel.eaten = true; powered = true; poweredTimer = 0; score += 50; }
          moveGhosts();
          for (let k = ghosts.length - 1; k >= 0; k--) {
            const g = ghosts[k];
            if (g.x === pac.x && g.y === pac.y) {
              if (powered) { score += g.boss ? 500 : 200; ghosts.splice(k, 1); } else gameOver = true;
            }
          }
        }
      }
      p.fill(255, 255, 200); p.noStroke();
      dots.forEach((alive, i) => alive && p.circle((i % COLS) * CELL + CELL / 2, Math.floor(i / COLS) * CELL + CELL / 2, 6));
      for (const q of pellets) if (!q.eaten) {
        p.fill(Math.floor(p.frameCount / 15) % 2 === 0 ? p.color(255) : p.color(255, 200, 0));
        p.circle(q.x * CELL + CELL / 2, q.y * CELL + CELL / 2, 18);
      }
      ghosts.forEach(drawGhost); drawPacman(); drawUI();
    };
  };
}

export default function PacmanGame() {
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const ctrl = useRef<Ctrl>({ dir: () => {}, key: () => {}, run: () => {} });
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const inst = new p5(createSketch(ctrl), host.current!);
    return () => {
      inst.remove();
    };
  }, []);
  useEffect(() => {
    ctrl.current.run(playing);
  }, [playing]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!playing) return;
    if (e.key === "Escape") return setPlaying(false);
    if (e.key in KEYDIR || e.key === " ") e.preventDefault(); // cegah halaman ikut scroll
    ctrl.current.key(e.key);
  };
  const pad = (label: string, d: number, cls: string) => (
    <button type="button" aria-label={label} onPointerDown={() => ctrl.current.dir(d)}
      className={`touch-none select-none border border-lime-400/40 bg-[#182018] py-4 text-lg text-lime-400 active:bg-lime-400 active:text-[#0b1a08] ${cls}`}>
      {label}
    </button>
  );

  return (
<section id="game-hub" className="bg-[#0A0D0A] px-6 py-20 text-[#e8f5d8]">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs text-lime-400">&gt; GAME HUB</p>
        <h2 className="mb-6 font-['Bebas_Neue'] text-[clamp(48px,8vw,104px)] leading-[.9]">
          Mainkan. <span className="text-lime-400">Langsung.</span>
        </h2>
        <div ref={frame} tabIndex={0} onKeyDown={onKeyDown}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPlaying(false); }}
          style={cut(16)} className="bg-[#101510] shadow-[0_0_0_1px_rgba(163,230,53,.2)] outline-none">
          <div className="flex justify-between border-b border-lime-400/15 bg-[#0d120d] px-3 py-2 font-mono text-[11px] text-[#9db88a]">
            <span><b className="text-lime-400">▣</b> Game · PacMan.ts</span>
            <span>{playing ? "● RUNNING — Esc untuk jeda" : "○ PAUSED"}</span>
          </div>
          <div className="relative">
            <div ref={host} className="leading-[0]" />
            {!playing && (
              <button type="button" onClick={() => { setPlaying(true); frame.current?.focus(); }}
                className="absolute inset-0 grid place-items-center bg-black/70 font-['Bebas_Neue'] text-[clamp(32px,6vw,72px)] tracking-wide text-lime-400 hover:bg-black/55">
                ▶ KLIK UNTUK MAIN
              </button>
            )}
          </div>
          {/* D-pad sentuh (HP) */}
          <div className="grid grid-cols-3 gap-1.5 p-2.5 font-mono md:hidden">
            {pad("▲", 2, "col-start-2")}{pad("◀", 0, "col-start-1 row-start-2")}
            {pad("▼", 3, "col-start-2 row-start-2")}{pad("▶", 1, "col-start-3 row-start-2")}
          </div>
        </div>
      </div>
    </section>
  );
}