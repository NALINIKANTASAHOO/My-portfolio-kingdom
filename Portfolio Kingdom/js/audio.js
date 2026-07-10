/* =========================================================
   AUDIO: a soft procedural ambient pad, toggled on/off.
   Generated entirely with the Web Audio API so the project
   doesn't depend on an external music file.
========================================================= */

let audioCtx = null;
let audioNodes = null;
let audioOn = false;

function buildAmbientPad(ctx){
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const notes = [130.81, 164.81, 196.0]; // soft C major-ish drone
  const oscGains = notes.map(freq=>{
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = 0.18;
    osc.connect(g).connect(master);
    osc.start();
    return {osc, g};
  });

  // slow LFO on the master gain for a gentle breathing swell
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.05;
  lfo.connect(lfoGain).connect(master.gain);
  lfo.start();

  return {master, oscGains, lfo};
}

function toggleAudio(){
  if(!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioNodes = buildAmbientPad(audioCtx);
  }
  if(audioCtx.state === 'suspended') audioCtx.resume();

  audioOn = !audioOn;
  const target = audioOn ? 0.22 : 0;
  audioNodes.master.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 0.8);
  soundBtn.textContent = audioOn ? '🔊' : '🔈';
  soundBtn.setAttribute('aria-label', audioOn ? 'Mute ambient sound' : 'Play ambient sound');
}
