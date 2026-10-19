var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Make Canvas
canvas.width = window.innerWidth * 0.6;
canvas.height = 200;

// 단위: 길이는 px, 시간은 초(s), 질량은 kg. 포물선 예제처럼 dt를 곱해 주사율과 상관없이 움직인다.
const MAX_DT = 0.05;   // s. 탭을 오래 떠났다 돌아와도 한 번에 이 이상 진행하지 않는다

/*Make Object*/
class Ball{
  constructor(name, color, mass, x, vx){
    this.name = name;
    this.color = color;
    this.mass = mass;
    this.radius = 10 + mass;   // 무거울수록 크게 그린다
    this.x = x;
    this.y = canvas.height / 2;
    this.vx = vx;
  }
  applyPhysics(dt){
    this.x += this.vx * dt;

    // 좌우 벽: 완전 탄성으로 튕긴다 (에너지가 보존되어야 충돌 전후를 비교하기 쉽다)
    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx = Math.abs(this.vx);
    } else if (this.x > canvas.width - this.radius) {
      this.x = canvas.width - this.radius;
      this.vx = -Math.abs(this.vx);
    }
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

var ball1 = new Ball('공1', '#dd0000', 10, 60, 150);
var ball2 = new Ball('공2', '#0055cc', 30, canvas.width / 2, 0);

// 1차원 완전 탄성 충돌.
// 운동량 보존 m1v1 + m2v2 = m1v1' + m2v2' 과
// 운동에너지 보존 ½m1v1² + ½m2v2² = ½m1v1'² + ½m2v2'² 을 함께 풀면 나오는 식이다. (캔버스 아래 식 참고)
function collide1D(a, b){
  let dx = b.x - a.x;
  let overlap = a.radius + b.radius - Math.abs(dx);
  if (overlap <= 0) return;   // 떨어져 있다

  // 서로 다가갈 때만 튕긴다. 이미 멀어지는 중인데 아직 겹쳐 있으면
  // 다시 튕겨서 두 공이 붙어 떨고 있게 된다.
  let approaching = (a.vx - b.vx) * dx > 0;
  if (approaching) {
    let m1 = a.mass, m2 = b.mass;
    let v1 = a.vx, v2 = b.vx;
    a.vx = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
    b.vx = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  }

  // 겹친 만큼 질량에 반비례해서 떼어 놓는다 (무거운 공이 덜 밀린다)
  let dir = Math.sign(dx) || 1;
  a.x -= dir * overlap * b.mass / (a.mass + b.mass);
  b.x += dir * overlap * a.mass / (a.mass + b.mass);
}

function drawText(){
  let p = ball1.mass * ball1.vx + ball2.mass * ball2.vx;
  let E = 0.5 * ball1.mass * ball1.vx ** 2 + 0.5 * ball2.mass * ball2.vx ** 2;
  ctx.fillStyle = '#333';
  ctx.font = '14px sans-serif';
  ctx.fillText(`${ball1.name}: m=${ball1.mass}, v=${ball1.vx.toFixed(1)}    ${ball2.name}: m=${ball2.mass}, v=${ball2.vx.toFixed(1)}`, 10, 20);
  ctx.fillText(`운동량 합 p = ${p.toFixed(1)}    운동에너지 합 E = ${E.toFixed(0)}`, 10, 40);
}

let lastTime = null;   // 직전 프레임의 시각 (ms)

function 프레임마다실행할거(now){
  requestAnimationFrame(프레임마다실행할거);
  if (lastTime === null) lastTime = now;
  let dt = Math.min((now - lastTime) / 1000, MAX_DT);  // ms → s
  lastTime = now;

  ball1.applyPhysics(dt);
  ball2.applyPhysics(dt);
  collide1D(ball1, ball2);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball1.draw();
  ball2.draw();
  drawText();
}
requestAnimationFrame(프레임마다실행할거);  // 직접 부르면 now가 undefined라서 rAF로 시작한다
