# Changelog

Ez a projekt manuálisan verziózott, mert a fejlesztés jelenleg chat-alapú iterációban zajlik. Minden érdemi vizuális/logikai változás után ide kerül egy bejegyzés, mielőtt pusholod.

## [Unreleased]

## [0.3.0] - 2026-07-26
### Added
- Statikus, generált háttérkép minden biomhoz (`assets/biome-*.jpg`), a korábbi CSS gradiens helyett (a gradiens overlay-ként megmaradt fallback + fényárnyék hatásnak).
- Teknősök most enyhén ide-oda vándorolnak a vadászjeleneten (`wander` keyframe animáció), nem csak helyben lebegnek.
- Reveal flow 10 másodperces "pörgős" animációra bővült: a Felfedés gombra kattintva 80ms-onként random faj/ritkaság pörög csillag-effekttel körülötte, majd 10s után jelenik meg a valódi fogás.

### Changed
- `renderHuntScene` most csak az újonnan megjelenő spawnokhoz hoz létre DOM elemet (nem törli/rajzolja újra az egészet minden hívásnál), hogy a wander-animáció ne szakadjon meg.
- `revealPending()` / `renderReveal()` állapotgépe kibővült egy `spinning` fázissal a `revealed` előtt.

## [0.2.0] - 2026-07-26
### Changed
- A korábban egyetlen `turtle-breeder.html` fájl szétbontva `index.html` + `css/style.css` + `js/*.js` struktúrába, jobb debugolhatóság érdekében.
- `js/` öt fájlra bontva: `data.js`, `state.js`, `render.js`, `actions.js`, `main.js`.

## [0.1.4] - 2026-07-25
### Fixed
- Reveal popup állapotgépe: a popup többé nem záródik be automatikusan a felfedés animáció után, csak explicit "Tovább" gombra vagy backdrop kattintásra.

## [0.1.3] - 2026-07-25
### Changed
- Teknős grafika emoji-alapúra cserélve (🐢 minden fajnál, 🥚 tojás állapotban), fajonkénti hue-rotate színezéssel.
- A kártya hero háttere a ritkaságot (rarity) jelzi, nem a fajt.

## [0.1.2] - 2026-07-25
### Changed
- Mobil board UI: 2 oszlopos grid, ikonos akciógombok a teknős hero alatt, kompaktabb fejléc és pill-ek.

## [0.1.1] - 2026-07-25
### Added
- Biomonkénti saját token rendszer (korábban egy globális `biomTokens` volt).
- Auto-hunt unlock biomonként, saját biom tokenből fizetve.

## [0.1.0] - 2026-07-25
### Added
- Első játszható prototípus: board, teknősvadászat biomokkal, reveal flow, tenyésztés, store, offline progress, localStorage mentés.
