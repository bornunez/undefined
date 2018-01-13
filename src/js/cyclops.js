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
    this.dir = 'Down';
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
        this.move();
    }

   
}

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

Cyclops.prototype.checkDir =  function(){
    if((this.dir === 'Right' && this.target.dir === 'Left') ||
        (this.dir === 'Left' && this.target.dir === 'Right') ||
        (this.dir === 'Top' && this.target.dir === 'Down') ||
        (this.dir === 'Down' && this.target.dir === 'Top'))
            return true;
    else
        return false;
}


module.exports = Cyclops;