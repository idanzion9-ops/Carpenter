# Carpenter

A workshop companion for woodworking projects: browse or add a project, set the size you
actually want to build, and get back a cut list, the timber to buy, and the tools you need —
with a substitute suggested for every tool you don't own.

Runs as a static site. No build step, no framework, no server, no account.

## What it does

**Parametric cut lists.** Every built-in project is defined by its dimensions, not by a fixed
parts table. Drag the length of a bookcase from 800 mm to 1200 mm and the shelves, the edging,
the back panel, the board feet, the sheet count and the estimated cost all follow.

**Timber estimates.** Solid stock is bin-packed against the board length your yard sells, so you
get the number of lengths to buy rather than a raw total. Sheet goods are converted to whole
sheets. Dowels are counted by diameter. Waste allowance and saw kerf are yours to set.

**A tool inventory you tap.** *My workshop* is a pegboard of 47 tools. Tap one to hang it up.
Every project then marks which required tools you're missing — and for each missing tool gives a
real way around it (a clamped straightedge instead of a table saw, dowels instead of a biscuit
joiner, a coping saw instead of a scroll saw). Filter the catalogue to *only what I can build
today*.

**Your own projects.** Add a build with its own parts list, photo, tools and steps. It gets the
same cut-list maths as the catalogue.

**Project feeds.** Point the app at any JSON file of projects — your own, or somebody else's —
from Settings. `data/community-projects.json` is a working example of the format.

**Drawn, not stock-photographed.** Every tool is an original colour illustration, every project
has a generated elevation that follows its own dimensions, and every written step can be tapped
open to reveal a flat-pack style diagram of the technique it describes. Nothing is fetched from an
image host, so it all works offline and none of it can rot.

**Offline, and self-updating.** A service worker caches the app so it keeps working in a shed
with no signal — but it fetches from the network first whenever there is one. Push a change to the
repository and every installed phone picks it up on the next launch, shows an *Update now* bar,
and switches over in place. Nobody has to uninstall and reinstall, and nothing saved is lost.

## Categories

Shelves and wall storage · Cabinets, chests and drawers · Tables and desks · Wooden toys
(animals, cars and trucks, planes, Montessori, puzzles and thinking) · Garden and outdoor ·
Workshop jigs.

## Running it

Locally, any static server will do:

    python3 -m http.server 8000

Then open <http://localhost:8000>. Opening `index.html` directly from the file system works too,
but the browser will block the project feeds (`file://` has no CORS), so only the built-in
catalogue will show.

## Publishing on GitHub Pages

Push the repository, then in **Settings → Pages** choose **Deploy from a branch**, branch `main`,
folder `/ (root)`. The site appears at `https://<user>.github.io/<repo>/` within a minute or two.
`.nojekyll` is included so GitHub serves every file as-is.

## The Android app

`.github/workflows/apk.yml` builds a signed APK on every push to `main` and publishes it at a
permanent link:

    https://github.com/<owner>/<repo>/releases/download/latest/carpenter.apk

The APK is a WebView shell (`android/`) that serves the same web app from a fixed internal origin.
Two consequences, both deliberate:

* **The APK is always signed with `android/keystore.jks`, which is committed to the repository.**
  A rebuilt APK therefore installs *over* the existing app as an update. If the key ever changed,
  Android would refuse the install and demand an uninstall first, taking all saved data with it.
  This is a personal-use key with a known password — do not reuse it for anything published to
  Google Play.
* **The app updates its own content without a new APK.** On every launch it reads `version.json`
  from the repository; if the version differs from what it has, it downloads the repository zip,
  unpacks the web files into internal storage and reloads. Only changes to the Java shell need a
  fresh APK.

Everything saved lives in `localStorage` on the fixed origin `https://appassets.androidplatform.net`,
so it survives both kinds of update.

## Releasing an update

Installed copies update themselves — you only push:

    sh bump.sh                 # stamps today's date into sw.js, version.js and version.json
    git add -A
    git commit -m "Update"
    git push

`bump.sh` is optional (network-first fetching means new files arrive anyway), but bumping the
version sweeps the old cache away cleanly and makes *Settings → App version* meaningful.

