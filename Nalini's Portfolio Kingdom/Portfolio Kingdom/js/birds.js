/* =========================================================
   BIRDS: small flocks of simple low-poly birds wheeling above
   the town — silhouettes against the sunset sky.
========================================================= */

const birdMat = new THREE.MeshStandardMaterial({color:0x2b2530, flatShading:true, roughness:1});

function makeBird(){
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.09,0.5,5), birdMat);
  body.rotation.x = Math.PI/2;
  g.add(body);
  const wingGeo = new THREE.PlaneGeometry(0.55, 0.16, 1, 1);
  const wingL = new THREE.Mesh(wingGeo, birdMat);
  wingL.position.set(-0.27, 0, 0);
  wingL.rotation.y = 0.15;
  g.add(wingL);
  const wingR = new THREE.Mesh(wingGeo, birdMat);
  wingR.position.set(0.27, 0, 0);
  wingR.rotation.y = -0.15;
  g.add(wingR);
  g.userData.wingL = wingL;
  g.userData.wingR = wingR;
  g.userData.flapPhase = Math.random()*Math.PI*2;
  g.userData.flapSpeed = 5 + Math.random()*2;
  return g;
}

const flocks = [];
const FLOCK_COUNT = 3;
const BIRDS_PER_FLOCK = 6;

for(let f=0; f<FLOCK_COUNT; f++){
  const flockGroup = new THREE.Group();
  const birds = [];
  const baseAngle = Math.random()*Math.PI*2;
  const radius = 45 + Math.random()*70;
  const height = 38 + Math.random()*22;
  const speed = 0.05 + Math.random()*0.05;
  const dir = Math.random() < 0.5 ? 1 : -1;

  for(let i=0;i<BIRDS_PER_FLOCK;i++){
    const b = makeBird();
    // loose V / cluster offsets around the flock leader
    const offset = new THREE.Vector3(
      (Math.random()-0.5)*6 - i*0.9,
      (Math.random()-0.5)*1.6,
      (Math.random()-0.5)*3
    );
    flockGroup.add(b);
    birds.push({mesh:b, offset});
  }
  scene.add(flockGroup);
  flocks.push({group:flockGroup, birds, baseAngle, radius, height, speed, dir});
}

/** Called every frame from main.js */
function updateBirds(delta, t){
  for(const flock of flocks){
    const ang = flock.baseAngle + t*flock.speed*flock.dir;
    const cx = Math.cos(ang)*flock.radius;
    const cz = Math.sin(ang)*flock.radius;
    const bobY = Math.sin(t*0.3 + flock.baseAngle)*2.5;
    flock.group.position.set(cx, flock.height+bobY, cz);
    // orient the whole flock along its direction of travel
    const tangent = Math.atan2(Math.cos(ang)*flock.dir, -Math.sin(ang)*flock.dir);
    flock.group.rotation.y = tangent;

    for(const {mesh, offset} of flock.birds){
      mesh.position.copy(offset);
      const flap = Math.sin(t*mesh.userData.flapSpeed + mesh.userData.flapPhase);
      mesh.userData.wingL.rotation.z = flap*0.7;
      mesh.userData.wingR.rotation.z = -flap*0.7;
      mesh.rotation.z = flap*0.08;
    }
  }
}
