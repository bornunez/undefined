'use strict';

function Layer(game,layerName){
    this = game.map.createLayer(layerName);
    this.smoothed = false;
    this.scale.set(3);
}
module.exports = WorldLayer;