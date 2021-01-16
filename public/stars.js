import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });
let velocity = .01;

window.addEventListener("load", init);

function init() {
    let rot = 0;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xaaaaaa, 50, 2000);

    const camera = new THREE.PerspectiveCamera(50, 1000);
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
        star.x = THREE.Math.randFloatSpread(2000);
        star.y = THREE.Math.randFloatSpread(80);
        star.z = THREE.Math.randFloatSpread(2000);

        geometry.vertices.push(star)
    }
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        map: sprite,
        transparent: true, // make the material transparent
        // alphaTest: 0.5,
        blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(geometry, material);
    scene.add(starField);

    // let renderRequested = false;
    function render() {
        rot += velocity;
        const radian = (rot * Math.PI) / 180;
        camera.position.x = 1000 * Math.sin(radian);
        camera.position.z = 1000 * Math.cos(radian);
        camera.lookAt(new THREE.Vector3(100, 0, 0));

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