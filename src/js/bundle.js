(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
function Character(game,spriteName,x,y,vel,life,damage){
    this.game = game; 
    //Hacemos el sprite
    Phaser.Sprite.call(this,this.game,x,y,spriteName);
    this.scaleSprite(4.5,4.5);
    this.smoothed = false;
    //Inicializamos las fisicas
    this.initPhysics();
    //Rellenamos e inicializamos los fields
    this.x = x;
    this.y = y;
    this.vel = vel;
    this.velX = 0;
    this.velY = 0;
    this.dmg = damage;
    this.dir = 'None';
    this.life = life;
    //this.anchor.x = this.anchor.y = this.width / 2;
    //Cosas del knockback
    this.control = true;
    this.knockback = false;

    this.game.world.addChild(this);
}
//Herencia
Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.walk = function(){
  //Movemos
  if(this.control){
    if(this.move){
      this.body.velocity.x = this.velX*this.vel;
      this.body.velocity.y = this.velY*this.vel;
    }
    else {
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
    }
  }
}
Character.prototype.update = function(){
  if(this.life <= 0)
    this.destroy();
  if(this.knockback)
    checkKnocked();
}

Character.prototype.damage= function(character){
    character.life -= this.dmg;
}

Character.prototype.die = function(){
    if(this.life <= 0)
        this.destroy();
}

Character.prototype.initPhysics = function(){
  //Fisicas!
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = true;
  //this.body.bounce.setTo(1, 1);

  this.body.moves = true;
  this.body.immovable = true;
}

Character.prototype.scaleSprite = function(w,h){
  this.width *=w;
  this.height *=h;
}

Character.prototype.applyKnockback = function(enemy){

  var distance = 200;

  if(!this.knockback){
    //Nos volvemos invulnerables
    this.inmortal = true;
    this.control = false;
    //Vector de direccion del knockback
    this.knockedDir (enemy);	
    console.log("DirX : " +this.knockDirX + " DirY: " +this.knockDirY);
    //Empuje
    var knockedVelocityX= this.knockDirX * 500;	
    var knockedVelocityY= this.knockDirY * 500;
    //console.log(knockedVelocityX);	
    this.body.velocity.x = knockedVelocityX;
    this.body.velocity.y = knockedVelocityY;
    //Y nos ponemos translucidos
    this.alpha = 0.5;
    this.knockback = true;
    this.game.time.events.add(Phaser.Timer.SECOND  * 0.2, this.stopKnocked, this);
  }
}

Character.prototype.knockedDir = function(enemy){
  //Vector direccion del knockback
  var dx = this.x - enemy.x;
  var dy = this.y - enemy.y;
  if(Math.abs(dx) > Math.abs(dy)){
    this.knockDirX = dx / Math.abs(dx);
    this.knockDirY = 0;
  }
  else{
    this.knockDirY = dy / Math.abs(dy);
    this.knockDirX = 0;
  }
}

//Vemos si hemos acabado el knockback (*KNOCK* *KNOCK* *KNOCK* PENNY...)
Character.prototype.stopKnocked = function(){
  if(this.body !== null){
  //Si hemos sido empujados tan lejos como tendriamos, reset

  //Vemos en que direccion estamos siendo noqueados
  console.log("He parado el knock");
  this.knockback = false;
  //La velocidad
  this.body.velocity.x = 0;
  this.body.velocity.y = 0;
  //Y activamos el flag de control
  this.control = true;
  this.knockedToX = 0;
  this.knockedToY = 0;
  //Y nos ponemos normal
  this.alpha = 1;}
}
Character.prototype.spawn = function(x,y){
  this.x = x;
  this.y = y;
}
module.exports = Character;
},{}],2:[function(require,module,exports){
'use strict';
var Character = require('./character.js');
var Shot = require('./shot.js');


function Hero(game){
    this.game = game;
    this.keyboard = this.game.input.keyboard;
    this.canAttack = true;
    this.attacking = false;
}

//Enlazamos las propiedades prototype   
Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

//La funcion para inicializar, crear el sprite y sus variables
Hero.prototype.create = function(){
    //Hacemos el Personaje
    Character.call(this,this.game,'heroAnimations',0,0,3,3,3);
    //this.anchor.setTo(0.5, 0.5);

    this.keyBindings();
    this.iniAttackColliders();
    this.animations.add('walkRight', Phaser.Animation.generateFrameNames('walk', 0, 7), 12, true);
    this.animations.add('walkLeft', Phaser.Animation.generateFrameNames('walk', 8, 15), 12, true);
    this.animations.add('walkTop', Phaser.Animation.generateFrameNames('walk', 16, 23), 12, true);
    this.animations.add('walkDown', Phaser.Animation.generateFrameNames('walk', 24, 31), 12, true);

    this.animations.add('idleRight', Phaser.Animation.generateFrameNames('walk', 0, 0), 1, false);
    this.animations.add('idleLeft', Phaser.Animation.generateFrameNames('walk', 8, 8), 1, false);
    this.animations.add('idleTop', Phaser.Animation.generateFrameNames('walk', 16, 16), 1, false);
    this.animations.add('idleDown', Phaser.Animation.generateFrameNames('walk', 24, 24), 1, false);

    this.animations.add('attackRight', Phaser.Animation.generateFrameNames('attack', 0, 11), 20, false);
    this.animations.add('attackTop', Phaser.Animation.generateFrameNames('attack', 12, 23), 20, false);
    this.animations.add('attackLeft', Phaser.Animation.generateFrameNames('attack', 24, 35), 20, false);
    this.animations.add('attackDown', Phaser.Animation.generateFrameNames('attack', 36, 47), 20, false);
}
//Update, lee input y se mueve / dispara
Hero.prototype.update = function(){
  this.game.physics.arcade.overlap(this, this.game.enemies,this.playerCollision,null,this);
  //this.game.physics.arcade.collide(this,this.game.Paredes);
if (this.move && this.canAttack) {
  if (this.dir === 'Up') 
    this.animations.play('walkTop');
  else if(this.dir ==='Down')
    this.animations.play('walkDown');
  else if(this.dir === 'Left')
    this.animations.play('walkLeft');
  else 
    this.animations.play('walkRight');
}
else if (this.canAttack){
  if (this.dir === 'Up') 
    this.animations.play('idleTop');
  else if(this.dir ==='Down')
   this.animations.play('idleDown');
  else if(this.dir === 'Left')
    this.animations.play('idleLeft');
  else 
    this.animations.play('idleRight');
  }

console.log(this.dir);

  if(this.life <= 0)
    this.destroy();
  this.input();
  this.walk();
  //Objeto(Disparar)
  if(this.space.isDown){
    if(this.canShoot)
      this.shoot();
  }
  this.attack();
  
}

//Input del Heroe ////FEOOO////
Hero.prototype.input = function(){
      //Y axis
      if(this.upKey.isDown){
        //if(this.dir === 'None')
          this.dir = 'Up'
        this.velY = -200;
        this.move = true;
      }
      else if(this.downKey.isDown){
        //if(this.dir === 'None')
          this.dir = 'Down'
        this.velY = 200;
        this.move = true;
      }
      else {
        if(this.velX != 0)
          this.velY = 0;
        else
          this.move = false; 
      }
      //X Axis
      if(this.leftKey.isDown){
        this.dir = 'Left';
        this.move = true;
        this.velX = -200;
      }
      else if (this.rightKey.isDown){
        this.dir = 'Right';
        this.move = true;
        this.velX = 200;
      }
      else{
        if(this.velY != 0)
          this.velX = 0;
        else
          this.move = false;  
      }

}
//Disparo
Hero.prototype.shoot = function(){
  //Creamos la nueva flecha, la añadimos al mundo y al grupo
  var arrow = new Shot(this.game,this.x,this.y,5,this.velX,this.velY,'link');
  this.game.world.addChild(arrow);
  this.game.arrows.add(arrow);
  //Y preparamos las cosas para que no puedas disparar hasta dentro de 1 sec
  this.canShoot = false;
  this.game.time.events.add(Phaser.Timer.SECOND  * .5, this.shootCD, this);
}
//Vuelve a poner el cd a 0
Hero.prototype.shootCD = function(){
  this.canShoot = true;
}

  //Ataque
Hero.prototype.attack = function(){
  this.atacking = true;
/*
  this.game.debug.body(this);
  
  this.game.debug.body(this.rightAttack);
  this.game.debug.body(this.leftAttack);
  this.game.debug.body(this.topAttack);
  this.game.debug.body(this.downAttack);

*/
  if(this.eKey.isDown && this.canAttack){
    console.log(this.dir);  
    if (this.dir === 'Right') {
      this.animations.play('attackRight');
      this.game.physics.arcade.overlap(this.rightAttack, this.game.enemies, this.rightAttack.hitEnemyMele, null, this);
      
    }
    else if (this.dir === 'Left') {
      this.animations.play('attackLeft');
      this.game.physics.arcade.overlap(this.leftAttack, this.game.enemies, this.leftAttack.hitEnemyMele, null, this);
    }
    else if (this.dir === 'Up') {
      this.animations.play('attackTop');
      this.game.physics.arcade.overlap(this.topAttack, this.game.enemies, this.topAttack.hitEnemyMele, null, this);
    }
    else if (this.dir === 'Down') {
      this.animations.play('attackDown');
      this.game.physics.arcade.overlap(this.downAttack, this.game.enemies, this.downAttack.hitEnemyMele, null, this);
    }
    this.canAttack = false;

    this.game.time.events.add(Phaser.Timer.SECOND  * 0.5, this.attackCD, this);
  }
}

Hero.prototype.attackCD = function(){
  this.canAttack = true;
}

//Crea las teclas de input
Hero.prototype.keyBindings = function(){
  //KeyBindings
  this.upKey = this.keyboard.addKey(Phaser.Keyboard.UP);
  this.downKey = this.keyboard.addKey(Phaser.Keyboard.DOWN);
  this.leftKey = this.keyboard.addKey(Phaser.Keyboard.LEFT);
  this.rightKey = this.keyboard.addKey(Phaser.Keyboard.RIGHT);
  this.space = this.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.eKey = this.keyboard.addKey(Phaser.Keyboard.E);
  this.canShoot = true;
}

Hero.prototype.iniAttackColliders = function() {
  this.rightAttack = new attackCollider(this.game, this.x  + 16, this.y, this.width, this.height);
  this.leftAttack = new attackCollider(this.game, this.x - 16,this.y, this.width, this.height);
  this.topAttack = new attackCollider(this.game, this.x, this.y - 16, this.width, this.height);
  this.downAttack = new attackCollider(this.game, this.x, this.y + 16, this.width, this.height);

  this.game.world.addChild(this.rightAttack);
  this.game.world.addChild(this.leftAttack);
  this.game.world.addChild(this.topAttack);
  this.game.world.addChild(this.downAttack);
  
  this.addChild(this.rightAttack);
  this.addChild(this.leftAttack);
  this.addChild(this.topAttack);
  this.addChild(this.downAttack);



}

Hero.prototype.playerCollision = function(player, enemy){
  this.applyKnockback(enemy);
}


function attackCollider(game, nx, ny, nw, nh) {
  this.game = game;
  Phaser.Sprite.call(this, this.game, nx, ny);
  this.game.physics.enable(this);
  //this.x = nx;
  //this.y = ny;
  this.body.width = nw;
  this.body.height = nh;
}

attackCollider.prototype = Object.create(Phaser.Sprite.prototype);
attackCollider.constructor =  attackCollider;
/*
attackCollider.prototype.update= function(){
  this.game.debug.body(this);
  this.game.physics.arcade.overlap(this, this.game.enemies, this.hitEnemy, null,this);

  if(this.game.physics.arcade.overlap(this, enemy)) {
    console.log("INVISWALL") 
   }
}
*/
attackCollider.prototype.hitEnemyMele = function(attack, enemy) {
  console.log(enemy.life);

  //Se deberia llamar a la funcion damage
  if(enemy.life >= 1)
    enemy.life--;
    enemy.applyKnockback(enemy.target);
}

module.exports = Hero;
},{"./character.js":1,"./shot.js":5}],3:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen

  },

  create: function () {

    //Start the physics system
    //game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.game.load.baseURL = 'https://bornunez.github.io/undefined/src';
    
    this.game.load.crossOrigin = 'anonymous';



    // TODO: load here the assets for the game
    this.game.load.image('link', '/images/link.png');
    this.game.load.image('skeleton', '/images/skeleton.png');
    this.game.load.image('HUD', '/images/HUD.png');
    //this.game.load.spritesheet('linkWalk', 'images/Walk.png',  24, 32, 32);
    this.game.load.atlas('heroAnimations', '/images/heroSpritesheet.png', '/images/heroSpritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //Load map
    //Here we'll load the tilemap data. The first parameter is a unique key for the map data.

    //  The second is a URL to the JSON file the map data is stored in. This is actually optional, you can pass the JSON object as the 3rd
    //  parameter if you already have it loaded. In which case pass 'null' as the URL and
    //  the JSON object as the 3rd parameter.

    //  The final one tells Phaser the foramt of the map data, in this case it's a JSON file exported from the Tiled map editor.
    //  This could be Phaser.Tilemap.CSV too.

    this.game.load.tilemap('map', '/mapas/EastPalace1.json',null, Phaser.Tilemap.TILED_JSON);
    
    //  Next we load the tileset. This is just an image, loaded in via the normal way we load images:
    
    this.game.load.image('tiles', '/mapas/TileSet32.png');
    this.game.load.image('objetos', '/mapas/TileSet16.png');
  },

  create: function () {
    this.game.state.start('play');
  }
};


