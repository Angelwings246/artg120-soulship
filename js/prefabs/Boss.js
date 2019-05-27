/** Prefab for the final Boss (dun dun duunnn)
 * Extends Phaser.Group and functions as a group of 2 Enemy objects (which function as weak points)
 * and a regular Sprite with no physics body (the central, intangible vortex).
 * Does not move x-y but rotates around its center.
 * Has 4 different fire types, each with 2 variations based upon the Boss's current HP, so 8 fire functions total.
 * These fire types are called at random from a large fire() controller function.
 * The Boss has a timer to manage the loop of each fire type: when a firing method is selected, it creates a loop
 * that calls the respective firing variation/subfunction once per "wave" of shots, and the looping event is deleted 
 * once the attack is finished.  
 * This timer is DIFFERENT from how frequently the Boss uses its attacks, which is managed in the game state.
 */

"use strict";

/*Boss constructor:
 * sounds - array of sounds that the enemy will play upon certain events. 
 * ORDER OF SOUNDS: Death, Shooting, [Being] Hit
 * key_main and frame_main are for the center part of the boss.
 * key_side and frame_side are for the side/weak parts of the boss.
*/
function Boss(game, sounds, key_main, frame_main, key_side, frame_side) {
  //call Phaser.Group constructor
  Phaser.Group.call(this, game);
  
  //store sounds
  this.death_sound = sounds[0];
  this.firing_sound = sounds[1];
  this.hit_sound = sounds[2];
  this.asteroid_sounds = sounds; //because the asteroids are enemy types, they will need a sound argument 
  
  //due to protected keywords, the sprites in this group are named "_pt", like "part"
  
  //Enemy types for the weak spots.  Note that .create() cannot be used because of constructor difference
  //Enemy(game, x, y, sounds, key, frame)
  var top_pt = new Enemy(game, 3/4 * game.width, game.height/2, sounds, key_side, frame_side, true);
  var bot_pt = new Enemy(game, 3/4 * game.width, game.height/2, sounds, key_side, frame_side, true);
  //add them to group
  this.top_pt = this.add(top_pt);
  this.bot_pt = this.add(bot_pt);


  //create a normal sprite for the center 
  this.center_pt = this.create(3/4 * game.width, game.height/2, key_main, frame_main);
  this.center_pt.anchor.setTo(0.5);
  game.physics.arcade.enable(this.center_pt);
  this.center_pt.body.setCircle(125);

  //health properties - max health refers to the boss health total
  //it is automatically split evenly between the two weak points
  this.MAX_HEALTH = 20;
  this.hp = this.MAX_HEALTH;
  this.top_pt.hp = this.bot_pt.hp = this.MAX_HEALTH/2;

  this.top_pt.body.immovable = this.bot_pt.body.immovable = this.center_pt.body.immovable = true;
  
  //remove the default velocity from Enemy()
  this.top_pt.body.velocity.y = this.bot_pt.body.velocity.y = 0;
  
  //set up the rotation
  //from Phaser Examples: pivot
  this.top_pt.anchor.setTo(0.5);
  this.bot_pt.anchor.setTo(0.5);
  this.bot_pt.rotation = Math.PI;
  this.top_pt.pivot.y = this.center_pt.height/2 + 75;
  this.bot_pt.pivot.y = this.center_pt.height/2 + 75;
  
  //have a flag so that rotation can stop if needed
  this.rotating = true;

  //bullets are all grouped together for collision checks.
  this.bullets = game.add.group();
  this.dmg = 2; //base dmg starts at 2
  this.asteroids = game.add.group(); 

  this.timer = game.time.create(false); //timer for firing stuff
  this.timer.start(); //remember to start it!


}


//assign prototype and constructor
Boss.prototype = Object.create(Phaser.Group.prototype); //create with the GROUP prototype! ... and hope it works
Boss.prototype.constructor = Boss;

//update function
Boss.prototype.update = function() {
  //calculate boss overall hp
  this.hp = this.top_pt.hp + this.bot_pt.hp;
  if(this.hp < this.MAX_HEALTH) this.dmg = 3;  //increase damage when low hp ?
  
  //kill the individual tentacles if their health reaches 0
  if(this.top_pt.exists && this.top_pt.hp <= 0) {
    this.top_pt.death();
  }
  if(this.bot_pt.exists && this.bot_pt.hp <= 0) {
    this.bot_pt.death();
  }


  //rotation
  if(this.rotating) {
    this.top_pt.rotation += 0.01;
    this.center_pt.rotation += 0.01;
    this.bot_pt.rotation += 0.01;
  }
  //a button to toggle rotation for testing purposes
  if(game.input.keyboard.addKey(Phaser.KeyCode.R).justPressed()) {
    this.rotating = !this.rotating;
  }

  //when both parts are dead, so is the boss
  if(this.top_pt.hp <= 0 && this.bot_pt.hp <= 0) this.death();

  //because we have overridden Phaser.Group, we have to manually call the children's update
  if(this.top_pt.exists && this.top_pt.hp > 0) this.top_pt.update();
  if(this.bot_pt.exists && this.bot_pt.hp > 0) this.bot_pt.update();
}

