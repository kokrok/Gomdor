// 웹개발 노트 변환기: webdev-*.md → webdev-*.html
// 실행: npm run build   (한 번 전체 변환)
//       npm run watch   (감시 모드: 파일을 저장할 때마다 자동 변환, 끄려면 Ctrl + C)
//
// .md가 원본이고 .html은 결과물이다. .html을 직접 고치지 말고 .md를 고친 뒤 다시 변환한다.
const fs = require("fs");
const { marked } = require("marked");

const TEMPLATE_FILE = "note-template.html";
const GENERATED_MARK = "<!-- 자동 생성 파일";  // note-template.html 맨 위의 주석

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

// 파일을 읽으면서 줄바꿈을 LF(\n)로 통일한다.
// Windows에서 Git은 파일을 CRLF(\r\n)로 내려받지만 marked는 LF로 결과를 만든다.
// 통일하지 않으면 결과에 CRLF와 LF가 섞이고, 내용이 같아도 "바뀌었다"고 판단하게 된다.
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");

const isNote = f => f.startsWith("webdev-") && f.endsWith(".md");
const noteOfDemo = f => f.replace(/\.demo\.js$/, ".md");   // webdev-xxx.demo.js → webdev-xxx.md

// 노트 하나를 변환한다
function buildOne(mdFile) {
    const htmlFile = mdFile.replace(/\.md$/, ".html");

    // 안전장치: 손으로 쓴 .html(자동 생성 표시가 없는 파일)은 덮어쓰지 않는다
    if (fs.existsSync(htmlFile) && !read(htmlFile).includes(GENERATED_MARK)) {
        console.log(`건너뜀  ${mdFile}  (${htmlFile}은 손으로 쓴 파일)`);
        return;
    }

    // 틀은 매번 새로 읽는다 (감시 모드에서 틀을 고쳐도 바로 반영되도록)
    const template = read(TEMPLATE_FILE);
    const md = read(mdFile);
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

    // 결과가 같으면 쓰지 않는다 (Live Server가 쓸데없이 새로 고치지 않도록)
    // 기존 파일도 read()로 읽으므로 줄바꿈 차이(CRLF/LF)는 "같다"로 본다
    if (fs.existsSync(htmlFile) && read(htmlFile) === html) {
        console.log(`그대로  ${mdFile}  (바뀐 내용 없음)`);
        return;
    }
    fs.writeFileSync(htmlFile, html);
    console.log(`변환    ${mdFile} → ${htmlFile}`);
}

// 모든 노트를 변환한다
function buildAll() {
    for (const f of fs.readdirSync(".").filter(isNote)) buildOne(f);
}

// 감시 모드: 폴더 안의 파일이 저장될 때마다 필요한 노트만 다시 변환한다
function watch() {
    const timers = new Map();  // 파일 이름 → 대기 중인 타이머

    // Windows에서는 저장 한 번에 알림이 2~3번 온다.
    // 0.2초 안에 같은 파일의 알림이 또 오면 앞의 것을 취소하고 마지막 한 번만 실행한다 (디바운스)
    function later(key, job) {
        clearTimeout(timers.get(key));
        timers.set(key, setTimeout(() => {
            timers.delete(key);
            try {
                job();
            } catch (e) {
                // 저장 도중 읽거나, .md를 지운 경우 등. 감시 모드는 멈추지 않고 계속 돈다
                console.log(`오류    ${key}: ${e.message}`);
            }
        }, 200));
    }

    fs.watch(".", (event, filename) => {
        if (!filename) return;

        if (isNote(filename)) {
            // 노트를 고쳤거나 새로 만듦 → 그 노트만 (지운 경우엔 .html을 남겨 둔다)
            later(filename, () => { if (fs.existsSync(filename)) buildOne(filename); });
        } else if (filename === TEMPLATE_FILE) {
            // 공통 틀을 고침 → 모든 노트
            later(filename, () => { console.log(`틀 변경 → 모든 노트를 다시 변환`); buildAll(); });
        } else if (filename.startsWith("webdev-") && filename.endsWith(".demo.js")) {
            // 체험 JS가 생기거나 없어짐 → <script> 연결을 다시 정하려고 그 노트만
            // (기존 .demo.js 내용만 고친 경우에도 돌지만, 결과가 같으면 "그대로"로 끝난다)
            const mdFile = noteOfDemo(filename);
            later(filename, () => { if (fs.existsSync(mdFile)) buildOne(mdFile); });
        }
    });

    console.log("감시 중… webdev-*.md, note-template.html, webdev-*.demo.js 를 저장하면 자동 변환 (끄려면 Ctrl + C)");
}

buildAll();
if (process.argv.includes("--watch")) watch();
