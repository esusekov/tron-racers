function Bike(name,wayImage) {
	this.name = name,
    this.x,
	this.y,
	this.pointSpriteX,
	this.pointSpriteY,
	this.course,
	this.image = new Image(),
	this.image.src = wayImage,
	this.width  = 15,
	this.height = 15,
	this.currentFrame,
	this.coordinatesXforBot,
	this.coordinatesYforBot;
}

Bike.prototype.setCoordinates = function() {
	switch(this.course) {
		case  1: this.stepX =  5; this.stepY =  0; break; 
		case -1: this.stepX = -5; this.stepY =  0; break; 
		case  2: this.stepX =  0; this.stepY = -5; break; 
		case -2: this.stepX =  0; this.stepY =  5; break; 
	}
	this.x += this.stepX;
	this.y += this.stepY;
}

Bike.prototype.setPointForSprite = function() {
	//alert(this.x + " " + this.y);
	switch(this.course) {
		case  1: this.pointSpriteX =  this.x - 15; this.pointSpriteY = this.y - 10; break; 
		case -1: this.pointSpriteX =  this.x - 5; this.pointSpriteY = this.y - 10; break; 
		case  2: this.pointSpriteX =  this.x - 10; this.pointSpriteY = this.y - 5; break;  
		case -2: this.pointSpriteX =  this.x - 10; this.pointSpriteY = this.y - 15; break; 
	}
}

Bike.prototype.setCenter = function() {
	/*var centerX = 10;
	centerY = 10;
	switch(this.course) {
		case  1: case -2: centerX = this.x + 10; centerY = this.y + 10; break; 
		case -1: centerX = this.x + 10; centerY = this.y + 10; break; 
		case  2: centerX = this.x + 10; centerY = this.y + 10; break;  
	}*/
	this.i = (this.x / 5) - 1;
	this.j = (this.y / 5) - 1;
}

Bike.prototype.calculateCoordinatesForBot = function() {
	switch(this.course) {
		case  1: this.stepX =  5; this.stepY =  0; break; 
		case -1: this.stepX = -5; this.stepY =  0; break; 
		case  2: this.stepX =  0; this.stepY = -5; break; 
		case -2: this.stepX =  0; this.stepY =  5; break; 
	}
	this.coordinatesXforBot =  ((this.x + this.stepX) / 5) - 1;
	this.coordinatesYforBot =  ((this.y + this.stepY) / 5) - 1;	
}

Bike.prototype.checkCollision = function() {
	if (field[this.i][this.j] <= -10) {
		return true;
	}
	/*switch (this.course) {
		case  1: if (field[this.i][this.j] <= -10) { 
			//alert(bike.name + " lose!"); 
			//location.reload();
			return true;
		} break;
		case  2: if (field[this.i][this.j] <= -10) { 
			//alert(bike.name + " lose!"); 
			//location.reload(); 
			return true;
		} break;
		case -1: if (field[this.i][this.j] <= -10) {
			//alert(bike.name + " lose!"); 
			//location.reload();
			return true; 
		} break;
		case -2: if (field[this.i][this.j] <= -10) { 
			//alert(bike.name + " lose!"); 
			//location.reload();
			return true; 
		} break;
	}*/
	return false;
}

Bike.prototype.setRandomValue = function() {
	this.x = 5 * (Math.floor(Math.random() * (101 - 61 + 1)) + 61);
	this.y = 5 * (Math.floor(Math.random() * 101) + 1);
	this.course = -1;
	this.currentFrame = 0; 
}

/*************************************/

function Bot(name, wayImage) {
	this.name = name,
	this.x,
	this.y,
	this.image = new Image(),
	this.image.src = wayImage,
	this.width  = 15,
	this.height = 15,
	this.extraX,
	this.extraX,
	this.currentFrame,
	this.course,
	this.pointSpriteX,
	this.pointSpriteY,
	this.px = [],
	this.py = [];
}

