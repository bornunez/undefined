'use strict';
var Character = require('./character.js');
var Shot = require('./shot.js');

function Hero(game){
    this.game = game;
    this.keyboard = this.game.input.keyboard;
    this.canAttack = true;
}

//Enlazamos las propiedades prototype   
Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

//La funcion para inicializar, crear el sprite y sus variables
Hero.prototype.create = function(){
    //Hacemos el Personaje
    Character.call(this,this.game,'link',0,0,1,3,3);
    this.keyBindings();
    this.iniAttackColliders();

}
//Update, lee input y se mueve / dispara
Hero.prototype.update = function(){

  this.game.physics.arcade.overlap(this, this.game.enemies,this.playerCollision,null,this);
  //this.game.physics.arcade.collide(this,this.game.Paredes);

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
  this.game.debug.body(this.rightAttack);
  this.game.debug.body(this.leftAttack);
  this.game.debug.body(this.topAttack);
  this.game.debug.body(this.downAttack);


  if(this.eKey.isDown && this.canAttack){
    console.log(this.dir);  
    if (this.dir === 'Right')
      this.game.physics.arcade.overlap(this.rightAttack, this.game.enemies, this.rightAttack.hitEnemyMele, null, this);
    else if (this.dir === 'Left')
      this.game.physics.arcade.overlap(this.leftAttack, this.game.enemies, this.leftAttack.hitEnemyMele, null, this);
    else if (this.dir === 'Up')
      this.game.physics.arcade.overlap(this.topAttack, this.game.enemies, this.topAttack.hitEnemyMele, null, this);
    else if (this.dir === 'Down')
      this.game.physics.arcade.overlap(this.downAttack, this.game.enemies, this.downAttack.hitEnemyMele, null, this);

    this.canAttack = false;
    this.game.time.events.add(Phaser.Timer.SECOND  * .5, this.attackCD, this);
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
  this.rightAttack = new attackCollider(this.game, this.x + 16,this.y + 2);
  this.leftAttack = new attackCollider(this.game, this.x - 16,this.y + 2);
  this.topAttack = new attackCollider(this.game, this.x,this.y - 16);
  this.downAttack = new attackCollider(this.game, this.x,this.y + 16);

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


function attackCollider(game, nx, ny) {
  this.game = game;
  Phaser.Sprite.call(this, this.game, nx, ny);
  this.game.physics.enable(this);
  this.x = nx;
  this.y = ny;
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