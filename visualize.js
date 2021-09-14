import drawDualbarsBlocks from './visuals/drawDualbarsBlocks.js';

//options:type,colors,stroke
export default function visualize(data, canvasId) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var frame = arguments[3];

  //make a clone of options
  options = Object.assign({}, options);
  //options
  if (!options.stroke) options.stroke = 1;
  if (!options.colors) options.colors = ['#ff9234', '#ff9234'];
  var canvas = document.getElementById(canvasId);

  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var h = canvas.height;
  var w = canvas.width;

  ctx.strokeStyle = options.colors[0];
  ctx.lineWidth = options.stroke;

  var functionContext = {
    data: data,
    options: options,
    ctx: ctx,
    h: h,
    w: w,
    Helper: this.Helper,
    canvasId: canvasId
  };
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  drawDualbarsBlocks(functionContext);
}