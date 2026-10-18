# Markdown(.md)을 HTML로 자동 변환하기

> 지금 이 사이트의 웹개발 노트는 **같은 내용이 `.md`와 `.html` 두 군데**에 있다.
> 한쪽을 고치면 다른 쪽도 손으로 고쳐야 한다. 이 문제를 **자동 변환**으로 해결하는 방법을 정리한다.

---

## 1. 문제: 같은 내용을 두 번 관리

```
webdev-url_fragment.md     ← 내가 쓰는 원본
webdev-url_fragment.html   ← 웹사이트용 (손으로 옮겨 적음)
```

- 오타 하나를 고쳐도 두 파일을 다 고쳐야 한다.
- 언젠가 둘의 내용이 **어긋난다.** (메뉴를 15개 HTML에 복사해 두던 것과 똑같은 문제)
- HTML은 `<`를 `&lt;`로 써야 하는 등 **손으로 쓰기 번거롭다.**

### 해결 원칙: 원본은 하나, 나머지는 생성
**`.md`만 내가 쓰고, `.html`은 프로그램이 만든다.**

---

## 2. Markdown이란

**사람이 읽기 쉬운 문법**으로 쓰는 문서 형식이다. 기호 몇 개로 제목, 목록, 표, 코드를 표현한다.

| Markdown | 변환된 HTML | 화면 |
|---|---|---|
| `# 제목` | `<h1>제목</h1>` | 큰 제목 |
| `**굵게**` | `<b>굵게</b>` | **굵게** |
| `- 항목` | `<ul><li>항목</li></ul>` | • 항목 |
| `` `code` `` | `<code>code</code>` | `code` |
| `[링크](a.html)` | `<a href="a.html">링크</a>` | 링크 |

GitHub, 노션, 블로그, README가 모두 Markdown을 쓴다.

---

## 3. 변환의 원리 — 컴파일과 같다

```
  [원본]                 [변환 프로그램]              [결과물]
  .md 파일   ──────▶   ① Markdown 해석      ──────▶  .html 파일
  (내가 씀)            ② 공통 틀에 끼워 넣기          (브라우저가 읽음)
                       ③ 파일로 저장
```

### 비유
- **C 컴파일**: `.c`(사람이 쓰는 원본) → 컴파일러 → 실행 파일(기계가 쓰는 결과물).
  실행 파일을 직접 고치지 않듯이, **`.html`도 직접 고치지 않는다.** 원본 `.md`를 고치고 다시 변환한다.
- **Python**: `pip install markdown` 후 `markdown.markdown(text)` 한 줄이면 변환된다. JS에서도 같은 역할의 라이브러리(`marked`)가 있다.

### ② 공통 틀(템플릿)이 필요한 이유
Markdown 변환기는 **본문만** 만든다. 헤더, 메뉴, 푸터, CSS 연결은 없다.
그래서 모든 페이지가 공유하는 **틀(템플릿)** 에 본문을 끼워 넣는다.

```html
<!-- template.html -->
<html>
<head>
    <title>곰도르 - {{title}}</title>
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="webdev-note.css" />
    <script src="menu.js" defer></script>
</head>
<body>
    <header>...</header>
    <main>
        <nav id="site-menu"></nav>
        <section><article>
            {{content}}          ← 여기에 변환된 본문이 들어간다
        </article></section>
    </main>
    <footer>...</footer>
</body>
</html>
```

C의 `printf("곰도르 - %s", title)`처럼, 틀의 빈칸(`{{title}}`, `{{content}}`)을 채우는 것이다.

---

## 4. 방법 비교

| 방법 | 원리 | 장점 | 단점 |
|---|---|---|---|
| **A. Node.js 변환 스크립트 직접 짜기** | `build.js`가 `.md`를 읽어 `.html`을 쓴다 | 원리를 완전히 이해한다. 코드 30줄 정도. 결과물이 순수 HTML | 변환을 실행하는 단계(`node build.js`)가 생긴다 |
| B. 브라우저에서 변환 | 페이지가 열릴 때 JS가 `.md`를 `fetch`해서 그 자리에서 변환 | 빌드 단계가 없다 | JS가 꺼지면 안 보인다. 검색엔진에 불리. 열 때마다 변환 |
| C. 정적 사이트 생성기 | Eleventy, Astro, Hugo 같은 도구 | 목록 페이지, 날짜, 태그까지 자동. 실무에서 많이 씀 | 도구마다 규칙을 새로 배워야 한다 |
| D. GitHub Pages (Jekyll) | GitHub에 `.md`를 올리면 GitHub이 자동 변환해 웹사이트로 공개 | 설정이 거의 없다 | 변환 과정이 안 보여서 배우는 게 적다. 커스터마이즈가 까다롭다 |

**이 사이트에 추천: A → (나중에) C**
1. 먼저 **A**로 직접 짜 본다. Node.js 공부(파일 읽기·쓰기, npm 패키지)도 같이 된다.
2. 글방 글이 많아져 목록·날짜·태그가 필요해지면 **C**(Eleventy 추천, 개념이 A와 거의 같음)로 옮긴다.
   이미 A를 짜 봤다면 "이 도구가 내가 짠 걸 대신 해 주는구나" 하고 바로 이해된다.

