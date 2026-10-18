# Naija Delta — Codex Starter Asset Bundle

This folder contains **10 illustrated PNG asset sheets** and **2 high-level visual references** from the Naija Delta concept sessions.

## What to know

- The PNG asset sheets have an alpha channel, but **the objects are not yet individually extracted, registered or consistently scaled**.
- Some sheets have coloured edge halos and occasional overlapping silhouettes; clean each sprite and preview it against light and dark backgrounds.
- The character sheets are **static pose references**, not complete directional animation atlases. Do not claim walking animation is present; use placeholder motion until additional frames are authored.
- The reference images are full-scene mockups, **not playable maps or sprite sheets**.
- All products/brands shown are concept artwork, not authorised endorsements. Ship fictional brands initially and seek permission for real logos.

## File layout

- `assets/raw_sheets/` — PNG source illustrations to be separated into game-ready objects.
- `assets/references/` — desired look for the town and user interface.
- `asset_manifest.json` — basic file catalog.
- `AGENTS.md` — implementation guidelines for Codex.
- `CODEX_KICKOFF_PROMPT.md` — a suggested first instruction for Codex.

## How to use

1. Extract this ZIP into your Git repository (preferably a **new** `naija-delta` repo).
2. Open the repo with Codex (local project or cloud environment with uploaded files).
3. Paste the content of `CODEX_KICKOFF_PROMPT.md` as the first task.
4. Inspect generated sprite crops and test the playable build; iterate on art extraction as needed.

Suggested initial map: **Otu Creek Waterfront** — river, jetty, 4–6 buildings, three NPCs, a boat, billboard, and one quest.
