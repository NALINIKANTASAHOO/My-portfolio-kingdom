/* =========================================================
   BUILDINGS: extra village houses (non-interactive) scattered
   around the kingdom so it reads as a real, lived-in town
   rather than just six portfolio shops.
========================================================= */

const buildingPositions = [];

const houseStoneMat = new THREE.MeshStandardMaterial({color:0xe8ddc4, flatShading:true, roughness:0.95});
const houseWoodMat  = new THREE.MeshStandardMaterial({color:0x6b4a30, flatShading:true, roughness:0.9});
const houseGlowMat  = new THREE.MeshStandardMaterial({color:0xffd98a, emissive:0xffb24d, emissiveIntensity:0.7, flatShading:true});

const housePalette = [
  {body:0xd8875f, roof:0x7a4a35},
  {body:0xb6c9a4, roof:0x5c6f4a},
  {body:0xe0b98a, roof:0x8a4a3a},
  {body:0xc78fa8, roof:0x6b3a52},
  {body:0x9fb8c9, roof:0x3f5468},
];

function makeVillageHouse(palette, scale){
  const g = new THREE.Group();
  const bw = 3.6*scale, bd = 3.2*scale, bh = 2.4*scale;
  const bodyMat = new THREE.MeshStandardMaterial({color:palette.body, flatShading:true, roughness:0.9});
  const roofMat = new THREE.MeshStandardMaterial({color:palette.roof, flatShading:true, roughness:0.85});

  const base = new THREE.Mesh(new THREE.BoxGeometry(bw+0.4, 0.2, bd+0.4), houseStoneMat);
  base.position.y = 0.1;
  base.receiveShadow = true;
  g.add(base);

  const body = new THREE.Mesh(new THREE.BoxGeometry(bw,bh,bd), bodyMat);
  body.position.y = 0.2 + bh/2;
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(bw*0.85, 1.6*scale, 4), roofMat);
  roof.rotation.y = Math.PI/4;
  roof.scale.set(1, 1, (bd+0.6)/bw);
  roof.position.y = 0.2 + bh + 0.8*scale;
  roof.castShadow = true;
  g.add(roof);

  if(Math.random() < 0.5){
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.4*scale,1.1*scale,0.4*scale), houseStoneMat);
    chimney.position.set(bw/3, 0.2+bh+1.1*scale, bd/4);
    chimney.castShadow = true;
    g.add(chimney);
  }

  // one small glowing window facing whichever way the house ends up rotated
  const win = new THREE.Mesh(new THREE.BoxGeometry(0.6*scale,0.6*scale,0.1), houseGlowMat);
  win.position.set(0, 0.2+bh*0.55, -bd/2-0.02);
  g.add(win);

  const door = new THREE.Mesh(new THREE.BoxGeometry(0.9*scale,1.5*scale,0.12), houseWoodMat);
  door.position.set(bw/2-0.9*scale, 0.2+0.75*scale, -bd/2-0.02);
  g.add(door);

  g.traverse(o=>{ if(o.isMesh) o.castShadow = true; });
  return g;
}

const villageGroup = new THREE.Group();
let housesPlaced = 0, houseAttempts = 0;
while(housesPlaced < 16 && houseAttempts < 1500){
  houseAttempts++;
  const ang = Math.random()*Math.PI*2;
  const r = (roadRadius+9) + Math.random()*70; // outside the ring road, into the countryside
  const x = Math.cos(ang)*r, z = Math.sin(ang)*r;
  if(pointBlockedByRoad(x,z)) continue;
  if(pointNearShops(x,z, shopPositions, 13)) continue;
  if(pointNearCastle(x,z)) continue;
  if(buildingPositions.some(p=>Math.hypot(p.x-x,p.z-z) < 9)) continue;

  const palette = housePalette[Math.floor(Math.random()*housePalette.length)];
  const scale = 0.85 + Math.random()*0.5;
  const house = makeVillageHouse(palette, scale);
  house.position.set(x,0,z);
  house.rotation.y = Math.random()*Math.PI*2;
  villageGroup.add(house);
  buildingPositions.push({x,z});
  addBlocker(x, z, 2.5*scale);
  housesPlaced++;
}
scene.add(villageGroup);
