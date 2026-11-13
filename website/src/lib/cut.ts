import type { CSSProperties } from "react";
/** Sudut terpotong (chamfer) — pakai: <div style={cut(14)} /> */
export const cut = (n = 14): CSSProperties => ({
  clipPath: `polygon(${n}px 0,100% 0,100% calc(100% - ${n}px),calc(100% - ${n}px) 100%,0 100%,0 ${n}px)`,
});
