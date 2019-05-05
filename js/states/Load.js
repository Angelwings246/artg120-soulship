// Load state

var Load = function(game) {};
Load.prototype = {
	preload: function(){
		//create Loading bar image
		var loadingBar = this.add.sprite(game.width/2, game.height/2, 'loading');
		loadingBar.anchor.set(0.5);
		game.load.setPreloadSprite(loadingBar);

		//load graphics assets
		game.load.image('tempship', 'assets/img/tempship.png');		

	},
	create: function(){
		game.state.start('MainMenu');

	}
};