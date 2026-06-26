---
name: ny-prototype
description: >
  Lag en ny HTML/CSS-prototype i dette prosjektet. Bruk denne skillen når
  brukeren vil lage en ny prototype, nytt skjermbilde, ny side eller ny
  seksjon i prototyping-systemet. Trigger på fraser som "lag en ny prototype",
  "ny prototype", "legg til prototype", "opprett prototype" eller når brukeren
  beskriver en ny del av Tripletex de vil prototype.
---

# Lag ny prototype

Du hjelper brukeren med å opprette en ny prototype i dette Tripletex-prototyping-prosjektet. Målet er at alt følger eksisterende mønstre fra `_templates/` og `_system/`, slik at prototypen ser riktig ut fra første stund.

## Steg 1: Samle informasjon

Spør brukeren om følgende med `AskUserQuestion`:

- **Navn** (kebab-case, f.eks. `faktura-v1`) — brukes som mappenavn og filnavn
- **Visningsnavn** (f.eks. `Faktura`) — vises i nav og dashbord
- **Beskrivelse** — kort setning om hva prototypen dekker, til dashbordet
- **Sider** — liste over sider, f.eks. `oversikt (tabell), ny-faktura (skjema)`

For "Sider": be brukeren skrive sidenavn og type (tabell/skjema) for hver side. Hvis de er usikre, foreslå `index (tabell)` som default startpunkt.

## Steg 2: Opprett mappestruktur

Opprett mappen `prototyper/{navn}/` i prosjektroten. Bruk relative stier — ikke hardkod absolutte maskinstier.

## Steg 2b: Komponentgjenkjenning (obligatorisk før koding)

**Les `_system/components.css` nå** — ikke fra hukommelsen, men faktisk les filen.

**Åpne `komponenter.html` i preview** og ta et screenshot. Dette er den rendrede fasiten for alle systemkomponenter. Se hva komponentene faktisk ser ut som før du velger klasse — ikke bare les CSS.

Se på Figma-skjermbildet og identifiser alle distinkte UI-elementer i designet. For hvert element: finn matchende systemklasse, eller bekreft eksplisitt at det ikke finnes noe passende og at custom CSS er nødvendig med begrunnelse.

Gjør dette som et internt notat i denne formen:

```
- Statusindikator med prikk + tekst  →  .status-dot .status-dot--warning
- Horisontal fanerekke              →  .tabs .tab / .switcher .switcher-btn
- Liten pille med tekst/ikon        →  .chip
- Søkefelt med ikon                 →  .input-search-wrap + .input-search-icon
- Tabell med rader                  →  .tx-table (aldri egne font-regler på td/th)
- Varselboks med ikon               →  .alert .alert--warning
- Prikk uten tekst (ren markør)     →  CUSTOM – finnes ikke i systemet
```

**Ikke gå videre til Steg 3 før alle elementer er kartlagt.** Skriv aldri egendefinert CSS for noe som allerede finnes som systemkomponent.

### Bare Figma — aldri interpoler innhold

Legg **kun** inn innhold som er eksplisitt synlig i Figma-skjermbildet. Hvis en celle viser «Navn» og et beløp, legg inn akkurat det — ikke finn på ansattnumre, datoer, undertekster eller andre detaljer. Bruk generiske placeholders der Figma bruker placeholders. Spør brukeren dersom du er usikker på hva en celle skal inneholde.

## Steg 3: Kopier og tilpass maler

For **hver side**:

### Velg mal
- Side med liste/tabell → `_templates/side-med-tabell.html`
- Side med skjema/formular → `_templates/side-med-skjema.html`

### Kopier og gi nytt navn
Filnavn = sidenavn i kebab-case + `.html`, f.eks. `oversikt.html`, `ny-faktura.html`.

### Tilpass innholdet
1. **`<title>`** — `{Sidetittel} – Tripletex`
2. **CSS-stier** — malen bruker `../_system/`, men prototyper ligger ett nivå dypere. Rett til:
   ```html
   ../../_system/tokens.css
   ../../_system/components.css
   ../../_system/layout.css
   ```
