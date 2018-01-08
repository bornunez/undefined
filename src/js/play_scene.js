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
    this.spawnG = this.game.add.group(); 
    this.enemiesSprite = this.game.add.group();
    //this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.loadMap();
    this.createGO();
  },
  update: function(){
    /*
    console.log("Link X: " + this.link.x);
    console.log("Link Y: " + this.link.y);
    console.log("Trigger X : " + this.game.Triggers.getChildAt(0).x);
    console.log("Trigger Y: " + this.game.Triggers.getChildAt(0).y);*/
    this.game.physics.arcade.collide(this.link,this.Colisiones);
    this.game.physics.arcade.overlap(this.link, this.enemies,this.playerCollision,null,this);

  },
  loadMap: function(){
    //  The 'map' key here is the Loader key given in game.load.tilemap
    this.map = this.game.add.tilemap('map');
    
    //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
    //  The second parameter maps this name to the Phaser.Cache key 'tiles'
    this.map.addTilesetImage('Zelda', 'tiles');
    this.map.addTilesetImage('Objects', 'objetos');
    //to get the tileset ID (number):
    this.tilesetID = this.map.getTilesetIndex("Objects");
    this.tilesetID = this.map.getTilesetIndex("Zelda");

    
    //  This resizes the game world to match the layer dimensions
  },

  createLayer: function(name){
    var layer = this.map.createLayer(name);
    layer.smoothed = false;
    layer.setScale(5);
    return layer;
  },

  createGO: function(){

    //Debajo de todo esta el suelo
    this.Suelo = this.createLayer("Suelo");
    
    //Create the player sprite and enable the physics
    this.link = new Hero(this.game);
    this.link.create();
    this.game.camera.follow(this.link);
    //Offset de la camara 
    
    //Y encima las paderes
    this.Paredes = this.createLayer("Paredes");
    //Luego las vallas
    this.Vallas = this.createLayer("Vallas");
    this.Vallas2 = this.createLayer("Vallas 2");
    //this.Decoracion = this.createLayer("Decoracion");
    this.Objetos = this.createLayer("Objetos");
    //this.loadEnemies();
    
    //Layer de los colliders de las paredes
    this.Colisiones = this.createLayer("Colisiones");
    this.map.setCollision(206,true,this.Colisiones);
    //this.Colisiones.debug =true;
    //AQui creamos los objs
    this.map.createFromTiles(197,null,'link',this.Objetos,this.spawnG);
    this.link.x = this.spawnG.getChildAt(0).x;
    this.link.y = this.spawnG.getChildAt(0).y;
    //this.link.spawn(this.spawn.x, this.spawn.y);
    //Y encima el techo
    this.Techo = this.createLayer("Techo");
    //Y abajo del todo el HUD/*
    
    this.HUD = this.game.add.sprite(0,0,'HUD');
    this.HUD.smoothed = false;
    this.HUD.width *= 5.2;
    this.HUD.height *= 5.2;
    this.HUD.fixedToCamera = true;
    this.Techo.resizeWorld();

    this.loadTriggers();

  },
  
  loadEnemies: function(){
    //console.log(this.map.createFromTiles(202,null,'skeleton',this.Objetos,this.enemiesSprite));
    /*
    for(var i = 0; i < this.enemiesSprite.total;i++){
      var enemy = new Stalker(this.game,this.enemiesSprite.getChildAt(i).x,this.enemiesSprite.getChildAt(i).y,this.link);
      this.game.enemies.add(enemy);
    }*/
    //this.game.world.bringToTop(this.game.enemies);
  },
  loadTriggers: function(){
    this.game.Triggers = this.game.add.group();
    console.log(this.map.objects['Triggers']);
    this.map.objects['Triggers'].forEach(function(element) {
      //element.y -= this.map.tileHeight;
      var trigger = new ZoneTrigger(this,this.game,element.x*5,element.y*5,element.type);
      //var trigger = new ZoneTrigger(this,this.game,this.link.x,this.link.y,element.type);
      console.log(trigger);
      this.game.Triggers.add(trigger);
    }, this);
    this.game.world.bringToTop(this.game.Triggers);
  },
  //Devuelve un array de objetos con la propiedad 'type' en la capa 'layer'
  findObjectsByType: function(type, layer) {
    var result = new Array();
    this.map.objects[layer].forEach(function(element){
      if(element.type === type) {
        result.push(element);
      }      
    });
    return result;
  },
};

//No vamos a crear un modulo para algo tan pequeño (creo)
function ZoneTrigger(playScene,game,x,y, zone){
  this.game = game;
  this.playScene = playScene;

  Phaser.Sprite.call(this,this.game,x,y,'trigger');
  this.width *=5;
  this.height *= 5;

  this.game.physics.arcade.enable(this);
  this.zone = zone;
  this.game.physics.arcade.overlap(this, this.game.link, this.spawn, null, this);
  this.game.debug.body(this);
}

ZoneTrigger.prototype = Object.create(Phaser.Sprite.prototype);
ZoneTrigger.prototype.constructor = ZoneTrigger;
ZoneTrigger.prototype.spawnZone = function(){
  var zoneEnemies = this.playScene.findObjectsByType('spawn'+this.zone,'Esqueletos');
  console.log(zoneEnemies);
  zoneEnemies.forEach(function(element) {
    var nStalker = new Stalker(this.game,element.x*5,element.y*5,this.playScene.link);
    this.game.enemies.add(nStalker);
  }, this);
  this.game.world.bringToTop(this.game.enemies);
  this.destroy();
  console.log("Hola");
}
ZoneTrigger.prototype.update = function(){
  this.game.physics.arcade.overlap(this.playScene.link,this,this.spawnZone,null,this);
}



module.exports = PlayScene;
