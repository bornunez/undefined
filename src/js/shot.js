    'use strict'
var Character = require('./character.js');

function Shot(game,x,y,vel,velX,velY,spriteName){
    this.game = game;
    Phaser.Sprite.call(this,this.game,x,y,spriteName);
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(5,5);
    this.smoothed = false;
    this.initPhysics();
    this.vel = vel;
    this.velX = velX;
    this.velY = velY;

    //hacer funcion
    if(velX < 0 && velY === 0)
        this.angle = 180;
    else if(velX === 0 && velY < 0)
        this.angle = 270;
    else if(velX === 0 && velY > 0)
        this.angle = 90;
    //Diagonal abajoderecha
    else if(velX > 0 && velY > 0) 
        this.angle =  45;
    //Diagonal arribaderecha
    else if(velX > 0 && velY < 0) 
        this.angle = 315;
    //Diagonal abajoizquierda
    else if(velX < 0 && velY > 0) 
        this.angle = 135;
    //Diagonal arribaizquierda
    else if(velX < 0 && velY < 0) 
        this.angle =  225;
    

    this.game.time.events.add(Phaser.Timer.SECOND  * 1, this.arrowDestroy, this);
}
Shot.prototype = Object.create(Phaser.Sprite.prototype);
Shot.prototype.constructor = Shot;

Shot.prototype.update = function(){
    this.body.velocity.x = this.velX * this.vel;
    this.body.velocity.y = this.velY * this.vel;
    if(this!=null && this != undefined){
        this.game.physics.arcade.overlap(this, this.game.activeEnemies, this.hitEnemy, null, this);
        //PRUEBA BOSS
        this.game.physics.arcade.overlap(this, this.game.bosses, this.hitEnemy, null, this);

        //PRUEBA CICLOPE    

        this.game.physics.arcade.overlap(this, this.game.activeCyclops, this.hitCyclops, null, this);

    }
    
}

Shot.prototype.arrowDestroy = function(){
    this.destroy();
}

Shot.prototype.hitEnemy = function(arrow,enemy) {
    if(enemy.health >= 1)
        enemy.applyKnockback(enemy.target);
    else
        enemy.die();

    this.kill();
}



Shot.prototype.hitCyclops = function(arrow, cyclops) {
    if(!cyclops.sleep && cyclops.checkDir()) {
        if(cyclops.health >= 1)
            cyclops.applyKnockback(cyclops.target);
        else
            cyclops.die();
    }
    this.kill();
    
}

Shot.prototype.initPhysics = function() {
    this.game.physics.arcade.enable(this);
    //Fisicas!
    this.body.collideWorldBounds = true;
    this.body.bounce.setTo(1, 1);
  
    this.body.moves = true;

    this.body.immovable = true;
  }


module.exports = Shot;