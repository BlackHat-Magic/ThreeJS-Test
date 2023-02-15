import * as THREE from 'https://unpkg.com/three@0.149.0/build/three.module.js'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01,1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas")
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setX(100);
camera.position.setY(100);
camera.position.setZ(200);
renderer.render(scene, camera);

const skyboxtexture = new THREE.TextureLoader().load('/static/img/8k_stars.jpg');
scene.background = skyboxtexture;

const sungeometry = new THREE.SphereGeometry(22.70340, 64, 32)
const suntexture = new THREE.TextureLoader().load("/static/img/2k_sun.jpg")
const sunmaterial = new THREE.MeshBasicMaterial({map: suntexture})
const sun = new THREE.Mesh(sungeometry, sunmaterial)
scene.add(sun);

const mercurygeometry = new THREE.SphereGeometry(0.39615, 32, 16);
const mercurytexture = new THREE.TextureLoader().load("/static/img/2k_mercury.jpg");
const mercurymaterial = new THREE.MeshBasicMaterial({map: mercurytexture});
const mercury = new THREE.Mesh(mercurygeometry, mercurymaterial);
mercury.position.setZ(40);
scene.add(mercury);

const ambientlight = new THREE.AmbientLight(0xFFEEEE)
//scene.add(ambientlight);

const light = new THREE.PointLight(0xFFEEEE, 1, 100);
light.position.set(1, 1, 1);
scene.add(light);

var frame = 0;

function getRotation (frame, period) {
    // takes period rate in days/rotation
    // 1 second = 7 days
    let rotation = frame / 60 / period * 7;
    return(rotation);
}

function animate () {
    requestAnimationFrame(animate);

    sun.rotation.y = getRotation(frame, 27);

    renderer.render(scene, camera);
    
    frame++
}

animate();