var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Make Canvas
canvas.width = window. innerWidth * 0.4;
canvas.height = window.innerHeight * 0.6;

/*Make Object*/

class 바둑판{
  가로선
  세로선
  그리다()
}

class 바둑알{
  플레이어=[플레이어1,플레이어2];
  색상
  가로좌표
  세로좌표
  그리다()
}
class 바둑규칙

먹히다(점)































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
  
function drawShell(Shell){;
    ctx.beginPath();
    ctx.arc(Shell.x,Shell.y,Shell.radius,0,Math.PI*2);
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
function initializePosition(Shell){
  Shell.x = shell0.x;
  Shell.y = shell0.y;
  Shell.vx = 2*Math.random()-1;
  Shell.vy = 2*Math.random()-1;
  //Shell.ax = 0;
  //Shell.ay = 0;
};
let timer = 0;

function drawText(timer) {
  ctx.font = '10px serif';
  ctx.fillText(timer, 10, 10);
}

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
프레임마다실행할거();