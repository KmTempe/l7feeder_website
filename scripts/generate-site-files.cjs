const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://l7feeders.dev';
const CONTACT_EMAIL = 'kosmas.Temperekidis@live.com';
const siteName = 'Kosmas Temperekidis Portfolio';
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


const pages = [
  '/',
  // Add more routes as needed
];

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${DOMAIN}${page}</loc>
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

function generateRobots() {
  const robots = `# Allow all search engines to crawl your site
User-agent: *
Allow: /
Sitemap: https://l7feeders.dev/sitemap.xml

# Google
User-agent: Googlebot
Allow: /

# Bing
User-agent: Bingbot
Allow: /

# Block AI crawlers
User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: OpenAI-SearchBot
Disallow: /

# Point to your sitemap
Sitemap: ${DOMAIN}/sitemap.xml
`;

  const outputPath = path.join(__dirname, '../public/robots.txt');
  fs.writeFileSync(outputPath, robots);
  console.log('✓ robots.txt generated at', outputPath);
}

function generateLlmsTxt() {
  const llms = `# LLMs.txt - Information for AI Language Models
# LLMs.txt - Information for AI Language Models
# Specification: https://llmstxt.org

Site-Name: ${siteName}
Site-URL: ${DOMAIN}
Contact: ${CONTACT_EMAIL}

Description:
This is a website showcasing my experience. The site includes project demonstrations, 
and contact information for collaboration inquiries.

Topics:
- DevOps
- Backend Development
- API Development
- Cloud Infrastructure
- Self-hosted Services
- System Architecture

Technology Stack:
- Frontend: React, Vite, Material Design
- Backend: Node.js
- Deployment: Vercel
- Infrastructure: Docker, Nginx

Allow-User-Agents: *
Disallow-User-Agents: CCBot, anthropic-ai, OpenAI-SearchBot

Sitemap: ${DOMAIN}/sitemap.xml
`;

  const outputPath = path.join(__dirname, '../public/llms.txt');
  fs.writeFileSync(outputPath, llms);
  console.log('✓ llms.txt generated at', outputPath);
}


function main() {
  console.log('🔧 Generating site files...\n');
  
  try {
    generateSitemap();
    generateRobots();
    generateLlmsTxt();
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
