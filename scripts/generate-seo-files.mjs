import { mkdir, readFile, writeFile } from "node:fs/promises";

const source = await readFile(new URL("../shared/seo.ts", import.meta.url), "utf8");
const slugs = [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const blogBlock = source.match(/BLOG_SLUGS = \[([\s\S]*?)\]/)?.[1] || "";
const blogSlugs = [...blogBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
const priorities = Object.fromEntries(
  [...source.matchAll(/slug:\s*"([^"]+)"[\s\S]*?priority:\s*([0-9.]+)/g)].map((match) => [match[1], match[2]]),
);
const today = new Date().toISOString().slice(0, 10);
const baseUrl = "https://bmo-toools-three.vercel.app";
const entries = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  ...blogSlugs.map((slug) => ({ path: `/blog/${slug}`, priority: "0.7", changefreq: "monthly" })),
  ...slugs.map((slug) => ({ path: `/tools/${slug}`, priority: priorities[slug] || "0.8", changefreq: "monthly" })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(({ path, priority, changefreq }) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${baseUrl}/sitemap.xml
`;
await mkdir(new URL("../public/", import.meta.url), { recursive: true });
await writeFile(new URL("../public/sitemap.xml", import.meta.url), sitemap);
await writeFile(new URL("../public/robots.txt", import.meta.url), robots);
console.log(`Generated SEO files for ${entries.length} URLs.`);
