// scripts/generate-site-files.cjs
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://l7feeders.dev';
const CONTACT_EMAIL = 'kosmas.Temperekidis@live.com';
const siteName = 'Kosmas Temperekidis Portfolio';

// List of all pages in your site
const pages = [
  '/',
  // Add more routes as needed
];

/**
 * Generate sitemap.xml
 */
function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${DOMAIN}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  const outputPath = path.join(__dirname, '../dist/sitemap.xml');
  fs.writeFileSync(outputPath, sitemap);
  console.log('✓ sitemap.xml generated at', outputPath);
}

/**
 * Generate robots.txt
 */
function generateRobots() {
  const robots = `# Allow all search engines to crawl your site
User-agent: *
Allow: /

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

  const outputPath = path.join(__dirname, '../dist/robots.txt');
  fs.writeFileSync(outputPath, robots);
  console.log('✓ robots.txt generated at', outputPath);
}

/**
 * Generate llms.txt - helps AI crawlers understand your site
 */
function generateLlmsTxt() {
  const llms = `# LLMs.txt - Information for AI Language Models
# LLMs.txt - Information for AI Language Models
# Specification: https://llmstxt.org

Site-Name: ${siteName}
Site-URL: ${DOMAIN}
Contact: ${CONTACT_EMAIL}

Description:
This is a website showcasing my experiance. The site includes project demonstrations, 
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

  const outputPath = path.join(__dirname, '../dist/llms.txt');
  fs.writeFileSync(outputPath, llms);
  console.log('✓ llms.txt generated at', outputPath);
}


function main() {
  console.log('🔧 Generating site files...\n');
  
  try {
    generateSitemap();
    generateRobots();
    generateLlmsTxt();
    console.log('\n✅ All site files generated successfully!');
  } catch (error) {
    console.error('❌ Error generating site files:', error.message);
    process.exit(1);
  }
}

main();

// Export functions for potential reuse
module.exports = { generateSitemap, generateRobots, generateLlmsTxt };
