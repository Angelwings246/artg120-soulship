// Player Ship prefab
"use strict";

// create Player ship constructor 
var PlayerShip = function(game, sounds, key, frame){
	// call Sprite constructor in here
	// new Sprite( game, x, y, key, frame)
	Phaser.Sprite.call(this, game, game.width/2, game.height/2, key, frame);
	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.anchor.set(0.5);
	
	//set up sounds
  this.firing_sound = sounds[1];
  this.death_sound = sounds[0];
}

// inherit prototype from Phaser.Sprite and set construct to player ship
PlayerShip.prototype = Object.create(Phaser.Sprite.prototype);
// explicitly set constructor
PlayerShip.prototype.constructor = PlayerShip;

// update it to allow ship functions
PlayerShip.prototype.update = function(){
  
  //set up keys
  this.keys = game.input.keyboard.addKeys({
    'up': [Phaser.KeyCode.W, Phaser.KeyCode.UP], 'down': [Phaser.KeyCode.S, Phaser.KeyCode.DOWN],
    'left': [Phaser.KeyCode.A, Phaser.KeyCode.LEFT], 'right': [Phaser.KeyCode.D, Phaser.KeyCode.RIGHT]});

  if(this.keys.up.isDown) console.log("yay");
  
	// allow basic non-diagonal directional movement
	if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
		this.body.velocity.y = -200; 	
	}else
	if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
		this.body.velocity.y = 200; 	
	}else
	if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
		this.body.velocity.x = -250; 	
	}else
	if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
		this.body.velocity.x = 250; 	
	}
	// allow diagonal movement
	// needs touching up to make more fluid
	else
	if(game.input.keyboard.isDown(Phaser.Keyboard.W) && game.input.keyboard.isDown(Phaser.Keyboard.D)){
		this.body.velocity.y = -200; 
		this.body.velocity.x = 250; 		
	}else
	if(game.input.keyboard.isDown(Phaser.Keyboard.W) && game.input.keyboard.isDown(Phaser.Keyboard.A)){
		this.body.velocity.y = -200; 	
		this.body.velocity.x = -250; 	
	}else
	if(game.input.keyboard.isDown(Phaser.Keyboard.A) && game.input.keyboard.isDown(Phaser.Keyboard.S)){
		this.body.velocity.x = -250; 	
		this.body.velocity.y = 200; 	
	}else
	if(game.input.keyboard.isDown(Phaser.Keyboard.S) && game.input.keyboard.isDown(Phaser.Keyboard.D)){
		this.body.velocity.y = 200; 	
		this.body.velocity.x = 250; 	
	}else{
		this.body.velocity.y = 0; 	
		this.body.velocity.x = 0; 	
	}
	
	if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
	  this.fire();
	}
}

PlayerShip.prototype.fire = function() {
  console.log("pew");
  this.firing_sound.play();

  //Bullet(game, x, y, speed, angle, color, ally, key, frame)
  var bullet = new Bullet(game, this.body.center.x, this.body.center.y, 100, 0, 0xbbbbff, true, "bullet", 0);
  game.add.existing(bullet);
  
}
