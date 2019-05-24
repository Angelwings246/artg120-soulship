// Boot State

// primarily from Nathan Altice .js files

var Boot = function(game) {};
Boot.prototype = {
	preload: function(){
		game.load.image('loading', 'assets/img/hp red.png'); //using the hp bar red bar as a temp load screen
	},
	create: function(){
		game.state.start('Load');
	}
};