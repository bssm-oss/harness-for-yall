# claude-harness

Claude Code multi-agent harness setup.

## Teams

| Team | Pattern | Agents | Purpose |
|------|---------|--------|---------|
| dev-* | Pipeline | 5 | planner -> FE+BE parallel -> reviewer -> QA |
| review-* | Fan-out/Fan-in | 5 | 3 screeners -> moderator -> judge (SARIF) |
| fe-* | Expert Pool + Producer-Reviewer | 5 | architect routes to implementer/styler/perf/tester |
| be-* | Pipeline + Expert Pool | 6 | architect -> impl+validator -> resilience/provider -> tester |
| explore-* | Hierarchical Delegation | 4 | scout(opus) -> hypothesizer -> evidence -> synthesizer |

## Install

```bash
chmod +x install.sh && ./install.sh
```

Symlinks `agents/`, `skills/`, `harnesses/` to `~/.claude/`.

Add the routing section to `~/.claude/CLAUDE.md` manually.

## Uninstall

```bash
./uninstall.sh
```

Removes symlinks and restores backups if they exist.

## Structure

```
agents/        # 25 agent definitions (.md with frontmatter)
skills/        # 15 skill definitions (.md)
harnesses/     # 2 harness docs (be.md, explore.md)
install.sh     # Symlink installer
uninstall.sh   # Cleanup
```

## Model Strategy

- `explore-scout`: opus (orchestration quality)
- Everything else: sonnet (cost efficiency)
