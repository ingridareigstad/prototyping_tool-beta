---
name: start-session
description: >
  Start en ny prototyping-session i dette Tripletex-prosjektet. Les inn alle
  relevante regler, tokens og konvensjoner slik at du kan hjelpe brukeren
  riktig fra første stund. Trigger på "start session", "ny session",
  "start prototyping" eller lignende.
---

# Start prototyping-session

Du starter en ny session i Tripletex-prototyping-prosjektet. Les gjennom dette nøye – det er kilden til sannhet for all koding i dette prosjektet.

## Steg 1: Les inn systemfilene

Les disse filene **nå**, i prioritert rekkefølge:

1. `_system/REGLER.md` — absolutte regler, token-oversikt, komponentklasser og konvensjoner
2. `_system/components.css` — alle tilgjengelige systemklasser
3. `_system/layout.css` — app-shell, topbar, sidebar, page-layout

Disse filene er den autoritative lokale kilden. Hvis noe i chatten strider mot dem, vinner filene.

**Les IKKE inn hele Atlas-referansen på forhånd.** Det finnes ingen lokal kopi av hele design-systemet i repoet. Ved tvil utover filene over, slå opp on-demand i Atlas på GitHub (se Steg 2).

## Steg 2: Kilde til sannhet for Atlas

`_system/`-filene er en lokal **sandkasse-kopi** tilpasset HTML/CSS-prototyping. Den autoritative kilden er Atlas på GitHub:
**`github.com/Tripletex-AS/tripletex-frontend/tree/main/design-system`** (alt. `atlas.tripletex.dev`, komponenteksempler i Atlas Storytime).

Arbeidsflyt: slå opp regler/tokens i GitHub-kilden → implementer i lokalt `_system/` for prototyping → merge godkjente endringer tilbake til Atlas-repoet når klart.

## Steg 3: Forstå prosjektstrukturen

```
{prosjektrot}/
  _system/          ← RØR IKKE
    tokens.css, components.css, layout.css, REGLER.md
    spacesuit.js        ← config-drevet delt topbar + sidebar
    atlas-icons.json    ← maskinlesbar ikon-katalog med alias
    icons.md            ← ikoner i lesbar form
    lint.js             ← regelsjekk (kjøres etter generering)
  _templates/       ← Startpunkt for nye prototyper
  prototyper/       ← Ferdige og pågående prototyper
  komponenter.html   ← Levende galleri over alle komponenter
  gate.html         ← Passord-gate for deling i brukertest
  index.html        ← Dashboard med oversikt over alle prototyper
  .claude/commands/ ← /start-session, /ny-prototype, /sjekk-prototype
```

Bruk relative stier internt. Ikke hardkod absolutte maskinstier.

## Steg 4: Absolutte regler – aldri bryt disse

1. **Ingen hardkodede hex-farger** — aldri `#0a41fa`, alltid `var(--action-primary-rest)`
2. **Ingen hardkodede px-verdier** — aldri `padding: 16px`, alltid `var(--space-16)`
3. **Ingen globale tokens direkte i HTML** — aldri `var(--global-blue-100)`
4. **Kun semantiske tokens** — token-navnene beskriver hensikt, ikke farge
5. **Aldri bold skrift** — `font-weight: bold` og `700` er forbudt; `500` (medium) er maks
6. **Font-smoothing alltid på** — `body` skal ha `-webkit-font-smoothing: antialiased` (allerede satt)
7. **Kun Atlas-tekststørrelser** — 12px, 14px, 16px, 20px, 30px. Ingen andre.
8. **Ingen kursiv** — bruk `font-weight: 500` for betoning.
9. **Ingen emoji i UI-strenger** — bruk ikoner fra Atlas-biblioteket.

## Steg 5: Token-systemet

### Farger
| Kategori | Eksempel-tokens |
|----------|----------------|
| Handling | `--action-primary-rest/hover/active`, `--action-secondary-*`, `--action-tertiary-*`, `--action-neutral-*` |
| Bakgrunn | `--surface-background`, `--surface-default`, `--surface-nav`, `--surface-disabled` |
| Status-bakgrunn | `--surface-info/success/warning/error-rest` og `-active` |
| Tekst | `--text-primary`, `--text-muted`, `--text-placeholder`, `--text-disabled`, `--text-on-action`, `--text-action`, `--text-link` |
| Kanter | `--border-faint`, `--border-muted`, `--border-primary`, `--border-focus`, `--border-hover`, `--border-error/warning/success/info` |

