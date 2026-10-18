# NAIJA DELTA BOYS — OTU CREEK GAMEPLAY + ANIMATION ACTIVATION

## Mission
Continue the existing working Phaser 4 + React + TypeScript project derived from the official `phaserjs/template-react-ts` repository. Turn **Otu Creek Waterfront** from a functional static prototype into a visibly living, genuinely playable 2D isometric settlement. Do not create a new project, replace the Phaser/React bridge, or expand the map to another town.

## Baseline to inspect and preserve
Read `AGENTS.md`, the current README, the asset catalog / extraction report, the terrain data, the player state machine, the active scene, the existing test suite, and any previous correction prompts. Inspect `git status`, `git diff`, dependencies, assets, running routes, and the existing state persistence format before modifying code. Create a checkpoint commit or safe working branch before major changes; preserve uncommitted user work. Verify the reported baseline by running available tests, TypeScript checks and production build.

Previous Codex report (not independently validated here): asset previews passed; walking blocked by deep water; boat boarding at jetty; boat constrained to water; dock-only disembark; swim stamina and drowning with safe respawn; mission persistence; mobile controls; 10/10 tests; typecheck and build passed; no browser-console errors. **Treat these as regression requirements, not permission to rewrite them.** A held-key boat-steering browser check remained inconclusive and needs explicit retesting.

## Priority 1 — Genuine human walking animation for player AND NPCs
1. Inventory current character artwork. The existing Timi, Tari, and community-representative images are **static reference poses**, not walking sprite sheets. Do not label sliding images, whole-sprite bobbing, sprite flipping or arbitrary cut-up image strips as completed human gait animation.
2. Implement a shared `CharacterAnimator` / `CharacterController` architecture with independent animation state, direction, speed and ground-contact footpoint per character. State names should include idle, walk, turn, interact, talk, and optionally run; keep swimming and boat-riding as distinct player states.
3. **Visible required gait:** arms and legs alternately swing with contralateral coordination (left arm with right leg, and vice versa); distinct contact/passing/push-off phases; both feet articulate and alternately plant; small torso/head counter-motion; no visible foot sliding during constant-speed movement; correct start/stop transition. All tested characters must animate independently rather than sharing an in-phase walking loop.
4. Deliver four visually distinct cardinal/isometric walking facings for the first milestone (up-left, up-right, down-left, down-right) with at least eight unique visible stride poses per facing or comparably fluid verified rig animation. Use actual distinct artwork / genuinely articulated rigged body parts; do **not** meet the frame count by duplicating or mirroring identical poses and renaming files. Build the system so eight directions can be added later without rewriting movement.
5. Because clean source frames do not currently exist, choose an **honest art strategy**: (A) create consistent, manually verifiable animation frames or (B) create a proper layered 2D paper-doll rig using newly authored clean head/torso/upper+lower-arm/upper+lower-leg/foot art and pivot/joint animation. Do not slice static illustrations blindly. A temporary stylized rig is acceptable for a playable technical demonstration, but must be identified as temporary if it does not yet match the final character illustrations. Never claim production-quality art if it is missing.
6. Ensure sprite pivots, feet origin, character scale, collision footprint and world-depth ordering remain stable throughout each stride. React controls should not cause animation jitter or fighting between walking and interacting.
7. Integrate the main adult player, **Timi (boatman), Tari (fish seller), and the community representative**. Give each visibly distinct colour/costume treatment and animated idle/walk states. If some characters require new source art, show the functioning temporary rig plus an exact missing-art task list.

## Priority 2 — Autonomous living NPCs
1. Create an NPC state machine with idle, navigate, work/perform action, talk/interact, and resume. NPCs must have **independent positions, waypoints, timers and animation loops**.
2. Use actual walkable navigation data from the corrected terrain/collision map. A* over a sparse footpoint grid, validated waypoint graph, or equivalent deterministic navigation is acceptable. NPCs must not cross deep water, pass through buildings, walk through impassable market props, or clip across boats/jetty edges. Avoid obvious overlap with each other; use local steering/soft separation where necessary.
3. Give each character a minimal believable routine within the existing Otu Creek Waterfront: Timi walks between boat/jetties and pauses for passengers; Tari walks between fish stall and nearby delivery point; community representative walks between community meeting point and waterfront, then pauses to converse. Add 1–3 low-cost ambient adult residents only if art and performance permit; do not sacrifice the three core NPCs.
4. On interaction, NPC should decelerate/stop, face player, play idle/talk animation and show the existing React dialogue. After dialogue, return to schedule or replan route. The existing parcel-delivery quest must remain fully playable while NPCs move; avoid quest targets wandering away in ways that make interaction impossible.
5. NPCs should move and undertake routines **even when the player stands still**. Support day/night or time-of-day schedules only if game time already exists and the system remains simple and deterministic.

