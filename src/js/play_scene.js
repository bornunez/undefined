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
    this.loadMap();
    
    //Debajo de todo esta el suelo
    this.Suelo = this.createLayer("Suelo");
    
    //Create the player sprite and enable the physics
    this.link = new Hero(this.game);
    this.link.create();
    this.game.camera.follow(this.link);
    this.enemy = new Stalker(this.game,this.game.world.centerX,this.game.world.centerY,this.link);
    
    //Y encima las paderes
    this.Paredes = this.createLayer("Paredes");
    //this.Paredes.debug =true;
    this.map.setCollisionBetween(1,190,true,this.Paredes);
    //Luego las vallas
    this.Vallas = this.createLayer("Vallas");
    this.Vallas2 = this.createLayer("Vallas 2");
    this.Decoracion = this.createLayer("Decoracion");
    this.Cofre = this.createLayer("Cofre");
    //Y encima el techo
    this.Techo = this.createLayer("Techo");
    //
    this.Techo.resizeWorld();
  },
  update: function(){
    this.game.physics.arcade.collide(this.link,this.Paredes);
    this.game.physics.arcade.overlap(this.link, this.enemies,this.playerCollision,null,this);
  },
  loadMap: function(){
    //  The 'map' key here is the Loader key given in game.load.tilemap
    this.map = this.game.add.tilemap('map');
    
    //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
    //  The second parameter maps this name to the Phaser.Cache key 'tiles'
    this.map.addTilesetImage('Zelda', 'tiles');
    //to get the tileset ID (number):
    this.tilesetID = this.map.getTilesetIndex("Zelda");

    
    //  This resizes the game world to match the layer dimensions
  },
  createLayer: function(name){
    var layer = this.map.createLayer(name);
    layer.smoothed = false;
    layer.setScale(5);
    return layer;
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
