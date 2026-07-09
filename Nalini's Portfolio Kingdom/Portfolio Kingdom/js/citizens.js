/* =========================================================
   CITIZENS: low-poly villagers who wander the plaza and the
   streets between houses, giving the kingdom a lived-in feel.
   Purely ambient — no interaction, just gentle wandering AI.
========================================================= */

const citizenSkinTones = [0xffc98b, 0xe8a06a, 0xc47f4f, 0xffdcb0];
const citizenShirtColors = [0x4dabf7, 0xff8a5b, 0x9775fa, 0x51cf66, 0xf783ac, 0xffd43b];
const citizenPantsColors = [0x2c3e50, 0x4a3728, 0x35424a];

function makeCitizen(){
  const g = new THREE.Group();
  const skin  = new THREE.MeshStandardMaterial({color: citizenSkinTones[Math.floor(Math.random()*citizenSkinTones.length)], flatShading:true});
  const shirt = new THREE.MeshStandardMaterial({color: citizenShirtColors[Math.floor(Math.random()*citizenShirtColors.length)], flatShading:true});
  const pants = new THREE.MeshStandardMaterial({color: citizenPantsColors[Math.floor(Math.random()*citizenPantsColors.length)], flatShading:true});

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42,0.55,0.26), shirt);
  torso.position.y = 0.95;
  torso.castShadow = true;
  g.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22,8,8), skin);
  head.position.y = 1.42;
  head.castShadow = true;
  g.add(head);

  const legL = new THREE.Group();
  const legLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15,0.5,0.15), pants);
  legLMesh.position.y = -0.25;
  legL.add(legLMesh);
  legL.position.set(-0.11, 0.68, 0);
  g.add(legL);

  const legR = new THREE.Group();
  const legRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15,0.5,0.15), pants);
  legRMesh.position.y = -0.25;
  legR.add(legRMesh);
  legR.position.set(0.11, 0.68, 0);
  g.add(legR);

  const armL = new THREE.Group();
  const armLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.42,0.12), shirt);
  armLMesh.position.y = -0.21;
  armL.add(armLMesh);
  armL.position.set(-0.29, 1.18, 0);
  g.add(armL);

  const armR = new THREE.Group();
  const armRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.42,0.12), shirt);
  armRMesh.position.y = -0.21;
  armR.add(armRMesh);
  armR.position.set(0.29, 1.18, 0);
  g.add(armR);

  g.traverse(o=>{ if(o.isMesh){ o.castShadow = true; } });
  g.userData = {legL, legR, armL, armR, phase: Math.random()*Math.PI*2};
  return g;
}

/** Picks a random point the citizen is allowed to walk to — either
 *  the inner plaza (between the castle and the ring road) or the
 *  village band outside the road, staying clear of buildings. */
function pickCitizenTarget(){
  for(let attempt=0; attempt<40; attempt++){
    const inner = Math.random() < 0.5;
    const ang = Math.random()*Math.PI*2;
    const r = inner
      ? (CASTLE_RADIUS+2.5) + Math.random()*(roadRadius-13-CASTLE_RADIUS)
      : (roadRadius+7) + Math.random()*38;
    const x = Math.cos(ang)*r, z = Math.sin(ang)*r;
    if(pointBlockedByRoad(x,z)) continue;
    if(pointNearShops(x,z, shopPositions, 6)) continue;
    if(pointNearShops(x,z, buildingPositions, 4)) continue;
    if(pointNearCastle(x,z, 1)) continue;
    return new THREE.Vector3(x,0,z);
  }
  return new THREE.Vector3(roadRadius+10, 0, 0);
}

const citizens = [];
const CITIZEN_COUNT = 12;
for(let i=0;i<CITIZEN_COUNT;i++){
  const c = makeCitizen();
  const start = pickCitizenTarget();
  c.position.copy(start);
  scene.add(c);
  citizens.push({
    mesh:c,
    target: pickCitizenTarget(),
    speed: 0.7 + Math.random()*0.6,
    pauseTimer: Math.random()*3
  });
}

/** Called every frame from main.js */
function updateCitizens(delta, t){
  for(const c of citizens){
    const mesh = c.mesh;
    const toTarget = new THREE.Vector3().subVectors(c.target, mesh.position);
    toTarget.y = 0;
    const dist = toTarget.length();

    if(dist < 0.6){
      if(c.pauseTimer > 0){
        c.pauseTimer -= delta;
      } else {
        c.target = pickCitizenTarget();
        c.pauseTimer = 1 + Math.random()*3;
      }
    } else {
      toTarget.normalize();
      mesh.position.addScaledVector(toTarget, c.speed*delta);
      const desiredYaw = Math.atan2(toTarget.x, toTarget.z);
      mesh.rotation.y += (desiredYaw - mesh.rotation.y) * Math.min(1, delta*4);

      const walk = Math.sin(t*6 + mesh.userData.phase);
      mesh.userData.legL.rotation.x = walk*0.5;
      mesh.userData.legR.rotation.x = -walk*0.5;
      mesh.userData.armL.rotation.x = -walk*0.4;
      mesh.userData.armR.rotation.x = walk*0.4;
      mesh.position.y = Math.abs(Math.sin(t*6 + mesh.userData.phase))*0.03;
    }
  }
}
