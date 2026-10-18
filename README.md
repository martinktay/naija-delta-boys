# Naija Delta Boys — Otu Creek Prototype

A playable 2D browser-game vertical slice built with Phaser 4, React 19, TypeScript and Vite from the official Phaser React TypeScript template.

## Run it

```bash
npm install
npm run dev-nolog
npm run build-nolog
```

Open the URL printed by Vite (normally `http://localhost:8080`). Move with WASD or arrow keys and interact with E. Touch controls appear below 760px. Mission progress and reward state are saved in browser local storage under `ndb-mission`.

Water gameplay uses one authoritative state machine. Walkers are blocked by deep water; board the passenger boat with E from a designated jetty, steer only over water, and disembark with E only at a dock. Press F (or **Enter Water** on touch) at a shoreline/jetty to swim. Swimming consumes a 12-second stamina meter; depletion causes a non-graphic fade, ₦250 recovery cost, and safe respawn without resetting mission progress.

Evidence pages are available at `/asset-audit.html` and `/animation-evidence.html` while the development server is running. `/production-art-evidence.html` redirects to the canonical animation evidence. The current consolidation report is in `OTU_CREEK_MASTER_ART_ANIMATION_REPORT.md`; physical-device checks are in `ANDROID_CHROME_TEST_CHECKLIST.md`.

## First mission

1. Meet Timi at the waterfront jetty.
2. Accept his parcel.
3. Deliver it to Tari at the fish market.
4. Return to Timi and collect ₦1,500.

The Phaser scene owns world rendering, collision, movement, NPC proximity and mission transitions. React owns the HUD and dialogue choices; the template EventBus connects them.

## Assets

Original sheets remain unchanged in `assets/raw_sheets/`. Run `tools/extract_assets.py` with Pillow available. Generated files live in `public/assets/naija-delta-boys/`; see `game_assets.json`, `characters/character_animation_manifest.json`, `sprite_contact_sheet.jpg`, and `ASSET_EXTRACTION_REPORT.md`.

## Known limits

- The player, Timi, Tari and the community representative use reference-matched production walk atlases with four isometric directions and eight genuine gait phases per direction. Dedicated illustrated idle, talk and role-specific carry/action sets are still required.
- Collision uses tuned footprint rectangles rather than per-pixel geometry.
- Swimming, drivable boats and autonomous NPC routines are implemented. Interiors, combat and multiplayer remain outside this vertical slice.
- Some source-sheet colour fringes remain visible at high zoom and are flagged for manual paint correction.
- Browser-emulated pointer controls are covered, but physical Android touchscreen testing remains unverified.
