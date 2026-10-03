import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, expect, test } from 'bun:test';

import { ensurePagesBranch } from './publish-allure-pages';

const roots: string[] = [];
const git = (cwd: string, ...args: string[]): string => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
function fixture(): { pages: string, remote: string } {
  const root = mkdtempSync(join(tmpdir(), 'allure-pages-test-'));
  roots.push(root);
  const pages = join(root, 'pages');
  const remote = join(root, 'remote.git');
  mkdirSync(pages);
  git(root, 'init', '--bare', remote);
  git(pages, 'init', '-b', 'master');
  git(pages, 'remote', 'add', 'origin', remote);
  git(pages, 'config', 'user.name', 'Test Publisher');
  git(pages, 'config', 'user.email', 'publisher@example.test');
  return { pages, remote };
}
function commit(pages: string, content: string): string {
  writeFileSync(join(pages, 'index.html'), content);
  git(pages, 'add', '--', 'index.html');
  git(pages, 'commit', '-m', 'Publish test report');
  return git(pages, 'rev-parse', 'HEAD');
}
afterEach(() => {
  for (const root of roots.splice(0)) {
    if (!resolve(root).startsWith(resolve(tmpdir()) + '/'.replace('/', process.platform === 'win32' ? '\\' : '/'))) {
      throw new Error('Cleanup target outside temporary directory');
    }
    rmSync(root, { recursive: true, force: true });
  }
});

test('partial checkout on unborn master can publish its first gh-pages commit', () => {
  const { pages, remote } = fixture();
  expect(spawnSync('git', ['show-ref', '--verify', 'refs/heads/gh-pages'], { cwd: pages }).status).not.toBe(0);
  ensurePagesBranch(pages);
  const sha = commit(pages, 'First report');
  git(pages, 'push', 'origin', 'gh-pages');
  expect(git(remote, 'rev-parse', 'refs/heads/gh-pages')).toBe(sha);
});

test('existing gh-pages history remains an ancestor after the next publish', () => {
  const { pages, remote } = fixture();
  ensurePagesBranch(pages);
  const first = commit(pages, 'Previous report');
  git(pages, 'push', 'origin', 'gh-pages');
  ensurePagesBranch(pages);
  const next = commit(pages, 'Next report');
  git(pages, 'push', 'origin', 'gh-pages');
  expect(git(remote, 'rev-parse', 'refs/heads/gh-pages')).toBe(next);
  expect(git(pages, 'rev-parse', 'HEAD^')).toBe(first);
});

test('detached remote gh-pages checkout attaches without replacing history', () => {
  const { pages } = fixture();
  ensurePagesBranch(pages);
  const sha = commit(pages, 'Previous report');
  git(pages, 'push', 'origin', 'gh-pages');
  git(pages, 'checkout', '--detach', sha);
  git(pages, 'branch', '-d', 'gh-pages');
  ensurePagesBranch(pages);
  expect(git(pages, 'symbolic-ref', '--short', 'HEAD')).toBe('gh-pages');
  expect(git(pages, 'rev-parse', 'HEAD')).toBe(sha);
});

test('unrelated committed branch is rejected without changing its history', () => {
  const { pages } = fixture();
  const sha = commit(pages, 'Unrelated source content');
  expect(() => ensurePagesBranch(pages)).toThrow('refusing to replace existing history');
  expect(git(pages, 'rev-parse', 'HEAD')).toBe(sha);
  expect(git(pages, 'symbolic-ref', '--short', 'HEAD')).toBe('master');
});
