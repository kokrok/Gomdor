var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var shellInitialSpeed = document.getElementById('range_initialSpeed').value;
var shellInitialAngle = -document.getElementById('range_angle').value;
var shellInitialAngleRad = (shellInitialAngle/180)*Math.PI;
var shellInitialMass = document.getElementById('range_mass').value;

// Make Canvas
canvas.width = window.innerWidth * 0.6;
canvas.height = window.innerHeight * 0.7;

/*Make Object*/

class Shell{
  constructor(_name){
    this.name = _name;
    this.mass = shellInitialMass;
    this.densityOfVolume = 100;
    this.volume = this.mass * this.densityOfVolume;
    this.radius = Math.cbrt(this.volume);
    this.x = canvas.width/6;
    this.y = canvas.height/2;
    this.v = shellInitialSpeed;
    this.vx0 = this.v*Math.cos(shellInitialAngleRad); 
    this.vy0 = this.v*Math.sin(-shellInitialAngleRad);
    this.vx = this.vx0;
    this.vy = this.vy0;
    this.ax = 0;
    this.ay = 0.01;
    this.p = this.mass * this.v;
  }
}

let shell0 = new Shell("shell0");
var shell0LastVx = shell0.vx;
var shell0LastVy = shell0.vy;
console.log("Radius",shell0.radius);

let shell1CenterOfMass = new Shell("shell1_CenterOfMass");


var m = 10;
let secondShells = Array(m);
for(var i=0; i<m; i++){
  var secondShellsName = "secondShell_"+i;
  secondShells[i] = new Shell(secondShellsName);
  secondShells[i].vx0 = 2*Math.random()-1;
  secondShells[i].vy0 = 2*Math.random()-1;
  secondShells[i].mass = shell0.mass/m;
  secondShells[i].densityOfVolume = 100;
  secondShells[i].volume = secondShells[i].mass * secondShells[i].densityOfVolume;
  secondShells[i].radius = Math.cbrt(secondShells[i].volume);
  console.log("Mass",secondShells[i].mass,i);
  console.log("Radius",secondShells[i].name,secondShells[i].radius,i);
}

function resetSecondShells(){
  for(var i=0; i<m; i++){
    secondShells[i].vx0 = 2*Math.random()-1;
    secondShells[i].vy0 = 2*Math.random()-1;
  }
}

