'use strict';
var Character = require('./character.js');
var Shot = require('./shot.js');
var ItemType = require('./ItemType.js');

function Hero(game,playScene){
    this.game = game;
    this.playScene = playScene;
    this.keyboard = this.game.input.keyboard;
    this.canAttack = true;
    //this.attacking = false;
    this.hurt = false;          //Flag para cuando recibes daño.
    this.invulnerable = false;
    this.canMove = true;
    this.dead = false;
    this.fly = false;
    this.items = new Array(5,0,6);
    this.maxItems = [20,50,6];
    this.items[ItemType.Hearts] = 6;
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

    //CARLOS HA DICHO QUE SE PUEDE QUEDAR AQUI (Si, tu)
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

    this.animations.add('dying', Phaser.Animation.generateFrameNames('dying', 0, 4), 4, false);

    this.hero_attack = this.game.add.audio('hero_attack');
    this.hero_hurt = this.game.add.audio('hero_hurt');
    this.hero_arrow_shoot = this.game.add.audio('hero_arrow_shoot');
    this.pick_rublo = this.game.add.audio('pick_rublo');
    this.pick_item = this.game.add.audio('pick_item');
}
//Update, lee readInput y se mueve / dispara
Hero.prototype.update = function(){
  this.items[ItemType.Hearts] = this.health;
  //console.log(this.health);
  //this.game.debug.body(this);
  /*
  this.game.debug.body(this.rightAttack);
  this.game.debug.body(this.leftAttack);
  this.game.debug.body(this.topAttack);
  this.game.debug.body(this.downAttack);
*/

  this.game.physics.arcade.overlap(this, this.game.activeEnemies,this.playerCollision,null,this);
  this.game.physics.arcade.overlap(this, this.game.activeCyclops,this.playerCollision,null,this);
  this.game.physics.arcade.overlap(this, this.game.bosses, this.playerCollision,null,this);



  if (this.items[ItemType.Hearts] > 0){
    this.playAnims();
    this.readInput();
    this.walk();
    this.attack();
  }
  else if(this.items[ItemType.Hearts] <= 0 && !this.dead) {
  //this.destroy();
  this.animations.play('dying');
  this.dead = true;
  this.animations.currentAnim.onComplete.add(this.end, this);
}
}
Hero.prototype.end = function(){
  /*this.input.destroy = function(){
    console.log("AAAA")
  }*/
  this.kill();
  this.game.music.stop();
  this.game.state.start('end');
}
//readInput del Heroe ////FEOOO////
Hero.prototype.readInput = function(){
  if(this.canMove){
      //Y axis
      if(this.upKey.isDown){
        //if(this.dir === 'None')
          this.dir = 'Top'
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
  this.canMove = false;
  this.canAttack = false;
  //this.game.time.events.add(Phaser.Timer.SECOND  * 1, this.shootCD, this);
  this.animations.currentAnim.onComplete.add(this.attackCD, this);
}

  //Ataque
Hero.prototype.attack = function(){
  this.atacking = true;

  //this.game.debug.body(this);
  
  if(this.eKey.isDown && this.canAttack && !this.hurt){
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
      this.game.physics.arcade.overlap(this.downAttack,this.game.activeEnemies, this.downAttack.hitEnemyMele, null, this);
      this.downAttack.playAttack('swordDown');
    }
    this.canMove = false;
    this.canAttack = false;

    this.animations.currentAnim.onComplete.add(this.attackCD, this);
    //this.game.time.events.add(Phaser.Timer.SECOND  * 1, this.attackCD, this);
  }
}

Hero.prototype.addItem = function(itemType,quantity){

  console.log("Cantidad de items: " + quantity);
  console.log("Item que le llega a Link: " + itemType);
  //Aqui ponemos la de defecto para el pickup de cada item (Habria que llevarlo a un json con valores de drops etc.... (Si da tiempo))
  if(quantity === undefined){
    if(itemType === ItemType.Arrows) {
      this.pick_item.play();
      quantity = 3;
    }
    else if (itemType === ItemType.Rublos) {
      this.pick_rublo.play();
      quantity = 2;
    }
    else if (itemType === ItemType.Hearts){
      this.pick_item.play();
      quantity = 2;
    }
  }
  //Y añadimos la cantidad de items siempre y cuando no estemos en el maximo
  this.items[itemType] = this.items[itemType] + quantity;

  if(this.items[itemType] > this.maxItems[itemType]){
    this.items[itemType] =this.maxItems[itemType];
  }

  this.health = this.items[ItemType.Hearts];

    console.log(this.items[itemType]);
}

Hero.prototype.attackCD = function(){
  this.canMove = true;
  this.canAttack = true;
}

Hero.prototype.playAnims = function(){
  if (this.move && this.canAttack && !this.hurt) {
    if (this.dir === 'Top') 
      this.animations.play('walkTop');
    else if(this.dir ==='Down')
      this.animations.play('walkDown');
    else if(this.dir === 'Left')
      this.animations.play('walkLeft');
    else 
      this.animations.play('walkRight');
  }
  else if (this.canAttack && !this.hurt) {
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
  if(this.space.isDown){
    if(this.canAttack &&  !this.hurt && this.items[ItemType.Arrows] > 0) {
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
  this.space = this.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.eKey = this.keyboard.addKey(Phaser.Keyboard.E);
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
  if(!this.invulnerable && !this.dead && !this.hurt) {
    this.applyKnockback(enemy);
    this.hero_hurt.play();

    //Desactivar animacion de ataque(espada)?
    this.invulnerable = true;
    this.hurt = true;

    if(this.dir === 'Right')
      this.animations.play('hurtRight');
    else if (this.dir === 'Left')
      this.animations.play('hurtLeft');
    else if (this.dir === 'Top')
      this.animations.play('hurtTop');
    else if (this.dir === 'Down')
      this.animations.play('hurtDown');

    this.game.time.events.add(Phaser.Timer.SECOND  * 0.3, function() { this.hurt = false; this.attackCD(); }, this);  // Hay que poner canMove y attack a true por si se solapan eventos
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