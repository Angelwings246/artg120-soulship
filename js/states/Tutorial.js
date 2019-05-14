// Tutorial Level State
'use strict';
var timer;
var Tutorial = function(game) {};
Tutorial.prototype = {
	preload: function() {
    //preload assets
    game.load.path = "assets/img/";
    game.load.image("background", "bg.png");
  },
	create: function(){

		//Temporary tutorial displays controls briefly
		// game.stage.backgroundColor = '#facade';
		game.add.image(0, 0, "background");

		var warningText = game.add.text(100, 200,'Use WASD to move\n' +
			'Spacebar to shoot (tap to spam, hold for continuous fire)\n'+
			'Each shot you fire hurts you!\n' +
			'Prepare to fight your greatest fears in 5 seconds....', {fontSize: "28px", fill:"#FFFFFF"});
		timer = 0;
		this.timer = game.time.create(false);
		this.timer.start();
	},
	update: function(){
		timer = (Math.floor(this.timer.seconds))+1;
		if (timer == 5){
			game.state.start('BossLevel');
		}
	}
};