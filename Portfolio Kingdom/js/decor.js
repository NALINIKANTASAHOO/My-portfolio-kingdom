/* =========================================================
   DECOR: lamp posts, benches, picket fences, market stalls
   Purely decorative — adds town character, no interaction.
========================================================= */

const decorStoneMat = new THREE.MeshStandardMaterial({color:0x8a8f98, flatShading:true, roughness:0.9});
const decorWoodMat   = new THREE.MeshStandardMaterial({color:0x6b4a30, flatShading:true, roughness:0.9});
const decorWoodLight = new THREE.MeshStandardMaterial({color:0x9c6b41, flatShading:true, roughness:0.9});
const decorMetalMat  = new THREE.MeshStandardMaterial({color:0x2f333b, flatShading:true, roughness:0.6});
const decorGlowMat   = new THREE.MeshStandardMaterial({color:0xfff3c4, emissive:0xffdd66, emissiveIntensity:0.8, flatShading:true});

/* ---------- Lamp posts, spaced along the road ---------- */
function makeLampPost(){
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.26,0.14,8), decorMetalMat);
  base.position.y = 0.07;
  g.add(base);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,2.6,7), decorMetalMat);
  pole.position.y = 1.4;
  pole.castShadow = true;
  g.add(pole);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.07,0.07), decorMetalMat);
  arm.position.set(0.25,2.65,0);
  g.add(arm);
  const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.32,0.4,0.32), decorGlowMat);
  lantern.position.set(0.48,2.55,0);
  g.add(lantern);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.22,0.26,6), decorMetalMat);
  cap.position.set(0.48,2.8,0);
  g.add(cap);
  const glow = makeGlowSprite(1.6, 'rgba(255,238,170,0.55)', 'rgba(255,238,170,0)');
  glow.position.set(0.48,2.55,0);
  g.add(glow);
  g.traverse(o=>{ if(o.isMesh) o.castShadow = true; });
  return g;
}

const lampGroup = new THREE.Group();
for(let i=0;i<roadSamples.length;i+=20){
  const p = roadSamples[i];
  const next = roadSamples[(i+1)%roadSamples.length];
  const dir = new THREE.Vector3().subVectors(next,p).normalize();
  const perp = new THREE.Vector3(-dir.z,0,dir.x);
  const side = (Math.floor(i/20)%2===0) ? 1 : -1;
  const lamp = makeLampPost();
  const pos = p.clone().addScaledVector(perp, side*(roadWidth/2+1.1));
  lamp.position.set(pos.x,0,pos.z);
  lamp.rotation.y = Math.atan2(dir.x,dir.z);
  lampGroup.add(lamp);
}
scene.add(lampGroup);

/* ---------- Benches, one beside each shop's walkway ---------- */
function makeBench(){
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.5,0.1,0.55), decorWoodLight);
  seat.position.y = 0.5;
  g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.5,0.55,0.09), decorWoodLight);
  back.position.set(0,0.78,-0.23);
  g.add(back);
  [-0.62,0.62].forEach(x=>{
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09,0.5,0.5), decorMetalMat);
    leg.position.set(x,0.25,0);
    g.add(leg);
  });
  g.traverse(o=>{ if(o.isMesh){ o.castShadow=true; o.receiveShadow=true; } });
  return g;
}

shopMeshes.forEach(({group, doorPos})=>{
  const toCenter = new THREE.Vector3(0,0,0).sub(group.position).normalize();
  const sideways = new THREE.Vector3(-toCenter.z,0,toCenter.x);
  const bench = makeBench();
  const pos = doorPos.clone().addScaledVector(toCenter, 3.4).addScaledVector(sideways, 3.4);
  bench.position.set(pos.x,0,pos.z);
  bench.lookAt(group.position.x, 0, group.position.z);
  scene.add(bench);
});

/* ---------- Picket fences flanking each shop's walkway ---------- */
function makeFenceRun(length, postCount){
  const g = new THREE.Group();
  for(let i=0;i<postCount;i++){
    const x = -length/2 + (length/(postCount-1))*i;
    const picket = new THREE.Mesh(new THREE.BoxGeometry(0.09,0.62,0.09), decorWoodMat);
    picket.position.set(x,0.31,0);
    g.add(picket);
  }
  [0.22,0.42].forEach(y=>{
    const rail = new THREE.Mesh(new THREE.BoxGeometry(length,0.06,0.06), decorWoodMat);
    rail.position.set(0,y,0);
    g.add(rail);
  });
  g.traverse(o=>{ if(o.isMesh) o.castShadow = true; });
  return g;
}

shopMeshes.forEach(({group})=>{
  const toCenter = new THREE.Vector3(0,0,0).sub(group.position).normalize();
  const sideways = new THREE.Vector3(-toCenter.z,0,toCenter.x);
  [-1,1].forEach(side=>{
    const fence = makeFenceRun(6.5, 7);
    const base = group.position.clone()
      .addScaledVector(toCenter, 1.6)
      .addScaledVector(sideways, side*4.6);
    fence.position.set(base.x,0,base.z);
    fence.rotation.y = Math.atan2(toCenter.x, toCenter.z);
    scene.add(fence);
  });
});

