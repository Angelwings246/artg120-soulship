/* Prefab for the PlayerShip
* Allows 8-directional movement, shooting (hold for a constant fire rate or tap to spam), 
* and brief invulnerability after taking damage.
*/
"use strict";

/*PlayerShip constructor:
 * sounds - array of sounds that the enemy will play upon certain events. 
 * ORDER OF SOUNDS: Death, Shooting, [Being] Hit, Low HP
 * main and alt are objects containing keybind settings, each with properies "up", "down", "left", "right", and "fire".
 * The properties are KeyCodes (NUMBERS that correspond to keys, NOT the keys themselves) and these objects will have to be passed from state to state.
 */
function PlayerShip(game, sounds, key, frame, main, alt, volume){
	// call Sprite constructor in here
	// new Sprite( game, x, y, key, frame)
	Phaser.Sprite.call(this, game, game.width/4, game.height/2, key, frame);
	game.physics.enable(this, Phaser.Physics.ARCADE);
  this.anchor.set(0.5);
  this.body.setCircle(17, 5, 13);
  // this.body.setSize(40, 34, 2, 15);

  this.rotation = Math.PI; //fix sprite direction
  this.body.collideWorldBounds = true; //don't let it go offscreen

	//set up sounds
  this.death_sound = sounds[0];
  this.firing_sound = sounds[1];
  this.hit_sound = sounds[2];
  this.low_hp_sound = sounds[3];
  this.volume = volume;

  //bullets are all grouped together for collision checks
  this.bullets = game.add.group();
  this.dmg = 1;

  this.PLAYER_MAX_HP = 28;
  this.hp = this.PLAYER_MAX_HP; //tracks current player hp

  this.FIRE_RATE = 30;//once every x frames
  this.time_since_last_shot = 0; //allows for lockout between shots when fire button is held

  this.inTutorial = false;
  this.INVULN_FRAMES = 20; //number of invuneraiblity frames (i-frames)
  this.time_since_dmg = 20; //keeps track of when i-frames reset, start off vulnerable

  /*set up keys based off the keybind setting objects passed in from constructor
  * game.input.keyboard.addKeys() creates an object with the properties 'string':KeyCode.  
  * in other words, this.main is an object with the properties 'up', 'down', 'left', 'right', 'fire'
  * and each of these properties contains a Phaser.Key Object
  */
  this.main = game.input.keyboard.addKeys({
    'up': main.up,
    'down': main.down,
    'left': main.left,
    'right': main.right,
    'fire': main.fire});
  this.alt = game.input.keyboard.addKeys({
    'up': alt.up,
    'down': alt.down,
    'left': alt.left,
    'right': alt.right,
    'fire': alt.fire});

    console.log(this.main);
    console.log(this.alt);

  //implement animations
  this.death_anim = this.animations.add("death", Phaser.Animation.generateFrameNames("player_death", 1, 6, "", 1), 8, false);
  this.flame = game.add.sprite(this.body.x - 5, this.body.y + 16, "flame", "s1");
  this.flame.anchor.x = 1;
  this.flame.anchor.y = 0.5;
  this.flame.animations.add("small", Phaser.Animation.generateFrameNames("s", 1, 3, "", 1), 8, true);
  this.flame.animations.add("big", Phaser.Animation.generateFrameNames("b", 1, 3, "", 1), 8, true);
}

// inherit prototype from Phaser.Sprite and set construct to player ship
PlayerShip.prototype = Object.create(Phaser.Sprite.prototype);
// explicitly set constructor
PlayerShip.prototype.constructor = PlayerShip;

