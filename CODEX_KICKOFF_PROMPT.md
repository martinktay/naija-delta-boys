# CODEX — Naija Delta Boys: Phase 0 + Phase 1 build prompt

You are working INSIDE the official https://github.com/phaserjs/template-react-ts application, with the Naija Delta Boys overlay extracted into the **project root**, not into a new nested project.

**DO THIS FIRST:** Read `AGENTS.md`, `README_START_HERE.md`, `asset_manifest.json`, the upstream official `README.md` and `package.json`. Inspect the actual existing `src/PhaserGame.tsx`, `src/game/main.tsx`, `src/game/EventBus.ts`, `src/game/scenes/`, and the 10 images in `assets/raw_sheets/` plus 2 images in `assets/references/`. Run `python tools/verify_asset_bundle.py`. Report any missing assets before writing the game.

**Project:** NAIJA DELTA BOYS — adult-oriented, fictional, lightweight **2D isometric** browser life/adventure sim inspired by the recognisable everyday Niger Delta environment. First town: fictional **Otu Creek**. **Avoid** 3D, photorealism, a poster, a static image-click background and a giant open world. Do not restart/rewrite the official React/Phaser project scaffolding.

### Stage 0 — make existing art usable
1. Inventory the image sheets and their alpha. Implement a repeatable extraction script in `tools/` (Pillow is okay as an optional tool dependency). Produce an auditable map/crop record and carefully select visually correct, clean individual cutouts. Do not auto-accept connected components merging neighbouring drawings or coloured halo artefacts. If necessary crop manually by rectangles/alpha masks and clearly tag anything that needs artist review.
2. Extract minimal viable independent sprites to `public/assets/naija-delta-boys/sprites/` (water/shore or ground substitute, mangroves, wood jetty, ≥4 buildings including Mama Ebi's kitchen and fish market, boat, player, boatman, fish seller, community representative and empty ad billboard frame). Produce a small contact-sheet preview on both light and dark backgrounds, and a JSON runtime asset manifest `public/assets/naija-delta-boys/game_assets.json` including source/crop/scale/origin/footpoint/collision metadata.
3. Preserve original `assets/raw_sheets/` and `assets/references/`. The generated references guide aesthetics only. Do not render the whole image as the explorable game map. Use supplied `public/assets/naija-delta-boys/ads/creekconnect_demo.png` as the initial *fictional* sponsor artwork.
4. Character images are static illustration poses, NOT walking sprite sheets. Use static sliding placeholders with clear limitations for this stage; do not fake realistic run cycles using inappropriate image strip slicing.

### Stage 1 — first genuinely playable town
5. On the official Phaser 4 + React + TypeScript/Vite architecture, create `OtuCreekScene` under `src/game/scenes/`, register it using the existing scene/game bootstrap, and preserve the React/Phaser bridge. Show a contiguous walkable land area bordering non-walkable water, wooden jetty, 4–6 independent buildings, mangroves, fish market, boat, shop and a changeable billboard. Use basic isometric grid projection and footpoint depth sorting. Set walkability and building collision independently of visible image rectangles.
6. Implement a controllable adult player (WASD/arrows, E interaction, camera follow, mobile D-pad and tap interaction), collision with water and building footprints, correct near/far overlap and camera limits.
7. Implement three NPCs: **Timi (boatman), Tari (fish seller), Chief Boma's community representative**. Give them short believable fictional dialogue with at least two choices each. NPC/quest data must be separate from rendering code. Use React for the dialogue and HUD, communicating through the template `EventBus` or bridge.
8. A complete three-step quest: speak to Timi at the jetty → pick up/deliver a parcel to Tari → return to Timi for a clearly displayed fictional Naira reward. Player money, energy, current objective and place name must display and update. Save enough state in localStorage to keep mission completion after refresh (no Supabase yet).
9. Ads: render an independent billboard frame plus a **separate** `creekconnect_demo.png` ad texture that can be swapped by changing a simple data record (not hard-coded as a monolithic sprite).
10. UI: title 'NAIJA DELTA BOYS', readable compact React HUD, minimap optional, mobile responsive touch controls. Maintain a bright/clear low-poly cartoon 2D/isometric look, not a 3D open world.

### Validation / report
11. Execute `npm install` (if necessary), `npm run build`, and launch `npm run dev` to check the game. Use available browser/screenshot tooling to inspect both desktop and phone viewport. Test moving, water/building collisions, E/tap NPC interaction, full parcel quest, reload persistence and ad swap. If tools are unavailable, say exactly which checks were unverified.
12. Fix any errors found and keep a brief changelog of modified files. Finally report: playable features, source art extraction quality, screenshot paths if produced, tests actually run, remaining art limitations and recommended next milestone.

**Priority:** Working scene and game loop first. No multiplayer, account systems, combat, generative NPCs, large-scale world, or real sponsor integrations yet. Keep named public figures out of fictional mission dialogue/actions, and do not add real-world instructions for armed violence or illegal oil extraction.
