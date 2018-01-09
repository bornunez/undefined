'use strict';
var Character = require('./character.js');

function Stalker(game,playscene,x,y,target){
    this.playscene = playscene;
    this.game = game;
    Character.call(this,this.game,'enemyAnimations',x,y,1,3,1);
    this.target = target;

    this.animations.add('enemyWalkRight', Phaser.Animation.generateFrameNames('enemy', 0, 1), 3, true);
    this.animations.add('enemyWalkLeft', Phaser.Animation.generateFrameNames('enemy', 2, 3), 3, true);
    this.animations.add('enemyWalkDown', Phaser.Animation.generateFrameNames('enemy', 4, 6), 3, true);
    this.animations.add('enemyWalkTop', Phaser.Animation.generateFrameNames('enemy', 7, 9), 3, true);

    
}
//Enlazamos las propiedades prototype   
Stalker.prototype = Object.create(Character.prototype);
Stalker.prototype.constructor = Stalker;

Stalker.prototype.update = function() {
    //this.game.debug.body(this);
    //Hay que ajustarlo
    if (this.x < this.target.x && this.y > this.target.y)
        this.animations.play('enemyWalkRight');
    else if (this.x > this.target.x && this.y < this.target.y)
        this.animations.play('enemyWalkLeft');
   
    else if (this.y < this.target.y)
        this.animations.play('enemyWalkDown');
    else if (this.y > this.target.y)
        this.animations.play('enemyWalkTop');

    
    

    if(this.life <= 0){
        this.kill();
        this.playscene.PoolEnemies.add(this);
    }
    else if(this.control)
        this.move();
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
    if (distance > 32 && distance < 320){ 
            targetMoving = true;
    }    
    if (targetMoving)  {
        this.animations.play('WalkTop');
        // Calcula el angulo entre el target y el enemigo
        var rotation = this.game.math.angleBetween(this.x, this.y, t.x, t.y);
        // Calcula el vector velocidad basandose en su rotacion
        this.body.velocity.x = Math.cos(rotation) * 100;
        this.body.velocity.y = Math.sin(rotation) * 100;
    } else {
        //this.body.velocity.setTo(0, 0);
    }
}

module.exports = Stalker;