var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Make Canvas
canvas.width = window. innerWidth * 0.4;
canvas.height = window.innerHeight * 0.6;

/*Make Object*/

const numSpots = 9;
const maxRow = 3;
const maxCol = 3;

let mousedown_x = 0;
let mousedown_y = 0;

class Spot{
  #radius = 5;
  #color = "000000";
  #originX = 50;
  #originY = 50;
  constructor(_i,_j){
    this.x = this.#originX + 50 * _j;
    this.y = this.#originY + 50 * _i;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.#radius,0,Math.PI*2);
    ctx.fillStyle = this.#color;
    ctx.fill();
    ctx.closePath();
  }
}
class Spots{
  constructor(_numSpots,_maxRow,_maxCol){
  }
}

let spot0 = new Spot(0,0);
let spot1 = new Spot(0,1);
let spot2 = new Spot(0,2);
let spot3 = new Spot(1,0);
let spot4 = new Spot(1,1);
let spot5 = new Spot(1,2);
let spot6 = new Spot(2,0);
let spot7 = new Spot(2,1);
let spot8 = new Spot(2,2);

let spots = [spot0,spot1,spot2,spot3,spot4,spot5,spot6,spot7,spot8];

let timer = 0;

function doSomething(e) {
	var posx = 0;
	var posy = 0;
	if (!e) var e = window.event;
	if (e.pageX || e.pageY) 	{
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) 	{
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
	// posx and posy contain the mouse position relative to the document
	// Do something with this information
}

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
  for(var i=0; i < 9; i++){
    spots[i].draw();
  }
}
프레임마다실행할거();