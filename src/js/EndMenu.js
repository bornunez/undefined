var EndMenu = {
    preload: function(){
      this.game.load.image('gameover','/images/gameover.png');
    },
    create:function(){
      var background  = this.game.add.sprite(0,0,'gameover');
      background.smoothed = false;
      background.width = this.game.stage.width;
      background.height =this.game.stage.height;

      this.game.music = this.game.add.audio('gameover_theme');
      this.game.music.loop = true;
      this.game.music.play();
  

      this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
      
      var button = this.game.add.button(0,0, 'playButton', this.actionOnClick, this);
      console.log(button);
      button.anchor.setTo( 0.5, 0.5);
      button.x = this.game.world.centerX;
      button.y = this.game.world.centerY + 200;
      button.smoothed = false;
      this.game.world.bringToTop(button);
    },
    update: function(){
        if(this.enterKey.isDown){
          this.game.music.stop();
          this.game.state.start('introMenu');
        }
    }
  }
  module.exports = EndMenu;