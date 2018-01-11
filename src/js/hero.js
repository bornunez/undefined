'use strict';
var Character = require('./character.js');
var Shot = require('./shot.js');


function Hero(game,playScene){
    this.game = game;
    this.playScene = playScene;
    this.keyboard = this.game.input.keyboard;
    this.canAttack = true;
    this.attacking = false;
    this.canMove = true;
    this.dead = false;
}

//Enlazamos las propiedades prototype   
Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

//La funcion para inicializar, crear el sprite y sus variables
Hero.prototype.create = function(){
    //Hacemos el Personaje
    Character.call(this,this.game,'heroAnimations', 0, 0, 3, 6, 1);
    this.anchor.setTo(0.5, 0.5);
    this.body.setSize(16, 24, 8, 4);
    


    this.keyBindings();
    this.iniAttackColliders();
    this.animations.add('walkRight', Phaser.Animation.generateFrameNames('walk', 0, 7), 12, true);
    this.animations.add('walkLeft', Phaser.Animation.generateFrameNames('walk', 8, 15), 12, true);
    this.animations.add('walkTop', Phaser.Animation.generateFrameNames('walk', 16, 23), 12, true);
    this.animations.add('walkDown', Phaser.Animation.generateFrameNames('walk', 24, 31), 12, true);

    this.animations.add('idleRight', Phaser.Animation.generateFrameNames('dying', 0, 0), 1, false);
    this.animations.add('idleLeft', Phaser.Animation.generateFrameNames('dying', 2, 2), 1, false);
    this.animations.add('idleTop', Phaser.Animation.generateFrameNames('dying', 3, 3), 1, false);
    this.animations.add('idleDown', Phaser.Animation.generateFrameNames('dying', 1, 1), 1, false);

    this.animations.add('attackRight', Phaser.Animation.generateFrameNames('attack', 0, 9), 12, false);
    this.animations.add('attackTop', Phaser.Animation.generateFrameNames('attack', 10, 19), 12, false);
    this.animations.add('attackLeft', Phaser.Animation.generateFrameNames('attack', 20, 29), 12, false);
    this.animations.add('attackDown', Phaser.Animation.generateFrameNames('attack', 30, 39), 12, false);

    this.animations.add('bowRight', Phaser.Animation.generateFrameNames('bow', 0, 2), 5, false);
    this.animations.add('bowTop', Phaser.Animation.generateFrameNames('bow', 3, 5), 5, false);
    this.animations.add('bowLeft', Phaser.Animation.generateFrameNames('bow', 6, 8), 5, false);
    this.animations.add('bowDown', Phaser.Animation.generateFrameNames('bow', 9, 11), 5, false);

    this.animations.add('dying', Phaser.Animation.generateFrameNames('dying', 0, 4), 4, false);
}
//Update, lee input y se mueve / dispara
Hero.prototype.update = function(){
  //console.log(this.health);
  this.game.debug.body(this.rightAttack);
  this.game.debug.body(this.leftAttack);
  this.game.debug.body(this.topAttack);
  this.game.debug.body(this.downAttack);

  this.game.physics.arcade.overlap(this, this.playScene.activeEnemies,this.playerCollision,null,this);
  //this.game.physics.arcade.collide(this,this.game.Paredes);


  if (this.health > 0){
    this.playAnims();
    this.input();
    this.walk();
    this.attack();
  }
  else if(this.health <= 0 && !this.dead) {
  //this.destroy();
  this.animations.play('dying');
  this.dead = true;
  }
}

