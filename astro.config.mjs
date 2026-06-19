import { defineConfig } from 'astro/config';

// Static prototype site. Add integrations (e.g. @astrojs/vue) here later if a
// genuinely interactive island is needed — see .claude/astro-migration-plan.md.
export default defineConfig({
  site: 'https://zearn.github.io',
  base: '/ai-generate-teacher-materials-prototype-mvp',
});
