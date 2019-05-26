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

    game.add.bitmapText(2*game.width/3, game.height/2 + 40, "aldrich64", "Click a button\nto change the hotkey", 24);
    game.add.bitmapText(2*game.width/3, game.height/2 + 150, "aldrich64", "Then press a key\nto bind that key", 24);
    this.go_back = game.add.button(game.width/3, 7*game.height/8 + 35, "return to menu", this.back, this);
    this.reset = game.add.button(2 * game.width/3, 7*game.height/8 + 35, "restore defaults", this.reset_settings, this);


    // game.add.bitmapText(game.width/3, 7*game.height/8 + 25, "aldrich64", 'Press ESC to return to menu', 30);


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
    this.main_fire_text = game.add.bitmapText(game.width/5 + 165, game.height/2 + 225, "aldrich64", "SPACEBAR", 24);
    this.alt_fire_text = game.add.bitmapText(game.width/5 + 295, game.height/2 + 225, "aldrich64", "SPACEBAR", 24);

    this.update_volume_text();

    //center all text
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
      this.back();
    }
  },
  //update the text counting the volume
  update_volume_text: function() {
    this.music_vol_text.text = "" + (10 * this.music_vol);
    this.sfx_vol_text.text = "" + (10 * this.sfx_vol);
  },
  //update the text for the hotkey
  update_hotkey_text: function(hotkey_text, keybind) {
    hotkey_text.text = keybind;
    this.fix_text(hotkey_text); //fix text size
  },
  //adjust the text size to not go out of the box but also not be tiny
  fix_text: function(hotkey_text) {
    if(hotkey_text.textWidth >= 120) hotkey_text.fontSize = 24;
    else hotkey_text.fontSize = 30;

  },
  //detects which volume button was pressed and change volume setting accordingly
  vol_change: function(button, pointer, isOver) {
    switch (button){
      case this.music_down:
          if(this.music_vol >= 0.1) this.music_vol -= 0.1;
          this.music_vol = Math.round(10*this.music_vol)/10; //have to round because floats are weird
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
  //detects which button was pressed and, because JS doesn't use pointers, keep track of some really weird stuff
  //so that the hotkey can correctly be changed later on
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
     //make the button light to have some visual cue.  keep track of the button for later
     this.change_button = button;
     this.change_button.setFrames("button light", "button light", "button light", "button light");
     
     this.capturing = true;
     this.update_hotkey_text(this.change_hotkey_text, ""); //clear the button's text for clarity

    }
  },
  //called by the keyboard's event, and records the key that was pressed if a button has been pressed to rebind a key
  capture: function(keystring, event) {
    //only bother keeping track of a code if currenly capturing (i.e. a button has been pressed)
    if(this.capturing) {
      //default case: get the code of the character that was typed
      var string = keystring.toUpperCase(); //make it upper case
      var code = string.charCodeAt(0); //get the code

      /*edge cases: things that phaser has hardcoded numbers for (i checked the source code for all this)
      * the reason these have to be separately hardcoded is because the keycode from the browser/JS is DIFFERENT
      * than the Phaser keycode for these keys.  which makes things work very strangely.*/
      //if the button was from the numpad
      if(event.code.substring(0, 6) == "Numpad") {
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
          case "Decimal": return; //doesn't even seem to record actually
            // code = Phaser.KeyCode.NUMPAD_DECIMAL;
            // string = "NUMPAD .";
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
      else{
        //check any key that ISN'T on the numpad. both upper and lower case versions of the same key have the same code
        //(ex. both ";" and ":" refer to "Semicolon", both will show on screen as ";")
        switch(event.code){
          case "Space":
            code = Phaser.KeyCode.SPACEBAR;
            string = "SPACEBAR";
            break;
          case "Minus": 
            code = Phaser.KeyCode.UNDERSCORE;
            string = "-";
            break;
          case "Equal":
            code = Phaser.KeyCode.EQUALS;
            string = "+";
            break;
          case "BracketLeft":
            code = Phaser.KeyCode.OPEN_BRACKET;
            string = "[";
            break;
          case "BracketRight":
            code = Phaser.KeyCode.CLOSED_BRACKET;
            string = "]";
            break;
          case "Backslash":
            code = Phaser.KeyCode.BACKWARD_SLASH;
            string = "\\"; //have to escape the first slash
            break;
          case "Semicolon": 
            code = Phaser.KeyCode.COLON;
            string = ";";
            break;
          case "Quote": 
            code = Phaser.KeyCode.QUOTES;
            string = "'";
            break;
          case "Slash":
            code = Phaser.KeyCode.QUESTION_MARK;
            string = "/";
            break;
          case "Period":
            code = Phaser.KeyCode.PERIOD;
            string = ".";
            break;
          case "Comma":
            code = Phaser.KeyCode.COMMA;
            string = ",";
            break;
          case "Backquote":
            code = Phaser.KeyCode.TILDE;
            string = "`";
            break;
          default: //don't do anything, retains the default case from waaay above
            break;
        }
      }
      this.end_capture(this.change_hotkey, this.change_hotkey_text, code, string);
    }
  },
  //The phaser keyboard event doesn't detect cursor keys, so do them separately
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
  //using the information from the previous capture methods, change the selected property of the selected
  //hotkey binding to the new value, and update the text 
  end_capture: function(hotkey, textbox, keycode, string) {
    if(this.capturing){
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
      this.change_button.setFrames("button dark", "button dark", "button dark", "button dark"); //make the button dark again
      this.update_hotkey_text(textbox, string);
      this.capturing = false;
    }
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

    //and fix all the text
    this.update_volume_text();
    this.update_hotkey_text(main_up_text, "UP");
    this.update_hotkey_text(main_down_text, "DOWN");
    this.update_hotkey_text(main_left_text, "LEFT");
    this.update_hotkey_text(main_right_text, "RIGHT");
    this.update_hotkey_text(main_fire_text, "SPACEBAR");
    this.update_hotkey_text(alt_up_text, "W");
    this.update_hotkey_text(alt_down_text, "S");
    this.update_hotkey_text(alt_left_text, "A");
    this.update_hotkey_text(alt_right_text, "D");
    this.update_hotkey_text(alt_fire_text, "SPACEBAR");
  },
  //return to main menu
  back: function() {
    game.input.keyboard.removeCallbacks(); //clear the key capturing callbacks
    game.state.start('MainMenu', true, false, this.main, this.alt, this.music_vol, this.sfx_vol);
  }
};