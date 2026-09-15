/**
 * Three.js "Digital Garden" Background
 * Simple particles/organic movement for AI ECO
 */
class DigitalGarden {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.init();
        this.animate();

        window.addEventListener('resize', () => this.onResize());
    }

    init() {
        // Particles (Digital Seeds)
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 500; i++) {
            vertices.push(
                THREE.MathUtils.randFloatSpread(50),
                THREE.MathUtils.randFloatSpread(50),
                THREE.MathUtils.randFloatSpread(50)
            );
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        const material = new THREE.PointsMaterial({
            color: 0x0D4D4D,
            size: 0.15,
            transparent: true,
            opacity: 0.6
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        this.camera.position.z = 20;
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.particles.rotation.y += 0.001;
        this.particles.rotation.x += 0.0005;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialise when the script loads
const garden = new DigitalGarden('three-container');
