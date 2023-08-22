var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Make Canvas
canvas.width = window. innerWidth * 0.85;
canvas.height = window.innerHeight * 0.6;

/*Make Object*/
class graph {
  graph_left_margin = 30;
  graph_right_margin = 30;
  graph_top_margin = 30;
  graph_bottom_margin = 30;
  graph_width_white = canvas.width - graph_left_margin - graph_right_margin;
  graph_height_white = canvas.height - graph_top_margin - graph_bottom_margin;
  // constructor(height, width) {
  //   this.height = height;
  //   this.width = width;
  // }
  draw(){
    x = graph_left_margin;
    y = graph_top_margin;
    width = graph_width_white;
    height = graph_height_white;
    ctx.beginPath();
    ctx.fillStyle = "#99999";
    ctx.fillRect(x, y, width, height);
    ctx.closePath();
  }
}


graph_left_limit = 20;
graph_right_limit = canvas.width - 20;
graph_width = graph_right_limit - graph_left_limit;
graph_top_limit = 20;
graph_bottom_limit = canvas.height - 20;
graph_height = graph_bottom_limit - graph_top_limit;

ctx.beginPath();
ctx.fillStyle = "#338833";
ctx.fillRect(graph_left_limit, graph_bottom_limit, graph_width, -graph_height);
ctx.closePath();


Xdata_min = 0;
Xdata_max = 100;
Xdata_step = 10;
Xdata_range = Xdata_max - Xdata_min;
Xdata_count = Math.floor(Xdata_range - Xdata_step);
Ydata_min = 0;
Ydata_max = 100;
Ydata_step = 10;
Ydata_range = Ydata_max - Ydata_min;
Ydata_count = Math.floor(Ydata_range - Ydata_step);

//draw grid
Xgrid_start = 20;
Xgrid_end = canvas.width-20;
Ygrid_start = 20;
Ygrid_end = canvas.height - 20;

for(ix = 0; ix<Xdata_count; ix ++){
  ctx.beginPath();
  ctx.moveTo(graph_left_limit+ix*graph_bottom_limit);
  ctx.lineTo(20,20);
  ctx.stroke();

}
const g = new graph();
g.draw();
