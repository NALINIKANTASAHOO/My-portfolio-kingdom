/* =========================================================
   TREES: low-poly green pines, scattered around the town
========================================================= */

function makeTree(scale){
  const g = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({color:0x7a4a2b, flatShading:true, roughness:1});
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.22,1.1,6), trunkMat);
  trunk.position.y = 0.55;
  trunk.castShadow = true;
  g.add(trunk);

  const greens = [0x2f9e44, 0x37b24d, 0x2b8a3e];
  const tiers = 3;
  for(let i=0;i<tiers;i++){
    const r = (1.35 - i*0.32);
    const h = 1.5 - i*0.18;
    const mat = new THREE.MeshStandardMaterial({color:greens[i%greens.length], flatShading:true, roughness:1});
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), mat);
    cone.position.y = 1.15 + i*0.85;
    cone.castShadow = true;
    g.add(cone);
  }
  g.scale.setScalar(scale);
  return g;
}

const treeGroup = new THREE.Group();
let placed = 0, attempts = 0;
while(placed < 90 && attempts < 2000){
  attempts++;
  const ang = Math.random()*Math.PI*2;
  const r = 8 + Math.random()*125;
  const x = Math.cos(ang)*r, z = Math.sin(ang)*r;
  if(pointBlockedByRoad(x,z)) continue;
  if(pointNearShops(x,z, shopPositions, 11)) continue;
  if(pointNearCastle(x,z, 4)) continue;
  if(pointNearShops(x,z, buildingPositions, 6)) continue;
  if(r > 132) continue;
  const t = makeTree(0.8 + Math.random()*0.9);
  t.position.set(x,0,z);
  t.rotation.y = Math.random()*Math.PI*2;
  treeGroup.add(t);
  placed++;
}
scene.add(treeGroup);
