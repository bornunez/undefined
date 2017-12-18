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