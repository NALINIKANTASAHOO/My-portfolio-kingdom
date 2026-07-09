/* =========================================================
   CASTLE: the kingdom's keep, standing in the town square at
   the center of the ring road. Built from simple low-poly
   towers, crenellated walls and waving banners so it reads
   clearly in silhouette against the sunset sky.
========================================================= */

const CASTLE_RADIUS = 15.5; // other modules keep clear of this footprint

function pointNearCastle(x, z, pad = 0){
  return Math.hypot(x, z) < CASTLE_RADIUS + pad;
}

function pointBlockedByCastle(x, z){
  const half = 11;
  const gateGap = 4.6;
  const wallBuffer = 1.25;

  const insideCastleBounds = Math.abs(x) <= half + 0.6 && Math.abs(z) <= half + 0.6;
  if(!insideCastleBounds) return false;

  const inGateOpening = z >= half - 0.8 && z <= half + 0.4 && Math.abs(x) <= gateGap/2 + 0.2;
  if(inGateOpening) return false;

  const nearFrontWall = z >= half - wallBuffer && z <= half + 0.4 && Math.abs(x) > gateGap/2 + 0.2 && Math.abs(x) <= half + 0.6;
  const nearSideWall = Math.abs(x) >= half - wallBuffer && Math.abs(x) <= half + 0.6 && Math.abs(z) <= half + 0.6;
  const nearBackWall = z <= -half + wallBuffer && z >= -half - 0.6 && Math.abs(x) <= half + 0.6;
  return nearFrontWall || nearSideWall || nearBackWall;
}

const castleStoneMat   = new THREE.MeshStandardMaterial({color:0xcdc3d6, flatShading:true, roughness:0.95});
const castleStoneDark  = new THREE.MeshStandardMaterial({color:0x9a90a8, flatShading:true, roughness:0.95});
const castleRoofMat    = new THREE.MeshStandardMaterial({color:0x5c3a68, flatShading:true, roughness:0.8});
const castleDoorMat    = new THREE.MeshStandardMaterial({color:0x4a2f22, flatShading:true, roughness:0.9});
const castleGoldMat    = new THREE.MeshStandardMaterial({color:0xe0b04a, flatShading:true, roughness:0.6, metalness:0.2});
const bannerPalette    = [0xff8a3d, 0x4dabf7, 0x9775fa, 0xffd43b];

function makeBanner(color, w, h){
  const g = new THREE.Group();
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(w,h,4,1), new THREE.MeshStandardMaterial({color, side:THREE.DoubleSide, flatShading:true, roughness:0.7}));
  cloth.userData.wave = Math.random()*Math.PI*2;
  g.add(cloth);
  g.userData.cloth = cloth;
  return g;
}
const allBanners = [];

function makeCrenellations(length, count, blockW, blockH, mat){
  const g = new THREE.Group();
  for(let i=0;i<count;i++){
    const x = -length/2 + (length/(count-1))*i;
    const block = new THREE.Mesh(new THREE.BoxGeometry(blockW, blockH, blockW), mat);
    block.position.set(x, 0, 0);
    block.castShadow = true;
    g.add(block);
  }
  return g;
}

function makeTower(radius, height, roofHeight, withFlag){
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius*1.08, height, 10), castleStoneMat);
  body.position.y = height/2;
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);

  // narrow arrow-slit windows, glowing warmly like candlelight inside
  for(let i=0;i<3;i++){
    const slit = new THREE.Mesh(new THREE.BoxGeometry(radius*0.22, radius*0.7, radius*0.3),
      new THREE.MeshStandardMaterial({color:0xffcf7a, emissive:0xff9d3d, emissiveIntensity:0.9, flatShading:true}));
    const ang = (i/3)*Math.PI*2;
    slit.position.set(Math.sin(ang)*radius*0.95, height*0.62, Math.cos(ang)*radius*0.95);
    slit.rotation.y = ang;
    g.add(slit);
  }

  // crenellated crown around the top of the tower
  const crownCount = 8;
  for(let i=0;i<crownCount;i++){
    const ang = (i/crownCount)*Math.PI*2;
    const block = new THREE.Mesh(new THREE.BoxGeometry(radius*0.5, radius*0.5, radius*0.42), castleStoneDark);
    block.position.set(Math.sin(ang)*radius*0.92, height+radius*0.25, Math.cos(ang)*radius*0.92);
    block.castShadow = true;
    g.add(block);
  }

  // conical roof
  const roof = new THREE.Mesh(new THREE.ConeGeometry(radius*1.15, roofHeight, 10), castleRoofMat);
  roof.position.y = height + roofHeight/2 + radius*0.15;
  roof.castShadow = true;
  g.add(roof);
  const finial = new THREE.Mesh(new THREE.SphereGeometry(radius*0.14,6,6), castleGoldMat);
  finial.position.y = height + roofHeight + radius*0.2;
  g.add(finial);

  if(withFlag){
    const poleH = radius*1.6;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,poleH,5), castleGoldMat);
    pole.position.y = height + roofHeight + radius*0.15 + poleH/2;
    g.add(pole);
    const banner = makeBanner(bannerPalette[Math.floor(Math.random()*bannerPalette.length)], 1.5, 0.9);
    banner.position.set(0.75, height + roofHeight + radius*0.15 + poleH - 0.35, 0);
    g.add(banner);
    allBanners.push(banner);
  }

  g.traverse(o=>{ if(o.isMesh) o.castShadow = true; });
  return g;
}

