var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Make Canvas
canvas.width = window. innerWidth * 0.85;
canvas.height = window.innerHeight * 0.6;

/*Make Object*/

  }
graph_start_x = 20;
graph_end_x = canvas.width - 20;
graph_width = graph_end_x - graph_start_x;
graph_start_y = 20;
graph_end_y = canvas.height - 20;
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
Ydata_step = 10;
Ydata_range = Ydata_max - Ydata_min;
Ydata_count = Math.floor(Ydata_range - Ydata_step);

//draw grid
Xgrid_start = 20;
Xgrid_end = canvas.width-20;
Ygrid_start = 20;
Ygrid_end = canvas.height - 20;

ctx.beginPath();
ctx.moveTo(20,canvas.height - 20)
ctx.lineTo(20,20);
ctx.stroke();