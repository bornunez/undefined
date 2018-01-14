'use strict';
var Character = require('./character.js');
var Boss = require('./boss.js');

const NUM_POINTS = 6;
const NUM_BOSS = 6;
const BOSS_VEL = 300;


function BossArmy(game, x, y, target, MAPSCALE, health,damage,spriteName){
    this.game = game; 
    this.target = target;
    this.pointNumber = 0;
    this.points =new Array(); 
    this.bosses = this.game.add.group();
}

//Herencia
BossArmy.prototype =  Object.create(Phaser.Sprite.prototype);
BossArmy.prototype.constructor = Boss;

BossArmy.prototype.create = function(){
  this.points.forEach(function(element) {
    var boss =  new Boss(this.game, element.x*this.MAPSCALE, element.y*this.MAPSCALE, this.target, this.MAPSCALE, BOSS_VEL, 1, 1, 'bossAnimations'); 
    this.bosses.add(boss);
      }, this);
    this.game.world.bringToTop(this.bosses);
}

BossArmy.prototype.update = function(){
  this.game.debug.body(this);

}


module.exports = BossArmy;