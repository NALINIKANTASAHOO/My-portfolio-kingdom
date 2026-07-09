/* =========================================================
   MAIN: animation loop + startup
   Drives the horse, sky, birds, castle banners and citizens.
========================================================= */

const clock = new THREE.Clock();

function animate(){
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  updateHorse(delta);
  updateSky(delta, t);
  updateBirds(delta, t);
  updateCastle(delta, t);
  updateCitizens(delta, t);

  renderer.render(scene, camera);
}

const loadingEl = document.getElementById('loading');
loadingEl.style.opacity = '0';
setTimeout(()=>{ loadingEl.style.display = 'none'; }, 500);

animate();
