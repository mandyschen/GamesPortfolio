let WIDTH = 1000, HEIGHT = 500;

var x = 200, y = HEIGHT - 50, d = 40;
var speed = 2;

let bg;

function setup() {
  canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('sketch-holder');
  bg = loadImage("images/large_images/bg.png");
  bg.resize(WIDTH, HEIGHT);
}

function draw() {
  background(bg);
  keyPressed();
  ellipse(x, y, d, d)
}

function keyPressed() {
  switch (keyCode) {
    case 65: // a
    case 37: // left
      x -= speed;
      break;
    case 68: //d
    case 39: // right
      x += speed;
      break;
  }
}