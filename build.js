// 웹개발 노트 변환기: webdev-*.md → webdev-*.html
// 실행: npm run build  (또는 node build.js)
//
// .md가 원본이고 .html은 결과물이다. .html을 직접 고치지 말고 .md를 고친 뒤 다시 변환한다.
const fs = require("fs");
const { marked } = require("marked");

const TEMPLATE_FILE = "note-template.html";
const GENERATED_MARK = "<!-- 자동 생성 파일";  // note-template.html 맨 위의 주석

const template = fs.readFileSync(TEMPLATE_FILE, "utf8");

// ## 제목마다 id를 붙여서 #s3 같은 링크로 바로 갈 수 있게 한다
//   ## 제목 {#css}  → id="css"   (직접 정한 id)
//   ## 제목         → id="s3"    (순서대로 자동 번호)
let sectionCount = 0;
marked.use({
    renderer: {
        heading(text, level) {
            const custom = text.match(/^(.*?)\s*\{#([\w-]+)\}$/);
            if (custom) return `<h${level} id="${custom[2]}">${custom[1]}</h${level}>\n`;
            if (level === 2) return `<h2 id="s${++sectionCount}">${text}</h2>\n`;
            return `<h${level}>${text}</h${level}>\n`;
        },
    },
});

const mdFiles = fs.readdirSync(".").filter(f => f.startsWith("webdev-") && f.endsWith(".md"));

for (const mdFile of mdFiles) {
    const htmlFile = mdFile.replace(/\.md$/, ".html");

    // 안전장치: 손으로 쓴 .html(자동 생성 표시가 없는 파일)은 덮어쓰지 않는다
    if (fs.existsSync(htmlFile) && !fs.readFileSync(htmlFile, "utf8").includes(GENERATED_MARK)) {
        console.log(`건너뜀  ${mdFile}  (${htmlFile}은 손으로 쓴 파일)`);
        continue;
    }

    const md = fs.readFileSync(mdFile, "utf8");
    const title = (md.match(/^# (.+)$/m)?.[1] ?? mdFile).replace(/`/g, "");  // 첫 번째 # 제목

    sectionCount = 0;
    const content = marked.parse(md);

    // 체험 코너 JS: webdev-xxx.demo.js 가 있으면 그 노트 페이지에만 연결한다
    const demoFile = mdFile.replace(/\.md$/, ".demo.js");
    const scripts = fs.existsSync(demoFile) ? `<script src="${demoFile}" defer></script>` : "";

    // replace에 함수를 넘기면 본문 안의 $ 기호가 특수문자로 해석되지 않는다
    const html = template
        .replace("{{title}}", () => title)
        .replace("{{scripts}}", () => scripts)
        .replace("{{content}}", () => content);

    fs.writeFileSync(htmlFile, html);
    console.log(`변환    ${mdFile} → ${htmlFile}`);
}
