import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });

// const fov = 75;
// const aspect = 2;  // the canvas default
// const near = 0.1;
// const far = 5;
// const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// camera.position.z = 2;

// const scene = new THREE.Scene();

// {
//     const color = 0xFFFFFF;
//     const intensity = 1;
//     const light = new THREE.DirectionalLight(color, intensity);
//     light.position.set(-1, 2, 4);
//     scene.add(light);
// }

// const boxWidth = .75;
// const boxHeight = .75;
// const boxDepth = .75;
// const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

// function makeInstance(geometry, color, x) {
//     const material = new THREE.MeshPhongMaterial({ color });

//     const cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);

//     cube.position.x = x;

//     return cube;
// }

// const cubes = [
//     makeInstance(geometry, 0x44aa88, 0),
//     makeInstance(geometry, 0x8844aa, -2),
//     makeInstance(geometry, 0xaa8844, 2),
// ];

// function resizeRendererToDisplaySize(renderer) {
//     const canvas = renderer.domElement;
//     const pixelRatio = window.devicePixelRatio;
//     const width = canvas.clientWidth * pixelRatio | 0;
//     const height = canvas.clientHeight * pixelRatio | 0;
//     const needResize = canvas.width !== width || canvas.height !== height;
//     if (needResize) {
//         renderer.setSize(width, height, false);
//     }
//     return needResize;
// }

// function render(time) {
//     time *= 0.001;

//     if (resizeRendererToDisplaySize(renderer)) {
//         const canvas = renderer.domElement;
//         camera.aspect = canvas.clientWidth / canvas.clientHeight;
//         camera.updateProjectionMatrix();
//     }

//     cubes.forEach((cube, ndx) => {
//         const speed = 1 + ndx * .1;
//         const rot = time * speed;
//         cube.rotation.x = rot;
//         cube.rotation.y = rot;
//     });

//     renderer.render(scene, camera);

//     requestAnimationFrame(render);
// }

// requestAnimationFrame(render);

// if i change anything about camera properties must call
// camera.updateProjectionMatrix()

window.addEventListener("load", init);

function init() {
    let rot = 0;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xaaaaaa, 50, 2000);

    const camera = new THREE.PerspectiveCamera(70, 1000);
    const geometry = new THREE.Geometry();

    for (let i = 0; i < 10000; i++) {
        const star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread(2000);
        star.y = THREE.Math.randFloatSpread(2000);
        star.z = THREE.Math.randFloatSpread(2000);

        geometry.vertices.push(star)
    }

    const material = new THREE.PointsMaterial({
        color: 0xffffff
    });
    const starField = new THREE.Points(geometry, material);
    scene.add(starField);

    function render() {
        rot += 0.03;
        const radian = (rot * Math.PI) / 180;
        camera.position.x = 1000 * Math.sin(radian);
        camera.position.z = 1000 * Math.cos(radian);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

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
}