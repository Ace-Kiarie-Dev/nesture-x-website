/* =========================================================
   Flappy Horror · The Reaper's Flight
   An NX Gaming original.
   ========================================================= */

(() => {
    'use strict';

    // ---------- Constants ----------
    const W = 360;
    const H = 640;
    const GROUND_H = 66;
    const GROUND_Y = H - GROUND_H;
    const STEP = 1000 / 60;          // fixed simulation step (60 Hz)
    const RS = 2.5;                  // resolution of pre-rendered sprites
    const TAU = Math.PI * 2;

    const CFG = {
        gravity: 0.38,
        flap: -6.5,
        maxFall: 10,
        baseSpeed: 2.1,
        maxSpeed: 3.5,
        spacing: 205,
        gapStart: 172,
        gapMin: 136,
        pipeW: 64,
        pipeH: 512,
        soulChance: 0.6,
        soulsToPhase: 5,
        phaseFrames: 170,
        bloodEvery: 15,
        bloodLength: 7,
        swayFrom: 20,
    };

    const GHOST_W = 50;
    const GHOST_H = 35;
    const GHOST_X = 78;
    const GHOST_R = 12.5;            // body hitbox radius (scythe is forgiven)

    const MEDALS = [
        { id: 'moon', min: 100, name: 'Blood Moon', ico: '🌕' },
        { id: 'pumpkin', min: 50, name: 'Gold Pumpkin', ico: '🎃' },
        { id: 'skull', min: 25, name: 'Silver Skull', ico: '💀' },
        { id: 'bone', min: 10, name: 'Bone', ico: '🦴' },
    ];

    const TIPS = [
        'Cyan wisps are lost souls. Gather 5 to unlock <b>PHASE</b>.',
        'While phased you drift straight through the hands.',
        'Every 15 hands, the Blood Moon rises and the dead speed up.',
        'Short, calm taps beat panicked flapping.',
        'Past 20, the hands begin to sway. Watch their rhythm.',
        'Phase won’t fade while you’re inside a hand. Use it boldly.',
    ];

    const EPITAPHS = [
        [0, ['Here lies a reaper who never left the crypt.', 'Claimed at the gate. The hands didn’t even have to try.']],
        [1, ['Taken before the first bell tolled.', 'A brief haunting. The graveyard barely noticed.']],
        [10, ['The hands remember your scent now.', 'You drifted far, but the earth was patient.']],
        [25, ['The dead whisper your name with something like respect.', 'A worthy reaper, pulled under at last.']],
        [50, ['Even the crows went quiet as you passed.', 'The graveyard will tell stories of this night.']],
        [100, ['The Blood Moon bows to you.', 'Death itself took notes.']],
    ];

    // ---------- DOM ----------
    const $ = (id) => document.getElementById(id);
    const stage = $('stage');
    const canvas = $('board');
    const ctx = canvas.getContext('2d');
    const music = $('music');
    const screens = {
        title: $('screenTitle'),
        ready: $('screenReady'),
        pause: $('screenPause'),
        over: $('screenOver'),
    };
    const phaseBtn = $('phaseBtn');
    const pauseBtn = $('pauseBtn');
    const muteBtn = $('muteBtn');
    const overMoreBtn = $('overMoreBtn');
    const MORE_LINK_GUARD_MS = 1000;
    const flashEl = document.querySelector('.atmos__flash');
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const PHASE_HINT = isTouch ? 'tap the orb' : 'shift / e';

    // ---------- Storage (best-effort) ----------
    const store = {
        get(key, fallback) {
            try {
                const v = localStorage.getItem('fh.' + key);
                return v === null ? fallback : JSON.parse(v);
            } catch { return fallback; }
        },
        set(key, value) {
            try { localStorage.setItem('fh.' + key, JSON.stringify(value)); } catch { /* private mode */ }
        },
    };

    const stats = {
        best: store.get('best', 0),
        souls: store.get('souls', 0),
        runs: store.get('runs', 0),
    };
    let muted = store.get('muted', false);

    // ---------- Helpers ----------
    const rand = (a, b) => a + Math.random() * (b - a);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const lerp = (a, b, k) => a + (b - a) * k;
    const pick = (arr) => arr[(Math.random() * arr.length) | 0];

    function mulberry32(seed) {
        return () => {
            seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
            let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
            return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        };
    }

    function makeCanvas(w, h) {
        const c = document.createElement('canvas');
        c.width = Math.ceil(w * RS);
        c.height = Math.ceil(h * RS);
        const g = c.getContext('2d');
        g.scale(RS, RS);
        g.imageSmoothingQuality = 'high';
        return [c, g];
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    // ---------- Sprites ----------
    const sprites = {};

    function scaled(img, w, h) {
        const [c, g] = makeCanvas(w, h);
        g.drawImage(img, 0, 0, w, h);
        return c;
    }

    function tinted(src, w, h, color, amount) {
        const [c, g] = makeCanvas(w, h);
        g.drawImage(src, 0, 0, w, h);
        g.globalCompositeOperation = 'source-atop';
        g.globalAlpha = amount;
        g.fillStyle = color;
        g.fillRect(0, 0, w, h);
        return c;
    }

    function makeGlow(r, g, b) {
        const s = 64;
        const c = document.createElement('canvas');
        c.width = c.height = s;
        const x = c.getContext('2d');
        const grd = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        grd.addColorStop(0, `rgba(${r},${g},${b},1)`);
        grd.addColorStop(0.22, `rgba(${r},${g},${b},0.55)`);
        grd.addColorStop(0.55, `rgba(${r},${g},${b},0.12)`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        x.fillStyle = grd;
        x.fillRect(0, 0, s, s);
        return c;
    }

    function makeVignette(r, g, b, a) {
        const [c, x] = makeCanvas(W, H);
        const grd = x.createRadialGradient(W / 2, H * 0.45, H * 0.22, W / 2, H * 0.5, H * 0.72);
        grd.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grd.addColorStop(1, `rgba(${r},${g},${b},${a})`);
        x.fillStyle = grd;
        x.fillRect(0, 0, W, H);
        return c;
    }

    function makeFog() {
        const [c, x] = makeCanvas(260, 110);
        const grd = x.createRadialGradient(130, 55, 0, 130, 55, 130);
        grd.addColorStop(0, 'rgba(170,215,222,0.20)');
        grd.addColorStop(0.5, 'rgba(170,215,222,0.08)');
        grd.addColorStop(1, 'rgba(170,215,222,0)');
        x.fillStyle = grd;
        x.beginPath();
        x.ellipse(130, 55, 130, 55, 0, 0, TAU);
        x.fill();
        return c;
    }

    // Procedural, seamlessly tiling graveyard silhouette.
    const TILE_W = 720;
    const TILE_TOP = 52;
    function makeGround() {
        const th = GROUND_H + TILE_TOP;
        const [c, g] = makeCanvas(TILE_W, th);
        const rng = mulberry32(1031);
        const k = TAU / TILE_W;
        const mound = (x) => TILE_TOP + 3 * Math.sin(x * k * 3) + 2.2 * Math.sin(x * k * 7 + 1.3) + 1.2 * Math.sin(x * k * 13);

        // distant row of graves (lighter, smaller)
        g.fillStyle = '#0e1c20';
        for (let i = 0; i < 16; i++) {
            const x = 20 + i * 44 + rng() * 16;
            const h = 7 + rng() * 8;
            const w = 6 + rng() * 5;
            const by = mound(x) + 2;
            if (rng() < 0.3) {
                g.fillRect(x + w / 2 - 1, by - h - 4, 2, h + 4);
                g.fillRect(x + w / 2 - 4, by - h, 8, 2);
            } else {
                roundTop(g, x, by - h, w, h);
            }
        }

        // dead tree
        drawTree(g, 520, mound(520) + 4, rng);
        drawTree(g, 110, mound(110) + 4, rng, 0.7);

        // earth body
        g.beginPath();
        g.moveTo(0, mound(0));
        for (let x = 0; x <= TILE_W; x += 4) g.lineTo(x, mound(x));
        g.lineTo(TILE_W, th);
        g.lineTo(0, th);
        g.closePath();
        const earth = g.createLinearGradient(0, TILE_TOP, 0, th);
        earth.addColorStop(0, '#0b1517');
        earth.addColorStop(0.35, '#060c0e');
        earth.addColorStop(1, '#020405');
        g.fillStyle = earth;
        g.fill();

        // near graves
        const items = [];
        let x = 26;
        while (x < TILE_W - 40) {
            items.push(x);
            x += 46 + rng() * 52;
        }
        for (const gx of items) {
            const t = rng();
            const by = mound(gx) + 6;
            g.fillStyle = '#04090a';
            g.strokeStyle = 'rgba(140,215,222,0.20)';
            g.lineWidth = 1;
            if (t < 0.45) {
                const w = 14 + rng() * 8, h = 18 + rng() * 14;
                const tilt = rand(-0.12, 0.12);
                g.save(); g.translate(gx + w / 2, by); g.rotate(tilt);
                roundTop(g, -w / 2, -h, w, h); g.stroke();
                // epitaph scratches
                g.strokeStyle = 'rgba(140,215,222,0.10)';
                g.beginPath(); g.moveTo(-w / 4, -h * 0.55); g.lineTo(w / 4, -h * 0.55);
                g.moveTo(-w / 5, -h * 0.4); g.lineTo(w / 5, -h * 0.4); g.stroke();
                g.restore();
            } else if (t < 0.75) {
                const h = 22 + rng() * 12;
                const tilt = rand(-0.18, 0.18);
                g.save(); g.translate(gx, by); g.rotate(tilt);
                g.beginPath();
                g.rect(-2.5, -h, 5, h);
                g.rect(-8, -h * 0.75, 16, 4.5);
                g.fill(); g.stroke();
                g.restore();
            } else {
                const h = 30 + rng() * 14;
                g.beginPath();
                g.moveTo(gx - 6, by); g.lineTo(gx - 4, by - h); g.lineTo(gx, by - h - 7);
                g.lineTo(gx + 4, by - h); g.lineTo(gx + 6, by); g.closePath();
                g.fill(); g.stroke();
            }
        }

        // rim light along the mound
        g.beginPath();
        for (let x2 = 0; x2 <= TILE_W; x2 += 4) g.lineTo(x2, mound(x2));
        g.strokeStyle = 'rgba(95,245,209,0.22)';
        g.lineWidth = 1.2;
        g.stroke();

        // grass tufts
        g.strokeStyle = '#081113';
        g.lineWidth = 1;
        for (let i = 0; i < 140; i++) {
            const gx = rng() * TILE_W;
            const gy = mound(gx) + 1;
            const h = 3 + rng() * 6;
            g.beginPath();
            g.moveTo(gx, gy); g.lineTo(gx - 2 + rng() * 4, gy - h);
            g.stroke();
        }

        // soil specks
        for (let i = 0; i < 260; i++) {
            const sx = rng() * TILE_W;
            const sy = TILE_TOP + 14 + rng() * (GROUND_H - 10);
            g.fillStyle = `rgba(120,170,175,${0.02 + rng() * 0.05})`;
            g.fillRect(sx, sy, 1.2, 1.2);
        }
        return c;

        function roundTop(gg, x0, y0, w, h) {
            gg.beginPath();
            gg.moveTo(x0, y0 + h);
            gg.lineTo(x0, y0 + w / 2);
            gg.arc(x0 + w / 2, y0 + w / 2, w / 2, Math.PI, 0);
            gg.lineTo(x0 + w, y0 + h);
            gg.closePath();
            gg.fill();
        }
    }

    function drawTree(g, x, y, rng, s = 1) {
        g.save();
        g.translate(x, y);
        g.scale(s, s);
        g.strokeStyle = '#050b0d';
        g.lineCap = 'round';
        const branch = (len, ang, w, depth) => {
            if (depth === 0 || len < 4) return;
            g.lineWidth = w;
            g.beginPath();
            g.moveTo(0, 0);
            const ex = Math.sin(ang) * len, ey = -Math.cos(ang) * len;
            g.quadraticCurveTo(ex * 0.5 + (rng() - 0.5) * 6, ey * 0.5, ex, ey);
            g.stroke();
            g.save();
            g.translate(ex, ey);
            branch(len * (0.62 + rng() * 0.15), ang - 0.45 - rng() * 0.3, w * 0.65, depth - 1);
            branch(len * (0.55 + rng() * 0.2), ang + 0.4 + rng() * 0.35, w * 0.6, depth - 1);
            g.restore();
        };
        branch(26, -0.08, 5, 5);
        g.restore();
    }

    // ---------- Audio ----------
    const audio = {
        ctx: null,
        master: null,
        noise: null,

        init() {
            if (this.ctx) {
                if (this.ctx.state === 'suspended') this.ctx.resume();
                return;
            }
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            this.ctx = new AC();
            this.master = this.ctx.createGain();
            this.master.gain.value = muted ? 0 : 0.9;
            this.master.connect(this.ctx.destination);
            const len = this.ctx.sampleRate * 2;
            this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
            const d = this.noise.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        },

        setMuted(m) {
            if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.05);
        },

        env(node, t0, peak, attack, decay) {
            node.gain.setValueAtTime(0.0001, t0);
            node.gain.exponentialRampToValueAtTime(peak, t0 + attack);
            node.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
        },

        tone(freq, type, peak, attack, decay, when = 0, slideTo = null) {
            if (!this.ctx) return;
            const t0 = this.ctx.currentTime + when;
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = type;
            o.frequency.setValueAtTime(freq, t0);
            if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + attack + decay);
            this.env(g, t0, peak, attack, decay);
            o.connect(g).connect(this.master);
            o.start(t0);
            o.stop(t0 + attack + decay + 0.05);
        },

        hiss(peak, attack, decay, filterType, f0, f1, q = 1, when = 0) {
            if (!this.ctx) return;
            const t0 = this.ctx.currentTime + when;
            const src = this.ctx.createBufferSource();
            src.buffer = this.noise;
            const f = this.ctx.createBiquadFilter();
            f.type = filterType;
            f.Q.value = q;
            f.frequency.setValueAtTime(f0, t0);
            f.frequency.exponentialRampToValueAtTime(f1, t0 + attack + decay);
            const g = this.ctx.createGain();
            this.env(g, t0, peak, attack, decay);
            src.connect(f).connect(g).connect(this.master);
            src.start(t0, Math.random());
            src.stop(t0 + attack + decay + 0.05);
        },

        flap() { this.hiss(0.22, 0.01, 0.14, 'bandpass', 700, 2600, 1.4); },
        score() {
            this.tone(659, 'triangle', 0.07, 0.005, 0.18);
            this.tone(988, 'triangle', 0.05, 0.005, 0.25, 0.07);
        },
        soul() {
            [880, 1318, 1760, 2637].forEach((f, i) => this.tone(f * rand(0.995, 1.005), 'sine', 0.06, 0.005, 0.35, i * 0.045));
        },
        meterFull() {
            this.tone(330, 'sine', 0.1, 0.05, 0.8, 0, 990);
            this.tone(495, 'sine', 0.06, 0.05, 0.8, 0.05, 1485);
        },
        phase() {
            this.tone(220, 'sawtooth', 0.05, 0.02, 0.6, 0, 1760);
            this.hiss(0.12, 0.05, 0.7, 'bandpass', 4000, 600, 3);
            [523, 659, 784].forEach((f, i) => this.tone(f, 'sine', 0.05, 0.03, 0.9, i * 0.04));
        },
        hit() {
            this.tone(140, 'sine', 0.5, 0.005, 0.5, 0, 38);
            this.hiss(0.35, 0.005, 0.35, 'lowpass', 2400, 120, 0.8);
            this.tone(392, 'sawtooth', 0.04, 0.02, 1.2, 0.18, 98);
        },
        thunder() {
            this.hiss(0.5, 0.02, 2.4, 'lowpass', 900, 60, 0.7);
            this.hiss(0.25, 0.3, 1.8, 'lowpass', 300, 50, 0.7, 0.15);
        },
        bloodMoon() {
            this.tone(55, 'sine', 0.25, 0.6, 2.4);
            this.tone(82.4, 'sine', 0.16, 0.8, 2.2);
            this.tone(116.5, 'triangle', 0.06, 0.8, 2.0, 0.1);
        },
    };

    function startMusic() {
        music.volume = 0.32;
        if (!muted) music.play().catch(() => { /* blocked until a gesture */ });
    }

    function applyMuted() {
        muteBtn.setAttribute('aria-pressed', String(muted));
        audio.setMuted(muted);
        if (muted) music.pause();
        else if (audio.ctx) music.play().catch(() => {});
    }

    // ---------- Game state ----------
    let state = 'loading';        // title | ready | play | paused | dying | over
    let t = 0;                    // frame counter
    let score = 0;
    let runSouls = 0;
    let meter = 0;
    let phaseT = 0;
    let speed = CFG.baseSpeed;
    let groundX = 0;
    let fogX = 0;
    let sinceSpawn = 0;
    let lastGap = H * 0.4;
    let pipes = [];
    let particles = [];
    let banners = [];
    let bats = [];
    let bolt = null;
    let flash = 0;
    let redFlash = 0;
    let nextLightning = 400;
    let blood = 0;
    let bloodUntil = 0;
    let scoreBump = 0;
    let hitstop = 0;
    let dyingT = 0;
    let overShownAt = 0;

    const ghost = { x: GHOST_X, y: H * 0.42, vy: 0, rot: 0, squash: 0, visible: true };

    function resetRun() {
        score = 0;
        runSouls = 0;
        meter = 0;
        phaseT = 0;
        speed = CFG.baseSpeed;
        sinceSpawn = CFG.spacing;
        lastGap = H * 0.36;
        pipes = [];
        particles = [];
        banners = [];
        bloodUntil = 0;
        scoreBump = 0;
        hitstop = 0;
        dyingT = 0;
        redFlash = 0;
        ghost.y = H * 0.42;
        ghost.vy = 0;
        ghost.rot = 0;
        ghost.squash = 0;
        ghost.visible = true;
    }

    function initBats() {
        bats = Array.from({ length: 5 }, () => ({
            x: rand(0, W + 200), y: rand(60, 300), v: rand(0.5, 1.3),
            s: rand(0.45, 0.9), p: rand(0, TAU), fs: rand(0.8, 1.3), amp: rand(4, 14),
        }));
    }

    // ---------- Screens ----------
    function showScreen(name) {
        for (const [key, el] of Object.entries(screens)) el.classList.toggle('is-active', key === name);
        pauseBtn.hidden = state !== 'play';
        updatePhaseBtn();
    }

    function updatePhaseBtn() {
        phaseBtn.hidden = !(state === 'play' && meter >= CFG.soulsToPhase && phaseT === 0);
    }

    function toTitle() {
        state = 'title';
        resetRun();
        showScreen('title');
        setBloodClass(false);
        music.volume = 0.32;
    }

    function toReady() {
        audio.init();
        startMusic();
        resetRun();
        state = 'ready';
        $('readyTip').innerHTML = pick(TIPS);
        showScreen('ready');
        music.volume = 0.32;
    }

    function startPlay() {
        state = 'play';
        showScreen(null);
    }

    function pauseGame() {
        if (state !== 'play') return;
        state = 'paused';
        showScreen('pause');
        music.volume = 0.1;
    }

    function resumeGame() {
        if (state !== 'paused') return;
        state = 'play';
        showScreen(null);
        music.volume = 0.32;
    }

    // ---------- Actions ----------
    function action() {
        audio.init();
        switch (state) {
            case 'title': toReady(); break;
            case 'ready': startPlay(); flap(); break;
            case 'play': flap(); break;
            case 'paused': resumeGame(); break;
            case 'over':
                if (performance.now() - overShownAt > 650) toReady();
                break;
        }
    }

    function flap() {
        ghost.vy = CFG.flap;
        ghost.squash = 1;
        audio.flap();
        for (let i = 0; i < 4; i++) {
            spawn({
                x: ghost.x + 14, y: ghost.y + GHOST_H - 4,
                vx: rand(-1.6, -0.4), vy: rand(0.6, 1.6),
                life: rand(18, 30), size: rand(6, 10), glow: 'white', alpha: 0.35,
            });
        }
    }

    function activatePhase() {
        if (state !== 'play' || meter < CFG.soulsToPhase || phaseT > 0) return;
        meter = 0;
        phaseT = CFG.phaseFrames;
        audio.phase();
        addBanner('PHASED', 'drift through the dead', '#5ff5d1', 70);
        const cx = ghost.x + GHOST_W * 0.4, cy = ghost.y + GHOST_H / 2;
        for (let i = 0; i < 26; i++) {
            const a = (i / 26) * TAU;
            spawn({ x: cx, y: cy, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3, life: 34, size: 9, glow: 'ecto', drag: 0.92 });
        }
        updatePhaseBtn();
    }

    function die() {
        if (state !== 'play') return;
        state = 'dying';
        hitstop = 7;
        dyingT = 0;
        redFlash = 1;
        audio.hit();
        stage.classList.remove('is-shaking');
        void stage.offsetWidth;
        stage.classList.add('is-shaking');
        pauseBtn.hidden = true;
        phaseBtn.hidden = true;

        stats.runs += 1;
        stats.souls += runSouls;
        const isNew = score > stats.best;
        if (isNew) stats.best = score;
        store.set('runs', stats.runs);
        store.set('souls', stats.souls);
        store.set('best', stats.best);
        renderRecords();
        $('overNew').hidden = !(isNew && score > 0);
    }

    function shatterGhost() {
        ghost.visible = false;
        const cx = ghost.x + GHOST_W * 0.4, cy = ghost.y + GHOST_H / 2;
        for (let i = 0; i < 46; i++) {
            const a = rand(0, TAU), v = rand(0.8, 4.2);
            spawn({
                x: cx + rand(-10, 10), y: cy + rand(-10, 10),
                vx: Math.cos(a) * v - 0.6, vy: Math.sin(a) * v - 1,
                life: rand(40, 80), size: rand(5, 13), glow: Math.random() < 0.8 ? 'white' : 'ecto',
                drag: 0.95, grav: -0.03, alpha: 0.8,
            });
        }
    }

    function showOver() {
        state = 'over';
        overShownAt = performance.now();
        $('overScore').textContent = score;
        $('overBest').textContent = stats.best;
        $('overSouls').textContent = runSouls;
        const medal = MEDALS.find((m) => score >= m.min);
        const medalEl = $('overMedal');
        medalEl.dataset.tier = medal ? medal.id : 'none';
        $('overMedalIco').textContent = medal ? medal.ico : '✝';
        $('overMedalName').textContent = medal ? medal.name : 'No medal';
        let lines = EPITAPHS[0][1];
        for (const [min, l] of EPITAPHS) if (score >= min) lines = l;
        $('overEpitaph').textContent = '“' + pick(lines) + '”';
        showScreen('over');
        music.volume = 0.14;
        setBloodClass(false);
        // Players are often still tapping when they die; don't let a stray tap leave the game.
        overMoreBtn.setAttribute('aria-disabled', 'true');
        setTimeout(() => overMoreBtn.removeAttribute('aria-disabled'), MORE_LINK_GUARD_MS);
    }

    // ---------- Pipes & souls ----------
    function currentGap() {
        return Math.max(CFG.gapStart - score * 0.9, CFG.gapMin);
    }

    function spawnPipe() {
        const gap = currentGap();
        const minTop = 70;
        const maxTop = GROUND_Y - gap - 70;
        let top = rand(minTop, maxTop);
        top = clamp(top, lastGap - 170, lastGap + 170);
        lastGap = top;
        const sway = score >= CFG.swayFrom ? Math.min(14 + (score - CFG.swayFrom) * 0.7, 34) : 0;
        pipes.push({
            x: W + 8,
            top,
            gap,
            sway,
            phase: rand(0, TAU),
            scored: false,
            soul: Math.random() < CFG.soulChance
                ? { off: rand(-0.22, 0.22) * gap, xo: rand(-6, CFG.pipeW + 26), p: rand(0, TAU), taken: false }
                : null,
        });
    }

    function gapTopOf(p) {
        if (!p.sway) return p.top;
        return clamp(p.top + Math.sin(t * 0.028 + p.phase) * p.sway, 40, GROUND_Y - p.gap - 40);
    }

    function circleRect(cx, cy, r, rx, ry, rw, rh) {
        const nx = clamp(cx, rx, rx + rw);
        const ny = clamp(cy, ry, ry + rh);
        const dx = cx - nx, dy = cy - ny;
        return dx * dx + dy * dy < r * r;
    }

    function ghostCenter() {
        return [ghost.x + 18, ghost.y + 17];
    }

    function overlapsAnyPipe(lookahead = 0) {
        let [cx, cy] = ghostCenter();
        cx += lookahead;
        for (const p of pipes) {
            const gt = gapTopOf(p);
            const x = p.x + 8, w = CFG.pipeW - 16;
            if (circleRect(cx, cy, GHOST_R, x, -200, w, gt - 4 + 200)) return true;
            if (circleRect(cx, cy, GHOST_R, x, gt + p.gap + 4, w, H)) return true;
        }
        return false;
    }

    // ---------- Banners & particles ----------
    function addBanner(text, sub, color, life = 120) {
        banners.push({ text, sub, color, life, max: life });
    }

    function spawn(p) {
        if (particles.length > 450) particles.shift();
        p.max = p.life;
        p.drag = p.drag ?? 0.98;
        p.grav = p.grav ?? 0;
        p.alpha = p.alpha ?? 1;
        particles.push(p);
    }

    // ---------- Update ----------
    function update() {
        if (state === 'paused' || state === 'loading') return;
        t++;
        updateAmbient();

        if (state === 'title' || state === 'ready') {
            groundX += CFG.baseSpeed * 0.8;
            fogX += 0.35;
            ghost.y = H * 0.42 + Math.sin(t * 0.06) * 8;
            ghost.rot = Math.sin(t * 0.03) * 0.06;
            ghost.squash *= 0.85;
            if (t % 3 === 0) trail();
        } else if (state === 'play') {
            updatePlay();
        } else if (state === 'dying') {
            if (hitstop > 0) {
                hitstop--;
                if (hitstop === 0) shatterGhost();
            } else {
                dyingT++;
                if (dyingT === 60) showOver();
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.vx *= p.drag; p.vy *= p.drag;
            p.vy += p.grav;
            p.x += p.vx; p.y += p.vy;
            if (--p.life <= 0) particles.splice(i, 1);
        }
        for (let i = banners.length - 1; i >= 0; i--) if (--banners[i].life <= 0) banners.splice(i, 1);

        scoreBump *= 0.88;
        redFlash *= 0.9;
    }

    function updatePlay() {
        // pace
        const bloodOn = score < bloodUntil;
        speed = Math.min(CFG.baseSpeed + score * 0.028, CFG.maxSpeed) + blood * 0.45;
        groundX += speed;
        fogX += speed * 0.25;

        // ghost
        ghost.vy = Math.min(ghost.vy + CFG.gravity, CFG.maxFall);
        ghost.y += ghost.vy;
        if (ghost.y < -6) { ghost.y = -6; ghost.vy = Math.max(ghost.vy, 0); }
        const target = clamp(ghost.vy * 0.075, -0.42, 1.0);
        ghost.rot += (target - ghost.rot) * 0.2;
        ghost.squash *= 0.85;
        if (t % 2 === 0) trail();

        // phase timer (never expires inside, or just before, a hand)
        if (phaseT > 0) {
            if (phaseT === 1 && (overlapsAnyPipe() || overlapsAnyPipe(speed * 10))) { /* hold */ } else phaseT--;
            if (phaseT === 0) updatePhaseBtn();
            if (t % 2 === 0) {
                spawn({ x: ghost.x + rand(0, GHOST_W), y: ghost.y + rand(0, GHOST_H), vx: -speed * 0.6, vy: rand(-0.4, 0.4), life: 22, size: rand(5, 9), glow: 'ecto', alpha: 0.6 });
            }
        }

        // pipes
        sinceSpawn += speed;
        if (sinceSpawn >= CFG.spacing) { sinceSpawn = 0; spawnPipe(); }

        const [cx, cy] = ghostCenter();
        for (const p of pipes) {
            p.x -= speed;
            const gt = gapTopOf(p);

            if (!p.scored && p.x + CFG.pipeW < ghost.x) {
                p.scored = true;
                score++;
                scoreBump = 1;
                audio.score();
                if (score % CFG.bloodEvery === 0) {
                    bloodUntil = score + CFG.bloodLength;
                    addBanner('BLOOD MOON', 'the dead grow restless', '#e3263a', 150);
                    audio.bloodMoon();
                    triggerLightning(true);
                } else if (score === CFG.swayFrom) {
                    addBanner('THEY STIR', 'the hands begin to sway', '#ff8a1f', 120);
                }
            }

            const s = p.soul;
            if (s && !s.taken) {
                const sx = p.x + s.xo, sy = gt + p.gap / 2 + s.off;
                const dx = sx - cx, dy = sy - cy;
                if (dx * dx + dy * dy < 22 * 22) {
                    s.taken = true;
                    collectSoul(sx, sy);
                }
            }

            if (phaseT === 0) {
                const x = p.x + 8, w = CFG.pipeW - 16;
                if (circleRect(cx, cy, GHOST_R, x, -200, w, gt - 4 + 200) ||
                    circleRect(cx, cy, GHOST_R, x, gt + p.gap + 4, w, H)) {
                    die();
                    return;
                }
            }
        }
        while (pipes.length && pipes[0].x < -CFG.pipeW - 40) pipes.shift();

        if (ghost.y + GHOST_H - 6 >= GROUND_Y) {
            ghost.y = GROUND_Y - GHOST_H + 6;
            die();
        }

        setBloodClass(bloodOn);
    }

    function collectSoul(x, y) {
        runSouls++;
        const wasFull = meter >= CFG.soulsToPhase;
        meter = Math.min(meter + 1, CFG.soulsToPhase);
        audio.soul();
        for (let i = 0; i < 16; i++) {
            const a = rand(0, TAU), v = rand(0.6, 2.8);
            spawn({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(20, 40), size: rand(4, 9), glow: 'ecto', drag: 0.93 });
        }
        spawn({ x, y: y - 12, vx: 0, vy: -0.7, life: 50, text: '+1 SOUL', color: '#5ff5d1', drag: 0.98 });
        if (!wasFull && meter >= CFG.soulsToPhase && phaseT === 0) {
            audio.meterFull();
            addBanner('PHASE READY', PHASE_HINT, '#5ff5d1', 100);
        }
        updatePhaseBtn();
    }

    function trail() {
        spawn({
            x: ghost.x + 8 + rand(-2, 2), y: ghost.y + GHOST_H * 0.62 + rand(-4, 4),
            vx: -(state === 'play' ? speed : CFG.baseSpeed * 0.8) * 0.55, vy: rand(-0.2, 0.3),
            life: rand(20, 32), size: rand(5, 9), glow: 'white', alpha: 0.28,
        });
    }

    let bloodClass = false;
    function setBloodClass(on) {
        if (on === bloodClass) return;
        bloodClass = on;
        document.body.classList.toggle('blood-moon', on);
    }

    function updateAmbient() {
        const bloodTarget = state === 'play' || state === 'dying' ? (score < bloodUntil ? 1 : 0) : 0;
        blood = lerp(blood, bloodTarget, 0.025);

        for (const b of bats) {
            b.x -= b.v + (state === 'play' ? speed * 0.2 : 0.3);
            if (b.x < -40) { b.x = W + rand(40, 260); b.y = rand(50, 300); }
        }

        if (t % 6 === 0 && state !== 'dying') {
            spawn({
                x: rand(0, W), y: GROUND_Y + rand(-4, 20),
                vx: rand(-0.6, 0.2), vy: rand(-0.9, -0.35),
                life: rand(110, 200), size: rand(2.5, 5), glow: blood > 0.5 ? 'red' : 'ember', alpha: 0.8, drag: 0.995,
                wobble: rand(0, TAU),
            });
        }

        if (state !== 'over' && --nextLightning <= 0) triggerLightning(false);
        flash *= 0.86;
        if (bolt && --bolt.life <= 0) bolt = null;
    }

    function triggerLightning(forced) {
        nextLightning = forced ? 500 : rand(600, 1400) | 0;
        const pts = [];
        let x = rand(40, W - 40), y = -10;
        pts.push([x, y]);
        const endY = rand(220, 340);
        while (y < endY) {
            y += rand(14, 30);
            x += rand(-18, 18);
            pts.push([x, y]);
        }
        const branches = [];
        for (let i = 2; i < pts.length - 2; i += 2) {
            if (Math.random() < 0.5) {
                let [bx, by] = pts[i];
                const br = [[bx, by]];
                const dir = Math.random() < 0.5 ? -1 : 1;
                for (let j = 0; j < 3; j++) { bx += dir * rand(8, 20); by += rand(10, 22); br.push([bx, by]); }
                branches.push(br);
            }
        }
        bolt = { pts, branches, life: 14, max: 14 };
        flash = 1;
        flashEl.classList.remove('is-on');
        void flashEl.offsetWidth;
        flashEl.classList.add('is-on');
        setTimeout(() => audio.thunder(), 220);
    }

    // ---------- Render ----------
    function render() {
        ctx.save();
        drawSky();
        drawBats();
        drawFog(0.35, 0.55, 360);
        drawPipes();
        drawGround();
        drawFog(1, 0.9, GROUND_Y - 40);
        drawParticles(false);
        drawGhost();
        drawParticles(true);
        drawOverlayFx();
        drawHud();
        ctx.restore();
    }

    function drawSky() {
        const s = 1.12;
        const bw = W * s, bh = H * s;
        const ox = -(bw - W) / 2 + Math.sin(t * 0.0025) * 14;
        const oy = -(bh - H) / 2 + Math.cos(t * 0.002) * 8;
        ctx.drawImage(sprites.bg, ox, oy, bw, bh);

        // blood tint
        if (blood > 0.01) {
            ctx.fillStyle = `rgba(120,0,16,${0.32 * blood})`;
            ctx.fillRect(0, 0, W, H);
        }

        // moon
        const mx = 292, my = 92, mr = 26 + blood * 6;
        const mc = [lerp(232, 226, blood), lerp(240, 40, blood), lerp(228, 50, blood)].map(Math.round);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.5 + blood * 0.4;
        const glow = blood > 0.5 ? sprites.glowRed : sprites.glowWhite;
        ctx.drawImage(glow, mx - mr * 4, my - mr * 4, mr * 8, mr * 8);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        const mg = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr);
        mg.addColorStop(0, `rgb(${Math.min(mc[0] + 20, 255)},${Math.min(mc[1] + 15, 255)},${Math.min(mc[2] + 15, 255)})`);
        mg.addColorStop(1, `rgb(${mc[0] - 40},${Math.max(mc[1] - 50, 0)},${Math.max(mc[2] - 50, 0)})`);
        ctx.fillStyle = mg;
        ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        [[-8, -6, 6], [7, 4, 4.5], [-3, 10, 3.5], [9, -10, 3]].forEach(([dx, dy, r]) => {
            ctx.beginPath(); ctx.arc(mx + dx, my + dy, r * (mr / 26), 0, TAU); ctx.fill();
        });
        // wisp of cloud across the moon
        ctx.globalAlpha = 0.55;
        ctx.drawImage(sprites.fog, ((t * 0.15) % (W + 260)) - 130 + 120, my - 30, 220, 50);
        ctx.globalAlpha = 1;

        // lightning
        if (bolt) {
            const a = bolt.life / bolt.max;
            ctx.save();
            ctx.globalAlpha = a;
            ctx.strokeStyle = blood > 0.5 ? '#ffd0d4' : '#e6fbff';
            ctx.shadowColor = blood > 0.5 ? '#ff3344' : '#9feaff';
            ctx.shadowBlur = 16;
            ctx.lineJoin = 'round';
            ctx.lineWidth = 2.2;
            strokePath(bolt.pts);
            ctx.lineWidth = 1.1;
            bolt.branches.forEach(strokePath);
            ctx.restore();
        }
    }

    function strokePath(pts) {
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.stroke();
    }

    function drawBats() {
        ctx.fillStyle = '#020506';
        for (const b of bats) {
            const f = Math.sin(t * 0.32 * b.fs + b.p);
            const y = b.y + Math.sin(t * 0.03 + b.p) * b.amp;
            ctx.save();
            ctx.translate(b.x, y);
            ctx.scale(b.s, b.s);
            ctx.beginPath(); ctx.ellipse(0, 0, 3, 4.5, 0, 0, TAU); ctx.fill();
            ctx.beginPath(); ctx.moveTo(-2, -4); ctx.lineTo(-1.5, -7); ctx.lineTo(0, -4.5); ctx.lineTo(1.5, -7); ctx.lineTo(2, -4); ctx.fill();
            for (const dir of [-1, 1]) {
                const wy = f * 7;
                ctx.beginPath();
                ctx.moveTo(dir * 2, -1);
                ctx.quadraticCurveTo(dir * 9, -8 + wy, dir * 18, -3 + wy);
                ctx.lineTo(dir * 14, 1 + wy * 0.5);
                ctx.lineTo(dir * 11, -1 + wy * 0.4);
                ctx.lineTo(dir * 8, 2 + wy * 0.3);
                ctx.lineTo(dir * 5, 0);
                ctx.lineTo(dir * 2, 3);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function drawFog(parallax, alpha, y) {
        ctx.globalAlpha = alpha;
        const span = 300;
        const off = (fogX * parallax) % span;
        for (let i = -1; i < 3; i++) {
            const x = i * span - off;
            ctx.drawImage(sprites.fog, x - 40, y + Math.sin((i + t * 0.004) * 1.7) * 6, 320, 120);
        }
        ctx.globalAlpha = 1;
    }

    function drawPipes() {
        const auraA = 0.28 + blood * 0.35;
        for (const p of pipes) {
            const gt = gapTopOf(p);
            const gb = gt + p.gap;
            ctx.drawImage(sprites.top, p.x, gt - CFG.pipeH, CFG.pipeW, CFG.pipeH);
            ctx.drawImage(sprites.bottom, p.x, gb, CFG.pipeW, CFG.pipeH);

            // cursed aura at the fingertips
            ctx.globalCompositeOperation = 'lighter';
            const pulse = 0.8 + Math.sin(t * 0.08 + p.phase) * 0.2;
            ctx.globalAlpha = auraA * pulse;
            ctx.drawImage(sprites.glowRed, p.x - 18, gt - 50, CFG.pipeW + 36, 70);
            ctx.drawImage(sprites.glowRed, p.x - 18, gb - 20, CFG.pipeW + 36, 70);
            ctx.globalAlpha = 1;

            const s = p.soul;
            if (s && !s.taken) {
                const sx = p.x + s.xo;
                const sy = gt + p.gap / 2 + s.off + Math.sin(t * 0.08 + s.p) * 4;
                for (let i = 4; i >= 1; i--) {
                    ctx.globalAlpha = 0.5 - i * 0.09;
                    const r = 14 - i * 2;
                    ctx.drawImage(sprites.glowEcto, sx + i * 5 - r, sy + Math.sin(t * 0.25 + i + s.p) * 2 - r, r * 2, r * 2);
                }
                ctx.globalAlpha = 0.95;
                ctx.drawImage(sprites.glowEcto, sx - 22, sy - 22, 44, 44);
                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = '#effffb';
                ctx.beginPath(); ctx.arc(sx, sy, 3.8, 0, TAU); ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';
        }
    }

    function drawGround() {
        const off = groundX % TILE_W;
        const y = GROUND_Y - TILE_TOP;
        const h = GROUND_H + TILE_TOP;
        ctx.drawImage(sprites.ground, -off, y, TILE_W, h);
        ctx.drawImage(sprites.ground, -off + TILE_W, y, TILE_W, h);
    }

    function drawParticles(front) {
        for (const p of particles) {
            if (!!p.text !== front) continue;
            const k = p.life / p.max;
            if (p.text) {
                ctx.globalAlpha = Math.min(1, k * 2);
                ctx.font = "700 11px 'JetBrains Mono', monospace";
                ctx.textAlign = 'center';
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 8;
                ctx.fillText(p.text, p.x, p.y);
                ctx.shadowBlur = 0;
                continue;
            }
            const sprite = sprites.glows[p.glow];
            let x = p.x;
            if (p.wobble !== undefined) x += Math.sin(t * 0.05 + p.wobble) * 3;
            const size = p.size * (p.glow === 'ember' || p.glow === 'red' ? 1 : 0.6 + k * 0.6);
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = p.alpha * (p.glow === 'ember' || p.glow === 'red' ? Math.sin(k * Math.PI) : k);
            ctx.drawImage(sprite, x - size, p.y - size, size * 2, size * 2);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.textAlign = 'left';
    }

    function drawGhost() {
        if (!ghost.visible || state === 'title') return;
        const cx = ghost.x + GHOST_W / 2, cy = ghost.y + GHOST_H / 2;
        const sq = ghost.squash;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ghost.rot);
        ctx.scale(1 - sq * 0.12, 1 + sq * 0.16);

        if (phaseT > 0) {
            const warn = phaseT < 45 && Math.floor(t / 4) % 2 === 0;
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.7;
            ctx.drawImage(sprites.glowEcto, -48, -42, 96, 84);
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = warn ? 0.25 : 0.55 + Math.sin(t * 0.2) * 0.1;
            ctx.drawImage(sprites.ghostPhase, -GHOST_W / 2, -GHOST_H / 2, GHOST_W, GHOST_H);
        } else {
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.22;
            ctx.drawImage(sprites.glowWhite, -40, -34, 72, 68);
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
            ctx.drawImage(sprites.ghost, -GHOST_W / 2, -GHOST_H / 2, GHOST_W, GHOST_H);
        }
        ctx.restore();
    }

    function drawOverlayFx() {
        ctx.drawImage(sprites.vignette, 0, 0, W, H);
        if (blood > 0.01) {
            ctx.globalAlpha = blood;
            ctx.drawImage(sprites.vignetteRed, 0, 0, W, H);
        }
        if (phaseT > 0) {
            ctx.globalAlpha = Math.min(1, phaseT / 20) * 0.9;
            ctx.drawImage(sprites.vignetteEcto, 0, 0, W, H);
        }
        ctx.globalAlpha = 1;
        if (flash > 0.02) {
            ctx.fillStyle = `rgba(215,240,255,${flash * 0.28})`;
            ctx.fillRect(0, 0, W, H);
        }
        if (redFlash > 0.02) {
            ctx.fillStyle = `rgba(200,10,30,${redFlash * 0.4})`;
            ctx.fillRect(0, 0, W, H);
        }
    }

    function drawHud() {
        if (state === 'play' || state === 'dying' || state === 'paused') {
            // score
            const s = 1 + scoreBump * 0.28;
            ctx.save();
            ctx.translate(W / 2, 82);
            ctx.scale(s, s);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.font = "60px 'Rubik Wet Paint', cursive";
            ctx.lineWidth = 7;
            ctx.strokeStyle = 'rgba(3,6,7,0.9)';
            ctx.strokeText(score, 0, 0);
            ctx.shadowColor = blood > 0.5 ? '#ff2a3d' : 'rgba(232,241,242,0.6)';
            ctx.shadowBlur = 18;
            ctx.fillStyle = blood > 0.5 ? '#ff4a5a' : '#eef6f7';
            ctx.fillText(score, 0, 0);
            ctx.restore();

            drawMeter();
        }

        // banners
        for (const b of banners) {
            const age = b.max - b.life;
            const a = Math.min(1, age / 14, b.life / 26);
            const rise = (1 - Math.min(1, age / 14)) * 14;
            ctx.save();
            ctx.globalAlpha = a;
            ctx.textAlign = 'center';
            ctx.font = "40px 'Rubik Wet Paint', cursive";
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'rgba(3,6,7,0.85)';
            ctx.strokeText(b.text, W / 2, 210 + rise);
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 22;
            ctx.fillStyle = b.color;
            ctx.fillText(b.text, W / 2, 210 + rise);
            ctx.shadowBlur = 0;
            ctx.font = "700 10px 'JetBrains Mono', monospace";
            ctx.fillStyle = 'rgba(232,241,242,0.85)';
            const sub = b.sub.toUpperCase().split('').join(String.fromCharCode(8202));
            ctx.fillText(sub, W / 2, 232 + rise);
            ctx.restore();
        }
    }

    function drawMeter() {
        const x0 = 18, y0 = GROUND_Y + 38;
        const full = meter >= CFG.soulsToPhase;
        ctx.font = "700 9px 'JetBrains Mono', monospace";
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(159,180,185,0.85)';

        if (phaseT > 0) {
            ctx.fillText('PHASED', x0, y0 - 12);
            const w = 112, k = phaseT / CFG.phaseFrames;
            ctx.fillStyle = 'rgba(95,245,209,0.15)';
            roundRect(x0, y0 - 4, w, 8, 4); ctx.fill();
            ctx.fillStyle = '#5ff5d1';
            ctx.shadowColor = '#5ff5d1'; ctx.shadowBlur = 10;
            roundRect(x0, y0 - 4, Math.max(8, w * k), 8, 4); ctx.fill();
            ctx.shadowBlur = 0;
            return;
        }

        ctx.fillText(full ? 'PHASE READY · ' + PHASE_HINT.toUpperCase() : 'SOULS', x0, y0 - 12);
        for (let i = 0; i < CFG.soulsToPhase; i++) {
            const px = x0 + 6 + i * 22, py = y0;
            const on = i < meter;
            if (on) {
                const pulse = full ? 1 + Math.sin(t * 0.18 + i * 0.6) * 0.25 : 1;
                ctx.globalCompositeOperation = 'lighter';
                ctx.globalAlpha = 0.9;
                ctx.drawImage(sprites.glowEcto, px - 13 * pulse, py - 13 * pulse, 26 * pulse, 26 * pulse);
                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = '#effffb';
                ctx.beginPath(); ctx.arc(px, py, 3.4, 0, TAU); ctx.fill();
            } else {
                ctx.strokeStyle = 'rgba(159,180,185,0.4)';
                ctx.lineWidth = 1.2;
                ctx.beginPath(); ctx.arc(px, py, 4.5, 0, TAU); ctx.stroke();
            }
        }
    }

    function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    // ---------- Loop ----------
    let last = performance.now();
    let acc = 0;
    function frame(now) {
        requestAnimationFrame(frame);
        let dt = now - last;
        last = now;
        if (dt > 250) dt = 250;
        acc += dt;
        while (acc >= STEP) {
            update();
            acc -= STEP;
        }
        if (state !== 'loading') render();
    }

    // ---------- Sizing ----------
    function resize() {
        const rect = stage.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
    }

    // ---------- Records UI ----------
    function renderRecords() {
        $('recBest').textContent = stats.best;
        $('recSouls').textContent = stats.souls;
        $('recRuns').textContent = stats.runs;
        document.querySelectorAll('#medalList li').forEach((li) => {
            const m = MEDALS.find((x) => x.id === li.dataset.tier);
            li.classList.toggle('is-earned', !!m && stats.best >= m.min);
        });
    }

    // ---------- Input ----------
    const FLAP_KEYS = new Set(['Space', 'ArrowUp', 'KeyX', 'KeyW']);

    document.addEventListener('keydown', (e) => {
        // Let Space/Enter activate the top bar and links (e.g. "More games") instead of the game.
        const inTopbar = e.target.closest && e.target.closest('.topbar, a');
        if (inTopbar && (e.code === 'Space' || e.code === 'Enter')) return;

        if (FLAP_KEYS.has(e.code)) {
            e.preventDefault();
            if (e.repeat) return;
            action();
        } else if (e.code === 'Enter') {
            e.preventDefault();
            if (state === 'over' || state === 'title') { audio.init(); toReady(); }
            else if (state === 'paused') resumeGame();
        } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyE') {
            activatePhase();
        } else if (e.code === 'KeyP' || e.code === 'Escape') {
            if (state === 'play') pauseGame();
            else if (state === 'paused') resumeGame();
        } else if (e.code === 'KeyM') {
            toggleMute();
        }
    });

    stage.addEventListener('pointerdown', (e) => {
        if (e.target.closest('button, a')) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (state === 'over') return; // only buttons / Enter retry, avoids accidental restarts
        e.preventDefault();
        action();
    });

    function onButton(el, fn) {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            el.blur();
            audio.init();
            fn();
        });
    }
    onButton($('playBtn'), toReady);
    onButton($('retryBtn'), toReady);
    onButton($('menuBtn'), toTitle);
    onButton($('resumeBtn'), resumeGame);
    onButton(pauseBtn, pauseGame);
    phaseBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        activatePhase();
    });

    function toggleMute() {
        muted = !muted;
        store.set('muted', muted);
        audio.init();
        applyMuted();
    }
    muteBtn.addEventListener('click', () => { toggleMute(); muteBtn.blur(); });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseGame();
            music.pause();
        } else if (!muted && audio.ctx && state !== 'loading') {
            music.play().catch(() => {});
        }
    });
    window.addEventListener('blur', pauseGame);

    // ---------- Boot ----------
    async function boot() {
        $('year').textContent = new Date().getFullYear();
        muteBtn.setAttribute('aria-pressed', String(muted));
        renderRecords();

        const fontLoads = document.fonts
            ? Promise.all([
                document.fonts.load("60px 'Rubik Wet Paint'"),
                document.fonts.load("700 11px 'JetBrains Mono'"),
            ]).catch(() => {})
            : Promise.resolve();

        const [ghostImg, topImg, bottomImg, bgImg] = await Promise.all([
            // WebP copies of the PNGs, built by tools/make-sprites.mjs (same pixels, smaller files)
            loadImage('./ghost.webp'),
            loadImage('./toppipe.webp'),
            loadImage('./bottompipe.webp'),
            loadImage('./flappybirdbg2.webp'),
            fontLoads,
        ]);

        sprites.ghost = scaled(ghostImg, GHOST_W, GHOST_H);
        sprites.ghostPhase = tinted(ghostImg, GHOST_W, GHOST_H, '#5ff5d1', 0.55);
        sprites.top = scaled(topImg, CFG.pipeW, CFG.pipeH);
        sprites.bottom = scaled(bottomImg, CFG.pipeW, CFG.pipeH);
        sprites.bg = bgImg;
        sprites.ground = makeGround();
        sprites.fog = makeFog();
        sprites.vignette = makeVignette(0, 0, 0, 0.7);
        sprites.vignetteRed = makeVignette(150, 0, 18, 0.65);
        sprites.vignetteEcto = makeVignette(20, 200, 170, 0.5);
        sprites.glowWhite = makeGlow(220, 238, 245);
        sprites.glowEcto = makeGlow(95, 245, 209);
        sprites.glowEmber = makeGlow(255, 138, 31);
        sprites.glowRed = makeGlow(227, 38, 58);
        sprites.glows = { white: sprites.glowWhite, ecto: sprites.glowEcto, ember: sprites.glowEmber, red: sprites.glowRed };

        initBats();
        resize();
        new ResizeObserver(resize).observe(stage);
        toTitle();
        requestAnimationFrame((now) => { last = now; frame(now); });
    }

    boot().catch((err) => console.error('Flappy Horror failed to load', err));

    const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
    if ('serviceWorker' in navigator && location.protocol === 'https:' && !isLocal) {
        // Without a trailing slash (nesturex.com) the page sits just outside sw.js's default
        // scope, so widen it to the page path; the site sends Service-Worker-Allowed for this.
        const scope = location.pathname.endsWith('/') ? './' : location.pathname;
        navigator.serviceWorker.register('sw.js', { scope }).catch(() => {});
    }
})();
