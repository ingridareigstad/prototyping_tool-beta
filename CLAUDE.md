# Tripletex HTML/CSS Prototyping

This repo is a static HTML/CSS prototyping system for Tripletex. All prototypes use a shared design token system and component library — no frameworks, no build steps.

## Absolutte regler — bryt aldri disse

1. **Ingen hardkodede hex-farger** — aldri `#0a41fa`, alltid `var(--action-primary-rest)`
2. **Ingen hardkodede px-verdier** — aldri `padding: 16px`, alltid `var(--space-16)`
3. **Ikke bruk globale tokens direkte** — aldri `var(--global-blue-100)`, bare semantiske tokens
4. **Aldri bold skrift** — `font-weight: bold` og `700` er forbudt; `500` (medium) er maks
5. **Kun Atlas-godkjente tekststørrelser** — 12px, 14px, 16px, 20px, 30px. Ingen kursiv. Ingen emoji i UI-strenger.
6. **Alltid systemklasser** — `btn`, `input`, `form-group`, `tx-table`, `status-dot`, `chip`, `alert`, `card` osv. — aldri egne varianter

Full regelsett og token-oversikt: `_system/REGLER.md`.

## Kilde til sannhet for Atlas

`_system/`-filene er en lokal sandkasse-kopi tilpasset prototyping. Den **autoritative** kilden for tokens, komponenter og ikoner er Atlas på GitHub: `github.com/Tripletex-AS/tripletex-frontend/tree/main/design-system` (alt. `atlas.tripletex.dev`). Slå opp der ved tvil — ikke gjett. Det finnes med vilje ingen lokal kopi av hele design-systemet i dette repoet; bruk GitHub-kilden on-demand så vi unngår en utdatert kopi.

## Systemfiler — rør ikke disse

```
_system/tokens.css        ← alle design tokens (farger, spacing, størrelser, radius)
_system/components.css    ← alle komponentklasser (knapper, skjema, tabell, modal,
                            banner, notification, tabs, toggle, drawer, m.m.)
_system/layout.css        ← app-shell, topbar, sidebar, page-layout
_system/spacesuit.js      ← config-drevet delt topbar + sidebar (for fler-sides prototyper)
_system/atlas-icons.json  ← maskinlesbar ikon-katalog med alias — slå opp ikoner her
_system/icons.md          ← samme ikoner i lesbar form
_system/lint.js           ← regelsjekk; kjøres etter generering (se /ny-prototype og /sjekk-prototype)
_system/REGLER.md         ← full referanse: token-oversikt, kodeeksempler, konvensjoner
```

**Les `_system/REGLER.md` for full komponentreferanse, kodeeksempler og mappekonvensjoner.**

## Mappestruktur — hvor ting hører hjemme

Enkel regel: **hvis du åpner den i en nettleser, ligger den i rot (eller i `prototyper/`); hvis en side _laster_ den, ligger den i `_system/`.**

```
rot/                    ← sider du åpner direkte i nettleser
  index.html            ← dashbord / inngang
  gate.html             ← passord-gate for deling i brukertest
  komponenter.html      ← levende galleri over alle systemkomponenter (visuell fasit)
  CLAUDE.md             ← denne filen (auto-lastet)
_system/                ← avhengigheter som sidene laster (RØR IKKE)
  tokens.css, components.css, layout.css   ← lastes via ../../_system/…
  spacesuit.js, atlas-icons.json, icons.md, lint.js, REGLER.md
_templates/             ← startpunkt å kopiere fra
prototyper/             ← her jobber du; én mappe per prototype
```

`komponenter.html` og `components.css` er to forskjellige ting (en side du åpner vs. et stilark sider laster) — derfor ligger de hver sin plass. Galleriet heter `komponenter.html` (ikke `components.html`) nettopp for å unngå forveksling med stilarket.

## Maler — bruk alltid som startpunkt

| Mal | Bruk når |
|-----|----------|
| `_templates/side-med-tabell.html` | Siden viser en liste eller tabell |
| `_templates/side-med-skjema.html` | Siden har et skjema med felter og knapper |

Kopier riktig mal, legg filen i `prototyper/{kebab-case-navn}/`, og rett CSS-stiene til `../../_system/`.

For fler-sides prototyper med felles navigasjon: vurder `_system/spacesuit.js` i stedet for å kopiere topbar/sidebar-HTML inn i hver fil.

## Slash-kommandoer

- `/start-session` — les inn systemfilene og bekreft at du er klar
- `/ny-prototype` — guided oppretting av ny prototype (avslutter med linting)
- `/sjekk-prototype` — kvalitetssjekk av en ferdig prototype (linter + semantisk sjekk mot Atlas)

## Preview

```
npx serve -l 4567 .
```
