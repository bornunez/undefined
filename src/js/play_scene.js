'use strict';
//var link;
//var enemy;
var Hero = require('./hero.js');
var Character = require('./character.js');
var Stalker = require('./stalker.js');

var PlayScene = {
  create: function () {
    
    this.game.arrows = this.game.add.group();
    this.game.enemies = this.game.add.group();
    //this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Create the player sprite and enable the physics
    this.link = new Hero(this.game);
    this.link.create();
    this.enemy = new Stalker(this.game,this.game.world.centerX,this.game.world.centerY,this.link);
    
  },
  update: function(){
    this.game.physics.arcade.overlap(this.link, this.enemies,this.playerCollision,null,this);
  }
};

/*
Arrow.prototype = Object.create(Phaser.Sprite.prototype);
Arrow.constructor = Arrow;

Arrow.prototype.update = function(){
    this.body.velocity.x = this._velX;
    this.body.velocity.y = this._velY;

    this.game.physics.arcade.collide(this, PlayScene.enemy, this.hitEnemy, null, this);
    
}

Arrow.prototype.arrowdestroy = function(){
    this.destroy();
    console.log("arrowDestroy");
}

Arrow.prototype.hitEnemy = function() {
  PlayScene.enemy.life--;
  this.destroy();
}
*/

function Enemy(nx, ny, target){
  Phaser.Sprite.call(this, PlayScene.game, nx, ny, 'skeleton');
  this.target = target;
  this.x = nx;
  this.y = ny;
  this.life = 3;
  //Datos del sprite 
  this.width *= 4;
  this.height *= 4;
  this.smoothed = false;
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.constructor = Enemy;

Enemy.prototype.update = function() {

console.log(this.life)

  var t = {};
  var targetMoving = false;

      //Se asigna la x y la y del target
      t.x = this.target.x;
      t.y = this.target.y;
      
      // Calcula la distancia que lo separa del target
      // Si el target esta lo suficientemente lejos el enemigo se movera
      var distance = this.game.math.distance(this.x, this.y, t.x, t.y);
      if (distance > 32) targetMoving = true;

      if (targetMoving)  {
        // Calcula el angulo entre el target y el enemigo
        var rotation = this.game.math.angleBetween(this.x, this.y, t.x, t.y);

        // Calcula el vector velocidad basandose en su rotacion
        this.body.velocity.x = Math.cos(rotation) * 150;
        this.body.velocity.y = Math.sin(rotation) *150;
    } else {
        this.body.velocity.setTo(0, 0);
    }

    //Este if puede ir arriba del todo si todo lo demas entra en un else
    if (this.life === 0) {
      this.destroy();
    }
};




module.exports = PlayScene;
