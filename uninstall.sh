#!/usr/bin/env bash
set -euo pipefail

CLAUDE_DIR="$HOME/.claude"

dirs=(agents skills harnesses)

for dir in "${dirs[@]}"; do
  target="$CLAUDE_DIR/$dir"

  if [ -L "$target" ]; then
    rm "$target"
    echo "removed symlink: $target"

    if [ -d "${target}.bak" ]; then
      mv "${target}.bak" "$target"
      echo "restored backup: ${target}.bak -> $target"
    fi
  else
    echo "skipped (not a symlink): $target"
  fi
done

echo ""
echo "uninstalled."
