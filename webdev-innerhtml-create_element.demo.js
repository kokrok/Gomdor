// webdev-innerhtml-create_element 노트의 체험 코너 동작 (build.js가 이 노트 페이지에만 연결한다)

// ---- 체험 ①: XSS ----
const xssInput = document.getElementById("xss-input");
const xssInner = document.getElementById("xss-inner");
const xssSafe  = document.getElementById("xss-safe");

function renderXss() {
    const name = xssInput.value;
    xssInner.innerHTML = "안녕하세요, " + name + "님";   // 일부러 위험한 방식

    const p = document.createElement("span");
    p.textContent = "안녕하세요, " + name + "님";        // 안전한 방식
    xssSafe.replaceChildren(p);
}
xssInput.addEventListener("input", renderXss);
for (const btn of document.querySelectorAll("[data-sample]")) {
    btn.addEventListener("click", () => {
        xssInput.value = btn.dataset.sample;
        renderXss();
    });
}
renderXss();

// ---- 체험 ②: += 함정 ----
const listInner = document.getElementById("list-inner");
const listSafe  = document.getElementById("list-safe");

// 클릭 카운터 버튼 + 입력칸이 들어 있는 항목 하나를 만든다
function makeCounterItem() {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    let count = 0;
    btn.textContent = "눌러 보세요: 0";
    btn.addEventListener("click", () => { btn.textContent = "눌러 보세요: " + (++count); });
    const input = document.createElement("input");
    input.placeholder = "여기에 글자 쓰기";
    li.append(btn, " ", input);
    return li;
}

function resetLists() {
    listInner.replaceChildren(makeCounterItem());
    listSafe.replaceChildren(makeCounterItem());
}

let innerCount = 0, safeCount = 0;
document.getElementById("add-inner").addEventListener("click", () => {
    listInner.innerHTML += "<li>새 항목 " + (++innerCount) + "</li>";
});
document.getElementById("add-safe").addEventListener("click", () => {
    const li = document.createElement("li");
    li.textContent = "새 항목 " + (++safeCount);
    listSafe.append(li);
});
document.getElementById("reset-lists").addEventListener("click", () => {
    innerCount = safeCount = 0;
    resetLists();
});
resetLists();
