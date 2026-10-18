# Otu Creek Waterfront production polish V3 report

Date: 2026-10-18

## 1. Change summary

- Added one original production-pilot player walk atlas and integrated it into the actual Phaser scene at normal gameplay scale.
- Added `AtlasCharacterAnimator` and deterministic `WalkCycleModel`: four calibrated isometric facings, eight frames per facing, 100 ms cadence, fixed 0.94 footpoint and immediate walk/idle switching.
- Kept Timi, Tari and the community representative on honest temporary articulated rigs.
- Added building collision footprints to terrain data. NPC routes validate against water and buildings, separation remains on walkable terrain, and NPCs stop rather than walk through the player.
- Replaced the oversized rectangular sponsor overlay with a separate, frame-calibrated perspective campaign texture.
- Replaced basic touch handlers with pointer ownership, capture, direction updates, release/cancel/lost-capture handling, blur/visibility cleanup and competing-touch rejection.
- Extracted mission/reward, save restoration, drowning penalty and continuous boat-velocity rules into focused testable functions.
- Added a production-art evidence gallery with transparency checks, live directional cycles, 32-frame contact strips and before/after comparisons.

Original source sheets and references were not modified. `C:\projects\naija-delta` is not a Git working tree, so a branch/checkpoint commit could not be created.

## 2. Character animation inventory

| Character | Art status | Walk directions | Walk frames | Working states | Missing production art |
| --- | --- | ---: | ---: | --- | --- |
| Player | Production pilot for walk only | NW, NE, SW, SE | 8 each / 32 total | idle fallback, walk, talk fallback, swim fallback, boat hidden, drown fade | Dedicated idle, talk, swim, seated boat and drown frames |
| Timi | Temporary articulated rig | 4 | Continuous procedural gait | idle, walk, talk | Illustrated atlas and boat inspection/action frames |
| Tari | Temporary articulated rig | 4 | Continuous procedural gait | idle, walk, talk | Illustrated atlas and fish-selling work frames |
| Community representative | Temporary articulated rig | 4 | Continuous procedural gait | idle, walk, talk | Illustrated atlas and community-inspection work frames |

Player atlas: `public/assets/naija-delta-boys/characters/player_walk_pilot_v1.png`, 1536×1024 RGBA, 192×256 cells. Visual row order was calibrated after inspection rather than trusting the generation prompt labels.

Image-generation mode: built-in image generation using the existing character sheet and waterfront illustration as style references. The final prompt requested an original adult Nigerian male in a green tropical-print overshirt, white T-shirt, charcoal cargo trousers and white trainers; a transparent 4×8 isometric walk atlas; four diagonal facings; eight contralateral gait phases; stable footpoints; consistent identity; and no shadows, props, logos, text or cropping. A background-extraction edit preserved the figures and produced RGBA transparency.

## 3. NPC behaviour verification

- Timi cycles between the jetty waiting point, boat approach and landing area.
- Tari cycles between the stall, basket/delivery area and nearby market point.
- The representative cycles between the community area and waterfront patrol points.
- All waypoint endpoints and sampled route segments pass `TerrainSystem.canWalk` after building footprints were added.
- Dialogue pauses the engaged routine, turns both participants toward each other and resumes the stored routine afterward.
- A browser observation with the player stationary for 60 seconds showed all three NPCs changing positions at 30 and 60 seconds without entering water, crossing a building or freezing.

## 4. Boat and mobile verification

- Desktop held-key boat steering: **PASS** from browser interaction and automated continuous-velocity regression coverage.
- Narrow viewport: **PASS**; D-pad, `TALK / USE` and `ENTER WATER` are visible.
- Automated pointer tests: **PASS** for hold/start, direction change, release, cancellation, competing touches and leaving the active area.
- Browser pointer interaction: **PARTIAL**. A held direction moved the player in the narrow browser, but the environment does not provide authoritative coarse-pointer hardware emulation for a complete touch boat run.
- Physical Android: `REAL_DEVICE_TOUCH: UNVERIFIED`.
- Five-minute procedure: `ANDROID_CHROME_TEST_CHECKLIST.md`.

Jetty boarding, water-constrained steering, invalid-disembark rejection, dock disembarking, swimming stamina, drowning, one-life/₦250 penalty and safe respawn remain regression targets. Focused rules cover continuous steering release, mission persistence, single reward and drowning clamping.

## 5. Visual evidence

- Player atlas: `public/assets/naija-delta-boys/characters/player_walk_pilot_v1.png`
- Animation metadata: `public/assets/naija-delta-boys/characters/character_animation_manifest.json`
- Production animation/contact-sheet gallery: `public/production-art-evidence.html`
- Temporary rig evidence: `public/animation-evidence.html`
- Sprite extraction comparisons: `public/asset-audit.html`
- Checkerboard comparison: `public/assets/naija-delta-boys/sprites_before_after_checker.jpg`
- Dark comparison: `public/assets/naija-delta-boys/sprites_before_after_dark.jpg`
- Terrain comparison: `public/assets/naija-delta-boys/sprites_before_after_terrain.jpg`
- Perspective campaign: `public/assets/naija-delta-boys/ads/creekconnect_perspective.png`
- Original replaceable campaign: `public/assets/naija-delta-boys/ads/creekconnect_demo.png`

Browser screenshots were captured during verification, but the in-app browser does not expose a persistent workspace screenshot path. The evidence pages above are repeatable locally served proof; no recording file is claimed.

## 6. Build and test results

- `npm.cmd test` — **PASS**, 5 files and 30/30 tests.
- `npx.cmd tsc --noEmit` — **PASS**.
- `npm.cmd run build-nolog` — **PASS**.
- Browser console warnings/errors after final reload — **0**.
- Desktop browser smoke check — **PASS**.
- 60-second stationary-player NPC test — **PASS**.
- Narrow viewport control-visibility check — **PASS**.

## 7. Acceptance table

| Gate | Result | Evidence |
| --- | --- | --- |
| A — Baseline preservation | PASS | 30 tests, TypeScript and build pass; save schema remains `{stage,money}` |
| B — Production animation pilot | PASS for walking; PARTIAL for full state set | Original 32-frame player atlas, four calibrated facings, live integration and gallery; non-walk production states remain missing |
| C — Four-character integration | PASS functionally; PARTIAL production art | Player uses production walk pilot; three NPCs remain temporary rigs with independent controllers |
| D — Living NPC world | PASS | 60-second browser observation, terrain/route checks and dialogue pause/resume tests |
| E — Mobile controls | PARTIAL | Pointer implementation/tests and narrow browser interaction pass; Android and authoritative touch-emulated boat run unverified |
| F — Visual polish | PARTIAL | Billboard perspective fixed and player transparency verified; exhaustive 4× hand-defringing and final NPC atlases remain incomplete |
| G — Overall stability | PASS with hardware caveat | 30/30 tests, typecheck/build, desktop/narrow browser smoke and zero console diagnostics |

## 8. Remaining blockers

1. **Manual artwork:** final idle/talk/swim/boat/drown player states and complete illustrated atlases for all three NPCs.
2. **Manual artwork:** exhaustive hand-defringing of active environment sprites at 2×/4×.
3. **Hardware testing:** physical Android Chrome held steering, orientation and interruption recovery.
4. **Evidence tooling:** persistent MP4/GIF capture was unavailable; live repeatable evidence pages were delivered instead.

## 9. Next milestone

Stay within Otu Creek. Produce and integrate dedicated player idle/talk/swim/boat/drown rows, run the five-minute Android checklist on one physical mid-range device, then commission Timi's illustrated walk/work atlas as the next single-character production pass.
