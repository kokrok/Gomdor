import {isPrime} from "./NumberTheory.js";
import {printPrimeList} from "./NumberTheory.js";
//import {valueOfPrimeFactors} from "./NumberTheory.js";
//import {valueOfPrimeFactor} from "./NumberTheory.js";
import "./NumberTheory.js";
//import whatever, { getName, getMajor } from "./student.js"
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


// Make Canvas
canvas.width = window.innerWidth * 0.85;
canvas.height = window.innerHeight * 0.6;

//// canvas 배경 색
ctx.beginPath();
ctx.fillStyle = "gray";
ctx.fillRect(0, 0, canvas.width, canvas.height);

class Box{
  constructor(x,y,w,h,c){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;//color
  }
  draw(){
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class NumberBox extends Box{
  constructor(x,y,w,h,c,number){
    super(x,y,w,h,c);
    // this.x = x;
    // this.y = y;
    // this.w = w;
    // this.h = h;
    // this.c = c;//color
    this.n = number;
  }
  drawText(){
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.n,this.x+this.w/2,this.y+this.h/2,this.w,this.h);
    }
}

let b1 = new Box(20,20,20,20,"#660033");
let bt1 = new NumberBox(200,50,20,20,"#660033",2);
let bt2 = new NumberBox(200,100,20,20,"#660033",3);
let bt3 = new NumberBox(200,150,20,20,"#660033",5);
let bt4 = new NumberBox(200,200,20,20,"#660033",7);
let bt5 = new NumberBox(200,250,20,20,"#660033",11);

function fr(){
  requestAnimationFrame(fr);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  b1.draw();
  b1.x--;
  bt1.draw();
  bt1.drawText();
  bt1.x--;
  bt2.draw();
  bt2.drawText();
  bt2.x--;
  bt3.draw();
  bt3.drawText();
  bt3.x--;
  bt4.draw();
  bt4.drawText();
  bt4.x--;
  bt5.draw();
  bt5.drawText();
  bt5.x--;
}

fr();