Build the first **playable browser prototype** of Naija Delta using the files in this repo.

Read `AGENTS.md` and `README_START_HERE.md` first; inspect `asset_manifest.json`, `assets/raw_sheets/`, and `assets/references/`.

Use Phaser 4, React, Vite and TypeScript, preferably building on the official `phaserjs/template-react-ts` starter. The target is a **simple colourful, low-detail 2D isometric life-sim** like the reference, not a cinematic image or 3D project.

Your sequence:
1. Inventory each source PNG. Extract useful water, land, dock, mangrove, house, market, boat, player and NPC sprites into `public/assets/sprites`. Maintain original raw sheets and document extraction boundaries and any manual-review cases.
2. Create an initial Otu Creek scene: continuous ground/water, several houses, a jetty, fish stall, Mama Ebi food shop, boat, vegetation, and one fictional-brand billboard. Place each object as an independent rendered game entity with correct isometric depth and a collision footprint.
3. Add a controllable player, camera follow, keyboard controls and on-screen mobile controls. Temporary static poses are fine; be explicit that true walking frames are not yet available.
4. Add 3 NPCs (boatman, fish seller, community representative), interaction prompts, a branching dialogue panel, and one three-step delivery mission.
5. Add a React HUD with money, energy, location and active quest; support a replaceable ad texture separate from the billboard frame.
6. Run installation/build/tests. Provide a brief report containing playable features, files changed, commands run, screenshots if available, and missing assets.

Start with a **working vertical slice**, not account systems, multiplayer, detailed combat, procedural generation, generative AI NPCs, or a massive world. Complete the playable loop before broadening scope.
