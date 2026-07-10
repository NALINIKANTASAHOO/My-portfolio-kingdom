/* =========================================================
   NPCS: the King inside the castle, plus a shopkeeper stationed
   outside every shop to guide the player toward it. Purely
   presentational — dialog content and quest state live in ui.js.
========================================================= */

const npcSkinTones = [0xffc98b, 0xe8a06a, 0xffdcb0];

function makeHumanoid({skin, shirt, pants, scale=1}){
  const g = new THREE.Group();
  const skinMat  = new THREE.MeshStandardMaterial({color:skin, flatShading:true});
  const shirtMat = new THREE.MeshStandardMaterial({color:shirt, flatShading:true});
  const pantsMat = new THREE.MeshStandardMaterial({color:pants, flatShading:true});

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.46,0.6,0.28), shirtMat);
  torso.position.y = 0.98;
  torso.castShadow = true;
  g.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24,10,10), skinMat);
  head.position.y = 1.48;
  head.castShadow = true;
  g.add(head);

  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.16,0.55,0.16), pantsMat);
  legL.position.set(-0.12, 0.36, 0);
  legL.castShadow = true;
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.12;
  g.add(legR);

  const armL = new THREE.Group();
  const armLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.13,0.45,0.13), shirtMat);
  armLMesh.position.y = -0.22;
  armL.add(armLMesh);
  armL.position.set(-0.32, 1.22, 0);
  g.add(armL);
  const armR = new THREE.Group();
  const armRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.13,0.45,0.13), shirtMat);
  armRMesh.position.y = -0.22;
  armR.add(armRMesh);
  armR.position.set(0.32, 1.22, 0);
  g.add(armR);

  g.traverse(o=>{ if(o.isMesh) o.castShadow = true; });
  g.scale.setScalar(scale);
  g.userData = {armL, armR, phase: Math.random()*Math.PI*2};
  return g;
}

/* ---------- The King ---------- */
function makeKing(){
  const g = makeHumanoid({skin:0xffdcb0, shirt:0x6b3fa0, pants:0x3d2560, scale:1.25});

  const robeMat = new THREE.MeshStandardMaterial({color:0x7a4bc4, flatShading:true, roughness:0.75});
  const trimMat = new THREE.MeshStandardMaterial({color:0xe0b04a, flatShading:true, roughness:0.4, metalness:0.3});

  const robe = new THREE.Mesh(new THREE.ConeGeometry(0.5,1.3,8), robeMat);
  robe.position.y = 0.68;
  robe.castShadow = true;
  g.add(robe);

  const cape = new THREE.Mesh(new THREE.PlaneGeometry(0.62,1.1), new THREE.MeshStandardMaterial({color:0xb2273e, side:THREE.DoubleSide, flatShading:true}));
  cape.position.set(0, 1.05, -0.16);
  cape.rotation.x = 0.15;
  g.add(cape);

  const beard = new THREE.Mesh(new THREE.ConeGeometry(0.16,0.34,8), new THREE.MeshStandardMaterial({color:0xf1f1f1, flatShading:true}));
  beard.position.set(0, 1.32, 0.16);
  beard.rotation.x = 0.35;
  g.add(beard);

  const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.24,0.16,8), trimMat);
  crownBase.position.y = 1.72;
  g.add(crownBase);
  for(let i=0;i<6;i++){
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.05,0.14,4), trimMat);
    const ang = (i/6)*Math.PI*2;
    spike.position.set(Math.sin(ang)*0.2, 1.85, Math.cos(ang)*0.2);
    g.add(spike);
  }
  const jewel = new THREE.Mesh(new THREE.OctahedronGeometry(0.05,0), new THREE.MeshStandardMaterial({color:0xff3b5c, emissive:0x990022, emissiveIntensity:0.6}));
  jewel.position.set(0, 1.78, 0.22);
  g.add(jewel);

  // royal staff, held in the right hand
  const staffGroup = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,1.6,6), trimMat);
  pole.position.y = -0.3;
  staffGroup.add(pole);
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.11,10,10), new THREE.MeshStandardMaterial({color:0x8ad9ff, emissive:0x2a8fd0, emissiveIntensity:0.9, transparent:true, opacity:0.9}));
  orb.position.y = 0.55;
  staffGroup.add(orb);
  const orbGlow = makeGlowSprite(1.1, 'rgba(140,220,255,0.6)', 'rgba(120,200,255,0)');
  orbGlow.position.y = 0.55;
  staffGroup.add(orbGlow);
  staffGroup.position.set(0.42, 1.0, 0.05);
  g.add(staffGroup);
  g.userData.staffOrb = orb;

  g.traverse(o=>{ if(o.isMesh) o.castShadow = true; });
  return g;
}

const king = makeKing();
king.position.set(0, 0, 3);
king.lookAt(0, 0, 12); // faces the gate / the spawn point
scene.add(king);
addBlocker(king.position.x, king.position.z, 1.3);

