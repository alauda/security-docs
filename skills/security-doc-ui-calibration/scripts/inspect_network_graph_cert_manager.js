const { chromium } = require('playwright');

async function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => {
      data += chunk;
      const lines = data.split('\n').map(v => v.trim()).filter(Boolean);
      if (lines.length >= 3) resolve(lines.slice(0, 3));
    });
    process.stdin.on('end', () => {
      const lines = data.split('\n').map(v => v.trim()).filter(Boolean);
      resolve(lines.slice(0, 3));
    });
    process.stdin.on('error', reject);
  });
}

function clean(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

async function texts(page, selector, max = 200) {
  const count = await page.locator(selector).count().catch(() => 0);
  const out = [];
  for (let i = 0; i < Math.min(count, max); i++) {
    const value = clean(await page.locator(selector).nth(i).innerText().catch(() => ''));
    if (value) out.push(value);
  }
  return [...new Set(out)];
}

async function attrs(page, selector, attr, max = 100) {
  const count = await page.locator(selector).count().catch(() => 0);
  const out = [];
  for (let i = 0; i < Math.min(count, max); i++) {
    const value = clean(await page.locator(selector).nth(i).getAttribute(attr).catch(() => ''));
    if (value) out.push(value);
  }
  return [...new Set(out)];
}

async function collect(page, name) {
  return {
    name,
    url: page.url(),
    title: await page.title().catch(() => ''),
    headings: await texts(page, 'h1, h2, [role="heading"]', 80),
    buttons: await texts(page, 'button, [role="button"]', 220),
    labels: await texts(page, 'label', 180),
    tabs: await texts(page, '[role="tab"], [aria-selected="true"], a[aria-current="page"]', 100),
    placeholders: await attrs(page, 'input, textarea', 'placeholder', 100),
    bodyPreview: clean(await page.locator('body').innerText().catch(() => '')).slice(0, 7000),
  };
}

async function clickFirst(page, selectors) {
  for (const selector of selectors) {
    const loc = page.locator(selector).first();
    if (await loc.count()) {
      await loc.click({ timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(1200);
      return selector;
    }
  }
  return null;
}

async function login(page, baseUrl, username, password) {
  await page.goto(`${baseUrl.replace(/\/$/, '')}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 20000 }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
}

async function selectNamespace(page, namespace) {
  await clickFirst(page, [
    'button:has-text("NS")',
    '[aria-label="NS"]',
    'text=NS',
  ]);

  const search = page.locator('input[placeholder*="namespace" i], input[placeholder*="Filter" i], input[placeholder*="Search" i]').first();
  if (await search.count()) {
    await search.fill(namespace).catch(() => {});
    await page.waitForTimeout(1000);
  }

  await clickFirst(page, [
    `label:has-text("${namespace}")`,
    `[role="option"]:has-text("${namespace}")`,
    `text="${namespace}"`,
    `button:has-text("${namespace}")`,
  ]);

  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(2000);
}

async function openLegend(page) {
  await clickFirst(page, [
    'button:has-text("Legend")',
    '[aria-label*="legend" i]',
    'text=Legend',
  ]);
}

async function openGenerator(page) {
  await clickFirst(page, [
    'button:has-text("Network policy generator")',
    'text="Network policy generator"',
  ]);
}

async function clickDeployment(page) {
  await clickFirst(page, [
    'text="cert-manager-webhook"',
    'text="cert-manager-cainjector"',
    'text="cert-manager"',
  ]);
}

async function openDisplayOptions(page) {
  await clickFirst(page, [
    'button:has-text("Display options")',
    'text=/Display options/',
  ]);
}

async function main() {
  const [baseUrl, username, password] = await readStdin();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await login(page, baseUrl, username, password);
  await page.goto(new URL('/main/network-graph', baseUrl).toString(), { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2000);

  const result = [];
  result.push(await collect(page, 'network_graph_initial'));

  await selectNamespace(page, 'cert-manager');
  result.push(await collect(page, 'network_graph_after_cert_manager'));

  await openLegend(page);
  result.push(await collect(page, 'network_graph_after_legend'));

  await clickDeployment(page);
  result.push(await collect(page, 'network_graph_after_click_deployment'));

  await openDisplayOptions(page);
  result.push(await collect(page, 'network_graph_after_display_options'));

  await openGenerator(page);
  result.push(await collect(page, 'network_graph_after_generator'));

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch(err => {
  console.error(err.stack || String(err));
  process.exit(1);
});
