/* =========================================================
   UI: shop content panel + HUD wiring
   (DOM only — no THREE.js dependency in here)
========================================================= */

const overlay = document.getElementById('overlay');
const panelTag = document.getElementById('panel-tag');
const panelTitle = document.getElementById('panel-title');
const panelBody = document.getElementById('panel-body');
const promptEl = document.getElementById('prompt');
const promptText = document.getElementById('prompt-text');
const promptActionBtn = document.getElementById('prompt-action');
const detailsActionBtn = document.getElementById('details-action');
const topViewActionBtn = document.getElementById('top-view-action');
const soundBtn = document.getElementById('sound-toggle');
const welcomeEl = document.getElementById('welcome');
const questTrackerEl = document.getElementById('quest-tracker');
const questToastEl = document.getElementById('quest-toast');

let topViewEnabled = false;

/* ---- Quest state ---- */
const questState = {
  visited: new Set(),
  readyForReward: false,
  rewardGiven: false
};

function markShopVisited(key){
  if(!SHOPS.some(s=>s.key===key)) return;
  const wasNew = !questState.visited.has(key);
  questState.visited.add(key);
  renderQuestTracker();
  if(wasNew && questState.visited.size === SHOPS.length && !questState.rewardGiven){
    questState.readyForReward = true;
    showQuestToast("All six shops explored! Ride back to " + KING_NAME + " for your reward.");
  }
}

function renderQuestTracker(){
  const items = SHOPS.map(s=>{
    const done = questState.visited.has(s.key);
    return `<div class="quest-item${done?' done':''}">${done?'✔':'○'} ${s.icon} ${s.name}</div>`;
  }).join("");
  questTrackerEl.innerHTML = `<div class="quest-heading">${KING_NAME}'s Quest</div>${items}`;
}

let questToastTimer = null;
function showQuestToast(msg){
  questToastEl.textContent = msg;
  questToastEl.classList.add('show');
  clearTimeout(questToastTimer);
  questToastTimer = setTimeout(()=>questToastEl.classList.remove('show'), 6000);
}

document.getElementById('panel-close').addEventListener('click', closePanel);
overlay.addEventListener('click', (e)=>{ if(e.target===overlay) closePanel(); });
soundBtn.addEventListener('click', toggleAudio);
promptActionBtn.addEventListener('click', openNearestInteract);
detailsActionBtn.addEventListener('click', openNearestInteract);
topViewActionBtn.addEventListener('click', toggleTopView);

function closePanel(){ overlay.classList.remove('show'); controlsLocked = false; }

function openNearestInteract(){
  if(activeInteract) activeInteract.action();
}

function toggleTopView(){
  topViewEnabled = !topViewEnabled;
  setCameraMode(topViewEnabled ? 'top' : 'follow');
  topViewActionBtn.classList.toggle('is-active', topViewEnabled);
  topViewActionBtn.textContent = topViewEnabled ? '🛡️ Follow View' : '🌐 Top View';
}

function openShop(key){
  controlsLocked = true;
  markShopVisited(key);
  const shop = SHOPS.find(s=>s.key===key);
  panelTag.textContent = shop.name;
  let title = "", body = "";

  if(key==="about"){
    title = "About " + PROFILE.name.split(" ")[0];
    body += `<p class="lead">${PROFILE.summary}</p>`;
    body += `<div class="group-label">Location</div><div class="chip-row"><span class="chip">📍 ${PROFILE.location}</span></div>`;
    body += `<div class="group-label">Achievements</div>`;
    body += PROFILE.achievements.map(a=>`<div class="card"><p style="margin-bottom:0">✓ ${a}</p></div>`).join("");
    body += `<div class="group-label">Languages</div><div class="chip-row">${PROFILE.languages.map(l=>`<span class="chip">${l}</span>`).join("")}</div>`;
  }

  if(key==="skills"){
    title = "Skills Workshop";
    body += `<p class="lead">Tools and domains I build with, from embedded hardware to AI software.</p>`;
    for(const group in SKILLS){
      body += `<div class="group-label">${group}</div><div class="chip-row">${SKILLS[group].map(s=>`<span class="chip">${s}</span>`).join("")}</div>`;
    }
    body += `<div class="group-label">Soft Skills</div><div class="chip-row">${PROFILE.softSkills.map(s=>`<span class="chip">${s}</span>`).join("")}</div>`;
  }

  if(key==="projects"){
    title = "Projects Arcade";
    body += `<p class="lead">A few things I've built, from embedded alerts to local-first AI tools.</p>`;
    body += PROJECTS.map(p=>`
      <div class="card">
        <div class="cat">${p.category}</div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <a href="${p.link}" target="_blank" rel="noopener">View on GitHub ↗</a>
      </div>`).join("");
  }

  if(key==="certificates"){
    title = "Certificates Hall";
    body += `<p class="lead">Courses and certifications I've completed along the way.</p>`;
    body += CERTIFICATES.map(c=>`
      <div class="card">
        <div class="meta">${c.issuer} · ${c.issueDate}</div>
        <h3>${c.title}</h3>
        <p>${c.description}</p>
        <a href="${c.credentialURL}" target="_blank" rel="noopener">View credential ↗</a>
      </div>`).join("");
  }

  if(key==="education"){
    title = "Education Library";
    body += `<div class="card">
        <div class="cat">B.Tech</div>
        <h3>${PROFILE.education.degree}</h3>
        <p>${PROFILE.education.school}</p>
      </div>`;
    body += `<div class="group-label">Continuous Learning</div><div class="chip-row">${PROFILE.softSkills.map(s=>`<span class="chip">${s}</span>`).join("")}</div>`;
  }

  if(key==="contact"){
    title = "Contact Post Office";
    body += `<p class="lead">Let's talk — reach me on any of these.</p>`;
    body += `
      <div class="contact-row"><div class="ico">✉️</div><a href="mailto:${PROFILE.email}">${PROFILE.email}</a></div>
      <div class="contact-row"><div class="ico">💼</div><a href="${PROFILE.linkedin}" target="_blank" rel="noopener">LinkedIn Profile</a></div>
      <div class="contact-row"><div class="ico">🐙</div><a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub Profile</a></div>
      <div class="contact-row"><div class="ico">🌐</div><a href="${PROFILE.site}" target="_blank" rel="noopener">Live Portfolio Site</a></div>
    `;
  }

  panelTitle.textContent = title;
  panelBody.innerHTML = body;
  overlay.classList.add('show');
}

