/* =========================================================
   SHOPS: label sprites + detailed cottage-shop generator
   One shop is built per entry in SHOPS (see data.js).
========================================================= */

const shopMeshes = [];
const shopPositions = SHOPS.map(s=>{
  const a = THREE.MathUtils.degToRad(s.angle);
  const r = roadRadius + 13;
  return new THREE.Vector3(Math.cos(a)*r, 0, Math.sin(a)*r);
});

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}

function makeLabelSprite(text){
  const cnv = document.createElement('canvas');
  const ctx = cnv.getContext('2d');
  cnv.width = 512; cnv.height = 128;
  ctx.font = "700 54px 'Baloo 2', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const metrics = ctx.measureText(text);
  const padX = 40;
  const boxW = Math.min(500, metrics.width + padX*2);
  const bx = (cnv.width-boxW)/2;
  ctx.fillStyle = "rgba(31,41,55,0.92)";
  roundRect(ctx, bx, 26, boxW, 66, 20);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, cnv.width/2, 60, boxW-padX);
  const tex = new THREE.CanvasTexture(cnv);
  tex.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({map:tex, depthTest:false});
  const spr = new THREE.Sprite(mat);
  spr.scale.set(6.4,1.6,1);
  spr.renderOrder = 10;
  return spr;
}

