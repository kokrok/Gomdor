var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Make Canvas
canvas.width = Math.min(window.innerWidth * 0.6, 900);
canvas.height = 400;

function toCanvasY(y) {
  return canvas.height - y;   // 물리 좌표는 위가 +y, 캔버스는 아래가 +y
}

// 단위: 길이는 px, 시간은 초(s). 중력은 없다 (당구대를 위에서 본 모습).
// 질량은 m = ρV로 계산한다. 10 px를 1 cm로 보면 ρ(g/cm³) × V(cm³) = m(g)이다.
const MAX_DT = 0.05;      // s. 탭을 오래 떠났다 돌아와도 한 번에 이 이상 진행하지 않는다
const ARROW_SCALE = 0.3;  // 속도 화살표 길이 = 속력 × 이 값 (px)
const PX_PER_CM = 10;
const R_MIN = 8, R_MAX = 30;   // 반지름 범위 (px)
let restitution = 1;      // 반발계수 e. 입력창(#input_restitution)으로 바꾼다
let friction = 0.3;       // 공끼리 닿는 면의 마찰계수 μ. 입력창(#input_friction)으로 바꾼다

// 재료별 밀도 (g/cm³, 실제 값)
const MATERIALS = [
  { name: '나무', density: 0.7, color: '#b07a3c' },
  { name: '물',   density: 1.0, color: '#3a8fd9' },
  { name: '돌',   density: 2.6, color: '#8a8f96' },
  { name: '철',   density: 7.8, color: '#3b3f46' },
];

// 공을 3차원 구로 본다 (위에서 내려다본 당구공). 부피는 반지름의 세제곱에 비례한다.
function sphereVolume(r){
  let rcm = r / PX_PER_CM;
  return 4 / 3 * Math.PI * rcm ** 3;   // cm³
}

/*Make Object*/
class Ball{
  constructor(radius, material, x, y, vx, vy){
    this.radius = radius;
    this.material = material;
    this.mass = material.density * sphereVolume(radius);   // m = ρV
    this.inertia = 2 / 5 * this.mass * radius * radius;     // 속이 꽉 찬 구의 관성모멘트 I = ⅖mr²
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.omega = 0;   // 각속도 ω (rad/s). 반시계 방향이 +
    this.angle = 0;   // 회전한 각도 θ (rad). 무늬를 그릴 때만 쓴다
  }
  applyPhysics(dt){
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.angle += this.omega * dt;

    // 벽: 완전 탄성, 마찰 없음. 벽에 수직인 성분만 뒤집고 회전은 그대로 둔다.
    // (회전이 공끼리의 마찰에서만 생기는 것을 보려고)
    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx = Math.abs(this.vx);
    } else if (this.x > canvas.width - this.radius) {
      this.x = canvas.width - this.radius;
      this.vx = -Math.abs(this.vx);
    }
    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy = Math.abs(this.vy);
    } else if (this.y > canvas.height - this.radius) {
      this.y = canvas.height - this.radius;
      this.vy = -Math.abs(this.vy);
    }
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x, toCanvasY(this.y), this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.material.color;
    ctx.fill();
    ctx.closePath();

    // 회전 무늬: 중심에서 θ 방향으로 흰 선을 긋는다. 이 선이 돌면 공이 도는 것이다.
    let mx = this.x + this.radius * Math.cos(this.angle);
    let my = this.y + this.radius * Math.sin(this.angle);
    ctx.beginPath();
    ctx.moveTo(this.x, toCanvasY(this.y));
    ctx.lineTo(mx, toCanvasY(my));
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 속도 화살표
    let ex = this.x + this.vx * ARROW_SCALE;
    let ey = this.y + this.vy * ARROW_SCALE;
    ctx.beginPath();
    ctx.moveTo(this.x, toCanvasY(this.y));
    ctx.lineTo(ex, toCanvasY(ey));
    ctx.strokeStyle = '#d0021b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

  }
}

