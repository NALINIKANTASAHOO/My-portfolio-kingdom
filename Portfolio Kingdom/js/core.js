/* =========================================================
   CORE SCENE SETUP
   Scene, camera, renderer and lighting rig. Every other module
   (sky.js, world.js, castle.js, shops.js, trees.js, horse.js) adds
   itself into this `scene`. Lighting is tuned for a warm sunset /
   evening mood across the whole kingdom.
========================================================= */

let controlsLocked = false; // true while a shop panel is open

const holder = document.getElementById('canvas-holder');
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xf0955c, 50, 210);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 500);
camera.position.set(0, 14, 22);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
holder.appendChild(renderer.domElement);

window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ---- Lights: warm, low, golden-hour sunset rig ---- */
const hemiLight = new THREE.HemisphereLight(0xff9d6c, 0x3a2b4a, 0.65);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xffa552, 1.15);
sunLight.position.set(-90, 22, -55); // low on the horizon, behind the castle
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048,2048);
sunLight.shadow.camera.left = -100;
sunLight.shadow.camera.right = 100;
sunLight.shadow.camera.top = 100;
sunLight.shadow.camera.bottom = -100;
sunLight.shadow.camera.far = 220;
sunLight.shadow.bias = -0.0015;
scene.add(sunLight);

// Cool blue-violet fill light from the opposite side, standing in for the
// darkening dusk sky — keeps shadow sides from going pure black.
const duskFill = new THREE.DirectionalLight(0x5a6fc9, 0.28);
duskFill.position.set(60, 30, 70);
scene.add(duskFill);