Bot.prototype.setTrackChase = function(ax, ay, bx, by) {
	try {
		var dx = [1, 0, -1, 0];
		var dy = [0, 1, 0, -1];
		var d, x, y, k;
		var stop;
		d = 0;
		field[ax][ay] = 0;

		do {
			stop = true;
			for (y = 1; y < N; ++y) {
				for (x = 1; x < N; ++x) {
					if (field[x][y] == d) {
						for (k = 0; k < 4; ++k) {
							if (field[x + dx[k]][y + dy[k]] == -2) {
								stop = false;
								field[x + dx[k]][y + dy[k]] = d + 1;
							}
						}
					}
				}
			}
			d++;
		} while (!stop && field[bx][by] == -2);

		if (field[bx][by] == -2) {
			field[ax][ay] = -10;
		 	return false;
		}

		x = bx;
		y = by;
		d = field[bx][by];

		while (d > 0) {
			this.px[d] = x;
			this.py[d] = y;
			d--;
			for (k = 0; k < 4; ++k) {
				if (field[x + dx[k]][y + dy[k]] == d) {
					x = x + dx[k];
					y = y + dy[k];
					break;
				} 
			}
		}

		this.px[0] = ax;
		this.py[0] = ay;
		field[ax][ay] = -10;
		if (this.px.length == 1 || this.py.length == 1) {
			return false;
		}
		this.extraX = this.x;
		this.extraY = this.y;
		this.x = this.px[1];
		this.y = this.py[1];
		return true;
	}
	catch(e) {
		//field[ax][ay] = -10;
		return false;
	}
}

Bot.prototype.setTrackSurvival = function() {
	this.cleaningWay(field, N);
	/*var i = 0;
	if (field[this.x + 1][this.y] == -2) {
		this.px.push(this.x + 1);
		this.py.push(this.y);
		i++;
	}
	if (field[this.x][this.y + 1] == -2) {
		this.px.push(this.x);
		this.py.push(this.y + 1);
	}
	if (field[this.x - 1][this.y] == -2) {
		this.px.push(this.x - 1);
		this.py.push(this.y);
	}
	if (field[this.x][this.y - 1] == -2) {
		this.px.push(this.x);
		this.py.push(this.y - 1);
	}
	
	if (this.px.length != 0) {
		var i = Math.floor(Math.random() * this.px.length);
		this.x = this.px[i];
		this.y = this.py[i];
		return true;
	}

	return false;*/
	this.extraX = this.x;
	this.extraY = this.y;

	var i  = [0, 0 , 0 , 0]; 
	var Max = 0;
	var jMax = -1; 
	var a = this.x,
		b = this.y;
	while (field[++a][this.y] == -2) {
		i[0]++;
	}
	while (field[this.x][++b] == -2) {
		i[1]++;
	}
	a = this.x;
	b = this.y;
	while (field[--a][this.y] == -2) {
		i[2]++;
	}
	while (field[this.x][--b] == -2) {
		i[3]++;
	}
	for (var j = 0; j < i.length; ++j) {
		if (i[j] > Max) {
			jMax = j;
			Max = i[j];
		}
	}
	switch(jMax) {
		case -1: this.x += 1; return false;
		case 0: this.x += 1; return true;
		case 1: this.y += 1; return true;
		case 2: this.x -= 1; return true;
		case 3: this.y -= 1; return true;
	}
}

Bot.prototype.cleaningWay = function(field, N) {
	for (var i = 0; i < N; i++){
		for (var j = 0; j < N; j++){
			if (field[i][j] > -2) {
				field[i][j] = -2;
			}
		}	
	}	
	this.px = [];
	this.py = [];
}

Bot.prototype.checkCollision = function() {
	if (field[this.x][this.y] <= -10) { 
			//alert(bike.name + " lose!"); 
			//location.reload();
		return true;
	}
	return false;	
}

