(() => {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------------------------------
       1. Menú móvil
       ------------------------------------------------------------------ */
    const nav = $('.site-nav');
    const toggle = $('.nav-toggle');
    const menu = $('#nav-menu');

    function setMenu(open) {
        nav.classList.toggle('is-open', open);
        document.body.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    }

    toggle.addEventListener('click', () => {
        setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Cerrar al elegir una sección
    menu.addEventListener('click', (e) => {
        if (e.target.closest('a')) setMenu(false);
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            setMenu(false);
            toggle.focus();
        }
    });

    // Si se agranda la ventana (por ejemplo, al girar la tablet), cerrar el menú
    window.matchMedia('(min-width: 800px)').addEventListener('change', (e) => {
        if (e.matches) setMenu(false);
    });

    /* ------------------------------------------------------------------
       2. Enlace activo según la sección visible
       ------------------------------------------------------------------ */
    const links = $$('.nav-link');
    const linkById = new Map(links.map((a) => [a.hash.slice(1), a]));

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((a) => {
                a.classList.remove('active');
                a.removeAttribute('aria-current');
            });
            const active = linkById.get(entry.target.id);
            if (active) {
                active.classList.add('active');
                active.setAttribute('aria-current', 'true');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' }); // franja fina en el centro de la pantalla

    $$('main > section[id]').forEach((s) => sectionObserver.observe(s));

    /* ------------------------------------------------------------------
       3. Reproductor de sencillos (uno a la vez)
       ------------------------------------------------------------------ */
    const formatTime = (s) => {
        if (!Number.isFinite(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = String(Math.floor(s % 60)).padStart(2, '0');
        return `${m}:${sec}`;
    };

    const players = $$('.track').map((el) => {
        const audio = $('audio', el);
        const btn = $('.player__btn', el);
        const seek = $('.player__seek', el);
        const current = $('.player__current', el);
        const duration = $('.player__duration', el);
        const title = $('.track__title', el).textContent;

        const player = { el, audio };

        function syncDuration() {
            if (!Number.isFinite(audio.duration)) return;
            seek.max = Math.floor(audio.duration);
            seek.disabled = false;
            duration.textContent = formatTime(audio.duration);
        }

        function syncPlaying() {
            const playing = !audio.paused;
            el.classList.toggle('is-playing', playing);
            btn.setAttribute('aria-label', `${playing ? 'Pausar' : 'Reproducir'} «${title}»`);
        }

        btn.addEventListener('click', async () => {
            if (!audio.paused) {
                audio.pause();
                return;
            }
            players.forEach((p) => p !== player && p.audio.pause());
            try {
                await audio.play();
            } catch (err) {
                console.warn(`No se pudo reproducir «${title}»:`, err);
            }
        });

        seek.addEventListener('input', () => {
            audio.currentTime = Number(seek.value);
            current.textContent = formatTime(audio.currentTime);
        });

        audio.addEventListener('loadedmetadata', syncDuration);
        audio.addEventListener('durationchange', syncDuration);
        audio.addEventListener('timeupdate', () => {
            seek.value = Math.floor(audio.currentTime);
            current.textContent = formatTime(audio.currentTime);
        });
        audio.addEventListener('play', syncPlaying);
        audio.addEventListener('pause', syncPlaying);
        audio.addEventListener('ended', () => {
            audio.currentTime = 0;
            syncPlaying();
        });

        if (audio.readyState >= 1) syncDuration();
        return player;
    });

    /* ------------------------------------------------------------------
       4. Galería (scroll horizontal con botones)
       ------------------------------------------------------------------ */
    const track = $('.gallery__track');
    const prev = $('.gallery__nav--prev');
    const next = $('.gallery__nav--next');

    if (track && prev && next) {
        const scrollByPage = (dir) => track.scrollBy({
            left: dir * track.clientWidth * 0.8,
            behavior: reduceMotion ? 'auto' : 'smooth',
        });

        const updateNav = () => {
            prev.disabled = track.scrollLeft <= 1;
            next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
        };

        prev.addEventListener('click', () => scrollByPage(-1));
        next.addEventListener('click', () => scrollByPage(1));
        track.addEventListener('scroll', updateNav, { passive: true });
        window.addEventListener('resize', updateNav);
        $$('img', track).forEach((img) => img.addEventListener('load', updateNav));
        updateNav();
    }

    /* ------------------------------------------------------------------
       5. Año del footer
       ------------------------------------------------------------------ */
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
})();
