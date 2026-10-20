# Otu Creek — Chapter 1 design

This is a design, not a claim that five levels exist. The shipped First Delivery
state machine remains authoritative. No new mission or save schema is introduced.

## Core rules and implementation matrix

| System | Existing rule | Proposed Chapter 1 rule | Implementation gap |
|---|---|---|---|
| Movement | WASD/arrows and held touch buttons; world-pixel movement | Walk accessible roads, courtyards and jetties; buildings and water block walking | Collision footprint calibration and frame-rate-independent boundary prediction |
| Money | Starts at ₦2,500; delivery pays ₦1,500 once; drowning costs up to ₦250 | Keep these values; never pay twice for the same job | Browser replay verification |
| Health/lives | Three session lives; drowning deducts one, floored at zero | Zero lives returns to safe recovery without deleting progression | Zero-life rule and persisted lives are not implemented |
| Energy | Starts at 100; movement reduces it; zero does not restrict movement | Energy should affect optional work, with explicit recovery | Recovery and meaningful use are future work |
| Jobs | First Delivery: Timi → Tari → Timi | Preserve the parcel task as the first hustle | Other jobs are design only |
| Inventory | Parcel represented by mission stage | Later use explicit inventory only if multiple goods require it | No general inventory |
| Economy | Rewards and drowning deductions only | Purchases require visible prices, confirmation and sufficient funds | No shops or purchases |
| Reputation | Dialogue mentions reliability | Later unlock conversations through completed community work | No numerical reputation |
| NPCs | Three autonomous waypoint routines and contextual dialogue | Timi at jetty, Tari at stall, Chief at meeting area; stop and resume conversations | General pathfinding and blocked-route recovery |
| Transport | Player-controlled passenger boat; jetty boarding and dock exit | Keep water navigation and existing controls | Directional boat art; ambient vehicles; motorcycle routes/art |
| Water | F enters swimming near shoreline; 12 seconds stamina; drown and respawn | Clearly signposted intentional water entry and safe exits | Geometry-aware entry/exit; collider interactions while swimming |
| Saves | `ndb-mission`: stage and money | Preserve existing saves; migrate explicitly if fields are added later | Lives, energy and position are not persisted |

## Five proposed levels

1. **Arrival at the Waterfront.** Introduce movement, Timi, roads and water warnings.
   Reuses movement/HUD/dialogue. Tutorial tracking remains future work.
2. **The First Hustle.** Existing First Delivery. Accept parcel, deliver to Tari,
   return to Timi, collect exactly ₦1,500. This is the only implemented quest.
3. **Making a Living.** Future optional market work and purchases. Requires inventory,
   pricing, transaction rules and energy recovery before implementation.
4. **Life on the Water.** Existing boating/swimming mechanics can support instruction.
   A transport job or level completion condition does not yet exist.
5. **Community Connections.** Chief's current dialogue provides an introduction.
   Reputation and community objectives remain future design.

## World layout and promotion

The preview links spawn, both jetties, market, kitchen entrance, POS entrance and
community meeting point. Mama Ebi's kitchen is a destination; Mama Ebi is not an
implemented NPC. The community sprite currently depicts a school and needs correction.

Preview URL: `/?world=reconstruction`. Preview writes `ndb-reconstruction-preview`,
initializing from existing mission progress if its own save is absent. It never
writes `ndb-mission`. The default map remains unchanged.

Promotion requires comparable screenshots, accepted shoreline/terrain art, a full
interactive delivery and water regression, and visually verified walking. Passing
unit tests alone cannot approve the reconstruction.
