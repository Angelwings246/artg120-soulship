// Boot State

// primarily from Nathan Altice .js files

var Boot = function(game) {};
Boot.prototype = {
	preload: function(){
		game.load.image('loading', 'assets/img/hp red.png'); //using the hp bar red bar as a temp load screen
	},
	create: function(){
    game.input.keyboard.addKeyCapture([Phaser.KeyCode.SPACEBAR, Phaser.KeyCode.UP, 
                        Phaser.KeyCode.DOWN, Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT]); //stop scrolling on spacebar/arrows
		game.state.start('Load');
	}
};