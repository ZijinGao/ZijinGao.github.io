class Figure{
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.prevX = this.x;
		this.alive = true;
		this.life = 1;
		this.bornTime = millisCount;
		this.yOff = random(1000,2000);
		this.xOff = random(0,1000);
		this.ind = int(random(0,images.length));
		this.picLeft = images[this.ind][0];
		this.picRight = images[this.ind][1];
	}
	getInfluence(cell){
		if (cell.now === 0) {//is a nuclear cell
			if (cell.waste_nuclear >= 60) {
				//jump and escape
				this.x += random([-2,2]);
				this.y += random([-2,2]);
				this.life -= map(cell.waste_nuclear, 20,100, 0.01, 0.07);
			}
			else if (cell.waste_nuclear >=20){
				this.life -= map(cell.waste_nuclear, 20,100, 0.01, 0.07);
			}
		}
		else if (cell.now === 1) {//is a forest cell
			if (cell.nature_energy >= 20) {
				this.life += map(cell.nature_energy, 0,100, 0.02, 0.05);
			}
		}
		else if (cell.now === 2) {//is a water cell
			if (cell.water_sani >= 20) {
				this.life += map(cell.water_sani, 0,100, 0.02, 0.05);
			}
		}
		this.life = constrain(this.life, 0,1);
	}
	moveDetectDisplay(){
		var yDerta = map(noise(this.xOff),0,1,-2,2);
		var xDerta = map(noise(this.xOff), 0,1,-10,10);

		this.life -= 0.003;
		this.y += yDerta;
		this.x += xDerta;
		this.xOff += 0.1;
		this.yOff += 0.01;
		if (this.x <0) {
			this.x = width;
		}
		else if (this.x >width) {
			this.x = 0;
		}
		if (this.y < 0) {
			this.y = height;
		}
		else if (this.y > height) {
			this.y = 0;
		}
		if (xDerta >= 0) {
			image(this.picLeft, this.x, this.y);
		}
		else{
			image(this.picRight, this.x, this.y);
		}

		colorMode(RGB,255,255,255);
		fill(255,0,0);
		rect(this.x-cell_size*3/2, this.y-49.5,cell_size*3*this.life, 9.5);
		noFill();
		stroke(255,255,255);
		strokeWeight(1);
		rect(this.x-cell_size*3/2, this.y-50, cell_size*3, 10);

	}
	detectDead(){
		if (this.life <= 0.1) {//too much nuclear radiation, dead
			this.alive = false;
			console.log("dead");
		}
	}
}