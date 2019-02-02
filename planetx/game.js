var cnv;
var figure1left, figure1right, figure2left, figure2right, figure3left, figure3right, figure4left, figure4right, figure5left, figure5right;
var typeSound;
var endSound;
var bgm;
var sigh;
var giggle;
var locator;
var images = [];//array of images
var figures = [];//array of Figure class objects
var humanMode = false;
var limit1 = 500;
var limit2 = 150;
var population = 0;
var born = 0;
var death = 0;
var millisCount = 0;
var lastState = 0;
var phase =0; // phase 0 introduction; phase 1 play; phase 2 end;

var wordIndex = 0;
var word = "Thank you for bringing life to Planet X ... \n\nThe planet was back to life for ! seconds, during which @ lives was born.                               \n\nYou are very welcome to try for another time, just one thing to remember:                                       \n\nBalance is always the essence.\n\n\n                                                                 Captain Z,\n\n\n                                                                 2049";
var splitWord = [];
var toDisplay = "";
var first = true;
var millisCountforTiming;
var totalTime;

var wordIndex0 = 0;
var word0 = "Hi there, welcome to the land of Planet X.               \n\nThere has been no life living here ever since last interstellar radiation war, \nthat is 49,600,000 years from now.            \nRecently there are some resources and energy found on it, \nand we are inviting you to help us utilize the resources and energy, \nand eventually create human once again to the planet.                               \nThe creatures are very fragile because of the radioactive relics left from the war, \nso you need to be extremely cautious when distributing the recources.                                 \n\nYou may plant TREEs, set WATER area or plant ATOMIC PILES onto the surface of the planet. \nThe piles generate the necessary nuclear power as well as harmful nuclear waste, \nthe trees become forest and accumulate natrual energy, \nwhile water brings up the sanitation level of the environment.                      \n\nOnly after reaching a point of balance will the human be re-created.             \n\n\n                                                                 Good luck! \n                                                                 Captain Z \n\nP.S.: Press the right key twice to proceed."
var splitWord0 = [];
var toDisplay0 = "";
var first0 = true;
var rightTimes = 0;

var y,x;
var cells = [];
var cell_size = 25; // x 48, y 20
var cell_num_x = 48;
var cell_num_y = 24;// 1152 in total
var total_space;
var state = 0;

var compass_r = 90;
var nuclear_count = 0;
var nuclear_count_add = 0;
var forest_count = 0;
var water_count = 0;

//nuclear station: positive
var Nuclear_energy = 0;
var Nature_energy = 0; 
var Sanitation = 0;
var Nuclear_waste = 0;

//nuclear station: negative
var NUCLEAR_WASTE = 10;//total
var NUCLEAR_WASTE_FLOW = 2.5;
var WASTE_DRAIN = 0.5;
var HOLE_THRESH = 80;

//nature
var FOREST_GREEN = 8;
var FOREST_GREEN_FLOW = 2;
var FOREST_DRAIN = 0.5;

//water
var WATER_SANI = 8;
var WATER_SANI_FLOW = 2;
var WATER_DRAIN = 0.5;

function preload(){
	figure1left = loadImage( "assets/figure1left.png");
	figure1right = loadImage("assets/figure1right.png");
	figure2left = loadImage( "assets/figure2left.png");
	figure2right = loadImage("assets/figure2right.png");
	figure3left = loadImage( "assets/figure3left.png");
	figure3right = loadImage("assets/figure3right.png");
	figure4left = loadImage( "assets/figure4left.png");
	figure4right = loadImage("assets/figure4right.png");
	figure5left = loadImage( "assets/figure5left.png");
	figure5right = loadImage("assets/figure5right.png");
	locator = loadImage("assets/locator.png");
	typeSound = loadSound("assets/typewriter1.mp3");
	endSound = loadSound("assets/ending1.mp3");
	bgm = loadSound("assets/bgm1.mp3");
	sigh = loadSound("assets/sigh1.mp3");
	giggle = loadSound("assets/giggle1.mp3")
}

