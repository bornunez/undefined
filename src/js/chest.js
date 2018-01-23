'use strict'
var Hero = require('./hero.js');
var ItemType = require('./ItemType.js');

function Chest(game, hero, x, y, MAPSCALE, reward){
    this.game = game;
    this.hero = hero;
    this.open = false;
    this.reward = reward;
    //Creamos el objeto y le damos cuerpo
    Phaser.Sprite.call(this,this.game, x, y, 'chest');
    this.open_chest = this.game.add.audio('open_chest');
    this.smoothed = false;
    this.scale.setTo(MAPSCALE,MAPSCALE);
    this.initPhysics();

    this.game.chests.add(this);
    this.game.world.bringToTop(this.game.items);
}

//Las cosas de herencia
Chest.prototype = Object.create(Phaser.Sprite.prototype);
Chest.prototype.constructor = Chest;

Chest.prototype.update = function (){
    this.game.debug.body(this);
    this.game.physics.arcade.collide(this, this.hero);
    this.interact();

}

Chest.prototype.interact = function() {
    if(this.hero.cKey.isDown && this.hero.anim === 'Idle')
      this.game.physics.arcade.overlap(this.hero.topAttack, this, this.openChest, null, this);
  }
  
Chest.prototype.openChest = function(){
    if(!this.open) {
        this.frame = 1; 
        this.open = true;
        this.open_chest.play();
        this.hero.anim = 'Win';

        if (this.reward === 'bow') {
            this.hero.animations.play('winBow');  
            this.hero.bow = true;
        }
        else if (this.reward === 'keyboss') {
            this.hero.animations.play('winBoss');  
            this.hero.keyboss = true;
        }
        else if (this.reward === 'key') {
            this.hero.animations.play('winKey');  
            this.hero.items[ItemType.Keys]++;
        }

    this.game.time.events.add(Phaser.Timer.SECOND  * 1, function() { this.hero.anim = 'Idle' }, this);
    }
  }
  
Chest.prototype.initPhysics = function() {
    this.game.physics.arcade.enable(this);
    //Fisicas!
    this.body.collideWorldBounds = true;
    this.body.bounce.setTo(1, 1);
    this.body.moves = true;
    this.body.immovable = true;
  }


module.exports = Chest;