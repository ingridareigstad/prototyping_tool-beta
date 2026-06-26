/* ============================================================
 * Onboarding – import av historikk (prototype-only)
 * Delt logikk for de tre Importer historikk-sidene:
 *   - parser opplastede CSV-filer i nettleseren
 *   - genererer oppgaver fra det faktiske innholdet
 *   - lagrer/leser modellen i sessionStorage så stegene henger sammen
 * Ingen backend, ingen ekte KI – "tolkningen" er regelbasert parsing.
 * ============================================================ */
(function () {
  // Ansatte som finnes "i systemet" — brukes til å avgjøre om en barn-rad
  // kan kobles til en ansatt.
  var KNOWN = ['Ingrid Reigstad', 'Ola Nordmann', 'Kari Hansen', 'Per Johansen',
    'Mette Olsen', 'Lars Berg', 'Nina Dahl', 'Erik Solberg', 'Anne Lie',
    'Tor Pedersen', 'Siri Haugen', 'Jonas Moen', 'Bjørn Strand', 'Hanne Lund'];

  var STORAGE_KEY = 'onboardingImport';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function plural(n, en, fl) { return n + ' ' + (Number(n) === 1 ? en : fl); }

  /* ---- CSV-parsing ---- */
  function parseCSV(text) {
    var lines = text.replace(/\r/g, '').split('\n').filter(function (l) { return l.trim() !== ''; });
    if (!lines.length) return { header: [], rows: [] };
    var delim = lines[0].indexOf(';') > -1 ? ';' : ',';
    var header = lines[0].split(delim).map(function (h) { return h.trim(); });
    var rows = lines.slice(1).map(function (l) {
      var cells = l.split(delim);
      var obj = { __raw: l };
      header.forEach(function (h, i) { obj[h] = (cells[i] || '').trim(); });
      return obj;
    });
    return { header: header, rows: rows };
  }

  function classify(filename) {
    var n = (filename || '').toLowerCase();
    if (n.indexOf('kvot') > -1) return 'kvote';
    if (n.indexOf('barn') > -1) return 'barn';
    return 'fravaer';
  }

  function pick(row, keys) {
    for (var i = 0; i < keys.length; i++) {
      if (row[keys[i]] != null && row[keys[i]] !== '') return row[keys[i]];
      // case-insensitiv fallback
      for (var k in row) {
        if (k.toLowerCase() === keys[i].toLowerCase() && row[k] !== '') return row[k];
      }
    }
    return '';
  }

  /* ---- Bygg én oppgave fra en fil ---- */
  function buildTask(filename, parsed) {
    var type = classify(filename);
    var rows = parsed.rows;

    if (type === 'fravaer') {
      var inst = rows.map(function (r) {
        var fra = pick(r, ['Fra']), til = pick(r, ['Til']);
        var val = (til && til !== fra) ? (fra + '–' + til) : fra;
        return { name: pick(r, ['Ansatt']), sub: pick(r, ['Type']) || 'Egenmelding', value: val };
      });
      return {
        id: 'fravaer', type: type, file: filename,
        title: 'Opprett ' + inst.length + ' fravær',
        subtitle: '100% match mellom systemet og dataen i ' + filename,
        instances: inst, skipped: [], selected: false
      };
    }

    if (type === 'kvote') {
      var inst2 = rows.map(function (r) {
        var p = pick(r, ['Perioder']) || '0', dg = pick(r, ['Dager']) || '0';
        return {
          name: pick(r, ['Ansatt']), sub: 'Egenmeldingskvote',
          value: plural(p, 'periode', 'perioder') + ' og ' + plural(dg, 'dag', 'dager')
        };
      });
      return {
        id: 'kvote', type: type, file: filename,
        title: 'Juster fraværskvoten for ' + inst2.length + ' ansatte',
        subtitle: '100% match mellom systemet og dataen i ' + filename,
        instances: inst2, skipped: [], selected: false
      };
    }

    // barn — valider hver rad
    var valid = [], skipped = [];
    rows.forEach(function (r) {
      var navn = pick(r, ['Ansatt']);
      var aar = pick(r, ['Fødselsår', 'Fodselsar', 'Fødselsaar', 'Fodselsår']);
      if (KNOWN.indexOf(navn) === -1) {
        skipped.push({ raw: r.__raw, reason: 'Fant ingen ansatt som matcher «' + navn + '»', canAdd: false });
      } else if (!aar) {
        skipped.push({ raw: r.__raw, reason: 'Mangler fødselsår', canAdd: true, ansatt: navn });
      } else if (!/^\d{4}$/.test(aar)) {
        skipped.push({ raw: r.__raw, reason: 'Ugjenkjennelig datoformat «' + aar + '»', canAdd: true, ansatt: navn });
      } else {
        valid.push({ name: navn, sub: 'Barn', value: 'Født ' + aar });
      }
    });
    return {
      id: 'barn', type: type, file: filename,
      title: 'Legg til barn på ' + valid.length + ' ansatte',
      subtitle: 'AI tolket dataen i ' + filename + ' og matchet med datastrukturen i systemet.',
      instances: valid, skipped: skipped, selected: false
    };
  }

  /* ---- Lagring ---- */
  function save(tasks) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tasks || [])); } catch (e) {}
  }
  function load() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { return null; }
  }

  /* ---- Felles HTML-byggere ---- */
  function instanceRowHTML(inst) {
    return '<div class="task-instance">'
      + '<svg class="task-instance-icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 12l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      + '<span class="task-instance-name">' + esc(inst.name) + ' • ' + esc(inst.sub) + '</span>'
      + '<span class="task-instance-date">' + esc(inst.value) + '</span>'
      + '<button class="task-instance-del" type="button" aria-label="Slett">'
      + '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5h6v2M6.5 7l1 12.5h9l1-12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      + '</button></div>';
  }

  function skippedRowHTML(s) {
    var btn = s.canAdd
      ? '<button class="btn btn-secondary btn-small task-skipped-add" type="button" data-ansatt="' + esc(s.ansatt || '') + '">Legg til'
        + '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>'
      : '';
    return '<div class="task-skipped-row">'
      + '<svg class="task-skipped-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.5"/><path d="M12 7.5v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="16" r="0.75" fill="currentColor"/></svg>'
      + '<div class="task-skipped-text"><div class="task-skipped-raw">' + esc(s.raw) + '</div>'
      + '<div class="task-skipped-reason">' + esc(s.reason) + '</div></div>'
      + btn + '</div>';
  }

  var chevronSVG = '<svg class="task-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // Felles interaksjon: chevron åpner/lukker, papirkurv sletter instans
  function wireCommon(scope) {
    scope.querySelectorAll('.task-chevron-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panel = btn.closest('.task-row').querySelector('.task-expand');
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
      });
    });
    scope.addEventListener('click', function (e) {
      var del = e.target.closest('.task-instance-del');
      if (del) { del.closest('.task-instance').remove(); }
    });
  }

  window.OnboardingImport = {
    KNOWN: KNOWN,
    parseCSV: parseCSV,
    classify: classify,
    buildTask: buildTask,
    save: save,
    load: load,
    esc: esc,
    instanceRowHTML: instanceRowHTML,
    skippedRowHTML: skippedRowHTML,
    chevronSVG: chevronSVG,
    wireCommon: wireCommon
  };
})();