function setup(){
	cnv = createCanvas(1200, 600);//stroke: 1
	cnv.parent("p5con");
	relocateCanvas();
	frameRate(20);
	images = [[figure1left, figure1right], 
			  [figure2left, figure2right], 
			  [figure3left, figure3right], 
			  [figure4left, figure4right], 
			  [figure5left, figure5right]];
	imageMode(CENTER);
	noiseDetail(24);
	total_space = cell_num_x * cell_num_y;
	for (var x = 0; x < cell_num_x; x++){//2 dimensional array
		cells.push([]);
		for(var y = 0; y < cell_num_y; y++){
			cells[x].push(new Cell(x*cell_size, y*cell_size, cell_size));
		}
	}
	console.log("width"+width);
	console.log("height"+height);
	splitWord = split(word,"");
	splitWord0 = split(word0,"");
	typeSound.play();
}
function mousePressed(){
	var cx = int(mouseX/cell_size);
	var cy = int(mouseY/cell_size);
	console.log("x: " + cx);
	console.log("y: " + cy);
	if ( !(cx >=39 && cy <= 8) ) {
		if (state === 0 && cells[cx][cy].forest === false && cells[cx][cy].water === false && cells[cx][cy].hole === false) {
			if (!cells[cx][cy].nuclear) {
				Nuclear_energy += 10;
				nuclear_count += 1;
				nuclear_count_add += 1;
			}
			else{
				Nuclear_energy -= 10;
				Nuclear_waste -= 8;
				nuclear_count-=1;
			}
			cells[cx][cy].nuclear = !cells[cx][cy].nuclear;
		}
		if (state ===1 && cells[cx][cy].nuclear === false && cells[cx][cy].water === false) {
			if (!cells[cx][cy].forest) {
				Nature_energy += 8;
				Nuclear_energy -= 1;
				forest_count += 1;
			}
			else{
				Nature_energy -= 8;
				forest_count -= 1;
			}
			cells[cx][cy].forest = !cells[cx][cy].forest;
		} 
		if (state ===2 && cells[cx][cy].forest === false && cells[cx][cy].nuclear === false) {
			if (!cells[cx][cy].water) {
				Sanitation += 5;
				Nuclear_energy -= 1;
				water_count += 1;
			}
			else{
				Sanitation -= 5;
				water_count -= 1;
			}
			cells[cx][cy].water = !cells[cx][cy].water;
		}
	}
}

