// sim-bits_to_ai-03_adder 노트의 체험 코너 동작 (build.js가 이 노트 페이지에만 연결한다)
// 전가산기 8개를 줄 세운 리플 캐리 덧셈기. 오른쪽(1의 자리)부터 한 칸씩 계산하며 올림이 흘러가는 것을 보여 준다.
// 비트 번호 i = 0이 1의 자리(맨 오른쪽), i = 7이 128의 자리(맨 왼쪽)다.

const BITS = 8;
const STEP_MS = 350;

let A = 158, B = 67;
let step = 0;          // 계산이 끝난 칸 수 (0~8). 8이면 다 끝남
let timer = null;
const achieved = new Set();   // 한 번 성공한 도전 과제는 계속 ✅

const bitOf = (n, i) => (n >> i) & 1;

// 전가산기 한 칸: 1의 개수로 정해진다
function fullAdder(a, b, cin) {
    const ones = a + b + cin;
    return { sum: ones & 1, cout: ones >> 1 };   // 쓸 것 = 홀수 개면 1(XOR), 올릴 것 = 두 개 이상이면 1
}

// 모든 칸의 결과를 미리 계산해 둔다. 화면에는 step 칸까지만 보인다.
function addAll() {
    const carry = [0], sum = [];       // carry[i] = i번 칸으로 들어오는 올림, carry[8] = 맨 왼쪽에서 넘친 올림
    for (let i = 0; i < BITS; i++) {
        const r = fullAdder(bitOf(A, i), bitOf(B, i), carry[i]);
        sum.push(r.sum);
        carry.push(r.cout);
    }
    return { carry, sum };
}

const goals = [
    { label: "5 + 3 계산하기",                      done: (r) => (A === 5 && B === 3) || (A === 3 && B === 5) },
    { label: "올림이 세 번 이상 생기는 덧셈",       done: (r) => r.carry.slice(1).filter(c => c).length >= 3 },
    { label: "올림이 8칸 내내 이어지는 덧셈",       done: (r) => r.carry.slice(1).every(c => c) },
    { label: "넘침 만들기 (합이 255보다 큼)",       done: (r) => r.carry[BITS] === 1 },
];

/* ---------- 화면 요소 ---------- */
const $ = id => document.getElementById(id);
const grid = $("add-grid");
const inputA = $("add-a"), inputB = $("add-b");

function stop() { clearInterval(timer); timer = null; }

// 입력이 바뀌면 계산을 처음부터 다시 한다
function setNumbers(a, b) {
    stop();
    A = a; B = b; step = 0;
    inputA.value = A; inputB.value = B;
    render();
}

// 숫자 입력: 0~255 정수일 때만 받아들인다 (빈칸, 범위 밖은 무시)
for (const [el, which] of [[inputA, "A"], [inputB, "B"]]) {
    el.addEventListener("input", () => {
        const n = Number(el.value);
        if (el.value === "" || !Number.isInteger(n) || n < 0 || n > 255) return;
        stop(); step = 0;
        if (which === "A") A = n; else B = n;
        render();
    });
    el.addEventListener("change", () => { el.value = which === "A" ? A : B; });   // 잘못 입력한 채로 나가면 원래 값으로
}

function nextStep() {
    if (step < BITS) step++;
    if (step === BITS) stop();
    render();
}

$("add-run").addEventListener("click", () => {
    stop();
    if (step === BITS) step = 0;       // 다 끝난 뒤 누르면 처음부터 다시
    render();
    timer = setInterval(nextStep, STEP_MS);
});
$("add-step").addEventListener("click", () => { stop(); if (step === BITS) step = 0; nextStep(); });

const goalItems = goals.map(() => { const li = document.createElement("li"); $("add-goals").append(li); return li; });

