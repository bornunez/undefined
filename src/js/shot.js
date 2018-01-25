    'use strict'
var Character = require('./character.js');

function Shot(game, x, y, vel, velX, velY, dir, spriteName){
    this.game = game;
    Phaser.Sprite.call(this,this.game, x, y, spriteName);
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(5,5);
    this.smoothed = false;
    this.initPhysics();
    this.vel = vel;
    this.velX = velX;
    this.velY = velY;
    this.dir = dir;
    this.selectDir();
    this.hero_arrow_hit = this.game.add.audio('hero_arrow_hit');

    this.game.time.events.add(Phaser.Timer.SECOND  * 1, this.arrowDestroy, this);
}
Shot.prototype = Object.create(Phaser.Sprite.prototype);
Shot.prototype.constructor = Shot;

Shot.prototype.update = function(){
    this.body.velocity.x = this.velX * this.vel;
    this.body.velocity.y = this.velY * this.vel;
    if(this != null && this != undefined){
        this.game.physics.arcade.overlap(this, this.game.activeEnemies, this.hitEnemy, null, this);
        this.game.physics.arcade.overlap(this, this.game.bosses, this.hitEnemy, null, this);
        this.game.physics.arcade.overlap(this, this.game.activeCyclops, this.hitCyclops, null, this);
    }
}

Shot.prototype.arrowDestroy = function(){
    this.destroy();
}

Shot.prototype.hitEnemy = function(arrow,enemy) {
    this.hero_arrow_hit.play();

    if(enemy.health >= 1)
        enemy.applyKnockback(enemy.target);
    else
        enemy.die();

    this.kill();
}

Shot.prototype.hitCyclops = function(arrow, cyclops) {
    if(!cyclops.sleep && cyclops.checkDir()) {
        this.hero_arrow_hit.play();
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


Shot.prototype.selectDir = function() {
    if(this.velX === 0 && this.velY === 0) {
        if(this.dir === 'Right') 
            this.velX = 200;
        else if (this.dir === 'Left') 
            this.velX = -200;  
        else if (this.dir === 'Top') 
            this.velY = -200;
        else if (this.dir === 'Down') 
            this.velY = 200;
    }
    //Diagonal abajo derecha
    if(this.velX > 0 && this.velY > 0)  {
        this.angle =  45;
        this.x += 60;   this.y += 40;
    }
    //Diagonal arriba derecha
    else if(this.velX > 0 && this.velY < 0) {
        this.angle = 315;
        this.x += 60;   this.y -= 80;
    }
    //Diagonal abajo izquierda
    else if(this.velX < 0 && this.velY > 0) {
        this.angle = 135;
        this.x -= 60;   this.y += 40;
    }
    //Diagonal arriba izquierda
    else if(this.velX < 0 && this.velY < 0) {
        this.angle =  225;
        this.x -= 60;    this.y -= 80;
    }
    
    //Direcciones normales
    else if(this.dir === 'Left') {
        this.angle = 180;
        this.x -= 60;
    }
    else if(this.dir === 'Top') {
        this.angle = 270;
        this.y -= 80;
    }
    else if(this.dir === 'Down') {
        this.angle = 90;
        this.y += 40;
    }
    else
        this.x += 60;   
  }

module.exports = Shot;