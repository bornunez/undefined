(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var Character = require('./character.js');
var Boss = require('./boss.js');

const NUM_POINTS = 6;
const NUM_BOSS = 6;
const BOSS_VEL = 200;


function BossArmy(game, x, y, target, health,damage,spriteName){
    this.game = game; 
    this.target = target;
    this.pointNumber = 0;
    this.points =new Array(); 
    this.game.bosses = this.game.add.group();
}

//Herencia
BossArmy.prototype =  Object.create(Phaser.Sprite.prototype);
BossArmy.prototype.constructor = Boss;

BossArmy.prototype.create = function(){
  var numPoint = 0;   //Variable que maneja en que punto aparece cada Boss
  this.points.forEach(function(element) {
    var boss =  new Boss(this.game, element.x , element.y , this.target, BOSS_VEL, 1, 1, this.points, 'bossAnimations', numPoint);
    numPoint++; 
    this.game.bosses.add(boss);
      }, this);
    this.game.world.bringToTop(this.game.bosses);
}

module.exports = BossArmy;
},{"./boss.js":9,"./character.js":11}],2:[function(require,module,exports){
'use strict'
var Hero = require('./hero.js');
var ItemType = require('./ItemType.js');

function Chest(game, hero, x, y, MAPSCALE, reward){
    this.game = game;
    this.hero = hero;
    this.open = false;
    this.reward = reward;
    //Creamos el objeto y le damos cuerpo
    Phaser.Sprite.call(this,this.game, x, y, 'chest');
    this.open_chest = this.game.add.audio('open_chest');
    this.smoothed = false;
    this.scale.setTo(MAPSCALE,MAPSCALE);
    this.initPhysics();
    this.anchor.setTo(0, 0.5)
    this.game.chests.add(this);
    this.game.world.bringToTop(this.game.items);
}

//Las cosas de herencia
Chest.prototype = Object.create(Phaser.Sprite.prototype);
Chest.prototype.constructor = Chest;

Chest.prototype.update = function (){
    this.game.physics.arcade.collide(this, this.hero);
    this.interact();
}

Chest.prototype.interact = function() {
    if(this.hero.cKey.isDown && this.hero.anim === 'Idle')
      this.game.physics.arcade.overlap(this.hero.topAttack, this, this.openChest, null, this);
  }
  
Chest.prototype.openChest = function(){
    if(!this.open) {
        this.frame = 1; 
        this.open = true;
        this.open_chest.play();
        this.hero.anim = 'Win';

        if (this.reward === 'bow') {
            this.hero.animations.play('winBow');  
            this.hero.bow = true;
        }
        else if (this.reward === 'keyboss') {
            this.hero.animations.play('winBoss');  
            this.hero.keyboss = true;
        }
        else if (this.reward === 'key') {
            this.hero.animations.play('winKey');  
            this.hero.items[ItemType.Keys]++;
        }

    this.game.time.events.add(Phaser.Timer.SECOND  * 1, function() { this.hero.anim = 'Idle' }, this);
    }
  }
  
Chest.prototype.initPhysics = function() {
    this.game.physics.arcade.enable(this);
    //Fisicas
    this.body.collideWorldBounds = true;
    this.body.bounce.setTo(1, 1);
    this.body.moves = true;
    this.body.immovable = true;
  }


module.exports = Chest;
},{"./ItemType.js":7,"./hero.js":14}],3:[function(require,module,exports){
var EndMenu = {
    preload: function(){
      this.game.load.image('gameover','/images/gameover.png');
    },
    create:function(){
      var background  = this.game.add.sprite(0,0,'gameover');
      background.smoothed = false;
      background.width = this.game.stage.width;
      background.height =this.game.stage.height;

      this.game.music = this.game.add.audio('gameover_theme');
      this.game.music.loop = true;
      this.game.music.play();
  
      this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
      
      var button = this.game.add.button(0,0, 'playButton', this.actionOnClick, this);
      button.anchor.setTo( 0.5, 0.5);
      button.x = this.game.world.centerX;
      button.y = this.game.world.centerY + 200;
      button.smoothed = false;
      this.game.world.bringToTop(button);
    },
    update: function(){
        if(this.enterKey.isDown){
          this.game.music.stop();
          this.game.state.start('introMenu');
        }
    }
  }

  module.exports = EndMenu;
},{}],4:[function(require,module,exports){
'require strict'
var ItemType = require('./ItemType.js');

function HUD(game, hero){
    this.game = game;
    this.hero = hero;
    this.hearts = this.game.add.group();

    this.heart1 = new Hearts(this.game, this.hero, 240, 40);
    this.heart2 = new Hearts(this.game, this.hero, 200, 40);    
    this.heart3 = new Hearts(this.game, this.hero, 160, 40);
    this.itembox = new ItemBox(this.game, this.hero, 20, 0);
    this.arrowIcon = new ItemIcon(this.game, this.hero, 320, 0, 'arrowicon');
    this.keybossIcon= new ItemIcon(this.game, this.hero, 530, 20, 'keybossicon');
    this.arrowCounter = new ItemCounter(this.game, this.hero, 340, 50, 'numbers');
    this.arrowCounter2 = new ItemCounter(this.game, this.hero, 320, 50, 'numbers');
    this.rublosIcon = new ItemIcon(this.game, this.hero, 400, 20, 'rublos');
    this.rublosCounter = new ItemCounter(this.game, this.hero, 420, 50, 'numbers');
    this.rublosCounter2 = new ItemCounter(this.game, this.hero, 400, 50, 'numbers');

    this.keysIcon = new ItemIcon(this.game, this.hero, 480, 20, 'keys');
    this.keysCounter = new ItemCounter(this.game, this.hero, 480, 50, 'numbers');

    this.hearts.add(this.heart1);
    this.hearts.add(this.heart2);
    this.hearts.add(this.heart3);
}

HUD.prototype.constructor = HUD;

HUD.prototype.update = function() {
    this.hudToTop();
    this.updateHealth();

    this.arrowCounter.frame =  this.hero.items[ItemType.Arrows] - (Math.trunc(this.hero.items[ItemType.Arrows] / 10) * 10) ;
    this.arrowCounter2.frame = Math.trunc(this.hero.items[ItemType.Arrows] / 10);

    this.rublosCounter.frame =  this.hero.items[ItemType.Rublos] - (Math.trunc(this.hero.items[ItemType.Rublos] / 10) * 10) ;
    this.rublosCounter2.frame = Math.trunc(this.hero.items[ItemType.Rublos] / 10);

    this.keysCounter.frame =  this.hero.items[ItemType.Keys];

    if (this.hero.bow) {
        this.itembox.frame = 1;
        this.game.inventory.frame = 1;
    }
    if (this.hero.keyboss) {
        this.game.world.bringToTop(this.keybossIcon);
    }
}

HUD.prototype.updateHealth = function(){
    if(this.hero.items[ItemType.Hearts]  === 6) {
        this.heart1.frame = 0;
        this.heart2.frame = 0;
        this.heart3.frame = 0;
    }
    else if(this.hero.items[ItemType.Hearts]  === 5) {
        this.heart1.frame = 1;
        this.heart2.frame = 0;
        this.heart3.frame = 0;
    }
    else if(this.hero.items[ItemType.Hearts]  === 4) {
        this.heart1.frame = 2;
        this.heart2.frame = 0;
        this.heart3.frame = 0;
    }
    else if(this.hero.items[ItemType.Hearts]  === 3) {
        this.heart1.frame = 2;
        this.heart2.frame = 1;
        this.heart3.frame = 0;
    }
    else if(this.hero.items[ItemType.Hearts]  === 2) {
        this.heart1.frame = 2;
        this.heart2.frame = 2;
        this.heart3.frame = 0;
    }
    else if(this.hero.items[ItemType.Hearts]  === 1) {
        this.heart1.frame = 2;
        this.heart2.frame = 2;
        this.heart3.frame = 1;
    }
    else if(this.hero.items[ItemType.Hearts]  === 0) {
        this.heart1.frame = 2;
        this.heart2.frame = 2;
        this.heart3.frame = 2;
    }
}

HUD.prototype.hudToTop = function(){
    this.game.world.bringToTop(this.hearts);
    this.game.world.bringToTop(this.itembox);
    this.game.world.bringToTop(this.arrowIcon);
    this.game.world.bringToTop(this.arrowCounter);
    this.game.world.bringToTop(this.arrowCounter2);
    this.game.world.bringToTop(this.rublosIcon);
    this.game.world.bringToTop(this.rublosCounter);
    this.game.world.bringToTop(this.rublosCounter2);
    this.game.world.bringToTop(this.keysIcon);
    this.game.world.bringToTop( this.keysCounter);
}

//Los corazones del HUD
function Hearts(game, hero,x ,y){
  this.game = game;
  this.hero = hero;

  Phaser.Sprite.call(this,this.game, x, y,'hearts');
  this.frame = 0;
  this.fixedToCamera = true;
  this.smoothed = false;
  this.scale.setTo(5,5);
  this.game.world.addChild(this);
}
Hearts.prototype = Object.create(Phaser.Sprite.prototype);
Hearts.prototype.constructor = Hearts;

//ItemBox
function ItemBox(game, hero, x , y){
  this.game = game;
  this.hero = hero;

  Phaser.Sprite.call(this,this.game, x, y, 'itembox');
  this.frame = 0;
  this.fixedToCamera = true;
  this.smoothed = false;
  this.scale.setTo(5,5);
  this.game.world.addChild(this);
}
ItemBox.prototype = Object.create(Phaser.Sprite.prototype);
ItemBox.prototype.constructor = ItemBox;

//Icono de item
function ItemIcon(game, hero, x , y, spritename){
  this.game = game;
  this.hero = hero;
  Phaser.Sprite.call(this,this.game, x, y, spritename);
  this.fixedToCamera = true;
  this.smoothed = false;
  this.scale.setTo(3,3);
  this.game.world.addChild(this);
}
ItemIcon.prototype = Object.create(Phaser.Sprite.prototype);
ItemIcon.prototype.constructor = ItemIcon;

//Items con contador
function ItemCounter(game, hero, x , y, spritename){
    this.game = game;
    this.hero = hero;
    Phaser.Sprite.call(this,this.game, x, y, spritename);
    this.fixedToCamera = true;
    this.smoothed = false;
    this.scale.setTo(3,3);
    this.game.world.addChild(this);
  }
  ItemCounter.prototype = Object.create(Phaser.Sprite.prototype);
  ItemCounter.prototype.constructor = ItemCounter;

module.exports = HUD;



},{"./ItemType.js":7}],5:[function(require,module,exports){

var IntroMenu = {
    preload: function(){
      this.game.load.spritesheet('introBG','/images/intro.png', 256, 144, 10);
    },
    create:function(){
      var background  = this.game.add.sprite(0, 0, 'introBG');
      background.smoothed = false;
      background.width = this.game.stage.width;
      background.height =this.game.stage.height;
      background.animations.add('run');
      background.animations.play('run', 10, false);

      this.game.music = this.game.add.audio('intro_theme');
      this.game.music.loop = true;
      this.game.music.play();

      this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    },
    actionOnClick: function () {
      this.game.state.start('play');
      },
      update: function(){
        if(this.enterKey.isDown){
          this.game.music.stop();
            this.game.state.start('play');
        }
      }
  }
  module.exports = IntroMenu;
},{}],6:[function(require,module,exports){
'use strict'

function Item(game,hero,type,x,y, spriteName,MAPSCALE){
    this.game = game;
    this.hero = hero;
    this.itType = type;
    //Creamos el objeto y le damos cuerpo
    Phaser.Sprite.call(this,this.game, x, y, spriteName);
    this.smoothed = false;
    this.scale.setTo(MAPSCALE,MAPSCALE);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.game.items.add(this);
    this.game.world.bringToTop(this.game.items);
}

//Herencia
Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

Item.prototype.update = function (){
    this.game.physics.arcade.collide(this,this.hero,this.addItem,null,this);

}

Item.prototype.addItem = function(){
    this.hero.addItem(this.itType);
    this.kill();
}

module.exports = Item;
},{}],7:[function(require,module,exports){
const ItemType = {
    Arrows: 0,
    Rublos: 1,
    Hearts: 2,
    Keys: 3,
    ASCIIForce: 4,
}
module.exports = ItemType;
},{}],8:[function(require,module,exports){
var WinMenu = {
    preload: function(){
      this.game.load.image('endscreen','/images/endscreen.png');
    },
    create:function(){
      var background  = this.game.add.sprite(0, 0,'endscreen');
      background.smoothed = false;
      background.width = this.game.stage.width;
      background.height =this.game.stage.height;
      
      this.game.music.stop();
      this.game.music = this.game.add.audio('win_theme');
      this.game.music.loop = true;
      this.game.music.play();
      this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    },
    update: function(){
        if(this.enterKey.isDown){
          this.game.music.stop();
          this.game.state.start('introMenu');
        }
    }
  }
  module.exports = WinMenu;
},{}],9:[function(require,module,exports){
'use strict';
var Character = require('./character.js');
var ItemType = require('./ItemType.js');
var Item = require('./Item.js');
var ItemSprite = ['arrow','rublos','hearts','keys','asciiforce',]

const NUM_POINTS = 6;
const POINT_OFFSET = 32;
const RAGEPOINT_OFFSET = 128;
const MAPSCALE = 5;

function Boss(game, x, y, target, vel, health, damage, points, spriteName, pointNumber){
    this.game = game; 
    this.target = target;
    this.pointNumber = pointNumber;
    Character.call(this,this.game, spriteName, x, y, vel, 2, 1);
    this.body.setSize(32, 32, 0, 16);
    this.focus = false;
    this.invulnerable = true;
    this.enragePoint = {
      'x': [],
      'y': []
      };
    this.points = points;
    this.animations.add('bossJump', Phaser.Animation.generateFrameNames('boss', 0, 9), 18, true);
    this.animations.add('bossEnraged', Phaser.Animation.generateFrameNames('enraged', 0, 9), 9, false);
    this.animations.add('bossHit', Phaser.Animation.generateFrameNames('enraged', 9, 18), 18, false);
    this.animations.play('bossJump');
}
//Herencia
Boss.prototype =  Object.create(Character.prototype);
Boss.prototype.constructor = Boss;

Boss.prototype.update = function(){
  if (this.game.bosses.length < 2) {
    this.body.setSize(32, 32, 0, 32);
    this.enrageMode();
    if(!this.invulnerable) {
      this.game.physics.arcade.overlap(this.target, this, this.target.playerCollision, null, this.target); 
    }
  }
  else {
    this.move();
    this.game.physics.arcade.overlap(this.target, this, this.target.playerCollision, null, this.target);
  }
}

Boss.prototype.move = function() {
  if((this.x > this.points[this.pointNumber].x + POINT_OFFSET || this.x < this.points[this.pointNumber].x - POINT_OFFSET) ||
    (this.y > this.points[this.pointNumber].y + POINT_OFFSET || this.y < this.points[this.pointNumber].y - POINT_OFFSET)) {
    this.game.time.events.add(Phaser.Timer.SECOND  * 1, this.goToPoint, this);
  }
  else {
    this.pointNumber++;
    if(this.pointNumber >= NUM_POINTS)
      this.pointNumber = 0;
  }
}

Boss.prototype.goToPoint = function() {
   if(!this.knockback) {
    var rotation = this.game.math.angleBetween(this.x, this.y, this.points[this.pointNumber].x , this.points[this.pointNumber].y);
    // Calcula el vector velocidad basandose en su rotacion
    this.body.velocity.x = Math.cos(rotation) * this.vel;
    this.body.velocity.y = Math.sin(rotation) * this.vel;
   }
}

Boss.prototype.enrageMode = function() {
  if(!this.focus) {
    this.animations.play('bossEnraged'); 
    this.enragePoint.x = this.target.x;
    this.enragePoint.y = this.target.y;
    this.focus = true;
  }
  var rotation = this.game.math.angleBetween(this.x, this.y, this.enragePoint.x, this.enragePoint.y);
  // Calcula el vector velocidad basandose en su rotacion
  this.body.velocity.x = Math.cos(rotation) * this.vel;
  this.body.velocity.y = Math.sin(rotation) * this.vel;

  if(this.x < this.enragePoint.x + RAGEPOINT_OFFSET && this.x > this.enragePoint.x - RAGEPOINT_OFFSET  && this.y < this.enragePoint.y + RAGEPOINT_OFFSET && this.y > this.enragePoint.y - RAGEPOINT_OFFSET && this.invulnerable) {
      this.invulnerable = false;
      this.animations.play('bossHit');
      this.animations.currentAnim.onComplete.add(this.hit, this);
  }
}


Boss.prototype.hit = function() {
  this.game.time.events.add(Phaser.Timer.SECOND  * 1.5, this.resetFocus, this);
}

Boss.prototype.resetFocus = function() {
    this.animations.play('bossEnraged'); 
    this.focus = false; 
    this.invulnerable = true;

}

Boss.prototype.die = function(){
  this.game.bosses.remove(this);
  var drop;
  if(this.game.bosses.length > 0)
  {
    drop = new Item(this.game, this.target, ItemType.Arrows , this.x, this.y, ItemSprite[ItemType.Arrows], MAPSCALE);
  }
  else{
    drop = new Item(this.game, this.target, ItemType.ASCIIForce , this.x, this.y, ItemSprite[ItemType.ASCIIForce], MAPSCALE);
  }
  this.game.world.bringToTop(drop);
  this.kill();
}

module.exports = Boss;
},{"./Item.js":6,"./ItemType.js":7,"./character.js":11}],10:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"./boss.js":9,"./character.js":11,"dup":1}],11:[function(require,module,exports){
'use strict';

const KNOCK_VEL = 500;

function Character(game, spriteName, x, y, vel, health, damage){
    this.game = game; 
    //Hacemos el sprite
    Phaser.Sprite.call(this,this.game,x,y,spriteName);
    this.scale.setTo(4.5,4.5);
    this.anchor.setTo(0.5, 0.5)
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
    this.dir = 'Down';
    this.health = health;
    //Knockback
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
  if(this.health <= 0)
    this.destroy();
  if(this.knockback)
    checkKnocked();
}

Character.prototype.damage= function(character){
    character.health -= this.dmg;
}

Character.prototype.die = function(){
    if(this.health <= 0)
        this.destroy();
}

  //Fisicas
Character.prototype.initPhysics = function(){
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = true;
  this.body.moves = true;
}

Character.prototype.applyKnockback = function(enemy){

  var distance = 200;

  if(!this.knockback){
    //Quita vida
    enemy.damage(this);
    //Nos volvemos invulnerables
    this.inmortal = true;
    this.control = false;
    //Vector de direccion del knockback
    this.knockedDir (enemy);	
    //Empuje
    var knockedVelocityX = this.knockDirX * KNOCK_VEL;	
    var knockedVelocityY = this.knockDirY * KNOCK_VEL;	
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
    //Si hemos sido empujados tan lejos como tendriamos, se vuelve al estado normal
    this.knockback = false;
    //La velocidad
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    //Y activamos el flag de control
    this.control = true;
    this.knockedToX = 0;
    this.knockedToY = 0;
    //Y si es un enemigo se pone normal, el heroe no ya que es invulnerable despues de que acabe el knockback
    if(this.target != null)
      this.alpha = 1;
      
    this.x = Math.trunc(this.x);
    this.y = Math.trunc(this.y);
  }
}

Character.prototype.spawn = function(x,y){
  this.x = x;
  this.y = y;
}

module.exports = Character;
},{}],12:[function(require,module,exports){
'use strict';
var Character = require('./character.js');
var Stalker= require('./stalker.js');
var Item = require('./Item.js');
var ItemType = require('./ItemType.js');
var ItemSprite = ['arrow','rublos','hearts']

function Cyclops(game, playscene, x, y, target, MAPSCALE, spriteName){
    Stalker.call(this, game, playscene, x, y , target, MAPSCALE, spriteName);

    this.animations.add('cyclopsWake', Phaser.Animation.generateFrameNames('enemy', 10, 11), 1, false);

    this.sleep = true;
    this.focus = false;
    this.frame = 10;
    this.dir = 'Down';
    this.cyclops_awake = this.game.add.audio('cyclops_awake');
}
  
Cyclops.prototype = Object.create(Stalker.prototype);
Cyclops.prototype.constructor = Cyclops;


Cyclops.prototype.update = function() {
    if(this.health > 0) {
        if(this.sleep)
            this.wake();

        if (!this.sleep && !this.focus) {
            Stalker.prototype.getAngle.call(this);
            this.move();
        }
    }

    else if (!this.dead) {
        this.dead = true;
        this.body.enable = false;
        this.animations.play('enemyDying');
        this.kill_enemy.play();
        this.animations.currentAnim.onComplete.add(this.die, this);
    }
}

Cyclops.prototype.wake = function() {
    var distance = this.game.math.distance(this.x, this.y, this.target.x,  this.target.y);
    if (distance < this.minDistance){ 
            this.animations.play('cyclopsWake');
            this.animations.currentAnim.onComplete.add(function () { this.sleep = false;  this.cyclops_awake.play();}, this);
    }
}

Cyclops.prototype.move = function(){
    this.focus = true;

    if (this.game.math.distance(this.x, this.y, this.target.x,  this.target.y) > this.maxDistance){
        this.sleep = true;
        this.animations.stop();
       this.frame = 10;
    } 

    else if(this.dir === 'Right') {
        this.body.velocity.x = 300;
        this.body.velocity.y = 0;
    }
    else if(this.dir === 'Left') {
        this.body.velocity.x = -300;
        this.body.velocity.y = 0;
    }
    else if(this.dir === 'Top') {
        this.body.velocity.x = 0;
        this.body.velocity.y = -300;
    }
    else if(this.dir === 'Down') {
        this.body.velocity.x = 0;
        this.body.velocity.y = 300;
    }

    this.game.time.events.add(Phaser.Timer.SECOND  * 1.5, function() { this.focus= false; }, this); 
}

Cyclops.prototype.checkDir =  function(){
    if((this.dir === 'Right' && this.target.dir === 'Left') ||
        (this.dir === 'Left' && this.target.dir === 'Right') ||
        (this.dir === 'Top' && this.target.dir === 'Down') ||
        (this.dir === 'Down' && this.target.dir === 'Top'))
            return true;
    else
        return false;
}

Cyclops.prototype.die = function(){
    //Primero nos desactivamos
    this.kill();
    //Despues informamos a la sala en la que estamos de que nos hemos muerto ( Si estamos en alguna)
    if(this.room != undefined && this.room != null)
        this.room.killEnemy(this);
    //Y finalmente volvemos a la pool de enemigos
    this.playscene.PoolCyclops.add(this);

    var itemType = Math.floor((Math.random() * 10) + 1) % 3;
    var drop = new Item(this.game,this.target,itemType,this.x+this.width/3,this.y+this.height/3,ItemSprite[itemType],this.MAPSCALE);
}

module.exports = Cyclops;
},{"./Item.js":6,"./ItemType.js":7,"./character.js":11,"./stalker.js":19}],13:[function(require,module,exports){
'use strict'

function Door(game, hero,x,y,MAPSCALE,boss){
    this.game = game;
    this.hero = hero;
    this.boss = boss;
    var spriteName;
    
    if(this.boss)
        spriteName = 'bossDoor';
    else
        spriteName = 'lockedDoor';
    //Creamos el objeto y le damos cuerpo
    Phaser.Sprite.call(this,this.game,x,y,spriteName);
    this.smoothed = false;
    this.scale.setTo(MAPSCALE,MAPSCALE);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
    this.game.Puertas.add(this);
    this.game.world.bringToTop(this.game.Puertas);
    this.open_door = this.game.add.audio('open_door');
}
Door.prototype =  Object.create(Phaser.Sprite.prototype);
Door.prototype.constructor = Door;

Door.prototype.update = function(){
    this.game.physics.arcade.collide(this,this.hero,this.checkOpen,null,this);
}
Door.prototype.checkOpen = function(){
    if(this.boss){
        if(this.hero.keyboss){
            this.open_door.play();
            this.destroy();
        }
    }
    else{
        if(this.hero.items[3] > 0){
            this.destroy();
            this.hero.items[3]--;
            this.open_door.play();
        }
    }
}

module.exports = Door;
},{}],14:[function(require,module,exports){
'use strict';
var Character = require('./character.js');
var Shot = require('./shot.js');
var ItemType = require('./ItemType.js');

const HERO_VEL = 200;

function Hero(game,playScene){
    this.game = game;
    this.playScene = playScene;
    this.keyboard = this.game.input.keyboard;
    this.bow = false;
    this.keyboss = false;
    this.invulnerable = false;
    this.dead = false;
    this.fly = false;
    this.items = new Array(5, 0, 6, 0);
    this.maxItems = [20,50,6];
    this.items[ItemType.Hearts] = 6;
    this.items[ItemType.ASCIIForce] = 0;
    this.anim = 'Idle';
}

//Enlazamos las propiedades prototype   
Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

//La funcion para inicializar, crear el sprite y sus variables
Hero.prototype.create = function(){
    //Hacemos el Personaje
    Character.call(this,this.game,'heroAnimations', 0, 0, 3, 6, 1);
    this.anchor.setTo(0.5, 0.5);
    this.body.setSize(16, 20, 8, 8);
    
    this.keyBindings();
    this.iniAttackColliders();

    //CARLOS HA DICHO QUE ESTO SE PUEDE QUEDAR AQUI (Si, tu)
    this.animations.add('walkRight', Phaser.Animation.generateFrameNames('walk', 0, 7), 12, true);
    this.animations.add('walkLeft', Phaser.Animation.generateFrameNames('walk', 8, 15), 12, true);
    this.animations.add('walkTop', Phaser.Animation.generateFrameNames('walk', 16, 23), 12, true);
    this.animations.add('walkDown', Phaser.Animation.generateFrameNames('walk', 24, 31), 12, true);

    this.animations.add('idleRight', Phaser.Animation.generateFrameNames('dying', 0, 0), 1, false);
    this.animations.add('idleLeft', Phaser.Animation.generateFrameNames('dying', 2, 2), 1, false);
    this.animations.add('idleTop', Phaser.Animation.generateFrameNames('dying', 3, 3), 1, false);
    this.animations.add('idleDown', Phaser.Animation.generateFrameNames('dying', 1, 1), 1, false);

    this.animations.add('attackRight', Phaser.Animation.generateFrameNames('attack', 0, 9), 27, false);
    this.animations.add('attackTop', Phaser.Animation.generateFrameNames('attack', 10, 19), 27, false);
    this.animations.add('attackLeft', Phaser.Animation.generateFrameNames('attack', 20, 29), 27, false);
    this.animations.add('attackDown', Phaser.Animation.generateFrameNames('attack', 30, 39), 27, false);

    this.animations.add('bowRight', Phaser.Animation.generateFrameNames('bow', 0, 2), 5, false);
    this.animations.add('bowTop', Phaser.Animation.generateFrameNames('bow', 3, 5), 5, false);
    this.animations.add('bowLeft', Phaser.Animation.generateFrameNames('bow', 6, 8), 5, false);
    this.animations.add('bowDown', Phaser.Animation.generateFrameNames('bow', 9, 11), 5, false);

    this.animations.add('hurtRight', Phaser.Animation.generateFrameNames('hurt', 0, 0), 0, false);
    this.animations.add('hurtTop', Phaser.Animation.generateFrameNames('hurt', 1, 1), 0, false);
    this.animations.add('hurtLeft', Phaser.Animation.generateFrameNames('hurt', 2, 2), 0, false);
    this.animations.add('hurtDown', Phaser.Animation.generateFrameNames('hurt', 3, 3), 0, false);

    this.animations.add('dying', Phaser.Animation.generateFrameNames('dying', 0, 8), 6, false);

    this.animations.add('winBoss', Phaser.Animation.generateFrameNames('win', 0, 0), 0, false);
    this.animations.add('winBow', Phaser.Animation.generateFrameNames('win', 1, 1), 0, false);
    this.animations.add('winKey', Phaser.Animation.generateFrameNames('win', 2, 2), 0, false);
    this.animations.add('winEndItem', Phaser.Animation.generateFrameNames('win', 3, 3), 0, false);

    this.hero_attack = this.game.add.audio('hero_attack');
    this.hero_hurt = this.game.add.audio('hero_hurt');
    this.hero_arrow_shoot = this.game.add.audio('hero_arrow_shoot');
    this.pick_rublo = this.game.add.audio('pick_rublo');
    this.pick_item = this.game.add.audio('pick_item');
    this.pick_asciiforce = this.game.add.audio('open_chest'); 
}

//Update, lee readInput y se mueve / dispara
Hero.prototype.update = function(){
  this.items[ItemType.Hearts] = this.health;
  //Overlap para cuando colisionas con stalkers y cyclops, el boss no ya que tiene un comportamiento especial
  this.game.physics.arcade.overlap(this, this.game.activeEnemies,this.playerCollision,null,this);
  this.game.physics.arcade.overlap(this, this.game.activeCyclops,this.playerCollision,null,this);

  if (this.items[ItemType.Hearts] > 0 && this.anim != 'Hurt'){
    this.playAnims();
    this.readInput();
    this.walk();
    this.attack();
  }
  else if(this.items[ItemType.Hearts] <= 0 && !this.dead) {
    this.animations.play('dying');
    this.dead = true;
    this.animations.currentAnim.onComplete.add(this.end, this);
  }
}

Hero.prototype.end = function(){
  this.kill();
  this.game.music.stop();
  this.game.state.start('end');
}

//readInput del Heroe 
Hero.prototype.readInput = function(){
  if(this.anim === 'Idle'){
      //Y axis
      if(this.upKey.isDown){
        this.dir = 'Top'
        this.velY = -HERO_VEL;
        this.move = true;
      }
      else if(this.downKey.isDown){
        this.dir = 'Down'
        this.velY = HERO_VEL;
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
        this.velX = -HERO_VEL;
      }
      else if (this.rightKey.isDown){
        this.dir = 'Right';
        this.move = true;
        this.velX = HERO_VEL;
      }
      else{
        if(this.velY != 0)
          this.velX = 0;
        else
          this.move = false;  
      }
    }
    else{
      this.velY = 0;
      this.velX = 0;
      this.move = false;  
    }
}

//Disparo
Hero.prototype.shoot = function(){
  this.hero_arrow_shoot.play(); 
  //Creamos la nueva flecha, la añadimos al mundo y al grupo
  var arrow = new Shot(this.game, this.x, this.y, 5, this.velX, this.velY, this.dir, 'arrow');
  this.game.world.addChild(arrow);
  this.game.arrows.add(arrow);
  this.game.world.bringToTop(this.game.arrows);
  //Y preparamos las cosas para que no puedas disparar hasta dentro de 1 sec
  this.anim = 'Attack';
  this.animations.currentAnim.onComplete.add(function() { this.anim = 'Idle'; }, this);
}

  //Ataque
Hero.prototype.attack = function(){
  this.atacking = true;

  if(this.zKey.isDown && this.anim === 'Idle'){
    this.hero_attack.play();

    if (this.dir === 'Right') {
      this.animations.play('attackRight');
      this.game.physics.arcade.overlap(this.rightAttack, this.game.activeEnemies, this.rightAttack.hitEnemyMele, null, this);
      this.rightAttack.playAttack('swordRight');
    }
    else if (this.dir === 'Left') {
      this.animations.play('attackLeft');
      this.game.physics.arcade.overlap(this.leftAttack, this.game.activeEnemies, this.leftAttack.hitEnemyMele, null, this);
      this.leftAttack.playAttack('swordLeft');
    }
    else if (this.dir === 'Top') {
      this.animations.play('attackTop');
      this.game.physics.arcade.overlap(this.topAttack, this.game.activeEnemies, this.topAttack.hitEnemyMele, null, this);
      this.topAttack.playAttack('swordTop');
    }
    else if (this.dir === 'Down') {
      this.animations.play('attackDown');
      this.game.physics.arcade.overlap(this.downAttack, this.game.activeEnemies, this.downAttack.hitEnemyMele, null, this);
      this.downAttack.playAttack('swordDown');
    }
    this.anim = 'Attack';

    this.animations.currentAnim.onComplete.add(function() { this.anim = 'Idle'; }, this);
  }
}

Hero.prototype.addItem = function(itemType,quantity){
  //Aqui ponemos la de defecto para el pickup de cada item (Habria que llevarlo a un json con valores de drops etc.... (Si da tiempo))
  if(quantity === undefined){
    if(itemType === ItemType.Arrows) {
      this.pick_item.play();
      quantity = 5;
    }
    else if (itemType === ItemType.Rublos) {
      this.pick_rublo.play();
      quantity = 2;
    }
    else if (itemType === ItemType.Hearts){
      this.pick_item.play();
      quantity = 2;
    }
    else if (itemType === ItemType.ASCIIForce){
      this.pick_asciiforce.play();
      quantity = 1;
      this.animations.play('winEndItem');
      this.anim = 'Win';
      this.game.time.events.add(Phaser.Timer.SECOND  * 4, function() { this.game.state.start('win'); }, this); 
      }
  }
  //Y añadimos la cantidad de items siempre y cuando no estemos en el maximo
  this.items[itemType] = this.items[itemType] + quantity;

  if(this.items[itemType] > this.maxItems[itemType]){
    this.items[itemType] =this.maxItems[itemType];
  }

  this.health = this.items[ItemType.Hearts];
}


Hero.prototype.playAnims = function(){
  if (this.move && this.anim === 'Idle') {
    if (this.dir === 'Top') 
      this.animations.play('walkTop');
    else if(this.dir ==='Down')
      this.animations.play('walkDown');
    else if(this.dir === 'Left')
      this.animations.play('walkLeft');
    else 
      this.animations.play('walkRight');
  }
  else if (this.anim === 'Idle') {
    if (this.dir === 'Top') 
      this.animations.play('idleTop');
    else if(this.dir ==='Down')
     this.animations.play('idleDown');
    else if(this.dir === 'Left')
      this.animations.play('idleLeft');
    else 
      this.animations.play('idleRight');
    }

  //Objeto(Disparar) 
  if(this.xKey.isDown && this.bow){
    if(this.anim === 'Idle' && this.items[ItemType.Arrows] > 0) {
      if (this.dir === 'Top') 
        this.animations.play('bowTop');
      else if(this.dir ==='Down')
      this.animations.play('bowDown');
      else if(this.dir === 'Left')
        this.animations.play('bowLeft');
      else 
        this.animations.play('bowRight');

      this.shoot();
      this.items[ItemType.Arrows]--;
    }
  }
  if(this.flyKey.isDown)
    this.fly = !this.fly;
}


//Crea las teclas de readInput
Hero.prototype.keyBindings = function() {
  //KeyBindings
  this.upKey = this.keyboard.addKey(Phaser.Keyboard.UP);
  this.downKey = this.keyboard.addKey(Phaser.Keyboard.DOWN);
  this.leftKey = this.keyboard.addKey(Phaser.Keyboard.LEFT);
  this.rightKey = this.keyboard.addKey(Phaser.Keyboard.RIGHT);
  this.xKey = this.keyboard.addKey(Phaser.Keyboard.X);
  this.zKey = this.keyboard.addKey(Phaser.Keyboard.Z);
  this.cKey = this.keyboard.addKey(Phaser.Keyboard.C);
  this.flyKey = this.keyboard.addKey(Phaser.Keyboard.F);
}

Hero.prototype.iniAttackColliders = function() {
  this.rightAttack = new attackCollider(this.game, this.x, this.y, this.width, this.height,this.width/2,this.y);
  this.leftAttack = new attackCollider(this.game, this.x,this.y, this.width, this.height,- this.width,this.y);
  this.topAttack = new attackCollider(this.game, this.x, this.y, this.width, this.height, this.x,- this.height);
  this.downAttack = new attackCollider(this.game, this.x, this.y, this.width, this.height, this.x, this.height);

  //Se ajustan los colliders
  this.rightAttack.body.setSize(100, 100, 64, -14);
  this.leftAttack.body.setSize(100, 100, -92, -14);
  this.topAttack.body.setSize(100, 100, -16, -90);
  this.downAttack.body.setSize(100, 100, -16, 64);
  
  this.game.world.addChild(this.rightAttack);
  this.game.world.addChild(this.leftAttack);
  this.game.world.addChild(this.topAttack);
  this.game.world.addChild(this.downAttack);
  
  this.addChild(this.rightAttack);
  this.addChild(this.leftAttack);
  this.addChild(this.topAttack);
  this.addChild(this.downAttack);

  this.rightAttack.animations.add('swordRight', Phaser.Animation.generateFrameNames('sword', 0, 9), 27, false);
  this.topAttack.animations.add('swordTop', Phaser.Animation.generateFrameNames('sword', 10, 19), 27, false);
  this.leftAttack.animations.add('swordLeft', Phaser.Animation.generateFrameNames('sword',20, 29), 27, false);
  this.downAttack.animations.add('swordDown', Phaser.Animation.generateFrameNames('sword', 30, 39), 27, false);
}

Hero.prototype.playerCollision = function(player, enemy){
  if(!this.invulnerable && !this.dead && this.anim != 'Hurt') {
    this.applyKnockback(enemy);
    this.hero_hurt.play();

    this.invulnerable = true;
    this.anim = 'Hurt';

    if(this.dir === 'Right')
      this.animations.play('hurtRight');
    else if (this.dir === 'Left')
      this.animations.play('hurtLeft');
    else if (this.dir === 'Top')
      this.animations.play('hurtTop');
    else if (this.dir === 'Down')
      this.animations.play('hurtDown');

    this.game.time.events.add(Phaser.Timer.SECOND  * 0.3, function() { this.anim = 'Idle' }, this);  // Hay que poner canMove y attack a true por si se solapan eventos
    this.game.time.events.add(Phaser.Timer.SECOND, function() { this.invulnerable = false; this.alpha = 1;}, this);
  }
}


function attackCollider(game, nx, ny, nw, nh,colX,colY) {
  this.game = game;
  Phaser.Sprite.call(this,this.game,nx,ny,'swordAnimations');
  this.frame = 9;     //Este es el frame vacio
  this.smoothed = false;
  this.x = nx;
  this.y = ny;
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enable(this);
}

attackCollider.prototype = Object.create(Phaser.Sprite.prototype);
attackCollider.constructor =  attackCollider;

attackCollider.prototype.playAttack = function(anim){
  this.animations.play(anim);
}

attackCollider.prototype.hitEnemyMele = function(attack, enemy) {
  if(enemy.health > 0)
    enemy.applyKnockback(enemy.target);
}

module.exports = Hero;
},{"./ItemType.js":7,"./character.js":11,"./shot.js":18}],15:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');
var IntroMenu = require('./IntroMenu');
var EndMenu = require('./EndMenu');
var WinMenu = require('./WinMenu');

