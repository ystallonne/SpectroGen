// Variables for referencing the canvas and 2dcanvas context
var canvas,ctx;
var canvasPointList = [];

let sizeCursor = 25;
var rainbowCounter = 0; // Between 0 and 100

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}
var r = randomIntFromInterval(0, 255);
var g = randomIntFromInterval(0, 255);
var b = randomIntFromInterval(0, 255);
var a = 255;

// Variables to keep track of the mouse position and left-button status 
var mouseX,mouseY,mouseDown=0;
var canvasMat;

// Draws a dot at a specific position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawDot(ctx,x,y,size) {
	// Select a fill style
	ctx.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";

	// Draw a filled circle
	ctx.beginPath();
	ctx.arc(x, y, size/3, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();


	var dot = {
		x: x, 
		y: y, 
		r: r, 
		g: g, 
		b: b, 
		a: a
	};
	canvasPointList.push(dot);
} 

// Draws a line between two X and Y coordinates on the supplied canvas name
// Parameters are: A canvas context, the x1 position, the y1 position, x2, y2, the size of the dot
function drawLine(ctx,x1,y1,x2,y2,size) {
	// Select a fill style
	ctx.strokeStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";

	// Draw a filled circle
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineWidth=size/3;
	ctx.lineTo(x2,y2);
	ctx.stroke();
} 
// Clear the canvas context using the canvas width and height
function clearCanvas(canvas,ctx) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Draw the grid for octaves
	drawHorizontalGrid(canvas, ctx, 5);
	canvasPointList = [];
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (arguments.length === 1) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}
function rainbow(p) {
	return HSVtoRGB(p/100.0*0.85, 1.0, 1.0);
}
function updateColour(){

	r = 255; g = 255; b = 255;
	return;

	if (document.getElementById("randomColour").checked){
		r = randomIntFromInterval(0, 255);
		g = randomIntFromInterval(0, 255);
		b = randomIntFromInterval(0, 255);
	}else if (document.getElementById("rainbowColour").checked){
		colour = rainbow(rainbowCounter);
		rainbowCounter += 1;
		if (rainbowCounter >= 100){
			rainbowCounter = 0;
		}
		r = colour.r; g = colour.g; b = colour.b;
	}else if (document.getElementById("customColour").checked){ 
		colour = hexToRgb(document.getElementById("pencolour").value);	
		r = colour.r; g = colour.g; b = colour.b;
	}
}
// Keep track of the mouse button being pressed and draw a dot at current location
function sketchpad_mouseDown() {
	mouseDown=1;
}

// Keep track of the mouse button being released
function sketchpad_mouseUp() {
	mouseDown=0;
	drawShit();
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function sketchpad_mouseMove(e) { 
	// Update the mouse co-ordinates when moved
	getMousePos(e);

	// Draw a dot if the mouse button is currently being pressed
	if (mouseDown==1) {
		drawShit();
	}
}

function drawShit(){
	sizeCursor = parseFloat(document.getElementById("pensize").value) * 2;
	a = document.getElementById("alpha").value;

	// Avoid doing anything when clicking outside the canvas
	if (mouseX < 20 || mouseX > canvas.width-10 || mouseY < 20 || mouseY > canvas.height-10){ 
		return;
	}

	// Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
	updateColour();
	drawDot(ctx, mouseX, mouseY, sizeCursor);
}

// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
	if (!e)
		var e = event;

	if (e.offsetX) {
		mouseX = e.offsetX;
		mouseY = e.offsetY;
	}
	else if (e.layerX) {
		mouseX = e.layerX;
		mouseY = e.layerY;
	}

}

function drawHorizontalGrid(canvas, ctx, octaveCount){
	r = 79
	g = 91
	b = 102
	a = 255
	
	for (var y = 4*canvas.height/88; y < canvas.height; y += canvas.height/88){
		var i = Math.round(y * 88 / canvas.height) + 4;
		if (i % 8 > 0 && i % 8 < 6)
			drawLine(ctx, 0, y, canvas.width, y, 5);
	}
}

function initSketchpad(){
	// Get the specific canvas element from the HTML document
	canvas = document.getElementById('sketchpad');

	// If the browser supports the canvas tag, get the 2d drawing context for this canvas
	if (canvas.getContext)
		ctx = canvas.getContext('2d');

	// Check that we have a valid context to draw on/with before adding event handlers
	if (ctx) {
		canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
		canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
		window.addEventListener('mouseup', sketchpad_mouseUp, false);
	}

	drawHorizontalGrid(canvas, ctx, 5)
}
