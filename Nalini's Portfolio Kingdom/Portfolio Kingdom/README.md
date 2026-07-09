# 🚲 Nalini's Portfolio Town

A low-poly 3D portfolio you can ride a bike around. Instead of scrolling
through sections, you pedal through a small town — each shop is a section
of the portfolio (About, Skills, Projects, Certificates, Education, Contact).

Built with plain **HTML / CSS / JavaScript** and **[Three.js](https://threejs.org/)**
(loaded from a CDN). No build step, no framework, no npm install required.

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
| Enter the nearest shop | `E` |
| Close a shop panel | `Esc` or the ✕ button |
| Toggle ambient sound | 🔈 button (bottom center) |

On touch devices, an on-screen D-pad appears automatically in the bottom-right.

---

## Project structure

```
portfolio-town/
├── index.html          # page shell — loads the CSS and JS modules in order
├── README.md
├── css/
│   └── style.css        # all HUD, panel, and loading-screen styling
└── js/
    ├── data.js           # ← EDIT THIS to update your content
    ├── core.js           # THREE.Scene, camera, renderer, lighting
    ├── sky.js             # gradient sky dome, sun, drifting clouds
    ├── world.js           # ground terrain + the ring road
    ├── shops.js            # the shop/cottage generator, built from data.js
    ├── trees.js            # low-poly green pine trees, scattered procedurally
    ├── decor.js            # lamp posts, benches, picket fences, market stalls
    ├── audio.js            # tiny procedural ambient pad (Web Audio API)
    ├── ui.js               # shop content panel + welcome bubble + HUD wiring
    ├── bike.js             # rider character, controls, camera follow
    └── main.js             # animation loop / startup
```

The scripts are loaded as plain `<script src="...">` tags (not ES modules)
so the whole thing also works by just opening the HTML file directly —
no CORS issues with `file://`. They share one global scope in the order
listed above, so that's the order each file's dependencies become available.

---

## Updating your content

Everything shown inside the shops comes from **`js/data.js`** — you don't
need to touch any Three.js code to update your portfolio:

- `PROFILE` — name, title, summary, education, achievements, contact links
- `SKILLS` — grouped skill chips
- `PROJECTS` — pulled from your `projects.json` structure (title, category,
  description, link)
- `CERTIFICATES` — pulled from your `certificates.json` structure (title,
  issuer, date, description, credential URL)
- `SHOPS` — the six buildings themselves: name, icon, colors, and where
  they sit around the ring road (`angle`, in degrees)

To add a 7th shop, add an entry to `SHOPS` in `data.js` with a unique `key`,
then add a matching `if(key==="yourKey"){ ... }` block inside `openShop()`
in `js/ui.js` to render its panel content.

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

- Shops don't physically block the bike — the "enter" trigger is
  proximity-based (get close to a door), so you can ride straight through
  a building.
- The scene is built entirely from primitive geometry (boxes, cones,
  spheres) for a consistent low-poly look — there are no external 3D
  model files to manage or load.
- Tested in recent Chrome/Edge/Firefox. WebGL is required.

---

## Ideas for next steps

- Swap the primitive bike/rider for a small GLTF model
- Add simple collision so the bike stops at shop walls
- Wire the `site` link in `data.js` into an actual multi-page build
- Add a minimap or a day/night toggle
