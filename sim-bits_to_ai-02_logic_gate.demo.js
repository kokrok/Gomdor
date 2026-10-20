// sim-bits_to_ai-02_logic_gate 노트의 체험 코너 동작 (build.js가 이 노트 페이지에만 연결한다)
// NAND 게이트 4칸의 입력을 골라 목표 게이트(NOT, AND, OR, XOR)를 만드는 퍼즐.
// 게이트 i는 A, B, 그리고 자기보다 앞의 게이트 출력만 입력으로 받는다 (되돌아오는 선 없음).

const nand = (a, b) => (a & b) ^ 1;
const GATE_COUNT = 4;

const levels = [
    { name: "NOT", goal: "출력 = NOT A  (A를 뒤집기, B는 무시)", f: (a, b) => a ^ 1, min: 1,
      hint: "NAND의 두 입력에 같은 신호를 넣으면? 진리표에서 A = B인 줄만 보세요." },
    { name: "AND", goal: "출력 = A AND B", f: (a, b) => a & b, min: 2,
      hint: "NAND는 AND를 뒤집은 것입니다. 한 번 더 뒤집으면? (앞에서 만든 NOT을 쓰세요)" },
    { name: "OR", goal: "출력 = A OR B", f: (a, b) => a | b, min: 3,
      hint: "A와 B를 각각 먼저 뒤집은 다음 NAND에 넣어 보세요. \"둘 다 0이 아니면 1\"이 됩니다." },
    { name: "XOR", goal: "출력 = A XOR B  (둘이 다를 때만 1)", f: (a, b) => a ^ b, min: 4,
      hint: "G1 = NAND(A, B)를 먼저 만들고, 이것을 A와 B 각각과 다시 NAND 하세요. 마지막에 두 결과를 NAND 합니다." },
];

let level = 0;
let gates, output;                 // gates[i] = { a: "A", b: "B" },  output = "G1"
const input = { A: 0, B: 0 };      // 지금 화면에 보이는 입력 스위치

function reset() {
    gates = Array.from({ length: GATE_COUNT }, () => ({ a: "A", b: "B" }));
    output = "G1";
}

// 입력 (A, B)에 대해 모든 신호의 값을 계산한다. 앞 게이트부터 차례로 계산하면 된다.
function evaluate(A, B) {
    const v = { A, B };
    gates.forEach((g, i) => { v[`G${i + 1}`] = nand(v[g.a], v[g.b]); });
    return v;
}

// 출력에서 거꾸로 따라가며 실제로 쓰인 게이트를 찾는다
function usedGates() {
    const used = new Set();
    const visit = name => {
        if (!name.startsWith("G") || used.has(name)) return;
        used.add(name);
        const g = gates[Number(name.slice(1)) - 1];
        visit(g.a); visit(g.b);
    };
    visit(output);
    return used;
}

/* ---------- 화면 요소 ---------- */
const $ = id => document.getElementById(id);
const svg = $("gate-svg");

// 단계 버튼
const levelButtons = levels.map((lv, i) => {
    const btn = document.createElement("button");
    btn.addEventListener("click", () => { level = i; reset(); hideHint(); render(); });
    $("gate-levels").append(btn);
    return btn;
});

// 입력 스위치 A, B
const inputButtons = ["A", "B"].map(name => {
    const btn = document.createElement("button");
    btn.className = "bit-switch gate-input";
    btn.addEventListener("click", () => { input[name] ^= 1; render(); });
    $("gate-inputs").append(btn, " ");
    return { name, btn };
});

// 배선 고르기: "G1 = NAND( [A▾] , [B▾] )"
function makeSelect(options, value, onChange) {
    const sel = document.createElement("select");
    for (const o of options) sel.add(new Option(o, o, false, o === value));
    sel.addEventListener("change", () => onChange(sel.value));
    return sel;
}

function renderWiring() {
    const box = $("gate-wiring");
    box.replaceChildren();
    gates.forEach((g, i) => {
        const sources = ["A", "B", ...Array.from({ length: i }, (_, k) => `G${k + 1}`)];
        const row = document.createElement("div");
        row.append(`G${i + 1} = NAND( `,
            makeSelect(sources, g.a, v => { g.a = v; render(); }), " , ",
            makeSelect(sources, g.b, v => { g.b = v; render(); }), " )");
        box.append(row);
    });
    const row = document.createElement("div");
    row.append("출력 = ", makeSelect(gates.map((_, i) => `G${i + 1}`), output, v => { output = v; render(); }));
    box.append(row);
}

/* ---------- 회로도 (SVG) ---------- */
const ON = "#e08000", OFF = "#bbb";
const GX = [70, 135, 200, 265], GY = [55, 115, 55, 115];   // 게이트 왼쪽 끝 x, 가운데 y
const pin = {                                               // 신호가 나오는 점
    A: [28, 50], B: [28, 125],
    ...Object.fromEntries(GX.map((x, i) => [`G${i + 1}`, [x + 46, GY[i]]])),
};
const LAMP = [335, 85];

