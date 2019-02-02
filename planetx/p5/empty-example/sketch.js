function setup() {
  createCanvas(500, 500);

  ellipse(250, 250, 50, 50);

}

function draw() {
  fill( random(0, 255) );
  ellipse(mouseX, mouseY, 20, 20);
}
