/* =========================================================
   HORSE + RIDER CHARACTER + CONTROLS
   The player's mount: a low-poly horse with a rider in the
   saddle, galloping around the kingdom.
========================================================= */

const horse = new THREE.Group();

const coatMat   = new THREE.MeshStandardMaterial({color:0x8a5a34, flatShading:true, roughness:0.9});
const coatDark  = new THREE.MeshStandardMaterial({color:0x6b4326, flatShading:true, roughness:0.9});
const maneMat   = new THREE.MeshStandardMaterial({color:0x2e2119, flatShading:true, roughness:0.85});
const hoofMat   = new THREE.MeshStandardMaterial({color:0x201812, flatShading:true, roughness:0.7});
const saddleMat = new THREE.MeshStandardMaterial({color:0x7a2f26, flatShading:true, roughness:0.75});
const skinMat   = new THREE.MeshStandardMaterial({color:0xffc98b, flatShading:true});
const shirtMat  = new THREE.MeshStandardMaterial({color:0x4dabf7, flatShading:true});
const pantsMat  = new THREE.MeshStandardMaterial({color:0x2c3e50, flatShading:true});
const capeMat   = new THREE.MeshStandardMaterial({color:0xff8a3d, flatShading:true, side:THREE.DoubleSide});

/* ---- Body ---- */
const body = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 1.9), coatMat);
body.position.set(0, 1.05, 0);
body.castShadow = true;
horse.add(body);

// slightly rounded haunches at the rear
const haunch = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), coatMat);
haunch.scale.set(1, 0.95, 0.8);
haunch.position.set(0, 1.05, -0.95);
haunch.castShadow = true;
horse.add(haunch);

/* ---- Neck + head ---- */
const neck = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.85, 0.42), coatMat);
neck.position.set(0, 1.62, 0.85);
neck.rotation.x = -0.55;
neck.castShadow = true;
horse.add(neck);

const head = new THREE.Group();
const skull = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.4, 0.62), coatMat);
skull.position.set(0, 0, 0.2);
skull.castShadow = true;
head.add(skull);
const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.32), coatDark);
muzzle.position.set(0, -0.08, 0.5);
head.add(muzzle);
[-0.14, 0.14].forEach(x=>{
  const ear = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.24, 5), coatMat);
  ear.position.set(x, 0.26, -0.02);
  ear.rotation.x = -0.2;
  head.add(ear);
});
head.position.set(0, 2.12, 1.28);
head.rotation.x = 0.15;
horse.add(head);

// mane along the neck and the top of the head
const maneGeo = new THREE.BoxGeometry(0.1, 0.9, 0.5);
const mane = new THREE.Mesh(maneGeo, maneMat);
mane.position.set(0, 1.68, 0.72);
mane.rotation.x = -0.55;
horse.add(mane);

// tail
const tail = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.95, 6), maneMat);
tail.position.set(0, 1.05, -1.35);
tail.rotation.x = Math.PI/2 + 0.35;
tail.castShadow = true;
horse.add(tail);

/* ---- Legs: each is a pivoting group (upper leg) with a lower
   segment + hoof, so the whole limb swings from the hip/shoulder
   for a galloping motion. ---- */
const legPositions = [
  {name:'FL', x:-0.34, z: 0.72},
  {name:'FR', x: 0.34, z: 0.72},
  {name:'BL', x:-0.34, z:-0.68},
  {name:'BR', x: 0.34, z:-0.68},
];
const legGroups = {};
legPositions.forEach(lp=>{
  const hip = new THREE.Group();
  hip.position.set(lp.x, 0.95, lp.z);
  const upper = new THREE.Mesh(new THREE.BoxGeometry(0.22,0.55,0.22), coatMat);
  upper.position.y = -0.27;
  upper.castShadow = true;
  hip.add(upper);

  const knee = new THREE.Group();
  knee.position.set(0, -0.55, 0);
  const lower = new THREE.Mesh(new THREE.BoxGeometry(0.16,0.5,0.16), coatDark);
  lower.position.y = -0.25;
  lower.castShadow = true;
  knee.add(lower);
  const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.2,0.16,0.24), hoofMat);
  hoof.position.y = -0.55;
  hoof.castShadow = true;
  knee.add(hoof);
  hip.add(knee);

  horse.add(hip);
  legGroups[lp.name] = hip;
});

/* ---- Saddle + reins ---- */
const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.22, 0.85), saddleMat);
saddle.position.set(0, 1.62, 0.05);
saddle.castShadow = true;
horse.add(saddle);
const saddleHorn = new THREE.Mesh(new THREE.SphereGeometry(0.08,6,6), saddleMat);
saddleHorn.position.set(0, 1.78, 0.42);
horse.add(saddleHorn);
[-0.05, 0.05].forEach(off=>{
  const rein = new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.95,4), coatDark);
  rein.position.set(off*3, 1.9, 0.85);
  rein.rotation.x = -0.55;
  horse.add(rein);
});