//fire function - doesn't actually override the Enemy fire function as Boss extends Phaser.Group.
//naming the function the same thing should make life easier when called in states
//Includes multiple fire types by calling different subfunctions
Boss.prototype.fire = function(x, y) {
  //calculate the boss's current hp to see what phase it is in
  this.waves_fired = 0;

  //randomly calls a subfunction, variations depending on HP
  //calling a subfunction creates a timer that repeatedly calls the respective firing type
  var pattern = 2;//game.rnd.integerInRange(0, 3);
  switch(pattern) {
    case 0:
      if(this.hp > this.MAX_HEALTH/2)  this.firing = this.timer.loop(500, this.fire1a, this);
      else this.firing = this.timer.loop(750, this.fire1b, this);
      break;
   case 1:
      if(this.hp > this.MAX_HEALTH/2)  this.firing = this.timer.loop(500, this.fire2a, this);
      else this.firing = this.timer.loop(500, this.fire2b, this);
      break;
   case 2:
      if(this.hp > this.MAX_HEALTH/2)  this.firing = this.timer.loop(250, this.fire3a, this, x, y);
      else this.firing = this.timer.loop(250, this.fire3b, this, x, y);
      break;
   case 3:
      if(this.hp > this.MAX_HEALTH/2)  this.firing = this.timer.loop(500, this.fire4a, this);
      else this.firing = this.timer.loop(750, this.fire4b, this);
      break;
    default:
      break;
  }  
  console.log("pew pew " + pattern);
}


/* --- Firing Type 1 Variation A ---
*  Fires 4 waves of a 5-bullet spread, originating from the center vortex.
*/
Boss.prototype.fire1a = function() {
  if(this.waves_fired < 4) {
    this.firing_sound.play();
    var i;
    if(this.waves_fired % 2 == 0) i = 1;
    else i = 0;
    console.log("phase 1 " + this.waves_fired);
    //Bullet(game, x, y, speed, angle, color, damage, key, frame)
    var bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, (i+13)/18 * Math.PI, 0xFF3366, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, (i+15)/18 * Math.PI, 0xFF3366, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, (i+17)/18 * Math.PI, 0xFF3366, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, (i+19)/18 * Math.PI, 0xFF3366, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, (i+21)/18 * Math.PI, 0xFF3366, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    
  this.waves_fired++; //count the number of times this subfunction has looped
  }
  else this.timer.remove(this.firing); //remove timer when done
}


/* --- Firing Type 1 Variation B ---
*  Fires 8 waves of a 7-bullet spread, originating from the center vortex.
*/
Boss.prototype.fire1b = function() {
  if(this.waves_fired < 8) {
    this.firing_sound.play();
    var i;
    if(this.waves_fired % 2 == 0) i = 1;
    else i = 0;
    console.log("phase 2 " + this.waves_fired);
    //Bullet(game, x, y, speed, angle, color, damage, key, frame)
    var bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, (i+11)/18 * Math.PI, 0xFF0D42, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, (i+13)/18 * Math.PI, 0xFF0D42, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, (i+15)/18 * Math.PI, 0xFF0D42, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, (i+17)/18 * Math.PI, 0xFF0D42, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, (i+19)/18 * Math.PI, 0xFF0D42, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, (i+21)/18 * Math.PI, 0xFF0D42, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, (i+23)/18 * Math.PI, 0xFF0D42, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    
  this.waves_fired++; //count the number of times this subfunction has looped
  }
  else this.timer.remove(this.firing); //remove timer when done
}

