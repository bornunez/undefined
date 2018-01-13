'use strict';
var Character = require('./character.js');
var Stalker= require('./stalker.js');
var Item = require('./Item.js');
var ItemType = require('./ItemType.js');

function Cyclops(game,playscene,x,y,target,MAPSCALE, spriteName){
    Stalker.call(this, game, playscene, x, y , target, MAPSCALE, spriteName);

    this.animations.add('cyclopsWake', Phaser.Animation.generateFrameNames('enemy', 10, 11), 1, false);

    this.sleep = true;
    this.frame = 10;
}
//Enlazamos las propiedades prototype   
Cyclops.prototype = Object.create(Stalker.prototype);
Cyclops.prototype.constructor = Cyclops;


Cyclops.prototype.update = function() {
    this.game.debug.body(this);

    if(this.sleep)
        this.wake();

    if (!this.sleep) {
        Stalker.prototype.update.call(this);
    
}

   
}
/*
//OBVIAMENTE, a esto se le llama cuando vaya a morir
Cyclops.prototype.die = function(){
    //Primero nos desactivamos
    this.kill();
    //Despues informamos a la sala en la que estamos de que nos hemos muerto ( Si estamos en alguna)
    if(this.room != undefined && this.room != null)
        this.room.killEnemy(this);
    //Y finalmente volvemos a la pool de enemigos
    this.playscene.PoolEnemies.add(this);

    var drop = new Item(this.game,this.target,ItemType.Arrows,this.x,this.y,'arrow',this.MAPSCALE);
}

*/


Cyclops.prototype.wake = function() {
    var distance = this.game.math.distance(this.x, this.y, this.target.x,  this.target.y);
    if (distance < this.minDistance){ 
            this.animations.play('cyclopsWake');
            this.animations.currentAnim.onComplete.add(function () { this.sleep = false;}, this);
    }
}

Cyclops.prototype.move = function(){
    Stalker.prototype.move.call(this);
    if(this.body.velocity.x === 0 && this.body.velocity.y === 0)  {
        this.sleep = true;
        this.animations.stop();
       this.frame = 10;
    }
}

module.exports = Cyclops;