/* ---- Rider, seated on the saddle ---- */
const rider = new THREE.Group();
const torso = new THREE.Mesh(new THREE.BoxGeometry(0.45,0.58,0.32), shirtMat);
torso.position.set(0, 2.35, 0.0);
torso.rotation.x = 0.1;
torso.castShadow = true;
rider.add(torso);

const cape = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.65), capeMat);
cape.position.set(0, 2.25, -0.2);
cape.rotation.x = 0.35;
rider.add(cape);

const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24,8,8), skinMat);
headMesh.position.set(0, 2.82, 0.08);
headMesh.castShadow = true;
rider.add(headMesh);

const legL = new THREE.Mesh(new THREE.BoxGeometry(0.16,0.62,0.65), pantsMat);
legL.position.set(-0.28, 1.95, 0.05);
legL.rotation.x = 0.15;
rider.add(legL);
const legR = legL.clone();
legR.position.x = 0.28;
rider.add(legR);

const armL = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.45,0.12), shirtMat);
armL.position.set(-0.3, 2.28, 0.32);
armL.rotation.x = -0.75;
rider.add(armL);
const armR = armL.clone();
armR.position.x = 0.3;
rider.add(armR);

horse.add(rider);

horse.traverse(o=>{ if(o.isMesh) o.castShadow = true; });
horse.position.set(0, 0, 8);
horse.rotation.y = Math.PI; // face the King, standing further into the courtyard
scene.add(horse);

/* ---- Input ---- */
const keys = {up:false,down:false,left:false,right:false};
const keyMap = {
  KeyW:'up', ArrowUp:'up',
  KeyS:'down', ArrowDown:'down',
  KeyA:'left', ArrowLeft:'left',
  KeyD:'right', ArrowRight:'right'
};
window.addEventListener('keydown', (e)=>{
  if(keyMap[e.code]){
    e.preventDefault();
    keys[keyMap[e.code]] = true;
  }
  if(e.code === 'KeyE'){
    if(activeInteract) activeInteract.action();
  }
  if(e.code === 'Escape') closePanel();
});
window.addEventListener('keyup', (e)=>{
  if(keyMap[e.code]){
    e.preventDefault();
    keys[keyMap[e.code]] = false;
  }
});
document.querySelectorAll('#touch-pad button').forEach(btn=>{
  const k = btn.dataset.k;
  const on = (ev)=>{
    ev.preventDefault();
    keys[k]=true;
    btn.classList.add('is-pressed');
    if(ev.pointerId !== undefined && btn.setPointerCapture) btn.setPointerCapture(ev.pointerId);
  };
  const off = (ev)=>{
    ev.preventDefault();
    keys[k]=false;
    btn.classList.remove('is-pressed');
    if(ev.pointerId !== undefined && btn.releasePointerCapture) btn.releasePointerCapture(ev.pointerId);
  };
  btn.addEventListener('pointerdown', on);
  btn.addEventListener('pointerup', off);
  btn.addEventListener('pointercancel', off);
  btn.addEventListener('lostpointercapture', off);
  btn.addEventListener('mouseleave', off);
  btn.addEventListener('contextmenu', (ev)=>ev.preventDefault());
});

let activeInteract = null;
let gallopPhase = 0;
const camTargetPos = new THREE.Vector3();
const cameraLookTarget = new THREE.Vector3();
let cameraYawOffset = 0;
let cameraPitch = 0.48;
let cameraDistance = 13.8;
let cameraDragging = false;
let cameraMode = 'follow';

function setCameraMode(mode){
  cameraMode = mode;
  if(mode === 'top'){
    cameraPitch = 0.12;
    cameraDistance = 56;
    cameraYawOffset = 0;
  } else {
    cameraPitch = 0.48;
    cameraDistance = 13.8;
    cameraYawOffset = 0;
  }
}
let lastPointerX = 0;
let lastPointerY = 0;

renderer.domElement.addEventListener('pointerdown', (ev)=>{
  if(ev.pointerType !== 'mouse' || ev.button !== 0 || controlsLocked) return;
  cameraDragging = true;
  lastPointerX = ev.clientX;
  lastPointerY = ev.clientY;
  renderer.domElement.setPointerCapture(ev.pointerId);
});

renderer.domElement.addEventListener('pointermove', (ev)=>{
  if(!cameraDragging) return;
  const dx = ev.clientX - lastPointerX;
  const dy = ev.clientY - lastPointerY;
  lastPointerX = ev.clientX;
  lastPointerY = ev.clientY;
  cameraYawOffset -= dx * 0.006;
  cameraPitch = THREE.MathUtils.clamp(cameraPitch + dy * 0.004, 0.16, 1.18);
});

