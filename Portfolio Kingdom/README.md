# 🏰 Nalini's Portfolio Kingdom

A low-poly 3D portfolio you ride a horse around. Instead of scrolling
through sections, you spawn inside a castle, meet the King, and set out
on a small quest to explore the kingdom — each shop is a section of the
portfolio (About, Skills, Projects, Certificates, Education, Contact).

Built with plain **HTML / CSS / JavaScript** and **[Three.js](https://threejs.org/)**
(loaded from a CDN). No build step, no framework, no npm install required.

---

## The story

- You **spawn inside the castle courtyard**, face to face with **the King**.
- The King explains the quest: ride out and visit all **six shops** around
  the kingdom.
- A **shopkeeper stands near every shop** and will nudge you toward their
  door if you talk to them.
- A **quest tracker** (top-right) checks off each shop as you visit it.
- Once all six are visited, ride back to the King — his **treasure chest**
  creaks open and he rewards you with every way to get in touch.

---

## How to run it

**Easiest:** just double-click `index.html` and open it in a browser.

**Recommended:** serve it with any static file server (avoids a couple of
browsers' stricter `file://` rules and is closer to how it'll behave once
deployed):

```bash
# from inside the project folder
python3 -m http.server 8080
# then open http://localhost:8080
```

or with Node:

```bash
npx serve .
```

It needs an internet connection the first time it loads, since the Three.js
library and the Google Fonts are pulled from a CDN.

---

## Controls

| Action | Key |
|---|---|
| Ride forward / back | `W` / `S` or `↑` / `↓` |
| Turn left / right | `A` / `D` or `←` / `→` |
| Talk / enter the nearest shop or NPC | `E` |
| Close a dialog panel | `Esc` or the ✕ button |
| Toggle ambient sound | 🔈 button (bottom center) |

On touch devices, an on-screen D-pad appears automatically in the bottom-right.

---

## Project structure

```
portfolio-kingdom/
├── index.html          # page shell — loads the CSS and JS modules in order
├── README.md
├── css/
│   └── style.css        # all HUD, panel, quest-tracker, and loading-screen styling
└── js/
    ├── data.js           # ← EDIT THIS to update your content and quest text
    ├── core.js           # THREE.Scene, camera, renderer, lighting, tone mapping
    ├── sky.js             # gradient sky dome, sun, drifting clouds
    ├── birds.js           # flocks of low-poly birds wheeling overhead
    ├── world.js           # ground terrain, ring road, shared collision/interact registries
    ├── castle.js           # the King's keep, walls, gate torches, banners
    ├── shops.js             # the shop/cottage generator, built from data.js
    ├── npc.js                # the King, shopkeepers, and the treasure chest
    ├── buildings.js           # extra village houses (non-interactive)
    ├── trees.js                # low-poly pine trees, scattered procedurally
    ├── decor.js                 # lamp posts, benches, fences, stalls, fireflies
    ├── citizens.js                # wandering villagers (ambient only)
    ├── audio.js                    # tiny procedural ambient pad (Web Audio API)
    ├── ui.js                        # dialog panel, quest state, HUD wiring
    ├── horse.js                      # rider character, controls, collision, camera
    └── main.js                        # animation loop / startup
```

The scripts are loaded as plain `<script src="...">` tags (not ES modules)
so the whole thing also works by just opening the HTML file directly —
no CORS issues with `file://`. They share one global scope in the order
listed above, so that's the order each file's dependencies become available.

---

## Collision & pathing

`world.js` exposes a shared `blockers` registry (`addBlocker(x, z, radius)` /
`pointBlockedByBlockers(x, z)`). Every shop, village house, castle tower,
the King, the chest, and every shopkeeper register a blocker, so the rider
now stops at walls and NPCs instead of riding straight through them —
this replaces the old "shops don't block the bike" limitation. The King's
courtyard, the gate, and the ring road stay open so there's always a clear
route from the spawn point out to every shop and back.

---

## Updating your content

Everything shown inside the shops (and the King/shopkeeper dialog) comes
from **`js/data.js`** — you don't need to touch any Three.js code to update
your portfolio:

- `PROFILE` — name, title, summary, education, achievements, contact links
- `SKILLS` — grouped skill chips
- `PROJECTS` — pulled from your `projects.json` structure (title, category,
  description, link)
- `CERTIFICATES` — pulled from your `certificates.json` structure (title,
  issuer, date, description, credential URL)
- `SHOPS` — the six buildings themselves: name, icon, colors, and where
  they sit around the ring road (`angle`, in degrees)
- `KING_NAME`, `QUEST_TEXT`, `SHOPKEEPER_LINES` — everything the King and
  the shopkeepers say

To add a 7th shop, add an entry to `SHOPS` in `data.js` with a unique `key`,
a matching `if(key==="yourKey"){ ... }` block inside `openShop()` in
`js/ui.js`, and a line in `SHOPKEEPER_LINES` for its shopkeeper.

---

## What's original here vs. what it's inspired by

This was built from scratch as vanilla Three.js — it does **not** reuse any
code or 3D models from other projects. Two small touches were inspired by
the structure of a popular open-source Three.js portfolio template (a
rotating-island scene by JavaScript Mastery): a one-time welcome bubble on
load, and a bottom-center ambient sound toggle. Both are implemented
independently here — the welcome bubble is plain DOM/CSS, and the sound
is generated procedurally with the Web Audio API rather than an audio file.

---

## Known limitations

- Collision is circle-based (each building/NPC blocks a radius around its
  center), not exact mesh collision — it stops the rider at the wall but
  won't perfectly hug an irregular footprint.
- The scene is built entirely from primitive geometry (boxes, cones,
  spheres) for a consistent low-poly look — there are no external 3D
  model files to manage or load, so it won't look like a AAA/anime MMO;
  the graphics pass here focuses on lighting (filmic tone mapping), gate
  torches, and firefly particles within that same low-poly style.
- Tested in recent Chrome/Edge/Firefox. WebGL is required.

---

## Ideas for next steps

- Swap the primitive horse/rider for a small GLTF model
- Add a minimap or a day/night toggle
- Give the King a second quest once the first reward is claimed
- Save quest progress to `localStorage` so it persists on reload

