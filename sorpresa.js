        // ── Sparkles ──
        const hero = document.querySelector('.hero');
        for (let i = 0; i < 30; i++) {
            const s = document.createElement('div');
            s.classList.add('sparkle');
            s.style.left = Math.random() * 100 + '%';
            s.style.top = Math.random() * 100 + '%';
            s.style.animationDuration = (2 + Math.random() * 4) + 's';
            s.style.animationDelay = (Math.random() * 5) + 's';
            hero.appendChild(s);
        }

        // ── Splash + Music autostart ──
        function enterPage() {
            const splash = document.getElementById('splash');
            const audio = document.getElementById('bgMusic');
            audio.volume = 1.0;
            audio.play();

            // Hide splash with animation
            splash.classList.add('hide');
            setTimeout(() => splash.style.display = 'none', 900);

            // Update player UI to playing state
            setTimeout(() => {
                playing = true;
                playBtn.textContent = '❚❚';
                wave.classList.remove('paused');
            }, 800);
        }

        // ── Music player ──
        const audio = document.getElementById('bgMusic');
        const playBtn = document.getElementById('playBtn');
        const wave = document.getElementById('wave');
        let playing = false;

        // Auto-play on load (may be blocked by browser — user must interact first)
        // Music starts via splash interaction above


        function toggleMusic() {
            const audio = document.getElementById('bgMusic');
            if (playing) {
                audio.pause();
                playBtn.textContent = '▶';
                wave.classList.add('paused');
            } else {
                audio.play();
                playBtn.textContent = '❚❚';
                wave.classList.remove('paused');
            }
            playing = !playing;
        }

        // ── Intersection Observer for gallery fade-in ──
        const frames = document.querySelectorAll('.photo-frame');
        const obs = new IntersectionObserver(entries => {
            entries.forEach((e, i) => {
                if (e.isIntersecting) {
                    e.target.style.opacity = '1';
                    e.target.style.transform = [
                        'rotate(-1.5deg)', 'rotate(0.8deg) translateY(-10px)', 'rotate(-0.5deg)'
                    ][i] || 'rotate(0deg)';
                }
            });
        }, { threshold: 0.2 });

        frames.forEach(f => {
            f.style.opacity = '0';
            f.style.transition = 'opacity 0.8s ease, transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
            obs.observe(f);
        });
        // ── Lightbox ──
        const captions = ['Siempre contigo ✦', 'Momentos únicos ✦', 'Mi mundo ✦'];
        let lbIndex = 0;
        let lbImages = [];

        // Collect all photo frame images after DOM is ready
        window.addEventListener('DOMContentLoaded', () => {
            lbImages = Array.from(document.querySelectorAll('.photo-frame img'));

            // Build dots
            const dotsEl = document.getElementById('lbDots');
            lbImages.forEach((_, i) => {
                const d = document.createElement('span');
                d.classList.add('lb-dot');
                if (i === 0) d.classList.add('active');
                d.onclick = () => openLightbox(i);
                dotsEl.appendChild(d);
            });

            // Click on each frame opens lightbox
            document.querySelectorAll('.photo-frame').forEach((frame, i) => {
                frame.addEventListener('click', () => openLightbox(i));
            });
        });

        function openLightbox(index) {
            lbIndex = index;
            const lb = document.getElementById('lightbox');
            const img = document.getElementById('lbImg');
            const cap = document.getElementById('lbCaption');

            img.src = lbImages[index].src;
            cap.textContent = captions[index] || '';
            updateDots();

            lb.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            document.getElementById('lightbox').classList.remove('open');
            document.body.style.overflow = '';
        }

        function navLightbox(dir) {
            lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
            const img = document.getElementById('lbImg');
            const cap = document.getElementById('lbCaption');

            // Slide-out then slide-in
            img.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            img.style.opacity = '0';
            img.style.transform = `translateX(${dir * 40}px)`;

            setTimeout(() => {
                img.src = lbImages[lbIndex].src;
                cap.textContent = captions[lbIndex] || '';
                img.style.transform = `translateX(${-dir * 40}px)`;
                setTimeout(() => {
                    img.style.opacity = '1';
                    img.style.transform = 'translateX(0)';
                }, 20);
            }, 200);

            updateDots();
        }

        function updateDots() {
            document.querySelectorAll('.lb-dot').forEach((d, i) => {
                d.classList.toggle('active', i === lbIndex);
            });
        }

        // Close on overlay click (outside image)
        document.getElementById('lightbox').addEventListener('click', function (e) {
            if (e.target === this) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', e => {
            if (!document.getElementById('lightbox').classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navLightbox(1);
            if (e.key === 'ArrowLeft') navLightbox(-1);
        });

        // Touch swipe support
        let touchStartX = 0;
        document.getElementById('lightbox').addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        });
        document.getElementById('lightbox').addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) navLightbox(diff > 0 ? 1 : -1);
        });