/* --- Firing Type 2 Variation A ---
*  Fires 4 waves of 2 3-bullet spreads, each originating from a tentacle.
*  If a tentacle has been destroyed, it does not shoot.
*/
Boss.prototype.fire2a = function() {
  if(this.waves_fired < 4) {
    this.firing_sound.play();
    console.log("phase 1 " + this.waves_fired);
    //Bullet(game, x, y, speed, angle, color, damage, key, frame)
      var bullet;
    if(this.top_pt.body != null) {
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, 3/4 * Math.PI, 0xFF61B8, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, Math.PI, 0xFF61B8, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, 5/4 * Math.PI, 0xFF61B8, this.dmg, "bullet", 0);
      this.bullets.add(bullet);    
    }
    if(this.bot_pt.body != null){
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, 3/4 * Math.PI, 0xFF61B8, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, Math.PI, 0xFF61B8, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, 5/4 * Math.PI, 0xFF61B8, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
    } 
    this.waves_fired++; //count the number of times this subfunction has looped
  }
  else this.timer.remove(this.firing); //remove timer when done

}

/* --- Firing Type 2 Variation B ---
*  Fires 4 waves of 2 5-bullet spreads, each originating from a tentacle.
*  If a tentacle has been destroyed, it does not shoot.
*/
Boss.prototype.fire2b = function() {
  if(this.waves_fired < 4) {
    this.firing_sound.play();
    console.log("phase 1 " + this.waves_fired);
    //Bullet(game, x, y, speed, angle, color, damage, key, frame)
      var bullet;
    if(this.top_pt.body != null) {
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, 3/5 * Math.PI, 0xF31F94, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, 4/5 * Math.PI, 0xF31F94, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, Math.PI, 0xF31F94, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, 6/5 * Math.PI, 0xF31F94, this.dmg, "bullet", 0);
      this.bullets.add(bullet);   
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, 7/5 * Math.PI, 0xF31F94, this.dmg, "bullet", 0);
      this.bullets.add(bullet); 
    }
    if(this.bot_pt.body != null){
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, 3/5 * Math.PI, 0xF31F94, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, 4/5 * Math.PI, 0xF31F94, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, Math.PI, 0xF31F94, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, 6/5 * Math.PI, 0xF31F94, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, 7/5 * Math.PI, 0xF31F94, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
    } 
    this.waves_fired++; //count the number of times this subfunction has looped
  }
  else this.timer.remove(this.firing); //remove timer when done

}

/* --- Firing Type 3 Variation A ---
*  Fires 4 waves of 3 single-bullet shots that aim at the player's location (recorded when the first shot fires).
*  One shot originates from the center and one originating from each tentacle.
*  If a tentacle has been destroyed, it does not shoot.
*/
Boss.prototype.fire3a = function(x, y) {
if(this.waves_fired < 4) {
    this.firing_sound.play();
    console.log("phase 1 " + this.waves_fired);
    
    var bullet;
    //do math stuff to calculate the angle of fire
    var center_to_player = - Math.PI + Math.atan((this.center_pt.centerY - y)/(this.center_pt.centerX - x));
    //Bullet(game, x, y, speed, angle, color, damage, key, frame)
    bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 300, center_to_player, 0xFF6E51, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    
    if(this.top_pt.body != null) {
      //do math stuff to calculate the angle of fire
      var top_to_player = - Math.PI + Math.atan((this.top_pt.body.center.y - y)/(this.top_pt.body.center.x - x));
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 300,top_to_player, 0xFF6E51, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
    }
    if(this.bot_pt.body != null){
      //do math stuff to calculate the angle of fire
      var bot_to_player = - Math.PI + Math.atan((this.bot_pt.body.center.y - y)/(this.bot_pt.body.center.x - x));
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 300, bot_to_player, 0xFF6E51, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
    } 
    this.waves_fired++; //count the number of times this subfunction has looped
  }
  else this.timer.remove(this.firing); //remove timer when done

}

