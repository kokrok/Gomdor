# URL의 `#` — 프래그먼트(fragment)

`index_menu4_예제.html#science` 에서 `#science` 부분을 **프래그먼트(fragment)** 또는 **해시(hash)** 라고 부른다.
뜻은 "이 문서 안의 `science`라는 위치"다.

<div class="demo">
<p class="demo-title">🔬 실시간 관찰: 지금 이 페이지의 프래그먼트</p>
<div class="demo-output" id="hash-now"></div>
<p>아래 목차를 누르거나 뒤로 가기 버튼을 눌러 보면, 위 값과 주소창이 함께 바뀐다. 페이지는 새로 고쳐지지 않는다.</p>
</div>

**목차** (모두 `#` 링크)

1. [URL의 구조](#structure)
2. [브라우저는 어떻게 위치를 찾나](#find)
3. [프래그먼트만 바뀌면 일어나는 일](#no_reload)
4. [JavaScript에서 다루기](#js)
5. [CSS에서 다루기](#css)
6. [실무에서 쓰이는 곳](#usage)
7. [query(?)와 fragment(#) 비교](#query_vs_fragment)
8. [주의할 점](#caution)
9. [이 사이트에서 쓰는 곳](#this_site)

---

## 1. URL의 구조 {#structure}

```
https://gomdor.com:5501/museum/index.html?g=9.8&e=0.8#science
└─┬─┘   └────┬────┘└─┬─┘└────────┬───────┘└────┬────┘└───┬───┘
scheme      host    port        path          query    fragment
(프로토콜)  (서버)  (포트)    (파일 위치)    (조건/옵션)  (문서 안 위치)
```

| 부분 | 역할 | 서버로 전송되나? |
|---|---|---|
| path `/museum/index.html` | **어떤 문서**를 달라 | O |
| query `?g=9.8` | 그 문서를 **어떤 조건으로** 달라 | O |
| fragment `#science` | 받은 문서의 **어디를** 보여 줘라 | **X (브라우저만 씀)** |

> 가장 중요한 성질: **`#` 뒤는 서버로 가지 않는다.**
> 브라우저가 문서를 다 받은 뒤, 자기 혼자 그 위치로 스크롤한다.

### 비유
- **책**: path = "물리학 교과서", fragment = "3장 포물선 운동" 책갈피.
  서점(서버)은 책만 건네주고, 3장을 펴는 건 독자(브라우저)다.
- **Python**: `page = server.get("index.html")` 은 서버 요청이고,
  `page["science"]` 는 이미 받은 데이터 안에서 찾는 것이다.
- **C**: 파일을 통째로 읽어 온 다음, 그 안에서 특정 위치로 `fseek` 하는 것과 비슷하다.

---

## 2. 브라우저는 어떻게 위치를 찾나 {#find}

`#science` 를 받으면 브라우저는 문서에서 **`id="science"`인 요소**를 찾아 그 위치로 스크롤한다.

```html
<!-- 목적지: id를 붙여 둔다 -->
<h2 id="science">물리 · 수학</h2>

<!-- 출발지: 링크 -->
<a href="#science">물리 · 수학으로 이동</a>                 <!-- 같은 페이지 안 -->
<a href="index_menu4_예제.html#science">물리 · 수학</a>     <!-- 다른 페이지의 특정 위치 -->
```

- `id`는 **문서 안에서 하나뿐**이어야 한다. (같은 `id`가 둘이면 첫 번째로 간다.)
- 맞는 `id`가 없으면 그냥 페이지 맨 위가 보인다. 에러는 나지 않는다.
- `#` 만 있거나 `#top` 이면 페이지 맨 위로 간다.
- 옛날 방식으로 `<a name="science">` 도 동작하지만, 지금은 `id`를 쓴다.

<div class="demo">
<p class="demo-title">🔬 체험: 다른 페이지의 특정 위치로 가기</p>
<a href="index_menu4_예제.html#webdev">과학관의 "웹개발 공부" 구역으로 →</a> (돌아올 땐 뒤로 가기)
<br>
<a href="#no_such_id">없는 id(#no_such_id)로 가기</a> — 아무 일도 안 일어나고 에러도 없다
</div>

---

## 3. 프래그먼트만 바뀌면 일어나는 일 {#no_reload}

같은 페이지에서 `#` 뒤만 바뀌면:

1. 페이지를 **다시 불러오지 않는다.** (서버 요청 없음, 즉시 이동)
2. 브라우저 **방문 기록에 남는다.** → 뒤로 가기 버튼을 누르면 이전 위치로 돌아간다.
3. 주소창의 URL이 바뀐다. → 그 주소를 복사해서 보내면 **받은 사람도 같은 위치**를 본다.

<div class="demo">
<p class="demo-title">🔬 체험: 정말 새로 고쳐지지 않을까?</p>
이 페이지를 연 뒤 지난 시간: <span class="demo-output" id="uptime">0</span>초
<p>목차 링크를 아무리 눌러도 시간이 0으로 돌아가지 않는다. 새로 고침(F5)을 하면 0부터 다시 센다.</p>
</div>

---

## 4. JavaScript에서 다루기 {#js}

```js
location.hash;                   // "#science" (현재 프래그먼트, # 포함)
location.hash = "webdev";        // #webdev 로 이동 (방문 기록에 추가됨)

// 프래그먼트가 바뀔 때마다 실행
window.addEventListener("hashchange", () => {
    console.log("지금 위치:", location.hash);
});
```

- 한글 `id`는 URL에서 `%EB%AC%BC...` 처럼 인코딩된다.
  비교하기 전에 `decodeURIComponent(location.hash)` 로 되돌린다.

<div class="demo">
<p class="demo-title">🔬 체험: JS로 <code>location.hash</code> 바꾸기</p>
<button type="button" data-hash="structure">location.hash = "structure"</button>
<button type="button" data-hash="css">location.hash = "css"</button>
<button type="button" data-hash="">location.hash = ""</button>
<p>hashchange 이벤트 기록:</p>
<div class="demo-output" id="hash-log"></div>
</div>

---

## 5. CSS에서 다루기 {#css}

```css
/* 지금 프래그먼트가 가리키는 요소에만 적용 */
:target {
    background: #fff3b0;
}

/* 부드럽게 스크롤 */
html {
    scroll-behavior: smooth;
}

/* 위에 고정된 헤더가 있을 때, 목적지가 헤더에 가려지지 않게 여백 */
h2 {
    scroll-margin-top: 80px;
}
```

이 페이지에는 세 가지가 모두 적용돼 있다. 목차를 눌렀을 때 **제목이 노랗게 칠해지는 것**이 `:target`이다.

---

## 6. 실무에서 쓰이는 곳 {#usage}

| 용도 | 예 |
|---|---|
| 목차 / 같은 페이지 안 이동 | 위키백과 목차, 이 사이트의 과학관 하위 메뉴 |
| 특정 위치 공유 (딥 링크) | `README.md#실행-방법`, GitHub 코드의 `#L42` (42번째 줄) |
| 탭 / 상태 기억 | `settings.html#account` 로 "계정" 탭을 연 채로 시작 |
| 해시 라우팅 (옛날 SPA) | `app.html#/about`, `#/blog/3` — 서버 없이 한 페이지로 여러 화면 흉내. React Router의 `HashRouter`가 이 방식 |
| 텍스트 조각 (최신 브라우저) | `page.html#:~:text=포물선` — 해당 글자를 찾아 강조 |

<div class="demo">
<p class="demo-title">🔬 체험: 텍스트 조각</p>
<a href="#:~:text=fseek">#:~:text=fseek</a> — 1장 비유의 "fseek" 글자를 찾아 강조한다 (Chrome, Edge)
</div>

---

## 7. query(`?`)와 fragment(`#`) 비교 {#query_vs_fragment}

물리 예제에서 "조건을 URL로 공유"할 때 둘 다 쓸 수 있다.

| | `?g=9.8` (query) | `#g=9.8` (fragment) |
|---|---|---|
| 서버로 전송 | O | X |
| 값이 바뀌면 | 페이지를 **다시 불러옴** | 다시 불러오지 않음 |
| JS로 읽기 | `new URLSearchParams(location.search)` | `location.hash` |
| 적합한 용도 | 서버가 알아야 하는 조건 (검색어, 페이지 번호) | 브라우저 안에서만 쓰는 상태 (위치, 탭, 시뮬레이션 설정) |

이 사이트는 정적 사이트(서버가 파일만 건네줌)라 어느 쪽이든 된다.
값을 바꿀 때 페이지가 새로 고쳐지지 않길 원하면 `#`, 일반적인 관례를 따르려면 `?` 가 낫다.

---

## 8. 주의할 점 {#caution}

- **`id` 중복 금지.** 여러 HTML에 메뉴를 복사해 두던 것처럼, 같은 블록을 복사하다 보면 `id`가 겹치기 쉽다.
- **`id` 이름에 공백 금지.** 공백이 있으면 `#` 링크로 찾을 수 없다. 이 사이트 파일 이름 규칙처럼 영어 소문자와 `_`, `-`를 쓰면 안전하다.
- **서버에서 쓸 수 없다.** 서버 코드(Node.js, Express)는 `#` 뒤를 받지 못한다. 서버가 알아야 하는 값은 query나 path에 넣는다.

---

## 9. 이 사이트에서 쓰는 곳 {#this_site}

[`menu.js`](menu.js)의 과학관 하위 메뉴:

```js
{ label: "물리 · 수학", href: "index_menu4_예제.html#science" },
{ label: "컴퓨터공학",  href: "index_menu4_예제.html#cs" },
{ label: "웹개발 공부", href: "index_menu4_예제.html#webdev" },
```

과학관 페이지의 `<h2 id="science">`, `<h2 id="cs">`, `<h2 id="webdev">` 로 이동한다.

이 노트 자체도 `#`을 쓴다. `.md`에서 `## 5. CSS에서 다루기 {#css}`처럼 제목 뒤에 `{#css}`를 붙이면,
`build.js`가 변환할 때 `<h2 id="css">`로 만들어 준다. 그래서 위 목차의 `#css` 링크가 동작한다.
