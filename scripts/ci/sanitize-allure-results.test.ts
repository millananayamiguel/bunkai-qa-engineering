import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, describe, expect, test } from 'bun:test';
import { sanitizeAllureResults } from './sanitize-allure-results';

const folders: string[] = [];
const folder = (): string => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'allure-sanitize-'));
  folders.push(directory);
  return directory;
};
afterEach(() => { for (const directory of folders.splice(0)) { fs.rmSync(directory, { recursive: true, force: true }); } });

describe('safe Allure sharing', () => {
  test('removes nested credentials, parameters, headers and escaped known values while keeping test identity', () => {
    const directory = folder();
    const credential = 'test-password-with-"quote';
    fs.writeFileSync(path.join(directory, 'run-result.json'), JSON.stringify({
      uuid: 'test-uuid',
      name: `Login ${credential}`,
      status: 'passed',
      start: 123,
      parameters: [{ name: 'password', value: 'otherwise-unrecognized' }, { name: 'project', value: 'Bunkai' }],
      steps: [{ name: `login ${JSON.stringify({ password: credential })}`, attachments: [{ source: 'request.txt', type: 'text/plain' }] }],
      request: { headers: [{ name: 'Authorization', value: 'arbitrary-credential' }], body: { password: 'unknown-password', count: 2 } },
    }));
    fs.writeFileSync(path.join(directory, 'request.txt'), `password=${JSON.stringify(credential)}\nBearer unknown-token\n`);
    sanitizeAllureResults(directory, { STAGING_USER_PASSWORD: credential });
    const result = JSON.parse(fs.readFileSync(path.join(directory, 'run-result.json'), 'utf8'));
    const serialized = JSON.stringify(result);
    for (const secret of [credential, 'otherwise-unrecognized', 'arbitrary-credential', 'unknown-password']) { expect(serialized).not.toContain(secret); }
    expect(result.uuid).toBe('test-uuid');
    expect(result.status).toBe('passed');
    expect(result.start).toBe(123);
    expect(result.parameters[1].value).toBe('Bunkai');
    expect(fs.readFileSync(path.join(directory, 'request.txt'), 'utf8')).not.toContain('unknown-token');
  });
  test('recognizes provider tokens even when the publisher lacks their environment value', () => {
    const directory = folder();
    const providerToken = `re_${'dummy'.repeat(8)}`;
    fs.writeFileSync(path.join(directory, 'response.txt'), `mail provider: ${providerToken}`);
    sanitizeAllureResults(directory, {});
    expect(fs.readFileSync(path.join(directory, 'response.txt'), 'utf8')).not.toContain(providerToken);
  });
  test('quarantines binary evidence with detected credentials and preserves ordinary evidence', () => {
    const directory = folder();
    fs.writeFileSync(path.join(directory, 'trace.zip'), Buffer.concat([Buffer.from([80, 75, 0, 255, 42]), Buffer.from('Bearer dummy-secret')]));
    fs.writeFileSync(path.join(directory, 'result.json'), JSON.stringify({ attachments: [{ source: 'trace.zip', type: 'application/zip' }] }));
    const image = Buffer.from([137, 80, 78, 71, 0, 255]);
    fs.writeFileSync(path.join(directory, 'screenshot.png'), image);
    sanitizeAllureResults(directory, {});
    expect(fs.readFileSync(path.join(directory, 'screenshot.png'))).toEqual(image);
    const result = JSON.parse(fs.readFileSync(path.join(directory, 'result.json'), 'utf8'));
    expect(result.attachments[0]).toEqual({ source: 'trace.zip', type: 'text/plain' });
    expect(fs.readFileSync(path.join(directory, 'trace.zip'), 'utf8')).toContain('omitted');
  });
  test('is idempotent and handles absent or empty results', () => {
    const directory = folder();
    expect(sanitizeAllureResults(path.join(directory, 'missing'), {})).toBe(0);
    expect(sanitizeAllureResults(directory, {})).toBe(0);
    fs.writeFileSync(path.join(directory, 'result.json'), JSON.stringify({ status: 'passed', password: 'private' }));
    sanitizeAllureResults(directory, {});
    expect(sanitizeAllureResults(directory, {})).toBe(0);
  });
});
