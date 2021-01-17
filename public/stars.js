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

    let mouse = { x: 0, y: 0 };

    window.addEventListener('mousemove', raycast, false);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xaaaaaa, 50, 2000);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
    const geometry = new THREE.Geometry();

    let raycaster1 = new THREE.Raycaster();
    
    raycaster1.params.Points.threshold = 1;
    raycaster1.params.Line.threshold = 0;
    raycaster1.params.Sprite.threshold = 1;

    
    let raycaster2 = new THREE.Raycaster();
    
    raycaster2.params.Points.threshold = 2;
    raycaster2.params.Line.threshold = 1;
    raycaster2.params.Sprite.threshold = 2;


    let raycaster3 = new THREE.Raycaster();
    
    raycaster3.params.Points.threshold = 3;
    raycaster3.params.Line.threshold = 1.5;
    raycaster3.params.Sprite.threshold = 3;

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
        alphaTest: 0.2,
        blending: THREE.AdditiveBlending,
    });

    const constellations = [];
    for (let i = 0; i < 100; i++) {
        const star = new THREE.Vector3();
        let theta = THREE.Math.randFloat(0, 2 * Math.PI);
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

    constellations.forEach((pointList) => {
        pointList.forEach((point) => {
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

    let object ;
    function raycast() {
        // Update the mouse variable
        // event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        // console.log(mouse);
        raycaster1.setFromCamera(mouse, camera);
        let intersects = raycaster1.intersectObjects(scene.children);
        if (intersects.length > 0) {
            if (intersects[0] !== object && object) {
                object.material.color.set(0xffffff);
            }
            object = intersects[0].object;
            object.material.color.set(0x88bbe7);
            return;
        } else {
            if (object) {
                object.material.color.set(0xffffff);
                object = null;
            }
        }
        raycaster2.setFromCamera(mouse, camera);
        intersects = raycaster2.intersectObjects(scene.children);
        if (intersects.length > 0) {
            if (intersects[0] !== object && object) {
                object.material.color.set(0xffffff);
            }
            object = intersects[0].object;
            object.material.color.set(0x88bbe7);
            return;
        } else {
            if (object) {
                object.material.color.set(0xffffff);
                object = null;
            }
        }
        raycaster3.setFromCamera(mouse, camera);
        intersects = raycaster3.intersectObjects(scene.children);
        if (intersects.length > 0) {
            if (intersects[0] !== object && object) {
                object.material.color.set(0xffffff);
            }
            object = intersects[0].object;
            object.material.color.set(0x88bbe7);
        } else {
            if (object) {
                object.material.color.set(0xffffff);
                object = null;
            }
        }
    }


    function render() {
        TWEEN.update()
        rot += velocity.v;
        const radian = (rot * Math.PI) / 180;
        camera.position.x = 1000 * Math.sin(radian);
        camera.position.z = 1000 * Math.cos(radian);
        const dy = (camera.position.y - (-scrollable.scrollTop));
        camera.position.y = -scrollable.scrollTop + 0.99 * dy;
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

}