'use strict';
var Character = require('./character.js');
var Item = require('./Item.js');
var ItemType = require('./ItemType.js');
var ItemSprite = ['arrow','rublos','hearts','keys','asciiforce',]

function Stalker(game, playscene, x, y, target, MAPSCALE, spriteName){
    this.playscene = playscene;
    this.MAPSCALE = MAPSCALE;
    this.game = game;
    this.target = target;
    this.dead = false;
    Character.call(this, this.game, spriteName, x, y, 1, 3, 1);

    this.animations.add('enemyWalkRight', Phaser.Animation.generateFrameNames('enemy', 0, 1), 3, true);
    this.animations.add('enemyWalkLeft', Phaser.Animation.generateFrameNames('enemy', 2, 3), 3, true);
    this.animations.add('enemyWalkDown', Phaser.Animation.generateFrameNames('enemy', 4, 6), 3, true);
    this.animations.add('enemyWalkTop', Phaser.Animation.generateFrameNames('enemy', 7, 9), 3, true);
    this.animations.add('enemyDying', Phaser.Animation.generateFrameNames('dying', 0, 5), 6, false);

    this.kill_enemy = this.game.add.audio('kill_enemy');

    this.minDistance = 480;
    this.maxDistance = 800;
    this.triggered = false;

    this.body.setSize(18, 24, 7, 4);
}
//Enlazamos las propiedades prototype   
Stalker.prototype = Object.create(Character.prototype);
Stalker.prototype.constructor = Stalker;

Stalker.prototype.update = function() {
    if(this.health > 0) {
        this.getAngle();

        if (!this.knockback)
            this.move();
    }  
    else if (!this.dead) {
        this.dead = true;
        this.body.enable = false;
        this.animations.play('enemyDying');
        this.kill_enemy.play();
        this.animations.currentAnim.onComplete.add(this.die, this);
    }
}

// Desactiva al enemigo y spawnea un item.
Stalker.prototype.die = function(){
    //Primero nos desactivamos
    this.kill();
    //Despues informamos a la sala en la que estamos de que nos hemos muerto ( Si estamos en alguna)
    if(this.room != undefined && this.room != null)
        this.room.killEnemy(this);
    //Y finalmente volvemos a la pool de enemigos
    this.playscene.PoolEnemies.add(this);
    var itemType = Math.floor((Math.random() * 10) + 1) % 3;
    var drop = new Item(this.game,this.target,itemType,this.x,this.y,ItemSprite[itemType],this.MAPSCALE);
}

Stalker.prototype.move = function(){
    var targetMoving = false;

    // Calcula la distancia que lo separa del target
    // Si el target esta lo suficientemente lejos el enemigo se movera
    var distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);
    if (!this.triggered && distance > 64 && distance < this.minDistance){ 
            targetMoving = true;
            this.triggered = true;
    }
    else if(this.triggered && distance > 64 && distance < this.maxDistance)
        targetMoving = true;
    else
        this.triggered = false;

    if (targetMoving)  {
        // Calcula el angulo entre el target y el enemigo
        var rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);
        // Calcula el vector velocidad basandose en su rotacion
        this.body.velocity.x = Math.cos(rotation) * 100;
        this.body.velocity.y = Math.sin(rotation) * 100;
    } else {
        this.body.velocity.setTo(0, 0);
    }
}

Stalker.prototype.getAngle = function() {
    var angle = (Math.atan2(this.target.y - this.y, this.target.x - this.x) * 180 / Math.PI);
    if(angle < 0)
        angle = angle + 360;

    if (angle > 225 && angle < 315) {
            this.animations.play('enemyWalkTop');
            this.dir = 'Top' 
    }
    else if (angle > 135 && angle <= 225) {
        this.animations.play('enemyWalkLeft');
        this.dir = 'Left'
    }
    else if (angle > 45 && angle <= 135) {
        this.animations.play('enemyWalkDown');
        this.dir = 'Down'
    }
    else  {
        this.animations.play('enemyWalkRight');
        this.dir = 'Right'
    }
}

module.exports = Stalker;