window.onload = function () {
  var game = new Phaser.Game(1080, 720, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');

  
};

},{"./play_scene.js":4}],4:[function(require,module,exports){
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
    this.loadEnemies();
    
    //Layer de los colliders de las paredes
    this.Colisiones = this.createLayer("Colisiones");
    this.map.setCollision(206,true,this.Colisiones);
    //this.Colisiones.debug =true;
    //Y encima el techo
    this.Techo = this.createLayer("Techo");
    //Y abajo del todo el HUD/*
    
    this.HUD = this.game.add.sprite(0,0,'HUD');
    this.HUD.smoothed = false;
    this.HUD.width *= 5.2;
    this.HUD.height *= 5.2;
    this.HUD.fixedToCamera = true;
    this.Techo.resizeWorld();
    //AQui creamos los objs
    this.map.createFromTiles(197,null,'link',this.Objetos,this.spawnG);
    this.link.x = this.spawnG.getChildAt(0).x;
    this.link.y = this.spawnG.getChildAt(0).y;
    //this.link.spawn(this.spawn.x, this.spawn.y);
  },
  
  loadEnemies: function(){
    console.log(this.map.createFromTiles(202,null,'skeleton',this.Objetos,this.enemiesSprite));
    for(var i = 0; i < this.enemiesSprite.total;i++){
      var enemy = new Stalker(this.game,this.enemiesSprite.getChildAt(i).x,this.enemiesSprite.getChildAt(i).y,this.link);
      this.game.enemies.add(enemy);
    }
    this.game.world.bringToTop(this.game.enemies);
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

},{"./character.js":1,"./hero.js":2,"./stalker.js":6}],5:[function(require,module,exports){
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
},{"./character.js":1}],6:[function(require,module,exports){
'use strict';
var Character = require('./character.js');

function Stalker(game,x,y,target){
    this.game = game;
    Character.call(this,this.game,'skeleton',x,y,1,3,1);
    this.target = target;
}
//Enlazamos las propiedades prototype   
Stalker.prototype = Object.create(Character.prototype);
Stalker.prototype.constructor = Stalker;

Stalker.prototype.update = function() {
    if(this.life <= 0)
        this.destroy();
    else if(this.control)
        this.move();
}

Stalker.prototype.move = function(){
    var t = {};
    var targetMoving = false;
  
    //Se asigna la x y la y del target
    t.x = this.target.x;
    t.y = this.target.y;
  
    // Calcula la distancia que lo separa del target
    // Si el target esta lo suficientemente lejos el enemigo se movera
    var distance = this.game.math.distance(this.x, this.y, t.x, t.y);
    if (distance > 32 && distance < 320){ 
            targetMoving = true;
    }    
    if (targetMoving)  {
        // Calcula el angulo entre el target y el enemigo
        var rotation = this.game.math.angleBetween(this.x, this.y, t.x, t.y);
        // Calcula el vector velocidad basandose en su rotacion
        this.body.velocity.x = Math.cos(rotation) * 100;
        this.body.velocity.y = Math.sin(rotation) * 100;
    } else {
        //this.body.velocity.setTo(0, 0);
    }
}

module.exports = Stalker;
},{"./character.js":1}]},{},[3]);