---

## 5. 방법 A 미리 보기 — `build.js`

```js
// build.js — 실행: node build.js
const fs = require("fs");                 // 파일 읽기/쓰기 (Python의 open)
const { marked } = require("marked");     // Markdown → HTML 변환 라이브러리

const template = fs.readFileSync("template.html", "utf8");

// webdev-로 시작하는 .md 파일을 모두 찾는다
const mdFiles = fs.readdirSync(".").filter(f => f.startsWith("webdev-") && f.endsWith(".md"));

for (const mdFile of mdFiles) {
    const md = fs.readFileSync(mdFile, "utf8");
    const title = md.match(/^# (.+)$/m)?.[1] ?? mdFile;    // 첫 번째 # 제목을 페이지 제목으로
    const content = marked.parse(md);                      // ① Markdown 해석

    const html = template                                  // ② 틀에 끼워 넣기
        .replace("{{title}}", title)
        .replace("{{content}}", content);

    const htmlFile = mdFile.replace(/\.md$/, ".html");
    fs.writeFileSync(htmlFile, html);                      // ③ 파일로 저장
    console.log(`${mdFile} → ${htmlFile}`);
}
```

준비:
```bash
npm init -y          # package.json 만들기 (Python의 requirements.txt 같은 것)
npm install marked   # 변환 라이브러리 설치 (pip install 과 같음)
node build.js        # 변환 실행
```

> 이 PC에는 Node.js v18이 이미 설치되어 있어 바로 해 볼 수 있다.

---

## 6. 체험 코너(🔬)는 어떻게 하나

웹페이지 버전에는 직접 눌러 보는 **체험 코너**가 있다. 이건 Markdown 문법으로 표현할 수 없다.

- **Markdown 안에 HTML을 그대로 쓸 수 있다.** 변환기는 HTML 태그를 건드리지 않고 그대로 통과시킨다.
  ```markdown
  ## 4. JavaScript에서 다루기
  설명...

  <div class="demo">
      <button data-hash="css">location.hash = "css"</button>
  </div>
  ```
- 체험 코너의 JS는 별도 파일(`webdev-url_fragment.demo.js`)로 빼고, 템플릿에서 같은 이름의 JS가 있으면 연결하게 한다.
- GitHub에서 `.md`를 열면 HTML 부분은 일부만 보이지만, **웹사이트에서는 완전하게 동작한다.**

---

## 7. 주의할 점

- **생성된 `.html`은 손으로 고치지 않는다.** 다음 변환 때 덮어써져서 고친 내용이 사라진다. 파일 맨 위에 `<!-- 자동 생성 파일: .md를 고치세요 -->` 주석을 넣어 두면 좋다.
- **변환을 잊지 않는다.** `.md`를 고친 뒤 `node build.js`를 안 돌리면 웹사이트에는 반영되지 않는다.
  → 익숙해지면 파일이 바뀔 때마다 자동으로 변환(`--watch`)하거나, push할 때 GitHub Actions가 변환하게 할 수 있다.
- **`node_modules/` 폴더는 Git에 올리지 않는다.** `npm install`로 언제든 다시 만들 수 있는 폴더라 `.gitignore`에 넣는다. (Python의 `venv/`와 같다)
- **"빌드 도구 없는 정적 사이트"라는 지금 규칙이 바뀐다.** 도입하면 `README.md`와 `CLAUDE.md`의 규칙도 함께 고친다.

---

## 8. 이 사이트의 현재 상태

- **5장의 방법 A를 도입했다.** 프로젝트에 `build.js`, `note-template.html`, `package.json`이 있고, `npm run build`로 변환한다.
- 이 문서와 "Git 기초" 노트의 웹페이지는 이렇게 자동 생성된다.
- 먼저 만든 노트 2개(`#` 프래그먼트, innerHTML vs createElement)는 체험 코너 때문에 `.html`을 손으로 작성했다.
  `build.js`는 맨 위에 `<!-- 자동 생성 파일` 주석이 없는 `.html`을 **덮어쓰지 않고 건너뛴다.** (손으로 쓴 내용을 지키는 안전장치)
- 다음 단계: 이 두 노트도 6장의 방법으로 `.md`가 원본이 되도록 옮긴다.

### 실제로 해 보기
```bash
npm install        # 처음 한 번
npm run build      # 실행 결과 예:
# 변환    webdev-git_basics.md → webdev-git_basics.html
# 건너뜀  webdev-url_fragment.md  (webdev-url_fragment.html은 손으로 쓴 파일)
```

`package.json`의 `"scripts": { "build": "node build.js" }`가 `npm run build`를 `node build.js`로 연결해 준다.
Python 프로젝트의 `Makefile`이나 `python -m build`처럼, 자주 쓰는 명령에 짧은 이름을 붙여 두는 관례다.
