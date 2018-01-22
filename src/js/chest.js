'use strict'

function Chest(game,hero,type,x,y, spriteName,MAPSCALE){
    this.game = game;
    this.hero = hero;
    this.itType = type;
    console.log("Spawned Item: " + this.itType);
    //Creamos el objeto y le damos cuerpo
    Phaser.Sprite.call(this,this.game,x,y,spriteName);
    this.smoothed = false;
    this.scale.setTo(MAPSCALE,MAPSCALE);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.game.items.add(this);
    this.game.world.bringToTop(this.game.items);
}

//Las cosas de herencia
Chest.prototype = Object.create(Phaser.Sprite.prototype);
Chest.prototype.constructor = Chest;

Chest.prototype.update = function (){
  

}

Item.prototype.addItem= function(){

}

module.exports = Item;