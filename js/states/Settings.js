//Settings state

var Settings = function(game) {};
Settings.prototype = {
  init: function(main, alt){
    this.main = main;
    this.alt = alt;
  },
  preload: function() {
    //all preloading done in Load state
  },
  create: function(){

    game.sound.stopAll();
    game.add.image(0, 0, "background");
    game.add.text(game.width/4, game.height/4, 'Settings', {fontSize: "32px", fill:"#FFFFFF"});
    game.add.text(game.width/4, game.height/3, 'Press ESC to return to menu', {fontSize: "32px", fill:"#FFFFFF"});

  },
  update: function(){
    if (game.input.keyboard.justPressed(Phaser.KeyCode.ESC)){
      game.state.start('MainMenu', true, false, this.main, this.alt);

    }
  }
};