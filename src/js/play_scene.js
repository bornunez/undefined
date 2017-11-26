'use strict';
//var link;
//var enemy;

var PlayScene = {
  create: function () {

    //this.game.physics.startSystem(Phaser.Physics.ARCADE);
    

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
 
    this.enemy = new Enemy(this.game.world.centerX+100,this.world.game.world.centerY, this.link);
    this.game.world.addChild(this.enemy);
    
    this.game.physics.enable(this.enemy); 

    this.enemy.body.collideWorldBounds = true;
    /*
    this.enemy.body.checkCollision.up = true;
    this.enemy.body.checkCollision.down = true;
    this.enemy.body.immovable = true;
*/
  },
  update: function(){
    this.game.physics.arcade.collide(this.link, this.enemy);

    if(this.game.physics.arcade.collide(this.link, this.enemy)) {
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
  var arrow = new Arrow(PlayScene.game,this.x,this.y,this._velX,this._velY); 
  PlayScene.game.world.addChild(arrow);

  this.canShoot = false;
  PlayScene.game.time.events.add(Phaser.Timer.SECOND  * 1, this.shootCD, this);
}
Hero.prototype.shootCD = function(){
  this.canShoot = true;
}




function Arrow(game,X, Y, VELX, VELY){

  Phaser.Sprite.call(this,game, X, Y, 'link');
   //Arrow physics
   this.game.physics.enable(this);
   this.body.collideWorldBounds = true;
   this.body.bounce.setTo(1, 1);

  //this.vel = 5;
  this.x = X;
  this.y = Y;
  this._velX = VELX;
  this._velY = VELY;

  //Llamamos al timer para destruir
    game.time.events.add(Phaser.Timer.SECOND * 1, this.arrowdestroy, this);
};
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
