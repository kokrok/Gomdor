import {isPrime} from "./NumberTheory.js";
import {valueOfPrimeFactors} from "./NumberTheory.js";
import {valueOfPrimeFactor} from "./NumberTheory.js";

//import whatever, { getName, getMajor } from "./student.js"
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Make Canvas
canvas.width = window.innerWidth * 0.85;
canvas.height = window.innerHeight * 0.6;

/*Make Object*/
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
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(graph_start_x, graph_start_y, graph_width, graph_height);
  ctx.closePath();
}

// const graph1 = new graph(1,1);
// graph.draw();
drawGraph();


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


function drawNumberBox(x,y,value,color){
  const value_string = (value).toString();
  let box_X = Xgrid_start + x*Xgrid_space;
  let box_Y = Ygrid_end - y*Ygrid_space;
  let box_X_width = 10;
  let box_Y_height = 10;
  let box_X_LeftTop = box_X-0.5*box_X_width;
  let box_Y_LeftTop = box_Y-0.5*box_Y_height;
  let box_Y_LeftBottom = box_Y+0.5*box_Y_height;
  
  ctx.fillStyle = color;
  ctx.strokeStyle = "green";
  ctx.font = "8px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillRect(box_X_LeftTop, box_Y_LeftTop, box_X_width, box_Y_height);
  ctx.strokeRect(box_X_LeftTop, box_Y_LeftTop, box_X_width, box_Y_height);
  ctx.fillStyle = "black";
  ctx.fillText(value_string,box_X,box_Y);
}



// for(i=0; i<50;i++){
//   for(j=0;j<i+1;j++){
//     // var m = i*j;
//     // console.log(m);
//     // a=isPrime(m);
//     // console.log(a);
//     if(isPrime(i*j)==1){
//       drawNumberBox(i,j,i*j,"red");
//     }
//     else{
//       drawNumberBox(i,j,i*j,"green");
//     }
//   }
// }

drawNumberBox(2,1,2,"green");
drawNumberBox(3,1,3,"green");
drawNumberBox(4,1,2,"green");
drawNumberBox(4,2,2,"green");
drawNumberBox(5,1,2,"green");
drawNumberBox(6,1,2,"green");
drawNumberBox(6,2,3,"green");

for(let i=0;i<10;i++){
  console.log(i,"번째 facotr",valueOfPrimeFactor(288,5));
}
let z = valueOfPrimeFactors(12);
/*
for(i=1;i<=z;i++){
  drawNumberBox(12,i,2,"green");
}
*/
/*
for(i=2;i<12;i++){
  console.log(i,valueOfPrimeFactors(i));
}*/
for(n=2;n<16;n++){
  isPrime(n);
}
