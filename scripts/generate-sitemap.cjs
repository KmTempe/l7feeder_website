const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://l7feeders.dev'; // <-- Replace with your actual domain
const pages = [
  '/',
  // Add more routes as needed
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>\n    <loc>${DOMAIN}${page}</loc>\n    <priority>1</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`;

const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap);
console.log('sitemap.xml generated at', outputPath);