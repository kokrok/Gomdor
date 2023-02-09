var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Make Canvas
canvas.width = window.innerWidth * 0.6;
canvas.height = window.innerHeight * 0.7;

/*Make Object*/

class Ball{
  constructor(_name){
    this.name = _name;
    this.color = "dd0000";
    this.mass = 10;
    this.radius = 10;
    this.x = 50;
    this.y = 50;
    this.vx = 5;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    
    this.px = this.mass * this.vx;
    this.py = this.mass * this.vy;
  }
  applyPhysics(){
    this.x = this.x + this.vx;
    this.y = this.y + this.vy;
    this.vx = this.vx + this.ax;
    this.vy = this.vy + this.ay;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    this.applyPhysics();
  }
}

var ball1 = new Ball;
var ball2 = new Ball;

ball2.x = 150;
ball2.vx = 0;
ball2.vy = 0;

function collisionCheck(ball1,ball2){
  distanceX = ball2.x - ball1.x;
  distanceY = ball2.y - ball1.y;
  distance = Math.sqrt(distanceX*distanceX+distanceY*distanceY);
  if(distance<ball2.radius+ball1.radius){
    console.log("collision");
  }
  console.log(distance);
}
function 프레임마다실행할거(){
  requestAnimationFrame(프레임마다실행할거);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ball1.draw();
  ball2.draw();
  collisionCheck(ball1,ball2);
}
프레임마다실행할거();