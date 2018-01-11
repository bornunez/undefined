'use strict'

function Item(game,playScene,type,x,y, spriteName){
    this.game = game;
    this.playScene = playScene;
    this.type = type;
    //Creamos el objeto y le damos cuerpo
    Phaser.Sprite.call(game,this,x,y,spriteName);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
}

//Las cosas de herencia
Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

Item.prototype.update = function (){
    this.game.physics.arcade.collide(this,this.playScene.link,this.addItem,null,this);

}

Item.prototype.addItem= function(){
    this.playScene.link.type
}

