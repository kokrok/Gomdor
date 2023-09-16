var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Make Canvas
canvas.width = window.innerWidth * 0.85;
canvas.height = window.innerHeight * 0.6;

/*Make Object*/

graphLeftMargin = 20;
graphRightMargin = 20;
graphTopMargin = 20;
graphBottomMargin = 20;

graph_start_x = graphLeftMargin;
graph_end_x = canvas.width - graphLeftMargin;
graph_width = graph_end_x - graph_start_x;
graph_start_y = graphTopMargin;
graph_end_y = canvas.height - graphBottomMargin;
graph_height = graph_end_y - graph_start_y;

ctx.beginPath();
ctx.fillStyle = "white";
ctx.fillRect(graph_start_x, graph_start_y, graph_width, graph_height);
ctx.closePath();


Xdata_min = 0;
Xdata_max = 100;
Xdata_step = 10;
Xdata_range = Xdata_max - Xdata_min;
Xdata_count = Math.floor(Xdata_range - Xdata_step);
Ydata_min = 0;
Ydata_max = 100;
Ydata_step = 20;
Ydata_range = Ydata_max - Ydata_min;
Ydata_count = Math.floor(Ydata_range - Ydata_step);

//draw grid
Xgrid_start = 20;
Xgrid_number = 50;
Ygrid_start = 20;
Ygrid_number = 30;

Xgrid_end = canvas.width - 20;
Xgrid_width = Xgrid_end - Xgrid_start;
Xgrid_space = Xgrid_width / Xgrid_number;
Ygrid_end = canvas.height - 20;
Ygrid_height = Ygrid_end - Ygrid_start;
Ygrid_space = Ygrid_height / Ygrid_number;

for (i = 0; i < Xgrid_number+1; i++) {
  ctx.beginPath();
  ctx.moveTo(Xgrid_start+Xgrid_space*(i), canvas.height - 20)
  ctx.lineTo(Xgrid_start+Xgrid_space*(i), 20);
  ctx.stroke();
}
for (j = 0; j < Ygrid_number+1; j++) {
  ctx.beginPath();
  ctx.moveTo(canvas.width - 20, Ygrid_start+Ygrid_space*(j))
  ctx.lineTo(20, Ygrid_start+Ygrid_space*j);
  ctx.stroke();
}


function drawNumberBox(x,y,value,color){
  const value_string = (value).toString();
  box_X = Xgrid_start + x*Xgrid_space;
  box_Y = Ygrid_end - y*Ygrid_space;
  box_X_width = 30;
  box_Y_height = 10;
  box_X_LeftTop = box_X-0.5*box_X_width;
  box_Y_LeftTop = box_Y-0.5*box_Y_height;
  box_Y_LeftBottom = box_Y+0.5*box_Y_height;
  
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
function valueOfPrimeFactors(n){
  let valueOfPrimeFactors = 0;
  let initail_n = n;
  let smallest_PrimeFactors = 2;
  let smallest_PrimeFactors_index = 0;
  for(let i=0; i<initail_n; i++){
    if(n<smallest_PrimeFactors)continue;
    if(n%smallest_PrimeFactors==0){
      console.log("n1",n);
      console.log("smallest_PrimeFactors",smallest_PrimeFactors_index,smallest_PrimeFactors);
      n=n/smallest_PrimeFactors;      
      console.log("n2",n);
      valueOfPrimeFactors++;
      console.log(valueOfPrimeFactors);
    }
    else{
      console.log("s",smallest_PrimeFactors_index,smallest_PrimeFactors);
      smallest_PrimeFactors++;
      smallest_PrimeFactors_index++;
      console.log("s",smallest_PrimeFactors_index,smallest_PrimeFactors);
    }
  }
  return valueOfPrimeFactors;
}
function valueOfPrimeFactor(n,ii){
  let valueOfPrimeFactors = 0;
  let initail_n = n;
  let smallest_PrimeFactors = 2;
  let smallest_PrimeFactors_index = 1;
  for(let i=0; i<initail_n; i++){
    if(n<smallest_PrimeFactors)continue;
    if(n%smallest_PrimeFactors==0){
      //console.log("n1",n);
      //console.log("smallest_PrimeFactors",smallest_PrimeFactors_index,smallest_PrimeFactors);
      n=n/smallest_PrimeFactors;      
      //console.log("n2",n);
      valueOfPrimeFactors++;
      //console.log(valueOfPrimeFactors);
    }
    else{
      //console.log("s",smallest_PrimeFactors_index,smallest_PrimeFactors);
      smallest_PrimeFactors++;
      smallest_PrimeFactors_index++;
      //console.log("s",smallest_PrimeFactors_index,smallest_PrimeFactors);
    }
  }
}
function isPrime(n){
  const n_string = (n).toString();
  valueOfTrueFalse = 0;
  valueOfDivisors = 0;
  if(n<2)return 2;
  let i=0;

  for(i=2; i<n; i++){
    if(n%i==0)valueOfDivisors++;
  }
  if(valueOfDivisors!=0){
    valueOfTrueFalse=0;
    //console.log(n_string, "is not Prime");
  }
  else{
    valueOfTrueFalse=1;
    //console.log(n_string, "is Prime");
  }
  //console.log("valueOfDivisors:",valueOfDivisors);
  //console.log("valueOfTrueFalse:",valueOfTrueFalse);
  
  return valueOfTrueFalse;
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

for(i=0;i<10;i++){
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
