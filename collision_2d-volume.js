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
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }
  applyPhysics(dt){
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // 벽: 완전 탄성. 벽에 수직인 성분만 뒤집는다.
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

    // 속도 화살표
    let ex = this.x + this.vx * ARROW_SCALE;
    let ey = this.y + this.vy * ARROW_SCALE;
    ctx.beginPath();
    ctx.moveTo(this.x, toCanvasY(this.y));
    ctx.lineTo(ex, toCanvasY(ey));
    ctx.strokeStyle = '#d0021b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 큰 공 안에는 질량을 적는다 (화살표에 가리지 않게 나중에 그린다)
    if (this.radius >= 16) {
      ctx.fillStyle = '#fff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.mass.toFixed(0) + 'g', this.x, toCanvasY(this.y) + 4);
      ctx.textAlign = 'left';
    }
  }
}

// 2차원 충돌. 2차원 충돌 예제와 같은 식이다. 달라진 것은 질량이 부피에서 나온다는 점뿐이다.
function collide2D(a, b){
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  let dist = Math.sqrt(dx*dx + dy*dy);
  let overlap = a.radius + b.radius - dist;
  if (overlap <= 0 || dist === 0) return;

  let nx = dx / dist;   // 단위 법선 벡터 n̂ (a → b)
  let ny = dy / dist;

  let vn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;   // 양수면 다가가는 중
  if (vn > 0) {
    let m1 = a.mass, m2 = b.mass;
    let e = restitution;
    let k1 = (1 + e) * m2 / (m1 + m2) * vn;
    let k2 = (1 + e) * m1 / (m1 + m2) * vn;
    a.vx -= k1 * nx;  a.vy -= k1 * ny;
    b.vx += k2 * nx;  b.vy += k2 * ny;
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
  let px = 0, py = 0, E = 0;
  for (let b of balls) {
    px += b.mass * b.vx;
    py += b.mass * b.vy;
    E += 0.5 * b.mass * (b.vx*b.vx + b.vy*b.vy);
  }
  ctx.fillStyle = '#333';
  ctx.font = '14px sans-serif';
  ctx.fillText(`공 ${balls.length}개    e = ${restitution}    E = ${E.toFixed(0)}`, 10, 20);
  ctx.fillText(`p = (${px.toFixed(0)}, ${py.toFixed(0)})`, 10, 40);
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
