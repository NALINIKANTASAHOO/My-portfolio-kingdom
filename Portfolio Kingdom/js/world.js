/* =========================================================
   WORLD: ground terrain + ring road
========================================================= */

/* ---- Shared collision + interaction registries ----
   Any module that places a solid building/prop calls addBlocker(x,z,radius)
   so the rider can't be walked through it. Any module that places
   something the player can interact with (shop door, NPC) pushes an
   entry into interactTargets — horse.js scans this every frame to find
   the nearest thing in range and shows the HUD prompt for it. */
const blockers = []; // {x,z,radius}
function addBlocker(x, z, radius){ blockers.push({x, z, radius}); }
function pointBlockedByBlockers(x, z, extra = 0){
  for(const b of blockers){
    if(Math.hypot(x - b.x, z - b.z) < b.radius + extra) return true;
  }
  return false;
}

const interactTargets = []; // {pos:Vector3, radius, label, action}

/* ---- Ground ---- */
const groundGeo = new THREE.CircleGeometry(140, 64);
groundGeo.rotateX(-Math.PI/2);
// gentle low-poly undulation out toward the edges
const gpos = groundGeo.attributes.position;
for(let i=0;i<gpos.count;i++){
  const x = gpos.getX(i), z = gpos.getZ(i);
  const d = Math.sqrt(x*x+z*z);
  if(d>50){ gpos.setY(i, Math.sin(x*0.06)*Math.cos(z*0.06)*1.1); }
}
groundGeo.computeVertexNormals();
const ground = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({color:0x4f8a54, flatShading:true, roughness:1}));
ground.receiveShadow = true;
scene.add(ground);

/* ---- Road (closed loop ribbon) ---- */
const roadRadius = 34;
const roadPts = [];
const ctrlCount = 10;
for(let i=0;i<ctrlCount;i++){
  const a = (i/ctrlCount)*Math.PI*2;
  const wobble = 1 + Math.sin(a*3)*0.06;
  roadPts.push(new THREE.Vector3(Math.cos(a)*roadRadius*wobble, 0.05, Math.sin(a)*roadRadius*wobble));
}
const roadCurve = new THREE.CatmullRomCurve3(roadPts, true, 'catmullrom', 0.5);
const roadSamples = roadCurve.getPoints(240);
const roadWidth = 5.2;

function buildRibbon(points, width, y){
  const verts = [], uvs = [];
  for(let i=0;i<points.length;i++){
    const p = points[i];
    const next = points[(i+1)%points.length];
    const dir = new THREE.Vector3().subVectors(next,p).normalize();
    const perp = new THREE.Vector3(-dir.z,0,dir.x);
    const left = new THREE.Vector3().copy(p).addScaledVector(perp, width/2);
    const right = new THREE.Vector3().copy(p).addScaledVector(perp, -width/2);
    verts.push(left.x,y,left.z, right.x,y,right.z);
    uvs.push(0, i/points.length, 1, i/points.length);
  }
  const idx = [];
  const n = points.length;
  for(let i=0;i<n;i++){
    const a=i*2, b=i*2+1, c=((i+1)%n)*2, d=((i+1)%n)*2+1;
    idx.push(a,c,b, b,c,d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts,3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs,2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

const roadGeo = buildRibbon(roadSamples, roadWidth, 0.04);
const road = new THREE.Mesh(roadGeo, new THREE.MeshStandardMaterial({color:0x54545c, roughness:0.95}));
road.receiveShadow = true;
scene.add(road);

// dashed centerline
const dashGroup = new THREE.Group();
for(let i=0;i<roadSamples.length;i+=6){
  const p = roadSamples[i];
  const dash = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.02,1.4), new THREE.MeshBasicMaterial({color:0xffffff}));
  dash.position.set(p.x, 0.07, p.z);
  const next = roadSamples[(i+1)%roadSamples.length];
  dash.lookAt(next.x, 0.07, next.z);
  dashGroup.add(dash);
}
scene.add(dashGroup);

function pointBlockedByRoad(x,z){
  const d = Math.sqrt(x*x+z*z);
  return d > roadRadius-9 && d < roadRadius+9;
}
function pointNearShops(x,z, positions, minDist){
  for(const s of positions){
    if(Math.hypot(x-s.x, z-s.z) < minDist) return true;
  }
  return false;
}
