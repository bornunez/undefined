'use strict'
var Character = require('./character.js');

function Shot(game,x,y,vel,velX,velY,spriteName){
    this.game = game;
    Phaser.Sprite.call(this,this.game,x,y,spriteName);
    this.initPhysics();
    this.vel = vel;
    this.velX = velX;
    this.velY = velY;
    this.game.time.events.add(Phaser.Timer.SECOND  * 1, this.arrowDestroy, this);
}
Shot.prototype = Object.create(Phaser.Sprite.prototype);
Shot.prototype.constructor = Shot;

Shot.prototype.update = function(){
    this.body.velocity.x = this.velX * this.vel;
    this.body.velocity.y = this.velY * this.vel;
    this.game.physics.arcade.overlap(this, this.game.enemies, this.hitEnemy, null, this);
    
}

Shot.prototype.arrowDestroy = function(){
    this.destroy();
}

Shot.prototype.hitEnemy = function(arrow,enemy) {
    enemy.life--;
    //enemy.scaleSprite(5,5);
    enemy.applyKnockback(enemy.target);
    this.destroy();
}
Shot.prototype.initPhysics = function(){
    //Fisicas!
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.bounce.setTo(1, 1);
  
    this.body.moves = true;
  
    this.body.checkCollision.up = true;
    this.body.checkCollision.down = true;
    this.body.immovable = true;
  }
module.exports = Shot;