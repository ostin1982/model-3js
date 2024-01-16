import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import init from './init';

import './style.css';

const { sizes, camera, scene, canvas, controls, renderer } = init();

camera.position.set(0, 2, 5);

const hemiLight = new THREE.HemisphereLight('#ffffff', '#ffffff', 0.61);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight('#ffffff', 0.54);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
scene.add(dirLight);

const mtlLoader = new MTLLoader();
mtlLoader.load('/models/obj.mtl', (mtl) => {
	mtl.preload();
	const objLoader = new OBJLoader();
	objLoader.setMaterials(mtl);
	objLoader.load('/models/obj.obj', (object) => {
		scene.add(object);
	});
});

const fbxLoader = new FBXLoader();
fbxLoader.load('/models/fbx.fbx', (object) => {
	scene.add(object);
});

const clock = new THREE.Clock();
const tick = () => {
	controls.update();
	renderer.render(scene, camera);
	const elapsedTime = clock.getElapsedTime();
	camera.position.x = Math.cos(elapsedTime);
	camera.position.y = Math.sin(elapsedTime);
	window.requestAnimationFrame(tick);
};
tick();

window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});