On the phone the sequence is: open the app → the service worker checks in the background → an
*Update now* bar appears → tap it → the app reloads on the new version. Settings also has a manual
**Check for updates**. Saved tools, dimensions, build notes and personal projects are in
`localStorage` and are never cleared by an update; `store.js` merges in any new fields a later
version adds, so older saved data keeps working.

## Adding a project to the built-in catalogue

Projects live in `assets/js/projects.js`. All internal units are millimetres.

```js
{
  id: "my-project",
  title: "Shaker wall shelf",
  cat: "shelving",              // id from CATEGORIES
  sub: "cars",                  // optional, only used by toys
  level: 2,                     // 1–5
  hours: "4 h",
  wood: "Pine, 20 mm",
  blurb: "One sentence about what it is.",
  paramDefs: [
    { k: "L", label: "Shelf length", def: 900, min: 400, max: 2000, step: 10 }
  ],
  parts: p => [
    { name: "Shelf",  qty: 1, t: 20, w: 200, l: p.L, stock: "board" },
    { name: "Back",   qty: 1, t: 6,  w: 300, l: p.L, stock: "panel" },
    { name: "Peg",    qty: 4, d: 16, l: 90,          stock: "dowel" }
  ],
  hardware: p => [{ name: "60 mm screws", qty: 4 }],
  tools: { req: ["tape", "handsaw", "drill"], nice: ["router"] },
  steps: ["First step.", "Second step."],
  finish: "Oil.",
  safety: "Something to watch out for.",
  source: { label: "Where the idea came from", url: "https://example.com" }
}
```

`stock` is `board` (solid lumber sold by length), `panel` (sheet goods) or `dowel` (uses `d` for
diameter instead of `t` and `w`). `parts` and `hardware` are functions of the current dimensions,
which is what makes the cut list live.

## Feed format

A feed is JSON — either an array of projects, or `{ "projects": [ … ] }`. Feed projects can't run
code, so they use a fixed `partList` instead of a `parts` function:

```json
{
  "id": "feed-step-stool",
  "title": "Two-step kitchen stool",
  "cat": "shop",
  "level": 2,
  "partList": [
    { "name": "Side", "qty": 2, "t": 18, "w": 300, "l": 450, "stock": "panel" }
  ],
  "hardwareList": [{ "name": "50 mm screws", "qty": 20 }],
  "tools": { "req": ["drill", "clamps"], "nice": ["router"] },
  "steps": ["…"]
}
```

The file must be served with permissive CORS. Raw GitHub URLs
(`https://raw.githubusercontent.com/…`) work well.

## Your data

Tools owned, saved dimensions, build status, notes and personal projects are kept in this
browser's `localStorage` and are never sent anywhere. Settings has export, import and erase.
Photos are downscaled to 900 px and stored as data URLs, so a few dozen is a sensible limit.

## Files

```
index.html                  app shell and navigation
manifest.webmanifest        installable web app metadata
sw.js                       offline cache and update channel
version.json                version the running app compares itself against
bump.sh                     stamps a new version into sw.js, version.js and version.json
assets/js/version.js        the version the app reports in Settings
assets/css/style.css        all styling
assets/js/icons.js          line-art tool icons (small inline use)
assets/js/art-tools.js      full-colour tool illustrations
assets/js/art-projects.js   generated project elevations, driven by the dimensions
assets/js/art-steps.js      assembly diagrams, matched to each step by what it asks you to do
assets/logo.svg             the plane-and-shaving mark
assets/js/tools.js          tool library and substitutions
assets/js/projects.js       built-in project catalogue
assets/js/calc.js           cut list maths, bin packing, board feet
assets/js/store.js          localStorage layer
assets/js/app.js            router and views
data/community-projects.json  example feed
```

## A word on the numbers

Cut lists are estimates from nominal dimensions. Real boards are rarely the size on the label,
plywood is often 17.8 mm rather than 18 mm, and wood moves. Check a critical dimension against
the actual material before cutting, and never let a calculated number override a story stick.

Toy dimensions include choke-hazard notes, but they are guidance, not certification. If you sell
toys, check EN 71 or ASTM F963 for yourself.

## Licence

MIT. See `LICENSE`.
