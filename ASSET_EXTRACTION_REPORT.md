# Asset extraction report

All 10 RGBA source sheets and both RGB reference images were checked against `asset_manifest.json`; filenames and declared 1254×1254 / 1672×941 dimensions match. Originals remain untouched.

The extractor produced 15 game-ready PNGs covering mangroves, palm, jetty, four independent buildings, Mama Ebi's Kitchen, fish market, POS shop, passenger boat, billboard frame, player and three NPCs. Every crop records source, crop rectangle, output dimensions, intended scale, footpoint and collision metadata in `public/assets/naija-delta-boys/game_assets.json`.

Quality review is in `public/assets/naija-delta-boys/sprite_contact_sheet.jpg`. CreekConnect is fictional and stored separately from the billboard structure at `public/assets/naija-delta-boys/ads/creekconnect_demo.png`.

## Manual correction queue

- Several sheets contain coloured edge halos. Near-transparent pixels are removed automatically, but remaining fringe needs hand-painted defringing.
- Timi includes the paddle, Tari includes her fish basin, and the representative is a static pose. Dedicated animation sheets are still needed.
- Billboard perspective is approximated with a rectangular overlay; a perspective-matched campaign template is recommended.
- Water and land are procedural in this slice; extracted tile variants should be calibrated into a map-editor workflow next.

## Next milestone

Commission eight-direction walk/idle sheets, paint perspective-matched billboard masks, move placement/collision data into map JSON, add audio and interiors, then expand the waterfront by one screen while keeping this mission as regression coverage.

## Corrective verification — 2026-10-18

- PASS — refined live crops remove the reproduced neighbouring-character and billboard fragments; the reviewed jetty uses an explicit component mask.
- PASS — three before/after sheets were generated for checkerboard, dark and terrain backgrounds.
- PASS — `/asset-audit.html` provides per-sprite before/after review, source crop, footpoint and status.
- PASS — on-foot movement is blocked from deep water by `TerrainSystem` data in `otuCreekMap.json`.
- PASS — boarding is limited to the authorised jetty radius and boat travel is constrained to water.
- PASS — disembarking succeeds at dock records and remote disembarking is rejected by the rule tests.
- PASS — explicit water entry enables swimming and a visible stamina meter.
- PASS — exhausted stamina triggers a non-graphic fade, life loss, ₦250 penalty and safe respawn while preserving the mission save.
- PASS — existing mission state and responsive touch controls remained visible in browser testing.

Automated result: 10/10 terrain, boat-rule and state-transition tests passed. TypeScript and the production build completed successfully.

Remaining art gaps: Timi, Tari and the representative are still static poses and remain marked `needs_manual_art`; no directional walk, swim, seated-driver or drowning frames exist. Some generated art retains subtle colour fringing at high zoom, and the billboard campaign still uses an approximate rectangular perspective.

## Gameplay animation activation — 2026-10-18

- PASS — the live scene no longer uses the contaminated static character crops for movement; it uses temporary articulated Phaser rigs with independently animated arms, legs and feet.
- PASS — `/animation-evidence.html` displays four simultaneously animated characters and eight distinct stride phases for each.
- PASS — source illustrations and extracted references remain untouched and available in `/asset-audit.html` for before/after comparison.
- PARTIAL — the temporary rigs are clean and readable but deliberately simplified. Final production atlases, hand-painted defringing and the perspective-matched billboard campaign mask remain in the manual-art queue.
