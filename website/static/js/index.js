import * as THREE from './three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01,10000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas")
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

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

const ambientlight = new THREE.AmbientLight(0xFFEEEE, 0.1)
scene.add(ambientlight);

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

function cameraOffset (position, radius, leftright) {
    let magnitude = Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.z, 2));


    let unitvector = {
        x: position.x / magnitude,
        y: 0,
        z: position.z / magnitude
    }

    let offset = {
        x: position.x + unitvector.x * radius * 2,
        y: 0,
        z: position.z + unitvector.z * radius * 2
    }
    offset.x += unitvector.z;
    offset.z += unitvector.x;

    return(offset);
}

function quadraticBezier (a, b, c, progress) {
    // vectors from a to b and b to c
    let ab = {
        x: b.x - a.x,
        y: b.y - a.y,
        z: b.z - a.z
    }
    let bc = {
        x: c.x - b.x,
        y: c.y - b.y,
        z: c.z - b.z
    }

    // position along ab and bc vectors
    let interab = {
        x: a.x + ab.x * progress,
        y: a.y + ab.y * progress,
        z: a.z + ab.z * progress
    }
    let interbc = {
        x: b.x + bc.x * progress,
        y: b.y + bc.y * progress,
        z: b.z + bc.z * progress
    }

    // vector between positions along ab and bc vectors
    let connector = {
        x: interbc.x - interab.x,
        y: interbc.y - interab.y,
        z: interbc.z - interab.z
    }

    // position along connecting vector
    let result = {
        x: interab.x + connector.x * progress,
        y: interab.y + connector.y * progress,
        z: interab.z + connector.z * progress
    }

    return(result);
}

function cubicBezier (a, b, c, d, progress) { 
    let ab = {
        x: b.x - a.x,
        y: b.y - a.y,
        z: b.z - a.z
    }
    let bc = {
        x: c.x - b.x,
        y: c.y - b.y,
        z: c.z - b.z
    }
    let cd = {
        x: d.x - c.x,
        y: d.y - c.y,
        z: d.z - c.z
    }

    let interab = {
        x: a.x + ab.x * progress,
        y: a.y + ab.y * progress,
        z: a.z + ab.z * progress
    }
    let interbc = {
        x: b.x + bc.x * progress,
        y: b.y + bc.y * progress,
        z: b.z + bc.z * progress
    }
    let intercd = {
        x: c.x + cd.x * progress,
        y: c.y + cd.y * progress,
        z: c.z + cd.z * progress
    }

    let connectorabbc = {
        x: interbc.x - interab.x,
        y: interbc.y - interab.y,
        z: interbc.z - interab.z
    }
    let connectorbccd = {
        x: intercd.x - interbc.x,
        y: intercd.y - interbc.y,
        z: intercd.z - interbc.z
    }

    let interabbc = {
        x: interab.x + connectorabbc.x * progress,
        y: interab.y + connectorabbc.y * progress,
        z: interab.z + connectorabbc.z * progress
    }
    let interbccd = {
        x: interbc.x + connectorbccd.x * progress,
        y: interbc.y + connectorbccd.y * progress,
        z: interbc.z + connectorbccd.z * progress
    }

    let connector = {
        x: interbccd.x - interabbc.x,
        y: interbccd.y - interabbc.y,
        z: interbccd.z - interabbc.z
    }

    let result = {
        x: interabbc.x + connector.x * progress,
        y: interabbc.y + connector.y * progress,
        z: interabbc.z + connector.z * progress
    }

    return(result);
}

function bezierTransition (start, end, progress) {
    let output = quadraticBezier (
        start,
        {
            x: (start.x + end.x) / 2,
            y: Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.z - start.z, 2)),
            z: (start.z + end.z) / 2
        },
        end,
        progress
    )
    return(output);
}

