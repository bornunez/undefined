'use strict';
var Character = require('./character.js');
const NUM_POINTS = 6;

function Boss(game,x,y, target, vel,health,damage, points, spriteName, pointNumber){
    this.game = game; 
    this.target = target;
    this.pointNumber = pointNumber;
    Character.call(this,this.game, spriteName, x, y, 1, 0, 1);
    this.body.setSize(32, 32, 0, 16);
    this.focus = false;
    this.invulnerable = true;
    this.enragePoint = {
      'x': [],
      'y': []
      };
    this.path ="first";
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
  //this.game.debug.body(this);

  if (this.game.bosses.length < 2) {
    this.enrageMode();
  }
  else 
    this.move();
}


Boss.prototype.move = function() {
  if(this.x != this.points[this.pointNumber].x  || this.y != this.points[this.pointNumber].y) {
    this.game.time.events.add(Phaser.Timer.SECOND  * 1, this.goToPoint, this);
  }
  else {
    this.pointNumber++;
    if(this.pointNumber >= NUM_POINTS)
      this.pointNumber = 0;
  }
}

Boss.prototype.goToPoint = function() {
  if(this.x < this.points[this.pointNumber].x)
    this.x++;
  else if(this.x > this.points[this.pointNumber].x)
    this.x--;

  if(this.y < this.points[this.pointNumber].y)
    this.y++;
  else if(this.y > this.points[this.pointNumber].y)
    this.y--;
}

Boss.prototype.enrageMode = function() {
  if(!this.focus) {
    this.animations.play('bossEnraged'); 
    this.enragePoint.x = this.target.x;
    this.enragePoint.y = this.target.y;
    this.focus = true;
  }

  if(this.x < this.enragePoint.x)
    this.x +=4;
  else if(this.x >  this.enragePoint.x)
    this.x -=4;

  if(this.y <  this.enragePoint.y)
    this.y +=4;
  else if(this.y >  this.enragePoint.y)
    this.y -=4;


    if(this.x < this.enragePoint.x+10 && this.x > this.enragePoint.x-10  && this.y < this.enragePoint.y +10 && this.y > this.enragePoint.y -10 && this.invulnerable) {
      this.invulnerable = false;
      this.animations.play('bossHit');
      this.animations.currentAnim.onComplete.add(this.hit, this);
    }

    //Version para hacerlo con velocidad
    /*
  if(this.x === this.enragePoint.x  && this.y === this.enragePoint.y && this.invulnerable) {
    this.invulnerable = false;
    this.animations.play('bossHit');
    this.animations.currentAnim.onComplete.add(this.hit, this);
  }
  */
}


Boss.prototype.hit = function() {
  this.body.enable = true; 
  this.game.time.events.add(Phaser.Timer.SECOND  * 2, this.resetFocus, this);
}

//error aqui al matar al boss
Boss.prototype.resetFocus = function() {
  if(this != undefined && this.body != null) {
    this.body.enable = false;
    this.animations.play('bossEnraged'); 
    this.focus = false; 
    this.invulnerable = true;
  }
}

module.exports = Boss;