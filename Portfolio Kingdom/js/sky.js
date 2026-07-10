/* =========================================================
   SKY: sunset gradient dome, glowing low sun, warm-tinted
   drifting clouds, and a scatter of early evening stars.
========================================================= */

/* ---- Gradient sky dome: deep dusk blue-violet up top,
   fading through amber/rose down to the horizon ---- */
const SKY_TOP = new THREE.Color(0x2a2f63);
const SKY_MID = new THREE.Color(0xd9713f);
const SKY_HORIZON = new THREE.Color(0xffd08a);
const domeGeo = new THREE.SphereGeometry(300, 32, 20);
const domePos = domeGeo.attributes.position;
const domeColors = new Float32Array(domePos.count*3);
const tmpCol = new THREE.Color();
for(let i=0;i<domePos.count;i++){
  const y = domePos.getY(i);
  const f = THREE.MathUtils.clamp((y+20)/220, 0, 1);
  if(f < 0.32){
    tmpCol.copy(SKY_HORIZON).lerp(SKY_MID, f/0.32);
  } else {
    tmpCol.copy(SKY_MID).lerp(SKY_TOP, Math.pow((f-0.32)/0.68, 0.85));
  }
  domeColors[i*3]=tmpCol.r; domeColors[i*3+1]=tmpCol.g; domeColors[i*3+2]=tmpCol.b;
}
domeGeo.setAttribute('color', new THREE.BufferAttribute(domeColors,3));
const domeMat = new THREE.MeshBasicMaterial({vertexColors:true, side:THREE.BackSide, fog:false, depthWrite:false});
const skyDome = new THREE.Mesh(domeGeo, domeMat);
scene.add(skyDome);
scene.fog.color.set(0xf0955c);

/* ---- Stars: faint pinpricks fading in against the upper dusk sky ---- */
const starGeo = new THREE.BufferGeometry();
const STAR_COUNT = 260;
const starPos = new Float32Array(STAR_COUNT*3);
const starPhase = new Float32Array(STAR_COUNT);
for(let i=0;i<STAR_COUNT;i++){
  const theta = Math.random()*Math.PI*2;
  // bias toward the upper half of the dome, away from the sunset glow
  const phi = Math.acos(THREE.MathUtils.lerp(0.15, 0.92, Math.random()));
  const r = 280;
  starPos[i*3]   = r*Math.sin(phi)*Math.cos(theta);
  starPos[i*3+1] = r*Math.cos(phi);
  starPos[i*3+2] = r*Math.sin(phi)*Math.sin(theta);
  starPhase[i] = Math.random()*Math.PI*2;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos,3));
const starMat = new THREE.PointsMaterial({color:0xfff6e0, size:1.6, transparent:true, opacity:0.55, fog:false, depthWrite:false, sizeAttenuation:false});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

/* ---- Sun (glowing disc + soft halo), sitting low on the horizon
   as if it's just about to set behind the kingdom ---- */
const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(9,16,16),
  new THREE.MeshBasicMaterial({color:0xffd27a, fog:false})
);
sunMesh.position.set(-95, 26, -70);
scene.add(sunMesh);

function makeGlowSprite(size, innerColor, outerColor){
  const cnv = document.createElement('canvas');
  cnv.width = cnv.height = 256;
  const ctx = cnv.getContext('2d');
  const grad = ctx.createRadialGradient(128,128,0,128,128,128);
  grad.addColorStop(0, innerColor);
  grad.addColorStop(1, outerColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,256,256);
  const tex = new THREE.CanvasTexture(cnv);
  const mat = new THREE.SpriteMaterial({map:tex, transparent:true, depthWrite:false, fog:false});
  const spr = new THREE.Sprite(mat);
  spr.scale.set(size,size,1);
  return spr;
}
const sunGlow = makeGlowSprite(95, 'rgba(255,178,110,0.75)', 'rgba(255,120,90,0)');
sunGlow.position.copy(sunMesh.position);
scene.add(sunGlow);
// a second, wider halo for a soft amber bloom around the setting sun
const sunGlowWide = makeGlowSprite(160, 'rgba(255,160,110,0.35)', 'rgba(255,120,90,0)');
sunGlowWide.position.copy(sunMesh.position);
scene.add(sunGlowWide);

/* ---- Clouds: soft rounded puffs, tinted peach/rose by the sunset ---- */
const cloudMat = new THREE.MeshStandardMaterial({color:0xffc79a, roughness:0.9, flatShading:false, emissive:0xaa5a2f, emissiveIntensity:0.12});
const cloudShadeMat = new THREE.MeshStandardMaterial({color:0x8a6aa8, roughness:0.9, flatShading:false, emissive:0x4a3060, emissiveIntensity:0.1});
function makeCloud(scale){
  const g = new THREE.Group();
  const puffs = 5 + Math.floor(Math.random()*4);
  for(let i=0;i<puffs;i++){
    const s = (0.65+Math.random()*0.9)*scale;
    const mat = Math.random()<0.25 ? cloudShadeMat : cloudMat;
    const puff = new THREE.Mesh(new THREE.SphereGeometry(s,8,8), mat);
    puff.position.set((Math.random()-0.5)*3.6*scale, (Math.random()-0.5)*0.7*scale, (Math.random()-0.5)*2.0*scale);
    puff.scale.y = 0.75;
    g.add(puff);
  }
  return g;
}

const clouds = [];
// distant ring of clouds
for(let i=0;i<12;i++){
  const mesh = makeCloud(1.7+Math.random()*1.6);
  const angle = Math.random()*Math.PI*2;
  const radius = 90+Math.random()*90;
  const height = 42+Math.random()*22;
  mesh.position.set(Math.cos(angle)*radius, height, Math.sin(angle)*radius);
  scene.add(mesh);
  clouds.push({mesh, angle, radius, height, speed:0.004+Math.random()*0.006, bob: Math.random()*Math.PI*2});
}
// a few closer, larger "hero" clouds for parallax
for(let i=0;i<4;i++){
  const mesh = makeCloud(2.6+Math.random()*1.2);
  const angle = Math.random()*Math.PI*2;
  const radius = 55+Math.random()*25;
  const height = 30+Math.random()*10;
  mesh.position.set(Math.cos(angle)*radius, height, Math.sin(angle)*radius);
  scene.add(mesh);
  clouds.push({mesh, angle, radius, height, speed:0.006+Math.random()*0.008, bob: Math.random()*Math.PI*2});
}

/** Called every frame from main.js */
function updateSky(delta, t){
  for(const c of clouds){
    c.angle += c.speed*delta;
    const bobY = Math.sin(t*0.25 + c.bob)*0.6;
    c.mesh.position.set(Math.cos(c.angle)*c.radius, c.height+bobY, Math.sin(c.angle)*c.radius);
    c.mesh.rotation.y += 0.02*delta;
  }
  skyDome.position.copy(camera.position);
  stars.position.copy(camera.position);
  starMat.opacity = 0.4 + Math.sin(t*0.4)*0.15;
  sunMesh.rotation.y = t*0.02;
}
