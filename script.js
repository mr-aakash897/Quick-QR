/** 
 * SENIOR ARCHITECT: NEURAL-QR STUDIO ENGINE 
 * Concept: Persistent Background + Scalable Matrix Generator
 */

class BackgroundEngine {
    constructor() {
        this.canvas = document.getElementById('canvas-bg');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true, 
            alpha: true 
        });
        this.points = null;
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 5;

        // Neural Plexus Geometry
        const geo = new THREE.BufferGeometry();
        const count = 1000;
        const pos = new Float32Array(count * 3);
        for(let i=0; i < count * 3; i++) {
            pos[i] = (Math.random() - 0.5) * 15;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x00f2ff, // Neon Primary
            transparent: true,
            opacity: 0.6
        });

        this.points = new THREE.Points(geo, mat);
        this.scene.add(this.points);

        this.animate();
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.points.rotation.y += 0.0006;
        this.points.rotation.x += 0.0003;
        this.renderer.render(this.scene, this.camera);
    }

    updateColor(hex) {
        this.points.material.color.set(hex);
    }
}

// 1. Initialize Persistent Visuals
const visuals = new BackgroundEngine();

// 2. Initialize QR Engine
// Using 'svg' type is critical here: it prevents canvas conflicts
const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg", 
    data: "https://google.com",
    dotsOptions: { 
        color: "#000000", // Default Matrix Color Black
        type: "extra-rounded" 
    },
    backgroundOptions: { color: "#ffffff" },
    cornersSquareOptions: { 
        color: "#000000", 
        type: "extra-rounded" 
    },
    imageOptions: { crossOrigin: "anonymous", margin: 5 }
});

qrCode.append(document.getElementById("qr-canvas"));

// 3. User Interaction Handlers
document.getElementById('update-btn').addEventListener('click', () => {
    const data = document.getElementById('qr-data').value;
    const color = document.getElementById('qr-color').value;
    const dots = document.getElementById('qr-dots').value;
    const corners = document.getElementById('qr-corners').value;
    const logo = document.getElementById('qr-logo').value;

    qrCode.update({
        data: data || " ",
        dotsOptions: { color: color, type: dots },
        cornersSquareOptions: { color: color, type: corners },
        cornersDotOptions: { color: color, type: corners },
        image: logo || ""
    });
});

// 4. Multi-Format Downloads
document.querySelectorAll('.dl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const ext = btn.getAttribute('data-ext');
        qrCode.download({ name: "neural-matrix", extension: ext });
    });
});

// 5. Theme Persistent Management
const themeBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

themeBtn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    
    root.setAttribute('data-theme', next);
    themeBtn.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    
    // Update background particles to match theme accent
    const pColor = next === 'dark' ? 0x00f2ff : 0x4f46e5;
    visuals.updateColor(pColor);
});