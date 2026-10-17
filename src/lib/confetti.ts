const COLORS = ["#4361ee", "#f26b45", "#ffc93c", "#2db88c", "#8f7cf2", "#ff8fab"];

type Origin = { x: number; y: number };

/** Burst of paper confetti from a point (viewport px). No-op under reduced motion. */
export function fireConfetti({ x, y, count = 90, spread = 70, power = 1 }: Partial<Origin> & { count?: number; spread?: number; power?: number } = {}) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100vw", height: "100vh", pointerEvents: "none", zIndex: "70" });
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  const ox = x ?? window.innerWidth / 2;
  const oy = y ?? window.innerHeight / 3;
  const parts = Array.from({ length: count }, () => {
    const angle = (-90 + (Math.random() - 0.5) * spread * 2) * (Math.PI / 180);
    const speed = (7 + Math.random() * 9) * power;
    return {
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: 6 + Math.random() * 7,
      h: 4 + Math.random() * 5,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      round: Math.random() < 0.3,
    };
  });

  const start = performance.now();
  const tick = (now: number) => {
    const t = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = t > 1500 ? Math.max(0, 1 - (t - 1500) / 600) : 1;
    for (const p of parts) {
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.32;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.h / 1.6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // squash the width to fake a paper flip
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w * Math.abs(Math.cos(p.r * 2)), p.h);
      }
      ctx.restore();
    }
    if (t < 2100) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
}

/** Confetti from the centre of an element. */
export function confettiFrom(el: Element | null | undefined, opts?: { count?: number; spread?: number; power?: number }) {
  if (!el) return fireConfetti(opts);
  const r = el.getBoundingClientRect();
  fireConfetti({ x: r.left + r.width / 2, y: r.top + r.height / 2, ...opts });
}
