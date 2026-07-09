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
const soundBtn = document.getElementById('sound-toggle');
const welcomeEl = document.getElementById('welcome');

document.getElementById('panel-close').addEventListener('click', closePanel);
overlay.addEventListener('click', (e)=>{ if(e.target===overlay) closePanel(); });
soundBtn.addEventListener('click', toggleAudio);

function closePanel(){ overlay.classList.remove('show'); controlsLocked = false; }

function openShop(key){
  controlsLocked = true;
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
