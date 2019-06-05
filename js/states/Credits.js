// Credits State

// primarily from Nathan Altice .js files

var Credits = function(game) {};
Credits.prototype = {
  init: function(main, alt, music_vol, sfx_vol) {
    this.main = main;
    this.alt = alt;
    this.music_vol = music_vol;
    this.sfx_vol = sfx_vol;
  },
  preload: function(){
    //all preloading done in Load State
  },
  create: function(){
    game.add.image(0, 0, "background");
    game.add.bitmapText(game.width/4, game.height/4 - 100, "aldrich64", 'Credits', 96);
    game.add.bitmapText(game.width/4 + 50, game.height/4 + 50, "aldrich64", 'Taylor Fagundes', 48);
    game.add.bitmapText(game.width/4 + 50, game.height/4 + 100, "aldrich64", 'Art', 30);
    game.add.bitmapText(game.width/4 + 50, game.height/4 + 150, "aldrich64", 'Hunter Lynch', 48);
    game.add.bitmapText(game.width/4 + 50, game.height/4 + 200, "aldrich64", 'Sound, Programming', 30);
    game.add.bitmapText(game.width/4 + 50, game.height/4 + 250, "aldrich64", 'Angeleen Tan', 48);
    game.add.bitmapText(game.width/4 + 50, game.height/4 + 300, "aldrich64", 'Programming', 30);


    this.go_back = game.add.button(game.width/3, 7*game.height/8, "return to menu", this.back, this);
  },
  //return to main menu
  back: function() {
    game.state.start('MainMenu', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
  },
};