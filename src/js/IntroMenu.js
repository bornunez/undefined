
var IntroMenu = {
    preload: function(){
      this.game.load.image('introBG','./images/intro.png');
    },
    create:function(){
      var background  = this.game.add.sprite(0,0,'introBG');
      background.smoothed = false;
      background.width = this.game.stage.width;
      background.height =this.game.stage.height;

      
      this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  /*
      var button = this.game.add.button(0,0, 'playButton', this.actionOnClick, this);
      button.anchor.setTo(0.5, 0.5);
      button.x = this.game.world.centerX;
      button.y = this.game.world.centerY + 200;
      button.smoothed = false;
      this.game.world.bringToTop(button);*/
    },
    actionOnClick: function () {
      this.game.state.start('play');
      },
      update: function(){
        if(this.enterKey.isDown){
            this.game.state.start('play');

        }
      }
  }
  module.exports = IntroMenu;