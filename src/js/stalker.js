'use strict';
var Character = require('./character.js');
var Item = require('./Item.js');
var ItemType = require('./ItemType.js');
var ItemSprite = ['arrow','rublos','hearts']

function Stalker(game,playscene,x,y,target,MAPSCALE, spriteName){
    this.playscene = playscene;
    this.MAPSCALE = MAPSCALE;
    this.game = game;
    Character.call(this,this.game, spriteName,x,y,1,3,1);
    this.target = target;

    this.animations.add('enemyWalkRight', Phaser.Animation.generateFrameNames('enemy', 0, 1), 3, true);
    this.animations.add('enemyWalkLeft', Phaser.Animation.generateFrameNames('enemy', 2, 3), 3, true);
    this.animations.add('enemyWalkDown', Phaser.Animation.generateFrameNames('enemy', 4, 6), 3, true);
    this.animations.add('enemyWalkTop', Phaser.Animation.generateFrameNames('enemy', 7, 9), 3, true);

    this.minDistance = 320;
    this.maxDistance = 800;
    this.triggered = false;

    this.body.setSize(24, 24, 4, 4);


}
//Enlazamos las propiedades prototype   
Stalker.prototype = Object.create(Character.prototype);
Stalker.prototype.constructor = Stalker;

Stalker.prototype.update = function() {
    //this.game.debug.body(this);
    //Hay que ajustarlo
    if (this.x < this.target.x && this.y > this.target.y) {
        this.animations.play('enemyWalkRight');
        this.dir = 'Right'
    }
    else if (this.x > this.target.x && this.y < this.target.y) {
        this.animations.play('enemyWalkLeft');
        this.dir = 'Left'
    }
    else if (this.y < this.target.y) {
        this.animations.play('enemyWalkDown');
        this.dir = 'Down'
    }
    else if (this.y > this.target.y) {
        this.animations.play('enemyWalkTop');
        this.dir = 'Top'
    }


    if(this.health >= 0 &&  this.control)
        this.move();
}
//OBVIAMENTE, a esto se le llama cuando vaya a morir
Stalker.prototype.die = function(){
    //Primero nos desactivamos
    this.kill();
    //Despues informamos a la sala en la que estamos de que nos hemos muerto ( Si estamos en alguna)
    if(this.room != undefined && this.room != null)
        this.room.killEnemy(this);
    //Y finalmente volvemos a la pool de enemigos
    this.playscene.PoolEnemies.add(this);

    var itemType = Math.floor((Math.random() * 10) + 1) % 6;
    console.log(itemType);
    var drop = new Item(this.game,this.target,itemType,this.x+this.width/4,this.y+this.height/4,ItemSprite[itemType],this.MAPSCALE);
}
Stalker.prototype.move = function(){
    var t = {};
    var targetMoving = false;
  
    //Se asigna la x y la y del target
    t.x = this.target.x;
    t.y = this.target.y;
  
    // Calcula la distancia que lo separa del target
    // Si el target esta lo suficientemente lejos el enemigo se movera
    var distance = this.game.math.distance(this.x, this.y, t.x, t.y);
    if (!this.triggered && distance > 32 && distance < this.minDistance){ 
            targetMoving = true;
            this.triggered = true;
    }
    else if(this.triggered && distance > 32 && distance < this.maxDistance)
        targetMoving = true;
    else
        this.triggered = false;

    if (targetMoving)  {
        // Calcula el angulo entre el target y el enemigo
        var rotation = this.game.math.angleBetween(this.x, this.y, t.x, t.y);
        // Calcula el vector velocidad basandose en su rotacion
        this.body.velocity.x = Math.cos(rotation) * 100;
        this.body.velocity.y = Math.sin(rotation) * 100;
    } else {
        this.body.velocity.setTo(0, 0);
    }
}

module.exports = Stalker;