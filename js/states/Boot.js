// Boot State

// primarily from Nathan Altice .js files

var Boot = function(game) {};
Boot.prototype = {
	preload: function(){
		game.load.image('loading', 'assets/img/loading.png');
	},
	create: function(){
		game.state.start('Load');
	}
};