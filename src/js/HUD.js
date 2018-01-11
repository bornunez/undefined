'require strict'

function HUD(game, hero){
    this.game = game;
    this.hero = hero;
    this.hearts = this.game.add.group();

    this.heart1 = new Hearts(this.game, this.hero, 100, 40)
    this.heart2 = new Hearts(this.game, this.hero, 60, 40)
    this.heart3 = new Hearts(this.game, this.hero, 20, 40)
    this.hearts.add(this.heart1);
    this.hearts.add(this.heart2);
    this.hearts.add(this.heart3);
}
HUD.prototype.constructor = HUD;

HUD.prototype.update = function() {
    this.game.world.bringToTop(this.hearts);
    this.updateHealth();
}


//Ver si puede llamarse solo cuando el heroe reciba daño
HUD.prototype.updateHealth = function(){
    if(this.hero.health  === 6) {
        this.heart1.frame = 0;
        this.heart2.frame = 0;
        this.heart3.frame = 0;
    }
    else if(this.hero.health  === 5) {
        this.heart1.frame = 1;
        this.heart2.frame = 0;
        this.heart3.frame = 0;
    }
    else if(this.hero.health  === 4) {
        this.heart1.frame = 2;
        this.heart2.frame = 0;
        this.heart3.frame = 0;
    }
    else if(this.hero.health  === 3) {
        this.heart1.frame = 2;
        this.heart2.frame = 1;
        this.heart3.frame = 0;
    }
    else if(this.hero.health  === 2) {
        this.heart1.frame = 2;
        this.heart2.frame = 2;
        this.heart3.frame = 0;
    }
    else if(this.hero.health  === 1) {
        this.heart1.frame = 2;
        this.heart2.frame = 2;
        this.heart3.frame = 1;
    }
    else if(this.hero.health  === 0) {
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
}








module.exports = HUD;


