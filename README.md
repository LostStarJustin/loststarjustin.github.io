# loststarjustin.github.io

个人项目站点（GitHub Pages）。`echo/` 是 Echo 的下载页、自托管指南、技术支持与隐私政策；Echo 的安装包发布在本仓库的 Releases（tag `echo-vX.Y.Z`）。

- 页面源文件的真相源在 Echo 源码仓库（`platform/store/`、`deploy/selfhost/`），本仓库只放发布副本：`tools/sync.sh`（默认上级目录即 Echo 仓库）拉取，`node tools/build.cjs` 生成 HTML（需要 `markdown-it`：`npm i` 或 `NODE_PATH` 指向已有 node_modules）。
- `echo/index.html` 下载页手写维护；发版时改版本号、链接与 SHA-256。
- `.nojekyll`：关闭 Jekyll，让 `.env.example` 等点文件可被直接下载。