var BootScene = {
  preload: function () {
  },

  create: function () {
    this.game.state.start('preloader');
  }
};

var PreloaderScene = {
  preload: function () {
    this.game.load.baseURL = 'https://bornunez.github.io/undefined/src';
    
    this.game.load.crossOrigin = 'anonymous';

    //Carga los sonidos
    this.game.load.audio('intro_theme', '/music/intro_theme.mp3');
    this.game.load.audio('game_theme', '/music/game_theme.mp3');
    this.game.load.audio('gameover_theme', '/music/gameover_theme.mp3');
    this.game.load.audio('boss_theme', '/music/boss_theme.mp3');
    this.game.load.audio('win_theme', '/music/win_theme.mp3');
    this.game.load.audio('kill_enemy', '/music/kill_enemy.mp3');
    this.game.load.audio('hero_attack', '/music/hero_attack.mp3');
    this.game.load.audio('hero_hurt', '/music/hero_hurt.mp3');
    this.game.load.audio('hero_arrow_shoot', '/music/hero_arrow_shoot.mp3');
    this.game.load.audio('hero_arrow_hit', '/music/hero_arrow_hit.mp3');
    this.game.load.audio('pick_rublo', '/music/pick_rublo.mp3');
    this.game.load.audio('pick_item', '/music/pick_item.mp3');
    this.game.load.audio('cyclops_awake', '/music/cyclops_awake.mp3');
    this.game.load.audio('open_chest', '/music/open_chest.mp3');
    this.game.load.audio('open_door', '/music/open_door.mp3');
    //Abrir y cerrar inventario
    this.game.load.audio('open_pause', '/music/open_pause.mp3')
    this.game.load.audio('close_pause', '/music/close_pause.mp3')

    //Carga de imagenes individuales
    this.game.load.image('trigger','/images/trigger.png');
    this.game.load.image('door','/images/Puertas.png');
    this.game.load.image('HUD', '/images/HUD.png');
    this.game.load.image('arrow', '/images/arrow.png');
    this.game.load.image('arrowicon', '/images/arrowicon.png');
    this.game.load.image('rublos', '/images/rublos.png');
    this.game.load.image('keys', '/images/keys.png');
    this.game.load.image('keybossicon','/images/keyboss.png');
    this.game.load.image('playButton','/images/playButton.png');
    this.game.load.image('bossDoor','/images/boss_door.png');
    this.game.load.image('lockedDoor','/images/locked_door.png');
    this.game.load.image('asciiforce','/images/asciiforce.png');

    //Carga de spritesheets
    this.game.load.spritesheet('inventory','/images/inventory.png', 256, 222, 2);
    this.game.load.spritesheet('itembox', '/images/itembox.png', 22, 22, 2);
    this.game.load.spritesheet('hearts', '/images/hearts.png', 8, 8, 3);
    this.game.load.spritesheet('numbers', '/images/numbers.png',8,8, 10);
    this.game.load.spritesheet('chest', '/images/chest.png', 32, 24, 2);

    //Carga de spritesheets mediante json para las animaciones
    this.game.load.atlas('bossAnimations', '/images/bossspritesheet.png', '/json/bossspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('cyclopsAnimations', '/images/cyclopsspritesheet.png', '/json/cyclopsspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('heroAnimations', '/images/herospritesheet.png', '/json/herospritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('enemyAnimations', '/images/enemyspritesheet.png', '/json/enemyspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('swordAnimations', '/images/swordspritesheet.png', '/json/swordspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
   
    //Mapa
    this.game.load.tilemap('map', '/mapas/EastPalace1.json',null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', '/mapas/TileSet32.png');
    this.game.load.image('objetos', '/mapas/TileSet16.png');
  },

  create: function () {
    //Comienza la musica
    this.game.state.start('introMenu');
  }
};


window.onload = function () {
  var game = new Phaser.Game(1080, 720, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader' , PreloaderScene);
  game.state.add('introMenu',IntroMenu);
  game.state.add('play', PlayScene);
  game.state.add('end', EndMenu);
  game.state.add('win', WinMenu);

  game.state.start('boot');
};

},{"./EndMenu":3,"./IntroMenu":5,"./WinMenu":8,"./play_scene.js":16}],16:[function(require,module,exports){
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

},{"./Chest.js":2,"./HUD.js":4,"./boss.js":9,"./bossArmy.js":10,"./character.js":11,"./cyclops.js":12,"./door.js":13,"./hero.js":14,"./room.js":17,"./stalker.js":19}],17:[function(require,module,exports){
'use strict'
var Item = require('./Item.js');
var ItemType = require('./ItemType.js');
var BossArmy = require('./BossArmy.js');
var Door = require('./door.js');

function Room(game,playScene,MAPSCALE,number){
    this.playScene = playScene;
    this.game = game;
    this.number = number;
    this.MAPSCALE = MAPSCALE;
    this.init();
    this.active = true;
    this.open_door = this.game.add.audio('open_door');
}
Room.prototype.constructor = Room;

Room.prototype.init = function(){
    this.loadTriggers();
    this.loadEnemies();
    this.loadDoors();

    if(this.bossRoom)
        this.loadBossPoint();
    
}

//Vamos a guardar todos los trigger de la sala en el array
Room.prototype.loadTriggers = function(){
    this.TriggersInfo = this.playScene.findObjectsByType('T'+this.number,'Triggers');
    this.Triggers = this.game.add.group();
    //Usando la informacion de los Triggers ,creamos el trigger en si, y lo guardamos en el Array Triggers.
    this.TriggersInfo.forEach(function(element) {
        var trigger = this.createFromTiledObj(element.x,element.y,'trigger');
        this.bossRoom = element.name === 'BossTrigger';
        
        this.game.physics.arcade.enable(trigger);
        this.Triggers.add(trigger);
    }, this);
}
Room.prototype.loadBossDoor = function(){
    this.bossDoorInfo = this.playScene.findObjectsByType("BIND",'Puertas');
    this.bossDoor = new Door(this.game,this.playScene.link,this.bossDoorInfo[0].x * this.MAPSCALE, this.bossDoorInfo[0].y * this.MAPSCALE,this.MAPSCALE, false);
    this.game.Puertas.add(this.bossDoor);
    this.game.world.bringToTop(this.bossDoor);
}

//Aqui solo vamos a leer y guardar la posicion de los enemigos de esta sala
Room.prototype.loadEnemies = function(){
    this.enemiesInfo = this.playScene.findObjectsByType('spawn'+this.number,'Esqueletos');
    this.cicloInfo = this.playScene.findObjectsByType('ciclo'+this.number,'Esqueletos');
    this.enemies = new Array();
}

Room.prototype.loadBossPoint = function(){
    this.bossPoints = this.playScene.findObjectsByType('point','Boss Points');
}

//Primero creamos la informacion de cada puerta, y luego las instanciamos como objetos inmovibles.
Room.prototype.loadDoors = function(){
    //Primero queremos la info
    this.doorsInfo = this.playScene.findObjectsByType('D'+ this.number, 'Puertas');
    this.Doors = this.game.add.group();
    //Y luego los instanciamos
    this.doorsInfo.forEach(function(element) {
        //Creamos el sprite
        var door = this.createFromTiledObj(element.x,element.y,'door');
        //Y le aplicamos las fisicas
        this.game.physics.enable(door, Phaser.Physics.ARCADE);
        door.body.immovable = true;
        this.Doors.add(door);
    }, this);
}

//Metodo encargado de generar a los enemigos de la sala
Room.prototype.Spawn = function(){
    //Primero borramos todos los triggers de la sala, ya que estos han sido activados
    this.Triggers.forEach(function(element) {
        element.destroy();
    }, this);
    
    if (this.active === true) {
        this.active = false;
        if(!this.bossRoom){
            //Ahora vamos a crear un enemigo a partir de la informacion que guardamos del json
            this.enemiesInfo.forEach(function (element) {
                //Los spawneamos y los metemos en el array que los manejara
                var enemy = this.playScene.addEnemy(element.x * this.MAPSCALE, element.y * this.MAPSCALE, this, 'stalker');
                this.enemies.push(enemy);
            }, this);
            this.cicloInfo.forEach(function (element) {
                var enemy = this.playScene.addEnemy(element.x * this.MAPSCALE, element.y * this.MAPSCALE, this, 'ciclo');
                this.enemies.push(enemy);
            }, this);
        }
        else{
            this.SpawnBoss();
        }
    }
}
Room.prototype.SpawnBoss = function(){
    this.loadBossDoor();
    this.game.music.stop();
    this.game.music = this.game.add.audio('boss_theme');
    this.game.music.loop = true;
    this.game.music.play();
    
    var bossArmy = new BossArmy(this.game,0,0,this.playScene.link,this.MAPSCALE,1,1,'bossAnimations');
    this.bossPoints.forEach(function(element) {
        bossArmy.points.push({x: element.x * this.MAPSCALE, y: element.y * this.MAPSCALE});
    }, this);
    bossArmy.create();
}

Room.prototype.update = function(){
    this.game.physics.arcade.overlap(this.playScene.link,this.Triggers,this.Spawn,null,this);
    this.game.physics.arcade.collide(this.playScene.link,this.Doors);
    this.game.physics.arcade.overlap(this.playScene.link,this.Buttons,this.openDoors,null,this);
}

//Dada una x y una y de un objeto de tiled, se encargara de crear un sprite 'sprite' en la posicion correspondiente del mapa
Room.prototype.createFromTiledObj = function(x,y,spritename){
    var obj = this.game.add.sprite(x*this.MAPSCALE,y*this.MAPSCALE,spritename);
    obj.width *=this.MAPSCALE; obj.height *=this.MAPSCALE;
    obj.smoothed = false;
    return obj;
}

Room.prototype.checkEnemies = function(){
    //Simple: Si no quedan enemigos, se abre la puerta
    if(this.enemies.length<=0)
        this.openDoors();
}

Room.prototype.openDoors = function(){
    this.open_door.play();
    this.Doors.destroy(true);
}

//Esta funcion sera la encargada de manejar la muerte de un enemigo de esta sala, y la llamaran los enemigos cuando mueran
Room.prototype.killEnemy = function(enemy){
    //Borramos al enemigo del array, pero sin destruir su entidad, 
    //,ya que esta sera enviada de nuevo a la pool de enemigos
    var enemyN = this.enemies.indexOf(enemy);
    if(enemyN >= 0)
        this.enemies.splice(enemyN,1);
    //Finalmente vemos si se ha "pasado" la sala
    this.checkEnemies();
}
  module.exports = Room;
},{"./BossArmy.js":1,"./Item.js":6,"./ItemType.js":7,"./door.js":13}],18:[function(require,module,exports){
'use strict'
var Character = require('./character.js');

const ARROW_VEL = 200;

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
        this.game.physics.arcade.overlap(this, this.game.bosses, this.hitBoss, null, this);
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

Shot.prototype.hitBoss = function(arrow, boss) {
    if ((this.game.bosses.length < 2 && !boss.invulnerable) || this.game.bosses.length >= 2) {
        this.hero_arrow_hit.play();
        if(boss.health >= 1)
            boss.applyKnockback(boss.target);
        else
            boss.die();
    
        this.kill();
    }
}

//Fisicas
Shot.prototype.initPhysics = function() {
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.bounce.setTo(1, 1);
    this.body.moves = true;
    this.body.immovable = true;
  }


Shot.prototype.selectDir = function() {
    if(this.velX === 0 && this.velY === 0) {
        if(this.dir === 'Right') 
            this.velX = ARROW_VEL;
        else if (this.dir === 'Left') 
            this.velX = -ARROW_VEL;  
        else if (this.dir === 'Top') 
            this.velY = -ARROW_VEL;
        else if (this.dir === 'Down') 
            this.velY = ARROW_VEL;
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
},{"./character.js":11}],19:[function(require,module,exports){
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
},{"./Item.js":6,"./ItemType.js":7,"./character.js":11}]},{},[15]);