const wire = ([sx, sy], [tx, ty], on, faded) => {
    const dx = Math.max(20, (tx - sx) / 2);
    return `<path d="M${sx},${sy} C${sx + dx},${sy} ${tx - dx},${ty} ${tx},${ty}" fill="none"
        stroke="${on ? ON : OFF}" stroke-width="${on ? 3 : 2}" opacity="${faded ? 0.25 : 1}"/>`;
};

function renderSvg(v, used) {
    let s = "";
    // 선 (게이트 아래에 깔리도록 먼저 그린다)
    gates.forEach((g, i) => {
        const name = `G${i + 1}`, faded = !used.has(name);
        s += wire(pin[g.a], [GX[i], GY[i] - 9], v[g.a], faded);
        s += wire(pin[g.b], [GX[i], GY[i] + 9], v[g.b], faded);
    });
    s += wire(pin[output], [LAMP[0] - 12, LAMP[1]], v[output], false);

    // 입력 A, B
    for (const name of ["A", "B"]) {
        const [x, y] = pin[name];
        s += `<circle cx="${x - 8}" cy="${y}" r="9" fill="${v[name] ? "#ffd84d" : "#eee"}" stroke="#888"/>
              <text x="${x - 8}" y="${y + 4}" text-anchor="middle" font-size="11" font-weight="bold">${name}</text>`;
    }

    // NAND 게이트: D 모양 + 끝의 작은 동그라미(뒤집기 표시)
    GX.forEach((x, i) => {
        const y = GY[i], name = `G${i + 1}`, faded = !used.has(name);
        s += `<g opacity="${faded ? 0.3 : 1}">
            <path d="M${x},${y - 18} h20 a18,18 0 0 1 0,36 h-20 z" fill="#fff" stroke="#333" stroke-width="1.5"/>
            <circle cx="${x + 42}" cy="${y}" r="4" fill="#fff" stroke="#333" stroke-width="1.5"/>
            <text x="${x + 18}" y="${y + 4}" text-anchor="middle" font-size="11">${name}</text>
            <text x="${x + 46}" y="${y - 8}" font-size="10" fill="${v[name] ? ON : "#888"}">${v[name]}</text>
        </g>`;
    });

    // 출력 전구
    const [lx, ly] = LAMP;
    s += `<circle cx="${lx}" cy="${ly}" r="13" fill="${v[output] ? "#ffd84d" : "#eee"}" stroke="#888"/>
          <text x="${lx}" y="${ly + 30}" text-anchor="middle" font-size="11">출력 ${v[output]}</text>`;
    svg.innerHTML = s;
}

/* ---------- 진리표와 판정 ---------- */
function renderTable() {
    const lv = levels[level];
    let allOk = true;
    let rows = "";
    for (const [A, B] of [[0, 0], [0, 1], [1, 0], [1, 1]]) {
        const want = lv.f(A, B), got = evaluate(A, B)[output], ok = want === got;
        allOk &&= ok;
        const now = A === input.A && B === input.B ? ' class="gate-now"' : "";
        rows += `<tr${now}><td>${A}</td><td>${B}</td><td>${want}</td><td>${got}</td><td>${ok ? "✅" : "❌"}</td></tr>`;
    }
    $("gate-table").innerHTML = `<table><tr><th>A</th><th>B</th><th>목표</th><th>내 회로</th><th></th></tr>${rows}</table>`;

    const n = usedGates().size;
    $("gate-result").innerHTML = allOk
        ? `🎉 성공! NAND ${n}개로 ${lv.name} 게이트를 만들었습니다.` + (n <= lv.min ? " 최소 개수입니다." : ` (최소 ${lv.min}개로도 됩니다)`)
        : `사용한 NAND: ${n}개`;
    $("gate-result").classList.toggle("gate-ok", allOk);
}

function hideHint() { $("gate-hint-text").hidden = true; }
$("gate-hint").addEventListener("click", () => {
    $("gate-hint-text").textContent = "💡 " + levels[level].hint;
    $("gate-hint-text").hidden = false;
});
$("gate-reset").addEventListener("click", () => { reset(); hideHint(); render(); });

function render() {
    levelButtons.forEach((btn, i) => {
        btn.textContent = `${i + 1}. ${levels[i].name}`;
        btn.setAttribute("aria-pressed", i === level);
    });
    $("gate-goal").innerHTML = `<b>목표</b>: ${levels[level].goal}`;
    for (const { name, btn } of inputButtons) {
        btn.setAttribute("aria-pressed", input[name] === 1);
        btn.innerHTML = `<span class="bit-digit">${input[name]}</span><span class="bit-place">${name}</span>`;
    }
    renderWiring();
    renderSvg(evaluate(input.A, input.B), usedGates());
    renderTable();
}

reset();
render();