function moveCamera () {
    //get how far down the user has scrolled
    let position = document.body.getBoundingClientRect().top * -1;

    //get positions of planet descriptions relative to document body
    let hermes = {
        top: 1 * (document.querySelector("#mercury").getBoundingClientRect().top - document.body.getBoundingClientRect().top) - 600,
        bottom: document.querySelector("#mercury").getBoundingClientRect().bottom - document.body.getBoundingClientRect().top
    }
    let aphrodite = {
        top: 1 * (document.querySelector("#venus").getBoundingClientRect().top - document.body.getBoundingClientRect().top) - 600,
        bottom: document.querySelector("#venus").getBoundingClientRect().bottom - document.body.getBoundingClientRect().top
    };
    let gaia = {
        top: 1 * (document.querySelector("#earth").getBoundingClientRect().top - document.body.getBoundingClientRect().top) - 600,
        bottom: document.querySelector("#earth").getBoundingClientRect().bottom - document.body.getBoundingClientRect().top
    };
    let ares = {
        top: 1 * (document.querySelector("#mars").getBoundingClientRect().top - document.body.getBoundingClientRect().top) - 600,
        bottom: document.querySelector("#mars").getBoundingClientRect().bottom - document.body.getBoundingClientRect().top
    };
    let zeus = {
        top: 1 * (document.querySelector("#jupiter").getBoundingClientRect().top - document.body.getBoundingClientRect().top) - 600,
        bottom: document.querySelector("#jupiter").getBoundingClientRect().bottom - document.body.getBoundingClientRect().top
    };
    let cronus = {
        top: 1 * (document.querySelector("#saturn").getBoundingClientRect().top - document.body.getBoundingClientRect().top) - 600,
        bottom: document.querySelector("#saturn").getBoundingClientRect().bottom - document.body.getBoundingClientRect().top
    };
    let caelus = {
        top: 1 * (document.querySelector("#uranus").getBoundingClientRect().top - document.body.getBoundingClientRect().top) - 600,
        bottom: document.querySelector("#uranus").getBoundingClientRect().bottom - document.body.getBoundingClientRect().top
    };
    let poseidon = {
        top: 1 * (document.querySelector("#neptune").getBoundingClientRect().top - document.body.getBoundingClientRect().top) - 600,
        bottom: document.querySelector("#neptune").getBoundingClientRect().bottom - document.body.getBoundingClientRect().top
    };
    let demeter = document.querySelector("#ceres").getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    let discordia = document.querySelector("#eris").getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    let hades = document.querySelector("#pluto").getBoundingClientRect().top - document.body.getBoundingClientRect().top;

    let oldprogress = 0;
    let progress = 0

    if(position < hermes.top) {
        // figure out how far between two planet descriptions the user is (scaled to between 0 and 1)
        oldprogress = 1 - (hermes.top - position) / hermes.top;
        progress = cubicBezier(
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 100,
                z: 0
            },
            {
                x: 1,
                y: 100,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            oldprogress
        ).x

        // set camera position
        let camerapos = bezierTransition({x: 60, y: 20, z: 60}, cameraOffset(mercury.position, 0.39615, 1), progress);

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < hermes.bottom) {
        let camerapos = cameraOffset(mercury.position, 0.39615, 1);

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < aphrodite.top) {
        oldprogress = 1 - (aphrodite.top - position) / (aphrodite.top - hermes.bottom);
        progress = cubicBezier(
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 100,
                z: 0
            },
            {
                x: 1,
                y: 100,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            oldprogress
        ).x

        let camerapos = bezierTransition(cameraOffset(mercury.position, 0.39615, 1), cameraOffset(venus.position, 0.94985, 1), progress);

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < aphrodite.bottom) {
        let camerapos = cameraOffset(venus.position, 0.94985, 1);

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < gaia.top) {
        oldprogress = 1 - (gaia.top - position) / (gaia.top - aphrodite.bottom);
        progress = cubicBezier(
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            oldprogress
        ).x

        let camerapos = bezierTransition(cameraOffset(venus.position, 0.94985, 1), cameraOffset(earth.position, 1, 1), progress);

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < gaia.bottom) {
        let camerapos = cameraOffset(earth.position, 1, 1);

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < ares.top) {
        oldprogress = 1 - (ares.top - position) / (ares.top - gaia.bottom);
        progress = cubicBezier(
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            oldprogress
        ).x

        let camerapos = bezierTransition(cameraOffset(earth.position, 1, 1), cameraOffset(mars.position, 0.53242, 1), progress);

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < ares.bottom) {
        let camerapos = cameraOffset(mars.position, 0.53242, 1)

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < zeus.top) {
        oldprogress = 1 - (zeus.top - position) / (zeus.top - ares.bottom);
        progress = cubicBezier(
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            oldprogress
        ).x

        let camerapos = bezierTransition(cameraOffset(mars.position, 0.53242, 1), cameraOffset(jupiter.position, 11.3517, 1), progress);

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < zeus.bottom) {
        let camerapos = cameraOffset(jupiter.position, 11.3517, 1)

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < cronus.top) {
        oldprogress = 1 - (cronus.top - position) / (cronus.top - zeus.bottom);
        progress = cubicBezier(
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            oldprogress
        ).x

        let camerapos = bezierTransition(cameraOffset(jupiter.position, 11.3517, 1), cameraOffset(saturn.position, 9.1402, 1), progress);

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < cronus.bottom) {
        let camerapos = cameraOffset(saturn.position, 9.1402, 1)

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < caelus.top) {
        oldprogress = 1 - (caelus.top - position) / (caelus.top - cronus.bottom);
        progress = cubicBezier(
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            oldprogress
        ).x

        let camerapos = bezierTransition(cameraOffset(saturn.position, 9.1402, 1), cameraOffset(uranus.position, 3.97648, 1), progress);

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < caelus.bottom) {
        let camerapos = cameraOffset(uranus.position, 3.97648, 1)

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < poseidon.top) {
        oldprogress = 1 - (poseidon.top - position) / (poseidon.top - caelus.bottom);
        progress = cubicBezier(
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            oldprogress
        ).x

        let camerapos = bezierTransition(cameraOffset(uranus.position, 3.97648, 1), cameraOffset(neptune.position, 3.86046, 1), progress);

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    } else if (position < poseidon.bottom) {
        let camerapos = cameraOffset(neptune.position, 3.86046, 1)

        camera.position.setX(camerapos.x);
        camera.position.setY(camerapos.y);
        camera.position.setZ(camerapos.z);
    }

    camera.lookAt(new THREE.Vector3(0, 0, 0))
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

    renderer.render(scene, camera);
    
    frame++

    moveCamera();
}

animate();