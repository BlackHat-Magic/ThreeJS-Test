import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
    antialias: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const skyboxtexture = new THREE.TextureLoader().load('/static/img/8k_stars.jpg');
scene.background = skyboxtexture;

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.75
);
composer.addPass(bloomPass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

const sungeometry = new THREE.SphereGeometry(22.70340, 64, 32);
const suntexture = new THREE.TextureLoader().load("/static/img/2k_sun.jpg");
const sunmaterial = new THREE.MeshBasicMaterial({ map: suntexture });
const sun = new THREE.Mesh(sungeometry, sunmaterial);
scene.add(sun);

const sunglowgeometry = new THREE.SphereGeometry(25, 32, 16);
const sunglowmaterial = new THREE.MeshBasicMaterial({
    color: 0xffaa33,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide
});
const sunglow = new THREE.Mesh(sunglowgeometry, sunglowmaterial);
scene.add(sunglow);

const planets = [];

function createPlanet(name, radius, texturePath, orbitRadius, orbitPeriod, rotationPeriod) {
    const geometry = new THREE.SphereGeometry(radius, 64, 32);
    const texture = new THREE.TextureLoader().load(texturePath);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8,
        metalness: 0.1
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const orbitLineGeometry = new THREE.BufferGeometry();
    const orbitPoints = [];
    for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        orbitPoints.push(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius * -1);
    }
    orbitLineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
    const orbitLineMaterial = new THREE.LineBasicMaterial({
        color: 0x4c566a,
        transparent: true,
        opacity: 0.2
    });
    const orbitLine = new THREE.Line(orbitLineGeometry, orbitLineMaterial);
    scene.add(orbitLine);

    const planetData = {
        mesh,
        radius,
        orbitRadius,
        orbitPeriod,
        rotationPeriod,
        orbitLine
    };
    planets.push(planetData);
    return planetData;
}

const mercury = createPlanet('mercury', 0.39615, "/static/img/2k_mercury.jpg", 40, 87.97, 59);
const venus = createPlanet('venus', 0.94985, "/static/img/2.5k_venus.jpg", 60, 224.7, -116.75);
const earth = createPlanet('earth', 1, "/static/img/2.5k_earth.jpg", 90, 365.249, 1);
const mars = createPlanet('mars', 0.53242, "/static/img/2.5k_mars.jpg", 120, 686.98, 1.025957);
const jupiter = createPlanet('jupiter', 11.3517, "/static/img/2.5k_jupiter.jpg", 150, 4332.59, 0.41354);
const saturn = createPlanet('saturn', 9.1402, "/static/img/2.5k_saturn.jpg", 180, 10759.22, 0.44002);
const uranus = createPlanet('uranus', 3.97648, "/static/img/2k_uranus.jpg", 210, 30688, 0.71833);
const neptune = createPlanet('neptune', 3.86046, "/static/img/2k_neptune.jpg", 240, 60190, 0.6713);
const pluto = createPlanet('pluto', 0.1868, "/static/img/pluto.webp", 270, 90560, -6.387230);

const saturnRingGeometry = new THREE.RingGeometry(11, 18, 64);
const saturnRingMaterial = new THREE.MeshBasicMaterial({
    color: 0xc4b696,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6
});
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.x = Math.PI / 2.5;
scene.add(saturnRing);

const uranusRingGeometry = new THREE.RingGeometry(5, 6.5, 64);
const uranusRingMaterial = new THREE.MeshBasicMaterial({
    color: 0x88aacc,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.25
});
const uranusRing = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);
uranusRing.rotation.x = Math.PI / 2;
uranusRing.rotation.z = Math.PI / 12;
scene.add(uranusRing);

const ambientlight = new THREE.AmbientLight(0x404060, 0.15);
scene.add(ambientlight);

const light = new THREE.PointLight(0xfff5e6, 2, 10000, 0.5);
light.position.set(0, 0, 0);
scene.add(light);

