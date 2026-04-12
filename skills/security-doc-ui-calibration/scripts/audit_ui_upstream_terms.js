const { chromium } = require('playwright');

async function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    let done = false;
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => {
      if (done) return;
      data += chunk;
      const lines = data.split('\n').map(v => v.trim()).filter(Boolean);
      if (lines.length >= 3) {
        done = true;
        resolve(lines.slice(0, 3));
      }
    });
    process.stdin.on('end', () => {
      if (!done) {
        const lines = data.split('\n').map(v => v.trim()).filter(Boolean);
        resolve(lines.slice(0, 3));
      }
    });
    process.stdin.on('error', reject);
  });
}

function clean(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

function buildFindings(text) {
  const terms = [
    { term: 'OpenShift', regex: /OpenShift/gi },
    { term: 'OCP', regex: /\bOCP\b/gi },
    { term: 'RHACS', regex: /RHACS|Red Hat Advanced Cluster Security/gi },
    { term: 'Red Hat', regex: /Red Hat/gi },
    { term: 'StackRox', regex: /StackRox/gi },
  ];

  const findings = [];
  for (const item of terms) {
    const seen = new Set();
    for (const match of text.matchAll(item.regex)) {
      const start = Math.max(0, match.index - 80);
      const end = Math.min(text.length, match.index + match[0].length + 120);
      const snippet = clean(text.slice(start, end));
      if (!seen.has(snippet)) {
        seen.add(snippet);
        findings.push({ term: item.term, snippet });
      }
      if (seen.size >= 5) break;
    }
  }
  return findings;
}

async function login(page, baseUrl, username, password) {
  const loginUrl = `${baseUrl.replace(/\/$/, '')}/login`;
  let lastError;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(1200);
      await page.locator('input[name="username"]').fill(username);
      await page.locator('input[name="password"]').fill(password);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 20000 }).catch(() => {});
      await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
      return;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(1500);
    }
  }

  throw lastError;
}

async function auditRoute(page, baseUrl, route) {
  await page.goto(new URL(route, baseUrl).toString(), { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(900);
  const title = await page.title().catch(() => '');
  const body = clean(await page.locator('body').innerText().catch(() => ''));
  const headings = await page.locator('h1, h2, [role="heading"]').evaluateAll(elements =>
    elements.map(el => (el.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 8)
  ).catch(() => []);
  return {
    route,
    url: page.url(),
    title,
    headings,
    bodyFindings: buildFindings(body),
    titleFindings: buildFindings(title),
  };
}

async function main() {
  const [baseUrl, username, password] = await readStdin();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await login(page, baseUrl, username, password);

  const routes = [
    '/main/dashboard',
    '/main/network-graph',
    '/main/network-graph?EDGE_STATE=active&TIME_WINDOW=Past%20hour&s[Cluster]=business-1',
    '/main/violations?violationState=ACTIVE&filteredWorkflowView=Applications%20view',
    '/main/vulnerabilities/user-workloads',
    '/main/vulnerabilities/exception-management/pending-requests',
    '/main/vulnerabilities/reports/configuration',
    '/main/vulnerabilities/reports/configuration?action=create',
    '/main/configmanagement',
    '/main/risk',
    '/main/clusters',
    '/main/clusters/delegated-image-scanning',
    '/main/clusters/discovered-clusters',
    '/main/clusters/init-bundles',
    '/main/clusters/cluster-registration-secrets',
    '/main/policy-management/policies',
    '/main/policy-management/policies/?action=create',
    '/main/collections',
    '/main/collections?action=create',
    '/main/integrations',
    '/main/integrations/notifiers/email/create',
    '/main/integrations/imageIntegrations/docker',
    '/main/integrations/imageIntegrations/docker/create',
    '/main/integrations/signatureIntegrations/signature/create',
    '/main/integrations/authProviders/apitoken',
    '/main/integrations/authProviders/apitoken/create',
    '/main/systemconfig',
  ];

  const pages = [];
  for (const route of routes) {
    pages.push(await auditRoute(page, baseUrl, route));
  }

  const result = {
    auditedAt: new Date().toISOString(),
    auditedRouteCount: routes.length,
    routes,
    bodyMatches: pages.filter(item => item.bodyFindings.length > 0),
    titleMatches: pages.filter(item => item.titleFindings.length > 0),
  };

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch(err => {
  console.error(err.stack || String(err));
  process.exit(1);
});
