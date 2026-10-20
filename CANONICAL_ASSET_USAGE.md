# Canonical asset usage registry

The assembled waterfront image is the composition target, never the playable map.
Original sources remain preserved under `assets/raw_sheets` and
`assets/references/canonical_v4` / `canonical_v5`.
Per-file sizes, crops and footpoints are in
`public/assets/naija-delta-boys/game_assets.json`; those historic
`approved_prototype` labels are not production approvals.

| Canonical category | Current use | Audit status / missing work |
|---|---|---|
| Terrain/road sheet | `terrain-v5` crops; road-straight center sampled in preview | Raised diamond silhouettes incompatible with continuous tiling; transitions missing |
| Shore/water sheet | Crops exist; scene still draws rectangular water | Not integrated as natural continuous shoreline |
| Vegetation/props sheet | Mangrove and palm sprites used | Detached edge fragments visible; palms appear clipped; manual extraction review required |
| Jetties/boardwalks | Existing jetty sprite and bridge crop used | Rectangular walkability not calibrated to illustrated deck silhouette |
| Building sheet | Stilt house, kitchen, fish market, POS, community sprite | Community sprite visibly says school; not a correct community hall |
| Civilian sheet | Static anchors plus separately generated walking sheets | Canonical references are static, not animation sequences |
| Player walk atlas | Four rows × eight cells in game | Provisional art; anatomical walking not newly verified |
| Timi walk v2 | Four mapped rows × eight cells | Provisional; earlier anatomy-pass status is not accepted evidence |
| Tari walk atlas | Four rows × eight cells | Provisional; no carry/receive animation |
| Representative atlas | Four rows × eight cells | Provisional; no illustrated talk/idle |
| Boats/vehicles | Passenger boat sprite controlled by player | Static projection; no validated directional fishing boat/motorcycle sequences |
| Officials/signage | Billboard frame and separate fictional campaign | Other reference figures not added; billboard perspective needs visual review |
| Assembled reference | Composition guidance only | Current preview remains much sparser |

Required artist delivery: fixed-footpoint transparent four-direction walk cycles,
eight genuinely distinct phases per direction, opposite arm/leg swing and both
contact phases; consistent identity, scale and proportions. Supply idle/talk,
swim and water-recovery art separately. Do not synthesize limb motion from random
strips of a static reference.

Required terrain delivery: seamless sand/grass surfaces, feathered road borders,
inside/outside shoreline transitions and deck surfaces whose collision polygons
can be traced accurately. Preserve source images and record derivative provenance.