### Spacing (bruk alltid `--space-*`)
`--space-2` `--space-4` `--space-8` `--space-12` `--space-16` `--space-20` `--space-24` `--space-32` `--space-40` `--space-48` `--space-64` (+ `--space-1/28/36/44`)

### Størrelser (høyde på knapper og inputs)
`--size-tiny` (20px) `--size-small` (24px) `--size-medium` (32px) `--size-large` (40px) `--size-xl` (48px)

### Border-radius
`--radius-default` (4px) `--radius-full` (9999px) `--radius-none` `--radius-mobile` (16px)

## Steg 6: Systemklasser – bruk alltid disse, aldri egendefinerte varianter

### Knapper
```html
<button class="btn btn-primary">Lagre</button>
<button class="btn btn-secondary">Avbryt</button>
<button class="btn btn-ghost">Se mer</button>
<button class="icon-btn"><!-- svg --></button>
```

### Skjema
```html
<div class="form-group">
  <label class="input-label">Felt <span class="required">*</span></label>
  <input class="input" type="text" placeholder="...">
  <span class="input-hint">Hjelpetekst</span>
</div>
```

### Tabell
```html
<div class="table-container">
  <div class="table-toolbar"><div class="table-toolbar-filters">
    <div class="input-search-wrap"><input class="input" type="search" placeholder="Søk..."><svg class="input-search-icon"></svg></div>
    <div class="switcher"><button class="switcher-btn switcher-btn--active">Alle</button><button class="switcher-btn">Aktive</button></div>
  </div></div>
  <table class="tx-table table-standard">…</table>
</div>
```

### Status, chips, alerts, kort
```html
<span class="status-dot status-dot--success">Aktiv</span>   <!-- success|warning|error|neutral|info -->
<span class="chip">Etikett</span>
<div class="alert alert--info">…</div>                      <!-- info|warning|success|error -->
<div class="card"><div class="card-header">…</div><div class="card-body">…</div></div>
```
Flere komponenter i `components.css`: `modal`, `banner`, `notification`, `tabs`, `toggle`, `radio`, `checkbox`, `skeleton`, `spinner`, `pagination`, `tooltip`, `drawer`, `content-switcher`, `status-chip`, `label`. Se `komponenter.html` for et levende galleri.

## Steg 7: App-shell – topbar og sidebar

To måter (velg én):

- **Kopier fra mal** — `_templates/side-med-tabell.html` har riktig topbar + sidebar inline. Bra for enkle, enkeltstående sider.
- **`spacesuit.js`** — for fler-sides prototyper med felles navigasjon. Definer `window.SPACESUIT = { company, active, nav: [...] }` og last `_system/spacesuit.js`; shell-en rendres automatisk, så du slipper å kopiere ~100 linjer HTML i hver fil. Se kommentaren øverst i `spacesuit.js`.

Aldri skriv app-shell fra scratch.

## Steg 8: Ikoner

Slå opp ikoner i `_system/atlas-icons.json` (med alias som «flag, flagg, rapporter») eller `_system/icons.md`. Bruk navnet/SVG-en derfra — ikke gjett eller finn opp SVG-er.

## Steg 9: Figma-integrasjon

Når brukeren gir en Figma-URL (`figma.com/design/:fileKey/…?node-id=…`):
1. Hent design-kontekst med `get_design_context` (fileKey og nodeId fra URL-en)
2. Figma-verktøyet returnerer React/Tailwind — **konverter alltid til vanilla HTML/CSS** med systemklassene over
3. Hardkodede farger → semantisk token; Tailwind-spacing (`p-4`) → `var(--space-16)`

## Steg 10: Kvalitetssikring

Etter generering: kjør linteren og rett alle feil før du er ferdig.
```bash
node _system/lint.js prototyper/{navn}/
```
For full gjennomgang (linter + semantisk sjekk mot Atlas), bruk `/sjekk-prototype`.

## Steg 11: Preview

`npx serve -l 4567 .` fra prosjektroten (se `.claude/launch.json`).

---

## Oppsummering

- **Les `_system/REGLER.md`** ved tvil; slå opp i **Atlas på GitHub** for alt utover de lokale filene
- **Aldri hardkodede verdier**; **aldri bold**, ingen kursiv, ingen emoji
- **Alltid systemklasser**; **alltid mal eller `spacesuit.js`** for app-shell
- **Ikoner fra `atlas-icons.json`** — ikke gjett
- **Figma → konverter til systemklasser**
- **Avslutt alltid med linting** eller `/sjekk-prototype`

Svar brukeren kort med hva du har lest og er klar til å hjelpe med. Nevn gjerne hvilke prototyper som finnes i `prototyper/`.
