'use strict';
var Character = require('./character.js');
var Boss = require('./boss.js');

const NUM_POINTS = 2;
const NUM_BOSS = 1;
const BOSS_VEL = 300;


function BossArmy(game, x, y, target, MAPSCALE, health,damage,spriteName){
    this.game = game; 
    this.target = target;
    this.pointNumber = 0;

    this.points = {
      'x': [ this.target.x, this.target.x+200],
      'y': [ this.target.y, this.target.y+200 ]
      };

 
      this.bosses = this.game.add.group();

      for(var i = 0; i < NUM_BOSS; i++) {
        var boss =  new Boss(this.game, this.target.x+60 + (i*100), this.target.y- (i*100), target, MAPSCALE, BOSS_VEL, 1, 1, 'bossAnimations'); 
        this.bosses.add(boss);
    }
}

//Herencia
BossArmy.prototype =  Object.create(Phaser.Sprite.prototype);
BossArmy.prototype.constructor = Boss;

BossArmy.prototype.update = function(){
  this.game.debug.body(this);

}


module.exports = BossArmy;