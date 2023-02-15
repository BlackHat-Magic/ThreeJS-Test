import * as THREE from '/static/js/three.module.js';
import { OrbitControls } from '/static/js/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01,10000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas")
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setX(100);
camera.position.setY(100);
camera.position.setZ(200);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

const skyboxtexture = new THREE.TextureLoader().load('/static/img/8k_stars.jpg');
scene.background = skyboxtexture;

// PRAISE THE SUN \[T]/
const sungeometry = new THREE.SphereGeometry(22.70340, 64, 32)
const suntexture = new THREE.TextureLoader().load("/static/img/2k_sun.jpg")
const sunmaterial = new THREE.MeshBasicMaterial({map: suntexture})
const sun = new THREE.Mesh(sungeometry, sunmaterial)
scene.add(sun);

// Hermes
const mercurygeometry = new THREE.SphereGeometry(0.39615, 32, 16);
const mercurytexture = new THREE.TextureLoader().load("/static/img/2k_mercury.jpg");
const mercurymaterial = new THREE.MeshStandardMaterial({map: mercurytexture});
const mercury = new THREE.Mesh(mercurygeometry, mercurymaterial);
scene.add(mercury);

// Aphrodite
const venusgeometry = new THREE.SphereGeometry(0.94985, 32, 16);
const venustexture = new THREE.TextureLoader().load("/static/img/2.5k_venus.jpg");
const venusmaterial = new THREE.MeshStandardMaterial({map:venustexture});
const venus = new THREE.Mesh(venusgeometry, venusmaterial);
scene.add(venus);

// Gaia
const earthgeometry = new THREE.SphereGeometry(1, 32, 16);
const earthtexture = new THREE.TextureLoader().load("/static/img/2.5k_earth.jpg");
const earthmaterial = new THREE.MeshStandardMaterial({map:earthtexture});
const earth = new THREE.Mesh(earthgeometry, earthmaterial);
scene.add(earth);

// ares
const marsgeometry = new THREE.SphereGeometry(0.53242, 32, 16);
const marstexture = new THREE.TextureLoader().load("/static/img/2.5k_mars.jpg");
const marsmaterial = new THREE.MeshStandardMaterial({map:marstexture});
const mars = new THREE.Mesh(marsgeometry, marsmaterial);
scene.add(mars);

// zeus
const jupitergeometry = new THREE.SphereGeometry(11.3517, 32, 16);
const jupitertexture = new THREE.TextureLoader().load("/static/img/2.5k_jupiter.jpg");
const jupitermaterial = new THREE.MeshStandardMaterial({map:jupitertexture});
const jupiter = new THREE.Mesh(jupitergeometry, jupitermaterial);
scene.add(jupiter);

// Cronus
const saturngeometry = new THREE.SphereGeometry(9.1402, 32, 16);
const saturntexture = new THREE.TextureLoader().load("/static/img/2.5k_saturn.jpg");
const saturnmaterial = new THREE.MeshStandardMaterial({map:saturntexture});
const saturn = new THREE.Mesh(saturngeometry, saturnmaterial);
scene.add(saturn);

// Caelus
const uranusgeometry = new THREE.SphereGeometry(3.97648, 32, 16);
const uranustexture = new THREE.TextureLoader().load("/static/img/2k_uranus.jpg");
const uranusmaterial = new THREE.MeshStandardMaterial({map:uranustexture});
const uranus = new THREE.Mesh(uranusgeometry, uranusmaterial);
scene.add(uranus);

// Poseidon
const neptunegeometry = new THREE.SphereGeometry(3.86046, 32, 16);
const neptunetexture = new THREE.TextureLoader().load("/static/img/2k_neptune.jpg");
const neptunematerial = new THREE.MeshStandardMaterial({map:neptunetexture});
const neptune = new THREE.Mesh(neptunegeometry, neptunematerial);
scene.add(neptune);

