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
    this.game.load.spritesheet('hearts', '/images/hearts.png', 8, 8, 3);

    this.game.load.atlas('cyclopsAnimations', '/images/cyclopsspritesheet.png', '/images/cyclopsspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('heroAnimations', '/images/herospritesheet.png', '/images/herospritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('enemyAnimations', '/images/enemyspritesheet.png', '/images/enemyspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('swordAnimations', '/images/swordspritesheet.png', '/images/swordspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //Load map
    //Here we'll load the tilemap data. The first parameter is a unique key for the map data.

    //  The second is a URL to the JSON file the map data is stored in. This is actually optional, you can pass the JSON object as the 3rd
    //  parameter if you already have it loaded. In which case pass 'null' as the URL and
    //  the JSON object as the 3rd parameter.

    //  The final one tells Phaser the foramt of the map data, in this case it's a JSON file exported from the Tiled map editor.
    //  This could be Phaser.Tilemap.CSV too.

    this.game.load.tilemap('map', '/mapas/EastPalace1.json',null, Phaser.Tilemap.TILED_JSON);
    
    //  Next we load the tileset. This is just an image, loaded in via the normal way we load images:
    
    this.game.load.image('tiles', '/mapas/TileSet32.png');
    this.game.load.image('objetos', '/mapas/TileSet16.png');
  },

  create: function () {
    //Comienza la musica
    this.music = this.game.add.audio('theme');
    this.music.play();

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
