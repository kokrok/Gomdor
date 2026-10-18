# `aria-current` — "지금 여기"를 알려 주는 속성

```html
<a href="index.html" aria-current="page">홈</a>
```

여러 개 중에서 **현재 위치에 해당하는 하나**를 표시하는 HTML 속성이다.
메뉴에서 "지금 보고 있는 페이지", 단계 표시에서 "지금 단계" 같은 것을 나타낸다.

---

## 1. ARIA가 뭔가

**ARIA** (Accessible Rich Internet Applications)는 W3C 웹 표준으로,
**화면 낭독기(스크린 리더)** 같은 보조 기술에 "이 요소가 무엇이고 어떤 상태인지" 알려 주는 속성 모음이다.
이름이 모두 `aria-`로 시작한다. (`aria-label`, `aria-hidden`, `aria-expanded`, `aria-current` …)

- 눈이 보이는 사람은 **색, 굵기, 위치**로 "지금 이 메뉴구나"를 안다.
- 화면 낭독기 사용자는 그걸 볼 수 없다. 그래서 **의미를 코드로** 적어 줘야 한다.
- `aria-current="page"`가 있으면 화면 낭독기는 링크를 이렇게 읽는다.
  > "홈, 링크, **현재 페이지**"

### 비유
- **C/C++**: 화면에 보이는 모양은 출력 결과, ARIA는 그 출력에 붙은 **타입 정보**다.
  모양만 보고는 모르는 "이건 현재 선택된 항목이다"라는 의미를 기계가 읽을 수 있게 붙여 둔다.
- **Python**: 리스트에서 현재 위치를 따로 `current_index = 2`로 들고 있는 것과 같다.
  색칠은 사람용 표현이고, `aria-current`는 기계가 읽는 `current_index`다.

---

## 2. 값의 종류

| 값 | 뜻 | 예 |
|---|---|---|
| `page` | 현재 **페이지** | 사이트 메뉴, 페이지 번호 (1 2 **3** 4) |
| `step` | 현재 **단계** | 회원가입 1단계 → **2단계** → 3단계 |
| `location` | 현재 **위치** | 지도, 흐름도에서 "현재 위치" |
| `date` | 현재 **날짜** | 달력에서 오늘 |
| `time` | 현재 **시간** | 시간표에서 지금 시간대 |
| `true` | 현재 항목 (종류를 특정하기 어려울 때) | 일반적인 목록 |
| `false` | 현재 아님 (속성을 안 붙인 것과 같음) | |

- 한 묶음 안에서 **딱 하나**에만 붙인다.
- 아닌 항목에는 `aria-current="false"`를 쓰기보다 **속성을 아예 빼는 게** 보통이다.

---

## 3. 왜 `class="active"`가 아니라 `aria-current`인가

현재 메뉴 표시에는 오랫동안 `class="active"`를 써 왔다.

```html
<a href="index.html" class="active">홈</a>           <!-- 옛 관례 -->
<a href="index.html" aria-current="page">홈</a>      <!-- 현재 권장 -->
```

| | `class="active"` | `aria-current="page"` |
|---|---|---|
| 사람이 보는 표시 | CSS로 가능 | CSS로 가능 |
| 화면 낭독기가 읽음 | **X** (class는 이름일 뿐 의미가 없음) | **O** ("현재 페이지") |
| 이름 | 사람마다 제각각 (`active`, `on`, `current`, `selected`) | 표준으로 정해져 있음 |
| 테스트 코드에서 찾기 | 프로젝트 관례를 알아야 함 | 표준이라 도구가 바로 찾음 |

**의미와 모양을 하나로** 관리할 수 있어서 요즘은 `aria-current`를 쓰고, CSS도 이 속성으로 건다.

---

## 4. CSS로 강조하기

속성 선택자 `[속성="값"]`으로 바로 스타일을 줄 수 있다.

```css
nav a[aria-current="page"] {
    font-weight: bold;
    color: #000;
    text-decoration: none;
}
```

`class`를 따로 붙였다 뗐다 할 필요가 없다. 속성 하나가 **의미(접근성)와 모양(CSS)** 을 모두 담당한다.

---

## 5. JavaScript로 붙이기

```js
// 현재 페이지와 같은 링크에 표시
if (item.href === current) {
    a.setAttribute("aria-current", "page");
}

// 표시 지우기
a.removeAttribute("aria-current");

// 현재 표시된 요소 찾기
document.querySelector('[aria-current="page"]');
```

단계 표시처럼 **값이 바뀌는 경우**에는 이전 항목에서 지우고 새 항목에 붙인다.

```js
function goToStep(n) {
    steps.forEach((li, i) => {
        if (i === n) li.setAttribute("aria-current", "step");
        else         li.removeAttribute("aria-current");
    });
}
```

---

## 6. 비슷한 속성과 구별하기

| 속성 | 뜻 | 쓰는 곳 |
|---|---|---|
| `aria-current` | 여러 개 중 **현재 위치** | 메뉴, 페이지 번호, 단계 |
| `aria-selected` | 사용자가 **고른 것** | 탭, 목록 상자 (`role="tab"`, `role="option"`) |
| `aria-checked` | **체크 상태** | 체크박스 모양을 직접 만들 때 |
| `aria-pressed` | 토글 버튼이 **눌린 상태** | 켜기/끄기 버튼 |
| `aria-expanded` | 접었다 펴는 부분이 **열린 상태** | 드롭다운 메뉴, 아코디언 |

헷갈리면 이렇게 기억한다. **"지금 어디 있나" → `current`, "무엇을 골랐나" → `selected`.**

---

## 7. 주의할 점

- **ARIA는 의미만 알려 준다. 동작은 바꾸지 않는다.** `aria-current`를 붙여도 링크는 그대로 링크고, 클릭도 그대로 된다.
- **첫 번째 규칙: 가능하면 ARIA 없이 해결한다.** `<button>`, `<nav>`, `<input type="checkbox">`처럼 의미가 있는 HTML 태그를 먼저 쓰고,
  HTML만으로 표현할 수 없는 의미에만 ARIA를 쓴다. "현재 페이지"는 HTML 태그로 표현할 방법이 없어서 `aria-current`를 쓰는 것이다.
- 한 묶음 안에 **두 개 이상** 붙이지 않는다.

---

## 8. 이 사이트에서 쓰는 곳

[`menu.js`](menu.js)의 `buildMenuList` 함수:

```js
if (item.href === current) {
    a.setAttribute("aria-current", "page");  // 현재 페이지 표시 (CSS로 강조 가능)
}
```

- 지금 열려 있는 페이지 파일 이름과 메뉴의 `href`가 같으면 표시한다.
- 아직 CSS 강조는 넣지 않았다. 위 4장의 CSS를 `style.css`에 추가하면 현재 메뉴가 굵게 보인다.
- 한계: 과학관의 예제 페이지(`index_menu4_예제_포물선.html` 등)에 있을 때는 "과학관" 메뉴에 표시되지 않는다.
  파일 이름이 정확히 같은 경우만 비교하기 때문이다. 폴더 구조를 `museum/...`처럼 정리하면 "이 폴더 안이면 과학관"으로 바꿀 수 있다.
