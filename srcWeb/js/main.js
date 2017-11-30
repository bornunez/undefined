'use strict';



var BootScene = {
  preload: function () {

  },

  create: function () {

    //Start the physics system
    //game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {

    this.game.load.baseURL = 'https://bornunez.github.io/PruebaWeb/undefined-Fisicas/src';
  
    this.game.load.crossOrigin = 'anonymous';
    this.game.load.image('link', '/images/link.png');
    this.game.load.image('skeleton', '/images/skeleton.png');


    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },

  create: function () {
    this.game.state.start('play');
  }
};


window.onload = function () {
  var game = new Phaser.Game(1080, 720, Phaser.AUTO, 'game');



  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');

  
};
