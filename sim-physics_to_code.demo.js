// sim-physics_to_code 노트의 체험 코너 동작 (build.js가 이 노트 페이지에만 연결한다)
// 공을 바로 위로 던지고 바닥에서 튀게 한다. y는 공의 아랫면 높이(위가 +)다.

const BOUNCE = 0.8;  // 반발계수
const GROUND = 24;   // 캔버스 아래 끝에서 바닥선까지 (px)
const R = 6;         // 공 반지름 (그리기용)

// 바닥 충돌: 튀기고, 너무 느리면 멈춘다. 실제로 튀어 오른 경우만 센다.
function hitFloor(b, rest) {
    b.y = 0;
    b.vy *= -BOUNCE;
    if (Math.abs(b.vy) < rest) b.vy = 0;
    else b.hits++;
}

function status(b) {
    if (b.vy === 0 && b.y > 0) return `공중에 멈춤 (y = ${b.y.toFixed(0)})`;
    if (b.vy === 0 && b.y === 0) return `정지 · ${b.hits}번 튐`;
    return `${b.hits}번 튐`;
}

/* 체험 1: 꿈틀이 방지와 계산 순서 (포물선 예제의 원래 단위 px/프레임) */
const G1 = 0.05, REST1 = 0.2;
const jitterWays = [
    { label: "① 원래 코드", color: "#d00000", hz: 60, v0: 4,
      step(b) {
          b.y += b.vy;  b.vy -= G1;                 // 위치 먼저
          if (b.y < 0) { b.y = 0; b.vy *= -BOUNCE; b.hits++; }
          if (Math.abs(b.vy) < REST1) b.vy = 0;    // 매 프레임 검사 ← 문제
      } },
    { label: "② 꿈틀이만 고침", color: "#e08000", hz: 60, v0: 4,
      step(b) {
          b.y += b.vy;  b.vy -= G1;                 // 위치 먼저
          if (b.y < 0) hitFloor(b, REST1);          // 바닥에서만 검사
      } },
    { label: "③ 순서도 고침", color: "#378854", hz: 60, v0: 4,
      step(b) {
          b.vy -= G1;  b.y += b.vy;                 // 속도 먼저
          if (b.y < 0) hitFloor(b, REST1);
      } },
];

/* 체험 2: 프레임 기준 vs 실제 시간(dt) 기준 */
const G2 = 180, REST2 = 12;  // dt 방식은 px/s 단위 (= 0.05 px/프레임² × 60², 0.2 px/프레임 × 60)
const frameStep = b => { b.vy -= G1; b.y += b.vy; if (b.y < 0) hitFloor(b, REST1); };
const dtWays = [
    { label: "60Hz · 프레임 기준", color: "#378854", hz: 60, v0: 4, step: frameStep },
    { label: "144Hz · 프레임 기준", color: "#d00000", hz: 144, v0: 4, step: frameStep },
    { label: "144Hz · dt 사용", color: "#0070c0", hz: 144, v0: 240,
      step(b, dt) { b.vy -= G2 * dt; b.y += b.vy * dt; if (b.y < 0) hitFloor(b, REST2); } },
];

// 캔버스 하나에 공들을 세로 칸으로 나눠 그린다
function drawLanes(canvas, ctx, balls) {
    const w = canvas.width / balls.length, h = canvas.height;
    ctx.clearRect(0, 0, canvas.width, h);
    ctx.strokeStyle = "#999";
    ctx.beginPath(); ctx.moveTo(0, h - GROUND); ctx.lineTo(canvas.width, h - GROUND); ctx.stroke();
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    balls.forEach((b, i) => {
        const cx = w * (i + 0.5);
        ctx.fillStyle = "#333";
        ctx.fillText(b.label, cx, 16);
        ctx.fillText(status(b), cx, 32);
        ctx.fillStyle = b.color;
        ctx.beginPath(); ctx.arc(cx, h - GROUND - b.y - R, R, 0, Math.PI * 2); ctx.fill();
    });
}

// 체험 하나를 준비한다. 공마다 정해진 주사율(hz)로, 실제로 흐른 시간만큼 계산을 반복한다.
// (화면이 몇 Hz든 결과가 같도록: 본문 7절의 "고정 dt + 누적기" 방식)
function makeDemo(canvasId, buttonId, ways) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.clientWidth;  // 화면에 보이는 폭에 맞춰 해상도를 정한다
    let balls;
    const reset = () => { balls = ways.map(w => ({ ...w, y: 0, vy: w.v0, hits: 0, acc: 0 })); };
    reset();
    document.getElementById(buttonId).addEventListener("click", reset);
    return {
        advance(sec) {
            for (const b of balls) {
                const h = 1 / b.hz;
                b.acc += sec;
                while (b.acc >= h) { b.step(b, h); b.acc -= h; }
            }
        },
        draw() { drawLanes(canvas, ctx, balls); },
    };
}

const demos = [
    makeDemo("demo-jitter", "demo-jitter-reset", jitterWays),
    makeDemo("demo-dt", "demo-dt-reset", dtWays),
];

let last = null;
function frame(now) {
    const sec = last === null ? 0 : Math.min((now - last) / 1000, 0.1);  // 탭 전환 대비 상한
    last = now;
    for (const d of demos) { d.advance(sec); d.draw(); }
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