const dustParticleCount = 5000;
const dustGeometry = new THREE.BufferGeometry();
const dustPositions = new Float32Array(dustParticleCount * 3);
const dustSizes = new Float32Array(dustParticleCount);
for (let i = 0; i < dustParticleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 30 + Math.random() * 280;
    dustPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    dustPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    dustSizes[i] = Math.random() * 1.5 + 0.5;
}
dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
dustGeometry.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));

const dustMaterial = new THREE.PointsMaterial({
    color: 0xaabbcc,
    size: 0.3,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
scene.add(dustParticles);

const asteroidBeltCount = 2000;
const asteroidGeometry = new THREE.BufferGeometry();
const asteroidPositions = new Float32Array(asteroidBeltCount * 3);
for (let i = 0; i < asteroidBeltCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 130 + Math.random() * 15;
    asteroidPositions[i * 3] = Math.cos(angle) * r;
    asteroidPositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
    asteroidPositions[i * 3 + 2] = Math.sin(angle) * r * -1;
}
asteroidGeometry.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
const asteroidMaterial = new THREE.PointsMaterial({
    color: 0x888888,
    size: 0.4,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true
});
const asteroidBelt = new THREE.Points(asteroidGeometry, asteroidMaterial);
scene.add(asteroidBelt);

var frame = 0;

function getRotation(frame, period) {
    let rotation = frame / 3600 / period * 2 * Math.PI;
    return rotation;
}

function orbitalPosition(frame, orbitperiod, parent, radius) {
    let time = frame / 60;
    let periodratio = time / orbitperiod;
    let piadjusted = periodratio * 2 * Math.PI;
    let posx = Math.cos(piadjusted) * radius;
    let posz = Math.sin(piadjusted) * radius * -1;
    posx += parent.position.x;
    posz += parent.position.z;
    return [posx, posz];
}

function cameraOffset(position, radius) {
    const distance = Math.max(radius * 4, 8);
    const height = radius * 1.5 + 3;

    const magnitude = Math.sqrt(position.x * position.x + position.z * position.z);
    if (magnitude < 0.001) {
        return { x: distance, y: height, z: distance };
    }

    const radialX = position.x / magnitude;
    const radialZ = position.z / magnitude;

    const perpX = -radialZ;
    const perpZ = radialX;

    const angle = 0.5;
    const offsetDistance = distance;

    return {
        x: position.x + (radialX * Math.cos(angle) + perpX * Math.sin(angle)) * offsetDistance,
        y: height,
        z: position.z + (radialZ * Math.cos(angle) + perpZ * Math.sin(angle)) * offsetDistance
    };
}

function easeCubicBezier(progress) {
    const curve = new THREE.CubicBezierCurve(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.25, 0.1),
        new THREE.Vector2(0.25, 1),
        new THREE.Vector2(1, 1)
    );
    return curve.getPoint(THREE.MathUtils.clamp(progress, 0, 1)).y;
}

function bezierTransition(start, end, progress) {
    const a = new THREE.Vector3(start.x, start.y, start.z);
    const c = new THREE.Vector3(end.x, end.y, end.z);
    const midX = (start.x + end.x) / 2;
    const midZ = (start.z + end.z) / 2;
    const liftY = Math.max(Math.hypot(end.x - start.x, end.z - start.z) * 0.3, 10);
    const b = new THREE.Vector3(midX, liftY, midZ);
    const curve = new THREE.QuadraticBezierCurve3(a, b, c);
    const p = curve.getPoint(THREE.MathUtils.clamp(progress, 0, 1));
    return { x: p.x, y: p.y, z: p.z };
}

function getSectionBounds(id) {
    const el = document.querySelector(`#${id}`);
    if (!el) return { top: 0, bottom: 0 };
    const bodyTop = document.body.getBoundingClientRect().top;
    return {
        top: el.getBoundingClientRect().top - bodyTop - 600,
        bottom: el.getBoundingClientRect().bottom - bodyTop
    };
}

let currentFocusIndex = -1;
let targetCameraPos = { x: 60, y: 20, z: 60 };
let currentCameraPos = { x: 60, y: 20, z: 60 };
let targetLookAt = new THREE.Vector3(0, 0, 0);
let currentLookAt = new THREE.Vector3(0, 0, 0);

function moveCamera() {
    const position = document.body.getBoundingClientRect().top * -1;

    const sections = [
        { id: 'mercury', planet: mercury },
        { id: 'venus', planet: venus },
        { id: 'earth', planet: earth },
        { id: 'mars', planet: mars },
        { id: 'jupiter', planet: jupiter },
        { id: 'saturn', planet: saturn },
        { id: 'uranus', planet: uranus },
        { id: 'neptune', planet: neptune },
        { id: 'pluto', planet: pluto }
    ];

    const bounds = sections.map(s => ({ ...getSectionBounds(s.id), planet: s.planet }));

    let newFocusIndex = -1;
    let newTargetPos = { x: 60, y: 20, z: 60 };
    let newLookAt = new THREE.Vector3(0, 0, 0);

    if (position < bounds[0].top) {
        const progress = easeCubicBezier(1 - (bounds[0].top - position) / bounds[0].top);
        const startPos = { x: 60, y: 20, z: 60 };
        const endPos = cameraOffset(bounds[0].planet.mesh.position, bounds[0].planet.radius);
        newTargetPos = bezierTransition(startPos, endPos, progress);
        newLookAt.set(0, 0, 0);
    } else {
        for (let i = 0; i < bounds.length; i++) {
            if (position >= bounds[i].top && position < bounds[i].bottom) {
                newFocusIndex = i;
                newTargetPos = cameraOffset(bounds[i].planet.mesh.position, bounds[i].planet.radius);
                newLookAt.copy(bounds[i].planet.mesh.position);
                break;
            } else if (i < bounds.length - 1 && position >= bounds[i].bottom && position < bounds[i + 1].top) {
                const progress = easeCubicBezier(
                    1 - (bounds[i + 1].top - position) / (bounds[i + 1].top - bounds[i].bottom)
                );
                const startPos = cameraOffset(bounds[i].planet.mesh.position, bounds[i].planet.radius);
                const endPos = cameraOffset(bounds[i + 1].planet.mesh.position, bounds[i + 1].planet.radius);
                newTargetPos = bezierTransition(startPos, endPos, progress);
                const midLookAt = new THREE.Vector3().lerpVectors(
                    bounds[i].planet.mesh.position,
                    bounds[i + 1].planet.mesh.position,
                    progress
                );
                newLookAt.copy(midLookAt);
                break;
            }
        }
    }

    if (newFocusIndex === -1 && position >= bounds[bounds.length - 1].bottom) {
        const lastPlanet = bounds[bounds.length - 1].planet;
        newTargetPos = cameraOffset(lastPlanet.mesh.position, lastPlanet.radius);
        newLookAt.copy(lastPlanet.mesh.position);
    }

    const smoothing = 0.05;
    currentCameraPos.x += (newTargetPos.x - currentCameraPos.x) * smoothing;
    currentCameraPos.y += (newTargetPos.y - currentCameraPos.y) * smoothing;
    currentCameraPos.z += (newTargetPos.z - currentCameraPos.z) * smoothing;

    currentLookAt.lerp(newLookAt, smoothing);

    camera.position.set(currentCameraPos.x, currentCameraPos.y, currentCameraPos.z);
    camera.lookAt(currentLookAt);
}

function animate() {
    requestAnimationFrame(animate);

    sun.rotation.y = getRotation(frame, 27);
    const pulse = 1 + Math.sin(frame * 0.02) * 0.02;
    sunglow.scale.set(pulse, pulse, pulse);

    planets.forEach(p => {
        const pos = orbitalPosition(frame, p.orbitPeriod, sun, p.orbitRadius);
        p.mesh.position.x = pos[0];
        p.mesh.position.z = pos[1];
        p.mesh.rotation.y = getRotation(frame, p.rotationPeriod);
    });

    saturnRing.position.copy(saturn.mesh.position);
    uranusRing.position.copy(uranus.mesh.position);

    asteroidBelt.rotation.y = frame * 0.00002;

    composer.render();
    frame++;
    moveCamera();
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    bloomPass.resolution.set(window.innerWidth, window.innerHeight);
});

animate();
