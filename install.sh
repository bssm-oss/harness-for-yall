#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

dirs=(agents skills harnesses)

for dir in "${dirs[@]}"; do
  target="$CLAUDE_DIR/$dir"

  if [ -L "$target" ]; then
    echo "removing existing symlink: $target"
    rm "$target"
  elif [ -d "$target" ]; then
    echo "backing up existing directory: $target -> ${target}.bak"
    mv "$target" "${target}.bak"
  fi

  ln -s "$REPO_DIR/$dir" "$target"
  echo "linked: $target -> $REPO_DIR/$dir"
done

echo ""
echo "installed. add harness routing to ~/.claude/CLAUDE.md if not already present."
