---
name: sjekk-prototype
description: >
  Sjekk en ferdig prototype mot designregler og Atlas-mønstre. Bruk når
  brukeren vil verifisere at en prototype er korrekt, eller etter at en
  prototype er generert. Trigger på "sjekk prototype", "verifiser",
  "se over prototypen", "er dette riktig?" eller lignende.
---

# Sjekk prototype

Du gjør en to-trinns kvalitetssjekk av en prototype: først mekaniske regelbrudd, deretter semantiske mønstre mot Atlas.

## Steg 1: Hvilken prototype?

Hvis brukeren ikke har spesifisert hvilken fil eller mappe som skal sjekkes, spør:
> "Hvilken prototype vil du sjekke? (Oppgi filsti eller mappenavn under `prototyper/`)"

## Steg 2: Mekanisk lint

Kjør linting-scriptet:

```bash
node _system/lint.js prototyper/{navn}/
```

Presenter resultatet til brukeren:
- Ved `✅ Ingen regelbrudd funnet` → gå videre til semantisk sjekk
- Ved `✖ feil` → list opp bruddene gruppert per regel, og forklar hva som bør endres

**Ikke rett feilene automatisk** — presenter dem og la brukeren bestemme om de skal fikses nå eller noteres.

## Steg 3: Semantisk sjekk mot REGLER.md og Atlas

Les `_system/REGLER.md` og les gjennom HTML-filen(e). Sjekk:

### Komponent-bruk
- [ ] Brukes alltid `btn btn-primary` / `btn btn-secondary` / `btn btn-ghost` — ingen egne knappestiler?
- [ ] Er `status-dot` brukt for statusindikatorer, ikke egne badge-klasser?
- [ ] Er `chip` brukt for nøytrale etiketter?
- [ ] Er `alert alert--{variant}` brukt for meldingsbokser?
- [ ] Er `form-group` + `input` + `input-label` brukt konsekvent i skjemaer?

### Layout og plassering
- [ ] Er primærknapper plassert til høyre i page-header (`page-actions`)?
- [ ] Er skjemaknapper under skjemaet, venstrejustert?
- [ ] Er det maks én primærknapp per brukeroppgave på siden?
- [ ] Er topbar og sidebar kopiert fra mal — ikke skrevet fra scratch?

### Typografi og innhold
- [ ] Er lenker blå (`var(--text-link)`), uten underline, regular vekt?
- [ ] Er hjelpetekster brukt der det er fare for misforståelse (`input-hint`)?
- [ ] Er tomme tilstander (empty state) håndtert hvis tabellen kan være tom?

### Atlas-mønstre (vurder etter beste skjønn)
- [ ] Følger siden logisk informasjonsarkitektur for denne typen skjerm?
- [ ] Er statusverdier konsistente med Atlas sin terminologi?
- [ ] Er handlinger plassert der brukeren forventer dem?

## Steg 4: Oppsummering

Gi en kort oppsummering strukturert slik:

```
✅ Bestått: [det som er bra]
⚠ Forbedringsforslag: [mønstre som kan forbedres]
✖ Regelbrudd: [konkrete feil som må fikses]
```

Avslutt med: om prototypen er klar til å vises frem, eller hva som bør fikses først.
