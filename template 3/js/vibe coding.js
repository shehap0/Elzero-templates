// toggle megamenu for "The Codex" link in header
document.addEventListener('DOMContentLoaded', function () {
	const menuLi = document.querySelector('.header .links li:last-child');
	if (!menuLi) return;

	const toggleLink = menuLi.querySelector('a');
	const megamenu = document.querySelector('.header .megamenu');

	if (!toggleLink || !megamenu) return;

	// accessibility attributes
	toggleLink.setAttribute('aria-haspopup', 'true');
	toggleLink.setAttribute('aria-expanded', 'false');

	// Toggle on click
	toggleLink.addEventListener('click', function (e) {
		e.preventDefault();
		e.stopPropagation();
		const isOpen = menuLi.classList.toggle('mega-open');
		toggleLink.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
	});

	// Prevent clicks inside the megamenu from closing it
	megamenu.addEventListener('click', function (e) {
		e.stopPropagation();
	});

	megamenu.querySelectorAll('a[href^="#"]').forEach(function (link) {
		link.addEventListener('click', function () {
			menuLi.classList.remove('mega-open');
			toggleLink.setAttribute('aria-expanded', 'false');
		});
	});

	// Click outside closes the megamenu
	document.addEventListener('click', function () {
		if (menuLi.classList.contains('mega-open')) {
			menuLi.classList.remove('mega-open');
			toggleLink.setAttribute('aria-expanded', 'false');
		}
	});

	// Escape key closes
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && menuLi.classList.contains('mega-open')) {
			menuLi.classList.remove('mega-open');
			toggleLink.setAttribute('aria-expanded', 'false');
		}
	});

	// --- Interactive tilt/parallax for megamenu image ---
	(function () {
		const imgWrap = megamenu.querySelector('.image');
		const img = imgWrap ? imgWrap.querySelector('img') : null;

		// Respect reduced motion and touch devices
		if (!img || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(hover: none)').matches) return;

		img.classList.add('is-interactive-hover');
		imgWrap.style.perspective = imgWrap.style.perspective || '900px';

		let rafId = null;
		let current = {rx: 0, ry: 0, tx: 0, ty: 0, s: 1};
		let target = {rx: 0, ry: 0, tx: 0, ty: 0, s: 1};
		const ease = 0.12;

		function update() {
			current.rx += (target.rx - current.rx) * ease;
			current.ry += (target.ry - current.ry) * ease;
			current.tx += (target.tx - current.tx) * ease;
			current.ty += (target.ty - current.ty) * ease;
			current.s += (target.s - current.s) * ease;

			img.style.transform = `translate3d(${current.tx}px, ${current.ty}px, 0) rotateX(${current.rx}deg) rotateY(${current.ry}deg) scale(${current.s})`;

			if (Math.abs(target.rx - current.rx) > 0.02 || Math.abs(target.ry - current.ry) > 0.02 || Math.abs(target.tx - current.tx) > 0.2 || Math.abs(target.ty - current.ty) > 0.2 || Math.abs(target.s - current.s) > 0.002) {
				rafId = requestAnimationFrame(update);
			} else {
				rafId = null;
			}
		}

		function onMove(e) {
			const rect = img.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width;
			const y = (e.clientY - rect.top) / rect.height;
			const relX = (x - 0.5) * 2; // -1 .. 1
			const relY = (y - 0.5) * 2; // -1 .. 1

			// three combined effects: tilt (rotate), parallax (translate), subtle scale
			target.ry = relX * 8; // rotateY (deg)
			target.rx = -relY * 8; // rotateX (deg)
			target.tx = relX * 10; // translateX (px)
			target.ty = relY * 8; // translateY (px)
			target.s = 1.04 + Math.min(Math.abs(relX), Math.abs(relY)) * 0.02;

			if (!rafId) rafId = requestAnimationFrame(update);
		}

		function onLeave() {
			target = {rx: 0, ry: 0, tx: 0, ty: 0, s: 1};
			if (!rafId) rafId = requestAnimationFrame(update);
		}

		imgWrap.addEventListener('mousemove', onMove);
		imgWrap.addEventListener('mouseleave', onLeave);

		// touch fallback: no interactive tilt, but allow tap-to-scale via CSS hover class handled elsewhere
	})();

	// Scroll reveal for the citadel sections. Cards stay visible when JS is unavailable.
	const revealItems = document.querySelectorAll('.articles .box, .gallery .box, .features .box, .team .box, .services .box');
	if (revealItems.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		const observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		}, {threshold: 0.15});

		revealItems.forEach(function (item) {
			item.classList.add('reveal');
			observer.observe(item);
		});
	}
});