/* ---------- Treasure chest, beside the King ---------- */
const chestWoodMat = new THREE.MeshStandardMaterial({color:0x7a4a2b, flatShading:true, roughness:0.85});
const chestGoldMat = new THREE.MeshStandardMaterial({color:0xe0b04a, flatShading:true, roughness:0.4, metalness:0.4});
const chestGroup = new THREE.Group();
const chestBase = new THREE.Mesh(new THREE.BoxGeometry(0.9,0.55,0.6), chestWoodMat);
chestBase.position.y = 0.28;
chestBase.castShadow = true;
chestGroup.add(chestBase);
[-0.4,0,0.4].forEach(x=>{
  const band = new THREE.Mesh(new THREE.BoxGeometry(0.08,0.57,0.62), chestGoldMat);
  band.position.set(x,0.28,0);
  chestGroup.add(band);
});
const chestLid = new THREE.Group();
const lidMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.45,0.6,8,1,false,0,Math.PI), chestWoodMat);
lidMesh.rotation.z = Math.PI/2;
lidMesh.position.set(0,0,0);
lidMesh.castShadow = true;
chestLid.add(lidMesh);
const lidBand = new THREE.Mesh(new THREE.TorusGeometry(0.45,0.05,6,10,Math.PI), chestGoldMat);
lidBand.rotation.z = Math.PI/2;
lidBand.rotation.y = Math.PI/2;
chestLid.add(lidBand);
chestLid.position.set(0,0.55,-0.3);
chestGroup.add(chestLid);
const lock = new THREE.Mesh(new THREE.BoxGeometry(0.14,0.16,0.08), chestGoldMat);
lock.position.set(0,0.42,0.3);
chestGroup.add(lock);
const chestGlow = makeGlowSprite(2.2, 'rgba(255,220,120,0.85)', 'rgba(255,200,90,0)');
chestGlow.material.opacity = 0;
chestGlow.position.set(0,0.4,0);
chestGroup.add(chestGlow);

chestGroup.position.set(2.6, 0, 3.2);
chestGroup.rotation.y = -0.5;
chestGroup.traverse(o=>{ if(o.isMesh){ o.castShadow = true; o.receiveShadow = true; } });
scene.add(chestGroup);
addBlocker(chestGroup.position.x, chestGroup.position.z, 0.9);

let chestOpenT = 0; // 0 closed .. 1 fully open
let chestOpening = false;
function openTreasureChest(){
  chestOpening = true;
}

/* ---------- Shopkeepers: one stationed near each shop, pointing
   the way in and offering a one-line hint about that section. ---------- */
const shopkeeperShirts = [0xff8a5b,0x4dabf7,0x9775fa,0xffd43b,0x38d9a9,0xf783ac];
const shopkeepers = [];

SHOPS.forEach((s,i)=>{
  const pos = shopPositions[i];
  const toCenter = new THREE.Vector3(0,0,0).sub(pos).normalize();
  const sideways = new THREE.Vector3(-toCenter.z,0,toCenter.x);

  const npc = makeHumanoid({
    skin: npcSkinTones[i % npcSkinTones.length],
    shirt: shopkeeperShirts[i % shopkeeperShirts.length],
    pants: 0x3a3a42,
    scale: 1
  });
  const apron = new THREE.Mesh(new THREE.BoxGeometry(0.4,0.42,0.05), new THREE.MeshStandardMaterial({color:0xf4ede0, flatShading:true}));
  apron.position.set(0,0.85,0.15);
  npc.add(apron);

  const spot = pos.clone()
    .addScaledVector(toCenter, 4.0)
    .addScaledVector(sideways, -3.6);
  npc.position.set(spot.x, 0, spot.z);
  npc.lookAt(pos.x, 0, pos.z);
  scene.add(npc);
  addBlocker(spot.x, spot.z, 0.9);

  shopkeepers.push({mesh:npc, data:s});

  interactTargets.push({
    pos: npc.position.clone(),
    radius: 5.5,
    label: "Talk to the " + s.name.split(" ")[0] + " Keeper",
    action: ()=>openShopkeeperDialog(s)
  });
});

interactTargets.push({
  pos: king.position.clone(),
  radius: 6.5,
  label: "Talk to " + KING_NAME,
  action: ()=>openKingDialog()
});

/** Called every frame from main.js — idle sway for the King and every
 *  shopkeeper, plus the treasure chest lid opening once the quest completes. */
function updateNPCs(delta, t){
  const sway = Math.sin(t*1.4 + king.userData.phase)*0.06;
  king.userData.armR.rotation.z = sway;
  king.userData.armL.rotation.z = -sway*0.6;
  if(king.userData.staffOrb) king.userData.staffOrb.rotation.y = t*0.8;

  for(const {mesh} of shopkeepers){
    const bob = Math.sin(t*1.6 + mesh.userData.phase)*0.03;
    mesh.position.y = bob;
    mesh.userData.armR.rotation.z = Math.sin(t*1.2 + mesh.userData.phase)*0.12;
  }

  if(chestOpening && chestOpenT < 1){
    chestOpenT = Math.min(1, chestOpenT + delta*1.4);
    chestLid.rotation.x = -chestOpenT * (Math.PI*0.62);
    chestGlow.material.opacity = chestOpenT * 0.7;
    chestGlow.scale.setScalar(2.2 + Math.sin(t*3)*0.2);
  }
}
