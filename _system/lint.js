#!/usr/bin/env node
/**
 * Tripletex Prototype Linter
 *
 * Sjekker HTML-filer for brudd på de absolutte reglene i REGLER.md.
 * Kjøres av Claude etter generering, og kan kjøres manuelt:
 *
 *   node _system/lint.js                     → sjekker alle filer i prototyper/
 *   node _system/lint.js prototyper/foo/     → sjekker én mappe
 *   node _system/lint.js prototyper/foo/bar.html → sjekker én fil
 */

const fs   = require('fs');
const path = require('path');

// ─── Regler ──────────────────────────────────────────────────────────────────

const RULES = [
  {
    id: 'no-hex-color',
    severity: 'error',
    message: 'Hardkodet hex-farge — bruk semantisk token, f.eks. var(--action-primary-rest)',
    // Matches #rgb, #rrggbb, #rrggbbaa — but not inside comments
    pattern: /#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g,
    scope: 'style',
  },
  {
    id: 'no-hardcoded-px',
    severity: 'error',
    message: 'Hardkodet px-verdi i padding/margin/gap — bruk var(--space-*) eller var(--size-*)',
    // Only flag px in padding, margin, gap — not borders, box-shadow, min-width etc.
    // Matches: "padding: 16px", "margin-top: 8px", "gap: 12px", "padding: 8px 16px"
    pattern: /(?:^|;|\{)\s*(?:padding|margin|gap)(?:-(?:top|right|bottom|left|block|inline|block-start|block-end|inline-start|inline-end))?\s*:\s*[^;]*\b([1-9]\d*)px\b/g,
    scope: 'style',
  },
  {
    id: 'no-font-weight-bold',
    severity: 'error',
    message: 'font-weight: bold/700 er forbudt — bruk maks font-weight: 500 (medium)',
    pattern: /font-weight\s*:\s*(bold|700|800|900)\b/g,
    scope: 'style',
  },
  {
    id: 'no-global-token',
    severity: 'error',
    message: 'Globale tokens (--global-*) skal ikke brukes direkte — bruk semantiske tokens',
    pattern: /var\(\s*--global-[a-z0-9-]+/g,
    scope: 'style',
  },
  {
    id: 'no-inline-color-hex',
    severity: 'error',
    message: 'Hardkodet hex-farge i style-attributt — bruk semantisk token',
    pattern: /#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g,
    scope: 'inline-style',
  },
  {
    id: 'no-inline-px',
    severity: 'error',
    message: 'Hardkodet px-verdi i padding/margin/gap (style-attributt) — bruk var(--space-*)',
    pattern: /(?:^|;)\s*(?:padding|margin|gap)(?:-(?:top|right|bottom|left|block|inline))?s*:\s*[^;]*\b([1-9]\d*)px\b/g,
    scope: 'inline-style',
  },
  {
    id: 'no-inline-font-weight-bold',
    severity: 'error',
    message: 'font-weight: bold/700 i style-attributt — bruk maks 500',
    pattern: /font-weight\s*:\s*(bold|700|800|900)\b/g,
    scope: 'inline-style',
  },

  // ── Advarsler: reinvented components ────────────────────────────────────────

  {
    id: 'warn-reinvented-dot',
    severity: 'warn',
    message: 'border-radius: 50% ligner på .status-dot — sjekk om systemkomponenten dekker behovet',
    hint: 'Bruk .status-dot .status-dot--success/warning/error/info/neutral i stedet for egne prikk-klasser',
    pattern: /border-radius\s*:\s*50%/g,
    scope: 'style',
  },
  {
    id: 'warn-table-font-override',
    severity: 'warn',
    message: 'font-regler på td/th overstyrer .tx-table — tabellypografi skal komme fra systemklassen',
    hint: 'Fjern egne font-size/font-weight/font på td og th. .tx-table definerer dette korrekt.',
    pattern: /\b(?:td|th)\b[^{]*\{[^}]*\bfont(?:-size|-weight)?\s*:/gs,
    scope: 'style',
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function findHtmlFiles(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else if (entry.endsWith('.html')) {
        files.push(full);
      }
    }
  }
  walk(target);
  return files;
}

function getLineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

// ─── Extractors ───────────────────────────────────────────────────────────────

/** Extract all <style>…</style> blocks with their start offset in the file */
function extractStyleBlocks(content) {
  const blocks = [];
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    blocks.push({ text: m[1], offset: m.index + m[0].indexOf(m[1]) });
  }
  return blocks;
}

/** Extract all style="…" attribute values with their start offset */
function extractInlineStyles(content) {
  const styles = [];
  const re = /\bstyle="([^"]*)"/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    styles.push({ text: m[1], offset: m.index + m[0].indexOf(m[1]) });
  }
  return styles;
}