Bot.prototype.setRandomValue = function() {
	this.x = Math.floor(Math.random() * (41 - 1)) + 2;
	this.y = Math.floor(Math.random() * 100) + 1;
	this.px = [];
	this.py = [];
}

Bot.prototype.setPointForSprite = function() {
	
	if (this.x > this.extraX) {
		this.course = 1;
		this.currentFrame = 1;
	}
	else if (this.x < this.extraX) {
		this.course = -1;
		this.currentFrame = 0;
	}
	else if (this.y > this.extraY) {
		this.course = -2;
		this.currentFrame = 3;
	}
	else if (this.y < this.extraY) {
		this.course = 2;
		this.currentFrame = 2;
	}

	switch(this.course) {
		case  1: this.pointSpriteX =  this.x * 5 - 10; this.pointSpriteY = this.y * 5 - 5; break; 
		case -1: this.pointSpriteX =  this.x * 5;      this.pointSpriteY = this.y * 5 - 5; break; 
		case  2: this.pointSpriteX =  this.x * 5 - 5;  this.pointSpriteY = this.y * 5 - 5; break;  
		case -2: this.pointSpriteX =  this.x * 5 - 5;  this.pointSpriteY = this.y * 5 - 5; break; 
	}
}

/*************************************/

var draw = function() {
	count++;
	var endingFlag;
	var indicatorEnd = false;
	drawFeild();
	playerBike.setCoordinates();
	playerBike.setCenter();
	playerBike.calculateCoordinatesForBot();
	botBike.cleaningWay(field, N);

	if (botBike.setTrackChase(botBike.x, botBike.y, playerBike.coordinatesXforBot, playerBike.coordinatesYforBot)){ /**/ }
	else {
		botBike.setTrackSurvival();
	}

	if ((playerBike.checkCollision() && botBike.checkCollision()) ||
		(playerBike.i == botBike.x && playerBike.j == botBike.y)) {
		redBikeScore.innerHTML = (+redBikeScore.innerHTML) + 1;
		blueBikeScore.innerHTML = (+blueBikeScore.innerHTML) + 1;
		result.innerHTML = "DRAW";
		indicatorEnd = true;
		endingFlag = -1;
	}
	else if (playerBike.checkCollision()) {
		redBikeScore.innerHTML = (+redBikeScore.innerHTML) + 1;
		result.innerHTML = "RedBike WIN";
		indicatorEnd = true;
		endingFlag = -1;
	}
	else if (botBike.checkCollision()) {
		blueBikeScore.innerHTML = (+blueBikeScore.innerHTML) + 1;
		result.innerHTML = "BlueBike WIN";
		indicatorEnd = true;
		endingFlag = 1;
	}

	if (!indicatorEnd) {
		drawBike();
	}
	else {
		drawBike();
		indicatorEnd = false;
		playerBike.setRandomValue();
		botBike.setRandomValue();
		clearField(field, N);
		stop(endingFlag);
		return;
	}
	//field[bikeBlue.i + 1][bikeBlue.j] = -20;//плохое решение (проблема с синхронизацией байков)
}

function drawBike() {
	field[playerBike.i][playerBike.j] = -20;
	
	field[botBike.x][botBike.y] = -10;

	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			if (field[i][j] == -20) {
				ctx.fillStyle="#27408B";
				ctx.fillRect(i * 5, j * 5, 5, 5);
			} else if (field[i][j] == -10) {
				ctx.fillStyle="#CD0000";
				ctx.fillRect(i * 5, j * 5, 5, 5)
			}
		}
	}
	
	playerBike.setPointForSprite();
	botBike.setPointForSprite();
	ctx.drawImage(playerBike.image, 0, playerBike.height * playerBike.currentFrame, playerBike.width, playerBike.height, playerBike.pointSpriteX, playerBike.pointSpriteY, playerBike.width, playerBike.height);	
	ctx.drawImage(botBike.image, 0, botBike.height * botBike.currentFrame, botBike.width, botBike.height, botBike.pointSpriteX, botBike.pointSpriteY, botBike.width, botBike.height);	
}