// update it to allow ship functions
PlayerShip.prototype.update = function(){

  /*movement is a variable refreshed every update cycle that tracks which keys should count as being "held down" for the sake of movement.
  * my main issue with the standard 
  * if(left)
  * else if (right) 
  * implementation is that holding left and tapping right does NOT change direction to the right,
  * however holding right and tapping left DOES change direction to the left....
  * thus, to standardize this, i have taken duration (how long the key has been held) into account, as well as using incrementation of the 
  * movement variable to detect diagonal movement without having to check each key twice.  
  * the variable is then passed into a switch-case to change the ship's velocity
  */
  var movement = 0;

  /*all functions must check both the rebindable "main" keybind settings and the "alternate" keybind settings
  * the way this is implemented, you technically can play using both key settings at the same time - as in, pressing W and LEFT.
  * ...with some exceptions.  Pressing W and DOWN and similar opposing combinations freeze you due to the implementation of the switch-case
  * (two opposing buttons add up to 8, which is default case, which is intentional, so that pressing both simultaneously does nothing.)
  */
  
  //NOTE: things start acting really funny if the same key is bound to more than one thing.....

  //only pressing up OR if both are down, pressed up more recently than pressed down 
  if((this.main.up.isDown && this.main.down.isUp) || (this.main.up.isDown && this.main.up.duration < this.main.down.duration) ||
        (this.alt.up.isDown && this.alt.down.isUp) || (this.alt.up.isDown && this.alt.up.duration < this.alt.down.duration)) {
   movement += 1;
  }
  //only pressing left OR if both are down, pressed left more recently than pressed right
  if((this.main.left.isDown && this.main.right.isUp) || (this.main.left.isDown && this.main.left.duration < this.main.right.duration) ||
        (this.alt.left.isDown && this.alt.right.isUp) || (this.alt.left.isDown && this.alt.left.duration < this.alt.right.duration)) {
    movement += 3;
  }

  //only pressing right OR if both are down, pressed right more recently than pressed left
  if((this.main.right.isDown && this.main.left.isUp) || (this.main.right.isDown && this.main.right.duration < this.main.left.duration) ||
    (this.alt.right.isDown && this.alt.left.isUp) || (this.alt.right.isDown && this.alt.right.duration < this.alt.left.duration)) {
    movement += 5;
  }

  //only pressing down OR if both are down, pressed down more recently than pressed up
  if((this.main.down.isDown && this.main.up.isUp) || (this.main.down.isDown && this.main.down.duration < this.main.up.duration) || 
    (this.alt.down.isDown && this.alt.up.isUp) || (this.alt.down.isDown && this.alt.down.duration < this.alt.up.duration)) {
    movement += 7;
  }

  /*the switch-case for movement.  the numbers look strange, but they have been chosen in a specific way, so that the diagonals are
  * equal to the two cardinals added together, and that no numbers have been repeated.  in other words, i'm trying to minimize bugs.
  * ODD cases are the cardinal directions (up, down, left, right) and EVEN cases are the diagonal directions.
  * each case is labelled, but you may also refer to this diagram:
  *    4    1    6
  *     \   |   /
  *  3-- default --5
  *     /   |   \
  *    10   7    12
  */
  switch(movement) {
    case 1: //up
      this.body.velocity.y = -200;
      this.body.velocity.x = 0;
      break;
    case 3: //left
      this.body.velocity.y = 0;
      this.body.velocity.x = -250;
      break;
    case 4: //up-left
      this.body.velocity.y = -200;
      this.body.velocity.x = -250;
      break;
    case 5: //right
      this.body.velocity.y = 0;
      this.body.velocity.x = 250;
      break;
    case 6: //up-right
      this.body.velocity.y = -200;
      this.body.velocity.x = 250;
      break;
    case 7: //down
      this.body.velocity.y = 200; 
      this.body.velocity.x = 0;
      break;
    case 10: //down-left
      this.body.velocity.y = 200;
      this.body.velocity.x = -250;
      break;
    case 12: //down-right
      this.body.velocity.y = 200;
      this.body.velocity.x = 250;
      break;
    default: //no movement
      this.body.velocity.x = this.body.velocity.y = 0;     
      break;
  }

  //when the fire button is held, shoot at a constant rate
	if(this.main.fire.isDown || this.alt.fire.isDown){
    if(this.time_since_last_shot % this.FIRE_RATE == 0){
      this.fire();
    }
    this.time_since_last_shot++;
	}

  //when the fire button is released, reset the counter.  this allows for quick spamming if desired.
  if(this.main.fire.justUp || this.alt.fire.justUp) this.time_since_last_shot = 0;

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
  if(this.hp < this.PLAYER_MAX_HP/4 && !this.low_hp_sound.isPlaying) this.low_hp_sound.play("", 0, this.volume);

  //play death stuff when dead
  if(this.hp <= 0) {
    this.animations.play("death");
    this.flame.alpha = 0;
    if(!this.death_sound.isPlaying) this.death_sound.play("", 0, this.volume);
    if(this.death_anim.isFinished) this.alpha = 0;
  }

  //keep the flame with the player
  this.flame.x = this.body.x - 5;
  this.flame.y = this.body.y + 16;
  
  //make flame big when going forward
  if(this.body.velocity.x > 10) this.flame.animations.play("big");
  else this.flame.animations.play("small");
}

//player shoots a bullet and loses 1 hp
PlayerShip.prototype.fire = function() {
  console.log("pew");
  this.firing_sound.play("", 0, this.volume);

  //Bullet(game, x, y, speed, angle, color, ally, key, frame)
  var bullet = new Bullet(game, this.body.center.x + this.width/2, this.body.center.y, 300, 0, 0x43DFF8, true, "bullet", 0);
  this.bullets.add(bullet);

  //reset counter
  this.time_since_last_shot = 0;
  if (!this.inTutorial){
  	this.hp--;
  }
}

//it turns out this function already exists with Phaser.Sprite, but since I want to call .destroy() instead
//of .kill() (which calls when health = 0), I'll just override it and use .hp
PlayerShip.prototype.damage = function(dmg) {
  //check if the player is currently invulerable (due to recent damage)
  //if time_since_dmg < INVULN_FRAMES, the player is invulnerable and nothing happens
  if(this.time_since_dmg >= this.INVULN_FRAMES) {
    this.hp -= dmg;
    this.time_since_dmg = 0;
    if(this.hp > 0) this.hit_sound.play("", 0, this.volume);
  }
}