// 사이트 공통 메뉴. 메뉴를 바꿀 땐 이 배열만 고치면 모든 페이지에 반영된다.
// 각 페이지에는 <nav id="site-menu"></nav> 자리와 <script src="menu.js" defer></script>만 둔다.
const MENU = [
    { label: "홈",     href: "index.html" },
    { label: "저자",   href: "author.html" },
    { label: "과학관", href: "index_menu4_예제.html" },
    { label: "글방",   href: "writing.html" },
];

function renderMenu() {
    const nav = document.getElementById("site-menu");
    if (!nav) return;

    // 현재 페이지 파일명 (한글 파일명은 URL에서 %EC%... 로 인코딩되므로 되돌린다)
    const current = decodeURIComponent(location.pathname.split("/").pop()) || "index.html";

    const ul = document.createElement("ul");
    for (const item of MENU) {
        const a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        if (item.href === current) {
            a.setAttribute("aria-current", "page");  // 현재 페이지 표시 (CSS로 강조 가능)
        }
        const li = document.createElement("li");
        li.append(a);
        ul.append(li);
    }
    nav.append(ul);
}

renderMenu();
