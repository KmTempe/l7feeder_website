import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { portfolioData } from '../../src/data/portfolioData.js';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, '../..');

const apiRoutes = [
  '/api/contact',
  '/api/send-otp',
  '/api/verify-otp',
  '/api/process-queue',
  '/api/cron/process-queue',
];

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function routeToFunctionFile(route) {
  return path.join(repoRoot, `${route.replace(/^\/api/, 'api')}.js`);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function serverRoutePattern(route) {
  return new RegExp(`app\\.all\\(['"]${escapeRegex(route)}['"]`);
}

function createSpaFallbackMatcher(source) {
  const match = source.match(/^\/:path\((.*)\)$/);

  if (!match) {
    throw new Error(`Unsupported SPA fallback source: ${source}`);
  }

  return new RegExp(`^/${match[1]}$`);
}

describe('API routing contract', () => {
  it('keeps frontend contact endpoints on relative API function routes', () => {
    const formConfig = portfolioData.contact.form;

    expect(formConfig.sendOtpUrl).toBe('/api/send-otp');
    expect(formConfig.verifyOtpUrl).toBe('/api/verify-otp');
    expect(apiRoutes).toEqual(expect.arrayContaining([
      formConfig.sendOtpUrl,
      formConfig.verifyOtpUrl,
    ]));
  });

  it.each(apiRoutes)('%s maps to an API function with a default handler', async (route) => {
    const filePath = routeToFunctionFile(route);

    expect(fs.existsSync(filePath)).toBe(true);

    const module = await import(pathToFileURL(filePath).href);
    expect(typeof module.default).toBe('function');
  });

  it('mirrors API function routes in the local Express server', () => {
    const serverSource = readProjectFile('server.js');

    for (const route of apiRoutes) {
      expect(serverSource).toMatch(serverRoutePattern(route));
    }
  });

  it('points Vercel cron schedules at existing API function routes', () => {
    const vercelConfig = JSON.parse(readProjectFile('vercel.json'));

    expect(vercelConfig.crons.length).toBeGreaterThan(0);

    for (const cron of vercelConfig.crons) {
      expect(apiRoutes).toContain(cron.path);
      expect(fs.existsSync(routeToFunctionFile(cron.path))).toBe(true);
    }
  });

  it('preserves API rewrites before the SPA fallback and excludes API paths from the fallback', () => {
    const vercelConfig = JSON.parse(readProjectFile('vercel.json'));
    const apiRewriteIndex = vercelConfig.rewrites.findIndex((rewrite) => (
      rewrite.source === '/api/:path*' && rewrite.destination === '/api/:path*'
    ));
    const spaFallbackIndex = vercelConfig.rewrites.findIndex((rewrite) => rewrite.destination === '/index.html');

    expect(apiRewriteIndex).toBeGreaterThanOrEqual(0);
    expect(spaFallbackIndex).toBeGreaterThan(apiRewriteIndex);

    const matchesSpaFallback = createSpaFallbackMatcher(vercelConfig.rewrites[spaFallbackIndex].source);

    expect(matchesSpaFallback.test('/api')).toBe(false);
    expect(matchesSpaFallback.test('/api/send-otp')).toBe(false);
    expect(matchesSpaFallback.test('/api/cron/process-queue')).toBe(false);
    expect(matchesSpaFallback.test('/projects')).toBe(true);
    expect(matchesSpaFallback.test('/assets/app.js')).toBe(false);
  });
});
