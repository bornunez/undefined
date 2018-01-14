'use strict';

var PlayScene = require('./play_scene.js');

var BootScene = {
  preload: function () {
    // load here assets required for the loading screen

  },

  create: function () {

    //Start the physics system
    //game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    //this.game.load.baseURL = 'https://bornunez.github.io/undefined/src';
    
    //this.game.load.crossOrigin = 'anonymous';

    //Carga el tema principal
    this.game.load.audio('theme', '/music/theme.mp3');


    //Cargar de json key - ruta 
    this.game.load.image('skeleton', '/images/skeleton.png');
    this.game.load.image('trigger','/images/trigger.png');
    this.game.load.image('door','/images/Puertas.png');
    this.game.load.image('HUD', '/images/HUD.png');
    this.game.load.image('arrow', '/images/arrow.png');
    this.game.load.image('itembox', '/images/itembox.png');
    this.game.load.image('arrowicon', '/images/arrowicon.png');
    this.game.load.image('rublos', '/images/rublos.png');
    this.game.load.image('playButton','/images/playButton.png');
    this.game.load.image('inventory','/images/inventory.png');
    this.game.load.spritesheet('hearts', '/images/hearts.png', 8, 8, 3);

    this.game.load.atlas('bossAnimations', '/images/bossspritesheet.png', '/images/bossspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('cyclopsAnimations', '/images/cyclopsspritesheet.png', '/images/cyclopsspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('heroAnimations', '/images/herospritesheet.png', '/images/herospritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('enemyAnimations', '/images/enemyspritesheet.png', '/images/enemyspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('swordAnimations', '/images/swordspritesheet.png', '/images/swordspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
   

    this.game.load.tilemap('map', '/mapas/EastPalace1.json',null, Phaser.Tilemap.TILED_JSON);
  
    this.game.load.image('tiles', '/mapas/TileSet32.png');
    this.game.load.image('objetos', '/mapas/TileSet16.png');
  },

  create: function () {
    //Comienza la musica
    this.music = this.game.add.audio('theme');
    this.music.play();
    this.game.state.start('introMenu');
  }
};

var IntroMenu = {
  preload: function(){
    this.game.load.image('introBG','./images/intro.png');
  },
  create:function(){
    var background  = this.game.add.sprite(0,0,'introBG');
    background.smoothed = false;
    background.width = this.game.stage.width
    background.height =this.game.stage.height;

    var button = this.game.add.button(0,0, 'playButton', this.actionOnClick, this);
    button.anchor.setTo(0.5, 0.5);
    button.x = this.game.world.centerX;
    button.y = this.game.world.centerY + 50;
    button.smoothed = false;
  },
  actionOnClick: function () {
    this.game.state.start('play');
    }
}
window.onload = function () {
  var game = new Phaser.Game(1080, 720, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('introMenu',IntroMenu);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};