/* --- Firing Type 3 Variation B ---
*  Fires 4 waves of 3 single-bullet shots that aim at the player's location (recorded when the first shot fires).
*  One shot originates from the center and one originating from each tentacle.
*  If a tentacle has been destroyed, it does not shoot.
*  Also spawns a random number of asteroids that spawn on the right side of the screen and travel to the left,
*  which damage the player if they player collides with them.
*/
Boss.prototype.fire3b = function(x, y) {

  //only spawn asteroids once, on the first wave
  if(this.waves_fired == 0) {
    var asteroid;
    var num_asteroids = game.rnd.integerInRange(2, 5); //random number of asteroids
    var asteroid_key;
  for(let i = 0; i < num_asteroids; i++) {
     console.log("asteroid " + i);
     //switch between the two asteroid assets
     if(i % 2 == 0) asteroid_key = "asteroid2";
     else asteroid_key = "asteroid";
     
     //Enemy(game, x, y, sounds, key, frame)
     asteroid = new Enemy(this.game, this.game.width + Math.random() * 100, Math.random() * this.game.height, this.asteroid_sounds, asteroid_key, 0, false);
     asteroid.can_fire = false; //turn off the ability for asteroids to shoot bullets
     asteroid.body.velocity.x = -100; 
     asteroid.body.velocity.y = 0; //remove velocity from the base Enemy type
     this.asteroids.add(asteroid);
   }
   console.log(this.asteroids);
  }
  if(this.waves_fired < 4) {
    this.firing_sound.play();
    console.log("phase 1 " + this.waves_fired);
    
    var bullet;
    //do math stuff to calculate the angle of fire
    var center_to_player = - Math.PI + Math.atan((this.center_pt.centerY - y)/(this.center_pt.centerX - x));
    //Bullet(game, x, y, speed, angle, color, damage, key, frame)
    bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 300, center_to_player, 0xFA5838, this.dmg, "bullet", 0);
    this.bullets.add(bullet);
    
    if(this.top_pt.body != null) {
      //do math stuff to calculate the angle of fire
      var top_to_player = - Math.PI + Math.atan((this.top_pt.body.center.y - y)/(this.top_pt.body.center.x - x));
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 300,top_to_player, 0xFA5838, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
    }
    if(this.bot_pt.body != null){
      //do math stuff to calculate the angle of fire
      var bot_to_player = - Math.PI + Math.atan((this.bot_pt.body.center.y - y)/(this.bot_pt.body.center.x - x));
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 300, bot_to_player, 0xFA5838, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
    } 
    this.waves_fired++; //count the number of times this subfunction has looped
  }
  else this.timer.remove(this.firing); //remove timer when done
}

/* --- Firing Type 4 Variation A ---
*  Fires 3 waves of 3 3-bullet spreads.
*  One shot originates from the center and one originating from each tentacle.
*  If a tentacle has been destroyed, it does not shoot.
*/
Boss.prototype.fire4a = function() {
  if(this.waves_fired < 3) {
    this.firing_sound.play();
    console.log("phase 1 " + this.waves_fired);
    //Bullet(game, x, y, speed, angle, color, damage, key, frame)
      var bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, 3/4 * Math.PI, 0xFF62F0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, Math.PI, 0xFF62F0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, 5/4 * Math.PI, 0xFF62F0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
    if(this.top_pt.body != null) {
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, 3/4 * Math.PI, 0xFF62F0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, Math.PI, 0xFF62F0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, 5/4 * Math.PI, 0xFF62F0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);    
    }
    if(this.bot_pt.body != null){
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, 3/4 * Math.PI, 0xFF62F0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, Math.PI, 0xFF62F0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, 5/4 * Math.PI, 0xFF62F0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
    } 
    this.waves_fired++; //count the number of times this subfunction has looped
  }
  else this.timer.remove(this.firing); //remove timer when done

}

/* --- Firing Type 4 Variation B ---
*  Fires 6 waves of 3 3-bullet spreads.
*  One shot originates from the center and one originating from each tentacle.
*  If a tentacle has been destroyed, it does not shoot.
*/
Boss.prototype.fire4b = function() {
  if(this.waves_fired < 6) {
    this.firing_sound.play();
    console.log("phase 2 " + this.waves_fired);
    //Bullet(game, x, y, speed, angle, color, damage, key, frame)
      var bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, 3/4 * Math.PI, 0xE41AD0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, Math.PI, 0xE41AD0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.center_pt.centerX, this.center_pt.centerY, 100, 5/4 * Math.PI, 0xE41AD0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
    if(this.top_pt.body != null) {
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, 3/4 * Math.PI, 0xE41AD0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, Math.PI, 0xE41AD0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.top_pt.body.center.x, this.top_pt.body.center.y, 100, 5/4 * Math.PI, 0xE41AD0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);    
    }
    if(this.bot_pt.body != null){
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, 3/4 * Math.PI, 0xE41AD0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, Math.PI, 0xE41AD0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
      bullet = new Bullet(game, this.bot_pt.body.center.x, this.bot_pt.body.center.y, 100, 5/4 * Math.PI, 0xE41AD0, this.dmg, "bullet", 0);
      this.bullets.add(bullet);
    } 
    this.waves_fired++; //count the number of times this subfunction has looped
  }
  else this.timer.remove(this.firing); //remove timer when done

}

//when the boss dies
Boss.prototype.death = function() {
  console.log("ded");
}