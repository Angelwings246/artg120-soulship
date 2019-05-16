/* Prefab for the PlayerShip
* Allows 8-directional movement, shooting (hold for a constant fire rate or tap to spam), 
* and brief invulnerability after taking damage.
*/
"use strict";

/*PlayerShip constructor:
 * sounds - array of sounds that the enemy will play upon certain events. 
 * ORDER OF SOUNDS: Death, Shooting, [Being] Hit, Low HP
 * main and alt are objects containing keybind settings, each with properies "up", "down", "left", "right", and "fire"
 */
function PlayerShip(game, sounds, key, frame, main, alt){
	// call Sprite constructor in here
	// new Sprite( game, x, y, key, frame)
	Phaser.Sprite.call(this, game, game.width/4, game.height/2, key, frame);
	game.physics.enable(this, Phaser.Physics.ARCADE);
  this.anchor.set(0.5);
  this.body.setSize(40, 34, 2, 15);

  this.rotation = Math.PI; //fix sprite direction
  this.body.collideWorldBounds = true; //don't let it go offscreen

	//set up sounds
  this.death_sound = sounds[0];
  this.firing_sound = sounds[1];
  this.hit_sound = sounds[2];
  this.low_hp_sound = sounds[3];

  //bullets are all grouped together for collision checks
  this.bullets = game.add.group();
  this.dmg = 1;

  this.PLAYER_MAX_HP = 20;
  this.hp = this.PLAYER_MAX_HP; //tracks current player hp

  this.FIRE_RATE = 30;//once every x frames
  this.time_since_last_shot = 0; //allows for lockout between shots when fire button is held


  this.INVULN_FRAMES = 20; //number of invuneraiblity frames (i-frames)
  this.time_since_dmg = 20; //keeps track of when i-frames reset, start off vulnerable

  this.main = main;
  this.alt = alt;

}

// inherit prototype from Phaser.Sprite and set construct to player ship
PlayerShip.prototype = Object.create(Phaser.Sprite.prototype);
// explicitly set constructor
PlayerShip.prototype.constructor = PlayerShip;

// update it to allow ship functions
PlayerShip.prototype.update = function(){
  
  // //set up keys
  // this.keys = game.input.keyboard.addKeys({
  //   'up': [Phaser.KeyCode.W, Phaser.KeyCode.UP], 'down': [Phaser.KeyCode.S, Phaser.KeyCode.DOWN],
  //   'left': [Phaser.KeyCode.A, Phaser.KeyCode.LEFT], 'right': [Phaser.KeyCode.D, Phaser.KeyCode.RIGHT],
  //   'fire': Phaser.KeyCode.SPACEBAR});

  if(this.main.up.isDown || this.alt.up.isDown) console.log("yay");
  
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

 //  //when the fire button is held, shoot at a constant rate
	// if(this.keys.fire.isDown){
 //    if(this.time_since_last_shot % this.FIRE_RATE == 0){
 //      this.fire();
 //    }
 //    this.time_since_last_shot++;
	// }

 //  //when the fire button is released, reset the counter.  this allows for quick spamming if desired.
 //  if(this.keys.fire.justUp) this.time_since_last_shot = 0;

  //count up for checking invulnerability
  this.time_since_dmg++;

   //feedback for taking damage: flash red, then blink during invulnerability
  if(this.time_since_dmg < this.INVULN_FRAMES) {
    if(this.time_since_dmg < 4) this.tint = 0xFF0000;
    else if(this.time_since_dmg % 4 == 0) {
      this.tint = 0xFFFFFF;
      this.alpha = 0.5;
    }
    else {
      this.alpha = 1;
    }
  }
  //make sure to turn stuff back to normal
  else {
    this.tint = 0xFFFFFF;
    this.alpha = 1;
  }

  //play the annoying low hp sound when health is low
  if(this.hp < this.PLAYER_MAX_HP/4 && !this.low_hp_sound.isPlaying) this.low_hp_sound.play();



}

//player shoots a bullet and loses 1 hp
PlayerShip.prototype.fire = function() {
  console.log("pew");
  this.firing_sound.play();

  //Bullet(game, x, y, speed, angle, color, ally, key, frame)
  var bullet = new Bullet(game, this.body.center.x + this.width/2, this.body.center.y, 300, 0, 0x43DFF8, true, "bullet", 0);
  this.bullets.add(bullet);

  //reset counter
  this.time_since_last_shot = 0;

  this.hp--;
}

//it turns out this function already exists with Phaser.Sprite, but since I want to call .destroy() instead
//of .kill() (which calls when health = 0), I'll just override it and use .hp
PlayerShip.prototype.damage = function(dmg) {
  //check if the player is currently invulerable (due to recent damage)
  //if time_since_dmg < INVULN_FRAMES, the player is invulnerable and nothing happens
  if(this.time_since_dmg >= this.INVULN_FRAMES) {
    this.hp -= dmg;
    this.time_since_dmg = 0;
    if(this.hp > 0) this.hit_sound.play();
  }
}