## Priority 3 — Complete and stress-test the waterfront gameplay loop
1. Retain the existing boat/water/swim/drown/respawn state machine and its behavior. Verify that holding movement keys steers a boarded boat **continuously** in an actual browser session. Investigate focus loss / synthetic-held-key test limitations rather than marking this verified from unit tests only. Include alternative touch-control steering test.
2. Boat transitions: approach at valid jetty, board, steer only in navigable water, dock at a valid landing point, disembark onto a walkable footpoint. Prevent double boarding, accidental teleportation, walking on water, accidental duplicate rewards, and soft-locking the player during a mission.
3. Swimming: controlled entry/fall, swim animation (placeholder explicitly if frames are absent), visible stamina drain, optional rescue if an existing rescue system supports it, drowning consequence and safe respawn. Player should not lose saved quest progress inappropriately.
4. Make the **existing** first parcel-delivery quest playable from beginning to end, including finding moving NPCs, accepting parcel, completing delivery, returning, receiving one reward, HUD updating, and save/reload persistence. Do not add an unrelated quest.
5. Maintain money, energy, location, interaction prompts, minimap (if implemented), and objective HUD in React using the official EventBus bridge. Add obvious feedback for success/failure and interactable ranges.
6. Improve one existing in-world fictional-brand billboard by separating the frame/perspective mask from changeable ad content. Do not add live ad network integration or unlicensed real logos.

## Priority 4 — Asset quality and visual polish (limited scope)
- Keep original art sheets untouched. Do not recrop a contaminated sprite without first showing both original and corrected versions.
- Audit visibly used props for cut-off bodies, haloes, stray fragments, shadow artefacts, disproportionate objects, wrong depth and inconsistent scale. Output updated before/after contact sheets and a report of unresolved assets needing manual art.
- Avoid giant backdrop-image gameplay, CSS-only characters or substituting 3D. Preserve cohesive Lagos-Life-style lightweight 2D isometric visuals, but keep Naija Delta Boys' distinctive creek identity.
- Add subtle motion only where appropriate (boat idle bob, water shimmer, minimal market ambient animation), prioritizing frame rate over decoration.

## Testing and acceptance gates
**Gate A — baseline:** tests/typecheck/build pass BEFORE changes, or report existing failures accurately.

**Gate B — gait proof:** in browser, simultaneously display player + Timi + Tari + community representative, all walking. Capture an image sequence, short GIF/video, or repeatable animation-preview page proving visible independent left/right arm and leg changes across stride phases and direction changes. Static slide, sprite bob, or moving-position-only behavior is a FAIL.

**Gate C — living town:** at least three NPCs automatically travel along valid routes, stop, interact, and resume. Player can remain idle for 30–60 seconds while NPCs continue doing believable activities. Confirm zero walking through buildings/water and reachable NPC quest targets.

**Gate D — gameplay:** player completes the existing delivery quest with one reward, save/reload works, water remains hazardous, and boarding/steering/docking/disembarking work. Test continuous keyboard-held steering by manual browser interaction and test touch equivalent. Report environmental/tool limitations honestly.

**Gate E — compatibility:** desktop and narrow mobile viewport with controls; no console errors; no regressions in existing 10 tests; add focused animation/NPC/nav and boat-input tests; run `npx tsc --noEmit`, `npm test`, and the actual defined production-build script (e.g. `npm run build-nolog` when available). Avoid inventing successful results; record exact commands and outcomes. Aim for mobile-friendly performance and measure if tooling supports it.

## Engineering constraints
- Work in small, reviewable commits. Prefer clear modules: character animation, NPC behavior, navigation, world scene, and UI state integration, adapting to existing architecture rather than imposing filenames blindly.
- Use delta-time movement, footpoint-derived depth, scene-safe event listeners, cleanup on scene shutdown, and deterministic state transitions. No per-frame React re-rendering for character positions.
- Avoid unnecessary backend, multiplayer, advanced combat, new towns, new missions, voice AI, or large refactors of working systems.
- If convincing animation artwork is blocked, **do not fake completion**. Ship an auditable articulated temporary rig and a precise asset-spec/backlog for the final sprites.

## Deliverables
1. Updated playable Otu Creek browser scene and source changes.
2. Four moving, independently animated characters with demonstrable limb articulation; flag temporary vs final art.
3. Working NPC schedules, obstacle-safe paths, and dialogue pause/resume.
4. Working player boat controls, swimming/hazard and existing delivery mission.
5. Updated sprite catalog, asset audit and animation art specification.
6. Browser evidence: before/after images, gait capture and gameplay screenshots/recording where possible.
7. Tests, TypeScript/build results, console diagnostics, any known failures.
8. A concise completion report with **PASS / PARTIAL / BLOCKED**, exact repo paths, and a short next-action list.

Do not say “animated NPCs completed” unless arms and legs **visibly articulate** and the behavior is actually demonstrated.