function stopCameraDrag(ev){
  cameraDragging = false;
  if(ev && ev.pointerId !== undefined && renderer.domElement.releasePointerCapture){
    renderer.domElement.releasePointerCapture(ev.pointerId);
  }
}
renderer.domElement.addEventListener('pointerup', stopCameraDrag);
renderer.domElement.addEventListener('pointercancel', stopCameraDrag);
renderer.domElement.addEventListener('lostpointercapture', stopCameraDrag);

renderer.domElement.addEventListener('wheel', (ev)=>{
  ev.preventDefault();
  cameraDistance = THREE.MathUtils.clamp(cameraDistance + ev.deltaY * 0.018, 9, 42);
}, {passive:false});

/** Called every frame from main.js. Moves the horse, animates its
 *  gallop, follows the camera, and updates the nearest-shop prompt. */
function updateHorse(delta){
  if(!controlsLocked){
    const turnSpeed = 2.0;
    const moveSpeed = 13;
    let moveInput = 0;
    if(keys.up) moveInput += 1;
    if(keys.down) moveInput -= 0.7;
    if(keys.left) horse.rotation.y += turnSpeed*delta*(moveInput!==0?1:0.6);
    if(keys.right) horse.rotation.y -= turnSpeed*delta*(moveInput!==0?1:0.6);

    if(moveInput !== 0){
      const dir = new THREE.Vector3(Math.sin(horse.rotation.y),0,Math.cos(horse.rotation.y));
      const nextPos = horse.position.clone().addScaledVector(dir, moveInput*moveSpeed*delta);
      if(!pointBlockedByCastle(nextPos.x, nextPos.z) && !pointBlockedByBlockers(nextPos.x, nextPos.z, 0.5)){
        horse.position.copy(nextPos);
      }
      gallopPhase += Math.abs(moveInput)*moveSpeed*delta*2.6;
      notifyFirstMove();
    }
    // clamp to island
    const d = Math.hypot(horse.position.x, horse.position.z);
    if(d > 132){
      horse.position.x *= 132/d;
      horse.position.z *= 132/d;
    }

    // diagonal-pair gallop gait: FL+BR swing together, FR+BL opposite
    const swingA = Math.sin(gallopPhase) * (moveInput!==0 ? 0.7 : 0);
    const swingB = Math.sin(gallopPhase + Math.PI) * (moveInput!==0 ? 0.7 : 0);
    legGroups.FL.rotation.x = swingA;
    legGroups.BR.rotation.x = swingA;
    legGroups.FR.rotation.x = swingB;
    legGroups.BL.rotation.x = swingB;

    // body bob + slight lean into turns, mane/tail/cape flutter
    const bob = moveInput!==0 ? Math.abs(Math.sin(gallopPhase))*0.12 : 0;
    body.position.y = 1.05 + bob;
    haunch.position.y = 1.05 + bob;
    rider.position.y = bob*0.8;
    tail.rotation.z = Math.sin(gallopPhase*0.5)*0.15;
    cape.rotation.z = Math.sin(gallopPhase*0.4)*0.1 - 0.05;

    const lean = (keys.left?1:0) - (keys.right?1:0);
    horse.rotation.z += ((moveInput!==0?lean*0.2:0) - horse.rotation.z)*0.1;
  }

  // Drag with the mouse to orbit around the rider; scroll to pull back for
  // a wider look at the island, sky, and ground. A top-view mode gives
  // mobile/desktop users a quick bird's-eye look at the whole kingdom.
  const cameraAngle = horse.rotation.y + Math.PI + cameraYawOffset;
  const targetY = horse.position.y + 1.8;
  if(cameraMode === 'top'){
    camTargetPos.set(horse.position.x, horse.position.y + 44, horse.position.z);
    cameraLookTarget.set(horse.position.x, targetY, horse.position.z);
  } else {
    const horizontalDistance = Math.cos(cameraPitch) * cameraDistance;
    camTargetPos.set(
      horse.position.x + Math.sin(cameraAngle) * horizontalDistance,
      targetY + Math.sin(cameraPitch) * cameraDistance,
      horse.position.z + Math.cos(cameraAngle) * horizontalDistance
    );
    cameraLookTarget.set(horse.position.x, targetY, horse.position.z);
  }
  camera.position.lerp(camTargetPos, 1-Math.pow(0.001,delta));
  camera.lookAt(cameraLookTarget);

  // nearest-interactable proximity check (shop doors, the King, shopkeepers)
  let nearest = null, nearestD = Infinity;
  for(const it of interactTargets){
    const dd = Math.hypot(horse.position.x - it.pos.x, horse.position.z - it.pos.z);
    if(dd < it.radius && dd < nearestD){ nearestD = dd; nearest = it; }
  }
  activeInteract = nearest;
  if(nearest && !controlsLocked){
    promptText.textContent = nearest.label;
    promptEl.classList.add('show');
  } else {
    promptEl.classList.remove('show');
  }
}
