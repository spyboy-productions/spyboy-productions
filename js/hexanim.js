  /////////////////////////////////////////////
 // https://codepen.io/mariandev/pen/OVONVL //
/////////////////////////////////////////////

var hexagon_radius = 96;
var hexagon_max_absolute_speed = 0.01;
var hexagon_space_between = 5;
var hexagon_line_width = 0.5;
var hexagon_color = '#ffffff4d';

var canvas, ctx;

var hexagons = [];

var s3p3 = Math.sqrt(3);

function init() {
	canvas = document.getElementById('bg-overlay');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.width = canvas.width + 'px';
	canvas.style.height = canvas.height + 'px';
	ctx = canvas.getContext('2d');

	ctx.globalCompositeOperation = "source-over";

	var hw = Math.ceil( canvas.width / ( 1.5 * hexagon_radius + hexagon_space_between * 2 ) ) + 1;
	var hh = Math.ceil( canvas.height / ( s3p3 * hexagon_radius + hexagon_space_between * 2 ) ) + 1;

	for(var x = 0;x<hw;x++)
		for(var y=0;y<hh;y++)
			addHexagon(
				 hexagon_radius + hexagon_space_between + ( 1.5 * hexagon_radius + hexagon_space_between * 2 ) * x,
				s3p3 * hexagon_radius / 2 + hexagon_space_between + ( s3p3 * hexagon_radius + hexagon_space_between * 2 ) * y - ( x%2 ? s3p3 * hexagon_radius / 2 : 0 ),
				{
					l: 0
				}
			);

	ctx.lineWidth = hexagon_line_width;
	loop();
}

function loop() {
	requestAnimFrame(loop);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'transparent';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.beginPath();

	for(var i=0;i<hexagons.length;i++)
		drawHexagonPath(i);

	ctx.shadowColor = hexagon_color;
	ctx.shadowBlur = 20;
	ctx.strokeStyle = hexagon_color;
	ctx.stroke();

}

function addHexagon(x, y, opts) {
	var l = Math.floor(Math.random() * 6),
		p = Math.random();

	if(!opts) opts = {};

	hexagons.push({
		sl: opts.l || opts.l === 0 ? opts.l : l,
		p: opts.p || opts.p === 0 ? opts.p : p,
		x: x,
		y: y,
		speed: opts.speed || opts.speed === 0 ? opts.speed : ( Math.random() * hexagon_max_absolute_speed * 2 - hexagon_max_absolute_speed )
	});
}

function drawHexagonPath(hex_index) {

	var hex = hexagons[hex_index];

	ctx.moveTo(
		hex.x + Math.cos( Math.PI / 3 * hex.sl ) * hexagon_radius + Math.cos( Math.PI / 3 * (hex.sl + 2) ) * hexagon_radius * hex.p,
		hex.y + Math.sin( Math.PI / 3 * hex.sl ) * hexagon_radius +  Math.sin( Math.PI / 3 * (hex.sl + 2) ) * hexagon_radius * hex.p
	);

	//ctx.moveTo(hex.x, hex.y);

	ctx.lineTo(
		hex.x + Math.cos( Math.PI / 3 * ( hex.sl + 1 ) ) * hexagon_radius,
		hex.y + Math.sin( Math.PI / 3 * ( hex.sl + 1 ) ) * hexagon_radius
	);

	ctx.lineTo(
		hex.x + Math.cos( Math.PI / 3 * ( hex.sl + 2 ) ) * hexagon_radius,
		hex.y + Math.sin( Math.PI / 3 * ( hex.sl + 2 ) ) * hexagon_radius
	);

	ctx.lineTo(
		hex.x + Math.cos( Math.PI / 3 * ( hex.sl + 3 ) ) * hexagon_radius,
		hex.y + Math.sin( Math.PI / 3 * ( hex.sl + 3 ) ) * hexagon_radius
	);

	ctx.lineTo(
		hex.x + Math.cos( Math.PI / 3 * ( hex.sl + 3 ) ) * hexagon_radius + Math.cos( Math.PI / 3 * (hex.sl + 5) ) * hexagon_radius * hex.p,
		hex.y + Math.sin( Math.PI / 3 * ( hex.sl + 3 ) ) * hexagon_radius + Math.sin( Math.PI / 3 * (hex.sl + 5) ) * hexagon_radius * hex.p
	);

	hex.p += hex.speed;
	if(hex.p > 1 || hex.p < 0) {
		hex.p = hex.speed < 0 ? 1 : 0;
		hex.sl += hex.speed < 0 ? -1 : 1;
		hex.sl = hex.sl % 6;
		hex.sl = hex.sl < 0 ? 4 - hex.sl : hex.sl;
	}

	hexagons[hex_index] = hex;

}

window.onload = function() {
	init();
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();