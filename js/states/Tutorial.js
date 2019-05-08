// Tutorial Level 
'use strict';
var timer;
var Tutorial = function(game) {};
Tutorial.prototype = {
	create: function(){
		game.stage.backgroundColor = '#facade';
		var warningText = game.add.text(200, 200,'Prepare to fight your greatest fears in 5 seconds');
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