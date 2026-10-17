/* ==========================================================
   script.js – Phase 1: Sternenhimmel, Sternschnuppen,
   Parallax und Startbildschirm.
   ========================================================== */
(() => {
  "use strict";

  const cfg = window.CONFIG;
  const A = cfg.animation;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = document.getElementById("sky");
  const ctx = canvas.getContext("2d");

  // Farbpalette der Sterne (RGB): Weiß, Creme, Weizen, Gold
  const STAR_COLORS = [
    [255, 255, 255],
    [245, 241, 232],
    [245, 222, 179],
    [212, 175, 55]
  ];

  let width = 0, height = 0, dpr = 1;
  let stars = [];
  let shootingStars = [];
  let nextShootingAt = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };   // x/y = weich nachgeführt, tx/ty = Ziel (−1…1)
  const startTime = performance.now();

  const rand = (min, max) => min + Math.random() * (max - min);

  /* ---------- Größe & Sterne erzeugen ---------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);   // begrenzt für Performance
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars();
  }

  function createStars() {
    const isMobile = width < 700;
    const byArea = Math.round((width * height) / 4500);
    const max = isMobile ? A.starCountMobileMax : A.starCountMax;
    const count = Math.max(A.starCountMin, Math.min(max, byArea));

    stars = Array.from({ length: count }, () => {
      const depth = Math.random();                   // 0 = weit weg, 1 = nah
      const big = Math.random() < 0.08;              // ein paar größere, hellere Sterne
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        depth,
        radius: big ? rand(1.5, 2.3) : rand(0.4, 1.3) + depth * 0.3,
        baseAlpha: big ? rand(0.8, 1) : rand(0.3, 0.8),
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        twinkleSpeed: rand(0.25, 0.9),               // langsam & sanft
        twinklePhase: Math.random() * Math.PI * 2,
        big
      };
    });
  }

  /* ---------- Sternschnuppen ---------- */
  function scheduleShootingStar(now) {
    nextShootingAt = now + rand(A.shootingStarMinSec, A.shootingStarMaxSec) * 1000;
  }

  function spawnShootingStar() {
    const angle = rand(Math.PI * 0.62, Math.PI * 0.80);   // diagonal nach links unten
    const speed = rand(650, 950);                          // Pixel pro Sekunde
    shootingStars.push({
      x: rand(width * 0.35, width * 1.05),
      y: rand(-20, height * 0.35),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      duration: rand(1.1, 1.7),
      tail: rand(110, 180)
    });
  }

  function drawShootingStars(dt) {
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.life += dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const t = s.life / s.duration;
      if (t >= 1) { shootingStars.splice(i, 1); continue; }

      const fade = Math.sin(t * Math.PI);                  // sanft ein- und ausblenden
      const len = Math.hypot(s.vx, s.vy);
      const tx = s.x - (s.vx / len) * s.tail;
      const ty = s.y - (s.vy / len) * s.tail;

      const grad = ctx.createLinearGradient(s.x, s.y, tx, ty);
      grad.addColorStop(0, `rgba(255,248,225,${0.95 * fade})`);
      grad.addColorStop(0.3, `rgba(245,222,179,${0.5 * fade})`);
      grad.addColorStop(1, "rgba(212,175,55,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      // heller Kopf mit Glow
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 7);
      glow.addColorStop(0, `rgba(255,252,240,${fade})`);
      glow.addColorStop(1, "rgba(245,222,179,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ---------- Hauptschleife ---------- */
  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);        // Sprünge bei Tab-Wechsel vermeiden
    last = now;
    const t = now / 1000;

    // Einblenden der Sterne beim Start
    const fadeIn = reducedMotion ? 1 : Math.min((now - startTime) / A.starsFadeInMs, 1);

    // Parallax: Zeiger weich nachführen
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    ctx.clearRect(0, 0, width, height);

    for (const s of stars) {
      const twinkle = reducedMotion ? 1 : 0.65 + 0.35 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
      const alpha = s.baseAlpha * twinkle * fadeIn * window.Sky.bgDim;
      // nahe Sterne (depth ≈ 1) bewegen sich stärker als ferne
      const px = s.x - pointer.x * A.parallaxStrength * s.depth;
      const py = s.y - pointer.y * A.parallaxStrength * s.depth;
      const [r, g, b] = s.color;

      if (s.big) {                                         // weicher Schein um große Sterne
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.18})`;
        ctx.beginPath();
        ctx.arc(px, py, s.radius * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reducedMotion) {
      if (!nextShootingAt) scheduleShootingStar(now + 4000);
      if (now >= nextShootingAt && fadeIn >= 1) {
        spawnShootingStar();
        scheduleShootingStar(now);
      }
      drawShootingStars(dt);
    }

    // Zusatz-Ebenen (Linien, Licht, Partikel aus memories.js)
    for (const layer of window.Sky.layers) layer(ctx, now, dt);

    requestAnimationFrame(frame);
  }

  /* ---------- Zeiger / Finger ---------- */
  function onPointerMove(e) {
    pointer.tx = (e.clientX / width - 0.5) * 2;
    pointer.ty = (e.clientY / height - 0.5) * 2;
  }
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerMove, { passive: true });

  /* ---------- Startbildschirm ---------- */
  const introEl = document.getElementById("intro");
  const titleEl = document.getElementById("intro-title");
  const quoteEl = document.getElementById("intro-quote");
  const btnEl = document.getElementById("enter-btn");
  const hintEl = document.getElementById("sky-hint");

  titleEl.textContent = cfg.intro.title;
  quoteEl.textContent = "„" + cfg.intro.quote + "“";
  btnEl.textContent = cfg.intro.buttonText;
  hintEl.textContent = cfg.intro.hintAfterStart;
  document.title = cfg.name + "s Sternenhimmel";

  const show = (el, delay) => setTimeout(() => el.classList.add("is-visible"), reducedMotion ? 0 : delay);
  show(titleEl, A.titleDelayMs);
  show(quoteEl, A.quoteDelayMs);
  show(btnEl, A.buttonDelayMs);

  btnEl.addEventListener("click", () => {
    btnEl.disabled = true;
    introEl.classList.add("is-leaving");                  // sanftes Ausblenden, kein Neuladen
    setTimeout(() => {
      introEl.hidden = true;
      document.body.dataset.stage = "explore";
      hintEl.hidden = false;
      requestAnimationFrame(() => hintEl.classList.add("is-visible"));
      // Einstiegspunkt für Phase 2: dort lauschen wir auf dieses Ereignis
      document.dispatchEvent(new CustomEvent("sky:explore"));
    }, reducedMotion ? 0 : 900);
  });

  /* ---------- Start ---------- */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  // Schnittstelle für memories.js (Phase 2–5)
  window.Sky = {
    cfg, pointer, reducedMotion,
    layers: [],      // Funktionen (ctx, now, dt), die nach den Sternen zeichnen
    bgDim: 1,        // Helligkeitsfaktor der Hintergrundsterne (Finale)
    get width() { return width; },
    get height() { return height; }
  };

  resize();
  requestAnimationFrame(frame);
})();
