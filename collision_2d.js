var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Make Canvas
canvas.width = Math.min(window.innerWidth * 0.6, 900);
canvas.height = 400;

function toCanvasY(y) {
  return canvas.height - y;   // 물리 좌표는 위가 +y, 캔버스는 아래가 +y
}

// 단위: 길이는 px, 시간은 초(s), 질량은 kg. 중력은 없다 (당구대를 위에서 본 모습).
const MAX_DT = 0.05;      // s. 탭을 오래 떠났다 돌아와도 한 번에 이 이상 진행하지 않는다
const ARROW_SCALE = 0.3;  // 속도 화살표 길이 = 속력 × 이 값 (px)
let restitution = 1;      // 반발계수 e. 1이면 완전 탄성, 0이면 완전 비탄성. 입력창(#input_restitution)으로 바꾼다
const COLORS = ['#dd0000', '#0055cc', '#2e8b57', '#e08a00', '#8e44ad', '#16a085', '#c0392b', '#2c3e50'];

/*Make Object*/
class Ball{
  constructor(mass, x, y, vx, vy, color){
    this.mass = mass;
    this.radius = 8 + 2 * mass;   // 무거울수록 크게 그린다
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
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
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    // 속도 화살표: 2차원에서는 방향이 바뀌는 것이 핵심이라 그려서 보여 준다
    let ex = this.x + this.vx * ARROW_SCALE;
    let ey = this.y + this.vy * ARROW_SCALE;
    ctx.beginPath();
    ctx.moveTo(this.x, toCanvasY(this.y));
    ctx.lineTo(ex, toCanvasY(ey));
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// 2차원 충돌.
// 두 중심을 잇는 방향(법선 n)으로만 힘이 작용한다.
// → 법선 성분은 1차원 충돌 식(반발계수 e 포함)으로 바뀌고, 접선 성분은 그대로다. (캔버스 아래 식 참고)
function collide2D(a, b){
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  let dist = Math.sqrt(dx*dx + dy*dy);
  let overlap = a.radius + b.radius - dist;
  if (overlap <= 0 || dist === 0) return;   // 떨어져 있다 (dist가 0이면 방향을 정할 수 없다)

  let nx = dx / dist;   // 단위 법선 벡터 n̂ (a → b)
  let ny = dy / dist;

  // 상대 속도의 법선 성분. 양수면 서로 다가가는 중이다.
  let vn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
  if (vn > 0) {
    let m1 = a.mass, m2 = b.mass;
    let e = restitution;
    let k1 = (1 + e) * m2 / (m1 + m2) * vn;
    let k2 = (1 + e) * m1 / (m1 + m2) * vn;
    a.vx -= k1 * nx;  a.vy -= k1 * ny;
    b.vx += k2 * nx;  b.vy += k2 * ny;
  }

  // 겹친 만큼 법선 방향으로 질량에 반비례해서 떼어 놓는다
  let sa = overlap * b.mass / (a.mass + b.mass);
  let sb = overlap * a.mass / (a.mass + b.mass);
  a.x -= sa * nx;  a.y -= sa * ny;
  b.x += sb * nx;  b.y += sb * ny;
}

let balls = [];

// 서로 겹치지 않게 무작위로 놓는다. 자리를 못 찾으면 그 공은 건너뛴다.
function makeBalls(n){
  balls = [];
  for (let i = 0; i < n; i++) {
    let mass = 1 + Math.floor(Math.random() * 5);   // 1~5 kg
    let r = 8 + 2 * mass;
    for (let tries = 0; tries < 100; tries++) {
      let x = r + Math.random() * (canvas.width - 2*r);
      let y = r + Math.random() * (canvas.height - 2*r);
      let free = balls.every(b => Math.hypot(b.x - x, b.y - y) > b.radius + r + 2);
      if (free) {
        let angle = Math.random() * Math.PI * 2;
        let speed = 60 + Math.random() * 120;
        balls.push(new Ball(mass, x, y, speed * Math.cos(angle), speed * Math.sin(angle), COLORS[i % COLORS.length]));
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
  // 좁은 화면에서도 잘리지 않게 두 줄로 쓴다
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
document.getElementById('button_restart').addEventListener('click', () => {
  let n = parseInt(countInput.value);
  if (n >= 2 && n <= 30) makeBalls(n);
});
makeBalls(parseInt(countInput.value));

let lastTime = null;   // 직전 프레임의 시각 (ms)

function 프레임마다실행할거(now){
  requestAnimationFrame(프레임마다실행할거);
  if (lastTime === null) lastTime = now;
  let dt = Math.min((now - lastTime) / 1000, MAX_DT);  // ms → s
  lastTime = now;

  for (let b of balls) b.applyPhysics(dt);
  // 모든 쌍을 검사한다 (공 n개면 n(n−1)/2 쌍). 공이 수십 개 정도면 충분히 빠르다.
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
