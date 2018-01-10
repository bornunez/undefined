'require strict'

function HUD(game, hero){
    this.game = game;
    this.hero = hero;

    this.heart1 = new Hearts(this.game, this.hero, 100, 40)
    this.heart2 = new Hearts(this.game, this.hero, 60, 40)
    this.heart3 = new Hearts(this.game, this.hero, 20, 40)
}
HUD.prototype.constructor = HUD;

HUD.prototype.update = function() {
    this.updateLife();
}


//Ver si puede llamarse solo cuando el heroe reciba daño
HUD.prototype.updateLife = function(){
    if(this.hero.life  === 6) {
        this.heart1.frame = 0;
        this.heart2.frame = 0;
        this.heart3.frame = 0;
    }
    else if(this.hero.life  === 5) {
        this.heart1.frame = 1;
        this.heart2.frame = 0;
        this.heart3.frame = 0;
    }
    else if(this.hero.life  === 4) {
        this.heart1.frame = 2;
        this.heart2.frame = 0;
        this.heart3.frame = 0;
    }
    else if(this.hero.life  === 3) {
        this.heart1.frame = 2;
        this.heart2.frame = 1;
        this.heart3.frame = 0;
    }
    else if(this.hero.life  === 2) {
        this.heart1.frame = 2;
        this.heart2.frame = 2;
        this.heart3.frame = 0;
    }
    else if(this.hero.life  === 1) {
        this.heart1.frame = 2;
        this.heart2.frame = 2;
        this.heart3.frame = 1;
    }
    else if(this.hero.life  === 0) {
        this.heart1.frame = 2;
        this.heart2.frame = 2;
        this.heart3.frame = 2;
    }
}


//Los corazones del HUD
Hearts.prototype = Object.create(Phaser.Sprite.prototype);
Hearts.prototype.constructor = Hearts;

function Hearts(game, hero,x ,y){
  this.game = game;
  this.hero = hero;

  Phaser.Sprite.call(this,this.game, x, y,'hearts');
  this.frame = 0;
  this.fixedToCamera = true;
  this.smoothed = false;
  this.scale.setTo(5,5);
  this.game.world.addChild(this);
  this.game.world.bringToTop(this);
}








module.exports = HUD;


