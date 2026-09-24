// KillaMeep - shared site behavior. No dependencies.
(() => {
    const root = document.documentElement;
    root.classList.remove('no-js');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- Footer year ----------
    document.querySelectorAll('[data-year]').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // ---------- Header background once scrolled ----------
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // ---------- Reveal on scroll ----------
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('is-in'));
    }

    // ---------- Card border glow follows the cursor ----------
    document.querySelectorAll('.card.glow').forEach(card => {
        card.addEventListener('pointermove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });

    // ---------- Typing role line (home page) ----------
    const roleEl = document.querySelector('[data-roles]');
    if (roleEl) {
        const roles = roleEl.dataset.roles.split('|');
        if (reduceMotion) {
            roleEl.textContent = roles[0];
        } else {
            let r = 0, i = 0, deleting = false;
            const tick = () => {
                const word = roles[r];
                i += deleting ? -1 : 1;
                roleEl.textContent = word.slice(0, i);
                let delay = deleting ? 35 : 70;
                if (!deleting && i === word.length) { deleting = true; delay = 1800; }
                else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
                setTimeout(tick, delay);
            };
            setTimeout(tick, 500);
        }
    }

    // ---------- Starfield ----------
    const canvas = document.querySelector('.space canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const palette = ['255,255,255', '221,214,254', '251,207,232', '207,250,254'];
    let shooters = [], count = 0, w = 0, h = 0, dpr = 1, raf = 0, last = 0, nextShot = 0;

    // Fixed seed + wall-clock motion keep the starfield continuous across page loads.
    let seed = 0x6b696c6c;
    const rand = () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
    const stars = Array.from({ length: 260 }, () => {
        const depth = rand();
        return {
            nx: rand(),
            ny: rand(),
            r: 0.35 + depth * depth * 1.25,
            a: 0.25 + depth * 0.6,
            tw: 0.4 + rand() * 1.6,
            ph: rand() * Math.PI * 2,
            v: 0.6 + depth * 3.2,
            c: palette[rand() < 0.8 ? 0 : 1 + Math.floor(rand() * 3)]
        };
    });

    const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        count = Math.round(Math.min(stars.length, (w * h) / 5200));
    };

    const spawnShooter = () => {
        const angle = (Math.PI / 180) * (18 + Math.random() * 20);
        const speed = 700 + Math.random() * 500;
        shooters.push({
            x: Math.random() * w * 0.8,
            y: Math.random() * h * 0.45,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            ttl: 0.7 + Math.random() * 0.5
        });
    };

    const draw = (t) => {
        const dt = Math.min((t - last) / 1000 || 0, 0.05);
        last = t;
        ctx.clearRect(0, 0, w, h);
        const scroll = window.scrollY * 0.04;
        const now = reduceMotion ? 0 : Date.now() / 1000;
        const span = w + 4;

        for (let i = 0; i < count; i++) {
            const s = stars[i];
            const x = ((s.nx * span - s.v * now) % span + span) % span - 2;
            const y = ((s.ny * h - scroll * s.v) % h + h) % h;
            const a = reduceMotion ? s.a : s.a * (0.65 + 0.35 * Math.sin(now * s.tw + s.ph));
            ctx.fillStyle = `rgba(${s.c},${a})`;
            ctx.beginPath();
            ctx.arc(x, y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }

        if (!reduceMotion) {
            if (t > nextShot) {
                spawnShooter();
                nextShot = t + 3500 + Math.random() * 6000;
            }
            shooters = shooters.filter(s => s.life < s.ttl);
            for (const s of shooters) {
                s.life += dt;
                s.x += s.vx * dt;
                s.y += s.vy * dt;
                const fade = Math.sin(Math.PI * (s.life / s.ttl));
                const tail = 0.12;
                const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * tail, s.y - s.vy * tail);
                g.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`);
                g.addColorStop(0.3, `rgba(196,181,253,${0.5 * fade})`);
                g.addColorStop(1, 'rgba(244,114,182,0)');
                ctx.strokeStyle = g;
                ctx.lineWidth = 1.4;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x - s.vx * tail, s.y - s.vy * tail);
                ctx.stroke();
            }
        }
    };

    const loop = (t) => {
        draw(t);
        raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduceMotion) {
        draw(0);
        window.addEventListener('resize', () => { resize(); draw(0); });
    } else {
        nextShot = 1500;
        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', () => {
            cancelAnimationFrame(raf);
            if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); }
        });
        raf = requestAnimationFrame(loop);
    }
})();
