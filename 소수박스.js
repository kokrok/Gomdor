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

let grid_short_bar_space = 25;
let grid_short_bar_length = 5;
let x_grid_short_bar_space = 1 * grid_short_bar_space;
let y_grid_short_bar_space = 1 * grid_short_bar_space;

let origin_X = 20;
let origin_Y = canvas.height - 20;

/*Make Object*/
function clearCanvas(){
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.closePath();
}

function drawGraph(){
  let graphLeftMargin = 20;
  let graphRightMargin = 20;
  let graphTopMargin = 20;
  let graphBottomMargin = 20;

  let graph_start_x = graphLeftMargin;
  let graph_end_x = canvas.width - graphLeftMargin;
  let graph_width = graph_end_x - graph_start_x;
  let graph_start_y = graphTopMargin;
  let graph_end_y = canvas.height - graphBottomMargin;
  let graph_height = graph_end_y - graph_start_y;


  
  // constructor(height, width) {
  //   this.height = height;
  //   this.width = width;
  // }
  // draw(){
  //   ctx.beginPath();
  //   ctx.fillStyle = "white";
  //   ctx.fillRect(graph_start_x, graph_start_y, graph_width, graph_height);
  //   ctx.closePath();
  // }

  //// canvas 배경 색
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.closePath();

  //origin Spot 그리기
  ctx.beginPath();
  ctx.arc(origin_X, origin_Y, 3, 0, Math.PI*2);
  ctx.fillStyle="brack";
  ctx.fill();
  ctx.closePath();

  ////x,y axis 그리기
  // X 축 그리기
  ctx.beginPath();
  ctx.strokeStyle="black";
  ctx.moveTo(0,origin_Y);
  ctx.lineTo(canvas.width,origin_Y);
  ctx.stroke();
  ctx.closePath();
  // Y 축 그리기
  ctx.beginPath();
  ctx.strokeStyle="black";
  ctx.moveTo(origin_X,canvas.height);
  ctx.lineTo(origin_X,0);
  ctx.stroke();
  ctx.closePath();

  ////눈금그리기
  //x 축 위 세로 눈금
  for(let i = 0; i<100; i++){
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.moveTo(origin_X+(i-30)*x_grid_short_bar_space,origin_Y-grid_short_bar_length);
    ctx.lineTo(origin_X+(i-30)*y_grid_short_bar_space,origin_Y+grid_short_bar_length);
    ctx.stroke();
    ctx.closePath();
  }
  //y 축 위 가로 눈금
  for(let i = 0; i<100; i++){
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.moveTo(origin_X-grid_short_bar_length,origin_Y-(i-30)*y_grid_short_bar_space);
    ctx.lineTo(origin_X+grid_short_bar_length,origin_Y-(i-30)*y_grid_short_bar_space);
    ctx.stroke();
    ctx.closePath();
  }

  //x 축 위 세로 grid
  for(let i = 0; i<100; i++){
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.moveTo(origin_X+(i-30)*x_grid_short_bar_space,canvas.height);
    ctx.lineTo(origin_X+(i-30)*y_grid_short_bar_space,0);
    ctx.stroke();
    ctx.closePath();
  }
  //y 축 위 가로 grid
  for(let i = 0; i<100; i++){
    ctx.beginPath();
    ctx.strokeStyle="#778855";
    ctx.moveTo(0,origin_Y-(i-30)*y_grid_short_bar_space);
    ctx.lineTo(canvas.width,origin_Y-(i-30)*y_grid_short_bar_space);
    ctx.stroke();
    ctx.closePath();
  }
}

// const graph1 = new graph(1,1);
// graph.draw();


let Xdata_min = 0;
let Xdata_max = 100;
let Xdata_step = 10;
let Xdata_range = Xdata_max - Xdata_min;
let Xdata_count = Math.floor(Xdata_range - Xdata_step);
let Ydata_min = 0;
let Ydata_max = 100;
let Ydata_step = 20;
let Ydata_range = Ydata_max - Ydata_min;
let Ydata_count = Math.floor(Ydata_range - Ydata_step);

/*
//draw grid
let Xgrid_start = 20;
let Xgrid_number = 50;
let Ygrid_start = 20;
let Ygrid_number = 30;

let Xgrid_end = canvas.width - 20;
let Xgrid_width = Xgrid_end - Xgrid_start;
let Xgrid_space = Xgrid_width / Xgrid_number;
let Ygrid_end = canvas.height - 20;
let Ygrid_height = Ygrid_end - Ygrid_start;
let Ygrid_space = Ygrid_height / Ygrid_number;

for (let i = 0; i < Xgrid_number+1; i++) {
  ctx.beginPath();
  ctx.moveTo(Xgrid_start+Xgrid_space*(i), canvas.height - 20)
  ctx.lineTo(Xgrid_start+Xgrid_space*(i), 20);
  ctx.stroke();
}
for (let j = 0; j < Ygrid_number+1; j++) {
  ctx.beginPath();
  ctx.moveTo(canvas.width - 20, Ygrid_start+Ygrid_space*(j))
  ctx.lineTo(20, Ygrid_start+Ygrid_space*j);
  ctx.stroke();
}
  */


function drawNumberBox(x,y,value,color){
  const value_string = (value).toString();
  let box_X = origin_X + x*x_grid_short_bar_space;
  let box_Y = origin_Y - y*y_grid_short_bar_space;
  let box_X_width = grid_short_bar_space*0.8;
  let box_Y_height = grid_short_bar_space*0.8;
  let box_X_LeftTop = box_X-0.5*box_X_width;
  let box_Y_LeftTop = box_Y-0.5*box_Y_height;
  let box_Y_LeftBottom = box_Y+0.5*box_Y_height;
  
  let colors = ["#E97132","#196B24","#0F9ED5","#A02B93","#4EA72E","#156082"];
  ctx.fillStyle = colors[value%6];
  ctx.strokeStyle = colors[value%6];
  ctx.font = "bold 18px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillRect(box_X_LeftTop, box_Y_LeftTop, box_X_width, box_Y_height);
  ctx.strokeRect(box_X_LeftTop, box_Y_LeftTop, box_X_width, box_Y_height);
  ctx.fillStyle = "black";
  ctx.fillText(value_string,box_X,box_Y);
}

function drawNumberBoxes(){
  let value1 = document.getElementById('text1').value;
  let value2 = document.getElementById('text2').value;

  console.log(value1);
  console.log(value2);  

  for(let i=Number(value1); i<Number(value2);i++){
    //console.log(printPrimeList(i));
    let primeList = printPrimeList(i)
    let length = primeList.length;
    //console.log(primeList);
    //console.log(length);
    for(let j = 0; j<length; j++){
      //console.log("J=",j);
      //console.log("primeList[J]=",primeList[j]);
  
      let factor = primeList[j];
      drawNumberBox(i,j+1,factor,"red");
    }
  }
};



drawGraph();
drawNumberBoxes();

document.getElementById('submit').onclick = function() {
  clearCanvas();
  drawGraph();
  let value1 = document.getElementById('text1').value;
  let value2 = document.getElementById('text2').value;
  drawNumberBoxes(value1,value2);
};



// console.log( document.forms[0] );
// console.log( document.forms[0].elements[0].value );
// console.log( document.forms[0].elements[1].value );
// console.log( document.forms[1].elements[0].value );
// console.log( document.forms[1].elements[1].value );


//console.log(nn);
//console.log(isPrime(nn));
/*
for(nn=2;nn<16;nn++){
  console.log(isPrime(nn));
}
*/