function drawFeild() {
	ctx.drawImage(fieldImage, 0, 0, 510, 510);
	for (var i = 0; i < N; ++i) {
		ctx.fillStyle="#303030";
		ctx.fillRect(0, i * 5, 5, 5);
		ctx.fillRect(i * 5, 0, 5, 5);
		ctx.fillRect(505,i * 5, 5, 5);
		ctx.fillRect(i * 5, 505, 5, 5);
	}
}


function courseBike(evt) {
	evt = (evt) ? evt : window.event;
	var code = (evt.charCode) ? evt.charCode : evt.keyCode;
	switch(code) {
		case 37:{
			switch(playerBike.course) {
				case  1: playerBike.course =  2; playerBike.currentFrame = 2; break;
				case  2: playerBike.course = -1; playerBike.currentFrame = 0; break;
				case -1: playerBike.course = -2; playerBike.currentFrame = 3; break;
				case -2: playerBike.course =  1; playerBike.currentFrame = 1; break;
			}				      		
			break;
		}//влево
		case 39:{
			switch(playerBike.course) {
				case  1: playerBike.course = -2; playerBike.currentFrame = 3; break;
				case  2: playerBike.course =  1; playerBike.currentFrame = 1; break;
				case -1: playerBike.course =  2; playerBike.currentFrame = 2; break;
				case -2: playerBike.course = -1; playerBike.currentFrame = 0; break;
			}
			break;
		}//вправо
	}
}

function clearField(field, N) {
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			if (i == 0 || j == 0 || i == (N -1) || j == (N - 1)) {
				field[i][j] = -30;
			}
			else {
				field[i][j] = -2;
			}
		}
	}
}	

function stop(flag) {
	document.onkeyup = null;
	button.value = "START";
	button.setAttribute('onClick', 'start()');
	clearTimeout(refreshIntervalId);
	if (flag == 1) {
		var gv = document.getElementById("gameview");
		gv.style.display = "none";
		var gov = document.getElementById("gameOverview");
		gov.style.display = "";
		var newScore = document.getElementById("newScore");
		newScore.innerHTML = "" + (5000 - 2*count);
		count = 0;
		draw();
	}
	if (flag == -1) {
		count = 0;
	}
    if (flag == -2) {
        count = 0;
        playerBike.setRandomValue();
        botBike.setRandomValue();
        clearField(field, N);
        draw();
    }
}

function start() {
	document.onkeyup = courseBike;
	button.value = "PAUSE";
	button.setAttribute('onClick', 'stop(0)');
	result.innerHTML = "";
	refreshIntervalId = setInterval(draw, speed);
}

/*************************************/

var button = document.getElementById("button"),
	canvas = document.getElementById("myCanvas"),
	blueBikeScore = document.getElementById("blueBike"),
	redBikeScore = document.getElementById("redBike"),
	result = document.getElementById("result"), 
	ctx = canvas.getContext("2d"),
	playerBike = new Bike("Blue",'js/images/newBlue.png'),
	botBike = new Bot("Red", "js/images/newRed.png"),
	fieldImage = new Image();
	fieldImage.src = 'js/images/field.png';


var refreshIntervalId,
	speed = 75,
	N = 102,
	field = [],
	count = 0;


fieldImage.onload = function() {
	playerBike.setRandomValue();
	botBike.setRandomValue();
	for (var i = 0; i < N; i++) {
		field[i] = [];
		for (var j = 0; j < N; j++){
			if (i == 0 || j == 0 || i == (N -1) || j == (N - 1)) {
				field[i][j] = -30;
			}
			else {
				field[i][j] = -2;
			}
		}
	}	
	drawFeild();
	draw();	
}