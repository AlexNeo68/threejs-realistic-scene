import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const hdrTextureUrl = new URL(
  "../assets/MR_INT-001_NaturalStudio_NAD.hdr",
  import.meta.url
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0xfefefe);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(0, 0, 7);
orbit.update();

const rgbeLoader = new RGBELoader();

const sphereGeo = new THREE.SphereGeometry(0.75, 50, 50);
const sphereMat = new THREE.MeshStandardMaterial({
  metalness: 0.5,
  roughness: 0,
  color: 0xff0000,
});

rgbeLoader.load(hdrTextureUrl, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  //   scene.environment = texture;

  const sphere1 = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphere1);
  sphere1.position.x = -1;

  const sphere2 = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphere2);
  sphere2.material.color = new THREE.Color(0x0000ff);
  sphere2.material.envMap = texture;
  sphere2.position.x = 1;
});

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;

function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
