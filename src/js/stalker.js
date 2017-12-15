'use strict';
var Character = require('./character.js');

function Stalker(game,x,y,target){
    this.game = game;
    Character.call(this,this.game,'skeleton',x,y,1,3,1);
    this.target = target;
}
//Enlazamos las propiedades prototype   
Stalker.prototype = Object.create(Character.prototype);
Stalker.prototype.constructor = Stalker;

Stalker.prototype.update = function() {
    if(this.life <= 0)
        this.destroy();
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