// 2차원 충돌 + 회전. 충격량(impulse)으로 계산한다.
// 1) 법선 충격량 Jn: 이차원 충돌2와 같은 결과를 낸다 (회전은 법선 방향에 영향을 주지 않는다).
// 2) 접선 충격량 Jt: 접촉점에서 두 표면이 미끄러지는 속도 ut를 마찰이 줄인다.
//    미끄러짐을 완전히 멈추는 값(ut/K)과 쿨롱 마찰 한계(μJn) 중 작은 쪽을 쓴다.
//    Jt는 속도뿐 아니라 각속도도 바꾼다 (토크 = r × 힘).
function collide2D(a, b){
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  let dist = Math.sqrt(dx*dx + dy*dy);
  let overlap = a.radius + b.radius - dist;
  if (overlap <= 0 || dist === 0) return;

  let nx = dx / dist;   // 단위 법선 벡터 n̂ (a → b)
  let ny = dy / dist;
  let tx = -ny;         // 단위 접선 벡터 t̂ (n̂을 반시계로 90° 돌린 것)
  let ty = nx;

  let vn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;   // 양수면 다가가는 중
  if (vn > 0) {
    let invM = 1 / a.mass + 1 / b.mass;

    // 1) 법선 충격량
    let Jn = (1 + restitution) * vn / invM;
    a.vx -= Jn / a.mass * nx;  a.vy -= Jn / a.mass * ny;
    b.vx += Jn / b.mass * nx;  b.vy += Jn / b.mass * ny;

    // 2) 접선 충격량. 접촉점의 속도 = 중심 속도 + 회전 때문에 생기는 속도(ωr, 접선 방향)
    let ut = (a.vx - b.vx) * tx + (a.vy - b.vy) * ty + a.omega * a.radius + b.omega * b.radius;
    let K = invM + a.radius * a.radius / a.inertia + b.radius * b.radius / b.inertia;
    let Jt = ut / K;                                       // 미끄러짐을 멈추는 데 필요한 충격량
    let maxJt = friction * Jn;                             // 쿨롱 마찰: |Jt| ≤ μJn
    Jt = Math.max(-maxJt, Math.min(maxJt, Jt));

    a.vx -= Jt / a.mass * tx;  a.vy -= Jt / a.mass * ty;
    b.vx += Jt / b.mass * tx;  b.vy += Jt / b.mass * ty;
    a.omega -= a.radius * Jt / a.inertia;
    b.omega -= b.radius * Jt / b.inertia;
  }

  // 겹친 만큼 질량에 반비례해서 떼어 놓는다
  let sa = overlap * b.mass / (a.mass + b.mass);
  let sb = overlap * a.mass / (a.mass + b.mass);
  a.x -= sa * nx;  a.y -= sa * ny;
  b.x += sb * nx;  b.y += sb * ny;
}

let balls = [];

// 서로 겹치지 않게 무작위로 놓는다. 자리를 못 찾으면 그 공은 건너뛴다.
// mixed가 true면 재료를 섞고, false면 모두 물(같은 밀도)로 만든다.
function makeBalls(n, mixed){
  balls = [];
  for (let i = 0; i < n; i++) {
    let r = R_MIN + Math.random() * (R_MAX - R_MIN);
    let material = mixed ? MATERIALS[i % MATERIALS.length] : MATERIALS[1];
    for (let tries = 0; tries < 100; tries++) {
      let x = r + Math.random() * (canvas.width - 2*r);
      let y = r + Math.random() * (canvas.height - 2*r);
      let free = balls.every(b => Math.hypot(b.x - x, b.y - y) > b.radius + r + 2);
      if (free) {
        let angle = Math.random() * Math.PI * 2;
        let speed = 60 + Math.random() * 120;
        balls.push(new Ball(r, material, x, y, speed * Math.cos(angle), speed * Math.sin(angle)));
        break;
      }
    }
  }
}

function drawText(){
  let Et = 0, Er = 0;
  for (let b of balls) {
    Et += 0.5 * b.mass * (b.vx*b.vx + b.vy*b.vy);   // 병진 운동에너지
    Er += 0.5 * b.inertia * b.omega * b.omega;      // 회전 운동에너지
  }
  ctx.fillStyle = '#333';
  ctx.font = '14px sans-serif';
  ctx.fillText(`공 ${balls.length}개    e = ${restitution}    μ = ${friction}`, 10, 20);
  // 좁은 화면에서도 잘리지 않게 줄을 나눈다
  ctx.fillText(`E = ${(Et + Er).toFixed(0)}`, 10, 40);
  ctx.fillText(`병진 ${Et.toFixed(0)} + 회전 ${Er.toFixed(0)}`, 10, 60);
}

// 반발계수 입력창. 값이 바뀌면 다음 충돌부터 쓴다.
const restitutionInput = document.getElementById('input_restitution');
restitutionInput.addEventListener('input', () => {
  let value = parseFloat(restitutionInput.value);
  if (value >= 0 && value <= 1) {  // 빈칸이나 범위 밖은 무시하고 이전 값을 유지한다
    restitution = value;
  }
});
restitution = parseFloat(restitutionInput.value);

// 마찰계수 입력창. 0이면 회전이 생기지 않아 이차원 충돌2와 같아진다.
const frictionInput = document.getElementById('input_friction');
frictionInput.addEventListener('input', () => {
  let value = parseFloat(frictionInput.value);
  if (value >= 0 && value <= 1) {  // 빈칸이나 범위 밖은 무시하고 이전 값을 유지한다
    friction = value;
  }
});
friction = parseFloat(frictionInput.value);

const countInput = document.getElementById('input_count');
const materialSelect = document.getElementById('select_material');
function restart(){
  let n = parseInt(countInput.value);
  if (n >= 2 && n <= 30) makeBalls(n, materialSelect.value === 'mixed');
}
document.getElementById('button_restart').addEventListener('click', restart);
materialSelect.addEventListener('change', restart);
restart();

let lastTime = null;   // 직전 프레임의 시각 (ms)

function 프레임마다실행할거(now){
  requestAnimationFrame(프레임마다실행할거);
  if (lastTime === null) lastTime = now;
  let dt = Math.min((now - lastTime) / 1000, MAX_DT);  // ms → s
  lastTime = now;

  for (let b of balls) b.applyPhysics(dt);
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      collide2D(balls[i], balls[j]);
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let b of balls) b.draw();
  drawText();
}
requestAnimationFrame(프레임마다실행할거);  // 직접 부르면 now가 undefined라서 rAF로 시작한다
