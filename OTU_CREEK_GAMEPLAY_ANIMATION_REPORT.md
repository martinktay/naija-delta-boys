# Otu Creek gameplay and animation report

Date: 2026-10-18

## What changed

- Added a shared Phaser `CharacterAnimator` with hierarchical upper/lower arms, thighs, shins and feet; four diagonal facings; independent phase offsets; and idle, walk, talk, interact, turn, swim and boat states.
- Replaced the live player, Timi, Tari and community-representative static character displays with clearly identified temporary articulated technical rigs. Original source art and extracted reference poses remain untouched.
- Added deterministic `NpcRoutine` schedules for all three core NPCs. Routes are validated against walkable terrain, use delta-time movement and soft separation, and pause/face the player for dialogue before resuming.
- Added a repeatable browser gait proof at `/animation-evidence.html`, including four simultaneous live rigs and eight distinct stride samples for each character.
- Preserved the existing terrain, boat, swimming, drowning, respawn, mission, persistence and React EventBus HUD systems.

## Acceptance gates

### Gate A — PASS

Before the animation changes: 10/10 tests passed, `npx tsc --noEmit` passed, and `npm run build-nolog` passed. The folder is not a Git working tree, so the requested checkpoint commit was not possible.

### Gate B — PASS (technical rig), PARTIAL (final art)

Browser evidence visibly demonstrates independently phased contralateral arm/leg motion for the player, Timi, Tari and the representative. The preview shows eight distinct stride poses and four diagonal facings. These are genuine articulated rigs, not sliding static sprites or renamed duplicate frames.

The rig is intentionally temporary and does not yet match the illustrated production characters. Final eight-direction character atlases remain an art-production task.

### Gate C — PASS

All three NPCs move autonomously while the player is idle, follow terrain-validated routes, use basic local separation, stop and face the player during dialogue, and resume afterward. Browser play verified that moving Timi and Tari remain reachable for the delivery quest.

Routes avoid deep water and the placed market/jetty activity areas. The current navigation is a validated waypoint graph, not full A*; adding more obstacles requires extending route data or a sparse navigation grid.

### Gate D — PASS, with touch steering PARTIAL

Browser interaction verified the complete Timi → Tari → Timi delivery, one ₦1,500 reward, and HUD money update from ₦2,500 to ₦4,000. Held keyboard input continuously steered the boarded boat. Invalid open-water disembark was rejected; returning to the marked jetty allowed disembark. Explicit water entry activated swimming and a 12-second stamina display; exhaustion reduced lives from 3 to 2, deducted ₦250 and safely respawned on foot without resetting completed mission progress.

Responsive controls remain in the project, but the in-app browser exposes a fine-pointer environment and did not expose the coarse-pointer touch overlay for a true pointer-hold steering test. Touch-equivalent steering is therefore PARTIAL rather than claimed as independently verified.

### Gate E — PASS for desktop, PARTIAL for device-touch proof

- Automated suite: 14/14 passed (the original 10 regressions plus four NPC routine tests).
- TypeScript: `npx tsc --noEmit` passed.
- Production build: `npm run build-nolog` passed.
- Desktop browser: no visible runtime failure during the complete gameplay run.
- Narrow viewport rendering remained usable, but actual coarse-pointer device input was not available in the test browser.

## Remaining issues / next actions

1. Commission final transparent eight-direction idle/walk/swim/boat atlases using `ANIMATION_ART_REQUIREMENTS.md`; retain stable footpoints and do not derive them by slicing the old reference sheets.
2. Replace the approximate rectangular billboard campaign mask with perspective-matched art.
3. Hand-defringe the subtle remaining coloured edge halos identified in `ASSET_EXTRACTION_REPORT.md`.
4. Run the touch-control hold test on a real phone or a browser session with coarse-pointer emulation.
5. Upgrade the validated waypoint graph to a sparse A* grid before increasing obstacle density or adding any new location.
