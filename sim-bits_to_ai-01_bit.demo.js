// sim-bits_to_ai-01_bit 노트의 체험 코너 동작 (build.js가 이 노트 페이지에만 연결한다)
// 스위치 8개(1바이트)를 숫자, 글자(아스키), 밝기 세 가지로 동시에 해석해서 보여 준다.

const bits = Array(8).fill(0);                        // bits[0]이 맨 왼쪽(자릿값 128)
const placeValue = i => 2 ** (7 - i);
const valueOf = () => bits.reduce((sum, b, i) => sum + b * placeValue(i), 0);

// 숫자 → 글자. 아스키 32~126만 화면에 보이는 글자다.
function charOf(n) {
    if (n === 32) return { text: "␣", note: "띄어쓰기(공백)" };
    if (n >= 33 && n <= 126) return { text: String.fromCharCode(n), note: "" };
    if (n < 32 || n === 127) return { text: "·", note: "보이지 않는 제어 문자" };
    return { text: "·", note: "아스키 범위(0~127) 밖" };
}

const goals = [
    { label: "숫자 5",          done: n => n === 5 },
    { label: "글자 A",          done: n => n === 65 },
    { label: "글자 a",          done: n => n === 97 },
    { label: "가장 밝은 흰색",  done: n => n === 255 },
];

const switchBox = document.getElementById("bit-switches");
const views = document.getElementById("bit-views");
const goalList = document.getElementById("bit-goals");

// 스위치 버튼 8개. aria-pressed로 켜짐/꺼짐을 화면 낭독기에도 알린다.
const buttons = bits.map((_, i) => {
    const btn = document.createElement("button");
    btn.className = "bit-switch";
    btn.addEventListener("click", () => { bits[i] ^= 1; render(); });
    switchBox.append(btn);
    return btn;
});

const goalItems = goals.map(g => {
    const li = document.createElement("li");
    goalList.append(li);
    return li;
});

document.getElementById("bit-reset").addEventListener("click", () => { bits.fill(0); render(); });

function render() {
    const n = valueOf();
    buttons.forEach((btn, i) => {
        btn.setAttribute("aria-pressed", bits[i] === 1);
        btn.innerHTML = `<span class="bit-digit">${bits[i]}</span><span class="bit-place">${placeValue(i)}</span>`;
    });

    const on = bits.map((b, i) => b ? placeValue(i) : 0).filter(v => v);
    const sum = on.length ? `${on.join(" + ")} = ${n}` : "0";
    const ch = charOf(n);
    views.innerHTML = `
        <div><span class="bit-label">비트</span><code>${bits.join("")}</code></div>
        <div><span class="bit-label">숫자</span><b>${n}</b> <small>(${sum})</small></div>
        <div><span class="bit-label">글자</span><b class="bit-char">${ch.text}</b> <small>${ch.note}</small></div>
        <div><span class="bit-label">밝기</span><span class="bit-swatch" style="background: rgb(${n}, ${n}, ${n})"></span> <small>${n} / 255</small></div>`;

    goals.forEach((g, i) => {
        const ok = g.done(n);
        goalItems[i].textContent = `${ok ? "✅" : "⬜"} ${g.label}`;
        goalItems[i].classList.toggle("bit-goal-done", ok);
    });
}

render();
