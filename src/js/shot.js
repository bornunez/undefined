'use strict';

function Shot(game,x,y,vel,velX,velY,spriteName){
    this.game = game;
    Phaser.Sprite.call(this,this.game,x,y,spriteName);
    this.initPhysics();
    this.vel = vel;
    this.velX = velX;
    this.velY = velY;
    
}
Shot.prototype = Object.create(Phaser.Sprite.prototype);
Shot.prototype.constructor = Shot;

Shot.prototype.update = function(){
    this.body.velocity.x = this.velX * this.vel;
    this.body.velocity.y = this.velY * this.vel;
    //this.game.physics.arcade.collide(this, PlayScene.enemy, this.hitEnemy, null, this);
    
}

Shot.prototype.arrowdestroy = function(){
    this.destroy();
    console.log("arrowDestroy");
}

Shot.prototype.hitEnemy = function() {
  //PlayScene.enemy.life--;
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