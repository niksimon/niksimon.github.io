window.onload = function(){
	var canvas = document.getElementById("canvas");
	if(canvas.getContext){
		var	context = canvas.getContext("2d"),
			width = canvas.width = 900,
			height = canvas.height = 520,
			started = false, selectDifficulty = 0,
			mouseX, mouseY, keyRight, keyLeft, keyUp;

		// images
		// 0 - ground, 1 - mountains, 2 - cloudBig, 3 - cloudSmall, 4 - bush, 5 - apple, 6 - ammo,
		// 7 - monster, 8 - appleman, 9 - bird1, 10 - heart
		var	imgsrc = ["ground.png", "mountains.png", "clouds1.png", "clouds2.png",
					"bush.png", "apple.png", "ammo.png", "monster.png", "appleman.png", "bird1.png", "heart.png"],
			images = [];
		for(var i = 0; i < imgsrc.length; i++){
			images[i] = new Image();
			images[i].src = "images/" + imgsrc[i];
		}

		var buttons = [];
		var difs = ["Easy", "Normal", "Impossible"];
		var menuButton = function(x, y, text, difficulty){
			this.x = x;
			this.y = y;
			this.width = 300;
			this.height = 50;
			this.color = 0;
			this.text = text;
			this.difficulty = difficulty;
			this.opacity = 0;
			this.t = 0;
		}

		for(var i = 0; i < 3; i++){
			buttons.push(new menuButton(width / 2 - 150, height/2 - 80 + i * 75, difs[i], i));
		}

		var difficulty = {
			ammo: 0,
			addAmmo: 0,
			ammoProbability: 0,
			nMonsters: 0,
			monsterJump: 0,
			monsterShoot: 0,
			monsterAddHealth: 0,
			nItems: 0,
			addHealth: 0,
			set: function(startAmmo, addAmmo, ammoProbability, nMonsters, monsterJump, monsterShoot, monsterAddHealth, nItems, addHealth){
				this.ammo = startAmmo;
				this.addAmmo = addAmmo;
				this.ammoProbability = ammoProbability;
				this.nMonsters = nMonsters;
				this.monsterJump = monsterJump;
				this.monsterShoot = monsterShoot;
				this.monsterAddHealth = monsterAddHealth;
				this.nItems = nItems;
			}
		};

		var sceneSpeed = 5,
			limitY = height - 177,
			itemImagePos = 0, // animating apple, ammo
			monsterImagePos = 10, // animating monster
			score = 0, kills = 0,
			itemSpacing = 1200 / difficulty.nItems,
			monsterSpacing = 1000 / difficulty.nMonsters,
			ammo = difficulty.ammo,
			startJumping;

		var fps = fpsCount = 0,
			date, currentTime, newTime, seconds;
		var listenersRemoved = false, shooting,
			initEnd = false,
			appleFallingImgPos = applesFallingInterval = 0;

		// player
		var hero = {
			width: 60,
			height: 80,
			x: -100,
			y: limitY,
			health: 100,
			moveSpeed: 7,
			jumpSpeed: 20,
			jumping: false,
			damage: 15,
			img: images[8],
			imgPos: 0,
			dead: false,
			t: 0,
			addHealth: function(health){
				this.health = Math.min(100, this.health + health);
			},
			removeHealth: function(health){
				this.health = Math.max(0, this.health - health);
			},
			jump: function(){
				this.y -= this.jumpSpeed;
				this.jumpSpeed -= 1;	
				if(this.y >= limitY){
					this.jumpSpeed = 20;
				}
			},
			draw: function(n){
				context.drawImage(this.img, n * this.width, 0,
								this.width, this.height, // animate hero every 4th frame
								this.x, this.y, this.width, this.height);
			},
			start: function(){
				this.x = 100;
				this.y = limitY;
				this.health = 100;
				this.jumpSpeed = 20;
				this.jumping = false;
				this.imgPos = 0;
				this.dead = false;
			}
		};

		// monsters
		var monsters = [];
		var monster = function(x, speed, jumping, shooting){
			this.width = 48;
			this.height = 48;
			this.img = images[7];
			this.limitY = height - this.height - 95;
			this.speed = speed;
			this.x = x;
			this.y = this.limitY;
			this.dead = false;
			this.touching = false;
			this.damage = 25;
			this.jumpSpeed = Math.random() * 4 + 5;
			this.jumping = jumping || false;
			this.shooting = shooting || false;
			this.maxHealth = 20;
			this.health = this.maxHealth;	
			this.countDead = false; // counts as dead once
			this.healthColor = "#00ff00";
			this.deadPos = 288;
		};
		monster.prototype.kill = function(){
			this.dead = true;
			this.speed = sceneSpeed;
		};
		monster.prototype.jump = function(){
			this.y -= this.jumpSpeed;
			this.jumpSpeed -= 0.3;
			if(this.y >= this.limitY){
				this.y = this.limitY;
				if(this.dead === true){
					this.jumping = false;
				}
				this.jumpSpeed = Math.random() * 4 + 5;
			} 
		};
		monster.prototype.repeat = function(jumping, shooting){
			this.speed = Math.random() * 1.5 + 6;
			this.maxHealth += difficulty.monsterAddHealth;
			this.health = this.maxHealth;
			this.dead = false;
			this.x = max(monsters) + monsterSpacing + (Math.random() * 100 - 50);
			this.jumping = jumping || false;
			this.shooting = shooting || false;
			this.countDead = false;
		};
		monster.prototype.addHealth = function(health){
			this.health = Math.min(100, this.health + health);	
		};
		monster.prototype.removeHealth = function(health){
			this.health = Math.max(0, this.health - health);
		};	

		// bullets
		var bullets = [];
		var bullet = function(x, y, angle){
			this.x = x;
			this.y = y;
			this.width = 0;
			this.height = 0;
			this.speed = 30;
			this.angle = angle;
			this.velocity = {
				x: Math.cos(angle) * this.speed,
				y: Math.sin(angle) * this.speed
			};
		};
		
		var backgroundStuff = function(x, y, width, height, img, speed){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.img = img || null;
			this.speed = speed || 0;
		};
		var APPLE = "apple", AMMO = "ammo";
		var item = function(x, y, img, id){
			this.x = x;
			this.y = y;
			this.img = img;
			this.width = 32;
			this.height = 32;
			this.id = id;
		};
		item.prototype.repeat = function(){
			this.x = max(items) + itemSpacing + (Math.random() * 100 - 50);
			this.y = Math.random() * 180 + 180;
			var n = Math.random();
			if(n < difficulty.ammoProbability){
				this.img = images[6];
				this.id = AMMO;
			}
			else{
				this.img = images[5];
				this.id = APPLE;
			}
		};

		// background things
		var bushes = [], clouds = [], mountains = [], items = [], fallingApples = [];
		var ground = new backgroundStuff(0, height - 120, 1800, 120, images[0]);
		for(var i = 0; i < 2; i++){
			bushes.push(new backgroundStuff(i * 610, height - 175, 150, 72, images[4]));
			clouds.push(new backgroundStuff(Math.random() * 300 + 600 + i * 480, Math.random() * 300, 70, 40, images[3]));
			mountains.push(new backgroundStuff((Math.random() * 300 + 100) + i * 600, height - 250 + i * 25, 314, 150, images[1]));
		}
		clouds.push(new backgroundStuff(Math.random() * 300 + 600 + 2 * 480, Math.random() * 300, 70, 40, images[3]));
		var cloudBig = new backgroundStuff(Math.random() * 300, Math.random() * 300, 150, 72, images[2]);
		var bird1 = new backgroundStuff(width + Math.random() * 200, Math.random() * 250 + 25, 40, 20, images[9]);
		bird1.angle = 0;
		bird1.t = 0;
		bird1.fixedY = bird1.y;

		// controls
		function onKeyDown(event){
			switch(event.keyCode){
				case 68:
				case 39:
					keyRight = true;
					break;
				case 65:
				case 37:
					keyLeft = true;
					break;
				case 87:
				case 38:
					hero.jumping = true;
					break;
			}
		}
		function onKeyUp(event){
			switch(event.keyCode){
				case 68:
				case 39:
					keyRight = false;
					break;
				case 65:
				case 37:
					keyLeft = false;
					break;
				case 87:
				case 38:
					hero.jumping = false;
					break;
			}
		}

		function updateBullets(){
			context.strokeStyle = "rgba(0, 0, 0, 0.8)";
			for(var i = 0; i < bullets.length; i++){
				var bullet = bullets[i];
				if(outOfRange(bullet.x, -bullet.speed, width + bullet.speed) || outOfRange(bullet.y, -bullet.speed, height + bullet.speed)){
					bullets.splice(i, 1);
				}
				else{
					context.beginPath();
					context.lineWidth = 2;
					context.moveTo(bullet.x, bullet.y, 5, 0, Math.PI*2, false);
					context.lineTo(bullet.x + bullet.velocity.x, bullet.y + bullet.velocity.y, 5, 0, Math.PI*2, false);
					context.closePath();
					context.stroke();
					bullet.x += bullet.velocity.x;
					bullet.y += bullet.velocity.y;
				}
			}
		}

		function updateScene(){
			// clouds
			for(var i = 0; i < clouds.length; i++){
				if(clouds[i].x <= -clouds[i].width){
					clouds[i].x = width;
					clouds[i].y = Math.random() * 300;
				}
				context.drawImage(clouds[i].img, clouds[i].x, clouds[i].y);
				clouds[i].x -= 0.2;
			}
			
			if(cloudBig.x <= -cloudBig.width){
				cloudBig.x = width;
				cloudBig.y = Math.random() * 300;
			}
			context.drawImage(cloudBig.img, cloudBig.x, cloudBig.y);
			cloudBig.x -= 0.1;

			// mountains
			for(var i = 0; i < mountains.length ; i++){
				if(mountains[i].x <= -mountains[i].width){
					mountains[i].x = Math.max(mountains[Math.abs(i - 1)].x + 600, width);
				}
				context.drawImage(mountains[i].img, mountains[i].x, mountains[i].y);
				mountains[i].x -= Math.max(sceneSpeed - 4.5, 0);
			}

			// birds
			context.drawImage(bird1.img, Math.floor(bird1.t / 4) * 70, 0, 70, 35, bird1.x, bird1.y, bird1.width, bird1.height);
			bird1.x -= sceneSpeed - 2;
			bird1.y = Math.sin(bird1.angle) * 25 + bird1.fixedY;
			bird1.angle += 0.04;
			if(bird1.x < -bird1.width - 200){
				bird1.x = width;
				bird1.fixedY = Math.random() * 250 + 25;
			}
			bird1.t++;
			if(bird1.t >= 32){
				bird1.t = 0;
			}

			// bushes
			for(var i = 0; i < bushes.length; i++){
				if(bushes[i].x <= -bushes[i].width)
					bushes[i].x = width;
				context.drawImage(bushes[i].img, bushes[i].x, bushes[i].y);
				bushes[i].x -= sceneSpeed;
			}

			// ground
			if(ground.x <= -ground.width / 2){
				ground.x = 0;
			}
			context.drawImage(ground.img, ground.x, ground.y);
			ground.x -= sceneSpeed;

			if(started === false){
				applesFallingInterval++;
				if(applesFallingInterval === 30){
					fallingApples.push(new backgroundStuff(Math.random() * width + 400, -32, 32, 32, images[5], 10));
					applesFallingInterval = 0;
				}
			}
			// falling apples
			for(var i = 0; i < fallingApples.length; i++){
				context.drawImage(fallingApples[i].img, Math.floor(appleFallingImgPos / 4) * 32, 0, 32, 32, fallingApples[i].x, fallingApples[i].y, 32, 32);
				fallingApples[i].y += fallingApples[i].speed;
				fallingApples[i].x -= sceneSpeed;
				//fallingApples[i].speed -= 0.3;
				if(fallingApples[i].y >= limitY + 50 && fallingApples[i].speed > 0){
					fallingApples[i].speed = -fallingApples[i].speed;
				}
				if(fallingApples[i].speed != 10){
					fallingApples[i].speed += Math.random() * 0.3 + 0.05;
				}
				if(fallingApples[i].x < -32){
					setTimeout(function(){fallingApples.splice(i, 1);}, 0);
				}
			}
			if(fallingApples.length > 0){
				appleFallingImgPos++;
				if(appleFallingImgPos > 48){
					appleFallingImgPos = 0;
				}
			}
		}

		function updateOther(){
			// draw items
			for(var i = 0; i < items.length; i++){
				var item = items[i];
				context.drawImage(item.img, Math.floor(itemImagePos / 4) * 32, 0, 
								item.width, item.height, // animate item every 4th frame
					item.x, item.y, item.width, item.height);
				item.x -= sceneSpeed;
				if(item.x < -itemSpacing){
					item.repeat();
				}
			}	
			itemImagePos++;
			if(itemImagePos > 48){
				itemImagePos = 0;
			}

			// health
				// heart
	   			context.drawImage(images[10], width - 330, 25);

   				// health bar
   				context.strokeStyle = "rgba(0, 0, 0, 0.8)";
   				context.lineWidth = 1;
   				context.strokeRect(625, 33, 245, 12);

   				context.fillStyle = "rgba(54, 125, 181, 1)";
   				context.fillRect(626, 34, Math.max(0, hero.health * 2.43), 10); // 243 = width of health bar
		}

		function updateMonsters(){
			for(var i = 0; i < monsters.length; i++){
				var monster = monsters[i], imgPos;
				if(monster.dead){
					imgPos = monster.deadPos;
				}
				else{
					imgPos = Math.floor(monsterImagePos / 3) * monster.width;
				}
				context.drawImage(monster.img, imgPos, 0, 
									monster.width, monster.height, // animate monster every 4th frame
									monster.x, monster.y, monster.width, monster.height);
				
				// monster health bar
				context.fillStyle = "#000";
				if(monster.health > 0){
					// outline
					context.strokeStyle = "rgba(0, 0, 0, 0.8)";
					context.lineWidth = 1;
					context.fillRect(monster.x + 2, monster.y - 20, monster.width - 4, 8);
					// inside
					if(monster.health < monster.maxHealth / 2){
						monster.healthColor = "#ff2200";
					}
					else{
						monster.healthColor = "#00ff00";
					}
					context.fillStyle = monster.healthColor;
					context.fillRect(monster.x + 3, monster.y - 19, 
						Math.max(0, monster.health * (42 / monster.maxHealth)), 6); // 42 = width of monster health bar
				}
				else{
					if(monster.countDead === false){
						kills++;
						monster.countDead = true;
						monster.maxHealth += 0.5;
						hero.addHealth(difficulty.addHealth);
					}
				}

				if(monster.jumping){
					monster.jump();
				}
				
				monster.x -= monster.speed;
				if(monster.x < -monster.width){
					monster.y = monster.limitY;
					var n = false,
						m = Math.floor(Math.random() * 2 + 1);
					if(m === 1 && (score >= startJumping || kills >= startJumping) 
						&& outOfRange(monster.x, 0, width) && outOfRange(monster.x + monster.width, 0, width)){
						n = true;
					}
					monster.repeat(n);
				}

				if(monster.health === 0 && monster.dead === false){
					monster.kill();
				}
				else{
				// collision
					if(monster.dead === false){
						// bullet collision
						for(var j = 0; j < bullets.length; j++){
							if((collisionPointObj(bullets[j].x + bullets[j].velocity.x, bullets[j].y + bullets[j].velocity.y, monster) || collisionPointObj(bullets[j].x, bullets[j].y, monster))
								&& (inRange(monster.x, 0, width) || inRange(monster.x + monster.width, 0, width))){
								drawBlood(monster.x + monster.width / 2, monster.y + monster.height / 2);
								monster.removeHealth(Math.floor(Math.random() * (hero.damage/2) + (hero.damage/2)));
								bullets.splice(j, 1);
							}
						}
						// is not touching hero
						if(collision(hero, monster) === false){
							monster.touching = false;
						}
						// make damage to hero
						else if(hero.dead === false && collision(hero, monster) && monster.touching === false){
							hero.removeHealth(Math.random() * (monster.damage - monster.damage / 2 + 1) + monster.damage / 2);
							monster.touching = true;
						}
					}
				}
			}
			monsterImagePos--;
			if(monsterImagePos < 0){
				monsterImagePos = 15;
			}
		}

		function drawInfo(n, img, imgX, imgY, imgPos, imgWidth, textX, textY){
			context.font = "30px 'Droid Sans'";
			context.textAlign = "left";
			context.fillStyle = "#333";
			context.drawImage(img, imgPos * img.height, 0, img.height, img.height, imgX, imgY, imgWidth, imgWidth);
			for(var i = 0; i < 2; i++){
				context.fillText(n, textX + 1 + i, textY + 1 + i);
			}
			context.fillStyle = "#fff";
			context.fillText(n, textX, textY);
		}

		var blood = [];
		var particle = function(x, y, radius, speed, angle){
			this.x = x;
			this.y = y;
			this.radius = radius;
			this.speed = speed;
			this.t = 1;
			this.velocity = {
				x: Math.cos(angle) * this.speed,
				y: Math.sin(angle) * this.speed
			}
		}
		particle.prototype.update = function(){
			this.x += this.velocity.x;
			this.y += this.velocity.y;
			context.fillStyle = "rgba(255, 0, 0, +" + Math.max(0, this.t) + ")";
			context.beginPath();
			context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			context.fill();
			this.t -= 0.04;
		}

		function drawBlood(x, y){
			for(var i = 0; i < 5; i++){
				blood.push(new particle(x, y, Math.random() * 2 + 1, Math.random() * 2 + 1, Math.random() * Math.PI * 2));
			}
		}

		var eye = {
			x: hero.x + 37,
			y: hero.y + 28,
			angle: 0
		};
		function rotateEyes(){
			var offsetX = hero.x + 35,
				offsetY = hero.y + 28;

			if(mouseX != undefined){
				eye.x = offsetX + 2 * Math.cos(eye.angle);
				eye.y = offsetY + 5 * Math.sin(eye.angle);
			}

			context.fillStyle = "#000";
			context.beginPath();
			context.arc(eye.x, eye.y, 1.5, 0, Math.PI * 2, false);
			context.arc(eye.x - 12, eye.y, 1.5, 0, Math.PI * 2, false);
			context.fill();
			
			eye.angle = Math.atan2(mouseY - offsetY, mouseX - offsetX);
		}

		var pulse = new backgroundStuff(625, 33, 245, 12),
			pulseOpacity = 0.5;
		function healthPulse() {
			context.fillStyle = "rgba(54, 125, 181, " + Math.max(0, pulseOpacity) + ")";
			context.fillRect(pulse.x, pulse.y, pulse.width, pulse.height);
			pulse.x -= 0.8;
			pulse.y -= 0.8;
			pulse.width += 1.6;
			pulse.height += 1.6;
			pulseOpacity -= 0.012;
			if(pulse.width > 320){
				pulse.x = 625;
				pulse.y = 33;
				pulse.width = 245;
				pulse.height = 12;
				pulseOpacity = 0.5;
			}
		}

		function collisionPointObj(px, py, obj){
			return px < obj.x + obj.width && px > obj.x && py < obj.y + obj.height && py > obj.y;
		}

		function collision(obj1, obj2){
			return obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x &&
				obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y;
		}

		function max(array){
			// return max x-pos in array
			var max = 0;
			for(var i = 0; i < array.length; i++){
				if(array[i].x > max)
					max = array[i].x;
			}
			return Math.max(max, width);
		}

		function inRange(x, left, right){
			return x > left && x < right;
		}

		function outOfRange(x, left, right){
			return x < left || x > right;
		}

		// fps
		function showFPS(){
			currentTime = Math.floor(Date.now() / 1000);
			fpsCount++;
			if(newTime != currentTime){
				seconds++;
				fps = fpsCount;
				fpsCount = 0;
				newTime = currentTime;
			}
			context.font = "12px 'Droid Sans'";
			context.textAlign = "left";
			context.fillStyle = "#fff";
			context.fillText("FPS: " + fps, width - 45, height - 5);
		}

		// menu
		function menuSelect(event){
			for(var i = 0; i < buttons.length; i++){
				if(collisionPointObj(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop, buttons[i])){
					selectDifficulty = buttons[i].difficulty;
					init();
					started = true;
				}
			}
		}

		canvas.addEventListener("click", menuSelect);

		function menu(){
			context.font = "60px 'Bangers'";
			context.textAlign = "center";
			context.fillStyle = "#000";
			context.fillText(gameName.text, gameName.x + 1, gameName.y + 1);
			context.fillText(gameName.text, gameName.x, gameName.y - 1);
			context.fillStyle = "#fff";
			context.fillText(gameName.text, gameName.x, gameName.y);
			context.font = "20px 'Droid Sans'";
			gameName.y = gameName.t * 160 - 20;
			gameName.t = Math.min(1, gameName.t + 0.07);

			context.strokeStyle = "#000";
			context.lineWidth = 1;
			for(var i = 0; i < buttons.length; i++){
				context.strokeRect(buttons[i].x, buttons[i].y, buttons[i].width, buttons[i].height);
				if(buttons[i].t < 1){
					buttons[i].x =  (width / 2) - buttons[i].t * 150;
					buttons[i].width = buttons[i].t * 300;
					buttons[i].t = Math.min(1, buttons[i].t + 0.05);
				}
				// button hover
				if(collisionPointObj(mouseX, mouseY, buttons[i])){
					context.fillStyle = "rgba(0, 0, 0, " + buttons[i].opacity + ")";
					buttons[i].opacity = Math.min(0.15, buttons[i].opacity + 0.02);
					context.fillRect(buttons[i].x, buttons[i].y, buttons[i].width, buttons[i].height)
				}
				else{
					context.fillStyle = "rgba(0, 0, 0, " + buttons[i].opacity + ")";
					buttons[i].opacity = Math.max(0, buttons[i].opacity - 0.02);
					context.fillRect(buttons[i].x, buttons[i].y, buttons[i].width, buttons[i].height)
				}
				context.fillStyle = "rgba(0, 0, 0, " + buttons[i].t + ")";
				context.fillText(buttons[i].text, buttons[i].x + buttons[i].width / 2 + 1, buttons[i].y + 32);
				context.fillStyle = "rgba(255, 255, 255, " + buttons[i].t + ")";
				context.fillText(buttons[i].text, buttons[i].x + buttons[i].width / 2, buttons[i].y + 31);
			}
		}

		function onMouseMove(event){
			mouseX = event.pageX - canvas.offsetLeft;
			mouseY = event.pageY - canvas.offsetTop;
		}
		document.addEventListener("mousemove", onMouseMove);

		// shooting
		function shoot(){
			// creates bullet, sets its direction from hero position to mouse position
			if(ammo > 0){
				var pX = hero.x + hero.width/2,
					pY = hero.y + hero.height/2;
				bullets.push(new bullet(pX, pY, Math.atan2(mouseY - pY, mouseX - pX)));
			}
			ammo = Math.max(0, ammo - 1);
		}

		function onMouseDown1(){
			shooting = setInterval(shoot, 100);
		}

		function onMouseDown2(event){
			ammo === 0 ? 0 : shoot(event);
		}

		function onMouseUp(){
			clearInterval(shooting);
		}

		var label = function(x, y, text){
			this.x = x;
			this.y = y;
			this.text = text;
			this.t = 0;
		};
		var gameOver = new label(width / 2, 230, "GAME OVER!");
		var gameName = new label(width / 2, 160, "APPLE MAN!");

		function playAgainClick(event){
			if(collisionPointObj(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop, playAgain)){
				started = false;
				hero.start();
				canvas.addEventListener("click", menuSelect);
				canvas.removeEventListener("click", playAgainClick);
			}
		}

		function end(){
			context.font = "80px 'Bangers'";
			context.textAlign = "center";
			context.fillStyle = "#000";
			context.fillText(gameOver.text, gameOver.t * gameOver.x , gameOver.y - 1);
			context.fillText(gameOver.text, gameOver.t * (gameOver.x + 2) , gameOver.y + 1);
			context.fillText(gameOver.text, gameOver.t * (gameOver.x + 1), gameOver.y + 2);
			context.fillStyle = "#fff";
			context.fillText(gameOver.text, gameOver.t * gameOver.x, gameOver.y);
			gameOver.t = Math.min(1, gameOver.t + 0.05);

			context.font = "18px 'Droid Sans'";
			context.strokeStyle = "rgba(0, 0, 0, " + playAgain.t + ")";
			context.strokeRect(playAgain.x, playAgain.y, playAgain.width, playAgain.height);

			context.fillStyle = "rgba(0, 0, 0, " + playAgain.opacity + ")";
			if(collisionPointObj(mouseX, mouseY, playAgain)){
				playAgain.opacity = Math.min(0.2, playAgain.opacity + 0.015);
			}
			else{
				playAgain.opacity = Math.max(0.1, playAgain.opacity - 0.015);
			}
			context.fillRect(playAgain.x, playAgain.y, playAgain.width, playAgain.height);

			context.fillStyle = "rgba(0, 0, 0, " + playAgain.t + ")";
			context.fillText(playAgain.text, width / 2 + 2, playAgain.y + 33);
			context.fillText(playAgain.text, width / 2 + 1, playAgain.y + 32);
			context.fillStyle = "rgba(255, 255, 255, " + playAgain.t + ")";
			context.fillText(playAgain.text, width / 2, playAgain.y + 31);

			playAgain.x = (width / 2) - playAgain.t * 125;
			playAgain.width = playAgain.t * 250;

			playAgain.t = Math.min(1, playAgain.t + 0.035);
		}

		var playAgain;
		function init(){
			switch(selectDifficulty){
				case 0: // easy
					difficulty.set(100, 25, 0.3, 4, 10, 0, 0.2, 5, 6);
					break;
				case 1: // normal
					difficulty.set(50, 50, 0.25, 6, 6, 0, 0.4, 6, 4);
					break;
				case 2: // impossible
					difficulty.set(100, 50, 0.2, 12, 3, 0, 0.6, 8, 2);
					break;
			}

			playAgain = new menuButton(width / 2, 270, "Play again?");
			playAgain.width = 0;
			playAgain.height = 50;

			keyRight = keyLeft = keyUp = false;
			initEnd = false;

			fps = fpsCount = 0,
			date, currentTime, newTime, seconds = 0;
			currentTime = newTime = Math.floor(Date.now() / 1000);

			clearInterval(shooting);
			appleFallingImgPos = applesFallingInterval = 0;

			hero.t = 0;
			sceneSpeed = 5;
			itemImagePos = 0; // animating apple, ammo
			monsterImagePos = 10; // animating monster
			score = 0;
			kills = 0;
			itemSpacing = 1200 / difficulty.nItems;
			monsterSpacing = 1000 / difficulty.nMonsters;
			ammo = difficulty.ammo;
			startJumping = Math.floor(Math.random() * (difficulty.monsterJump - 3) + difficulty.monsterJump);
			gameName.t = 0;

			monsters.splice(0, monsters.length);
			for(var i = 0; i < difficulty.nMonsters; i++){
				monsters.push(new monster(width + i * monsterSpacing + 800, Math.random() * 1.5 + 6));
			}

			// apples, ground, mountains, ...
			//setTimeout(function(){fallingApples.splice(0, fallingApples.length);}, 5000);
			items.splice(0, items.length);
			bullets.splice(0, bullets.length);
			blood.splice(0, blood.length);
			
			for(var i = 0; i < difficulty.nItems; i++){
				var n = Math.floor(Math.random() * 2 + 1);
				items.push(new item(width + i * itemSpacing + 500, Math.random() * 180 + 180, 
								n === 1 ? images[5] : images[6], n === 1 ? APPLE : AMMO));	
			}

			for(var i = 0; i < buttons.length; i++)
				buttons[i].t = 0;

			canvas.removeEventListener("click", menuSelect);
			document.addEventListener("keydown", onKeyDown);
			document.addEventListener("keyup", onKeyUp);
			document.addEventListener("mousedown", onMouseDown1);
			document.addEventListener("mousedown", onMouseDown2);
			document.addEventListener("mouseup", onMouseUp);

			listenersRemoved = false;
		}

		function removeListeners(){
			listenersRemoved = true;
			document.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("keyup", onKeyUp);
			document.removeEventListener("mousedown", onMouseDown1);
			document.removeEventListener("mousedown", onMouseDown2);
			document.removeEventListener("mouseup", onMouseUp);
		}

		function update(){
			requestAnimationFrame(update);
			context.clearRect(0, 0, width, height);
			var background = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, 500);
			background.addColorStop(0, "#C5DBEB");
			background.addColorStop(1, "#84b1d2");
			context.fillStyle = background;
			context.fillRect(0, 0, width, height);

			// background things
			updateScene();
			
			// game has started
			if(started){
				if(hero.t < 1){
					hero.x = hero.t * 200 - 100;
					hero.t += 0.04;
				}
				if(hero.health === 0){
					hero.dead = true;
					if(listenersRemoved === false){
						removeListeners();
					}
				}

				updateOther();
				updateMonsters();
				
				// player is alive
				if(hero.dead === false){
					updateBullets();

					// controls
					if(keyRight){
						hero.x = Math.min(hero.x + hero.moveSpeed, width - hero.width);
					}
					if(keyLeft){
						hero.x = Math.max(hero.x - hero.moveSpeed, 0);
					}
					if(hero.jumping || hero.y < limitY){
						hero.jump();
					}
					
					// pick up ammo, apples, increase score and health
					for(var i = 0; i < items.length; i++){
						var item = items[i];
						if(collision(hero, item)){
							// is apple
							if(items[i].id === APPLE){
								// decrease bonus health by 1 every 40th apple, increase monster damage
								hero.addHealth(Math.abs(Math.min(Math.floor(score / 40) - 5, 0)));
								monster.damage += 5;
								score++;
							}
							// is ammo
							else{
								ammo += difficulty.addAmmo;
							}
							item.repeat();
						}
					}

					// draw hero
					if(hero.y < limitY){
						hero.draw(6);
					}
					else{
						hero.draw(Math.floor(hero.imgPos / 3));
						hero.imgPos += 1;
						if(hero.imgPos > 15){
							hero.imgPos = 0;
						}
					}
					rotateEyes();
				}

				// critical health
				if(hero.health < 40){
					healthPulse();
				}

				// blood particles
				for(var i = 0; i < blood.length; i++){
					if(blood[i].t <= 0)
						blood.splice(i, 1);
					else
						blood[i].update();
				}

				// score, ammo, kills
				drawInfo(score, images[5], 30, 15, 2, 32, 75, 44)
				drawInfo(ammo, images[6], 150, 17, 2, 32, 190, 44);
				drawInfo(kills, images[7], 285, 10, 6, 40, 335, 44);

				if(hero.dead === true){
					if(hero.x > -60){
						if(hero.y < limitY){
							hero.y += 10;
						}
						context.drawImage(hero.img, 420, 0, hero.width, hero.height, hero.x, hero.y + 4, hero.width, hero.height);
						hero.x -= sceneSpeed;
					}
					end();
					if(initEnd === false){
						clearInterval(shooting);
						initEnd = true;
						canvas.addEventListener("click", playAgainClick);
					}
				}
			}
			// else show menu
			else{
				menu();
			}

			// fps
			showFPS();
		}

		update();

	}
};