/* ---------- 그리기 ---------- */
// 격자: 왼쪽 이름 칸 + 넘침 칸 + 8칸. 화면의 열 번호 col = 8 - i (col 0이 넘침 칸)
function cell(content, cls = "") { return `<div class="add-cell ${cls}">${content}</div>`; }

function render() {
    const r = addAll();
    const working = step - 1;                                                     // 방금 계산한 칸 (없으면 -1)
    const shown = i => i < step;                                                  // 결과가 보이는 칸
    const colOf = col => 8 - col;                                                 // 화면 열 → 비트 번호
    let html = "";

    // 1줄: 자릿값
    html += cell("", "add-name") + cell("");
    for (let col = 1; col <= BITS; col++) html += cell(2 ** colOf(col), "add-place");

    // 2줄: 올림 (그 칸으로 들어오는 올림을 숫자 위에 적는다)
    html += cell("올림", "add-name");
    for (let col = 0; col <= BITS; col++) {
        const i = colOf(col);                       // col 0이면 i = 8 (넘친 올림)
        const known = i >= 1 && shown(i - 1);       // i번 칸의 올림은 i-1번 칸이 끝나야 안다
        html += cell(known && r.carry[i] ? "1" : "", "add-carry" + (working === i ? " add-working" : ""));
    }

    // 3~4줄: A, B 스위치
    for (const [name, n] of [["A", A], ["B", B]]) {
        html += cell(name, "add-name") + cell("");
        for (let col = 1; col <= BITS; col++) {
            const i = colOf(col), b = bitOf(n, i);
            html += cell(`<button class="bit-switch add-switch" data-name="${name}" data-bit="${i}" aria-pressed="${b === 1}"
                aria-label="${name}의 ${2 ** i} 자리">${b}</button>`, working === i ? "add-working" : "");
        }
    }

    // 5줄: 합 (맨 왼쪽은 넘친 올림)
    html += cell("합", "add-name add-sum-row");
    const over = shown(BITS - 1) && r.carry[BITS];
    html += cell(shown(BITS - 1) ? r.carry[BITS] : "", "add-sum-row" + (over ? " add-overflow" : ""));
    for (let col = 1; col <= BITS; col++) {
        const i = colOf(col);
        html += cell(shown(i) ? r.sum[i] : "", "add-sum-row" + (working === i ? " add-working" : ""));
    }
    grid.innerHTML = html;

    grid.querySelectorAll(".add-switch").forEach(btn => btn.addEventListener("click", () => {
        const bit = 1 << Number(btn.dataset.bit);
        if (btn.dataset.name === "A") setNumbers(A ^ bit, B); else setNumbers(A, B ^ bit);
    }));

    // 상태 설명
    const status = $("add-status");
    if (step === 0) {
        status.textContent = `${A} + ${B} = ?   (더하기를 누르면 1의 자리부터 계산합니다)`;
    } else {
        const i = step - 1, a = bitOf(A, i), b = bitOf(B, i), c = r.carry[i];
        let text = `${2 ** i}의 자리: ${a} + ${b} + 올림 ${c} = ${r.carry[i + 1]}${r.sum[i]}  → 쓸 것 ${r.sum[i]}, 올릴 것 ${r.carry[i + 1]}`;
        if (step === BITS) {
            const total = A + B, carries = r.carry.slice(1).filter(c => c).length;
            text += total > 255
                ? `\n결과: ${A} + ${B} = ${total}. 8칸에는 ${total & 255}만 남고 맨 앞 1이 넘쳤습니다(넘침). 올림 ${carries}번`
                : `\n결과: ${A} + ${B} = ${total}. 올림 ${carries}번`;
            goals.forEach((g, k) => { if (g.done(r)) achieved.add(k); });
        }
        status.textContent = text;
    }

    goals.forEach((g, k) => {
        const ok = achieved.has(k);
        goalItems[k].textContent = `${ok ? "✅" : "⬜"} ${g.label}`;
        goalItems[k].classList.toggle("bit-goal-done", ok);
    });
}

render();
