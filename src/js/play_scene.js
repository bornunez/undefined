'use strict';

var PlayScene = {
  create: function () {

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    


    //Prepare the keyboard so that the human player can move link arround
    this.keyboard = this.game.input.keyboard;
    
    //Bindeos de teclas
    this.upKey = this.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = this.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.leftKey = this.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = this.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.space = this.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //Create the player sprite and enable the physics
    this.link = new Hero("Link",this.game.world.centerX,this.world.game.world.centerY,3);
    this.game.world.addChild(this.link);

    
    this.game.physics.enable(this.link);
    this.link.body.collideWorldBounds = true;
    this.link.body.bounce.setTo(1, 1);

    this.link.body.moves = true;
 
    this.zelda = new Zelda("Zelda",this.game.world.centerX+100,this.world.game.world.centerY);
    this.game.world.addChild(this.zelda);
    
    this.game.physics.enable(this.zelda);

    this.zelda.body.collideWorldBounds = true;
    this.zelda.body.checkCollision.up = true;
    this.zelda.body.checkCollision.down = true;
    this.zelda.body.immovable = true;

  },
  update: function(){
    this.game.physics.arcade.collide(this.link, this.zelda);

    if(this.game.physics.arcade.collide(this.link, this.zelda)) {
     console.log("COLISION") 
    }
  }
};






function Hero(name, nx, ny, vel){
  
  //sprite = game.add.sprite(300, 200, 'link');
  Phaser.Sprite.call(this, PlayScene.game, nx, ny, 'link');
  this.x = nx;
  this.y = ny;
  //Datos del sprite 
  this.width *= 4;
  this.height *= 4;
  this.smoothed = false;
  //Datos de Link
  this._name = name;
  this._vel = vel;
  this._velX = 0;
  this._velY = 0;
  this.dir = 'None';
  this.move = false;
  this.canShoot = true;
};
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.constructor = Hero;

Zelda.prototype = Object.create(Phaser.Sprite.prototype);
Zelda.constructor = Zelda;

Hero.prototype.update= function(){
  //Y axis
  if(PlayScene.upKey.isDown){
    if(this.dir === 'None')
      this.dir = 'Up'
    this._velY = -200;
    this.move = true;
  }
  else if(PlayScene.downKey.isDown){
    if(this.dir === 'None')
      this.dir = 'Down'
    this._velY = 200;
    this.move = true;
  }
  else {
    if(this._velX != 0)
      this._velY = 0;
    else
      this.move = false; 
  }
  //X Axis
  if(PlayScene.leftKey.isDown){
    this.move = true;
    this._velX = -200;
  }
  else if (PlayScene.rightKey.isDown){
    this.move = true;
    this._velX = 200;
  }
  else{
    if(this._velY != 0)
      this._velX = 0;
    else
    this.move = false;  
  }
  //Movemos
  if(this.move){
    this.body.velocity.x = this._velX;
    this.body.velocity.y = this._velY;
  }
  else {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }

  //Objeto(Disparar)
  if(PlayScene.space.isDown){
    if(this.canShoot)
      this.shoot();
  }
}
Hero.prototype.shoot = function(){
  var arrow = new Arrow(PlayScene.game,this.x,this.y,this._velX,this._velY); //velx y vely son el fallo, si se ponen a uno van
  PlayScene.game.world.addChild(arrow);                            //Habria que poner su movimiento en funcion a velocidad   
  this.canShoot = false;
  PlayScene.game.time.events.add(Phaser.Timer.SECOND  * 1, this.shootCD, this);
}
Hero.prototype.shootCD = function(){
  this.canShoot = true;
}


function Arrow(game,X, Y, VELX, VELY){

  Phaser.Sprite.call(this,game, X, Y, 'link');
  this.vel = 5;
  this.x = X;
  this.y = Y;
  this.velX = VELX;
  this.velY = VELY;

  //Llamamos al timer para destruir
  game.time.events.add(Phaser.Timer.SECOND * 1, this.arrowdestroy, this);
}
Arrow.prototype = Object.create(Phaser.Sprite.prototype);
Arrow.constructor = Arrow;
Arrow.prototype.update = function(){
  this.y += this.velY*this.vel;
  this.x += this.velX*this.vel;
}
Arrow.prototype.arrowdestroy = function(){
  this.destroy();
}

function Zelda(name, nx, ny){
  Phaser.Sprite.call(this, PlayScene.game, nx, ny, 'link');
  this.x = nx;
  this.y = ny;
  //Datos del sprite 
  this.width *= 4;
  this.height *= 4;
  this.smoothed = false;
  //Datos de Link
  this._name = name;
};



module.exports = PlayScene;
