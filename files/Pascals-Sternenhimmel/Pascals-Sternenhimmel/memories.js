/* ==========================================================
   memories.js – Phase 2–5: Erinnerungssterne, Fenster, Linien,
   Fortschritt (localStorage), Finale, Audio.
   Benötigt window.Sky aus script.js.
   ========================================================== */
(() => {
  "use strict";

  const Sky = window.Sky, cfg = window.CONFIG, M = cfg.memories, U = cfg.ui, F = cfg.finale;
  const STORAGE_KEY = "pascal-sternenhimmel-v1";
  const FINALE_INDEX = M.length - 1;                    // letzter Stern = Finale
  const REQUIRED = M.length - 1;                        // so viele müssen entdeckt werden
  const reduced = Sky.reducedMotion;
  const $ = (id) => document.getElementById(id);
  const rand = (a, b) => a + Math.random() * (b - a);
  const ease = (x) => { x = Math.min(Math.max(x, 0), 1); return x * x * (3 - 2 * x); };

  const layer = $("memory-layer"), progressEl = $("progress"), hintEl = $("sky-hint");
  const resetBtn = $("reset-btn"), musicBtn = $("music-btn");
  const modal = $("modal"), modalTitle = $("modal-title"), modalText = $("modal-text");
  const modalFigure = $("modal-figure"), modalImg = $("modal-img"), modalClose = $("modal-close");
  const finaleEl = $("finale"), finaleHead = $("finale-headline"), finaleMsg = $("finale-message");
  const finaleRestart = $("finale-restart");

  /* ---------- Fortschritt (localStorage mit Fallback) ---------- */
  let found = [];
  try { const v = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (Array.isArray(v)) found = v; } catch (e) {}
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(found)); } catch (e) {} };
  const isFound = (i) => found.includes(M[i].id);
  const countFound = () => M.slice(0, FINALE_INDEX).filter((_, i) => isFound(i)).length;
  const allFound = () => countFound() >= REQUIRED;

  const flashAt = M.map(() => 0);                       // Zeitpunkt der letzten Entdeckung (Linien-Aufleuchten)
  let finale = null;                                    // { t0 } solange das Finale läuft
  let timers = [];

  /* ---------- Audio (optional) ---------- */
  let soundOn = false, music = null;
  if (cfg.audio.music) {
    let failed = false;
    music = new Audio();
    music.loop = true;
    music.volume = cfg.audio.musicVolume ?? 0.35;
    music.addEventListener("error", () => { failed = true; musicBtn.hidden = true; });
    music.addEventListener("loadedmetadata", () => { if (!failed) musicBtn.hidden = false; });
    setTimeout(() => { if (!failed) musicBtn.hidden = false; }, 1500);   // Safari lädt Metadaten erst später
    music.src = cfg.audio.music;
  }
  musicBtn.addEventListener("click", () => {
    if (!music) return;
    soundOn = !soundOn;
    musicBtn.setAttribute("aria-pressed", String(soundOn));
    musicBtn.classList.toggle("is-on", soundOn);
    if (soundOn) music.play().catch(() => {}); else music.pause();
  });
  function sfx(name) {
    const path = cfg.audio[name];
    if (!soundOn || !path) return;
    const a = new Audio(path); a.volume = 0.6; a.play().catch(() => {});
  }

  /* ---------- Sterne als Buttons (tastaturbedienbar) ---------- */
  const buttons = M.map((m, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "memory-star" + (i === FINALE_INDEX ? " memory-star--final" : "");
    b.innerHTML = '<span class="dot"></span><span class="tip"></span>';
    b.addEventListener("click", () => onStarClick(i, b));
    layer.appendChild(b);
    return b;
  });

  function refreshUI() {
    const n = countFound(), unlocked = allFound();
    progressEl.textContent = U.progress.replace("{n}", n).replace("{total}", REQUIRED);
    buttons.forEach((b, i) => {
      const last = i === FINALE_INDEX;
      b.classList.toggle("is-found", !last && isFound(i));
      b.classList.toggle("is-locked", last && !unlocked);
      b.classList.toggle("is-unlocked", last && unlocked);
      const tip = last ? (unlocked ? U.tipFinale : U.tipLocked) : (isFound(i) ? U.tipFound : U.tipNew);
      b.querySelector(".tip").textContent = tip;
      b.setAttribute("aria-label", M[i].title + " – " + tip);
    });
    hintEl.textContent = unlocked ? U.hintUnlocked : cfg.intro.hintAfterStart;
  }

  function onStarClick(i, button) {
    sfx("click");
    if (i === FINALE_INDEX && allFound()) { startFinale(); return; }
    if (i !== FINALE_INDEX && !isFound(i)) {            // erste Entdeckung
      found.push(M[i].id); save(); flashAt[i] = performance.now();
      const unlockedNow = allFound();
      refreshUI();
      if (unlockedNow) setTimeout(() => sfx("unlock"), 600);
    }
    openModal(M[i], button);
  }

  /* ---------- Erinnerungsfenster ---------- */
  let opener = null;
  const paragraphs = (text) => text.split(/\n\s*\n/).filter((t) => t.trim()).map((t) => { const p = document.createElement("p"); p.textContent = t.trim(); return p; });

  function openModal(m, from) {
    opener = from;
    modalTitle.textContent = m.title;
    modalText.replaceChildren(...paragraphs(m.text));
    modalText.scrollTop = 0;
    modalFigure.hidden = true;                          // Foto erst zeigen, wenn es wirklich geladen ist
    if (m.image) {
      modalImg.onload = () => { modalFigure.hidden = false; };
      modalImg.onerror = () => { modalFigure.hidden = true; };
      modalImg.alt = m.imageAlt || m.title;
      modalImg.style.objectPosition = m.imagePosition || "50% 50%";   // Bildausschnitt anpassbar
      modalImg.src = m.image;
    } else {
      modalImg.removeAttribute("src");
    }
    modal.hidden = false;
    requestAnimationFrame(() => { modal.classList.add("is-open"); modalClose.focus(); });
    sfx("open");
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.classList.remove("is-open");
    setTimeout(() => { modal.hidden = true; }, reduced ? 0 : 350);
    if (opener && !finale) opener.focus();
  }

  modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key === "Tab") {                              // Fokus im Fenster halten
      const items = [modalText, modalClose];
      const idx = items.indexOf(document.activeElement);
      e.preventDefault();
      items[(idx + (e.shiftKey ? items.length - 1 : 1)) % items.length].focus();
    }
  });

  /* ---------- Positionen (Parallax + Finale-Formation) ---------- */
  let morph = 0, lineGlow = 0;
  function heartTarget(i) {                             // sechs Punkte auf einer Herzkurve
    const w = Sky.width, h = Sky.height, u = Math.max(Math.min(w, h) * 0.0095, 3);
    // Parameterwerte der Herzkurve: Spitze, rechte Seite, rechter Bogen, Einkerbung, linker Bogen, linke Seite
    const T = [Math.PI, 2.0, 0.9, 0, -0.9, -2.0];
    const t = T[i % T.length];
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x: w / 2 + hx * u, y: h * 0.22 - hy * u };
  }
  function starPos(i) {
    const k = Sky.cfg.animation.parallaxStrength * 0.85;
    let x = M[i].pos.x * Sky.width - Sky.pointer.x * k;
    let y = M[i].pos.y * Sky.height - Sky.pointer.y * k;
    if (morph > 0) { const t = heartTarget(i); x += (t.x - x) * morph; y += (t.y - y) * morph; }
    return { x, y };
  }

  /* ---------- Zeichen-Ebene: Linien, Licht, Partikel ---------- */
  let particles = [], spawnAcc = 0;
  Sky.layers.push((ctx, now, dt) => {
    if (document.body.dataset.stage !== "explore") return;
    const w = Sky.width, h = Sky.height;
    const p = finale ? (now - finale.t0) / 1000 : 0;
    Sky.bgDim = finale ? 1 - 0.85 * ease(p / 3) : 1;    // Finale 1: Hintergrund dunkler
    lineGlow = finale ? ease((p - 1) / 3) : 0;          // Finale 2: Linien leuchten
    morph = finale ? ease((p - 3) / 4) : 0;             // Finale 3: Formation

    const P = M.map((_, i) => starPos(i));
    P.forEach((q, i) => { buttons[i].style.transform = `translate3d(${q.x}px,${q.y}px,0)`; });

    // Finale 4: große Lichtanimation
    if (finale && p > 5) {
      const f = ease((p - 5) / 4), cx = w / 2, cy = h * 0.22;
      const R = Math.min(w, h) * (0.12 + 0.4 * f), pulse = 0.85 + 0.15 * Math.sin(p * 1.6);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      g.addColorStop(0, `rgba(255,244,214,${0.5 * f * pulse})`);
      g.addColorStop(0.4, `rgba(212,175,55,${0.2 * f})`);
      g.addColorStop(1, "rgba(212,175,55,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    }

    // Verbindungslinien
    ctx.lineCap = "round";
    for (let k = 0; k < M.length - 1 + (finale ? 1 : 0); k++) {
      const a = k, b = (k + 1) % M.length;
      const visible = finale || (k < FINALE_INDEX - 1 && isFound(a) && isFound(b)) || (k === FINALE_INDEX - 1 && allFound() && isFound(a));
      if (!visible) continue;
      const fl = Math.max(0, 1 - (now - Math.max(flashAt[a], flashAt[b])) / 2000);
      ctx.strokeStyle = `rgba(212,175,55,${Math.min(0.22 + 0.6 * fl + 0.65 * lineGlow, 1)})`;
      ctx.lineWidth = 1 + 1.2 * lineGlow;
      ctx.shadowColor = "rgba(245,222,179,.9)";
      ctx.shadowBlur = fl * 10 + lineGlow * 14;
      ctx.beginPath(); ctx.moveTo(P[a].x, P[a].y); ctx.lineTo(P[b].x, P[b].y); ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Finale 7: goldene Partikel
    if (finale && p > 9.5 && !reduced) {
      const max = w < 700 ? 60 : 120;
      spawnAcc += dt * (w < 700 ? 18 : 32);
      while (spawnAcc > 1 && particles.length < max) {
        spawnAcc--;
        particles.push({ x: rand(0, w), y: rand(-10, h * 0.3), vx: rand(-8, 8), vy: rand(18, 50),
          r: rand(0.8, 2.2), life: 0, max: rand(5, 9), light: Math.random() < 0.5 });
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const q = particles[i];
      q.life += dt; q.x += q.vx * dt; q.y += q.vy * dt;
      if (q.life >= q.max) { particles.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(${q.light ? "245,222,179" : "212,175,55"},${0.9 * Math.sin(Math.PI * q.life / q.max)})`;
      ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2); ctx.fill();
    }
  });

  /* ---------- Finale ---------- */
  finaleHead.textContent = F.headline;
  finaleMsg.replaceChildren(...paragraphs(F.message));
  finaleRestart.textContent = F.restartText;
  resetBtn.textContent = U.reset;
  modalClose.setAttribute("aria-label", U.close);

  const later = (fn, ms) => timers.push(setTimeout(fn, reduced ? 0 : ms));

  function startFinale() {
    modal.hidden = true; modal.classList.remove("is-open");
    finale = { t0: performance.now() - (reduced ? 16000 : 0) };
    document.body.classList.add("is-finale");
    layer.classList.add("is-inert"); layer.setAttribute("aria-hidden", "true");
    finaleEl.hidden = false; finaleEl.scrollTop = 0;
    sfx("finale");
    later(() => finaleHead.classList.add("is-visible"), 8000);   // Finale 5: Text
    later(() => finaleMsg.classList.add("is-visible"), 11000);   // Finale 6: Nachricht
    later(() => { finaleRestart.classList.add("is-visible"); finaleRestart.focus({ preventScroll: true }); }, 14500);
  }

  function endFinale() {
    timers.forEach(clearTimeout); timers = [];
    finale = null; particles = []; morph = 0;
    Sky.bgDim = 1;
    document.body.classList.remove("is-finale");
    layer.classList.remove("is-inert"); layer.removeAttribute("aria-hidden");
    finaleEl.hidden = true;
    [finaleHead, finaleMsg, finaleRestart].forEach((el) => el.classList.remove("is-visible"));
  }

  function resetAll() {
    found = []; save(); flashAt.fill(0);
    endFinale(); refreshUI();
    buttons[0].focus({ preventScroll: true });
  }

  finaleRestart.addEventListener("click", resetAll);
  resetBtn.addEventListener("click", () => {
    if (!found.length || window.confirm(U.resetConfirm)) resetAll();
  });

  /* ---------- Start nach „Entdecke dein Universum“ ---------- */
  document.addEventListener("sky:explore", () => {
    layer.hidden = false; progressEl.hidden = false; resetBtn.hidden = false;
    refreshUI();
    requestAnimationFrame(() => layer.classList.add("is-visible"));
  });
})();