//Input del Heroe ////FEOOO////
Hero.prototype.input = function(){
  if(this.canMove){
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
    else{
      this.velY = 0;
      this.velX = 0;
      this.move = false;  
    }

}
//Disparo
Hero.prototype.shoot = function(){
  //Creamos la nueva flecha, la añadimos al mundo y al grupo
  var arrow = new Shot(this.game,this.x,this.y,5,this.velX,this.velY,'arrow');
  this.game.world.addChild(arrow);
  this.game.arrows.add(arrow);
  this.game.world.bringToTop(this.game.arrows);
  //Y preparamos las cosas para que no puedas disparar hasta dentro de 1 sec
  this.canShoot = false;
  this.canMove = false;
  this.canAttack = false;
  this.game.time.events.add(Phaser.Timer.SECOND  * 1, this.shootCD, this);
}
//Vuelve a poner el cd a 0
Hero.prototype.shootCD = function(){
  this.canAttack = true;
  this.canMove = true;
  this.canShoot = true;
}

  //Ataque
Hero.prototype.attack = function(){
  this.atacking = true;

  this.game.debug.body(this);
  
  if(this.eKey.isDown && this.canAttack){
    if (this.dir === 'Right') {
      this.animations.play('attackRight');
      this.game.physics.arcade.overlap(this.rightAttack, this.playScene.activeEnemies, this.rightAttack.hitEnemyMele, null, this);
      this.rightAttack.playAttack('A');
    }
    else if (this.dir === 'Left') {
      this.animations.play('attackLeft');
      this.game.physics.arcade.overlap(this.leftAttack, this.playScene.activeEnemies, this.leftAttack.hitEnemyMele, null, this);
      this.leftAttack.playAttack('B');
    }
    else if (this.dir === 'Up') {
      this.animations.play('attackTop');
      this.game.physics.arcade.overlap(this.topAttack, this.playScene.activeEnemies, this.topAttack.hitEnemyMele, null, this);
      this.topAttack.playAttack('C');
    }
    else if (this.dir === 'Down') {
      this.animations.play('attackDown');
      this.game.physics.arcade.overlap(this.downAttack,this.playScene.activeEnemies, this.downAttack.hitEnemyMele, null, this);
      this.downAttack.playAttack('D');
    }
    this.canMove = false;
    this.canAttack = false;

    this.game.time.events.add(Phaser.Timer.SECOND  * 1, this.attackCD, this);
  }
}

Hero.prototype.attackCD = function(){
  this.canMove = true;
  this.canAttack = true;
}

Hero.prototype.playAnims = function(){
  if (this.move && this.canAttack && this.canShoot) {
    if (this.dir === 'Up') 
      this.animations.play('walkTop');
    else if(this.dir ==='Down')
      this.animations.play('walkDown');
    else if(this.dir === 'Left')
      this.animations.play('walkLeft');
    else 
      this.animations.play('walkRight');
  }
  else if (this.canAttack && this.canShoot){
    if (this.dir === 'Up') 
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
    if(this.canShoot) {
      if (this.dir === 'Up') 
        this.animations.play('bowTop');
      else if(this.dir ==='Down')
      this.animations.play('bowDown');
      else if(this.dir === 'Left')
        this.animations.play('bowLeft');
      else 
        this.animations.play('bowRight');

      this.shoot();
    }
  }
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

  this.rightAttack.animations.add('A', Phaser.Animation.generateFrameNames('sprite', 1, 12), 12, false);
  this.topAttack.animations.add('C', Phaser.Animation.generateFrameNames('sprite', 13, 24), 12, false);
  this.leftAttack.animations.add('B', Phaser.Animation.generateFrameNames('sprite',25, 36), 12, false);
  this.downAttack.animations.add('D', Phaser.Animation.generateFrameNames('sprite', 37, 48), 12, false);

}

Hero.prototype.playerCollision = function(player, enemy){
  this.applyKnockback(enemy);
}


function attackCollider(game, nx, ny, nw, nh,colX,colY) {
  this.game = game;
  Phaser.Sprite.call(this,this.game,nx,ny,'swordAnimations');
  this.smoothed = false;
  //Phaser.Sprite.call(this,this.game,nx,ny);
  this.x = nx;
  this.y = ny;
  this.anchor.setTo(0.5, 0.5);
  //this.col = this.game.add.sprite(colX,colY,null);
  this.game.physics.arcade.enable(this);

  //console.log(this);

}

attackCollider.prototype = Object.create(Phaser.Sprite.prototype);
attackCollider.constructor =  attackCollider;
attackCollider.prototype.playAttack = function(anim){
  this.animations.play(anim);
}
attackCollider.prototype.addAnimations = function(type){

}
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
  //console.log(enemy.health);

  if(enemy.health >= 1)
    enemy.applyKnockback(enemy.target);
  else{
    enemy.die();
  }
}

module.exports = Hero;