'use strict'

function Item(game,hero,type,x,y, spriteName,MAPSCALE){
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
Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

Item.prototype.update = function (){
    this.game.physics.arcade.collide(this,this.hero,this.addItem,null,this);

}

Item.prototype.addItem= function(){
    console.log(this);
    console.log("Tipo del Item: " + this.itType);
    this.hero.addItem(this.itType);
    this.kill();
}

module.exports = Item;