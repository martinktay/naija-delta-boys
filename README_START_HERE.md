# NAIJA DELTA BOYS — official Phaser template overlay

This ZIP is an **overlay** for the official Phaser + React + TypeScript starter at https://github.com/phaserjs/template-react-ts . It is NOT a replacement for the official project's `src/` or `package.json`.

## 1. Prepare the official repository
Install Node.js LTS and Git first. In VS Code PowerShell or another terminal:

```powershell
git clone https://github.com/phaserjs/template-react-ts.git naija-delta-boys
cd naija-delta-boys
npm install
npm run dev
```

Open the local URL shown by Vite (the official template currently defaults to http://localhost:8080). Confirm the original demo works **before** adding this overlay. Stop the dev server with Ctrl+C.

If you used GitHub's **Use this template** to create your own repository, clone your own repository instead. Do NOT clone the Phaser engine source repository (`phaserjs/phaser`) for this application.

## 2. Install this asset/instruction overlay
Unzip `Naija_Delta_Boys_Official_Phaser_Overlay.zip` **into the project ROOT**, i.e. beside `package.json` — **not only inside `public/assets/`**.

Example from project root in PowerShell if the ZIP is in your Downloads folder:

```powershell
Expand-Archive -LiteralPath "$env:USERPROFILE\Downloads\Naija_Delta_Boys_Official_Phaser_Overlay.zip" -DestinationPath . -Force
```

This merges (without intentionally replacing upstream source code):

```text
naija-delta-boys/
├─ AGENTS.md                        # Codex instructions (project root)
├─ CODEX_KICKOFF_PROMPT.md         # paste into Codex
├─ README_START_HERE.md            # this guide
├─ asset_manifest.json             # inventory & SHA256
├─ assets/
│  ├─ raw_sheets/                  # 10 source art sheets; NOT published with build
│  └─ references/                  # 2 visual references; NOT game backgrounds
├─ public/
│  └─ assets/
│     └─ naija-delta-boys/
│        ├─ ads/creekconnect_demo.png  # fictional test ad
│        ├─ sprites/              # Codex places extracted objects here
│        └─ maps/                 # optional map exports later
└─ tools/verify_asset_bundle.py    # simple asset audit
```

Do not delete the official template's existing `public/assets` contents, `src/` or `package.json`. The game is named **Naija Delta Boys** even though some existing *source PNG filenames* say `naija_delta_*`; those filenames are kept for manifest compatibility.

## 3. Verify assets before prompting

```powershell
python tools/verify_asset_bundle.py
```

Python 3 is enough for this audit (standard library only). If `python` is not found, try `py tools/verify_asset_bundle.py`.

Verify that the console reports **10 source sheets, 2 references and zero missing/hash-mismatched files**. A corrupt or missing source should be fixed before developing from it.

## 4. Start Codex
Open the `naija-delta-boys` folder in VS Code or the Codex desktop app. Select a capable coding model available to your account (GPT-5.6 Sol is suitable if offered). Codex must have **access to this local project folder**. Paste the complete content of `CODEX_KICKOFF_PROMPT.md` as the first instruction.

The agent should **first inventory/prepare sprites and then create a small playable scene**. Ask to run install/build/dev and inspect screenshots rather than accept an implementation report alone.

## 5. Test the first milestone

```powershell
npm run dev
npm run build
```

Check: world loads; walking and mobile controls; building/water collisions; 3 NPCs; quest reward; billboard image swaps; HUD on small screen. Real-world sponsor branding and incomplete fake walk animations must not ship as finished game art.

## Asset notes
- 10 source sheets are hand-illustrated concept atlases. Individual objects are **not necessarily isolated or consistent in scale**.
- The 2 references are whole-scene images, **never an interactive map texture**.
- Some sprites have coloured fringe artefacts. Inspect each extracted PNG on light and dark backgrounds.
- Characters are mostly static poses. Honest placeholder movement is preferable to broken pseudo-animation.
- Use `public/assets/naija-delta-boys/sprites/` for browser-loaded extracted assets: those are served as `/assets/naija-delta-boys/sprites/...`.
- Do not assume names appearing in concept artwork correspond to licensed brands.
