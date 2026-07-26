# Teknős Tenyésztő Idle

Böngészős idle/incremental játék: teknősöket fogsz, tenyésztesz és adsz el, biomonkénti progresszióval.

## Futtatás lokálisan

Statikus site, nincs build lépés. Bármelyik egyszerű helyi szerverrel futtatható:

```bash
npx serve .
# vagy
python3 -m http.server 8080
```

Utána nyisd meg: `http://localhost:8080`

## Struktúra

```
index.html         # markup, ide vannak behúzva a CSS/JS fájlok
css/
  style.css        # teljes vizuális réteg (tokenek, layout, komponensek, responsive)
js/
  data.js          # statikus konfiguráció: fajok, biomok, ritkaságok, upgrade táblák
  state.js         # globális state, DOM referenciák, mentés/betöltés, apró helperek
  render.js         # összes renderX() függvény — csak DOM kiírás, nincs mutáció
  actions.js        # játéklogika: vadászat, reveal, tenyésztés, vásárlás, automatizálás, offline progress
  main.js           # event bindingok + bootstrap (fut legutoljára)
assets/             # helye van, jelenleg nincs benne statikus kép (emoji-alapú grafika)
```

A JS fájlok **sima globális script tagek**, nem ES modulok — a betöltési sorrend (`data → state → render → actions → main`) számít, mert mindegyik ugyanazt a globális scope-ot használja. Ha új fájlt adsz hozzá, tartsd meg ezt a sorrendet az `index.html`-ben.

## Debug tippek

- Nyisd meg a böngésző DevTools Console-t — minden `toast()` és state-mutáló hívás itt hibázna először.
- A mentés `localStorage`-ban van a `turtle_breeder_hunt_v1` kulcs alatt. Töröld, ha inkonzisztens state-et gyanítasz:
  ```js
  localStorage.removeItem('turtle_breeder_hunt_v1')
  ```
- A `state` objektum globálisan elérhető konzolból is (`state.money`, `state.turtles`, stb.), mivel nincs modul-enkapszuláció.
- Balansz-változáshoz elég a `data.js`-t módosítani (árak, ritkaság súlyok, biom költségek), a többi fájlhoz nem kell nyúlni.

## Ismert korlátok / TODO

- Nincs build/bundler, nincs TypeScript — szándékosan egyszerű, hogy könnyű debugolni.
- A reveal popup állapotgépe a `state.pendingReveal.revealed` flagre épül — ha új reveal-lépést adsz hozzá, ezt bővítsd, ne írd át teljesen.
- Mobil UI folyamatban van finomítva (2 oszlopos board, ikonos akciógombok) — lásd CHANGELOG.

## Deploy

Statikus site, ezért GitHub Pages / Netlify / Cloudflare Pages mindegyike egy lépésben (drag & drop vagy repo-connect) tudja szolgálni.
