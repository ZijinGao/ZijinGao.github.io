class Cell {
	constructor(x, y, size){
		this.x = x;
		this.y = y;
		this.size = size;
		this.now = 3;
		this.soil = 0;//the overall condition of the cell
		this.tempSoil = this.soil;
		this.waste_nuclear = 0;
		this.tempWaste = this.waste_nuclear;
		this.nature_energy = 0;
		this.tempNature = this.nature_energy;
		this.water_sani = 0;
		this.tempWater = this.water_sani;
		this.nuclear = false;
		this.forest = false;
		this.water = false;
		this.hole = false;
	}
	update(left, right, up, down){
		if (this.water) {
			this.tempWater += WATER_SANI;
		}
		if (left && left.water_sani < this.water_sani) {
			this.tempWater -= WATER_SANI_FLOW;
			left.tempWater += WATER_SANI_FLOW;
		}
		if (right && right.water_sani < this.water_sani) {
			this.tempWater -= WATER_SANI_FLOW;
			right.tempWater += WATER_SANI_FLOW;
		}
		if (up && up.water_sani < this.water_sani) {
			this.tempWater -= WATER_SANI_FLOW;
			up.tempWater += WATER_SANI_FLOW;
		}
		if (down && down.water_sani < this.water_sani) {
			this.tempWater -= WATER_SANI_FLOW;
			down.tempWater += WATER_SANI_FLOW;
		}
		if (this.tempWater >0) {
			this.tempWater -= WATER_DRAIN;
		}
		//forest
		if (this.forest) {
			this.tempNature += FOREST_GREEN;
		}
		if (left && left.nature_energy < this.nature_energy) {
			this.tempNature -= FOREST_GREEN_FLOW;
			left.tempNature += FOREST_GREEN_FLOW;
		}
		if (right && right.nature_energy < this.nature_energy) {
			this.tempNature -= FOREST_GREEN_FLOW;
			right.tempNature += FOREST_GREEN_FLOW;
		}
		if (up && up.nature_energy < this.nature_energy) {
			this.tempNature -= FOREST_GREEN_FLOW;
			up.tempNature += FOREST_GREEN_FLOW;
		}
		if (down && down.nature_energy < this.nature_energy) {
			this.tempNature -= FOREST_GREEN_FLOW;
			down.tempNature += FOREST_GREEN_FLOW;
		}
		if (this.tempNature > 0) {
			this.tempNature -= FOREST_DRAIN;
		}
		//nuclear
		if (this.nuclear) {
			this.tempWaste += NUCLEAR_WASTE;
		}
		if (left && left.waste_nuclear < this.waste_nuclear) {
			this.tempWaste -= NUCLEAR_WASTE_FLOW;
			left.tempWaste += NUCLEAR_WASTE_FLOW;
		}
		if (right && right.waste_nuclear < this.waste_nuclear) {
			this.tempWaste -= NUCLEAR_WASTE_FLOW;
			right.tempWaste += NUCLEAR_WASTE_FLOW;
		}
		if (up && up.waste_nuclear < this.waste_nuclear) {
			this.tempWaste -= NUCLEAR_WASTE_FLOW;
			up.tempWaste += NUCLEAR_WASTE_FLOW;
		}
		if (down && down.waste_nuclear < this.waste_nuclear) {
			this.tempWaste -= NUCLEAR_WASTE_FLOW;
			down.tempWaste += NUCLEAR_WASTE_FLOW;
		}
		if(this.waste_nuclear > 0){
			this.tempWaste -= WASTE_DRAIN;
		}
		if (! this.nuclear && this.waste_nuclear > HOLE_THRESH) {
			this.hole = true;
			if (this.forest) {
				this.forest = false;
			}
			if (this.water) {
				this.water = false;
			}
			this.now = 0;
		}
	}
	commitUpdate(){
		this.waste_nuclear = constrain(this.tempWaste, 0, 100);//for mapping later
		this.nature_energy = constrain(this.tempNature, 0, 100);
		this.water_sani = constrain(this.tempWater, 0,100);
	}
	display(){
		noStroke();
		var array = [this.waste_nuclear, this.nature_energy, this.water_sani];
		var factor = 0;
		var index;//0 is nuclear pollution, 1 is forest nature, 2 is water
		for (var i = 0; i <= array.length-1; i++){
			if (array[i] > factor) {	
				factor = array[i];
				index = i;
			}
		}
		colorMode(HSB, 360, 100, 100);
		if (index === 0) {//nuclear area
			fill(24,100,map(factor, 0,70,0,100));
			rect(this.x, this.y, this.size, this.size);
			this.now = 0;
		}
		else if (index === 1) {//forest area
			fill(118,74,map(factor, 0,70,0,60));
			rect(this.x, this.y, this.size, this.size);
			this.now = 1;
		}
		else if (index === 2) {//water area
			fill(190,86,map(factor, 0,70,0,90));
			rect(this.x, this.y, this.size, this.size);
			this.now = 2;
		}else{
			colorMode(RGB,255);
			fill(0);
			rect(this.x, this.y, this.size, this.size);
		}
		if (this.nuclear) {//the nuclear station
			colorMode(HSB, 360, 100, 100);
			fill(53,100,100);
			rect(this.x, this.y, this.size, this.size);
		}
		if (this.forest) {
			colorMode(HSB, 360, 100, 100);
			fill(107,100,100);
			rect(this.x, this.y, this.size, this.size);
		}
		if (this.water) {
			colorMode(HSB, 360, 100, 100);
			fill(214,100,100);
			rect(this.x, this.y, this.size, this.size);
		}
		if (this.hole) { //when it is hole
			strokeWeight(3);
			colorMode(RGB, 255,255);
			stroke(255,230,0);
			line(this.x, this.y, this.x+this.size, this.y+this.size); // red X on the cell
			line(this.x+this.size, this.y, this.x, this.y+this.size);
			strokeWeight(0);
		}
	}
}

function setNuclear(){//nuclear
	state = 0;
	document.getElementById("nuclear").style.background = "#ffe100";
	document.getElementById("nuclear").style.color = "white";
	document.getElementById("forest").style.background = "white";
	document.getElementById("forest").style.color = "black";
	document.getElementById("water").style.background = "white";
	document.getElementById("water").style.color = "black";
}
function setForest(){//forest
	state = 1;
	document.getElementById("forest").style.background = "#37ff00";
	document.getElementById("forest").style.color = "white";
	document.getElementById("water").style.background = "white";
	document.getElementById("water").style.color = "black";
	document.getElementById("nuclear").style.background = "white";
	document.getElementById("nuclear").style.color = "black";
}
function setWater(){//water
	state = 2;
	document.getElementById("water").style.background = "#006fff";
	document.getElementById("water").style.color = "white";
	document.getElementById("forest").style.background = "white";
	document.getElementById("forest").style.color = "black";
	document.getElementById("nuclear").style.background = "white";
	document.getElementById("nuclear").style.color = "black";
}