/* ===== script.js — Portfolio Hoàn Nguyễn ===== */

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
        animateStats();
        animateTechBars();
        displayHighScore();
    }, 800);
});

// ===== DISPLAY HIGH SCORE =====
function displayHighScore() {
    const homeHi = document.getElementById('homeHighScore');
    if (homeHi) {
        const score = localStorage.getItem('codeCatcherHi') || '0';
        homeHi.textContent = score;
    }
}

// ===== AOS INIT =====
AOS.init({ duration: 800, easing: 'ease-out-cubic', once: false, mirror: true, offset: 80 });

// ===== CUSTOM CURSOR =====
const dot = document.getElementById('cursorDot');
const outline = document.getElementById('cursorOutline');
let mouseX = 0, mouseY = 0, outX = 0, outY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
});
function animateCursor() {
    outX += (mouseX - outX) * 0.15; outY += (mouseY - outY) * 0.15;
    outline.style.left = outX + 'px'; outline.style.top = outY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effect on interactive elements
document.querySelectorAll('a, button, .tech-card, .project-card, .hobby-tag').forEach(el => {
    el.addEventListener('mouseenter', () => {
        outline.style.width = '56px'; outline.style.height = '56px';
        outline.style.borderColor = 'var(--accent2)';
    });
    el.addEventListener('mouseleave', () => {
        outline.style.width = '36px'; outline.style.height = '36px';
        outline.style.borderColor = 'var(--accent)';
    });
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active link on scroll
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;
    sections.forEach(sec => {
        const top = sec.offsetTop, height = sec.offsetHeight, id = sec.id;
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// ===== TYPING EFFECT =====
const roles = ['AI Engineer', 'Machine Learning Developer', 'Data Scientist', 'Software Engineer', 'Problem Solver'];
let roleIdx = 0, charIdx = 0, isDeleting = false;
const typingEl = document.getElementById('typingText');

function typeEffect() {
    const current = roles[roleIdx];
    typingEl.textContent = current.substring(0, charIdx);

    if (!isDeleting) {
        charIdx++;
        if (charIdx > current.length) { isDeleting = true; setTimeout(typeEffect, 1500); return; }
    } else {
        charIdx--;
        if (charIdx === 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    }
    setTimeout(typeEffect, isDeleting ? 40 : 80);
}
typeEffect();

// ===== STAT COUNTER =====
function animateStats() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = +el.dataset.count;
        let count = 0;
        const step = () => {
            count += Math.ceil(target / 40);
            if (count >= target) { el.textContent = target; return; }
            el.textContent = count;
            requestAnimationFrame(step);
        };
        step();
    });
}

// ===== TECH BARS ANIMATION =====
function animateTechBars() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.tech-bar').forEach(bar => {
                    bar.style.width = bar.dataset.width;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    const techSection = document.getElementById('techstack');
    if (techSection) observer.observe(techSection);
}

// ===== PROJECT FILTERS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
            const category = card.dataset.category;
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden-card');
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.classList.add('hidden-card');
            }
        });
    });
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-submit span');
    btn.textContent = 'Đã gửi! ✓';
    setTimeout(() => { btn.textContent = 'Gửi tin nhắn'; e.target.reset(); }, 2500);
});

// ===== THREE.JS PARTICLE BACKGROUND =====
(function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Particles
    const particleCount = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 80;
        positions[i3 + 1] = (Math.random() - 0.5) * 80;
        positions[i3 + 2] = (Math.random() - 0.5) * 80;
        // Color: mix of accent purple and cyan
        const mix = Math.random();
        colors[i3] = 0.42 * (1 - mix) + 0 * mix;       // R
        colors[i3 + 1] = 0.39 * (1 - mix) + 0.83 * mix; // G
        colors[i3 + 2] = 1 * (1 - mix) + 1 * mix;       // B
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.15, vertexColors: true, transparent: true,
        opacity: 0.7, sizeAttenuation: true
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating icosahedron wireframe
    const icoGeo = new THREE.IcosahedronGeometry(6, 1);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0x6c63ff, wireframe: true, transparent: true, opacity: 0.12
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    scene.add(icosahedron);

    // Mouse interaction
    let targetX = 0, targetY = 0;
    document.addEventListener('mousemove', e => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.0005;
        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;
        icosahedron.rotation.x = time * 0.4 + targetY * 0.3;
        icosahedron.rotation.y = time * 0.6 + targetX * 0.3;
        camera.position.x += (targetX * 2 - camera.position.x) * 0.02;
        camera.position.y += (-targetY * 2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    animate();
})();

// ===== GSAP SCROLL ANIMATIONS =====
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: { trigger: title, start: 'top 85%' },
            y: 30, opacity: 0, duration: 0.8
        });
    });
}

// ===== SMOOTH SCROLL FOR HERO BUTTON =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
