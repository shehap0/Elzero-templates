(function () {
	const root = document.querySelector('[data-realm-scene]');
	const canvas = document.getElementById('realm-scene');
	const THREE = window.THREE;

	if (!root || !canvas || !THREE) return;

	let renderer;

	try {
		renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true,
			alpha: true
		});
	} catch (error) {
		return;
	}

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
	camera.position.set(0, 0.35, 6.4);

	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
	renderer.setClearColor(0x000000, 0);

	const relic = new THREE.Group();
	scene.add(relic);

	const metal = new THREE.MeshStandardMaterial({
		color: 0xc9c3b8,
		roughness: 0.34,
		metalness: 0.78
	});
	const darkMetal = new THREE.MeshStandardMaterial({
		color: 0x58514a,
		roughness: 0.42,
		metalness: 0.72
	});
	const gold = new THREE.MeshStandardMaterial({
		color: 0xc5a059,
		roughness: 0.28,
		metalness: 0.65
	});
	const crimson = new THREE.MeshStandardMaterial({
		color: 0x5c1411,
		roughness: 0.62,
		metalness: 0.16
	});

	function shieldShape(scale) {
		const shape = new THREE.Shape();
		shape.moveTo(0, 1.28 * scale);
		shape.bezierCurveTo(0.84 * scale, 1.18 * scale, 1.08 * scale, 0.7 * scale, 0.86 * scale, -0.22 * scale);
		shape.bezierCurveTo(0.62 * scale, -1.08 * scale, 0.22 * scale, -1.48 * scale, 0, -1.62 * scale);
		shape.bezierCurveTo(-0.22 * scale, -1.48 * scale, -0.62 * scale, -1.08 * scale, -0.86 * scale, -0.22 * scale);
		shape.bezierCurveTo(-1.08 * scale, 0.7 * scale, -0.84 * scale, 1.18 * scale, 0, 1.28 * scale);
		return shape;
	}

	const shieldBack = new THREE.Mesh(
		new THREE.ExtrudeGeometry(shieldShape(1.07), {depth: 0.08, bevelEnabled: true, bevelSize: 0.035, bevelThickness: 0.035, bevelSegments: 2}),
		gold
	);
	shieldBack.position.set(0, -0.05, -0.18);
	shieldBack.rotation.z = -0.04;
	relic.add(shieldBack);

	const shieldFace = new THREE.Mesh(
		new THREE.ExtrudeGeometry(shieldShape(0.95), {depth: 0.09, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2}),
		crimson
	);
	shieldFace.position.set(0, -0.04, -0.1);
	shieldFace.rotation.z = -0.04;
	relic.add(shieldFace);

	const shieldBand = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.16, 0.12), gold);
	shieldBand.position.set(0, 0.35, 0.05);
	shieldBand.rotation.z = -0.04;
	relic.add(shieldBand);

	const bladeShape = new THREE.Shape();
	bladeShape.moveTo(0, 1.95);
	bladeShape.lineTo(0.18, 0.36);
	bladeShape.lineTo(0.1, -1.02);
	bladeShape.lineTo(-0.1, -1.02);
	bladeShape.lineTo(-0.18, 0.36);
	bladeShape.lineTo(0, 1.95);
	const blade = new THREE.Mesh(
		new THREE.ExtrudeGeometry(bladeShape, {depth: 0.07, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 2}),
		metal
	);
	blade.position.set(0, 0.34, 0.28);
	relic.add(blade);

	const fuller = new THREE.Mesh(new THREE.BoxGeometry(0.045, 2.15, 0.02), darkMetal);
	fuller.position.set(0, 0.56, 0.34);
	relic.add(fuller);

	const guard = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.14, 0.16), gold);
	guard.position.set(0, -0.72, 0.36);
	relic.add(guard);

	const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.74, 24), darkMetal);
	grip.position.set(0, -1.13, 0.36);
	relic.add(grip);

	const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), gold);
	pommel.position.set(0, -1.56, 0.36);
	pommel.scale.y = 0.78;
	relic.add(pommel);

	const ring = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.012, 8, 96), new THREE.MeshBasicMaterial({color: 0xc5a059, transparent: true, opacity: 0.28}));
	ring.position.set(0, -0.03, -0.32);
	ring.rotation.x = Math.PI / 2;
	scene.add(ring);

	const sparkCount = 70;
	const sparkPositions = new Float32Array(sparkCount * 3);
	const sparkData = [];
	for (let i = 0; i < sparkCount; i++) {
		const radius = 1.25 + Math.random() * 2.1;
		const angle = Math.random() * Math.PI * 2;
		const y = -2.2 + Math.random() * 4.2;
		sparkPositions[i * 3] = Math.cos(angle) * radius;
		sparkPositions[i * 3 + 1] = y;
		sparkPositions[i * 3 + 2] = -1.4 + Math.random() * 1.4;
		sparkData.push({angle: angle, radius: radius, speed: 0.18 + Math.random() * 0.45});
	}
	const sparkGeometry = new THREE.BufferGeometry();
	sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
	const sparks = new THREE.Points(
		sparkGeometry,
		new THREE.PointsMaterial({
			color: 0xe3c07e,
			size: 0.035,
			transparent: true,
			opacity: 0.78,
			depthWrite: false
		})
	);
	scene.add(sparks);

	scene.add(new THREE.AmbientLight(0xe5e1d8, 0.42));
	const key = new THREE.PointLight(0xe3c07e, 1.6, 10);
	key.position.set(-2.6, 2.4, 3.3);
	scene.add(key);
	const ember = new THREE.PointLight(0x8b0000, 1.4, 8);
	ember.position.set(2.4, -1.6, 2.5);
	scene.add(ember);

	const target = {x: 0, y: 0};
	const current = {x: 0, y: 0};
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	root.addEventListener('pointermove', function (event) {
		const rect = root.getBoundingClientRect();
		target.y = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
		target.x = -((event.clientY - rect.top) / rect.height - 0.5) * 0.35;
	});

	root.addEventListener('pointerleave', function () {
		target.x = 0;
		target.y = 0;
	});

	function resize() {
		const width = root.clientWidth;
		const height = root.clientHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height, false);
	}

	if ('ResizeObserver' in window) {
		new ResizeObserver(resize).observe(root);
	} else {
		window.addEventListener('resize', resize);
	}
	resize();

	function render(time) {
		const seconds = time * 0.001;

		current.x += (target.x - current.x) * 0.055;
		current.y += (target.y - current.y) * 0.055;
		relic.rotation.x = current.x + Math.sin(seconds * 0.9) * 0.035;
		relic.rotation.y = current.y + Math.sin(seconds * 0.55) * 0.12;
		relic.rotation.z = Math.sin(seconds * 0.42) * 0.025;
		relic.position.y = Math.sin(seconds * 0.7) * 0.08;
		ring.rotation.z = seconds * 0.18;

		const positions = sparks.geometry.attributes.position.array;
		for (let i = 0; i < sparkCount; i++) {
			const index = i * 3;
			const data = sparkData[i];
			positions[index + 1] += data.speed * 0.018;
			if (positions[index + 1] > 2.15) positions[index + 1] = -2.2;
			positions[index] = Math.cos(data.angle + seconds * 0.22) * data.radius;
			positions[index + 2] = Math.sin(data.angle + seconds * 0.18) * 0.45 - 1.05;
		}
		sparks.geometry.attributes.position.needsUpdate = true;

		renderer.render(scene, camera);
		root.classList.add('scene-ready');

		if (!reduceMotion) requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
})();