function drawShell(Shell){;
    ctx.beginPath();
    ctx.arc(Shell.x,Shell.y,Shell.radius,0,Math.PI*2);
    //console.log(Shell.name,Shell.radius);
    console.log("DrawRadius",Shell.name,Shell.radius);
    ctx.fill();
    ctx.closePath();
  }

  function drawCenterOfMass(Shell){;
    ctx.beginPath();
    ctx.arc(Shell.x,Shell.y,Shell.radius,0,Math.PI*2);
    ctx.fillStyle = "#000000";
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

function readInitialStatus(){
  shellInitialSpeed = document.getElementById('range_initialSpeed').value;
  shellInitialAngle = -document.getElementById('range_angle').value;
  shellInitialAngleRad = (shellInitialAngle/180)*Math.PI;
  shellInitialMass = document.getElementById('range_mass').value;
}
function initializePositionShell0(){
  shell0.x = canvas.width/6 ;
  shell0.y = canvas.height*3/4 ;
  shell0.vx = shellInitialSpeed*Math.cos(shellInitialAngleRad);
  shell0.vy = shellInitialSpeed*Math.sin(shellInitialAngleRad);
  shell0.mass = shellInitialMass;
  shell0.volume = shell0.mass * shell0.densityOfVolume;
  shell0.radius = Math.cbrt(shell0.volume);
};
function initializePositionSecondShells(){
  for(var i=0;i<m;i++){
    secondShells[i].x = shell0.x;
    secondShells[i].y = shell0.y;
    secondShells[i].vx = secondShells[i].vx0+shell0LastVx;
    secondShells[i].vy = secondShells[i].vy0+shell0LastVy;
    secondShells[i].mass = shell0.mass/m;
    secondShells[i].volume = secondShells[i].mass * secondShells[i].densityOfVolume;
    secondShells[i].radius = Math.cbrt(secondShells[i].volume);
  }
  let shell0LastMomentumX= shell0.mass*shell0LastVx;
  let shell0LastMomentumY= shell0.mass*shell0LastVy;
  let sumOfMomentumXsOfSecondShells=0;
  let sumOfMomentumYsOfSecondShells=0;
  for(var i=0; i<m; i++){
    sumOfMomentumXsOfSecondShells = sumOfMomentumXsOfSecondShells + secondShells[i].mass*secondShells[i].vx0;
    sumOfMomentumYsOfSecondShells = sumOfMomentumXsOfSecondShells + secondShells[i].mass*secondShells[i].vy0;
  }
  secondShells[m-1].vx = (shell0LastMomentumX-sumOfMomentumXsOfSecondShells)/secondShells[m-1].mass;
  secondShells[m-1].vy = (shell0LastMomentumY-sumOfMomentumYsOfSecondShells)/secondShells[m-1].mass;
  //console.log('secShell[',m-1,']X',secondShells[m-1].vx);
  //console.log('secShell[',m-1,']Y',secondShells[m-1].vy);
};
function updatePositionOfCenterOfMass(){
  let sumOfMassProductXPositionOfSecondShells = 0;
  let sumOfMassProductYPositionOfSecondShells = 0;
  let sumOfMassOfSecondShells = 0;

  for(var i=0;i<m;i++){
    sumOfMassProductXPositionOfSecondShells = sumOfMassProductXPositionOfSecondShells + secondShells[i].mass*secondShells[i].x;
    sumOfMassProductYPositionOfSecondShells = sumOfMassProductYPositionOfSecondShells + secondShells[i].mass*secondShells[i].y;
    sumOfMassOfSecondShells = sumOfMassOfSecondShells + secondShells[i].mass*1;
    //console.log("X",sumOfMassProductXPositionOfSecondShells);
    //console.log("Y",sumOfMassProductYPositionOfSecondShells);
    //console.log("M",sumOfMassOfSecondShells);
  }
  shell1CenterOfMass.x = sumOfMassProductXPositionOfSecondShells/sumOfMassOfSecondShells;
  shell1CenterOfMass.y = sumOfMassProductYPositionOfSecondShells/sumOfMassOfSecondShells;
  //console.log("CMX",shell1CenterOfMass.x);
  //console.log("CMY",shell1CenterOfMass.y);
}

let timer = 0;

function drawText(timer) {
  ctx.font = '10px serif';
  ctx.fillText(timer, 10, 10);
}

function 프레임마다실행할거(){
  requestAnimationFrame(프레임마다실행할거);
  timer++;
  if(timer%50==0){
    console.log(timer,shell0.vx,shell0.vy);
  }
  if(timer > 350){
    timer = 0;
    readInitialStatus();
    initializePositionShell0();
    resetSecondShells();
  }
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawText(timer);
  ctx.fillStyle = "#dd0000";
  
  if(timer < 150){
    drawShell(shell0);
    applyPhysics(shell0);
    for(var i = 0; i<m; i++){
      initializePositionSecondShells();
    }
    shell0LastVx = shell0.vx;
    shell0LastVy = shell0.vy;
  }
  else{
  for(var i=0; i<m; i++){
    if(i==m-1){
      ctx.fillStyle = "#0000dd";
    }
    drawShell(secondShells[i]);
    applyPhysics(secondShells[i]);
  }
  ctx.fillStyle = "#00dd00"
  drawShell(shell0);
  applyPhysics(shell0);
  updatePositionOfCenterOfMass();
  drawCenterOfMass(shell1CenterOfMass);
  applyPhysics(shell1CenterOfMass);
}
}
프레임마다실행할거();