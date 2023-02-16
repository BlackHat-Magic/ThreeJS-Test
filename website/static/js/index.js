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

function moveCamera () {
    //get how far down the user has scrolled
    let position = document.body.getBoundingClientRect().top * -1;

    //get positions of planet descriptions relative to document body
    let hermes = document.querySelector("#mercury").getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    let aphrodite = document.querySelector("#venus").getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    let gaia = document.querySelector("#earth").getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    let ares = document.querySelector("#mars").getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    let zeus = document.querySelector("#jupiter").getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    let cronus = document.querySelector("#saturn").getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    let caelus = document.querySelector("#uranus").getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    let poseidon = document.querySelector("#neptune").getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    let demeter = document.querySelector("#ceres").getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    let discordia = document.querySelector("#eris").getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    let hades = document.querySelector("#pluto").getBoundingClientRect().top - document.body.getBoundingClientRect().top;

    let progress = 0;
    let distance = {
        x: 0,
        y: 0,
        z: 0
    }

    if(position < hermes) {
        // figure out how far between two planet descriptions the user is (scaled to between 0 and 1)
        progress = 1 - (hermes - position) / hermes;

        // get distance between planets on each axis, then interpolate where the position should be based on how far scrolled the user is
        distance.x = (mercury.position.x - sun.position.x) * progress;
        distance.y = (mercury.position.y - sun.position.y) * progress;
        distance.z = (mercury.position.z - sun.position.z) * progress;

        // set camera position
        camera.position.setX(sun.position.x + distance.x);
        camera.position.setY(sun.position.y + distance.y);
        camera.position.setZ(sun.position.z + distance.z);
    } else if (position < aphrodite) {
        progress = 1 - (aphrodite - position) / (aphrodite - hermes);

        distance.x = (venus.position.x - mercury.position.x) * progress;
        distance.y = (venus.position.y - mercury.position.y) * progress;
        distance.z = (venus.position.z - mercury.position.z) * progress;

        camera.position.setX(mercury.position.x + distance.x);
        camera.position.setY(mercury.position.y + distance.y);
        camera.position.setZ(mercury.position.z + distance.z);
    } else if (position < gaia) {
        progress = 1 - (gaia - position) / (gaia - aphrodite);

        distance.x = (earth.position.x - venus.position.x) * progress;
        distance.y = (earth.position.y - venus.position.y) * progress;
        distance.z = (earth.position.z - venus.position.z) * progress;

        camera.position.setX(venus.position.x + distance.x);
        camera.position.setY(venus.position.y + distance.y);
        camera.position.setZ(venus.position.z + distance.z);
    } else if (position < ares) {
        progress = 1 - (ares - position) / (ares - gaia);

        distance.x = (mars.position.x - earth.position.x) * progress;
        distance.y = (mars.position.y - earth.position.y) * progress;
        distance.z = (mars.position.z - earth.position.z) * progress;

        camera.position.setX(earth.position.x + distance.x);
        camera.position.setY(earth.position.y + distance.y);
        camera.position.setZ(earth.position.z + distance.z);
    } else if (position < zeus) {
        progress = 1 - (zeus - position) / (zeus - ares);

        distance.x = (jupiter.position.x - mars.position.x) * progress;
        distance.y = (jupiter.position.y - mars.position.y) * progress;
        distance.z = (jupiter.position.z - mars.position.z) * progress;

        camera.position.setX(mars.position.x + distance.x);
        camera.position.setY(mars.position.y + distance.y);
        camera.position.setZ(mars.position.z + distance.z);
    } else if (position < cronus) {
        progress = 1 - (cronus - position) / (cronus - zeus);

        distance.x = (saturn.position.x - jupiter.position.x) * progress;
        distance.y = (saturn.position.y - jupiter.position.y) * progress;
        distance.z = (saturn.position.z - jupiter.position.z) * progress;

        camera.position.setX(jupiter.position.x + distance.x);
        camera.position.setY(jupiter.position.y + distance.y);
        camera.position.setZ(jupiter.position.z + distance.z);
    } else if (position < caelus) {
        progress = 1 - (caelus - position) / (caelus - cronus);

        distance.x = (uranus.position.x - saturn.position.x) * progress;
        distance.y = (uranus.position.y - saturn.position.y) * progress;
        distance.z = (uranus.position.z - saturn.position.z) * progress;

        camera.position.setX(saturn.position.x + distance.x);
        camera.position.setY(saturn.position.y + distance.y);
        camera.position.setZ(saturn.position.z + distance.z);
    } else if (position < poseidon) {
        progress = 1 - (poseidon - position) / (poseidon - caelus);

        distance.x = (neptune.position.x - uranus.position.x) * progress;
        distance.y = (neptune.position.y - uranus.position.y) * progress;
        distance.z = (neptune.position.z - uranus.position.z) * progress;

        camera.position.setX(uranus.position.x + distance.x);
        camera.position.setY(uranus.position.y + distance.y);
        camera.position.setZ(uranus.position.z + distance.z);
    }
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

    moveCamera();
}

animate();