function makeWallRun(length, height, thickness){
  const g = new THREE.Group();
  const wall = new THREE.Mesh(new THREE.BoxGeometry(length, height, thickness), castleStoneMat);
  wall.position.y = height/2;
  wall.castShadow = true; wall.receiveShadow = true;
  g.add(wall);
  const crown = makeCrenellations(length, Math.max(4, Math.round(length/2.2)), 0.6, 0.6, castleStoneDark);
  crown.position.y = height + 0.3;
  g.add(crown);
  return g;
}

/* ---------- Assemble the castle ---------- */
const castle = new THREE.Group();
const half = 11; // half the courtyard footprint

// perimeter walls (front wall has a gate gap, left open toward the road)
const wallHeight = 3.2, wallThick = 0.7;
const backWall  = makeWallRun(half*2, wallHeight, wallThick);
backWall.position.set(0, 0, -half);
castle.add(backWall);

const leftWall = makeWallRun(half*2, wallHeight, wallThick);
leftWall.rotation.y = Math.PI/2;
leftWall.position.set(-half, 0, 0);
castle.add(leftWall);

const rightWall = makeWallRun(half*2, wallHeight, wallThick);
rightWall.rotation.y = Math.PI/2;
rightWall.position.set(half, 0, 0);
castle.add(rightWall);

// front wall: two shorter runs flanking a gate
const gateGap = 4.6;
const frontRunLen = half - gateGap/2;
const frontLeft = makeWallRun(frontRunLen, wallHeight, wallThick);
frontLeft.position.set(-(gateGap/2 + frontRunLen/2), 0, half);
castle.add(frontLeft);
const frontRight = makeWallRun(frontRunLen, wallHeight, wallThick);
frontRight.position.set(gateGap/2 + frontRunLen/2, 0, half);
castle.add(frontRight);

// gatehouse towers flanking the entrance
const gateTowerL = makeTower(1.7, 4.6, 2.6, true);
gateTowerL.position.set(-gateGap/2 - 0.2, 0, half);
castle.add(gateTowerL);
const gateTowerR = makeTower(1.7, 4.6, 2.6, true);
gateTowerR.position.set(gateGap/2 + 0.2, 0, half);
castle.add(gateTowerR);

// the gate itself — a big arched wooden door under a stone lintel
const gate = new THREE.Mesh(new THREE.BoxGeometry(gateGap-0.6, 3.0, 0.3), castleDoorMat);
gate.position.set(0, 1.5, half);
castle.add(gate);
const lintel = new THREE.Mesh(new THREE.BoxGeometry(gateGap+0.6, 0.5, 0.9), castleStoneDark);
lintel.position.set(0, 3.1, half);
castle.add(lintel);
// portcullis bars for a bit of extra detail
for(let i=-2;i<=2;i++){
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.06,2.9,0.06), castleGoldMat);
  bar.position.set(i*0.55, 1.55, half+0.02);
  castle.add(bar);
}

// four corner towers
[[-half,-half],[half,-half],[-half,half],[half,half]].forEach(([x,z])=>{
  const t = makeTower(2.1, 5.4, 3.0, true);
  t.position.set(x,0,z);
  castle.add(t);
});

// the central keep — tallest tower, set toward the back of the courtyard
const keep = makeTower(4.0, 8.5, 4.6, true);
keep.position.set(0, 0, -3.5);
castle.add(keep);
// a secondary, slightly shorter keep tower for silhouette variety
const keepSide = makeTower(2.6, 6.2, 3.4, true);
keepSide.position.set(4.6, 0, -5.2);
castle.add(keepSide);

// stone steps + a short entrance path leading out from the gate
for(let i=0;i<3;i++){
  const step = new THREE.Mesh(new THREE.BoxGeometry(gateGap+1.2, 0.18, 0.7), castleStoneDark);
  step.position.set(0, 0.09 - i*0.02, half + 0.6 + i*0.7);
  step.receiveShadow = true;
  castle.add(step);
}
// banner poles either side of the entrance path
[-3.2, 3.2].forEach((x,i)=>{
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,3.4,6), castleGoldMat);
  pole.position.set(x, 1.7, half+3.4);
  castle.add(pole);
  const banner = makeBanner(bannerPalette[i%bannerPalette.length], 0.85, 1.7);
  banner.position.set(x + (x<0?0.45:-0.45), 2.7, half+3.4);
  banner.rotation.y = Math.PI/2;
  castle.add(banner);
  allBanners.push(banner);
});

castle.traverse(o=>{ if(o.isMesh){ o.castShadow = true; o.receiveShadow = true; } });
scene.add(castle);

/** Called every frame from main.js — gently waves every banner */
function updateCastle(delta, t){
  for(const b of allBanners){
    const cloth = b.userData.cloth;
    cloth.rotation.y = Math.sin(t*1.6 + cloth.userData.wave)*0.18;
  }
}