function buildShop(s){
  // Local space convention: local -Z is the FRONT of the shop.
  // The group gets g.lookAt(center) applied after placement, which makes
  // local -Z point toward the road automatically — so every "front"
  // element below is simply placed at negative z.
  const g = new THREE.Group();
  const BASE_H = 0.32;
  const bw = 6.4, bd = 5.6, bh = 4.0;

  const stoneMat = new THREE.MeshStandardMaterial({color:0xf0e6d0, flatShading:true, roughness:0.95});
  const woodMat  = new THREE.MeshStandardMaterial({color:0x6b4a30, flatShading:true, roughness:0.9});
  const trimMat  = new THREE.MeshStandardMaterial({color:0xffffff, flatShading:true, roughness:0.8});
  const glowMat  = new THREE.MeshStandardMaterial({color:0xfff2b8, emissive:0xffdd66, emissiveIntensity:0.55, flatShading:true});
  const bodyMat  = new THREE.MeshStandardMaterial({color:s.color, flatShading:true, roughness:0.85});
  const roofMat  = new THREE.MeshStandardMaterial({color:s.roof, flatShading:true, roughness:0.85});
  const awningMat= new THREE.MeshStandardMaterial({color:s.roof, flatShading:true, roughness:0.7});

  // porch / base platform (slightly wider than the building footprint)
  const base = new THREE.Mesh(new THREE.BoxGeometry(bw+1.1, BASE_H, bd+1.1), stoneMat);
  base.position.y = BASE_H/2;
  base.receiveShadow = true;
  g.add(base);

  // a couple of stone steps leading out the front
  for(let i=0;i<2;i++){
    const step = new THREE.Mesh(new THREE.BoxGeometry(2.4-i*0.5, 0.16, 0.6), stoneMat);
    step.position.set(0, BASE_H - i*0.16 - 0.08, -(bd/2+0.55) - i*0.55);
    step.receiveShadow = true;
    g.add(step);
  }

  // flagstone walkway toward the road
  for(let i=0;i<3;i++){
    const fs = new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.55,0.12,6), stoneMat);
    fs.position.set((i%2===0? -0.3:0.3), 0.06, -(bd/2+2.1) - i*1.5);
    fs.receiveShadow = true;
    g.add(fs);
  }

  // main body
  const body = new THREE.Mesh(new THREE.BoxGeometry(bw,bh,bd), bodyMat);
  body.position.y = BASE_H + bh/2;
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);

  // white corner trim posts
  [[-bw/2,-bd/2],[bw/2,-bd/2],[-bw/2,bd/2],[bw/2,bd/2]].forEach(([x,z])=>{
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.32,bh,0.32), trimMat);
    post.position.set(x, BASE_H+bh/2, z);
    g.add(post);
  });

  // pitched roof, scaled to fit the rectangular footprint
  const roof = new THREE.Mesh(new THREE.ConeGeometry(5.1,2.5,4), roofMat);
  roof.rotation.y = Math.PI/4;
  roof.scale.set((bw+1.2)/7.2, 1, (bd+1.2)/7.2);
  roof.position.y = BASE_H + bh + 1.25;
  roof.castShadow = true;
  g.add(roof);
  // roof cap ridge
  const cap = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5), roofMat);
  cap.position.y = BASE_H + bh + 2.5;
  g.add(cap);

  // chimney on alternating shops for variety
  if(s.chimney){
    const chim = new THREE.Mesh(new THREE.BoxGeometry(0.7,1.6,0.7), stoneMat);
    chim.position.set(bw/3, BASE_H+bh+1.9, bd/4);
    chim.castShadow = true;
    g.add(chim);
  }

  // front wall fascia board above the door (physical shop sign, close-range)
  const fascia = new THREE.Mesh(new THREE.BoxGeometry(3.4,0.7,0.14), awningMat);
  fascia.position.set(0, BASE_H+bh-0.55, -bd/2-0.02);
  g.add(fascia);

  // windows flanking the door
  [-1.85, 1.85].forEach(x=>{
    const win = new THREE.Mesh(new THREE.BoxGeometry(1.0,1.15,0.12), glowMat);
    win.position.set(x, BASE_H+2.0, -bd/2-0.02);
    g.add(win);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.24,1.4,0.08), trimMat);
    frame.position.set(x, BASE_H+2.0, -bd/2-0.09);
    g.add(frame);
    const mv = new THREE.Mesh(new THREE.BoxGeometry(0.06,1.15,0.14), trimMat);
    mv.position.set(x, BASE_H+2.0, -bd/2-0.01);
    g.add(mv);
    const mh = new THREE.Mesh(new THREE.BoxGeometry(1.0,0.06,0.14), trimMat);
    mh.position.set(x, BASE_H+2.0, -bd/2-0.01);
    g.add(mh);
  });

  // door
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.5,2.15,0.16), woodMat);
  door.position.set(0, BASE_H+1.08, -bd/2-0.02);
  g.add(door);
  const doorKnob = new THREE.Mesh(new THREE.SphereGeometry(0.07,6,6), trimMat);
  doorKnob.position.set(0.55, BASE_H+1.05, -bd/2-0.14);
  g.add(doorKnob);

  // awning canopy over the door
  const awning = new THREE.Mesh(new THREE.BoxGeometry(2.3,0.16,1.05), awningMat);
  awning.position.set(0, BASE_H+2.35, -bd/2-0.55);
  awning.rotation.x = -0.12;
  awning.castShadow = true;
  g.add(awning);
  [-1.0,1.0].forEach(x=>{
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,2.1,5), trimMat);
    pole.position.set(x, BASE_H+1.3, -bd/2-0.98);
    g.add(pole);
  });

  // flower boxes at the porch corners
  [[-bw/2-0.2,-bd/2-0.2],[bw/2+0.2,-bd/2-0.2]].forEach(([x,z])=>{
    const planter = new THREE.Mesh(new THREE.BoxGeometry(0.9,0.4,0.5), woodMat);
    planter.position.set(x, BASE_H+0.2, z);
    g.add(planter);
    const flowerColors = [0xff6b6b,0xffd43b,0xffffff];
    for(let i=0;i<3;i++){
      const bloom = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16,0), new THREE.MeshStandardMaterial({color:flowerColors[i%3], flatShading:true}));
      bloom.position.set(x-0.3+i*0.3, BASE_H+0.5, z);
      g.add(bloom);
    }
  });

  // sign / icon sprite (readable from a distance)
  const label = makeLabelSprite(s.icon + " " + s.name);
  label.position.set(0, BASE_H+bh+3.4, 0);
  g.add(label);

  g.traverse(o=>{ if(o.isMesh){ o.castShadow = true; } });
  return {group:g, door};
}

SHOPS.forEach((s,i)=>{
  const pos = shopPositions[i];
  s.chimney = (i % 2 === 0);
  const {group:g, door} = buildShop(s);

  g.position.copy(pos);
  g.lookAt(0, g.position.y, 0);
  g.updateMatrixWorld(true);
  scene.add(g);

  const doorPos = door.getWorldPosition(new THREE.Vector3());
  shopMeshes.push({group:g, data:s, doorPos});
});
