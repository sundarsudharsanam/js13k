const field = document.getElementById("game");
const context = field.getContext("2d");

const playerImg = document.getElementById("player-image");

const UP_ARROW = 38, DOWN_ARROW = 40, LEFT_ARROW = 37, RIGHT_ARROW = 39, SPACE_KEY = 32, ENTER_KEY = 13;

field.width = (window.innerWidth);
field.height = (window.innerHeight - 200);

let game = {
	isStarted: false,
	isOver: false,
	isWon: false,
	frequency: 0,
	interval: 0,
	duration: 360,
	keys: {},
	frame: {
		screen: 0,
		refreshPerSecond: 50
	},
	score: {
		value: 0,
		valuePerSecond: 10,
		refreshPerSecond: 10
	},
	player: {
		x: 20,
		y: (field.offsetHeight/2) - 70,
		speed: 2,
		controlKeys: [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW]
	},
	bonus: {
		color: "cyan",
		value: 500,
		frequency: 10,
		occurrenceTime: 0,
		expiryTime: 5,
		x: 0,
		y: 0,
		isVisible: false,
		width: 20,
		height: 30,
		collected: 0
	},
	bullet: {
		color: "yellow",
		isVisible: false,
		x: 0,
		y: 0,
		width: 20,
		height: 10,
		speed: 4,
		value: 200,
		hit: 0
	},
	typeOpponents: [{
		x: field.offsetWidth,
		y: 0,
		r: 25,
		color: "orange",
		type: "circle-regular",
		direction: "down",
		speed: 2
	},
	{
		x: field.offsetWidth,
		y: field.offsetHeight/4,
		r: 50,
		color: "#FF3399",
		type: "circle-regular",
		direction: "straight",
		speed: 1
	},
	{
		x: field.offsetWidth,
		y: field.offsetHeight,
		r: 30,
		color: "red",
		type: "circle-regular",
		direction: "up",
		speed: 3
	},
	{
		x: field.offsetWidth,
		y: 0,
		r: 30,
		color: "#F100FF",
		type: "circle-regular",
		direction: "down",
		speed: 3
	},
	{
		x: field.offsetWidth,
		y: field.offsetHeight/2,
		r: 15,
		color: "#FFBF00",
		type: "circle-regular",
		direction: "straight",
		speed: 4
	},
	{
		x: field.offsetWidth,
		y: field.offsetHeight/2,
		r: 40,
		color: "yellow",
		type: "circle-grow",
		direction: "down",
		speed: 2
	},
	{
		x: field.offsetWidth,
		y: 3*(field.offsetHeight/4),
		r: 15,
		color: "#009FFF",
		type: "circle-regular",
		direction: "straight",
		speed: 4
	},
	{
		x: field.offsetWidth,
		y: 3*(field.offsetHeight/4),
		r: 30,
		color: "brown",
		type: "circle-regular",
		direction: "straight",
		speed: 2
	}],
	numOfOpponents: 0,
	freqOpponents: 3,
	opponents: [],
	init: () => {
		context.drawImage(playerImg, field.offsetWidth/8, (field.offsetHeight/2) - 70);

		let textStart = field.offsetWidth/3;

		context.font = "40px Times New Roman";
		context.fillStyle = "orange";
		context.fillText("Welcome to Spaceship!", textStart, 70);

		context.font = "20px Times New Roman";
		context.fillStyle = "#009FFF";
		context.fillText("You are LOST in Space!!", textStart, 135);
		context.fillText("MISSION: Ride the spaceship to find the way back HOME!", textStart, 160);
		context.fillText("BEWARE of approaching Asteroids!!", textStart, 185);
		
		context.fillText("CONTROLS:", textStart, 240);
		context.fillText("Navigation: Arrow keys (up, down, left & right)", textStart, 265);
		context.fillText("Shooting: Spacebar", textStart, 290);

		context.fillText("Collect diamonds (bonus) and shoot Asteroids for more points :)", textStart, 345);
		context.fillText("Press Spacebar to start!", textStart, 370);
	},
	start: () => {
		/* Refresh screen 50 times per second -> interval = 20 i.e. 1000/50 */
		game.clearField();
		game.isStarted = true;
		game.frequency = setInterval(game.updateField, (1000/game.frame.refreshPerSecond));
		game.numOfOpponents = game.typeOpponents.length;
		setTimeout(() => {
			game.isWon = true;
			game.stop();
		}, game.duration * 1000);
	},
	stop: () => {
		clearInterval(game.frequency);
		game.isOver = true;

		setTimeout(() => {
			game.clearField();
			context.drawImage(playerImg, field.offsetWidth/8, (field.offsetHeight/2) - 70);

			context.font = "40px Times New Roman";

			if(game.isWon === true){
				context.fillStyle = "#0F0";
				context.fillText("Home Sweet Home!", field.offsetWidth/3, 70);
			}
			else{
				context.fillStyle = "orange";
				context.fillText("Game Over!", field.offsetWidth/3, 70);
			}

			let baseScore = "Score: " + game.score.value;

			let bonus = game.bonus.collected * game.bonus.value;
			let bonusScored = "Bonus: " + game.bonus.collected + " x " + game.bonus.value + " = " + bonus;

			let hits = game.bullet.hit * game.bullet.value;
			let asteroidsShot = "Asteroids shot: " + game.bullet.hit + " x " + game.bullet.value + " = " + hits;

			let total = game.score.value + bonus + hits;
			let totalScore = "Total Score: " + total;

			let textStart = field.offsetWidth/3;

			context.font = "24px Times New Roman";
			context.fillStyle = "#009FFF";
			context.fillText(baseScore, textStart, 140);
			context.fillText(bonusScored, textStart, 175);
			context.fillText(asteroidsShot, textStart, 210);

			context.font = "40px Times New Roman";
			context.fillStyle = "#0F0";
			context.fillText(totalScore, textStart, 290);

			context.font = "24px Times New Roman";
			context.fillStyle = "#009FFF";
			context.fillText("Press Enter to play again!", textStart, 360);
		}, 100);
	},
	clearField: () => {
		context.clearRect(0, 0, window.outerWidth, field.offsetHeight);
	},
	getRandomNumber: (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	},
	setPlayer: () => {
		context.drawImage(playerImg, game.player.x, game.player.y);
	},
	updateScore: () => {
		document.getElementById("your_score").innerHTML = Math.round(game.score.value);
	},
	setBonus: () => {
		let bonusX = game.bonus.x;
		let bonusY = game.bonus.y;

		context.beginPath();
		context.moveTo(bonusX, bonusY);
		context.lineTo(bonusX + game.bonus.width/2, bonusY - game.bonus.height/2);
		context.lineTo(bonusX + game.bonus.width, bonusY);
		context.lineTo(bonusX + game.bonus.width/2, bonusY + game.bonus.height/2);
		context.lineTo(bonusX, bonusY);
		
		context.strokeStyle = game.bonus.color;
		context.stroke();
		context.fillStyle = game.bonus.color;
		context.fill();
	},
	isBonusPicked: () => {
		if(!((game.player.x > (game.bonus.x + game.bonus.width)) ||
			((game.player.x + playerImg.width) < game.bonus.x) ||
			(game.player.y > (game.bonus.y + game.bonus.height)) ||
			((game.player.y + playerImg.height) < game.bonus.y))){
			game.bonus.isVisible = false;
			// game.score.value += game.bonus.value;
			game.bonus.collected += 1;
		}
	},
	triggerBullet: () => {
		game.bullet.isVisible = true;
		
		context.beginPath();
		context.rect(game.bullet.x, game.bullet.y, game.bullet.width, game.bullet.height);
		context.fillStyle = game.bullet.color;
		context.fill();
	},
	isHit: (opponent) => {
		if(opponent && !((game.player.x > (opponent.x + opponent.r)) ||
			((game.player.x + playerImg.width) < (opponent.x - opponent.r)) ||
			(game.player.y > (opponent.y + opponent.r)) ||
			((game.player.y + playerImg.height) < (opponent.y - opponent.r)))){
			game.stop();
			return true;
		}
		return false;
	},
	isShot: (target) => {
		if(target && !((game.bullet.x > (target.x + target.r)) ||
			((game.bullet.x + game.bullet.width) < (target.x - target.r)) ||
			(game.bullet.y > (target.y + target.r)) ||
			((game.bullet.y + game.bullet.height) < (target.y - target.r)))){
			game.bullet.isVisible = false;
			// game.score.value += game.bullet.value;
			game.bullet.hit += 1;
			return true;
		}
		return false;
	},
	updateField: () => {
		/* 
		*	Screen refreshes 50 times per second, Update score 10 times per second
		*	Update when screen number is multiple of 5 i.e. 50/10, Increase score by 1 every 100ms i.e. 10/10
		*/
		if(game.frame.screen % (game.frame.refreshPerSecond/game.score.refreshPerSecond) === 0){
			game.score.value += game.score.valuePerSecond/game.score.refreshPerSecond;
			game.updateScore();
		}

		game.frame.screen += 1;
		game.clearField();

		if(game.keys[UP_ARROW] === true && game.player.y > 0){
			game.player.y -= game.player.speed;
		}
		if(game.keys[DOWN_ARROW] === true && game.player.y < (field.offsetHeight - playerImg.height) ){
			game.player.y += game.player.speed;
		}
		if(game.keys[LEFT_ARROW] === true && game.player.x > 0){
			game.player.x -= game.player.speed;
		}
		if(game.keys[RIGHT_ARROW] === true && game.player.x < (field.offsetWidth - playerImg.width) ){
			game.player.x += game.player.speed;
		}

		game.setPlayer();

		if(game.bullet.isVisible === true){
			game.bullet.x += game.bullet.speed;
			game.triggerBullet();
			if(game.bullet.x > field.offsetWidth){
				game.bullet.isVisible = false;
			}
		}

		/* 
		*	Screen refreshes 50 times per second, Hide bonus in 10 seconds
		*	Hide when screen number is increased by 500 i.e. 50 * 10
		*/
		if(game.bonus.isVisible === true){
			game.setBonus();
			game.isBonusPicked();
			if(game.frame.screen === game.bonus.occurrenceTime + (game.frame.refreshPerSecond * game.bonus.expiryTime)){
				game.bonus.isVisible = false;
			}
		}

		/* 
		*	Screen refreshes 50 times per second, Show bonus once in every 10 seconds
		*	Show when screen number is multiple of 500 i.e. 50 * 10
		*/
		if(game.frame.screen % (game.frame.refreshPerSecond * game.bonus.frequency) === 0){
			game.bonus.occurrenceTime = game.frame.screen;

			game.bonus.x = game.getRandomNumber(10, (field.offsetWidth - game.bonus.width));
			game.bonus.y = game.getRandomNumber(10, (field.offsetHeight - game.bonus.height));
			game.bonus.isVisible = true;
		}

		/* 
		*	For last 5 seconds, show the HOME :)
		*/
		if(game.frame.screen < ( (game.duration - 5) * game.frame.refreshPerSecond )){
			/* 
			*	Screen refreshes 50 times per second, Add opponent once in every 3 seconds
			*	Show when screen number is multiple of 150 i.e. 50 * 3
			*/
			if(game.frame.screen === 1 || game.frame.screen % (game.frame.refreshPerSecond * game.freqOpponents) === 0){
				let opponent = Object.assign({}, game.typeOpponents[game.getRandomNumber(0, game.numOfOpponents)]);
				game.opponents.push(opponent);
			}

			for(let i=0; i<game.opponents.length; i++){
				context.fillStyle = game.opponents[i].color;
				context.beginPath();
				context.arc(game.opponents[i].x, game.opponents[i].y, game.opponents[i].r, 0, 2 * Math.PI);
				context.fill();

				if(!game.isHit(game.opponents[i])){
					game.opponents[i].x -= game.opponents[i].speed;

					if(game.opponents[i].direction !== "straight"){
						if(game.opponents[i].direction === "down"){
							game.opponents[i].y += game.opponents[i].speed;
							if(game.opponents[i].y >= field.offsetHeight){
								game.opponents[i].direction = "up";
							}
						}
						else if(game.opponents[i].direction === "up"){
							game.opponents[i].y -= game.opponents[i].speed;
							if(game.opponents[i].y <= 0){
								game.opponents[i].direction = "down";
							}
						}
					}

					if(game.opponents[i].type === "circle-grow" && game.opponents[i].r <= 70){
						game.opponents[i].r += 0.04;
					}

					if(game.bullet.isVisible === true && game.opponents[i] && (game.isShot(game.opponents[i]))){
						game.opponents.splice(i, 1);
					}
					if(game.opponents[i] && (game.opponents[i].x + game.opponents[i].r) < 0){
						game.opponents.splice(i, 1);
					}
				}
			}
		}
		else{
			context.fillStyle = "grey";
			context.beginPath();
			context.arc(field.offsetWidth, field.offsetHeight/2, 3*field.offsetHeight/4, 0, 2 * Math.PI);
			context.fill();

			context.font = "40px Times New Roman";
			context.fillStyle = "#0F0";
			context.fillText("HOME", field.offsetWidth - field.offsetHeight/2, field.offsetHeight/2);
		}
	}
};

game.init();

window.addEventListener("keydown", (e) => {
	if(game.player.controlKeys.indexOf(e.keyCode) !== -1){
		game.keys[e.keyCode] = true;
	}
});
window.addEventListener("keyup", (e) => {
	if(game.player.controlKeys.indexOf(e.keyCode) !== -1){
		game.keys[e.keyCode] = false;
	}
	if(e.keyCode === SPACE_KEY){
		if(game.isStarted === true && game.bullet.isVisible === false && game.isOver === false){
			game.bullet.x = game.player.x + playerImg.width;
			game.bullet.y = game.player.y + playerImg.height/2;
			game.triggerBullet();
		}
		else if(game.isStarted === false){
			game.start();
		}
	}
	if(e.keyCode === ENTER_KEY){
		if(game.isOver === true){
			location.reload(true);
		}
	}
});
