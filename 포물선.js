var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Make Canvas
canvas.width = window.innerWidth * 0.4;
canvas.height = window.innerHeight * 0.6;

function toCanvasY(y) {
  return canvas.height - y;
}

// 단위: 길이는 px, 시간은 초(s). (예전 값 × 60 = 60fps 기준 1프레임을 1/60초로 환산)
const g = -180;           // px/s²  (예전 -0.05 px/프레임²)
const bounce = 0.80;
const FRICTION = 0.3;     // 바닥의 운동 마찰계수 μ
const REST_SPEED = 12;    // px/s. 바닥에서 튈 때 이보다 느리면 멈춘다 (예전 0.2 px/프레임)
const SPEED_SCALE = 60;   // 슬라이더 값 1 = 60 px/s
const MAX_DT = 0.05;      // s. 탭을 오래 떠났다 돌아와도 한 번에 이 이상 진행하지 않는다
const CYCLE = 16;         // s. 이 시간마다 다시 발사한다 (예전 1000프레임 ≈ 16.7초)

/*Make Object*/
class Shell{
  constructor(){
    this.radius = 10;
    this.x = canvas.width/6;
    this.y = canvas.height/2;
    this.vx = 1;
    this.vy = -2;
    this.ax = 0;
    this.ay = g; // g가 음수라서 아래쪽 가속도
  }
}

let n = 20;
let shells = Array.from({ length: n }, () => new Shell());
/* 지피티 메롱
let shell0 = new Shell();
let shell1 = new Shell();
let shell2 = new Shell();
let shell3 = new Shell();
*/
/*var n = 10;
let shells = Array(n);
for(var i=0; i<n; i++){
  shells[i] = new Shell();
}*/

function drawShell(Shell) {
  ctx.beginPath();
  ctx.arc(Shell.x, toCanvasY(Shell.y), Shell.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#dd0000";
  ctx.fill();
  ctx.closePath();
}


/*draw animation*/
function applyPhysics(Shell, dt){
  // 속도를 먼저, 위치를 나중에 갱신한다 (semi-implicit Euler).
  // 순서가 반대면 바닥에서 튈 때마다 에너지가 조금씩 생겨 공이 영원히 통통 튄다.
  // dt를 곱하므로 모니터 주사율(60Hz, 120Hz…)과 상관없이 같은 속도로 움직인다.
  Shell.vx += Shell.ax * dt;
  Shell.vy += Shell.ay * dt;
  Shell.x += Shell.vx * dt;
  Shell.y += Shell.vy * dt;

  // 바닥에 닿았으면 튀기기
  // y는 공의 중심이다. 중심이 아니라 공의 아랫면(y - radius)이 바닥에 닿을 때 튄다.
  if (Shell.y < Shell.radius) {
    Shell.y = Shell.radius; // 바닥에 붙이기
    Shell.vy *= -bounce; // 위로 튀게 만들고 속도 줄이기
    // 꿈틀이 방지: 바닥에서 튈 때만 검사한다.
    // 밖에 두면 최고점(vy≈0)에서도 걸려서 공이 공중에 멈춘다.
    if (Math.abs(Shell.vy) < REST_SPEED) {
      Shell.vy = 0;
    }
    // 바닥 마찰 (운동 마찰): 바닥에 닿아 있는 동안 vx를 μ|g|·dt만큼 줄인다.
    // 줄일 양이 vx보다 크면 0에서 멈춘다 (지나쳐서 반대로 움직이지 않게).
    let dv = FRICTION * Math.abs(g) * dt;
    if (Math.abs(Shell.vx) <= dv) {
      Shell.vx = 0;
    } else {
      Shell.vx -= Math.sign(Shell.vx) * dv;
    }
  }

  // 좌우 벽에 닿으면 튀기기 (바닥과 같은 반발계수)
  if (Shell.x < Shell.radius) {
    Shell.x = Shell.radius;
    Shell.vx *= -bounce;
  } else if (Shell.x > canvas.width - Shell.radius) {
    Shell.x = canvas.width - Shell.radius;
    Shell.vx *= -bounce;
  }
}
function initializeShells() {
  let angleDeg = parseFloat(document.getElementById('range_angle').value);
  let speed = parseFloat(document.getElementById('range_initialSpeed').value) * SPEED_SCALE;
  let mass = parseFloat(document.getElementById('range_mass').value);
  let angleRad = angleDeg * Math.PI / 180;

  for (let i = 0; i < shells.length; i++) {
    let shell = shells[i];
    shell.radius = 5 + (mass / 20);
    shell.x = canvas.width / 6;
    //shell.y = canvas.height / 2;
    shell.y = shell.radius; // 바닥 위에 올려놓고 발사

    // 발사 각도 약간씩 퍼뜨리기
    let spread = (Math.random() - 0.5) * 0.3; // ±15도 정도
    let newAngle = angleRad + spread;

    shell.vx = speed * Math.cos(newAngle);
    shell.vy = speed * Math.sin(newAngle);
    shell.ax = 0;
    shell.ay = g;
  }
}



let elapsed = 0;       // 이번 발사 후 지난 시간 (s)
let lastTime = null;   // 직전 프레임의 시각 (ms)

function drawText(text) {
  ctx.font = '10px serif';
  ctx.fillText(text, 10, 10);
}



// requestAnimationFrame은 콜백에 "지금 시각(ms)"을 넘겨준다.
// 직전 프레임 시각과의 차이가 실제로 흐른 시간 dt다.
function 프레임마다실행할거(now) {
  requestAnimationFrame(프레임마다실행할거);

  if (lastTime === null) {  // 첫 프레임: 기준 시각만 잡고 발사
    lastTime = now;
    initializeShells();
  }
  let dt = Math.min((now - lastTime) / 1000, MAX_DT);  // ms → s
  lastTime = now;

  elapsed += dt;
  if (elapsed > CYCLE) {
    elapsed = 0;
    initializeShells();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawText(elapsed.toFixed(1) + ' s');

for (let i = 0; i < shells.length; i++) {
  applyPhysics(shells[i], dt);
  drawShell(shells[i]);
}
}

/*
function 프레임마다실행할거(){
  requestAnimationFrame(프레임마다실행할거);
  timer++;
  console.log(timer);
  if(timer > 1000){
    timer = 0;
  }
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawText(timer);
  
  
  if(timer < 300){
    
    drawShell(shell0);
    applyPhysics(shell0);
    initializePosition(shell1);
    initializePosition(shell2);
    initializePosition(shell3);
    for(i=0; i<n;i++){
      initializePosition(shells[i]);
    }
  }
  else{
    shell0.x = canvas.width/6 ;
    shell0.y = canvas.height/2 ;
    shell0.vx = 1;
    shell0.vy = -2;
    drawShell(shell1);
    applyPhysics(shell1);
    drawShell(shell2);
    applyPhysics(shell2);
    drawShell(shell3);
    applyPhysics(shell3);
    for(var i=0; i<n; i++){
      drawShell(shells[i]);
      applyPhysics(shells[i]);      
    }        
  }
}
*/
requestAnimationFrame(프레임마다실행할거);  // 직접 부르면 now가 undefined라서 rAF로 시작한다