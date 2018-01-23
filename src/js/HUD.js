'require strict'
var ItemType = require('./ItemType.js');

function HUD(game, hero){
    this.game = game;
    this.hero = hero;
    this.hearts = this.game.add.group();

    this.heart1 = new Hearts(this.game, this.hero, 240, 40);
    this.heart2 = new Hearts(this.game, this.hero, 200, 40);    
    this.heart3 = new Hearts(this.game, this.hero, 160, 40);
    this.itembox = new ItemBox(this.game, this.hero, 20, 0);
    this.arrowIcon = new ItemIcon(this.game, this.hero, 320, 0, 'arrowicon');
    this.arrowCounter = new ItemCounter(this.game, this.hero, 340, 50, 'numbers');
    this.arrowCounter2 = new ItemCounter(this.game, this.hero, 320, 50, 'numbers');
    this.rublosIcon = new ItemIcon(this.game, this.hero, 400, 20, 'rublos');
    this.rublosCounter = new ItemCounter(this.game, this.hero, 420, 50, 'numbers');
    this.rublosCounter2 = new ItemCounter(this.game, this.hero, 400, 50, 'numbers');

    this.keysIcon = new ItemIcon(this.game, this.hero, 480, 20, 'keys');
    this.keysCounter = new ItemCounter(this.game, this.hero, 480, 50, 'numbers');

    this.hearts.add(this.heart1);
    this.hearts.add(this.heart2);
    this.hearts.add(this.heart3);
}

HUD.prototype.constructor = HUD;

HUD.prototype.update = function() {
    this.hudToTop();
    this.updateHealth();

    this.arrowCounter.frame =  this.hero.items[ItemType.Arrows] - (Math.trunc(this.hero.items[ItemType.Arrows] / 10) * 10) ;
    this.arrowCounter2.frame = Math.trunc(this.hero.items[ItemType.Arrows] / 10);

    this.rublosCounter.frame =  this.hero.items[ItemType.Rublos] - (Math.trunc(this.hero.items[ItemType.Rublos] / 10) * 10) ;
    this.rublosCounter2.frame = Math.trunc(this.hero.items[ItemType.Rublos] / 10);

    console.log(this.hero.items[ItemType.Keys])
    this.keysCounter.frame =  this.hero.items[ItemType.Keys];
    
}


//Ver si puede llamarse solo cuando el heroe reciba daño
HUD.prototype.updateHealth = function(){
    if(this.hero.items[ItemType.Hearts]  === 6) {
        this.heart1.frame = 0;
        this.heart2.frame = 0;
        this.heart3.frame = 0;
    }
    else if(this.hero.items[ItemType.Hearts]  === 5) {
        this.heart1.frame = 1;
        this.heart2.frame = 0;
        this.heart3.frame = 0;
    }
    else if(this.hero.items[ItemType.Hearts]  === 4) {
        this.heart1.frame = 2;
        this.heart2.frame = 0;
        this.heart3.frame = 0;
    }
    else if(this.hero.items[ItemType.Hearts]  === 3) {
        this.heart1.frame = 2;
        this.heart2.frame = 1;
        this.heart3.frame = 0;
    }
    else if(this.hero.items[ItemType.Hearts]  === 2) {
        this.heart1.frame = 2;
        this.heart2.frame = 2;
        this.heart3.frame = 0;
    }
    else if(this.hero.items[ItemType.Hearts]  === 1) {
        this.heart1.frame = 2;
        this.heart2.frame = 2;
        this.heart3.frame = 1;
    }
    else if(this.hero.items[ItemType.Hearts]  === 0) {
        this.heart1.frame = 2;
        this.heart2.frame = 2;
        this.heart3.frame = 2;
    }
}

HUD.prototype.hudToTop = function(){
    this.game.world.bringToTop(this.hearts);
    this.game.world.bringToTop(this.itembox);
    this.game.world.bringToTop(this.arrowIcon);
    this.game.world.bringToTop(this.arrowCounter);
    this.game.world.bringToTop(this.arrowCounter2);
    this.game.world.bringToTop(this.rublosIcon);
    this.game.world.bringToTop(this.rublosCounter);
    this.game.world.bringToTop(this.rublosCounter2);
    this.game.world.bringToTop(this.keysIcon);
    this.game.world.bringToTop( this.keysCounter);
}

//Los corazones del HUD
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
Hearts.prototype = Object.create(Phaser.Sprite.prototype);
Hearts.prototype.constructor = Hearts;

//ItemBox
function ItemBox(game, hero, x , y){
  this.game = game;
  this.hero = hero;

  Phaser.Sprite.call(this,this.game, x, y, 'itembox');
  this.frame = 0;
  this.fixedToCamera = true;
  this.smoothed = false;
  this.scale.setTo(5,5);
  this.game.world.addChild(this);
}
ItemBox.prototype = Object.create(Phaser.Sprite.prototype);
ItemBox.prototype.constructor = ItemBox;


//Items con contador
function ItemIcon(game, hero, x , y, spritename){
  this.game = game;
  this.hero = hero;
  Phaser.Sprite.call(this,this.game, x, y, spritename);
  this.fixedToCamera = true;
  this.smoothed = false;
  this.scale.setTo(3,3);
  this.game.world.addChild(this);
}
ItemIcon.prototype = Object.create(Phaser.Sprite.prototype);
ItemIcon.prototype.constructor = ItemIcon;

//Items con contador
function ItemCounter(game, hero, x , y, spritename){
    this.game = game;
    this.hero = hero;
    Phaser.Sprite.call(this,this.game, x, y, spritename);
    this.fixedToCamera = true;
    this.smoothed = false;
    this.scale.setTo(3,3);
    this.game.world.addChild(this);
  }
  ItemCounter.prototype = Object.create(Phaser.Sprite.prototype);
  ItemCounter.prototype.constructor = ItemCounter;

module.exports = HUD;


