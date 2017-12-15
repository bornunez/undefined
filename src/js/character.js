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