3. **Sidebar-navigasjon** — merk riktig `nav-item` aktiv:
   ```html
   <div class="nav-item nav-item--active"><span class="nav-icon">…</span> {Visningsnavn}</div>
   ```
   Undersider: legg til `nav-sub`-lenker og merk aktiv med `nav-sub--active`.
4. **Sidetittel** — oppdater `<h1>` og evt. undertittel.
5. **Lenker mellom sider** — relative stier i samme mappe, f.eks. `href="ny-faktura.html"`.
6. **Ikoner** — slå opp i `_system/atlas-icons.json` eller `_system/icons.md`. Ikke gjett eller finn opp SVG-er.
7. **Dummy-innhold** — realistisk eksempelinnhold tilpasset temaet. Ikke la generisk placeholder stå.

### App-shell: mal eller spacesuit.js
- **Enkel/enkeltstående side** → behold topbar + sidebar fra malen (inline).
- **Fler-sides prototype med felles navigasjon** → vurder `_system/spacesuit.js`: definer `window.SPACESUIT = { company, active, nav: [...] }` og last scriptet, så slipper du å kopiere shell-HTML i hver fil. Se kommentaren øverst i `spacesuit.js` for format. (Eksempel: `prototyper/`-mapper som bruker spacesuit.)

Aldri skriv app-shell fra scratch.

## Steg 4: Oppdater dashbordet (index.html)

Legg til et nytt `proto-card` i `index.html` i rotet. Kopier mønsteret fra et eksisterende kort og fyll inn visningsnavn, beskrivelse, status-badge, dato og lenke(r) til siden(e).

## Steg 5: Visuell sammenligning — Figma vs. browser

Etter at siden er bygget, **ta et screenshot i browser og sammenlign med Figma** komponent for komponent:

1. Start preview-server og naviger til siden.
2. Ta screenshot i desktop-bredde (1280px).
3. For hver komponent som ble kartlagt i Steg 2b: verifiser at browser-outputen matcher Figma-designet visuelt. Sjekk spesielt:
   - Tekstfarge (ikke blå der Figma viser svart, ikke grå der Figma viser primær)
   - Underline-tykkelse og farge på tabs/lenker
   - Bakgrunnsfarger vs. kantfarger (se token-kategoriregler i `REGLER.md`)
   - At ingen ekstra border, strek eller boks dukker opp som ikke er i Figma

Hvis noe avviker: rett det i koden og ta nytt screenshot til det matcher.

## Steg 7: Kjør linter og rett feil

```bash
node _system/lint.js prototyper/{navn}/
```

Les output nøye. Rett **alle feil** (`✖`) før du er ferdig:
- Hex-farger → semantisk token (`var(--action-primary-rest)` osv.)
- Hardkodet `padding`/`margin`/`gap` i px → `var(--space-*)`
- `font-weight: bold` / `700` → `500`
- `var(--global-*)` → semantisk token

Kjør linteren på nytt etter rettinger og bekreft `✅ Ingen regelbrudd funnet.`

## Steg 8: Bekreft

Kort oppsummering: hvilke filer som ble opprettet, at dashbordet er oppdatert, at linteren er grønn, og at de kan åpne prototypen via dashbordet / pushe via GitHub Desktop.

---

## Viktige regler som gjelder for alle prototyper

- Ingen hardkodede hex-farger — alltid `var(--token-navn)`
- Ingen hardkodede px-verdier — alltid `var(--space-*)`
- `font-weight: bold` / `700` forbudt — maks `500`; ingen kursiv; ingen emoji i UI-strenger
- Kun Atlas-tekststørrelser (12/14/16/20/30px)
- Lenker: blå tekst (`var(--text-link)`), regular vekt, ingen underline
- Alltid systemklasser: `btn btn-primary`, `table-container`, `form-group`, `input`, `status-dot`, `chip`, `alert`, `card` osv. — aldri egne varianter
- App-shell fra mal eller `spacesuit.js` — aldri fra scratch
- Ikoner fra `atlas-icons.json` — ikke gjett
- Ved tvil utover `_system/`: slå opp i Atlas på GitHub (`github.com/Tripletex-AS/tripletex-frontend/tree/main/design-system`)
- Se `_system/REGLER.md` for full oversikt
