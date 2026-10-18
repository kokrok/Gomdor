# `innerHTML` vs `createElement`

화면에 HTML 요소를 JavaScript로 추가하는 대표적인 두 가지 방법이다.
결과는 같아 보여도 **동작 원리**가 다르고, 그 차이에서 **보안·성능·버그** 차이가 생긴다.

**목차** (🔬 = 직접 해 보는 체험 코너)

1. [한 줄 요약](#summary)
2. [비유로 이해하기](#analogy)
3. [핵심 차이 ① 보안 (XSS)](#xss) 🔬
4. [핵심 차이 ② += 함정](#plus_equal) 🔬
5. [핵심 차이 ③ 성능](#performance)
6. [가독성](#readability)
7. [중간 선택지들](#alternatives)
8. [React와의 관계](#react)
9. [언제 무엇을 쓰나](#when)
10. [이 사이트에서 쓰는 곳](#this_site)

---

## 1. 한 줄 요약 {#summary}

| | `innerHTML` | `createElement` |
|---|---|---|
| 방식 | HTML **문자열**을 주면 브라우저가 **해석(파싱)** 해서 요소로 만든다 | 요소 **객체**를 직접 하나씩 만들어 붙인다 |
| 비유 | 소스 코드 문자열을 `eval()` | 객체를 생성자로 직접 생성 |

```js
// innerHTML: 문자열 → 브라우저가 해석
nav.innerHTML = '<ul><li><a href="index.html">홈</a></li></ul>';

// createElement: 객체를 직접 조립
const ul = document.createElement("ul");
const li = document.createElement("li");
const a  = document.createElement("a");
a.href = "index.html";
a.textContent = "홈";
li.append(a);
ul.append(li);
nav.append(ul);
```

---

## 2. 비유로 이해하기 {#analogy}

### Python
```python
# innerHTML 방식 — 문자열을 코드로 해석
eval("Shell(radius=10)")

# createElement 방식 — 객체를 직접 생성
Shell(radius=10)
```
`eval`은 짧고 편하지만, 문자열에 **외부 입력이 섞이면** 의도하지 않은 코드가 실행될 수 있다.

### SQL (가장 정확한 비유)
```python
# 위험: 문자열 이어 붙이기 → SQL 인젝션
cursor.execute("SELECT * FROM user WHERE name = '" + name + "'")

# 안전: 값은 값으로만 전달
cursor.execute("SELECT * FROM user WHERE name = ?", (name,))
```
`innerHTML`에 사용자 입력을 이어 붙이는 것은 SQL 문자열을 이어 붙이는 것과 **같은 종류의 실수**다.
웹에서는 이것을 **XSS (Cross-Site Scripting)** 라고 부른다.

---

## 3. 핵심 차이 ① — 보안 (XSS) {#xss}

사용자가 이름 칸에 이런 걸 입력했다고 하자.

```
<img src=x onerror="alert('해킹!')">
```

```js
// 위험: 입력이 HTML로 해석된다 → 존재하지 않는 이미지 → onerror 실행
box.innerHTML = "안녕하세요, " + name + "님";

// 안전: 입력은 그냥 글자로 들어간다 → 화면에 <img ...> 글자가 그대로 보임
box.textContent = "안녕하세요, " + name + "님";

// 안전: createElement + textContent
const p = document.createElement("p");
p.textContent = "안녕하세요, " + name + "님";
box.append(p);
```

<div class="demo">
<p class="demo-title">🔬 체험: 같은 입력을 두 방식으로 넣어 보기</p>
<p>이름: <input type="text" id="xss-input" value="곰도르"></p>
<button type="button" data-sample="곰도르">평범한 이름</button>
<button type="button" data-sample="&lt;b&gt;굵은&lt;/b&gt; 곰도르">HTML 태그</button>
<button type="button" data-sample="&lt;img src=x onerror=&quot;this.parentNode.insertAdjacentText('beforeend', ' ⚠ 입력한 코드가 실행됨!')&quot;&gt;">공격 코드 (안전한 버전)</button>
<div class="compare">
<div>
<p><code>innerHTML</code> 결과</p>
<div class="demo-output" id="xss-inner"></div>
</div>
<div>
<p><code>createElement</code> + <code>textContent</code> 결과</p>
<div class="demo-output" id="xss-safe"></div>
</div>
</div>
<p>"공격 코드"를 누르면 왼쪽에만 <span class="warn">⚠ 입력한 코드가 실행됨!</span>이 나타난다. 진짜 공격이라면 이 자리에서 쿠키를 훔치거나 가짜 로그인 창을 띄운다.</p>
</div>

- `innerHTML`로 넣은 `<script>` 태그는 실행되지 않는다. 하지만 `onerror`, `onclick` 같은 **속성은 실행된다.** 그래서 "script만 막으면 된다"는 생각은 틀렸다.
- 원칙: **사용자 입력, URL 값, 서버에서 받은 글**은 `textContent`로 넣는다.

---

## 4. 핵심 차이 ② — `+=` 함정 (이벤트와 상태가 사라짐) {#plus_equal}

```js
list.innerHTML += "<li>새 항목</li>";
```

이 한 줄은 "끝에 하나 추가"처럼 보이지만 실제로는:

1. 기존 내용을 **문자열로 꺼내고** (`list.innerHTML`)
2. 문자열 끝에 `<li>새 항목</li>`를 붙이고
3. 기존 요소를 **모두 지운 뒤** 문자열 전체를 **다시 해석**해서 새로 만든다.

그 결과:
- 기존 요소에 붙여 둔 **`addEventListener`가 사라진다.** (새로 만들어진 요소는 남남이다)
- 입력칸에 쓰던 글자, 체크박스 상태, 포커스가 **초기화**된다.
- 항목이 많을수록 매번 전체를 다시 만들어 **느려진다.** (n개 추가 = O(n²))

```js
// 기존 요소는 그대로 두고 끝에만 추가
const li = document.createElement("li");
li.textContent = "새 항목";
list.append(li);
```

<div class="demo">
<p class="demo-title">🔬 체험: 버튼이 고장 나는 순간</p>
<p>아래 목록에는 클릭하면 숫자가 올라가는 버튼과 입력칸이 들어 있다. 버튼을 몇 번 누르고 입력칸에 글자를 쓴 다음, 항목을 추가해 보자.</p>
<div class="compare">
<div>
<button type="button" id="add-inner">innerHTML += 로 추가</button>
<ul class="demo-output" id="list-inner"></ul>
</div>
<div>
<button type="button" id="add-safe">createElement + append 로 추가</button>
<ul class="demo-output" id="list-safe"></ul>
</div>
</div>
<p>왼쪽은 추가하는 순간 입력칸 글자가 사라지고 버튼을 눌러도 숫자가 오르지 않는다. 오른쪽은 그대로다.</p>
<button type="button" id="reset-lists">처음 상태로</button>
</div>

---

## 5. 핵심 차이 ③ — 성능 {#performance}

| 상황 | 더 빠른 쪽 |
|---|---|
| 큰 HTML 덩어리를 **한 번에** 넣기 | `innerHTML` (브라우저 파서가 매우 빠름) |
| 기존 내용에 **조금씩 추가/수정** | `createElement` + `append` (기존 요소를 건드리지 않음) |
| 요소 수백 개를 반복문으로 만들기 | `createElement` 후 **한 번에** `append` (또는 `DocumentFragment`) |

보통 규모의 페이지에서는 체감 차이가 거의 없다. 성능보다 **보안과 버그**가 선택 기준이다.

---

## 6. 가독성 {#readability}

| | 장점 | 단점 |
|---|---|---|
| `innerHTML` | HTML 모양 그대로 보여서 **읽기 쉽다** | 따옴표가 섞이면 헷갈린다 (`'<a href="...">'`) |
| `createElement` | 각 단계가 명확, 값을 안전하게 넣는다 | 코드가 **길어진다** |

길이 문제는 함수로 감싸서 해결한다. (이 사이트 `menu.js`의 `buildMenuList`가 그 예)

```js
function el(tag, props = {}, ...children) {
    const e = document.createElement(tag);
    Object.assign(e, props);
    e.append(...children);
    return e;
}
nav.append(el("ul", {}, el("li", {}, el("a", { href: "index.html", textContent: "홈" }))));
```

---

## 7. 중간 선택지들 {#alternatives}

| 방법 | 설명 |
|---|---|
| `textContent` | 글자만 넣을 때. 가장 안전하고 빠르다 |
| `insertAdjacentHTML("beforeend", html)` | 기존 요소를 지우지 않고 HTML 문자열을 **끝에 추가**. `+=` 함정은 없지만 XSS 위험은 같다 |
| `<template>` + `cloneNode` | HTML에 틀을 써 두고 복사해서 값만 채운다. HTML 모양도 보이고 안전하다 |
| `DocumentFragment` | 요소 여러 개를 메모리에서 조립한 뒤 **한 번에** 붙인다 |

---

## 8. React와의 관계 {#react}

React의 JSX:
```jsx
<a href="index.html">홈</a>
```
는 빌드할 때 이렇게 바뀐다.
```js
React.createElement("a", { href: "index.html" }, "홈")
```
HTML처럼 **보이지만** 실제로는 `createElement` 방식이다. 그래서 React는 기본적으로 XSS에 안전하고,
일부러 HTML 문자열을 넣으려면 `dangerouslySetInnerHTML`이라는 **"위험하다"는 이름의 속성**을 써야 한다.

---

## 9. 언제 무엇을 쓰나 {#when}

| 상황 | 선택 |
|---|---|
| 글자만 바꾼다 | `textContent` |
| 내가 직접 쓴 고정 HTML을 통째로 넣는다 | `innerHTML` 괜찮음 |
| 사용자 입력, URL, 서버 데이터가 들어간다 | `createElement` + `textContent` |
| 기존 목록에 항목을 추가한다 | `createElement` + `append` (`innerHTML +=` 금지) |
| 이벤트를 붙여야 한다 | `createElement` (만든 객체에 바로 `addEventListener`) |

---

## 10. 이 사이트에서 쓰는 곳 {#this_site}

- [`index.js`](index.js): 고양이 이미지 교체에 `innerHTML` 사용
  ```js
  selectedID.innerHTML = "<img src='jump_cat.jpg' alt='이미지 불러오기 실패'>";
  ```
  내가 쓴 고정 문자열이라 **문제없다.** (다만 `<img>` 하나만 바꾸는 거라면 `img.src = "jump_cat.jpg"`가 더 간단하다)

- [`menu.js`](menu.js): 메뉴 생성에 `createElement` 사용
  메뉴 이름(`label`)을 `textContent`로 넣으므로, 나중에 메뉴 데이터를 외부(JSON, 서버)에서 받아 와도 안전하다.

- [`webdev-innerhtml-create_element.demo.js`](webdev-innerhtml-create_element.demo.js): 이 노트의 체험 코너.
  ① XSS 체험은 **일부러** `innerHTML`을 써서 위험을 보여 주고, ② `+=` 함정 체험은 두 방식을 나란히 비교한다.