function draw(){
	millisCountforTiming = millis();
	if (phase === 0) {//instruction mode
		displayStart();
	}
	else if (phase === 1) {//play mode
		if (!bgm.isPlaying()) {
			bgm.play();
			bgm.loop();
		}
		Nature_energy = constrain(Nature_energy, 0,limit1);
		Nuclear_energy = constrain(Nuclear_energy, 0,limit1);
		Sanitation = constrain(Sanitation, 0,limit1);
		Nuclear_waste = constrain(Nuclear_waste,0,limit2);
		for(var x = 0; x<cell_num_x; x++){
			for(var y = 0; y<cell_num_y; y++){//for every cell
				var left, right, up, down;
				if (x>0) {
					left = cells[x-1][y];
				}
				if(x<cell_num_x-1){
					right = cells[x+1][y];
				}
				if(y>0){
					up = cells[x][y-1];
				}if (y<cell_num_y-1) {
					down = cells[x][y+1];
				}
				cells[x][y].update(left,right,up,down);
			} 
		}//update neighbours
		for (var x=0; x<cell_num_x; x++){
			for(var y=0; y<cell_num_y; y++){
				cells[x][y].commitUpdate();
				cells[x][y].display();
			}
		}//display every cell
		if (frameCount  % 50 === 0) {
			Nature_energy += forest_count*0.3;
			Nature_energy = constrain(Nature_energy,0,limit1);
		}
		if (frameCount % 75 === 0) {
			Nuclear_energy += nuclear_count*0.4;
			Nuclear_energy = constrain(Nuclear_energy,0,limit1);
		}
		if (frameCount % 55 === 0) {
			Sanitation += water_count*0.2;
			Sanitation = constrain(Sanitation,0,limit1);
		}
		if (frameCount % 10 ===0) {
			// Nuclear_waste = (frameCount/100)**2 * nuclear_count_add * 0.002;
			Nuclear_waste += (frameCount/1000)**2 * nuclear_count * 0.002;
			Nuclear_waste = constrain(Nuclear_waste,0,limit2);
		}
		if (frameCount % 60 === 0) {
			if (Nuclear_energy >= 1) {
				Nuclear_energy -= 1;
			}
			Nuclear_energy = constrain(Nuclear_energy,0,limit1);
		}
		drawCompass();
		displayLocator();
		displayFigure();
		textSize(15);
		fill(255,255,255);
		textFont("Courier New");
		stroke(255,255,255);
		strokeWeight(1);
		text("Born: " + born, 100,60);
		text("Death: " + death, 100,80);
		text("Population: "+population, 100,100);
		//
		if (  ( (born != 0) && (born === death) && (Nature_energy < limit1*2/5 || Nuclear_energy < limit1*1/5 || Sanitation < limit1*1/5 || Nuclear_waste > limit2*4/5) )  ) {
			phase = 2; //end
			totalTime = millisCountforTiming;
		}
	}
	else if (phase === 2) {
		setTimeout(displayEnding,3000);
		if (!endSound.isPlaying()) {
			// setTimeout(playEnding,3000); 
			playEnding();
		}
		if (bgm.isPlaying()) {
			bgm.stop();
		}
	}
}
function keyPressed(){
	console.log("pressed");
	if (phase === 0 && keyCode === RIGHT_ARROW) {
		rightTimes += 1;
		if (rightTimes === 1) {
			strokeWeight(1);
			stroke(255,255,255);
			textSize(20);
			colorMode(RGB,255,255,255);
			textFont("Courier New");
			fill(255,255,255);

			text(word0,50,50);
			// console.log("1time");
		}
		if (rightTimes === 2) {
			phase = 1;
			typeSound.stop();
		}
		console.log(phase);
	}
	if (phase === 1 && keyCode === LEFT_ARROW) {
		phase = 2;	
		totalTime = millisCountforTiming;
		if (!endSound.isPlaying()) {
			// setTimeout(playEnding,3000); 
			playEnding();
		}
	}
}
function playEnding(){
	endSound.play();
}
function displayLocator(){
	if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
		var mx = int(mouseX/cell_size);
		var my = int(mouseY/cell_size);
		if ( !(cells[mx][my].nuclear) && !(cells[mx][my].water) && !(cells[mx][my].forest) && !cells[mx][my].hole) {
			if (!(mx >=39 && my <= 8)) {
				image(locator, mx*cell_size + cell_size/2,my*cell_size + cell_size/2);
			}
		}
	}
}
function displayFigure(){
	if (Nature_energy >= limit1*2/5 && Nuclear_energy >= limit1*1/5 && Sanitation >= limit1*1/5 && Nuclear_waste <= limit2*4/5) {
	// if (Nature_energy >= 0 && Nuclear_energy >= 0 && Sanitation >= 0 && Nuclear_waste <= limit2) {
		millisCount = millis();
		if (millisCount - lastState >=10000) {
			var f = new Figure(random(0,width), random(0,height));
			figures.push(f);
			if (!giggle.isPlaying()) {
				giggle.play();
			}
			population += 1;
			born += 1;
			lastState = millisCount;
		}
	}
	for (var i = 0; i < figures.length; i++){
		figures[i].detectDead();

		var tempX = int(figures[i].x/cell_size);
		var tempY = int(figures[i].y/cell_size);

		if (tempX > 4  && tempX < cell_num_x-4 && tempY > 4 && tempY < cell_num_y-4) {
			for(var x = tempX-4; x <= tempX + 4; x++ ){
				for(var y = tempY-4; y <= tempY + 4; y++ ){
					figures[i].getInfluence(cells[x][y]);
				}
			}
		}
		
		figures[i].moveDetectDisplay();
		if (figures[i].alive === false) {
			figures.splice(i,1);
			population -= 1;
			death += 1;
			if (!sigh.isPlaying()) {
				sigh.play();
			}
		}
	}
}
function drawCompass(){
	colorMode(RGB, 255);
	fill(255);
	push();
	translate(width-110, 110);
	colorMode(RGB, 255);
	fill(0);
	// ellipse(0,0,compass_r*2,compass_r*2);
	rectMode(CENTER);
	rect(0,0,compass_r*2+40,compass_r*2+40);

	// beginShape();
	//if (Nature_energy >= limit1*2/5 && Nuclear_energy >= limit1*1/5 && Sanitation >= limit1*1/5 && Nuclear_waste <= limit2*4/5) {
	colorMode(RGB,255,255,255);
	fill(0,255,0);
	//sanitation
	ellipse(cos(PI/4)*map(limit1*1/5,0,limit1,0,compass_r),  sin(PI/4)* map(limit1*1/5,0,limit1,0,compass_r), 5,5);
	//nature energy
	ellipse(cos(PI/4)* map(limit1*2/5,0,limit1,0,compass_r), -sin(PI/4)* map(limit1*2/5,0,limit1,0,compass_r), 5,5);
	//nuclear energy
	ellipse(-cos(PI/4)* map(limit1*1/5,0,limit1,0,compass_r),-sin(PI/4)* map(limit1*1/5,0,limit1,0,compass_r), 5,5);
	//waste
	fill(255,0,0);//red
	ellipse(-cos(PI/4)*map(limit2*4/5,0,limit2,0,compass_r),  sin(PI/4)* map(limit2*4/5,0,limit2,0,compass_r), 5,5);
	// endShape(CLOSE);

	//drawing shape
	noFill();
	strokeWeight(2);
	stroke(255,0,255);
	beginShape();
	vertex(cos(PI/4)*map(Sanitation,0,limit1,0,compass_r), sin(PI/4) *map(Sanitation,0,limit1,0,compass_r));//sanitation
	vertex(-cos(PI/4)*map(Nuclear_waste,0,limit2,0,compass_r), sin(PI/4) *map(Nuclear_waste,0,limit2,0,compass_r));//waste
	vertex(-cos(PI/4)*map(Nuclear_energy,0,limit1,0,compass_r), -sin(PI/4) *map(Nuclear_energy,0,limit1,0,compass_r));//nuclear energy
	vertex(cos(PI/4)*map(Nature_energy,0,limit1,0,compass_r), -sin(PI/4) *map(Nature_energy,0,limit1,0,compass_r));//nature energy
	endShape(CLOSE);
	//values
	stroke(255,255,255);
	strokeWeight(1);
	textSize(15);
	text(floor(Sanitation),      cos(PI/4)*map(Sanitation,0,limit1,0,compass_r),      sin(PI/4) *map(Sanitation,0,limit1,0,compass_r));
	text(floor(Nature_energy),   cos(PI/4)*map(Nature_energy,0,limit1,0,compass_r),  -sin(PI/4) *map(Nature_energy,0,limit1,0,compass_r));
	text(floor(Nuclear_energy), -cos(PI/4)*map(Nuclear_energy,0,limit1,0,compass_r), -sin(PI/4) *map(Nuclear_energy,0,limit1,0,compass_r));
	text(floor(Nuclear_waste),  -cos(PI/4)*map(Nuclear_waste,0,limit2,0,compass_r),   sin(PI/4) *map(Nuclear_waste,0,limit2,0,compass_r));
	//legends
	textSize(15);
	fill(255,255,255);
	textFont("Courier New");
	text("Sanitation",        cos(PI/4) * 120-70,  sin(PI/4) * 120);
	text("Nature \nEnergy",   cos(PI/4) * 120-45, -sin(PI/4) * 120-10);
	text("Nuclear \nEnergy", -cos(PI/4) * 120-50, -sin(PI/4) * 120-10);
	text("Nuclear \nWaste",  -cos(PI/4) * 120-50,  sin(PI/4) * 120);

	stroke(255,0,255,85);
	// strokeWeight(2);
	line(cos(PI/4) * 120, sin(PI/4) * 120, -cos(PI/4) * 120, -sin(PI/4) * 120);//240
	line(cos(PI/4) * 120, -sin(PI/4) * 120,-cos(PI/4) * 120, sin(PI/4) * 120);
	pop();
}
function displayStart(){
	background(0);
	strokeWeight(1);
	stroke(255,255,255);
	textSize(20);
	colorMode(RGB,255,255,255);
	textFont("Courier New");
	fill(255,255,255);
	if (first0 === true) {
		toDisplay0 = toDisplay0 + splitWord0[wordIndex0];
		text(toDisplay0,50,50);
	}
	if (first0 === false) {
		text(toDisplay0,50,50);
	}
	wordIndex0 += 1;
	if (wordIndex0 >= splitWord0.length) {
		first0 = false;
	}
}
function displayEnding(){
	background(0);
	textSize(22);
	if (first === true) {
		if (splitWord[wordIndex] === "!") {
			toDisplay += totalTime/1000;
		}
		else if (splitWord[wordIndex] === "@") {
			toDisplay += born;
		}
		else{
			toDisplay = toDisplay + splitWord[wordIndex];
		}
		text(toDisplay, 100,100);
	}
	if (first === false) {
		text(toDisplay,100,100);
	}
	wordIndex += 1;
	if (wordIndex >= splitWord.length) {
		first = false;
	}
}
function startOver(){
	location.reload();
}
function relocateCanvas(){
	y = (windowHeight - height)/2;
	x = 0;
	cnv.position(x,y);
}
function windowResized(){
	relocateCanvas();
}