// ─── Linter ───────────────────────────────────────────────────────────────────

function lintFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];

  for (const rule of RULES) {
    const sources =
      rule.scope === 'style'        ? extractStyleBlocks(content) :
      rule.scope === 'inline-style' ? extractInlineStyles(content) :
      [];

    for (const { text, offset } of sources) {
      const re = new RegExp(rule.pattern.source, rule.pattern.flags);
      let m;
      while ((m = re.exec(text)) !== null) {
        if (rule.skipIfLine) {
          const lineStart = text.lastIndexOf('\n', m.index) + 1;
          const lineEnd   = text.indexOf('\n', m.index);
          const line      = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
          if (rule.skipIfLine.test(line)) continue;
        }
        const absIndex  = offset + m.index;
        const lineNum   = getLineNumber(content, absIndex);
        const lineStart = content.lastIndexOf('\n', absIndex) + 1;
        const lineEnd   = content.indexOf('\n', absIndex);
        const lineText  = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();
        violations.push({
          rule: rule.id,
          severity: rule.severity,
          message: rule.message,
          line: lineNum,
          match: m[0],
          lineText,
        });
      }
    }
  }

  return violations;
}

// ─── Reporter ─────────────────────────────────────────────────────────────────

function report(allResults) {
  let totalErrors   = 0;
  let totalWarnings = 0;
  let totalFiles    = 0;

  for (const { file, violations } of allResults) {
    if (violations.length === 0) continue;
    totalFiles++;
    const rel = path.relative(process.cwd(), file);
    console.log(`\n📄 ${rel}`);

    for (const v of violations) {
      if (v.severity === 'error') totalErrors++;
      else totalWarnings++;
      const icon = v.severity === 'error' ? '✖' : '⚠';
      console.log(`  ${icon} Linje ${v.line}: [${v.rule}] ${v.message}`);
      console.log(`      Funnet: "${v.match.slice(0, 80)}"`);
      console.log(`      → ${v.lineText.slice(0, 120)}`);
      if (v.hint) console.log(`      💡 ${v.hint}`);
    }
  }

  console.log('\n' + '─'.repeat(60));
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('✅ Ingen regelbrudd funnet.');
  } else if (totalErrors === 0) {
    console.log(`✅ Ingen regelbrudd funnet. (${totalWarnings} ${totalWarnings !== 1 ? 'advarsler' : 'advarsel'} – se over)`);
  } else {
    const warnSuffix = totalWarnings > 0 ? `, ${totalWarnings} ${totalWarnings !== 1 ? 'advarsler' : 'advarsel'}` : '';

    console.log(`❌ ${totalErrors} regelbrudd i ${totalFiles} fil(er)${warnSuffix}. Rett feil før du er ferdig.`);
    process.exit(1);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const target = process.argv[2] || path.join(__dirname, '..', 'prototyper');

let files;
try {
  files = findHtmlFiles(target);
} catch (e) {
  console.error(`Finner ikke: ${target}`);
  process.exit(1);
}

if (files.length === 0) {
  console.log('Ingen HTML-filer funnet.');
  process.exit(0);
}

console.log(`Sjekker ${files.length} fil(er)…\n`);

const results = files.map(file => ({ file, violations: lintFile(file) }));
report(results);
