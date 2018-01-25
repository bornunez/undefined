var EndMenu = {
    preload: function(){
      this.game.load.image('endscreen','/images/endscreen.png');
    },
    create:function(){
      var background  = this.game.add.sprite(0, 0,'endscreen');
      background.smoothed = false;
      background.width = this.game.stage.width;
      background.height =this.game.stage.height;

      this.game.music = this.game.add.audio('win_theme');
      this.game.music.loop = true;
      this.game.music.play();
      this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    },
    update: function(){
        if(this.enterKey.isDown){
          this.game.music.stop();
          this.game.state.start('introMenu');
        }
    }
  }
  module.exports = EndMenu;