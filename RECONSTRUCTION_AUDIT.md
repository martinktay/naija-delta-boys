# Repository-first reconstruction audit — 2026-10-20

## Evidence and baseline

Read both supplied reconstruction prompts (identical), root AGENTS.md, scene,
terrain, NPC controller, atlas controller, walk cycle, mission persistence,
player states, React HUD/touch controls, map and test suites.
Baseline working tree was clean. No Git initialization or reset performed.

Baseline: 35/35 tests passed; TypeScript and production build completed.
Actual headless Chrome screenshot: `evidence/reconstruction/before.png`.
Viewport 1440×1000; scene zoom .96. This is a browser rendering check, not an
interactive regression or physical-device test.

## System classification

| System | Classification | Evidence / limitation |
|---|---|---|
| Phaser + React rendering | IMPLEMENTED_AND_WORKING | Browser screenshot contains canvas, independent objects and HUD |
| First Delivery reducer | IMPLEMENTED_AND_WORKING | Mission tests cover stage sequence and single reward |
| Interactive mission loop | UNVERIFIED | Not replayed through browser controls in this audit |
| Save stage and money | IMPLEMENTED_AND_WORKING | Serialization tests; actual browser reload workflow remains unverified |
| Lives/energy/position persistence | MISSING | Snapshot only contains stage and money |
| Terrain | IMPLEMENTED_BUT_DEFECTIVE | Axis-aligned zones; baseline paths do not match drawn road strokes |
| NPC routines | PARTIALLY_IMPLEMENTED | Direct waypoint stepping; blocked waypoint skipped, no path search |
| NPC regression coverage | IMPLEMENTED_BUT_DEFECTIVE | Existing route test uses routes different from live scene |
| Walking controller | PARTIALLY_IMPLEMENTED | Four direction rows and eight cells; cadence independent of movement speed |
| Human gait artwork | UNVERIFIED | Cell count does not establish anatomical alternating contact; no new gait acceptance |
| On-foot boundary prediction | IMPLEMENTED_BUT_DEFECTIVE | Predicts one 1/60-second step regardless of actual frame duration |
| Boat steering/boarding | PARTIALLY_IMPLEMENTED | Rules and velocity tests pass; point-only hull collision, no new interaction replay |
| Swimming/drowning | PARTIALLY_IMPLEMENTED | State transitions and penalty tested; entry/exit hard-coded to x coordinates |
| Safe respawn | PARTIALLY_IMPLEMENTED | Last walking point used; full recovery interaction unverified |
| Touch controls | PARTIALLY_IMPLEMENTED | Pointer controller tests pass; physical Android unverified |
| Health | MISSING | Lives exist; no independent health model |
| Inventory/reputation/purchases | MISSING | No general systems; parcel is mission state |
| Ambient boats/motorcycles | MISSING | Single player boat; no directional vehicle animation library |
| Environment | PLACEHOLDER | Flat beige baseline, guide outlines, sparse placements, rectangular shoreline |

## Preview changes

- Existing map JSON retained; explicit backup stored under `assets/map_backups/`.
- New candidate in `src/game/data/reconstructionPreview.ts`, selected only by query.
- Shared road centerlines and widths drive terrain classification and rendering.
- Road overlays cannot turn water or buildings into walkable ground.
- Patrols follow the candidate's actual road loops; obstacles avoided by route design,
  not by claiming that a pathfinding algorithm has been implemented.
- Separate preview save key protects normal progression.
- Continuous sand road surface sampled from canonical road art; procedural grass
  remains temporary. Terrain is a separate layer; no assembled-scene background.
- Additional existing vegetation provides scale/composition studies.

## Connectivity evidence

`tests/reconstruction-preview.test.ts` checks each segment every four world pixels,
at center and ±12 pixels; flood-fills visible path/jetty terrain to seven destinations;
simulates each actual candidate routine for 120 seconds including route closure.
This verifies static route clearance, not dynamic crowd avoidance or browser elapsed
time. Existing broad route tests do not establish equivalent baseline connectivity.

## Acceptance

| Gate | Result | Reason |
|---|---|---|
| Baseline preservation | PARTIAL | Tests pass and default map retained; full interactive regression outstanding |
| Game design | PASS | Existing/proposed matrix and five-level design documented |
| Asset audit | PARTIAL | Registry records usage and known defects; per-sprite multi-background review outstanding |
| Replacement preview | PARTIAL | Connected candidate runs in browser; visual fidelity insufficient for promotion |
| Route connectivity | PASS | Sampled clearance, destination flood fill and patrol simulation pass |
| Human walking | BLOCKED | Needs accepted anatomical directional artwork and movement-matched cadence |
| Ambient vehicles | BLOCKED | Directional artwork and routes not implemented |
| Before/after evidence | PASS | Same-size browser captures; preview is not a production “after” |
| Interactive gameplay QA | BLOCKED | CUA kernel fails during sandbox startup; headless screenshots do not replace input tests |
| Live map promotion | BLOCKED | Visual and interactive acceptance not satisfied |

## Remaining work

Natural shoreline geometry must replace x-only hazards in a preview-compatible
model, then be tested for hull clearance and safe shore exits. Canonical grass,
shore and road transitions need seamless surface art. Crop defects and the school
substitution need individual review. Walking sheets require frame-by-frame gait
inspection and correction. Dynamic NPC rerouting, scene event-listener cleanup,
and frame-rate-independent collision prediction remain programming work.

Do not interpret this checkpoint as completed world reconstruction.
REAL_DEVICE_TOUCH: UNVERIFIED.

## Commands and results

- Baseline `npx.cmd vitest run --maxWorkers=1 --minWorkers=1`: 35/35 PASS.
- Candidate same command: 39/39 PASS in seven files.
- `npx.cmd tsc --noEmit`: PASS, no diagnostics.
- `npm.cmd run build-nolog`: PASS, production output completed.
- `npm.cmd run dev-nolog -- --host 127.0.0.1 --port 8082`: server started.
- Installed Chrome headless captures used `--window-size=1440,1000`,
  `--virtual-time-budget=10000`, and an isolated ignored browser profile.
  Final captures were inspected directly: `before.png` and `preview.png` in
  `evidence/reconstruction/`.

Final visual review still finds repeating sand texture, abrupt grass borders,
rectangular shoreline, clipped palms, detached crop fragments and insufficient
settlement density. Preview remains PARTIAL and must not be promoted.
Browser developer-console errors and actual input interactions were not captured.
