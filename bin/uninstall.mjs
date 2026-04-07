#!/usr/bin/env node

import { existsSync, unlinkSync, readdirSync, rmdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGINS_DIR = join(__dirname, '..', 'plugins');
const CLAUDE_HOME = join(homedir(), '.claude');

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const flags = ['--dry-run'];
  const requestedPlugins = args.filter((a) => !flags.includes(a));

  const allPlugins = readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const plugins = requestedPlugins.length > 0
    ? requestedPlugins.filter((p) => allPlugins.includes(p))
    : allPlugins;

  console.log('\n  harness-for-yall uninstaller\n');
  console.log(`  Target: ${CLAUDE_HOME}`);
  console.log(`  Plugins: ${plugins.join(', ')}\n`);

  let removed = 0;

  for (const plugin of plugins) {
    const pluginDir = join(PLUGINS_DIR, plugin);

    // agents
    const agentsDir = join(pluginDir, 'agents');
    if (existsSync(agentsDir)) {
      for (const f of readdirSync(agentsDir)) {
        const dest = join(CLAUDE_HOME, 'agents', f);
        if (existsSync(dest)) {
          if (!dryRun) unlinkSync(dest);
          console.log(`  ${dryRun ? '[dry-run] ' : ''}remove: agents/${f}`);
          removed++;
        }
      }
    }

    // skills
    const skillsDir = join(pluginDir, 'skills');
    if (existsSync(skillsDir)) {
      for (const d of readdirSync(skillsDir, { withFileTypes: true })) {
        if (!d.isDirectory()) continue;
        const dest = join(CLAUDE_HOME, 'skills', `${d.name}.md`);
        if (existsSync(dest)) {
          if (!dryRun) unlinkSync(dest);
          console.log(`  ${dryRun ? '[dry-run] ' : ''}remove: skills/${d.name}.md`);
          removed++;
        }
      }
    }

    // harness docs
    const rootMds = readdirSync(pluginDir).filter(
      (f) => f.endsWith('.md') && statSync(join(pluginDir, f)).isFile()
    );
    for (const md of rootMds) {
      const dest = join(CLAUDE_HOME, 'harnesses', md);
      if (existsSync(dest)) {
        if (!dryRun) unlinkSync(dest);
        console.log(`  ${dryRun ? '[dry-run] ' : ''}remove: harnesses/${md}`);
        removed++;
      }
    }
  }

  console.log(`\n  Done! ${dryRun ? 'Would remove' : 'Removed'}: ${removed}\n`);
}

main();
