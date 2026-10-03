import * as fs from 'node:fs';
import * as path from 'node:path';

const MASK = '[REDACTED]';
const sensitiveKey = /password|passwd|secret|token|authorization|api[-_]?key|cookie|credential/i;

/** Sanitize raw results before uploading artifacts or generating a report. */
export function sanitizeAllureResults(directory: string, environment: Record<string, string | undefined> = process.env): number {
  if (!fs.existsSync(directory)) { return 0; }
  const secrets = Object.entries(environment)
    .filter(([key, value]) => sensitiveKey.test(key) && value && value.length >= 4)
    .map(([, value]) => value!)
    .sort((a, b) => b.length - a.length);
  const redactText = (input: string): string => {
    let output = input;
    for (const secret of secrets) {
      for (const variant of new Set([secret, JSON.stringify(secret).slice(1, -1), encodeURIComponent(secret)])) {
        output = output.split(variant).join(MASK);
      }
    }
    return output
      .replace(/\bre_[\w-]{20,}\b/g, MASK)
      .replace(/\b(?:Bearer|Basic)\s+[\w+/=.~-]+/gi, MASK)
      .replace(/(["']?(?:password|passwd|secret|access_token|refresh_token|api[-_]?key|authorization|cookie)["']?\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'[^']*'|[^\s,;}]+)/gi, `$1"${MASK}"`);
  };
  const files: string[] = [];
  const collect = (folder: string): void => {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const target = path.join(folder, entry.name);
      if (entry.isDirectory()) { collect(target); }
      else if (entry.isFile()) { files.push(target); }
      else { throw new Error('Allure results contain an unsupported filesystem entry.'); }
    }
  };
  collect(directory);
  const omitted = new Set<string>();
  let changed = 0;
  for (const file of files.filter(file => !file.endsWith('.json'))) {
    const content = fs.readFileSync(file);
    const text = content.toString('utf8');
    // Preserve binary evidence unless a credential is detectable in its bytes.
    if (content.includes(0) || !Buffer.from(text, 'utf8').equals(content)) {
      if (redactText(text) !== text) {
        fs.writeFileSync(file, 'Binary evidence omitted because credential bytes were detected.\n');
        omitted.add(path.relative(directory, file).replaceAll('\\', '/'));
        changed++;
      }
    }
    else {
      const safe = redactText(text);
      if (safe !== text) { fs.writeFileSync(file, safe); changed++; }
    }
  }
  const sanitize = (value: unknown): unknown => {
    if (typeof value === 'string') { return redactText(value); }
    if (Array.isArray(value)) { return value.map(sanitize); }
    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      const safe: Record<string, unknown> = {};
      for (const [key, item] of Object.entries(record)) {
        safe[key] = sensitiveKey.test(key) ? MASK : sanitize(item);
      }
      // Allure parameters/headers use name/value pairs rather than key/value objects.
      if (typeof record.name === 'string' && sensitiveKey.test(record.name) && 'value' in record) { safe.value = MASK; }
      if (typeof record.source === 'string' && omitted.has(record.source)) { safe.type = 'text/plain'; }
      return safe;
    }
    return value;
  };
  for (const file of files.filter(file => file.endsWith('.json'))) {
    const original = fs.readFileSync(file, 'utf8');
    const safe = JSON.stringify(sanitize(JSON.parse(original)));
    if (safe !== original) { fs.writeFileSync(file, safe); changed++; }
  }
  return changed;
}

if (import.meta.main) {
  const directories = process.argv.slice(2);
  if (directories.length === 0) { throw new Error('Provide an Allure results directory.'); }
  const changed = directories.reduce((count, directory) => count + sanitizeAllureResults(directory), 0);
  console.log(`Allure sanitization completed: ${changed} files updated.`);
}