/* ---- The King: intro mission, progress check-in, and the reward ---- */
function openKingDialog(){
  controlsLocked = true;
  panelTag.textContent = "The Castle";
  let title = "", body = "";

  if(questState.readyForReward && !questState.rewardGiven){
    questState.rewardGiven = true;
    openTreasureChest();
    title = QUEST_TEXT.rewardTitle;
    body = `<p class="lead">${QUEST_TEXT.reward}</p>
      <div class="group-label">Claim your treasure</div>
      <div class="contact-row"><div class="ico">✉️</div><a href="mailto:${PROFILE.email}">${PROFILE.email}</a></div>
      <div class="contact-row"><div class="ico">💼</div><a href="${PROFILE.linkedin}" target="_blank" rel="noopener">LinkedIn Profile</a></div>
      <div class="contact-row"><div class="ico">🐙</div><a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub Profile</a></div>
      <div class="contact-row"><div class="ico">🌐</div><a href="${PROFILE.site}" target="_blank" rel="noopener">Live Portfolio Site</a></div>`;
  } else if(questState.rewardGiven){
    title = QUEST_TEXT.rewardTitle;
    body = `<p class="lead">${QUEST_TEXT.rewardAlreadyGiven}</p>`;
  } else if(questState.visited.size === 0){
    title = QUEST_TEXT.introTitle;
    body = `<p class="lead">${QUEST_TEXT.intro}</p>
      <div class="group-label">Your Quest</div>
      <div class="chip-row">${SHOPS.map(s=>`<span class="chip">${s.icon} ${s.name}</span>`).join("")}</div>`;
  } else {
    const remaining = SHOPS.filter(s=>!questState.visited.has(s.key)).map(s=>s.name);
    title = QUEST_TEXT.progressTitle;
    body = `<p class="lead">${QUEST_TEXT.notDoneYet(remaining)}</p>
      <div class="group-label">Progress</div>
      <div class="chip-row">${SHOPS.map(s=>`<span class="chip">${questState.visited.has(s.key)?'✔':'○'} ${s.icon} ${s.name}</span>`).join("")}</div>`;
  }

  panelTitle.textContent = title;
  panelBody.innerHTML = body;
  overlay.classList.add('show');
}

/* ---- Shopkeepers: a short in-character nudge toward their shop ---- */
function openShopkeeperDialog(shop){
  controlsLocked = true;
  panelTag.textContent = shop.name + " Keeper";
  panelTitle.textContent = "\"" + SHOPKEEPER_LINES[shop.key] + "\"";
  panelBody.innerHTML = questState.visited.has(shop.key)
    ? `<p class="lead">You've already been inside — feel free to stop by again any time.</p>`
    : `<p class="lead">Step up to the door and tap <b>View Details</b> (or press <b>E</b>) to go in.</p>`;
  overlay.classList.add('show');
}

/* ---- Welcome bubble: shown once, dismissed on first move or after a timeout ---- */
let firstMoveHandled = false;
function notifyFirstMove(){
  if(firstMoveHandled) return;
  firstMoveHandled = true;
  hideWelcome();
}
function hideWelcome(){
  welcomeEl.classList.add('hide');
  setTimeout(()=>{ welcomeEl.style.display = 'none'; }, 600);
}
document.getElementById('welcome-dismiss').addEventListener('click', hideWelcome);
setTimeout(hideWelcome, 7000);
