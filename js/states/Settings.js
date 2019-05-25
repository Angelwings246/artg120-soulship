//Settings state

var Settings = function(game) {};
Settings.prototype = {
  init: function(main, alt, music_vol, sfx_vol){
    this.main = main;
    this.alt = alt;
    this.music_vol = music_vol;
    this.sfx_vol = sfx_vol;
        console.log(this.music_vol + " " + this.sfx_vol);

  },
  preload: function() {
    //all preloading done in Load state
  },
  create: function(){

    game.sound.stopAll();
    game.add.image(0, 0, "background");

    //set up all the labels
    game.add.bitmapText(game.width/5 - 15, game.height/8 - 50, "aldrich64", "Settings", 48);
    game.add.bitmapText(game.width/5, game.height/4 - 65, "aldrich64", "Volume", 32);
    game.add.bitmapText(game.width/5 + 15, game.height/4 - 10, "aldrich64", "Music", 24);
    game.add.bitmapText(game.width/5 + 15, game.height/4 + 45, "aldrich64", "SFX", 24);
    game.add.bitmapText(game.width/5, game.height/3 + 40, "aldrich64", "Hotkeys", 32);
    game.add.bitmapText(game.width/5 + 150, game.height/3 + 78, "aldrich64", "Main", 20);
    game.add.bitmapText(game.width/5 + 260, game.height/3 + 78, "aldrich64", "Alternate", 20);
    game.add.bitmapText(game.width/5 + 15, game.height/2 + 15, "aldrich64", "Up", 24);
    game.add.bitmapText(game.width/5 + 15, game.height/2 + 65, "aldrich64", "Down", 24);
    game.add.bitmapText(game.width/5 + 15, game.height/2 + 115, "aldrich64", "Left", 24);
    game.add.bitmapText(game.width/5 + 15, game.height/2 + 165, "aldrich64", "Right", 24);
    game.add.bitmapText(game.width/5 + 15, game.height/2 + 215, "aldrich64", "Fire", 24);

    game.add.bitmapText(3*game.width/4 - 15, game.height/2 + 40, "aldrich64", "Click a button\nto change the hotkey", 24);
    game.add.bitmapText(3*game.width/4 - 15, game.height/2 + 150, "aldrich64", "note to self\n insert a reset \nto default button", 24);

    game.add.bitmapText(game.width/3, 7*game.height/8 + 25, "aldrich64", 'Press ESC to return to menu', 30);


    //set up the buttons for volume
    this.music_down = game.add.button(game.width/5 + 100, game.height/4 - 20, "button", this.vol_change, this, "button dark", "button dark", "button light", "button dark");
    this.sfx_down = game.add.button(game.width/5 + 100, game.height/4 + 30, "button", this.vol_change, this, "button dark", "button dark", "button light", "button dark");
    this.music_up = game.add.button(game.width/5 + 300, game.height/4 - 20, "button", this.vol_change, this, "button dark", "button dark", "button light", "button dark");
    this.sfx_up = game.add.button(game.width/5 + 300, game.height/4 + 30, "button", this.vol_change, this, "button dark", "button dark", "button light", "button dark");

    //set up the buttons for hotkeys
    this.main_up = game.add.button(game.width/5 + 100, game.height/2, "button", this.begin_capture, this, "button dark", "button dark");
    this.alt_up = game.add.button(game.width/5 + 230, game.height/2, "button", this.begin_capture, this, "button dark", "button dark");
    this.main_down = game.add.button(game.width/5 + 100, game.height/2 + 50, "button", this.begin_capture, this, "button dark", "button dark");
    this.alt_down = game.add.button(game.width/5 + 230, game.height/2 + 50, "button", this.begin_capture, this, "button dark", "button dark");
    this.main_left = game.add.button(game.width/5 + 100, game.height/2 + 100, "button", this.begin_capture, this, "button dark", "button dark");
    this.alt_left = game.add.button(game.width/5 + 230, game.height/2 + 100, "button", this.begin_capture, this, "button dark", "button dark");
    this.main_right = game.add.button(game.width/5 + 100, game.height/2 + 150, "button", this.begin_capture, this, "button dark", "button dark");
    this.alt_right = game.add.button(game.width/5 + 230, game.height/2 + 150, "button", this.begin_capture, this, "button dark", "button dark");
    this.main_fire = game.add.button(game.width/5 + 100, game.height/2 + 200, "button", this.begin_capture, this, "button dark", "button dark");
    this.alt_fire = game.add.button(game.width/5 + 230, game.height/2 + 200, "button", this.begin_capture, this, "button dark", "button dark");

    //set up all the dynamic text
    // this.dynamic_text = game.add.group();

    this.music_vol_text = game.add.bitmapText(game.width/5 + 265, game.height/4 + 5, "aldrich64", "10", 30);
    this.sfx_vol_text = game.add.bitmapText(game.width/5 + 265, game.height/4 + 55, "aldrich64", "10", 30);

    this.main_up_text = game.add.bitmapText(game.width/5 + 165, game.height/2 + 25, "aldrich64", "UP", 30);
    this.alt_up_text = game.add.bitmapText(game.width/5 + 295, game.height/2 + 25, "aldrich64", "W", 30);
    this.main_down_text = game.add.bitmapText(game.width/5 + 165, game.height/2 + 75, "aldrich64", "DOWN", 30);
    this.alt_down_text = game.add.bitmapText(game.width/5 + 295, game.height/2 + 75, "aldrich64", "S", 30);
    this.main_left_text = game.add.bitmapText(game.width/5 + 165, game.height/2 + 125, "aldrich64", "LEFT", 30);
    this.alt_left_text = game.add.bitmapText(game.width/5 + 295, game.height/2 + 125, "aldrich64", "A", 30);
    this.main_right_text = game.add.bitmapText(game.width/5 + 165, game.height/2 + 175, "aldrich64", "RIGHT", 30);
    this.alt_right_text = game.add.bitmapText(game.width/5 + 295, game.height/2 + 175, "aldrich64", "D", 30);
    this.main_fire_text = game.add.bitmapText(game.width/5 + 165, game.height/2 + 225, "aldrich64", "SPACEBAR", 30);
    this.alt_fire_text = game.add.bitmapText(game.width/5 + 295, game.height/2 + 225, "aldrich64", "SPACEBAR", 30);

    this.update_volume_text();
    // this.update_hotkey_text();

    //find a way to fix this mess
    this.music_vol_text.anchor.set(0.5);
    this.sfx_vol_text.anchor.set(0.5);
    this.main_up_text.anchor.set(0.5);
    this.alt_up_text.anchor.set(0.5);
    this.main_down_text.anchor.set(0.5);
    this.alt_down_text.anchor.set(0.5);
    this.main_left_text.anchor.set(0.5);
    this.alt_left_text.anchor.set(0.5);
    this.main_right_text.anchor.set(0.5);
    this.alt_right_text.anchor.set(0.5);
    this.main_fire_text.anchor.set(0.5);
    this.alt_fire_text.anchor.set(0.5);

    // this.dynamic_text.add(this.music_vol_text); 
    // this.dynamic_text.add(this.sfx_vol_text);
    // this.dynamic_text.add(this.main_up_text);
    // this.dynamic_text.add(this.alt_up_text);
    // this.dynamic_text.add(this.main_down_text);
    // this.dynamic_text.add(this.alt_down_text);
    // this.dynamic_text.add(this.main_left_text);
    // this.dynamic_text.add(this.alt_left_text);
    // this.dynamic_text.add(this.main_right_text);
    // this.dynamic_text.add(this.alt_right_text);
    // this.dynamic_text.add(this.main_fire_text);
    // this.dynamic_text.add(this.alt_fire_text);

    // this.dynamic_text.setAll("anchor.x", 0.5);
    // this.dynamic_text.setAll("anchor.y", 0.5);

    this.cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addCallbacks(this, null, null, this.capture);
    this.capturing = false;
    this.change_hotkey = null;
    this.change_hotkey_direction = "";
    this.change_hotkey_text = "";

  },
  update: function(){

    this.capture_cursors(); //the keyboard callback doesn't capture the arrow keys, which might be important

    if (game.input.keyboard.justPressed(Phaser.KeyCode.ESC)){
      game.input.keyboard.removeCallbacks(); //clear the key capturing callbacks
      game.state.start('MainMenu', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
    }
  },
  update_volume_text: function() {
    this.music_vol_text.text = "" + (10 * this.music_vol);
    this.sfx_vol_text.text = "" + (10 * this.sfx_vol);
  },
  update_hotkey_text: function(hotkey_text, keybind) {
    hotkey_text.text = keybind;
  },
  vol_change: function(button, pointer, isOver) {
    switch (button){
      case this.music_down:
          if(this.music_vol >= 0.1) this.music_vol -= 0.1;
          this.music_vol = Math.round(10*this.music_vol)/10;
          break;
      case this.music_up:
          if(this.music_vol <= 0.9) this.music_vol += 0.1;
          this.music_vol = Math.round(10*this.music_vol)/10;
          break;
      case this.sfx_down:
          if(this.sfx_vol >= 0.1) this.sfx_vol -= 0.1;
          this.sfx_vol = Math.round(10*this.sfx_vol)/10;          
          break;
      case this.sfx_up:
          if(this.sfx_vol <= 0.9) this.sfx_vol += 0.1;
          this.sfx_vol = Math.round(10*this.sfx_vol)/10;
          break;                  
      default:
        break;
      }
    console.log(this.music_vol + " " + this.sfx_vol);
    this.update_volume_text();

  },
  begin_capture: function(button, pointer, isOver) {
    var hotkey;
    if(!this.capturing) {
      switch (button){
        case this.main_up:
          this.change_hotkey = this.main;
          this.change_hotkey_direction = "up";
          this.change_hotkey_text = this.main_up_text;
          break;
        case this.main_down:
          this.change_hotkey = this.main;
          this.change_hotkey_direction = "down";
          this.change_hotkey_text = this.main_down_text;
          break;
        case this.main_left:
          this.change_hotkey = this.main;
          this.change_hotkey_direction = "left";
          this.change_hotkey_text = this.main_left_text;
          break;
        case this.main_right:
          this.change_hotkey = this.main;
          this.change_hotkey_direction = "right";
          this.change_hotkey_text = this.main_right_text;
          break;  
        case this.main_fire:
          this.change_hotkey = this.main;
          this.change_hotkey_direction = "fire";
          this.change_hotkey_text = this.main_fire_text;
          break;  
        case this.alt_up:
          this.change_hotkey = this.alt;
          this.change_hotkey_direction = "up";
          this.change_hotkey_text = this.alt_up_text;
          break;
        case this.alt_down:
          this.change_hotkey = this.alt;
          this.change_hotkey_direction = "down";
          this.change_hotkey_text = this.alt_down_text;
          break;
        case this.alt_left:
          this.change_hotkey = this.alt;
          this.change_hotkey_direction = "left";
          this.change_hotkey_text = this.alt_left_text;
          break;
        case this.alt_right:
          this.change_hotkey = this.alt;
          this.change_hotkey_direction = "right";
          this.change_hotkey_text = this.alt_right_text;
          break;  
        case this.alt_fire:
          this.change_hotkey = this.alt;
          this.change_hotkey_direction = "fire";
          this.change_hotkey_text = this.alt_fire_text;
          break;            
        default:
          break;
      }  
     this.capturing = true;
     this.update_hotkey_text(this.change_hotkey_text, "");

    }
  },
  capture: function(keystring, event) {
    console.log(this.capturing);
    if(this.capturing) {
      var string = keystring.toUpperCase();
      var code = string.charCodeAt(0);
      console.log(event.code);
      //edge cases: things that phaser has hardcoded numbers for (i checked the source code for all this)
      if(event.code.substring(0, 6) == "Numpad") {
        console.log("made it");
        code = Phaser.KeyCode.NUMPAD_0;
        switch(event.key) {
          case "*":
            code = Phaser.KeyCode.NUMPAD_MULTIPLY;
            string = "NUMPAD *";
            break;
          case "+":
            code = Phaser.KeyCode.NUMPAD_ADD;
            string = "NUMPAD +";
            break;          
          case "Enter": return; //enter seems to break so just don't include it for now
            // code = Phaser.KeyCode.NUMPAD_ENTER;
            // string = "NUMPAD ENTER";
            break;
          case "-":
            code = Phaser.KeyCode.NUMPAD_SUBTRACT;
            string = "NUMPAD -";
            break;
          case "/":           
            code = Phaser.KeyCode.NUMPAD_DIVIDE;
            string = "NUMPAD /";
            break;
          default:
            code += parseInt(event.key);
            string = "NUMPAD " + event.key;
            break;
        }
      }
      else if(event.code == "Space") {
        code = Phaser.KeyCode.SPACEBAR;
        string = "SPACEBAR";
      }
      this.end_capture(this.change_hotkey, this.change_hotkey_text, code, string);
    }
  },
  capture_cursors: function() {
    if(this.capturing) {
      if(this.cursors.up.justPressed()) {
        this.end_capture(this.change_hotkey, this.change_hotkey_text, Phaser.KeyCode.UP, "UP");
      }
      else if(this.cursors.down.justPressed()) {
        this.end_capture(this.change_hotkey, this.change_hotkey_text, Phaser.KeyCode.DOWN, "DOWN");
      }
      else if(this.cursors.left.justPressed()) {
        this.end_capture(this.change_hotkey, this.change_hotkey_text, Phaser.KeyCode.LEFT, "LEFT");
      }
      else if(this.cursors.right.justPressed()) {
        this.end_capture(this.change_hotkey, this.change_hotkey_text, Phaser.KeyCode.RIGHT, "RIGHT");
      }
    }
  },
  capture_special: function() {

  },
  end_capture: function(hotkey, textbox, keycode, string) {
    this.capturing = false;
    switch(this.change_hotkey_direction) {
      case "up":
        hotkey.up = keycode;
        break;
      case "down":
        hotkey.down = keycode;
        break;
      case "left":
        hotkey.left = keycode;
        break;
      case "right":
        hotkey.right = keycode;
        break;
      case "fire":
        hotkey.fire = keycode;
      default:
        break;
    }
    this.update_hotkey_text(textbox, string);
  },
  reset_settings: function() {
      this.main = {
          'up': Phaser.KeyCode.UP,
          'down': Phaser.KeyCode.DOWN,
          'left': Phaser.KeyCode.LEFT,
          'right': Phaser.KeyCode.RIGHT,
          'fire': Phaser.KeyCode.SPACEBAR
       };
      this.alt = {
          'up': Phaser.KeyCode.W, 
          'down': Phaser.KeyCode.S,
          'left': Phaser.KeyCode.A, 
          'right': Phaser.KeyCode.D,
          'fire': Phaser.KeyCode.SPACEBAR
       };
      this.music_vol = 1;
      this.sfx_vol = 1;
  }
};