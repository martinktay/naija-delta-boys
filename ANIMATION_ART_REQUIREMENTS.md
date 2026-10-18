# Character animation art requirements

## Current implementation status

The live prototype now uses a temporary code-authored articulated rig for the player, Timi, Tari and the community representative. It provides genuine independent upper/lower limb movement, contralateral walking, four diagonal facings, talk poses and a placeholder swim stroke. Review `/animation-evidence.html` for the live four-character proof and eight stride samples per character.

This resolves the gameplay-animation blocker but is not final illustration-quality art. The production delivery below is still required; the original static references must not be presented as animation frames.

The current player and NPCs are approved only as static prototype placeholders. Production character delivery should provide:

- Eight directions: N, NE, E, SE, S, SW, W and NW.
- Idle: 2–4 frames per direction; walk: 6–8 frames per direction; swim: 6 frames per direction.
- Stable foot-contact point across every frame, transparent RGBA canvas, no baked shadow, no cropped hair, hands or shoes.
- Shared pixel density and body scale, with separate adult body silhouettes and clothing layers where customisation is planned.
- Boat seated/driver pose, water-entry pose, non-graphic exhausted/treading-water pose and rescue pose.
- Naming: `<character>_<state>_<direction>_<frame>.png`; include a JSON atlas with source scale and footpoint.

Do not generate movement by slicing or distorting the current static illustrations.
