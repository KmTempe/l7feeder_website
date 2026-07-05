const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const lastmod = new Date().toISOString().split('T')[0];

const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('✓ Created public directory at', publicDir);
}

function generateFavicon() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" style="stop-color:#00d9ff;stop-opacity:1" />
  <stop offset="100%" style="stop-color:#00ff88;stop-opacity:1" />
  </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="32" fill="#0a1628"/>
  <path d="M 42 18 L 38 22 L 42 26 L 46 22 Z M 37 23 L 23 37 C 22 38 22 40 23 41 C 24 42 26 42 27 41 L 41 27 L 37 23 Z" fill="url(#grad1)" stroke="#00d9ff" stroke-width="1"/>
  <path d="M 46 18 L 44 20 L 48 24 L 50 22 Z M 43 21 L 32 32 L 28 36 L 32 40 L 36 36 L 47 25 L 43 21 Z" fill="url(#grad1)" stroke="#00ff88" stroke-width="1"/>
  <circle cx="20" cy="20" r="2" fill="#00d9ff" opacity="0.6"/>
  <circle cx="44" cy="44" r="2" fill="#00ff88" opacity="0.6"/>
  <circle cx="18" cy="46" r="1.5" fill="#00d9ff" opacity="0.4"/>
  </svg>
  `;
  const outputPath = path.join(__dirname, '../public/favicon.svg');
  fs.writeFileSync(outputPath, svg);
  console.log('✓ favicon.svg generated at', outputPath);
}


async function loadPortfolioData() {
  const dataPath = pathToFileURL(path.join(__dirname, '../src/data/portfolioData.js')).href;
  const module = await import(dataPath);
  return module.portfolioData;
}

function generateSitemap(site) {
  const domain = site.domain;
  const pages = site.seo?.pages || ['/'];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
      .map(
        (page) => `  <url>
    <loc>${domain}${page}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`
      )
      .join('\n')}
</urlset>
`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemap);
  console.log('✓ sitemap.xml generated at', outputPath);
}

function generateRobots(site) {
  const domain = site.domain;
  const robots = `# Allow all search engines to crawl your site
User-agent: *
Allow: /
Sitemap: ${domain}/sitemap.xml

# Google
User-agent: Googlebot
Allow: /

# Bing
User-agent: Bingbot
Allow: /

# Block AI crawlers
User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Disallow: /

User-agent: OpenAI-SearchBot
Allow: /

# Point to your sitemap
Sitemap: ${domain}/sitemap.xml
`;

  const outputPath = path.join(__dirname, '../public/robots.txt');
  fs.writeFileSync(outputPath, robots);
  console.log('✓ robots.txt generated at', outputPath);
}

function generateLlmsTxt(site, contact) {
  const domain = site.domain;
  const seo = site.seo || {};
  const topics = seo.topics || [];
  const technologyStack = seo.technologyStack || [];
  const llms = `# LLMs.txt - Information for AI Language Models
# LLMs.txt - Information for AI Language Models
# Specification: https://llmstxt.org

Site-Name: ${site.name}
Site-URL: ${domain}
Contact: ${contact.email}

Description:
${seo.description}

Topics:
${topics.map((topic) => `- ${topic}`).join('\n')}

Technology Stack:
${technologyStack.map((technology) => `- ${technology}`).join('\n')}

Allow-User-Agents: *
Disallow-User-Agents: CCBot, anthropic-ai, OpenAI-SearchBot

Sitemap: ${domain}/sitemap.xml
`;

  const outputPath = path.join(__dirname, '../public/llms.txt');
  fs.writeFileSync(outputPath, llms);
  console.log('✓ llms.txt generated at', outputPath);
}


async function main() {
  console.log('🔧 Generating site files...\n');

  try {
    const portfolioData = await loadPortfolioData();
    generateSitemap(portfolioData.site);
    generateRobots(portfolioData.site);
    generateLlmsTxt(portfolioData.site, portfolioData.contact);
    generateFavicon();
    console.log('\n✅ All site files generated successfully!');
  } catch (error) {
    console.error('❌ Error generating site files:', error.message);
    process.exit(1);
  }
}

main();

// Export functions for potential reuse
module.exports = { generateSitemap, generateRobots, generateLlmsTxt, generateFavicon };
