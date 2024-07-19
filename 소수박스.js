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
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.closePath();

let value1 = 2;
//let value1 = document.getElementById('text1').value; //시작정수
//let value2 = document.getElementById('text2').value; //끝정수

let grid_short_bar_space = 50;
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
}

function drawGrid(option_gridSpace){
  if(option_gridSpace === "VALUE_DEPEND"){  
    ////눈금그리기
  //x 축 위 세로 눈금
  for(let i = 0; i<100; i++){
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.moveTo(origin_X+(i-30)*x_grid_short_bar_space,origin_Y-grid_short_bar_length);
    ctx.lineTo(origin_X+(i-30)*x_grid_short_bar_space,origin_Y+grid_short_bar_length);
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
    ctx.lineTo(origin_X+(i-30)*x_grid_short_bar_space,0);
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
else(option_gridSpace === "SPACE_DEPEND")
{
  let X_START = value1;
  let X_END = value2;
  let X_STEP_COUNT = 30;
      
  let Y_START = 0;
  let Y_END = 10;
  let Y_STEP_COUNT = 10;
  let X_START_COORDINATES = origin_X;
  let Y_START_COORDINATES = origin_Y;

  let X_END_COORDINATES = canvas.width - 20;
  let Y_END_COORDINATES = 20;

  x_grid_short_bar_space = (X_END_COORDINATES - X_START_COORDINATES)/X_STEP_COUNT;
  y_grid_short_bar_space = (Y_START_COORDINATES - Y_END_COORDINATES)/Y_STEP_COUNT;

  //x 축 위 세로 눈금
  for(let i = 0; i<X_STEP_COUNT+3; i++){
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.moveTo(origin_X+(i-3)*x_grid_short_bar_space,origin_Y-grid_short_bar_length);
    ctx.lineTo(origin_X+(i-3)*x_grid_short_bar_space,origin_Y+grid_short_bar_length);
    ctx.stroke();
    ctx.closePath();
  }
  //y 축 위 가로 눈금
  for(let i = 0; i<Y_STEP_COUNT+3; i++){
    ctx.beginPath();
    ctx.strokeStyle="red";
    ctx.moveTo(origin_X-grid_short_bar_length,origin_Y-(i-3)*y_grid_short_bar_space);
    ctx.lineTo(origin_X+grid_short_bar_length,origin_Y-(i-3)*y_grid_short_bar_space);
    ctx.stroke();
    ctx.closePath();
  }

  //x 축 위 세로 grid
  for(let i = 0; i<X_STEP_COUNT+3; i++){
    ctx.beginPath();
    ctx.strokeStyle="green";
    ctx.moveTo(origin_X+(i-3)*x_grid_short_bar_space,canvas.height);
    ctx.lineTo(origin_X+(i-3)*x_grid_short_bar_space,0);
    ctx.stroke();
    ctx.closePath();
  }
  //y 축 위 가로 grid
  for(let i = 0; i<Y_STEP_COUNT+3; i++){
    ctx.beginPath();
    ctx.strokeStyle="#778855";
    ctx.moveTo(0,origin_Y-(i-3)*y_grid_short_bar_space);
    ctx.lineTo(canvas.width,origin_Y-(i-3)*y_grid_short_bar_space);
    ctx.stroke();
    ctx.closePath();
  }
};
}


function drawNumberBox(x,y,value){
  const value_string = (value).toString();
    let box_X = origin_X + x*x_grid_short_bar_space;
    let box_Y = origin_Y - y*y_grid_short_bar_space;
    let box_X_width = x_grid_short_bar_space*0.9;
    let box_Y_height = y_grid_short_bar_space*0.9;
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

function drawNumberBoxesForValue(value1,x){
  let primeList = printPrimeList(value1);
  let length = primeList.length;

  for(let i=0; i<length;i++){
      drawNumberBox(x,i+1,primeList[i],"red");
      }
  }

function drawNumberBoxesForValues(value1,value2){
  for(let i = value1; i<value2; i++){
    drawNumberBoxesForValue(i,i-value1+1);
  }  
}

  
//     //console.log(printPrimeList(i));

//     //console.log(primeList);
//     //console.log(length);
//     for(let  j =0; j<length; j++){
//       //console.log("J=",j);
//       //console.log("primeList[J]=",primeList[j]);
  
//       let factor = primeList[j];
//       drawNumberBox(i,j+1,factor,"red");
//     }
//   }
// };





// document.getElementById('submit').onclick = function() {
//   clearCanvas();
//   let value1 = document.getElementById('text1').value;
//   let value2 = document.getElementById('text2').value;
//   // drawGraph(value1,value2);
//   // drawNumberBoxes(value1,value2);
// };

// document.getElementById('text2').oninput = function() {
  
//   let value1 = document.getElementById('text1').value;
//   let value2 = document.getElementById('text2').value;
//   // drawGraph(value1,value2);
//   // drawNumberBoxes(value1,value2);
// };



let frame = 0;
function fr(){//프레임마다 반복할거
  requestAnimationFrame(fr);
  clearCanvas();
  drawGraph();
  drawNumberBoxesForValues(value1,value1+30);
  if(frame%4===0){
    //drawGrid("SPACE_DEPEND");
    //drawGrid("VALUE_DEPEND");    
    value1++;
  }  
  frame++;
}

let frr = requestAnimationFrame(fr);
function stopp(){
  cancelAnimationFrame(fr);
} 
canvas.addEventListener("click", stopp, false);


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
