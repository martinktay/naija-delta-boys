# Naija Delta — Coding Agent Instructions

## Product intent
Create a **desktop and mobile browser playable** 2D isometric Niger Delta adventure / life simulation inspired by familiar browser life sims. This is an **adult-oriented** fictional game; portray a recognisable, everyday Niger Delta town with trade, water transport, community institutions, and complex stories. Do not build a 3D WebGL world or a static poster / image-click map.

## Implementation
- Prefer Phaser 4 + React + TypeScript + Vite.
- Phaser renders map, entities, animation, collisions and interactions; React renders HUD, mission list, choice dialogs and menus.
- Start from the official Phaser React TypeScript template: https://github.com/phaserjs/template-react-ts
- Start offline/local single-player; do **not** block the first build on Supabase or multiplayer.
- Initial world should be smaller than the full reference image and fit ordinary Android hardware.
- Use explicit documented isometric conversion helpers; avoid conflating cartesian screen (x,y) with tile grid (i,j). A nominal 2:1 diamond tile can begin at 128x64, but actual asset cutouts must be calibrated visually.
- Depth sorting should use each entity's **ground-contact footpoint**, not the sprite top-left.
- Use data-driven placement for buildings, props, spawn locations, interactions, NPC routines and sponsor slots.
- Ensure water remains nonwalkable without a boat; buildings have collision footprints; entrances remain reachable.

## Assets
- `assets/raw_sheets` = rough **source artwork**, not drop-in sprite sheets.
- Programmatically inspect alpha channels and extract useful individual assets into `public/assets/sprites/` with an auditable manifest. Handle overlapping objects carefully: if a crop is ambiguous, flag for human review instead of silently using a broken one.
- Use transparent PNG/WebP (preserve original sources). Preview extracted sprites against checkerboard/light and dark backgrounds.
- Record sprite width, height, origin/footpoint, source sheet and intended scale in a `game_assets.json` manifest.
- Do not create artificial moving body parts by slicing the static characters into random strips. Use temporary single-frame sprites for NPCs and make clear walking animations need more art.
- Store references separately, never use a giant reference screenshot as the map background.
- Fictional ad brands only until licensing is resolved.

## First playable vertical slice acceptance criteria
1. `npm install`, `npm run dev`, `npm run build` work.
2. Scene `OtuCreekScene` loads and displays terrain, water, mangroves, a jetty and at least four buildings with extracted artwork.
3. Player can move by WASD/arrow keys and on-screen touch pad; camera follows; collisions work.
4. Three NPCs exist: boatman, fish vendor, and community representative. E-interact or tap opens branching dialogue.
5. A simple quest: speak to boatman, deliver a parcel to vendor, return for an in-game reward.
6. UI shows money, energy, location, current mission and short dialogue.
7. At least one changeable **fictional** sponsor billboard uses a separate texture/ad record.
8. No build errors; README documents all commands and missing art limitations.

## Safety, integrity and maintainability
- Complex political and militant historical subjects should be handled as fictional storylines; never falsely attribute invented actions or dialogue to named real persons.
- No operational directions for real-life illicit oil extraction or armed violence.
- Commit and test in incremental stages. Avoid claiming tasks complete without running build/tests and reviewing a browser screenshot when available.
