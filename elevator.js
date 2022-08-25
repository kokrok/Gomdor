var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Make Canvas
canvas.width = window. innerWidth * 0.4;
canvas.height = window.innerHeight * 0.6;

/*Make Object*/

class Square{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  draw(){
    ctx.fillRect(this.x, this.y,28,28);
    ctx.fillStyle = "#000000";
  }
  clear(){
    ctx.clearRect(this.x+1, this.y+1,26,26);
  }
}

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
let numSquare = 35;
let Squares = Array(numSquare);
let StateOfSquares = 0;

for(let i=0; i<numSquare;i++){
  let row = Math.floor(i/5);
  let col = i%5;
  Squares[i]= new Square(col*30,row*30);
}
function drawBackgroundSquare(){
  for(let i=0;i<numSquare;i++){
    Squares[i].draw();
    Squares[i].clear();
  }  
}
function updateStateOfSquare(n){
  StateOfSquares = n;
}
function drawSquare(StateOfSquares){
  switch(StateOfSquares){
    case 1:
      Squares[2].draw();
      Squares[6].draw();
      Squares[7].draw();
      Squares[12].draw();
      Squares[17].draw();
      Squares[22].draw();
      Squares[27].draw();
      Squares[32].draw();
      break;
    case 2:
      Squares[1].draw();
      Squares[2].draw();
      Squares[3].draw();
      Squares[5].draw();
      Squares[9].draw();
      Squares[13].draw();
      Squares[17].draw();
      Squares[21].draw();
      Squares[25].draw();
      Squares[30].draw();
      Squares[31].draw();
      Squares[32].draw();
      Squares[33].draw();
      Squares[34].draw();
      break;
    case 3:
      Squares[1].draw();
      Squares[2].draw();
      Squares[3].draw();
      Squares[5].draw();
      Squares[9].draw();
      Squares[14].draw();
      Squares[17].draw();
      Squares[18].draw();
      Squares[24].draw();
      Squares[25].draw();
      Squares[29].draw();
      Squares[31].draw();
      Squares[32].draw();
      Squares[33].draw();
      break;
  }
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
  drawBackgroundSquare();
  drawSquare(StateOfSquares);
  
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