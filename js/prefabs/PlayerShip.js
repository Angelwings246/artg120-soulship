// Player Ship prefab
"use strict";

// create Player ship constructor 
var PlayerShip = function(game){
	// call Sprite constructor in here
	// new Sprite( game, x, y, key, frame)
	Phaser.Sprite.call(this, game, game.width/2, game.height/2, 'tempship', 0);
	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.anchor.set(0.5);
}

// inherit prototype from Phaser.Sprite and set construct to player ship
PlayerShip.prototype = Object.create(Phaser.Sprite.prototype);
// explicitly set constructor
PlayerShip.prototype.constructor = PlayerShip;

// update it to allow ship functions
PlayerShip.prototype.update = function(){
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

}
