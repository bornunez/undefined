'use strict';

var Hero = require('./hero.js');
var Character = require('./character.js');
var Stalker = require('./stalker.js');
var Cyclops = require('./cyclops.js');
var BossArmy = require('./bossArmy.js');
var Boss = require('./boss.js');
var Room = require('./room.js');
var HUD = require('./HUD.js');
var Door = require('./door.js');
var Chest = require('./Chest.js');

var NUMROOMS = 12;
const MAPSCALE = 5;

var PlayScene = {
  create: function () {
    
    this.game.Puertas = this.game.add.group();
    this.game.arrows = this.game.add.group();
    this.PoolEnemies = this.game.add.group();
    this.PoolCyclops = this.game.add.group();
    this.game.activeEnemies = this.game.add.group();
    this.game.activeCyclops = this.game.add.group();
    this.spawnG = this.game.add.group(); 
    this.enemiesSprite = this.game.add.group();
    this.game.items = this.game.add.group();
    this.game.chests = this.game.add.group();
    this.kb = this.game.input.keyboard;
    this.esc = this.kb.addKey(Phaser.Keyboard.ESC);

    this.game.music = this.game.add.audio('game_theme');
    this.game.music.loop = true;
    this.game.music.play();

    this.loadMap();
    this.createGO();
    this.loadEnemies();
    this.loadRooms();

    //BOSS
    this.game.bossArmy = new BossArmy(this.game, this.link.x+60, this.link.y-500, this.link, MAPSCALE, 1, 1, 'bossAnimations');

    this.pauseGame();
    
    this.HUD = new HUD(this.game, this.link);
  },
  update: function(){

    this.rooms.forEach(function(element) {
      element.update();
    }, this);
    
    this.game.bossArmy.update();

    //Colisiones con el escenario
    this.game.physics.arcade.collide(this.game.activeEnemies,this.Colisiones);
    this.game.physics.arcade.collide(this.game.activeCyclops,this.Colisiones);
    this.game.physics.arcade.collide(this.game.bosses, this.Colisiones);
    this.game.physics.arcade.collide(this.game.bosses, this.game.Puertas);

    //Truco para probar el juego saltandose las colisiones
    if(!this.link.fly)
      this.game.physics.arcade.collide(this.link,this.Colisiones);

    this.game.world.bringToTop(this.HUDNegro);
    this.HUD.update();
 
    if(this.esc.isDown){
      this.game.inventory.reset(0,0,100);
      this.game.world.bringToTop(this.game.inventory);
      this.game.paused = true;
    }
  },
  loadMap: function(){
    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('Zelda', 'tiles');
    this.map.addTilesetImage('Objects', 'objetos');
    //tileset ID (number)
    this.tilesetID = this.map.getTilesetIndex("Objects");
    this.tilesetID = this.map.getTilesetIndex("Zelda");
  },

  createLayer: function(name){
    var layer = this.map.createLayer(name);
    layer.smoothed = false;
    layer.setScale(MAPSCALE);
    return layer;
  },

  createGO: function(){
    //Debajo de todo esta el suelo
    this.Suelo = this.createLayer("Suelo");
    //Y encima las paredes
    this.Paredes = this.createLayer("Paredes");

    //Crear el heroe
    this.link = new Hero(this.game,this);
    this.link.create();
    this.game.camera.follow(this.link);
    //Offset de la camara 
    this.loadDoors(this);
    // Carga los cofres
    this.loadChests();
    //Luego las vallas
    this.Vallas = this.createLayer("Vallas");
    this.Vallas2 = this.createLayer("Vallas 2");
    this.Objetos = this.createLayer("Objetos");
    //Layer de los s de las paredes
    this.Colisiones = this.createLayer("Colisiones");
    this.map.setCollision(206,true,this.Colisiones);
    //AQui creamos los objs
    this.map.createFromTiles(197,null,'link',this.Objetos,this.spawnG);
    this.link.x = this.spawnG.getChildAt(0).x;
    this.link.y = this.spawnG.getChildAt(0).y;
    //Y encima el techo
    this.Techo = this.createLayer("Techo");
    //Y abajo del todo el HUD
    this.HUDNegro = this.game.add.sprite(0,0,'HUD');
    this.HUDNegro.smoothed = false;
    this.HUDNegro.width *= 26/25 * MAPSCALE;
    this.HUDNegro.height *= 26/25 * MAPSCALE ;
    this.HUDNegro.fixedToCamera = true;
    this.Techo.resizeWorld();

    this.game.inventory  = this.game.add.sprite(0, 0,'inventory');
    this.game.inventory.fixedToCamera = true;
    this.game.inventory.smoothed = false;
    this.game.inventory.width = this.game.width;
    this.game.inventory.height = this.game.height;
    this.game.inventory.kill();
  },
  loadRooms: function(){
    this.rooms = new Array();
    for(var i = 0;i<NUMROOMS;i++){
      var room = new Room(this.game,this,MAPSCALE,i);
      this.rooms.push(room);
    }
  },
  //Pooling
  loadEnemies: function(){
    for(var i=0;i<10;i++){
      var enemy = new Stalker(this.game,this,0,0,this.link, MAPSCALE, 'enemyAnimations');
      var ciclo = new Cyclops(this.game,this,0,0,this.link,this.MAPSCALE, 'cyclopsAnimations');
      enemy.kill();
      ciclo.kill();
      this.PoolCyclops.add(ciclo);
      this.PoolEnemies.add(enemy);
    }
  },

  addEnemy: function(x,y,room,enemyType){
    var enemy;
    if(enemyType === 'stalker'){
      if (this.PoolEnemies.length > 0) {
        enemy = this.PoolEnemies.getChildAt(0);
        enemy.reset(x, y, 3);
        enemy.health = 3;
        enemy.body.enable = true;
        enemy.dead = false;
      }
      else {
        enemy = new Stalker(this.game, this, x, y, this.link, MAPSCALE, 'enemyAnimations');
      }
      this.game.activeEnemies.add(enemy);
    }
    else if(enemyType === 'ciclo'){
      if (this.PoolCyclops.length > 0) {
        enemy = this.PoolCyclops.getChildAt(0);
        enemy.reset(x, y, 3);
        enemy.dead = false;
        enemy.body.enable = true;
        enemy.health = 3;
      }
      else {
        enemy = new Cyclops(this.game, this, x, y, this.link, MAPSCALE, 'cyclopsAnimations');
      }
      this.game.activeCyclops.add(enemy);
    }
    enemy.room = room;
    this.game.world.bringToTop(this.game.activeEnemies);
    this.game.world.bringToTop(this.game.activeCyclops);
    return enemy;
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

  //Crea todos los cofres del juego
  loadChests: function() {
    var self = this;
    this.map.objects["Cofres"].forEach(function(element){
      if(element.type === "bow")
        new Chest( self.game, self.link, element.x * MAPSCALE, element.y * MAPSCALE, MAPSCALE, 'bow');
      else if(element.type === 'keyboss') 
        new Chest( self.game, self.link, element.x * MAPSCALE, element.y * MAPSCALE, MAPSCALE, 'keyboss');
      else if(element.type === 'llave') 
        new Chest( self.game, self.link, element.x * MAPSCALE, element.y * MAPSCALE, MAPSCALE, 'key');

    });
  this.game.world.bringToTop(this.game.chests)
  this.game.world.bringToTop(this.link);
  },
  loadDoors: function(playSC){
    var self = this;
    var puerta;
    playSC.map.objects["Puertas"].forEach(function(element){
      var x,y;
      x = element.x * MAPSCALE; y = element.y * MAPSCALE;
      if(element.type === "BD") {
        //Puerta boss
        puerta = new Door(playSC.game,playSC.link,x,y,MAPSCALE,true);
      }      
      else if(element.type === "LD"){
        puerta = new Door(playSC.game,playSC.link,x,y,MAPSCALE,false);
        //Puerta normal
      }

    });
  },

  pauseGame: function() {
    this.esc.onDown.add(function unpause(self){
      self.game.inventory.kill(); 
      self.game.paused = false; 
    });

  }
};

module.exports = PlayScene;
