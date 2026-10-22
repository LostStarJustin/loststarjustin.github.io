#!/usr/bin/env bash
# 从 Echo 源码仓库同步页面源文件与部署包（真相源在 Echo 仓库，这里只是发布副本）。
# 用法：tools/sync.sh [Echo 仓库路径，默认 ../Echo]；之后 node tools/build.cjs 重新生成 HTML。
set -euo pipefail
cd "$(dirname "$0")/.."
ECHO="${1:-..}"   # 站点仓库现位于 Echo 仓库内（owner 2026-10-22），默认取上级目录即 Echo 仓库
strip_gov() { # 去掉标题后、第一条 --- 之前的治理性引用块（> 开头行）
  awk 'BEGIN{seen=0} /^---/{seen=1} { if(!seen && $0 ~ /^> /) next; print }' "$1"
}
strip_gov "$ECHO/platform/store/privacy-policy.md" > src/privacy.md
strip_gov "$ECHO/platform/store/support.md"        > src/support.md
cp "$ECHO/deploy/selfhost/README.md"                 src/selfhost.md
for f in docker-compose.yml .env.example livekit.yaml.example seed-users.example.yaml 99-echo-livekit.conf README.md; do
  cp "$ECHO/deploy/selfhost/$f" echo/selfhost/kit/
done
( cd echo/selfhost && rm -f echo-selfhost-kit.zip && zip -q -r echo-selfhost-kit.zip kit -x '*.DS_Store' )
echo "synced from $ECHO"
