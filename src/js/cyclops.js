'use strict';
var Character = require('./character.js');
var Stalker= require('./stalker.js');
var Item = require('./Item.js');
var ItemType = require('./ItemType.js');
var ItemSprite = ['arrow','rublos','hearts']

function Cyclops(game,playscene,x,y,targetC,MAPSCALE, spriteName){
    Stalker.call(this, game, playscene, x, y , targetC, MAPSCALE, spriteName);

    this.animations.add('cyclopsWake', Phaser.Animation.generateFrameNames('enemy', 10, 11), 1, false);

    this.sleep = true;
    this.focus = false;
    this.frame = 10;
    this.dir = 'Down';
    this.cyclops_awake = this.game.add.audio('cyclops_awake');

}
//Enlazamos las propiedades prototype   
Cyclops.prototype = Object.create(Stalker.prototype);
Cyclops.prototype.constructor = Cyclops;


Cyclops.prototype.update = function() {
    //this.game.debug.body(this);
    if(this.health > 0) {
        if(this.sleep)
            this.wake();

        if (!this.sleep && !this.focus) {
            Stalker.prototype.getAngle.call(this);
            this.move();
        }
    }

    else if (!this.dead) {
        this.dead = true;
        this.body.enable = false;
        this.animations.play('enemyDying');
        this.kill_enemy.play();
        this.animations.currentAnim.onComplete.add(this.die, this);
    }
}

Cyclops.prototype.wake = function() {
    var distance = this.game.math.distance(this.x, this.y, this.target.x,  this.target.y);
    if (distance < this.minDistance){ 
            this.animations.play('cyclopsWake');
            this.animations.currentAnim.onComplete.add(function () { this.sleep = false;  this.cyclops_awake.play();}, this);
    }
}

Cyclops.prototype.move = function(){
    this.focus = true;

    if (this.game.math.distance(this.x, this.y, this.target.x,  this.target.y) > this.maxDistance){
        this.sleep = true;
        this.animations.stop();
       this.frame = 10;
    } 

    else if(this.dir === 'Right') {
        this.body.velocity.x = 300;
        this.body.velocity.y = 0;
    }
    else if(this.dir === 'Left') {
        this.body.velocity.x = -300;
        this.body.velocity.y = 0;
    }
    else if(this.dir === 'Top') {
        this.body.velocity.x = 0;
        this.body.velocity.y = -300;
    }
    else if(this.dir === 'Down') {
        this.body.velocity.x = 0;
        this.body.velocity.y = 300;
    }

    this.game.time.events.add(Phaser.Timer.SECOND  * 1.5, function() { this.focus= false; }, this); 
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

//OBVIAMENTE, a esto se le llama cuando vaya a morir
Cyclops.prototype.die = function(){
    //Primero nos desactivamos
    this.kill();
    //Despues informamos a la sala en la que estamos de que nos hemos muerto ( Si estamos en alguna)
    if(this.room != undefined && this.room != null)
        this.room.killEnemy(this);
    //Y finalmente volvemos a la pool de enemigos
    this.playscene.PoolCyclops.add(this);

    var itemType = Math.floor((Math.random() * 10) + 1) % 3;
    console.log("Item to spawn: " + itemType);
    var drop = new Item(this.game,this.target,itemType,this.x+this.width/3,this.y+this.height/3,ItemSprite[itemType],this.MAPSCALE);
}

module.exports = Cyclops;