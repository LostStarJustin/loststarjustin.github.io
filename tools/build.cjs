// 把 src/*.md 渲染成 echo/<name>/index.html。依赖 markdown-it（npm i 或 NODE_PATH 指向已有 node_modules）。
const fs = require("fs"); const path = require("path");
const md = require("markdown-it")({ html: true, linkify: true, typographer: false });
const root = path.resolve(__dirname, "..");
const tpl = fs.readFileSync(path.join(root, "tools/page.html"), "utf8");
const pages = [
  { src: "privacy.md",  out: "echo/privacy/index.html",  title: "Privacy Policy · Echo",  depth: 2 },
  { src: "support.md",  out: "echo/support/index.html",  title: "Support · Echo",          depth: 2 },
  { src: "selfhost.md", out: "echo/selfhost/index.html", title: "Self-hosting · Echo",     depth: 2,
    prepend: `<div class="card" style="margin-bottom:22px"><h3>下载部署包 / Download the kit</h3>
<p>compose、配置模板、账号清单模板、内核参数文件与本指南 / compose file, config templates, account manifest template, sysctl file and this guide.</p>
<a class="btn" href="echo-selfhost-kit.zip">echo-selfhost-kit.zip</a>
<p class="note">单个文件 / individual files: <a href="kit/docker-compose.yml">docker-compose.yml</a> · <a href="kit/.env.example">.env.example</a> · <a href="kit/livekit.yaml.example">livekit.yaml.example</a> · <a href="kit/seed-users.example.yaml">seed-users.example.yaml</a> · <a href="kit/99-echo-livekit.conf">99-echo-livekit.conf</a> · <a href="kit/README.md">README.md</a><br>后端镜像 / backend image: <code>ghcr.io/loststarjustin/echo-backend:&lt;version&gt;</code></p></div>` },
];
for (const p of pages) {
  const body = md.render(fs.readFileSync(path.join(root, "src", p.src), "utf8"));
  const base = "../".repeat(p.depth);
  const html = tpl.replaceAll("{{title}}", p.title).replaceAll("{{base}}", base).replace("{{body}}", (p.prepend || "") + body);
  fs.mkdirSync(path.dirname(path.join(root, p.out)), { recursive: true });
  fs.writeFileSync(path.join(root, p.out), html);
  console.log("built", p.out);
}