/* ---------- Market stalls scattered in the central plaza ---------- */
const stallPalettes = [
  {canopy:0xff6b6b, canopy2:0xffffff},
  {canopy:0x4dabf7, canopy2:0xffffff},
  {canopy:0xffd43b, canopy2:0xff8a3d},
  {canopy:0x63e6be, canopy2:0xffffff},
];
function makeMarketStall(palette){
  const g = new THREE.Group();
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.7,0.08,1.0), decorWoodLight);
  table.position.y = 0.8;
  table.castShadow = true; table.receiveShadow = true;
  g.add(table);
  [[-0.75,-0.4],[0.75,-0.4],[-0.75,0.4],[0.75,0.4]].forEach(([x,z])=>{
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.8,6), decorWoodMat);
    leg.position.set(x,0.4,z);
    g.add(leg);
  });
  // goods on the table
  const goodsColors = [0xff8787,0xffd43b,0x69db7c,0xffa94d];
  for(let i=0;i<5;i++){
    const good = new THREE.Mesh(new THREE.IcosahedronGeometry(0.13,0), new THREE.MeshStandardMaterial({color:goodsColors[i%goodsColors.length], flatShading:true}));
    good.position.set(-0.6+i*0.3, 0.95, (Math.random()-0.5)*0.4);
    good.castShadow = true;
    g.add(good);
  }
  // canopy poles
  [[-0.85,-0.45],[0.85,-0.45],[-0.85,0.45],[0.85,0.45]].forEach(([x,z])=>{
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,2.1,6), decorMetalMat);
    pole.position.set(x,1.05,z);
    g.add(pole);
  });
  // two-tone striped canopy (pyramid split into 4 colored quarter-panels via 4 thin cones)
  for(let i=0;i<4;i++){
    const mat = new THREE.MeshStandardMaterial({color: i%2===0?palette.canopy:palette.canopy2, flatShading:true, roughness:0.7});
    const panel = new THREE.Mesh(new THREE.ConeGeometry(1.05,0.75,3,1,false, (Math.PI/2)*i, Math.PI/2), mat);
    panel.position.y = 2.5;
    panel.castShadow = true;
    g.add(panel);
  }
  return g;
}

const stallGroup = new THREE.Group();
let stallsPlaced = 0, stallAttempts = 0;
const stallSpots = [];
while(stallsPlaced < 5 && stallAttempts < 500){
  stallAttempts++;
  const ang = Math.random()*Math.PI*2;
  const r = (CASTLE_RADIUS+3) + Math.random()*(roadRadius-14-CASTLE_RADIUS);
  const x = Math.cos(ang)*r, z = Math.sin(ang)*r;
  if(stallSpots.some(sp=>Math.hypot(sp.x-x,sp.z-z) < 9)) continue;
  if(pointNearCastle(x,z,2)) continue;
  const stall = makeMarketStall(stallPalettes[stallsPlaced % stallPalettes.length]);
  stall.position.set(x,0,z);
  stall.rotation.y = Math.random()*Math.PI*2;
  stallGroup.add(stall);
  stallSpots.push({x,z});
  stallsPlaced++;
}
scene.add(stallGroup);

/* ---------- Fireflies: small glowing points drifting over the plaza,
   a cheap but effective way to add sunset-evening atmosphere. ---------- */
const fireflyGeo = new THREE.BufferGeometry();
const FIREFLY_COUNT = 90;
const fireflyPos = new Float32Array(FIREFLY_COUNT*3);
const fireflyData = [];
for(let i=0;i<FIREFLY_COUNT;i++){
  const ang = Math.random()*Math.PI*2;
  const r = 10 + Math.random()*120;
  const x = Math.cos(ang)*r, z = Math.sin(ang)*r;
  const y = 0.6 + Math.random()*2.2;
  fireflyPos[i*3]=x; fireflyPos[i*3+1]=y; fireflyPos[i*3+2]=z;
  fireflyData.push({baseX:x, baseZ:z, baseY:y, phase:Math.random()*Math.PI*2, speed:0.4+Math.random()*0.5});
}
fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPos,3));
const fireflyMat = new THREE.PointsMaterial({color:0xfff2a8, size:0.35, transparent:true, opacity:0.85, sizeAttenuation:true, depthWrite:false});
const fireflies = new THREE.Points(fireflyGeo, fireflyMat);
scene.add(fireflies);

/** Called every frame from main.js */
function updateFireflies(delta, t){
  const pos = fireflyGeo.attributes.position;
  for(let i=0;i<FIREFLY_COUNT;i++){
    const d = fireflyData[i];
    pos.setX(i, d.baseX + Math.sin(t*d.speed + d.phase)*1.4);
    pos.setY(i, d.baseY + Math.sin(t*d.speed*1.7 + d.phase)*0.5);
    pos.setZ(i, d.baseZ + Math.cos(t*d.speed + d.phase)*1.4);
  }
  pos.needsUpdate = true;
  fireflyMat.opacity = 0.6 + Math.sin(t*2)*0.25;
}
