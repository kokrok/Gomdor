var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Make Canvas
canvas.width = window. innerWidth * 0.4;
canvas.height = window.innerHeight * 0.6;

function toCanvasY(y) {
  return canvas.height - y;
}

/*Make Object*/
class Shell{
  constructor(){
    this.radius = 10;
    this.x = canvas.width/6;
    this.y = canvas.height/2;
    this.vx = 1;
    this.vy = -2;
    this.ax = 0;
    this.ay = 0.01;
  }
}
let shell0 = new Shell();
let shell1 = new Shell();
let shell2 = new Shell();
let shell3 = new Shell();

var n = 10;
let shells = Array(n);
for(var i=0; i<n; i++){
  shells[i] = new Shell();
}

function drawShell(Shell) {
  ctx.beginPath();
  ctx.arc(Shell.x, toCanvasY(Shell.y), Shell.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#dd0000";
  ctx.fill();
  ctx.closePath();
}


/*draw animation*/

function applyPhysics(Shell){
  Shell.x = Shell.x + Shell.vx;
  Shell.y = Shell.y + Shell.vy;
  Shell.vx = Shell.vx + Shell.ax;
  Shell.vy = Shell.vy + Shell.ay;
}

function initializeMainShell() {
  let angleDeg = parseFloat(document.getElementById('range_angle').value);
  let speed = parseFloat(document.getElementById('range_initialSpeed').value);

  let angleRad = angleDeg * Math.PI / 180;

  shell0.x = canvas.width / 6;
  shell0.y = canvas.height / 2;

  shell0.vx = speed * Math.cos(angleRad);
  shell0.vy = speed * Math.sin(angleRad); // +y 방향이 위쪽이니까 부호 유지
}



let timer = 0;

function drawText(timer) {
  ctx.font = '10px serif';
  ctx.fillText(timer, 10, 10);
}



function 프레임마다실행할거() {
  requestAnimationFrame(프레임마다실행할거);
  timer++;
  if (timer > 1000) timer = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawText(timer);

  if (timer === 1) {
    initializeMainShell();
  }

  drawShell(shell0);
  applyPhysics(shell0);
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
프레임마다실행할거();