'use strict';

const NUM_POINTS = 2

function Boss(game,x,y, target, MAPSCALE, vel,health,damage,spriteName){
    this.game = game; 
    this.target = target;
    //Hacemos el sprite
    Phaser.Sprite.call(this,this.game,x,y,spriteName);
    this.scale.setTo(4.5,4.5);
    this.anchor.setTo(0.5, 0.5);

    
    this.smoothed = false;
    //Inicializamos las fisicas
   // this.initPhysics();
    //Rellenamos e inicializamos los fields
    this.x = x;
    this.y = y;
    this.vel = vel;
    this.velX = 0;
    this.velY = 0;
    this.dmg = damage;
    //this.dir = 'None';
    this.health = health;
    this.game.world.addChild(this);
    this.pointNumber = 0;
    this.jumping = false;

    this.points = {
      'x': [ this.target.x, this.target.x+200],
      'y': [ this.target.y, this.target.y+200 ]
      };

    this.animations.add('bossJump', Phaser.Animation.generateFrameNames('boss', 0, 9), 18, true);



}
//Herencia
Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.constructor = Boss;



Boss.prototype.update = function(){
  this.move();

}

Boss.prototype.move = function() {

  if(this.x != this.points.x[this.pointNumber]  || this.y != this.points.y[this.pointNumber]) {
    this.game.time.events.add(Phaser.Timer.SECOND  * 1, this.goToPoint, this);
  }
  else if(this.x === this.points.x[this.pointNumber] && this.y === this.points.y[this.pointNumber]) {
    this.jumping = true;
    this.animations.play('bossJump');
    this.pointNumber++;
    if(this.pointNumber >= NUM_POINTS)
      this.pointNumber = 0;

  }

  //console.log(this.y)
  //console.log(this.points.y[this.pointNumber]);


}

Boss.prototype.goToPoint = function() {
  if(this.x < this.points.x[this.pointNumber])
    this.x++;
  else if(this.x > this.points.x[this.pointNumber])
    this.x--;

  if(this.y < this.points.y[this.pointNumber])
    this.y++;
  else if(this.y > this.points.y[this.pointNumber])
    this.y--;


}
/*
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

Character.prototype.initPhysics = function(){
  //Fisicas!
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = true;
  //this.body.bounce.setTo(1, 1);

  this.body.moves = true;
  //this.body.immovable = true;
}

Character.prototype.scaleSprite = function(w,h){
  this.width *=w;
  this.height *=h;
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
    //console.log("DirX : " +this.knockDirX + " DirY: " +this.knockDirY);
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
  //console.log("He parado el knock");
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




      */
module.exports = Boss;