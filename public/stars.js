import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#c');
const scrollable = document.querySelector('#scrollable');
const renderer = new THREE.WebGLRenderer({ 
    canvas,
    alpha: true, // lets CSS background through
});



window.addEventListener("load", init);

// Standard Normal variate using Box-Muller transform.
function randn_bm() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function init() {
    let rot = 0;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xaaaaaa, 50, 2000);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 5000);
    const geometry = new THREE.Geometry();

    // const controls = new OrbitControls(camera, canvas);
    // controls.enableDamping = true;
    // controls.enablePan = false;
    // controls.minDistance = 1.2;
    // controls.maxDistance = 4;
    // controls.update();

    const sprite = new THREE.TextureLoader().load('disc.png');

    for (let i = 0; i < 10000; i++) {
        const star = new THREE.Vector3();
        // let randx = THREE.Math.randFloatSpread(2000)
        star.x = randn_bm() * 300;
        // star.y = THREE.Math.randFloatSpread(80);
        star.y = randn_bm() * 40;
        star.z = randn_bm() * 330;
        geometry.vertices.push(star)
    }

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 3,
        map: sprite,
        transparent: true, // make the material transparent
        // alphaTest: 0.5,
        blending: THREE.AdditiveBlending,
    });

    const constellations = [];
    for (let i = 0; i < 80; i++) {
        const star = new THREE.Vector3(); 
        let theta = THREE.Math.randFloat(0, 2*Math.PI);
        let zval = THREE.Math.randFloat(750, 850);
        star.x = Math.cos(theta) * zval;
        star.y = randn_bm() * 40; 
        star.z = Math.sin(theta) * zval;
        let neighbours = [star];
        for (let j = 0; j < 6; j++) {
            const neighbour = new THREE.Vector3(); 
            neighbour.x = star.x + THREE.Math.randFloatSpread(40);
            neighbour.y = star.y + THREE.Math.randFloatSpread(40);
            neighbour.z = star.z + THREE.Math.randFloatSpread(30);
            neighbours.push(neighbour);
        }
        constellations.push(neighbours);
    }

    constellations.forEach(( pointList ) => {
        pointList.forEach(( point ) => {
            geometry.vertices.push(point);
        });
    });
    
    const starField = new THREE.Points(geometry, material);
    scene.add(starField);

    const linematerial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true, // make the material transparent
        // alphaTest: 0.5,
        blending: THREE.AdditiveBlending,
        // make this more transparent ?
    });

    constellations.forEach((constellation) => { 
        const linegeometry = new THREE.BufferGeometry().setFromPoints(constellation);
        const lines = new THREE.Line(linegeometry, linematerial);
        scene.add(lines);    
    });

    // let renderRequested = false;
    function render() {
        TWEEN.update()
        rot += velocity.v;
        const radian = (rot * Math.PI) / 180;
        camera.position.x = 1000 * Math.sin(radian);
        camera.position.z = 1000 * Math.cos(radian);
        const dy = (camera.position.y - (-scrollable.scrollTop));
        camera.position.y = -scrollable.scrollTop + 0.99*dy;
        camera.lookAt(new THREE.Vector3(100, 0, 50));

        // controls.update();
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    render();

    window.addEventListener("resize", onResize);

    function onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    onResize();

    // function requestRenderIfNotRequested() {
    //     if (!renderRequested) {
    //         renderRequested = true;
    //         requestAnimationFrame(render);
    //     }
    // }

    // controls.addEventListener('change', requestRenderIfNotRequested);
}