// Hades
const plutogeometry = new THREE.SphereGeometry(0.1868, 32, 16);
const plutotexture = new THREE.TextureLoader().load("/static/img/pluto.webp");
const plutomaterial = new THREE.MeshStandardMaterial({map:plutotexture});
const pluto = new THREE.Mesh(plutogeometry, plutomaterial);
scene.add(pluto);

const ambientlight = new THREE.AmbientLight(0xFFEEEE)
//scene.add(ambientlight);

const light = new THREE.PointLight(0xFFEEEE, 1, 10000);
light.position.set(0, 0, 0);
scene.add(light);

var frame = 0;

// 1 second = 1 day
function getRotation (frame, period) {
    // takes period rate in days/rotation
    // 1 second = 7 days
    let rotation = frame / 60 / period * 2 * 3.141592653589793238;
    return(rotation);
}

// orbital radius = 117.30053 * AU
// orbital radius = miles / 792457.552583
// 1 second = 1 day
function orbitalPosition (frame, orbitperiod, parent, radius) {
    // get time in seconds
    let time = frame / 60;
    // how many orbital periods have passed?
    let periodratio = time / orbitperiod;
    // adjust for pi radians
    let piadjusted = periodratio * 2 * 3.141592653589793238;
    // Calculate x, z coordinates
    let posx = Math.cos(piadjusted);
    let posz = Math.sin(piadjusted);
    posx *= radius;
    posz *= radius * -1;
    // Adjust to parent coordinates
    posx += parent.position.x;
    posz += parent.position.z;
    return([posx, posz]);
}

function animate () {
    requestAnimationFrame(animate);

    sun.rotation.y = getRotation(frame, 27);

    mercury.position.x = orbitalPosition(frame, 87.97, sun, 40)[0];
    mercury.rotation.y = getRotation(frame, 59);
    mercury.position.z = orbitalPosition(frame, 87.97, sun, 40)[1];

    venus.position.x = orbitalPosition(frame, 583.92, sun, 60)[0];
    venus.rotation.y = getRotation(frame, -116.75);
    venus.position.z = orbitalPosition(frame, 583.92, sun, 60)[1];

    earth.position.x = orbitalPosition(frame, 365.249, sun, 90)[0];
    earth.rotation.y = getRotation(frame, 1);
    earth.position.z = orbitalPosition(frame, 365.249, sun, 90)[1];

    mars.position.x = orbitalPosition(frame, 686.98, sun, 120)[0];
    mars.rotation.y = getRotation(frame, 1.025957);
    mars.position.z = orbitalPosition(frame, 686.98, sun, 120)[1];

    jupiter.position.x = orbitalPosition(frame, 398.88, sun, 150)[0];
    jupiter.rotation.y = getRotation(frame, 4332.583638);
    jupiter.position.z = orbitalPosition(frame, 398.88, sun, 150)[1];

    saturn.position.x = orbitalPosition(frame, 10759.22, sun, 180)[0];
    saturn.rotation.y = getRotation(frame, 0.44002);
    saturn.position.z = orbitalPosition(frame, 10759.22, sun, 180)[1];

    uranus.position.x = orbitalPosition(frame, 30688, sun, 210)[0];
    uranus.rotation.y = getRotation(frame, 0.71833);
    uranus.position.z = orbitalPosition(frame, 30688, sun, 210)[1];

    neptune.position.x = orbitalPosition(frame, 60195, sun, 240)[0];
    neptune.rotation.y = getRotation(frame, 0.6713);
    neptune.position.y = orbitalPosition(frame, 60195, sun, 240)[1];

    pluto.position.x = orbitalPosition(frame, 90560, sun, 270)[0];
    pluto.rotation.y = getRotation(frame, -6.387230);
    pluto.position.z = orbitalPosition(frame, 90560, sun, 270)[1];

    controls.update();
    renderer.render(scene, camera);
    
    frame++
}

animate();